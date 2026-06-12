"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { QuizRunner, type QuizResultItem } from "@/components/app/quiz-runner"
import { Prose } from "@/components/app/prose"
import { UpgradeBanner } from "@/components/app/upgrade-prompt"
import { canAccessLearningChapter } from "@/lib/access"
import { COMPANY_BY_ID, getCompany } from "@/lib/data/companies"
import { getSection, getSections } from "@/lib/data/content"
import { EMPTY_PROGRESS } from "@/lib/scoring"
import { useStore } from "@/lib/store"
import type { CompanyId, Difficulty, Question, SectionId } from "@/lib/types"
import { cn } from "@/lib/utils"

const CHAPTER_QUESTION_COUNT = 20

export default function ChapterPage() {
  const params = useParams<{ company: string; section: string; chapter: string }>()
  const { state, submitQuiz, recordMistake } = useStore()
  const [practiceLessonIndex, setPracticeLessonIndex] = React.useState<number | null>(null)
  const [lessonResults, setLessonResults] = React.useState<Record<number, QuizResultItem[]>>({})

  const companyId = params.company as CompanyId
  const sectionId = params.section as SectionId
  if (!COMPANY_BY_ID[companyId]) notFound()
  const section = getSection(companyId, sectionId)
  if (!section) notFound()
  const sectionIndex = getSections(companyId).findIndex((item) => item.id === sectionId)
  const idx = section.chapters.findIndex((c) => c.id === params.chapter)
  if (idx === -1) notFound()

  const company = getCompany(companyId)
  const chapter = section.chapters[idx]
  const prevCh = idx > 0 ? section.chapters[idx - 1] : null
  const nextCh = section.chapters[idx + 1]
  const progress = state.progress[companyId] ?? EMPTY_PROGRESS
  const gateLocked = prevCh ? !progress.chapters[prevCh.id]?.passed : false
  const paywalled = !canAccessLearningChapter(sectionIndex, idx, state.premium)
  const backHref = `/learn/${companyId}/${sectionId}`
  const lessonPracticeSets = lessonPracticeQuestions(chapter.quiz, chapter.lessons.length)
  const completedLessonCount = Object.keys(lessonResults).length
  const currentLessonIndex = Math.min(completedLessonCount, chapter.lessons.length - 1)
  const currentLesson = chapter.lessons[currentLessonIndex]
  const allLessonResults = Object.values(lessonResults).flat()
  const chapterPracticeScore = allLessonResults.length
    ? Math.round(
        (allLessonResults.filter((result) => result.correct).length / allLessonResults.length) *
          100,
      )
    : 0
  const chapterComplete = completedLessonCount === chapter.lessons.length

  if (paywalled) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <BackLink href={backHref} label={section.name} />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icon name="Lock" className="size-8" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold">{chapter.title}</h1>
              <p className="mt-1 text-muted-foreground">
                Free users get all of Section 1 in every track.
                Upgrade to unlock Sections 2 onwards and go deeper.
              </p>
            </div>
          </CardContent>
        </Card>
        <UpgradeBanner />
      </div>
    )
  }

  if (gateLocked && prevCh) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <BackLink href={backHref} label={section.name} />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <Icon name="Lock" className="size-8" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold">{chapter.title}</h1>
              <p className="mx-auto mt-1 max-w-md text-muted-foreground">
                Complete <strong>{prevCh.title}</strong> first to continue your path.
              </p>
            </div>
            <Button asChild>
              <Link href={`/learn/${companyId}/${sectionId}/${prevCh.id}`}>
                Go to {prevCh.title} <Icon name="ArrowRight" className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <BackLink href={backHref} label={section.name} />

      <div>
        <p className="text-sm font-medium text-primary">
          {company.short} - {section.short} - Chapter {idx + 1}
        </p>
        <h1 className="font-heading text-2xl font-bold md:text-3xl">{chapter.title}</h1>
        <p className="mt-1 text-muted-foreground">{chapter.summary}</p>
      </div>

      {practiceLessonIndex === null ? (
        chapterComplete ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-lg font-semibold">
                Chapter practice score: {chapterPracticeScore}%
              </p>
                <p className="text-sm text-muted-foreground">
                  {chapterPracticeScore >= 70
                  ? "Great work. Your best chapter score is saved."
                  : "Retake the chapter later — placement cutoffs are 70%+."}
                </p>
            </div>
            {nextCh && chapterPracticeScore >= 70 ? (
              <Button asChild>
                <Link href={`/learn/${companyId}/${sectionId}/${nextCh.id}`}>
                  Next chapter <Icon name="ArrowRight" className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href={backHref}>Back to {section.short}</Link>
              </Button>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="space-y-4 pt-6">
              {/* Lesson progress stepper */}
              <LessonStepper
                total={chapter.lessons.length}
                current={currentLessonIndex}
                completedCount={completedLessonCount}
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Lesson {currentLessonIndex + 1} of {chapter.lessons.length}
                  </p>
                  <h2 className="font-heading text-xl font-semibold">{currentLesson.title}</h2>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon name="BookOpen" className="size-3.5" /> {currentLesson.minutes} min
                </span>
              </div>
              <Prose body={currentLesson.body} />
              <div className="flex flex-col gap-2 rounded-xl bg-muted/45 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Practice this lesson</p>
                  <p className="text-sm text-muted-foreground">
                    Build confidence on this topic before moving to the next lesson.
                  </p>
                </div>
                <Button onClick={() => setPracticeLessonIndex(currentLessonIndex)}>
                  Start questions <Icon name="ArrowRight" className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <QuizRunner
          key={`${chapter.id}-${practiceLessonIndex}`}
          questions={lessonPracticeSets[practiceLessonIndex] ?? []}
          passThreshold={70}
          passThresholdLabel="for this lesson practice (placement cutoff is 70%)"
          onReturn={() => setPracticeLessonIndex(null)}
          returnLabel="Lesson"
          onMistake={recordMistake}
          onFinish={(results) => {
            const nextResults = { ...lessonResults, [practiceLessonIndex]: results }
            setLessonResults(nextResults)

            const completedAllLessons = chapter.lessons.every(
              (_, lessonIndex) => nextResults[lessonIndex],
            )
            if (!completedAllLessons) {
              toast.success("Lesson practice saved", {
                description: "Continue with the next lesson.",
              })
              return
            }

            const combinedResults = Object.values(nextResults).flat()
            const res = submitQuiz({ companyId, sectionId, chapterId: chapter.id, results: combinedResults })
            if (res.newlyPassed) {
              toast.success(`Chapter cleared! +${res.xpGained} XP`, {
                description: nextCh ? "Next chapter unlocked." : "Section complete.",
              })
            } else if (res.passed) {
              toast.success(`Nice - ${res.score}%. +${res.xpGained} XP`)
            } else {
              toast(`${res.score}% - keep going`, {
                description: "Review the weaker questions and try again.",
              })
            }
          }}
          doneActions={() => (
            <Button variant="outline" onClick={() => setPracticeLessonIndex(null)}>
              {practiceLessonIndex + 1 < chapter.lessons.length ? "Continue" : "See chapter result"}
            </Button>
          )}
        />
      )}
    </div>
  )
}

