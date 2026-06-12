"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { PageHeader } from "@/components/app/page-header"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { CompanyPicker } from "@/components/app/company-picker"
import { FREE_INTERVIEW_LIMIT, lockedCount, visibleForPlan } from "@/lib/access"
import { COMPANY_BY_ID, getCompany } from "@/lib/data/companies"
import { INTERVIEW_CATEGORIES, interviewForCompany } from "@/lib/data/interview"
import {
  INTERVIEW_CATEGORY_LABEL,
  badInterviewAnswer,
  shortInterviewAnswer,
} from "@/lib/domain/interview-coaching"
import { useStore } from "@/lib/store"
import type { CompanyId, InterviewCategory, InterviewQuestion } from "@/lib/types"
import { cn } from "@/lib/utils"

type DifficultyFilter = "all" | "easy" | "medium" | "hard"

export default function InterviewPage() {
  const { state } = useStore()
  const searchParams = useSearchParams()
  const queryCompany = companyFromParam(searchParams.get("company"))
  const [selectedCompany, setSelectedCompany] = React.useState<CompanyId | null>(null)
  const [cat, setCat] = React.useState<InterviewCategory | "all">("all")
  const [difficulty, setDifficulty] = React.useState<DifficultyFilter>("all")
  const [simMode, setSimMode] = React.useState(false)
  const company = selectedCompany ?? queryCompany ?? state.primary ?? "general"

  const c = getCompany(company)
  const all = React.useMemo(() => interviewForCompany(company), [company])
  const list = React.useMemo(() => {
    let next = all
    if (cat !== "all") next = next.filter((q) => q.category === cat)
    if (difficulty !== "all") next = next.filter((q) => q.difficulty === difficulty)
    return next
  }, [all, cat, difficulty])

  const visible = React.useMemo(
    () => visibleForPlan(list, state.premium, FREE_INTERVIEW_LIMIT),
    [list, state.premium],
  )
  const hiddenCount = lockedCount(list.length, visible.length)

  if (simMode) {
    return (
      <SimulationMode
        questions={visible}
        company={company}
        onExit={() => setSimMode(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview prep"
        title="Interview Questions"
        description="Company-wise technical, coding, domain, HR and managerial questions with trainer guidance."
        actions={
          visible.length >= 3 ? (
            <Button onClick={() => setSimMode(true)}>
              <Icon name="PlayCircle" className="size-4" /> Simulate interview
            </Button>
          ) : undefined
        }
      />

      <CompanyPicker
        value={company}
        onChange={(id) => {
          setSelectedCompany(id)
          setCat("all")
          setDifficulty("all")
        }}
      />

      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <CompanyAvatar id={company} size={40} />
          <div className="flex-1">
            <p className="font-heading font-semibold">{c.name} — interview focus</p>
            <p className="text-sm text-muted-foreground">
              {c.eligibility ? c.eligibility.rounds.join(" → ") : c.blurb}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <CatPill active={cat === "all"} onClick={() => setCat("all")} label="All" />
        {INTERVIEW_CATEGORIES.map((k) => (
          <CatPill
            key={k.id}
            active={cat === k.id}
            onClick={() => setCat(k.id)}
            label={k.label}
          />
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Level:</span>
        {(["all", "easy", "medium", "hard"] as DifficultyFilter[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              difficulty === d
                ? d === "easy"
                  ? "border-success/50 bg-success/10 text-[color:var(--success)]"
                  : d === "medium"
                    ? "border-warning/50 bg-warning/10 text-warning-foreground"
                    : d === "hard"
                      ? "border-destructive/50 bg-destructive/10 text-destructive"
                      : "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-muted/50 text-muted-foreground",
            )}
          >
            {d === "all" ? "All levels" : d === "easy" ? "Beginner" : d === "medium" ? "Intermediate" : "Advanced"}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted-foreground">{list.length} questions</span>
      </div>

      <div className="space-y-3">
        {visible.map((q) => (
          <InterviewItem key={q.id} q={q} />
        ))}
      </div>

      {!state.premium && hiddenCount > 0 ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icon name="Lock" className="size-6" />
            </span>
            <p className="font-heading text-lg font-semibold">
              Unlock complete interview preparation
            </p>
            <p className="max-md text-sm text-muted-foreground">
              Continue with deeper company-wise technical, coding, HR, domain and managerial questions.
            </p>
            <Button asChild className="mt-2">
              <Link href="/settings">
                Go Premium <Icon name="ArrowRight" className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

// ── Simulation Mode ───────────────────────────────────────────────────────────

function SimulationMode({
  questions,
  company,
  onExit,
}: {
  questions: InterviewQuestion[]
  company: CompanyId
  onExit: () => void
}) {
  const c = getCompany(company)
  const pool = React.useMemo(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(5, shuffled.length))
  }, [questions])

  const [index, setIndex] = React.useState(0)
  const [answer, setAnswer] = React.useState("")
  const [revealed, setRevealed] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const current = pool[index]

  function next() {
    if (index + 1 >= pool.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setAnswer("")
      setRevealed(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-success/15 text-[color:var(--success)]">
              <Icon name="Trophy" className="size-8" />
            </span>
            <div>
              <p className="font-heading text-2xl font-bold">Simulation complete</p>
              <p className="mt-1 text-muted-foreground">
                You practised {pool.length} {c.short} interview questions. Compare your answers above.
              </p>
            </div>
            <Button onClick={onExit}>
              Back to question bank <Icon name="ArrowRight" className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Icon name="ChevronRight" className="size-4 rotate-180" /> Exit simulation
        </button>
        <span className="text-sm text-muted-foreground">
          Question <span className="font-semibold text-foreground">{index + 1}</span> / {pool.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${((index + (revealed ? 1 : 0)) / pool.length) * 100}%` }}
        />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              {INTERVIEW_CATEGORY_LABEL[current.category]}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 capitalize text-muted-foreground">
              {current.difficulty}
            </span>
            {current.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-muted-foreground">#{t}</span>
            ))}
          </div>

          <p className="font-heading text-lg font-semibold leading-snug">{current.question}</p>

          {!revealed ? (
            <>
              <div>
                <p className="mb-1.5 text-sm font-medium">Your answer</p>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  placeholder="Think it through, then write your answer here…"
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {answer.trim().length < 10
                    ? `${Math.max(0, 10 - answer.trim().length)} more characters to unlock submit`
                    : "Ready to submit"}
                </p>
              </div>
              {answer.trim().length >= 10 && (
                <Button onClick={() => setRevealed(true)} className="w-full">
                  Submit answer <Icon name="ArrowRight" className="size-4" />
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your answer</p>
                <p className="text-foreground/80 italic">{answer}</p>
              </div>

              <div className="space-y-3 rounded-xl bg-primary/5 p-4 text-sm">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">Trainer answer</p>
                  <p className="leading-relaxed text-foreground/85">{current.guidance}</p>
                </div>
                <div className="border-t border-border/50 pt-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Short version</p>
                  <p className="text-muted-foreground">{shortInterviewAnswer(current)}</p>
                </div>
                <div className="rounded-lg bg-destructive/5 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-destructive">Do not say</p>
                  <p className="text-muted-foreground">{badInterviewAnswer(current)}</p>
                </div>
              </div>

              <Button onClick={next} className="w-full">
                {index + 1 >= pool.length ? "Finish simulation" : "Next question"}
                <Icon name="ArrowRight" className="size-4" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function companyFromParam(value: string | null): CompanyId | null {
  if (!value || !(value in COMPANY_BY_ID)) return null
  return value as CompanyId
}

function CatPill({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted/50",
      )}
    >
      {label}
    </button>
  )
}

function InterviewItem({ q }: { q: InterviewQuestion }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            {INTERVIEW_CATEGORY_LABEL[q.category]}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 capitalize font-medium",
              q.difficulty === "easy"
                ? "bg-success/10 text-[color:var(--success)]"
                : q.difficulty === "medium"
                  ? "bg-warning/10 text-warning-foreground"
                  : "bg-destructive/10 text-destructive",
            )}
          >
            {q.difficulty === "easy" ? "Beginner" : q.difficulty === "medium" ? "Intermediate" : "Advanced"}
          </span>
          {q.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
        <p className="font-medium">{q.question}</p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex rounded-lg px-2 py-1 text-sm font-medium hover:bg-muted/60"
        >
          {open ? "Hide trainer answer" : "Show trainer answer"}
        </button>
        {open ? (
          <div className="space-y-3 rounded-xl bg-muted/60 p-3 text-sm">
            <AnswerBlock title="Natural answer" text={q.guidance} />
            <AnswerBlock title="Short version" text={shortInterviewAnswer(q)} />
            <AnswerBlock title="Do not say" text={badInterviewAnswer(q)} muted />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function AnswerBlock({
  title,
  text,
  muted = false,
}: {
  title: string
  text: string
  muted?: boolean
}) {
  return (
    <div>
      <p className="font-medium">{title}</p>
      <p className={cn("mt-1 leading-relaxed", muted ? "text-muted-foreground" : "text-foreground/80")}>
        {text}
      </p>
    </div>
  )
}
