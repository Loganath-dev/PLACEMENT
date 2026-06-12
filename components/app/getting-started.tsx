"use client"

import Link from "next/link"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { useStoreState } from "@/lib/store"
import { cn } from "@/lib/utils"

const DISMISS_KEY = "studybench.getting-started.dismissed"

interface Step {
  id: string
  title: string
  description: string
  href: string
  cta: string
  done: boolean
}

/**
 * Activation checklist for new users: "what do I do first?".
 * Every step is derived from real store state, so it checks itself off as the
 * student uses the app and disappears once all five are done or dismissed.
 */
export function GettingStartedCard() {
  const { state, hydrated } = useStoreState()
  const [dismissed, setDismissed] = React.useState(true)

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
      } catch {
        setDismissed(false)
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  const steps = React.useMemo<Step[]>(() => {
    const anyChapterPassed = Object.values(state.progress).some((p) =>
      Object.values(p.chapters).some((ch) => ch.passed),
    )
    const anyMockTaken = Object.values(state.progress).some((p) => p.mockScores.length > 0)
    const anyDailyDone = Boolean(state.daily.date)
    const anyCodingTried = (state.codingAttempts ?? []).length > 0

    return [
      {
        id: "companies",
        title: "Pick your target companies",
        description: "Choose the recruiters you are preparing for so every plan is company-specific.",
        href: "/settings",
        cta: "Choose",
        done: state.onboarded && state.interested.length > 0,
      },
      {
        id: "chapter",
        title: "Pass your first chapter quiz",
        description: "Open your track, read the first chapter and score 70%+ on its quiz.",
        href: "/learn",
        cta: "Start learning",
        done: anyChapterPassed,
      },
      {
        id: "daily",
        title: "Do today's daily challenge",
        description: "Five quick questions a day builds the streak that keeps you consistent.",
        href: "/challenges",
        cta: "Take it",
        done: anyDailyDone,
      },
      {
        id: "coding",
        title: "Solve one coding problem",
        description: "Try the first problem in your company's coding ladder - hints included.",
        href: "/coding",
        cta: "Open ladder",
        done: anyCodingTried,
      },
      {
        id: "mock",
        title: "Take your first mock test",
        description: "A timed mock gives you a real baseline readiness score to improve from.",
        href: "/mock",
        cta: "Take a mock",
        done: anyMockTaken,
      },
    ]
  }, [state])

  const doneCount = steps.filter((s) => s.done).length
  const allDone = doneCount === steps.length

  if (!hydrated || dismissed || allDone) return null

  const nextStep = steps.find((s) => !s.done)

  function dismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* private mode */
    }
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-heading font-semibold">
              <Icon name="Rocket" className="size-4 text-primary" /> Getting started
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {doneCount} of {steps.length} done - finish these to unlock your real readiness score.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Hide getting started checklist"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <Icon name="X" className="size-4" />
          </button>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>

        <ul className="mt-4 space-y-1">
          {steps.map((step) => {
            const isNext = step.id === nextStep?.id
            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2",
                  isNext && "bg-primary/5",
                )}
              >
                <Icon
                  name={step.done ? "CircleCheckBig" : "Circle"}
                  className={cn(
                    "size-4.5 shrink-0",
                    step.done ? "text-[color:var(--success)]" : "text-muted-foreground/50",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.done && "text-muted-foreground line-through decoration-muted-foreground/40",
                    )}
                  >
                    {step.title}
                  </p>
                  {isNext && <p className="text-xs text-muted-foreground">{step.description}</p>}
                </div>
                {!step.done && (
                  <Button asChild size="sm" variant={isNext ? "default" : "ghost"} className="shrink-0">
                    <Link href={step.href}>
                      {step.cta} <Icon name="ArrowRight" className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
