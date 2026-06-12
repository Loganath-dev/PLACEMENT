"use client"

import * as React from "react"
import type { Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import {
  deleteAllMistakes,
  deleteMistake,
  ensureUserState,
  loadUserState,
  syncAll,
  syncCompanyProgress,
  syncDaily,
  syncOneMistake,
  syncProfile,
  syncUserState,
} from "@/lib/supabase/db"
import type { AppState, CodingAttempt, CompanyId, Profile, Question, SectionId } from "@/lib/types"
import { levelFromXP, XP } from "@/lib/scoring"

const MISTAKE_CAP = 60

const STORAGE_KEY = "studybench.state.v1"
const LEGACY_STORAGE_KEY = "placeready.state.v1"

const DEFAULT_STATE: AppState = {
  onboarded: false,
  premium: false,
  premiumUntil: undefined,
  profile: { name: "", college: "", branch: "", gradYear: "", cgpa: "", backlogs: "" },
  interested: [],
  primary: "general",
  xp: 0,
  streak: { count: 0, lastActive: "" },
  badges: [],
  progress: {},
  topicStats: {},
  daily: { date: "", general: false, aptitude: false, coding: false },
  codingAttempts: [],
  mistakes: [],
}

function normalizeEntitlement(state: AppState): AppState {
  if (!state.premium || !state.premiumUntil) return state
  const expiresAt = Date.parse(state.premiumUntil)
  if (!Number.isFinite(expiresAt) || expiresAt > Date.now()) return state
  return { ...state, premium: false, premiumUntil: undefined }
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}
function yesterday(d: string): string {
  const dt = new Date(d + "T00:00:00")
  dt.setDate(dt.getDate() - 1)
  return dt.toISOString().slice(0, 10)
}

function ensureProgress(state: AppState, id: CompanyId) {
  const existing = state.progress[id]
  if (!existing) {
    state.progress[id] = { chapters: {}, mockScores: [] }
  } else {
    // Shallow-clone this company's progress so mutations don't bleed into prev state.
    state.progress[id] = {
      chapters: { ...existing.chapters },
      mockScores: [...existing.mockScores],
    }
  }
  return state.progress[id]
}

function bumpStreak(state: AppState): number {
  const t = today()
  let milestoneXp = 0
  if (state.streak.lastActive === t) return 0
  const prev = state.streak.count
  const count = state.streak.lastActive === yesterday(t) ? prev + 1 : 1
  state.streak = { count, lastActive: t }
  if (count === 7 && prev < 7) milestoneXp = XP.streak7
  if (count === 30 && prev < 30) milestoneXp = XP.streak30
  if (count === 100 && prev < 100) milestoneXp = XP.streak100
  state.xp += milestoneXp
  return milestoneXp
}

function applyTopics(
  state: AppState,
  results: { topic: string; correct: boolean }[],
) {
  for (const r of results) {
    const prev = state.topicStats[r.topic]
    // Always create a new object so shallow-cloned topicStats doesn't share refs with prev state.
    state.topicStats[r.topic] = {
      correct: (prev?.correct ?? 0) + (r.correct ? 1 : 0),
      total: (prev?.total ?? 0) + 1,
    }
  }
}

export interface QuizResult {
  score: number
  passed: boolean
  xpGained: number
  newlyPassed: boolean
}

// ── Context shapes ──────────────────────────────────────────────────────────

interface StoreStateValue {
  state: AppState
  hydrated: boolean
  userId: string | null
}

interface StoreActionsValue {
  completeOnboarding: (p: Profile, interested: CompanyId[], primary: CompanyId) => void
  setPrimary: (id: CompanyId) => void
  addInterested: (id: CompanyId) => void
  removeInterested: (id: CompanyId) => void
  activatePremium: (premiumUntil?: string) => void
  updateProfile: (p: Partial<Profile>) => void
  submitQuiz: (args: {
    companyId: CompanyId
    sectionId: SectionId
    chapterId: string
    results: { topic: string; correct: boolean }[]
  }) => QuizResult
  skipChapter: (companyId: CompanyId, chapterId: string) => void
  submitDaily: (
    category: "general" | "aptitude" | "coding",
    results: { topic: string; correct: boolean }[],
  ) => { xpGained: number }
  submitMock: (companyId: CompanyId, score: number) => { xpGained: number }
  recordCodingAttempt: (attempt: CodingAttempt) => void
  recordMistake: (q: Question, chosen: number) => void
  clearMistake: (questionId: string) => void
  clearMistakes: () => void
  reset: () => void
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

// StoreContext re-exports both shapes for the backward-compatible useStore() hook.
type StoreContextValue = StoreStateValue & StoreActionsValue

// ── Contexts ────────────────────────────────────────────────────────────────

const StoreStateContext = React.createContext<StoreStateValue | null>(null)

// Actions context is intentionally never null after mount; stable identity
// means any component subscribed only to actions never re-renders on state changes.
const StoreActionsContext = React.createContext<StoreActionsValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────────────────

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = React.useState(false)
  const [userId, setUserId] = React.useState<string | null>(null)

  // ── hydrate: localStorage first (fast), then Supabase (authoritative) ──
  React.useEffect(() => {
    async function hydrate() {
      // 1. Restore from localStorage immediately so UI doesn't flash blank.
      try {
        const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
        if (raw) {
          setState(normalizeEntitlement({ ...DEFAULT_STATE, ...JSON.parse(raw) }))
          if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, raw)
            localStorage.removeItem(LEGACY_STORAGE_KEY)
          }
        }
      } catch {
        /* ignore corrupt state */
      }

      // 2. Check Supabase session.
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        // 3. Load authoritative state from Supabase; merge over localStorage.
        try {
          const remote = await loadUserState(user.id)
          if (remote) {
            setState((prev) => normalizeEntitlement({ ...prev, ...remote }))
          } else {
            await ensureUserState(user.id, DEFAULT_STATE)
          }
        } catch {
          /* offline — localStorage fallback stays */
        }
      }

      setHydrated(true)
    }

    void hydrate()

    // 4. Keep userId in sync with auth state changes (sign-in / sign-out).
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUserId(session?.user?.id ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  React.useEffect(() => {
    if (!hydrated || !state.premium || !state.premiumUntil) return
    const expiresAt = Date.parse(state.premiumUntil)
    if (!Number.isFinite(expiresAt)) return
    const delay = Math.max(0, Math.min(expiresAt - Date.now(), 60_000))
    const id = setTimeout(() => {
      setState((prev) => normalizeEntitlement(prev))
    }, delay)
    return () => clearTimeout(id)
  }, [hydrated, state.premium, state.premiumUntil])

  // ── persist to localStorage, debounced so rapid mutations don't thrash ──
  React.useEffect(() => {
    if (!hydrated) return
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        /* quota / private mode */
      }
    }, 400)
    return () => clearTimeout(id)
  }, [state, hydrated])

  // ── mutate helper ──
  const uidRef = React.useRef(userId)
  React.useEffect(() => {
    uidRef.current = userId
  }, [userId])

  // mutate is stable (empty deps) — state is always read via setState(prev => ...)
  const mutate = React.useCallback(
    <T,>(fn: (draft: AppState) => T, syncFn?: (uid: string, next: AppState) => void): T => {
      let out!: T
      let next!: AppState
      setState((prev) => {
        // Targeted shallow clone: top-level primitives copy by spread; every mutable
        // nested collection gets its own new reference so prev state is never mutated.
        // ensureProgress() deep-clones individual company progress on first touch.
        // applyTopics() always writes new { correct, total } objects.
        const draft: AppState = {
          ...prev,
          streak: { ...prev.streak },
          profile: { ...prev.profile },
          progress: { ...prev.progress },
          topicStats: { ...prev.topicStats },
          daily: { ...prev.daily },
          mistakes: prev.mistakes ? [...prev.mistakes] : [],
          codingAttempts: prev.codingAttempts ? [...prev.codingAttempts] : [],
          badges: [...prev.badges],
          interested: [...prev.interested],
        }
        out = fn(draft)
        next = draft
        return draft
      })
      // Fire-and-forget sync to Supabase after state is committed.
      if (syncFn && uidRef.current) {
        const uid = uidRef.current
        // Use a microtask so React has time to commit the new state.
        Promise.resolve().then(() => syncFn(uid, next))
      }
      return out
    },
    [],
  )

  // ── Actions context — deps: [mutate] only, so this is STABLE after mount ──
  const actionsValue = React.useMemo<StoreActionsValue>(
    () => ({
      completeOnboarding: (profile, interested, primary) =>
        mutate(
          (d) => {
            d.profile = profile
            d.interested = interested
            d.primary = primary
            d.onboarded = true
            for (const id of interested) ensureProgress(d, id)
            ensureProgress(d, "general")
          },
          (uid, s) => {
            syncProfile(uid, s.profile)
            syncAll(uid, s)
          },
        ),

      setPrimary: (id) =>
        mutate(
          (d) => {
            d.primary = id
            if (!d.interested.includes(id) && id !== "general") d.interested.push(id)
            ensureProgress(d, id)
          },
          syncUserState,
        ),

      addInterested: (id) =>
        mutate(
          (d) => {
            if (!d.interested.includes(id)) d.interested.push(id)
            ensureProgress(d, id)
          },
          syncUserState,
        ),

      removeInterested: (id) =>
        mutate(
          (d) => {
            d.interested = d.interested.filter((x) => x !== id)
            if (d.primary === id) d.primary = d.interested[0] ?? "general"
          },
          syncUserState,
        ),

      // Local echo after a server-verified payment. The authoritative write
      // already happened in the verify route / webhook via the service role —
      // clients can no longer write entitlement columns (DB trigger).
      activatePremium: (premiumUntil) =>
        mutate((d) => {
          const next = normalizeEntitlement({
            ...d,
            premium: true,
            premiumUntil,
          })
          d.premium = next.premium
          d.premiumUntil = next.premiumUntil
        }),

      updateProfile: (p) =>
        mutate(
          (d) => void Object.assign(d.profile, p),
          (uid, s) => syncProfile(uid, s.profile),
        ),

      submitQuiz: ({ companyId, sectionId, chapterId, results }) =>
        mutate(
          (d): QuizResult => {
            const total = results.length || 1
            const correct = results.filter((r) => r.correct).length
            const score = Math.round((correct / total) * 100)
            const prog = ensureProgress(d, companyId)
            const prev = prog.chapters[chapterId] ?? {
              bestScore: 0,
              passed: false,
              skipped: false,
              attempts: 0,
            }
            const wasPassed = prev.passed
            const bestScore = Math.max(prev.bestScore, score)
            const passed = bestScore >= 70
            prog.chapters[chapterId] = {
              bestScore,
              passed,
              skipped: false,
              attempts: prev.attempts + 1,
            }
            applyTopics(d, results)
            let xpGained = correct * XP.correctFirst
            const newlyPassed = passed && !wasPassed
            if (newlyPassed) xpGained += XP.quizPass
            d.xp += xpGained
            xpGained += bumpStreak(d)
            void sectionId
            return { score, passed, xpGained, newlyPassed }
          },
          (uid, s) => {
            syncCompanyProgress(uid, companyId, s)
            syncUserState(uid, s)
          },
        ),

      skipChapter: (companyId, chapterId) =>
        mutate(
          (d) => {
            const prog = ensureProgress(d, companyId)
            const prev = prog.chapters[chapterId]
            if (prev?.passed) return
            prog.chapters[chapterId] = {
              bestScore: prev?.bestScore ?? 0,
              passed: false,
              skipped: true,
              attempts: prev?.attempts ?? 0,
            }
          },
          (uid, s) => syncCompanyProgress(uid, companyId, s),
        ),

      submitDaily: (category, results) =>
        mutate(
          (d) => {
            const t = today()
            if (d.daily.date !== t)
              d.daily = { date: t, general: false, aptitude: false, coding: false }
            applyTopics(d, results)
            const correct = results.filter((r) => r.correct).length
            let xpGained = correct * XP.correctFirst
            if (!d.daily[category]) {
              d.daily[category] = true
              xpGained += XP.daily
            }
            d.xp += xpGained
            xpGained += bumpStreak(d)
            return { xpGained }
          },
          (uid, s) => {
            syncDaily(uid, s)
            syncUserState(uid, s)
          },
        ),

      submitMock: (companyId, score) =>
        mutate(
          (d) => {
            const prog = ensureProgress(d, companyId)
            prog.mockScores.push(score)
            let xpGained = XP.mock
            d.xp += XP.mock
            xpGained += bumpStreak(d)
            return { xpGained }
          },
          (uid, s) => {
            syncCompanyProgress(uid, companyId, s)
            syncUserState(uid, s)
          },
        ),

      recordCodingAttempt: (attempt) =>
        mutate((d) => {
          d.codingAttempts = [attempt, ...(d.codingAttempts ?? [])].slice(0, 80)
        }, syncUserState),

      recordMistake: (qn, chosen) =>
        mutate(
          (d) => {
            const without = (d.mistakes ?? []).filter((m) => m.questionId !== qn.id)
            const entry = {
              questionId: qn.id,
              prompt: qn.prompt,
              options: qn.options,
              answer: qn.answer,
              chosen,
              explanation: qn.explanation,
              topic: qn.topic,
              difficulty: qn.difficulty,
              ts: Date.now(),
            }
            d.mistakes = [entry, ...without].slice(0, MISTAKE_CAP)
          },
          (uid, s) => {
            // Sync only the new/updated entry — cheaper than a full syncAll.
            const entry = s.mistakes.find((m) => m.questionId === qn.id)
            if (entry) syncOneMistake(uid, entry)
          },
        ),

      clearMistake: (questionId) =>
        mutate(
          (d) => {
            d.mistakes = (d.mistakes ?? []).filter((m) => m.questionId !== questionId)
          },
          (uid) => deleteMistake(uid, questionId),
        ),

      clearMistakes: () =>
        mutate(
          (d) => void (d.mistakes = []),
          (uid) => deleteAllMistakes(uid),
        ),

      reset: () => {
        setState(DEFAULT_STATE)
        if (uidRef.current) syncAll(uidRef.current, DEFAULT_STATE)
      },

      signOut: async () => {
        await createClient().auth.signOut()
        setState(DEFAULT_STATE)
        setUserId(null)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
      },

      deleteAccount: async () => {
        // Server route erases the auth user + all rows with the service-role key.
        try {
          await fetch("/api/account/delete", { method: "POST" })
        } catch {
          /* network — still sign out and clear locally below */
        }
        try {
          await createClient().auth.signOut()
        } catch {
          /* already signed out */
        }
        setState(DEFAULT_STATE)
        setUserId(null)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
      },
    }),
    [mutate],
  )

  // ── State context — re-renders whenever state/hydrated/userId change ──
  const stateValue = React.useMemo<StoreStateValue>(
    () => ({ state, hydrated, userId }),
    [state, hydrated, userId],
  )

  return (
    <StoreActionsContext.Provider value={actionsValue}>
      <StoreStateContext.Provider value={stateValue}>
        {children}
      </StoreStateContext.Provider>
    </StoreActionsContext.Provider>
  )
}

