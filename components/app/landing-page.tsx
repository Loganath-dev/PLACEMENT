"use client"

import Link from "next/link"
import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icon } from "@/components/app/icon"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { PriRing } from "@/components/app/pri-ring"
import { SELECTABLE_COMPANIES } from "@/lib/data/companies"
import { useStore } from "@/lib/store"
import type { CompanyId } from "@/lib/types"

const NAV_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
]

const PREVIEW: { id: CompanyId; pri: number; prob: number }[] = [
  { id: "tcs", pri: 85, prob: 78 },
  { id: "infosys", pri: 70, prob: 58 },
  { id: "wipro", pri: 64, prob: 51 },
  { id: "zoho", pri: 38, prob: 19 },
]

export function LandingPage() {
  const { state, hydrated } = useStore()
  const signedUp = hydrated && state.onboarded
  const startHref = signedUp ? "/dashboard" : "/auth/signup"

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader startHref={startHref} signedUp={signedUp} />
      <Hero startHref={startHref} />
      <ScopeBand />
      <PlacementDisclaimer />
      <HowItWorks />
      <FeatureBento />
      <HonestSignal />
      <SeoContentSection />
      <FinalCta startHref={startHref} />
      <SiteFooter />
    </div>
  )
}

function SiteHeader({ startHref, signedUp }: { startHref: string; signedUp: boolean }) {
  const [open, setOpen] = React.useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Icon name="GraduationCap" className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            Study<span className="text-primary">Bench</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href={startHref}>{signedUp ? "Open app" : "Start free"}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading">
                  Study<span className="text-primary">Bench</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-2">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Sign in
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function Hero({ startHref }: { startHref: string }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] size-[34rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:px-6 md:py-24">
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-4 motion-reduce:animate-none">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            <Icon name="BookOpen" className="size-3.5" /> Multi-company placement prep
          </span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Campus placement preparation for{" "}
            <span className="text-primary">the company you want.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Prepare for aptitude, coding, CS fundamentals, mock tests, PYQs and interviews
            with company-wise tracks for Indian freshers.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={startHref}>
                Start free <Icon name="ArrowRight" className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how">See how it works</Link>
            </Button>
          </div>
        </div>

        <div className="duration-700 animate-in fade-in slide-in-from-bottom-6 [animation-delay:120ms] motion-reduce:animate-none">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_70px_-30px_rgba(37,70,180,0.35)]">
            <div className="flex items-center gap-5">
              <PriRing value={72} size={104} label="Overall" tone="success" />
              <div>
                <p className="font-heading text-base font-semibold">Your readiness</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  One honest score across every track you target.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {PREVIEW.map((row) => {
                const c = SELECTABLE_COMPANIES.find((x) => x.id === row.id)!
                return (
                  <div key={row.id} className="flex items-center gap-3">
                    <CompanyAvatar id={row.id} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.short}</span>
                        <span className="tabular-nums text-muted-foreground">
                          PRI {row.pri} - ~{row.prob}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${row.pri}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Readiness estimates come from your in-app performance and are not a guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ScopeBand() {
  return (
    <section className="border-y border-border/70 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-8 md:flex-row md:justify-between md:px-6">
        <p className="text-sm font-medium text-muted-foreground">
          Prepare for the recruiters you are targeting
        </p>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {SELECTABLE_COMPANIES.map((c) => (
              <CompanyAvatar key={c.id} id={c.id} size={36} className="ring-2 ring-background" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Company tracks plus core skill practice
          </span>
        </div>
      </div>
    </section>
  )
}

function PlacementDisclaimer() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-5 md:px-6">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning-foreground">
          <Icon name="Info" className="size-4" />
        </span>
        <div>
          <p className="font-heading text-sm font-semibold">Placement learning disclaimer</p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            StudyBench is a placement learning and preparation app. We provide lessons, PYQs,
            mock tests, practice tools and readiness estimates, but we do not assure or
            guarantee any job, interview call, placement result, score or selection by any
            company.
          </p>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: "Target",
      title: "Pick your targets",
      body: "Choose the companies you want and track readiness for each in parallel.",
    },
    {
      icon: "BookOpen",
      title: "Learn step by step",
      body: "Work through bite-size chapters and keep moving as your preparation improves.",
    },
    {
      icon: "TrendingUp",
      title: "Watch readiness improve",
      body: "Use mocks, PYQs and analytics to focus on the weakest topics first.",
    },
  ]
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl font-bold">A placement plan you can follow daily</h2>
        <p className="mt-2 text-muted-foreground">
          StudyBench turns preparation into a clear workflow: choose, practise, measure, repeat.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-2xl border border-border bg-card p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon name={step.icon} className="size-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-primary">Step {i + 1}</p>
            <h3 className="mt-1 font-heading text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeatureBento() {
  const features = [
    ["Company-wise tracks", "Prepare for service and product-company patterns with focused chapters."],
    ["PYQ-style practice", "Practise original reconstruction questions aligned to common placement formats."],
    ["Mock tests", "Build exam temperament with timed mocks and section-wise review."],
    ["Interview bank", "Prepare technical, coding, HR, domain and managerial questions."],
  ]
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <h2 className="font-heading text-3xl font-bold">Everything freshers need to prepare</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-border bg-background p-5">
              <h3 className="font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HonestSignal() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold">Built around honest readiness</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
          StudyBench helps students avoid random preparation. Your dashboard shows what to
          study next, which topics need attention and how your mock performance changes over
          time. The score is a study aid, not a placement guarantee.
        </p>
      </div>
    </section>
  )
}

function SeoContentSection() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="font-heading text-2xl font-bold">
          Placement preparation app for Indian freshers
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <p className="leading-relaxed text-muted-foreground">
            StudyBench covers high-demand placement preparation areas: quantitative aptitude,
            logical reasoning, verbal ability, coding and DSA, DBMS, operating systems,
            computer networks, OOP, mock tests, PYQ-style practice and interview preparation.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Students can prepare for multiple target companies at once, compare readiness and
            follow a daily practice routine instead of jumping between disconnected resources.
          </p>
        </div>
      </div>
    </section>
  )
}

function FinalCta({ startHref }: { startHref: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="rounded-3xl bg-primary p-8 text-primary-foreground md:p-10">
        <h2 className="font-heading text-3xl font-bold">Start preparing with a clear plan</h2>
        <p className="mt-2 max-w-2xl text-primary-foreground/85">
          Start free. Upgrade for every track at Rs 399 per year.
        </p>
        <Button asChild className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          <Link href={startHref}>
            Start free <Icon name="ArrowRight" className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <p>Copyright {new Date().getFullYear()} StudyBench. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}