function lessonPracticeQuestions(questions: Question[], lessonCount: number): Question[][] {
  const targetCounts = splitChapterCounts(lessonCount)
  const buckets: Record<Difficulty, Question[]> = {
    easy: questions.filter((question) => question.difficulty === "easy"),
    medium: questions.filter((question) => question.difficulty === "medium"),
    hard: questions.filter((question) => question.difficulty === "hard"),
  }
  const used = new Set<string>()
  const order: Difficulty[] = ["easy", "medium", "hard", "medium"]

  return targetCounts.map((targetCount) => {
    const set: Question[] = []
    const required: Difficulty[] = targetCount >= 3 ? ["easy", "medium", "hard"] : []

    for (const difficulty of required) {
      const next = takeQuestion(buckets[difficulty], used)
      if (next) set.push(next)
    }

    let guard = 0
    while (set.length < targetCount && guard < questions.length * 4) {
      const difficulty = order[guard % order.length]
      const next = takeQuestion(buckets[difficulty], used) ?? takeQuestion(questions, used)
      if (next) set.push(next)
      guard += 1
    }

    return set
  })
}

function splitChapterCounts(lessonCount: number) {
  if (lessonCount <= 0) return []
  const base = Math.floor(CHAPTER_QUESTION_COUNT / lessonCount)
  const remainder = CHAPTER_QUESTION_COUNT % lessonCount
  return Array.from({ length: lessonCount }, (_, index) => base + (index < remainder ? 1 : 0))
}

function takeQuestion(pool: Question[], used: Set<string>) {
  const next = pool.find((question) => !used.has(question.id))
  if (!next) return null
  used.add(next.id)
  return next
}

function LessonStepper({
  total,
  current,
  completedCount,
}: {
  total: number
  current: number
  completedCount: number
}) {
  if (total <= 1) return null
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const done = i < completedCount
        const active = i === current
        return (
          <React.Fragment key={i}>
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                done
                  ? "border-success/50 bg-success/15 text-[color:var(--success)]"
                  : active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-muted/50 text-muted-foreground",
              )}
            >
              {done ? <Icon name="Check" className="size-3.5" /> : i + 1}
            </div>
            {i < total - 1 ? (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors",
                  done ? "bg-success/40" : "bg-border",
                )}
              />
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <Icon name="ChevronRight" className="size-4 rotate-180" /> {label}
    </Link>
  )
}
