"use client"

import Link from "next/link"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CompanyAvatar, ToneBadge } from "@/components/app/ui-bits"
import { Icon } from "@/components/app/icon"
import { PriRing } from "@/components/app/pri-ring"
import { getCompany } from "@/lib/data/companies"
import { getSections } from "@/lib/data/content"
import {
  computePRI,
  EMPTY_PROGRESS,
  priBand,
  sectionMastery,
  weakestTopics,
} from "@/lib/scoring"
import { useStoreState } from "@/lib/store"
import type { CompanyId } from "@/lib/types"

function nextChapter(companyId: CompanyId, progress = EMPTY_PROGRESS) {
  for (const section of getSections(companyId)) {
    for (const chapter of section.chapters) {
      if (!progress.chapters[chapter.id]?.passed) return { section, chapter }
    }
  }
  return null
}

export default function DashboardPage() {
  const { state } = useStoreState()
  const primary = state.primary
  const company = getCompany(primary)
  const progress = state.progress[primary] ?? EMPTY_PROGRESS
  const pri = React.useMemo(() => computePRI(primary, progress), [primary, progress])
  const next = React.useMemo(() => nextChapter(primary, progress), [primary, progress])
  const weakest = React.useMemo(() => weakestTopics(state, 1)[0], [state])
  const nextMinutes = React.useMemo(
    () =>
      next
        ? next.chapter.lessons.reduce((total, lesson) => total + lesson.minutes, 0) +
          next.chapter.quiz.length
        : 0,
    [next],
  )

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Left Sidebar: Readiness & PRI */}
        <aside className="relative flex flex-col items-center overflow-hidden rounded-[2rem] bg-[#eaf4fb] p-6 shadow-sm dark:bg-zinc-900/50 dark:border-zinc-800 border-0">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
            <div className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              <CompanyAvatar id={primary} size={24} />
            </div>
            {company.short}
            <span className="ml-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground bg-background">Primary</span>
          </div>

          <div className="mt-8 mb-4">
            <PriRing value={pri} tone={priBand(pri).tone} label="PRI" />
          </div>

          <div className="flex flex-col items-center text-center">
            <ToneBadge band={priBand(pri)} />
            <p className="mt-2 text-sm text-muted-foreground">readiness</p>
          </div>

          <div className="mt-6 w-full rounded-2xl border border-red-200 bg-red-50/50 p-2 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-xs font-bold tracking-[0.1em] text-red-600 uppercase">Just getting started</p>
          </div>

          <div className="mt-4 w-full rounded-2xl border border-black/5 bg-white/50 p-4 text-sm backdrop-blur-sm dark:border-white/5 dark:bg-black/20">
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center gap-1.5"><Icon name="Settings2" className="size-4" /> Estimate inputs</span>
              <span className="text-muted-foreground text-xs">PRI 0/100</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>Target 45</span>
              <span>Mock avg none</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Weakest Quant 0%</p>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              Uses only in-app chapter scores, mock average and this company&apos;s PRI target. It does not include eligibility, hiring demand, interview performance or recruiter decisions.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex flex-col gap-6 pt-2">
          <header className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Good evening, Loganath</p>
              <h1 className="mt-1 font-heading text-4xl font-bold tracking-tight text-foreground">Today&apos;s next move</h1>
            </div>
            <Button variant="outline" className="hidden sm:flex transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <Icon name="TrendingUp" className="mr-2 size-4" /> Full readiness
            </Button>
          </header>

          <Card className="overflow-hidden border border-black/5 shadow-md shadow-primary/5 transition-all hover:shadow-primary/10 dark:border-white/5 rounded-3xl mt-2">
            <CardContent className="p-0">
              {next ? (
                <div className="relative overflow-hidden bg-[#f4f7fb] dark:bg-zinc-900/50">
                  <div className="relative p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                      <div className="grid size-14 shrink-0 place-items-center rounded-[1rem] bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                        <Icon name={next.section.icon} className="size-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold tracking-[0.1em] text-blue-600 uppercase">DO THIS NOW - {next.section.short}</p>
                        <h2 className="mt-1 font-heading text-2xl font-semibold">{next.chapter.title}</h2>
                        
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-medium shadow-sm dark:border-white/5 dark:bg-zinc-800">
                            <Icon name="Clock" className="size-3 text-muted-foreground" /> ~{Math.max(5, nextMinutes)} min
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full bg-[#e6f7ec] px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <Icon name="TrendingUp" className="size-3" /> +2 PRI when you pass
                          </span>
                        </div>
                        
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                          One good session here moves the score more than another hour of unfocused scrolling.
                        </p>
                        
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                          <Button asChild size="lg" className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 px-6 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <Link href={`/learn/${primary}/${next.section.id}/${next.chapter.id}`}>
                              Start now <Icon name="ArrowRight" className="ml-2 size-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" className="text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl font-semibold">
                            <Link href={`/learn/${primary}`}>View full track <Icon name="ChevronRight" className="ml-1 size-4" /></Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-[#f4f7fb] dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-[1rem] bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <Icon name="CheckCircle2" className="size-6" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-semibold">Track complete</h2>
                      <p className="mt-1 text-sm text-muted-foreground max-w-md">
                        You have finished the chapters in this track. Use a mock to practise under time pressure.
                      </p>
                    </div>
                  </div>
                  <Button asChild size="lg" className="shrink-0 transition-transform hover:scale-[1.02] active:scale-[0.98] rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="/mock">Take a mock</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 mt-4">
            {getSections(primary).map((section) => (
              <div key={section.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <Icon name={section.icon} className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{section.short}</span>
                </div>
                <div className="flex items-center gap-3 w-[60%]">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[2rem] text-right">{sectionMastery(primary, section.id, progress)}%</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary shadow-inner">
                    <div 
                      className="h-full rounded-full bg-muted-foreground/30 transition-all duration-1000 ease-out group-hover:bg-foreground/40" 
                      style={{ width: `${Math.max(1, sectionMastery(primary, section.id, progress))}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
