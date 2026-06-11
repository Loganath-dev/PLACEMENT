"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { PriRing } from "@/components/app/pri-ring"
import { CompanyAvatar, ProbabilityInputs, ProbabilityStat } from "@/components/app/ui-bits"
import { COMPANY_BY_ID, getCompany } from "@/lib/data/companies"
import { getSections } from "@/lib/data/content"
import {
  computePRI,
  EMPTY_PROGRESS,
  priBand,
  sectionMastery,
} from "@/lib/scoring"
import { useStore } from "@/lib/store"
import type { CompanyId } from "@/lib/types"

export default function CompanyTrackPage() {
  const params = useParams<{ company: string }>()
  const { state, setPrimary } = useStore()
  const companyId = params.company as CompanyId
  if (!COMPANY_BY_ID[companyId]) notFound()

  const company = getCompany(companyId)
  const progress = state.progress[companyId] ?? EMPTY_PROGRESS
  const pri = computePRI(companyId, progress)
  const sections = getSections(companyId)
  const isPrimary = state.primary === companyId

  return (
    <div className="space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <Icon name="ChevronRight" className="size-4 rotate-180" /> All tracks
      </Link>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center">
          <PriRing value={pri} tone={priBand(pri).tone} size={120} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <CompanyAvatar id={companyId} size={36} />
              <h1 className="font-heading text-2xl font-bold">{company.name}</h1>
            </div>
            <p className="mt-1 text-muted-foreground">{company.blurb}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <ProbabilityStat pri={pri} compact />
              {company.eligibility ? (
                <Link
                  href={`/practice?company=${companyId}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  PYQs & eligibility <Icon name="ArrowRight" className="size-3.5" />
                </Link>
              ) : null}
            </div>
            <div className="mt-3">
              <ProbabilityInputs companyId={companyId} progress={progress} compact />
            </div>
          </div>
          {!isPrimary && !company.isGeneral ? (
            <Button variant="outline" onClick={() => setPrimary(companyId)}>
              <Icon name="Target" className="size-4" /> Make primary
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((s) => {
          const mastery = sectionMastery(companyId, s.id, progress)
          const passed = s.chapters.filter((c) => progress.chapters[c.id]?.passed).length
          return (
            <Link key={s.id} href={`/learn/${companyId}/${s.id}`} className="group">
              <Card className="h-full transition-all group-hover:border-primary/40">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-semibold">{s.name}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{s.blurb}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {passed}/{s.chapters.length}
                      </span>
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


