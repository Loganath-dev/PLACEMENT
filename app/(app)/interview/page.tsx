"use client"

import Link from "next/link"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { PageHeader } from "@/components/app/page-header"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { CompanyPicker } from "@/components/app/company-picker"
import { FREE_INTERVIEW_LIMIT, lockedCount, visibleForPlan } from "@/lib/access"
import { getCompany } from "@/lib/data/companies"
import { INTERVIEW_CATEGORIES, interviewForCompany } from "@/lib/data/interview"
import {
  INTERVIEW_CATEGORY_LABEL,
  badInterviewAnswer,
  interviewFollowUps,
  shortInterviewAnswer,
} from "@/lib/domain/interview-coaching"
import { useStore } from "@/lib/store"
import type { CompanyId, InterviewCategory, InterviewQuestion } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function InterviewPage() {
  const { state } = useStore()
  const initial = state.primary || "general"
  const [company, setCompany] = React.useState<CompanyId>(initial)
  const [cat, setCat] = React.useState<InterviewCategory | "all">("all")

  const c = getCompany(company)
  const all = React.useMemo(() => interviewForCompany(company), [company])
  const list = React.useMemo(
    () => (cat === "all" ? all : all.filter((q) => q.category === cat)),
    [all, cat],
  )
  const visible = React.useMemo(
    () => visibleForPlan(list, state.premium, FREE_INTERVIEW_LIMIT),
    [list, state.premium],
  )
  const hiddenCount = lockedCount(list.length, visible.length)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview prep"
        title="Interview Questions"
        description="Company-wise technical, coding, domain, HR and managerial questions with trainer guidance."
      />

      <CompanyPicker value={company} onChange={setCompany} />

      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <CompanyAvatar id={company} size={40} />
          <div className="flex-1">
            <p className="font-heading font-semibold">{c.name} - interview focus</p>
            <p className="text-sm text-muted-foreground">
              {c.eligibility ? c.eligibility.rounds.join(" -> ") : c.blurb}
            </p>
          </div>
        </CardContent>
      </Card>

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
            <p className="max-w-md text-sm text-muted-foreground">
              Continue with deeper company-wise technical, coding, HR, domain and managerial
              questions.
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
          <span className="rounded-full bg-muted px-2 py-0.5 capitalize text-muted-foreground">
            {q.difficulty}
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
            <div>
              <p className="font-medium">Likely follow-ups</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {interviewFollowUps(q).map((followUp) => (
                  <div key={followUp} className="rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground ring-1 ring-border">
                    {followUp}
                  </div>
                ))}
              </div>
            </div>
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


