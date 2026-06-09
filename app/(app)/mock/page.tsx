"use client"

import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { PageHeader } from "@/components/app/page-header"
import { QuizRunner } from "@/components/app/quiz-runner"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { CompanyPicker } from "@/components/app/company-picker"
import { FREE_MOCK_COMPANY } from "@/lib/access"
import { getCompany } from "@/lib/data/companies"
import { buildMockQuestions, mocksForCompany } from "@/lib/data/mocks"
import { buildMockAnalysis, mockPressureLabel, type MockAnalysis } from "@/lib/domain/mock-analysis"
import { EMPTY_PROGRESS, mockMastery } from "@/lib/scoring"
import { useStore } from "@/lib/store"
import type { CompanyId } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function MockPage() {
  const { state, submitMock, recordMistake } = useStore()
  const initial = state.primary || FREE_MOCK_COMPANY
  const [company, setCompany] = React.useState<CompanyId>(initial)
  const [mockIndex, setMockIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [lastAnalysis, setLastAnalysis] = React.useState<MockAnalysis | null>(null)

  const c = getCompany(company)
  const mocks = React.useMemo(() => mocksForCompany(company), [company])
  const visibleMocks = React.useMemo(
    () => (state.premium ? mocks : mocks.slice(0, 1)),
    [mocks, state.premium],
  )
  const mock = visibleMocks[mockIndex] ?? visibleMocks[0]
  const progress = state.progress[company] ?? EMPTY_PROGRESS
  const questions = React.useMemo(() => (mock ? buildMockQuestions(mock) : []), [mock])
  const locked = !state.premium && company !== FREE_MOCK_COMPANY
  const hiddenMockCount = Math.max(0, mocks.length - visibleMocks.length)
  const best = progress.mockScores.length ? Math.max(...progress.mockScores) : 0
  const timeLimitSec = mock
    ? mock.sections.reduce((sum, section) => sum + section.durationMinutes, 0) * 60
    : 0
  const totalQuestions = questions.length
  const fullLength = totalQuestions >= 45

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Timed simulation"
        title="Mock Tests"
        description="Timed company-pattern mocks with section-wise scoring and pass targets."
      />

      <CompanyPicker
        value={company}
        onChange={(id) => {
          setCompany(id)
          setMockIndex(0)
          setPlaying(false)
          setLastAnalysis(null)
        }}
      />

      {progress.mockScores.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Mocks taken" value={progress.mockScores.length} />
          <Stat label="Best score" value={`${best}%`} />
          <Stat label="Average" value={`${mockMastery(progress)}%`} />
        </div>
      ) : null}

      {playing ? (
        <QuizRunner
          key={mock?.id}
          questions={questions}
          timeLimitSec={timeLimitSec}
          passThreshold={mock?.cutoffPercent}
          onMistake={recordMistake}
          onFinish={(results, scorePct) => {
            const { xpGained } = submitMock(company, scorePct)
            setLastAnalysis(buildMockAnalysis(results, scorePct, mock?.cutoffPercent ?? 70))
            toast.success(`Mock complete - ${scorePct}%! +${xpGained} XP`)
          }}
          doneActions={() => (
            <Button variant="outline" onClick={() => setPlaying(false)}>
              Done
            </Button>
          )}
        />
      ) : (
        <>
        {lastAnalysis ? <MockAnalysisCard analysis={lastAnalysis} /> : null}
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <CompanyAvatar id={company} size={40} />
            <div className="flex-1">
              <CardTitle className="font-heading text-base">
                {mock?.title ?? `${c.name} Mock Test`}
              </CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{totalQuestions} questions</span>
                <span>-</span>
                <span>{Math.round(timeLimitSec / 60)} min</span>
                <span>-</span>
                <span>cutoff {mock?.cutoffPercent ?? 70}%</span>
                <span>-</span>
                <span>{mockPressureLabel(totalQuestions, timeLimitSec)} pressure</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    fullLength
                      ? "bg-warning/15 text-warning-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {fullLength ? "Full-length simulation" : "Mini mock"}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {visibleMocks.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {visibleMocks.map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMockIndex(i)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      mock?.id === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    Mock {i + 1}
                  </button>
                ))}
              </div>
            ) : null}

            {mock ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {mock.sections.map((section) => (
                  <div key={section.label} className="rounded-xl border border-border p-3">
                    <p className="font-medium">{section.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {section.questionCount} questions - {section.durationMinutes} min
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col items-center gap-3 py-5 text-center">
              {locked ? (
                <>
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon name="Lock" className="size-7" />
                  </span>
                  <p className="font-medium">Premium mock</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Upgrade to practise every company mock with full analytics.
                  </p>
                  <Button asChild className="mt-1">
                    <Link href="/settings">Go Premium - Rs 399/yr</Link>
                  </Button>
                </>
              ) : (
                <>
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon name="Target" className="size-7" />
                  </span>
                  <p className="font-medium">Ready to simulate the {c.short} test?</p>
                  <p className="text-sm text-muted-foreground">
                    {fullLength
                      ? "Full-length pressure practice with section-wise review."
                      : "Mini mock for warm-up practice before full-length attempts."}
                  </p>
                  <div className="grid w-full max-w-xl gap-2 text-left sm:grid-cols-3">
                    <PressureTip label="Before" value="No pause. Treat it like drive time." />
                    <PressureTip label="During" value="Skip stuck questions after 45 seconds." />
                    <PressureTip label="After" value="Review every wrong topic immediately." />
                  </div>
                  <Button className="mt-1" onClick={() => setPlaying(true)}>
                    Start mock <Icon name="ArrowRight" className="size-4" />
                  </Button>
                  {!state.premium && hiddenMockCount > 0 ? (
                    <p className="max-w-sm text-xs text-muted-foreground">
                      Upgrade for the complete mock series.
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </CardContent>
        </Card>
        </>
      )}
    </div>
  )
}

function MockAnalysisCard({ analysis }: { analysis: MockAnalysis }) {
  return (
    <Card className="border-primary/25 bg-primary/[0.04]">
      <CardHeader>
        <CardTitle className="font-heading text-base">Mock analysis</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{analysis.carelessRisk}</p>
          <div className="grid grid-cols-2 gap-2">
            <AnalysisMetric label="Score" value={`${analysis.scorePct}%`} />
            <AnalysisMetric label="Cutoff" value={`${analysis.cutoff}%`} />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Weak topics</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {analysis.weakTopics.length ? (
                analysis.weakTopics.map((topic) => (
                  <span key={topic.topic} className="rounded-full bg-background px-2 py-1 text-xs ring-1 ring-border">
                    {topic.topic}: {topic.wrong}/{topic.total} wrong
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No weak topic from this attempt.</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Next actions</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {analysis.nextTasks.map((task) => (
                <li key={task}>- {task}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PressureTip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2 text-xs">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-muted-foreground">{value}</p>
    </div>
  )
}

function AnalysisMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 text-center">
      <p className="font-heading text-xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="font-heading text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}


