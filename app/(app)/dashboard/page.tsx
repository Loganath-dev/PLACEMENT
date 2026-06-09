"use client"

import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { PriRing } from "@/components/app/pri-ring"
import {
  CompanyAvatar,
  ProbabilityInputs,
  ProbabilityStat,
  SectionProgressBar,
  ToneBadge,
  UpgradeBanner,
} from "@/components/app/ui-bits"
import { getCompany } from "@/lib/data/companies"
import { getSections } from "@/lib/data/content"
import {
  computePRI,
  EMPTY_PROGRESS,
  expectedPriGain,
  placementProbability,
  priBand,
  probabilityBand,
  sectionMastery,
  weakestTopics,
} from "@/lib/scoring"
import { useStore } from "@/lib/store"
import type { CompanyId } from "@/lib/types"
import { cn } from "@/lib/utils"

function nextChapter(companyId: CompanyId, progress = EMPTY_PROGRESS) {
  for (const section of getSections(companyId)) {
    for (const ch of section.chapters) {
      if (!progress.chapters[ch.id]?.passed) {
        return { section, chapter: ch }
      }
    }
  }
  return null
}

export default function DashboardPage() {
  const { state, setPrimary } = useStore()
  const primary = state.primary
  const company = getCompany(primary)
  const progress = state.progress[primary] ?? EMPTY_PROGRESS
  const pri = computePRI(primary, progress)
  const prob = placementProbability(primary, pri)
  const next = nextChapter(primary, progress)
  const weakest = weakestTopics(state, 1)[0]
  const nextMinutes = next
    ? next.chapter.lessons.reduce((m, l) => m + l.minutes, 0) + next.chapter.quiz.length
    : 0
  const nextGain = next ? expectedPriGain(primary, next.chapter.id, progress) : 0

  const others = state.interested.filter((id) => id !== primary)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {greeting()}, {state.profile.name?.split(" ")[0] || "there"}
          </p>
          <h1 className="font-heading text-2xl font-bold md:text-3xl">
            Your placement command center
          </h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/readiness">
            <Icon name="TrendingUp" className="size-4" /> Full readiness
          </Link>
        </Button>
      </div>

      {!state.premium && <UpgradeBanner />}

      <TodayTasksCard />

      <PlacementRoadmap />

      {/* Primary focus */}
      <Card className="overflow-hidden duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center justify-center gap-3 md:border-r md:border-border md:pr-6">
            <div className="flex items-center gap-2">
              <CompanyAvatar id={primary} size={28} />
              <span className="font-heading font-semibold">{company.short}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Primary
              </span>
            </div>
            <PriRing value={pri} tone={priBand(pri).tone} />
            <ProbabilityStat value={prob} band={probabilityBand(prob)} />
            <ToneBadge band={priBand(pri)} />
            <ProbabilityInputs companyId={primary} progress={progress} compact />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">Continue preparing</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/learn/${primary}`}>
                  View track <Icon name="ChevronRight" className="size-4" />
                </Link>
              </Button>
            </div>

            {next ? (
              <div className="rounded-xl border border-primary/20 bg-[linear-gradient(135deg,var(--accent),transparent)] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <Icon name={next.section.icon} className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      Do this now - {next.section.short}
                    </p>
                    <p className="mt-0.5 line-clamp-2 font-heading text-lg font-semibold leading-snug">
                      {next.chapter.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 font-medium text-muted-foreground ring-1 ring-border">
                        <Icon name="Clock" className="size-3.5" /> ~{Math.max(5, nextMinutes)} min
                      </span>
                      {nextGain > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 font-medium text-[color:var(--success)]">
                          <Icon name="TrendingUp" className="size-3.5" /> +{nextGain} PRI when you pass
                        </span>
                      ) : null}
                    </div>
                    {weakest ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Targets your weakest area so far:{" "}
                        <span className="font-medium text-foreground">{weakest.topic}</span> (
                        {weakest.accuracy}%)
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4">
                  <StartNowButton
                    href={`/learn/${primary}/${next.section.id}/${next.chapter.id}`}
                    label="Start now"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Trophy" className="size-6 text-[color:var(--success)]" />
                  <p className="font-medium">
                    You&apos;ve cleared every chapter for {company.short}. Put it to the test.
                  </p>
                </div>
                <StartNowButton href="/mock" label="Take a mock" />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {getSections(primary).map((s) => (
                <SectionProgressBar
                  key={s.id}
                  label={s.short}
                  icon={s.icon}
                  value={sectionMastery(primary, s.id, progress)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily challenge + Other companies */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DailyCard />
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="font-heading text-base">Your other companies</CardTitle>
            <Link href="/readiness" className="text-sm text-primary hover:underline">
              Compare all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {others.length === 0 ? (
              <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                You&apos;re only tracking one company.{" "}
                <Link href="/settings" className="text-primary hover:underline">
                  Add more
                </Link>{" "}
                to compare readiness.
              </div>
            ) : (
              others.map((id) => {
                const p = state.progress[id] ?? EMPTY_PROGRESS
                const cp = computePRI(id, p)
                const pr = placementProbability(id, cp)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setPrimary(id)
                      toast.success(`Switched focus to ${getCompany(id).short}`)
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <CompanyAvatar id={id} size={38} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{getCompany(id).short}</p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${cp}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold tabular-nums">{cp}</p>
                      <p
                        className="text-xs text-muted-foreground"
                        title={`Estimate inputs: PRI ${cp}/100, target ${getCompany(id).cutoffPRI}, mock average based on saved mocks only.`}
                      >
                        ~{pr}% est.
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* All tracks */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">All tracks</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/learn">
              Open Learn <Icon name="ChevronRight" className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(["general", "tcs", "infosys", "wipro", "accenture", "zoho", "cognizant"] as CompanyId[]).map(
            (id) => {
              const p = state.progress[id] ?? EMPTY_PROGRESS
              const cp = computePRI(id, p)
              return (
                <Link
                  key={id}
                  href={`/learn/${id}`}
                  className="surface-panel rounded-xl p-4 transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <CompanyAvatar id={id} size={40} />
                    {id === primary ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Primary
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 font-semibold">{getCompany(id).short}</p>
                  <p className="text-xs text-muted-foreground">PRI {cp}/100</p>
                </Link>
              )
            },
          )}
        </div>
      </div>
    </div>
  )
}

function TodayTasksCard() {
  const { state } = useStore()
  const progress = state.progress[state.primary] ?? EMPTY_PROGRESS
  const next = nextChapter(state.primary, progress)
  const weak = weakestTopics(state, 1)[0]
  const mockDone = progress.mockScores.length > 0
  const tasks = [
    next
      ? {
          label: `Finish ${next.chapter.title}`,
          detail: `${next.section.short} chapter - builds your PRI directly`,
          href: `/learn/${state.primary}/${next.section.id}/${next.chapter.id}`,
          icon: next.section.icon,
        }
      : {
          label: "Attempt a full mock",
          detail: "You cleared the learning track; now test under pressure",
          href: "/mock",
          icon: "Target",
        },
    weak
      ? {
          label: `Repair ${weak.topic}`,
          detail: `${weak.accuracy}% accuracy - revise mistakes first`,
          href: "/mistakes",
          icon: "Wrench",
        }
      : {
          label: "Take a mixed challenge",
          detail: "Build weak-topic data for better recommendations",
          href: "/challenges",
          icon: "ClipboardCheck",
        },
    mockDone
      ? {
          label: "Take the next mock",
          detail: "Pressure practice matters after basics",
          href: "/mock",
          icon: "Trophy",
        }
      : {
          label: "Take one diagnostic mock",
          detail: "Find your real weak sections today",
          href: "/mock",
          icon: "Trophy",
        },
  ]

  return (
    <Card className="border-primary/25 bg-primary/[0.04]">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="font-heading text-base">Today&apos;s 3 tasks</CardTitle>
          <p className="text-sm text-muted-foreground">
            Do these before exploring anything else.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/sprint">
            7-day sprint <Icon name="ArrowRight" className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {tasks.map((task, index) => (
          <Link
            key={task.label}
            href={task.href}
            className="rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon name={task.icon} className="size-4" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">Task {index + 1}</span>
            </div>
            <p className="mt-3 font-medium">{task.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{task.detail}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

function DailyCard() {
  const { state } = useStore()
  const t = new Date().toISOString().slice(0, 10)
  const daily = state.daily.date === t ? state.daily : { general: false, aptitude: false, coding: false }
  const cats = [
    { key: "general", label: "Mixed", icon: "BookOpen" },
    { key: "aptitude", label: "Aptitude", icon: "Calculator" },
    { key: "coding", label: "Coding", icon: "Code2" },
  ] as const

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 font-heading text-base">
          <Icon name="CalendarCheck" className="size-4 text-primary" /> Daily Challenge
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {state.streak.count}-day streak
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        {cats.map((c) => {
          const done = daily[c.key]
          return (
            <Link
              key={c.key}
              href={`/challenges?cat=${c.key}`}
              className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-muted">
                <Icon name={c.icon} className="size-4" />
              </span>
              <span className="flex-1 font-medium">{c.label}</span>
              {done ? (
                <span className="flex items-center gap-1 text-sm text-[color:var(--success)]">
                  <Icon name="CircleCheckBig" className="size-4" /> Done
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-primary">
                  Start <Icon name="ArrowRight" className="size-3.5" />
                </span>
              )}
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}

function PlacementRoadmap() {
  const { state } = useStore()
  const progress = state.progress[state.primary] ?? EMPTY_PROGRESS
  const sections = getSections(state.primary)
  const passed = Object.values(progress.chapters).filter((chapter) => chapter.passed).length
  const total = sections.reduce((sum, section) => sum + section.chapters.length, 0)
  const weak = weakestTopics(state, 1)[0]

  const steps = [
    {
      label: "Diagnose",
      detail: progress.mockScores.length
        ? `${progress.mockScores.length} mock${progress.mockScores.length > 1 ? "s" : ""} taken`
        : "Take one mini mock",
      href: "/mock",
      done: progress.mockScores.length > 0,
      icon: "ClipboardCheck",
    },
    {
      label: "Build basics",
      detail: `${passed}/${total} chapters passed`,
      href: `/learn/${state.primary}`,
      done: total > 0 && passed / total >= 0.6,
      icon: "GraduationCap",
    },
    {
      label: "Fix weak area",
      detail: weak ? `${weak.topic} at ${weak.accuracy}%` : "Answer quizzes to unlock",
      href: weak ? "/analytics" : "/challenges",
      done: Boolean(weak && weak.accuracy >= 70),
      icon: "Wrench",
    },
    {
      label: "Simulate drive",
      detail: progress.mockScores.some((score) => score >= 70)
        ? "Cutoff-level mock cleared"
        : "Attempt a full-length mock",
      href: "/mock",
      done: progress.mockScores.some((score) => score >= 70),
      icon: "Target",
    },
    {
      label: "Interview ready",
      detail: "Practise HR, technical and communication",
      href: "/interview",
      done: false,
      icon: "Mic",
    },
  ]

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold">Placement roadmap</h2>
            <p className="text-sm text-muted-foreground">
              A simple path from diagnosis to final-drive simulation.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/readiness">
              Check readiness <Icon name="ArrowRight" className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-5">
          {steps.map((step, index) => (
            <Link
              key={step.label}
              href={step.href}
              className="group rounded-lg border border-border bg-background/55 p-3 transition-all hover:border-primary/30 hover:bg-muted/55"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg",
                    step.done
                      ? "bg-success/15 text-[color:var(--success)]"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon name={step.done ? "CircleCheckBig" : step.icon} className="size-4" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Step {index + 1}
                </span>
              </div>
              <p className="mt-3 font-medium">{step.label}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{step.detail}</p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StartNowButton({ href, label }: { href: string; label: string }) {
  return (
    <Button
      asChild
      size="lg"
      className="group/cta rounded-lg pl-5 pr-2 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
    >
      <Link href={href}>
        {label}
        <span className="ml-2 grid size-8 place-items-center rounded-full bg-primary-foreground/15 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/cta:translate-x-0.5">
          <Icon name="ArrowRight" className="size-4" />
        </span>
      </Link>
    </Button>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}