// ── Hooks ────────────────────────────────────────────────────────────────────

/** Read-only state + hydration flag. Re-renders on every state change. */
export function useStoreState(): StoreStateValue {
  const ctx = React.useContext(StoreStateContext)
  if (!ctx) throw new Error("useStoreState must be used within AppStoreProvider")
  return ctx
}

/**
 * Stable action functions — identity never changes after mount.
 * Use this in components that only dispatch mutations and never render state,
 * so they don't re-render when state changes.
 */
export function useStoreActions(): StoreActionsValue {
  const ctx = React.useContext(StoreActionsContext)
  if (!ctx) throw new Error("useStoreActions must be used within AppStoreProvider")
  return ctx
}

/**
 * Backward-compatible hook — returns both state and actions.
 * Existing call sites work unchanged; prefer useStoreState / useStoreActions
 * when a component only needs one of the two.
 */
export function useStore(): StoreContextValue {
  const stateCtx = useStoreState()
  const actionsCtx = useStoreActions()
  // actionsCtx identity is permanently stable after mount; stateCtx only changes
  // when state/hydrated/userId actually change. Memoize the spread so consumers
  // don't receive a new object reference on unrelated parent renders.
  return React.useMemo(() => ({ ...stateCtx, ...actionsCtx }), [stateCtx, actionsCtx])
}

export function useLevel() {
  const { state } = useStoreState()
  return levelFromXP(state.xp)
}
