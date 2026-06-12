"use client"

// DB sync helpers. All calls use the browser client (anon key + RLS).
// Errors are logged but not thrown so the UI stays responsive offline.

import { createClient } from "@/lib/supabase/client"
import type { AppState, CompanyId, CompanyProgress, Mistake, Profile } from "@/lib/types"

// ─── row shapes ──────────────────────────────────────────────────────────────
// Hand-typed mirrors of the `supabase/migrations` tables. `select("*")` otherwise
// hands back implicitly-`any` rows, so every field read below would be unchecked.

interface ProfileRow {
  id: string
  name: string | null
  college: string | null
  branch: string | null
  grad_year: string | null
  cgpa: string | null
  backlogs: string | null
}

interface UserStateRow {
  id: string
  xp: number
  streak_count: number
  streak_last_active: string | null
  premium: boolean
  premium_until: string | null
  primary_company: CompanyId
  interested: CompanyId[] | null
  onboarded: boolean
  topic_stats: AppState["topicStats"] | null
  badges: string[] | null
  coding_attempts: AppState["codingAttempts"] | null
}

interface CompanyProgressRow {
  user_id: string
  company_id: CompanyId
  chapters: CompanyProgress["chapters"] | null
  mock_scores: number[] | null
}

interface DailyRow {
  id: string
  date: string | null
  general: boolean | null
  aptitude: boolean | null
  coding: boolean | null
}

interface MistakeRow {
  user_id: string
  question_id: string
  prompt: string
  options: Mistake["options"]
  answer: number
  chosen: number
  explanation: string
  topic: string
  difficulty: string
  ts: number
}

const SYNC_ERROR_EVENT = "studybench:sync-error"

async function safe(label: string, fn: () => PromiseLike<unknown> | unknown) {
  try {
    await fn()
  } catch (err) {
    console.warn("[supabase/db]", label, err)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(SYNC_ERROR_EVENT, { detail: { label } }))
    }
  }
}

export async function loadUserState(userId: string): Promise<Partial<AppState> | null> {
  const sb = createClient()

  const [profRes, stRes, cpRes, dailyRes, mistakesRes] = await Promise.all([
    sb.from("profiles").select("*").eq("id", userId).maybeSingle(),
    sb.from("user_state").select("*").eq("id", userId).maybeSingle(),
    sb.from("company_progress").select("*").eq("user_id", userId),
    sb.from("daily_challenges").select("*").eq("id", userId).maybeSingle(),
    sb.from("mistakes").select("*").eq("user_id", userId).order("ts", { ascending: false }).limit(60),
  ])

  const prof = profRes.data as ProfileRow | null
  const st = stRes.data as UserStateRow | null
  const cpRows = (cpRes.data ?? []) as CompanyProgressRow[]
  const daily = dailyRes.data as DailyRow | null
  const mistakeRows = (mistakesRes.data ?? []) as MistakeRow[]

  if (!st) return null

  const progress: AppState["progress"] = {}
  for (const row of cpRows ?? []) {
    progress[row.company_id] = {
      chapters: row.chapters ?? {},
      mockScores: row.mock_scores ?? [],
    }
  }

  const mistakes: AppState["mistakes"] = mistakeRows.map((r) => ({
    questionId: r.question_id,
    prompt: r.prompt,
    options: r.options,
    answer: r.answer,
    chosen: r.chosen,
    explanation: r.explanation,
    topic: r.topic,
    difficulty: r.difficulty as AppState["mistakes"][number]["difficulty"],
    ts: r.ts,
  }))

  return {
    onboarded: st.onboarded,
    premium: st.premium,
    premiumUntil: st.premium_until ?? undefined,
    xp: st.xp,
    streak: { count: st.streak_count, lastActive: st.streak_last_active ?? "" },
    primary: st.primary_company,
    interested: st.interested ?? [],
    badges: st.badges ?? [],
    topicStats: st.topic_stats ?? {},
    codingAttempts: st.coding_attempts ?? [],
    mistakes,
    progress,
    ...(prof
      ? {
          profile: {
            name: prof.name ?? "",
            college: prof.college ?? "",
            branch: prof.branch ?? "",
            gradYear: prof.grad_year ?? "",
            cgpa: prof.cgpa ?? "",
            backlogs: prof.backlogs ?? "",
          },
        }
      : {}),
    ...(daily
      ? {
          daily: {
            date: daily.date ?? "",
            general: daily.general ?? false,
            aptitude: daily.aptitude ?? false,
            coding: daily.coding ?? false,
          },
        }
      : {}),
  }
}

