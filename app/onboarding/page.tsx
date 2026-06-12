"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { StudyBenchWordmark } from "@/components/app/brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@/components/app/icon"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { SELECTABLE_COMPANIES } from "@/lib/data/companies"
import { useStore } from "@/lib/store"
import type { CompanyId, Profile } from "@/lib/types"
import { cn } from "@/lib/utils"

// Graduation years 2026-2035.
const GRAD_YEARS = Array.from({ length: 10 }, (_, i) => String(2026 + i))

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding } = useStore()
  const [step, setStep] = React.useState(0)
  const [profile, setProfile] = React.useState<Profile>({
    name: "",
    college: "",
    branch: "",
    gradYear: "",
    cgpa: "",
    backlogs: "0",
  })
  const [interested, setInterested] = React.useState<CompanyId[]>([])
  const [primary, setPrimary] = React.useState<CompanyId | "">("")

  function set<K extends keyof Profile>(k: K, v: Profile[K]) {
    setProfile((p) => ({ ...p, [k]: v }))
  }
  function toggle(id: CompanyId) {
    setInterested((list) => {
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
      if (!next.includes(primary as CompanyId)) setPrimary(next[0] ?? "")
      else if (!primary && next.length) setPrimary(next[0])
      return next
    })
  }

  const canNextProfile =
    profile.name.trim() && profile.college.trim() && profile.branch.trim() && profile.gradYear
  const canNextCompanies = interested.length > 0

  function finish() {
    const prim = (primary || interested[0] || "general") as CompanyId
    const companies = interested.map(
      (id) => SELECTABLE_COMPANIES.find((company) => company.id === id)?.short ?? id.toUpperCase(),
    )
    completeOnboarding(profile, interested, prim)
    void fetch("/api/email/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name, companies }),
    }).catch(() => {
      // Email should never block a student from reaching the dashboard.
    })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-4 py-10">
        <StudyBenchWordmark href="/" className="mb-6" />

        <Stepper step={step} />

        {step === 0 ? <PlacementOutcomePanel /> : null}

        {step === 0 && (
          <Card className="mt-5">
            <CardContent className="space-y-4 pt-6">
              <div>
                <h1 className="font-heading text-2xl font-bold">Tell us about you</h1>
                <p className="text-sm text-muted-foreground">
                  We use this to personalise your prep.
                </p>
              </div>
              <Field label="Full name">
                <Input
                  value={profile.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                />
              </Field>
              <Field label="College">
                <Input
                  value={profile.college}
                  onChange={(e) => set("college", e.target.value)}
                  placeholder="e.g. PSG College of Technology"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Branch">
                  <Input
                    value={profile.branch}
                    onChange={(e) => set("branch", e.target.value)}
                    placeholder="e.g. CSE"
                  />
                </Field>
                <Field label="Graduation year">
                  <Select value={profile.gradYear} onValueChange={(v) => set("gradYear", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRAD_YEARS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="CGPA (optional)">
                <Input
                  value={profile.cgpa}
                  onChange={(e) => set("cgpa", e.target.value)}
                  placeholder="e.g. 8.2"
                  inputMode="decimal"
                />
              </Field>
              <div className="flex justify-end pt-2">
                <Button disabled={!canNextProfile} onClick={() => setStep(1)}>
                  Continue <Icon name="ChevronRight" className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card className="mt-5">
            <CardContent className="space-y-4 pt-6">
              <div>
                <h1 className="font-heading text-2xl font-bold">
                  Which companies are you preparing for?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pick all that apply. Free gives you all of Section 1 in every track. Premium unlocks every section, deep PYQ banks and mock series.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SELECTABLE_COMPANIES.map((c) => {
                  const on = interested.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggle(c.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
                        on
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40 hover:bg-muted/50",
                      )}
                    >
                      <CompanyAvatar id={c.id} size={44} />
                      <span className="text-sm font-semibold">
                        {c.id === "general" ? "Core Prep" : c.short}
                      </span>
                      {on ? (
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <Icon name="Check" className="size-3" /> Selected
                        </span>
                      ) : c.id === "general" ? (
                        <span className="text-xs leading-relaxed text-muted-foreground">
                          Build all core skills before choosing a company path.
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{c.sector}</span>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button disabled={!canNextCompanies} onClick={() => setStep(2)}>
                  Continue <Icon name="ChevronRight" className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="mt-5">
            <CardContent className="space-y-4 pt-6">
              <div>
                <h1 className="font-heading text-2xl font-bold">Pick your primary target</h1>
                <p className="text-sm text-muted-foreground">
                  Your dashboard focuses on this one. You can switch anytime.
                </p>
              </div>
              <div className="grid gap-2">
                {interested.map((id) => {
                  const on = primary === id
                  const c = SELECTABLE_COMPANIES.find((x) => x.id === id)!
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPrimary(id)}
                      className={cn(
                        "flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg border p-3 text-left transition-all",
                        on
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <CompanyAvatar id={id} size={40} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">{c.blurb}</p>
                      </div>
                      <span
                        className={cn(
                          "grid size-5 place-items-center rounded-full border",
                          on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                        )}
                      >
                        {on ? <Icon name="Check" className="size-3" /> : null}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue <Icon name="ChevronRight" className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="mt-5 overflow-hidden">
            <CardContent className="space-y-5 pt-6">
              <div>
                <h1 className="font-heading text-2xl font-bold">Here is what to do first</h1>
                <p className="text-sm text-muted-foreground">
                  Follow this order after onboarding. It keeps your preparation simple and builds your readiness score step by step.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    icon: "BookOpenCheck",
                    title: "Start your first learning chapter",
                    detail: "Open your primary company track and finish the first short chapter quiz.",
                  },
                  {
                    icon: "CalendarCheck",
                    title: "Complete today's daily challenge",
                    detail: "Answer five quick questions to start your streak and reveal weak areas.",
                  },
                  {
                    icon: "Code2",
                    title: "Try one coding problem",
                    detail: "Attempt one beginner problem from the coding ladder, even if you use hints.",
                  },
                  {
                    icon: "Trophy",
                    title: "Take a diagnostic mock",
                    detail: "Use your first mock score as a baseline, then improve from there.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-xl border border-border bg-muted/35 p-3"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={item.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Step {index + 1}
                      </p>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="font-heading font-semibold">Your dashboard will guide you</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  After this, you will see a getting-started checklist and three daily tasks so you always know the next action.
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={finish}>
                  Start preparing <Icon name="ArrowRight" className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  const labels = ["Profile", "Companies", "Primary", "Next steps"]
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => (
        <React.Fragment key={l}>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full text-xs font-semibold",
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                i <= step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {l}
            </span>
          </div>
          {i < labels.length - 1 ? <div className="h-px flex-1 bg-border" /> : null}
        </React.Fragment>
      ))}
    </div>
  )
}

function PlacementOutcomePanel() {
  const rows = [
    { label: "Target company plan", value: "Personalized" },
    { label: "Daily practice", value: "Aptitude + coding" },
    { label: "Interview prep", value: "Recruiter-style" },
  ]

  return (
    <div className="mt-5 rounded-2xl border border-primary/15 bg-background/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon name="BookOpen" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-base font-semibold">Build a placement route that fits you</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            StudyBench turns your selected companies into chapters, practice sets, mock tests and interview preparation.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl bg-muted/60 px-3 py-2">
            <p className="text-[11px] font-medium uppercase text-muted-foreground">{row.label}</p>
            <p className="mt-1 text-sm font-semibold">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}

// ArrowRight isn't in the icon registry by default name lookup fallback handles it,
// but we map it here for crispness.


