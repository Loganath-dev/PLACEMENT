"use client"

import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { PageHeader } from "@/components/app/page-header"
import { QuizRunner } from "@/components/app/quiz-runner"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function MistakesPage() {
  const { state, clearMistake, clearMistakes, recordMistake } = useStore()
  const [playing, setPlaying] = React.useState(false)
  const mistakes = state.mistakes ?? []
  const adaptiveQuestions = mistakes.slice(0, 20).map((mistake, index) => ({
    id: `adaptive-${mistake.questionId}-${index}`,
    topic: mistake.topic,
    difficulty: mistake.difficulty,
    prompt: mistake.prompt,
    options: mistake.options,
    answer: mistake.answer,
    explanation: mistake.explanation,
  }))

  if (playing && adaptiveQuestions.length > 0) {
    return (
      <QuizRunner
        questions={adaptiveQuestions}
        onReturn={() => setPlaying(false)}
        returnLabel="Mistakes"
        onMistake={recordMistake}
        onFinish={(_results, scorePct) => {
          toast.success(`Adaptive mistake quiz complete - ${scorePct}%`)
        }}
        doneActions={() => (
          <Button variant="outline" onClick={() => setPlaying(false)}>
            Done
          </Button>
        )}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Revision loop"
        title="Mistake Notebook"
        description="Every question you miss is saved here. Reviewing mistakes is where most of the real learning happens."
        actions={mistakes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setPlaying(true)}>
              <Icon name="Dumbbell" className="size-4" /> Adaptive quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearMistakes()
                toast("Notebook cleared")
              }}
            >
              <Icon name="Trash2" className="size-4" /> Clear all
            </Button>
          </div>
        ) : null}
      />

      {mistakes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-success/10 text-[color:var(--success)]">
              <Icon name="CircleCheckBig" className="size-7" />
            </span>
            <p className="font-medium">No mistakes saved yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              When you answer a quiz, daily challenge or mock question incorrectly, it lands here
              automatically so you can master it.
            </p>
            <Button asChild className="mt-1">
              <Link href="/challenges">
                Try a daily challenge <Icon name="ArrowRight" className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {mistakes.length} saved {mistakes.length === 1 ? "question" : "questions"} - most
            recent first
          </p>
          <div className="space-y-3">
            {mistakes.map((m) => (
              <Card key={m.questionId}>
                <CardContent className="space-y-3 pt-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                      {m.topic}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 capitalize text-muted-foreground">
                      {m.difficulty}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearMistake(m.questionId)
                        toast("Marked as reviewed")
                      }}
                      className="ml-auto flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <Icon name="Check" className="size-3.5" /> Mark reviewed
                    </button>
                  </div>

                  <p className="font-medium">{m.prompt}</p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {m.options.map((opt, i) => {
                      const isAnswer = i === m.answer
                      const isChosen = i === m.chosen
                      return (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                            isAnswer && "border-success/50 bg-success/10",
                            isChosen && !isAnswer && "border-destructive/50 bg-destructive/10",
                            !isAnswer && !isChosen && "border-border",
                          )}
                        >
                          <span>{opt}</span>
                          {isAnswer ? (
                            <Icon name="Check" className="size-4 text-[color:var(--success)]" />
                          ) : isChosen ? (
                            <span className="text-xs font-medium text-destructive">your pick</span>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>

                  <div className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                    {m.explanation}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