export async function ensureUserState(userId: string, s: AppState) {
  await safe("ensureUserState", async () => {
    const sb = createClient()
    await sb.from("user_state").upsert({
      id: userId,
      xp: s.xp,
      streak_count: s.streak.count,
      streak_last_active: s.streak.lastActive,
      premium: s.premium,
      premium_until: s.premiumUntil ?? null,
      primary_company: s.primary,
      interested: s.interested,
      onboarded: s.onboarded,
      topic_stats: s.topicStats,
      badges: s.badges,
      coding_attempts: s.codingAttempts,
    })
    await sb.from("daily_challenges").upsert({
      id: userId,
      date: s.daily.date,
      general: s.daily.general,
      aptitude: s.daily.aptitude,
      coding: s.daily.coding,
    })
  })
}

export function syncProfile(userId: string, p: Profile) {
  void safe("syncProfile", () =>
    createClient()
      .from("profiles")
      .upsert({
        id: userId,
        name: p.name,
        college: p.college,
        branch: p.branch,
        grad_year: p.gradYear,
        cgpa: p.cgpa,
        backlogs: p.backlogs,
      }),
  )
}

export function syncUserState(userId: string, s: AppState) {
  void safe("syncUserState", () =>
    createClient()
      .from("user_state")
      .upsert({
        id: userId,
        xp: s.xp,
        streak_count: s.streak.count,
        streak_last_active: s.streak.lastActive,
        premium: s.premium,
        premium_until: s.premiumUntil ?? null,
        primary_company: s.primary,
        interested: s.interested,
        onboarded: s.onboarded,
        topic_stats: s.topicStats,
        badges: s.badges,
        coding_attempts: s.codingAttempts,
      }),
  )
}

export function syncCompanyProgress(userId: string, companyId: string, s: AppState) {
  const prog = s.progress[companyId]
  if (!prog) return
  void safe("syncCompanyProgress", () =>
    createClient()
      .from("company_progress")
      .upsert(
        {
          user_id: userId,
          company_id: companyId,
          chapters: prog.chapters,
          mock_scores: prog.mockScores,
        },
        { onConflict: "user_id,company_id" },
      ),
  )
}

export function syncDaily(userId: string, s: AppState) {
  void safe("syncDaily", () =>
    createClient()
      .from("daily_challenges")
      .upsert({
        id: userId,
        date: s.daily.date,
        general: s.daily.general,
        aptitude: s.daily.aptitude,
        coding: s.daily.coding,
      }),
  )
}

/**
 * Upsert a single mistake. Called immediately after recordMistake() so the DB
 * stays in sync even if the user closes the tab before a full syncAll() fires.
 */
export function syncOneMistake(userId: string, m: Mistake) {
  void safe("syncOneMistake", () =>
    createClient()
      .from("mistakes")
      .upsert(
        {
          user_id: userId,
          question_id: m.questionId,
          prompt: m.prompt,
          options: m.options,
          answer: m.answer,
          chosen: m.chosen,
          explanation: m.explanation,
          topic: m.topic,
          difficulty: m.difficulty,
          ts: m.ts,
        },
        { onConflict: "user_id,question_id" },
      ),
  )
}

/**
 * Delete a single mistake row. Called when the student clears one mistake.
 */
export function deleteMistake(userId: string, questionId: string) {
  void safe("deleteMistake", () =>
    createClient()
      .from("mistakes")
      .delete()
      .eq("user_id", userId)
      .eq("question_id", questionId),
  )
}

/**
 * Delete all mistakes for a user. Called on clearMistakes() and account reset.
 */
export function deleteAllMistakes(userId: string) {
  void safe("deleteAllMistakes", () =>
    createClient().from("mistakes").delete().eq("user_id", userId),
  )
}

export function syncAll(userId: string, s: AppState) {
  syncProfile(userId, s.profile)
  syncUserState(userId, s)
  syncDaily(userId, s)
  for (const companyId of Object.keys(s.progress)) {
    syncCompanyProgress(userId, companyId, s)
  }
}

// ─── question reports (admin review queue) ───────────────────────────────────

/** Persist a student's report of a problematic question (RLS-protected). */
export async function reportQuestion(questionId: string, prompt: string, reason?: string) {
  const sb = createClient()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return // not signed in — nothing to persist
  await safe("reportQuestion", () =>
    sb.from("question_reports").insert({
      user_id: user.id,
      question_id: questionId,
      prompt: prompt.slice(0, 500),
      reason: reason ?? null,
    }),
  )
}
