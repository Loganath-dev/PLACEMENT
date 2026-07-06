"use client"

import Link from "next/link"
import * as React from "react"
import { Menu } from "lucide-react"
import { StudyBenchMark, StudyBenchWordmark } from "@/components/app/brand"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icon } from "@/components/app/icon"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { PriRing } from "@/components/app/pri-ring"
import {
  PLAN_FEATURES,
  premiumPriceLabel,
} from "@/lib/access"
import { track } from "@/lib/analytics"
import { FAQS } from "@/lib/content/faq"
import { SITE_URL } from "@/lib/content/blocks"
import { getCompany, SELECTABLE_COMPANIES } from "@/lib/data/companies"
import { computePRI } from "@/lib/scoring"
import { useStoreState } from "@/lib/store"
import type { CompanyId } from "@/lib/types"

const NAV_LINKS = [
  { href: "/prep", label: "Company guides" },
  { href: "/blog", label: "Blog" },
  { href: "#pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
]

const PREVIEW: { id: CompanyId; pri: number; prob: number }[] = [
  { id: "tcs", pri: 85, prob: 78 },
  { id: "infosys", pri: 70, prob: 58 },
  { id: "wipro", pri: 64, prob: 51 },
  { id: "zoho", pri: 38, prob: 19 },
]

const HERO_POINTS = [
  "All of Section 1 unlocked in every company track",
  "Company-wise PYQs, mocks, coding and interview prep",
  "Start free. Upgrade later only if the depth helps you",
]

const PROOF_POINTS = [
  { label: "Tracks", value: "13 company + core tracks" },
  { label: "Free access", value: "Full Section 1 in every track" },
  { label: "Premium", value: `${premiumPriceLabel()} for 1 year` },
  { label: "Focus", value: "PYQs, mocks, coding, HR and CS core" },
]

const METHOD_PRINCIPLES = [
  {
    icon: "Target",
    title: "Diagnose before you grind",
    body: "A first mock quickly tells you whether the real gap is speed, accuracy, aptitude, coding or interview confidence.",
  },
  {
    icon: "TrendingUp",
    title: "Readiness stays honest",
    body: "Readiness increases only when you actually pass chapters and improve mock performance. Skipping content does not inflate the score.",
  },
  {
    icon: "RefreshCw",
    title: "Weak areas come back",
    body: "Mistakes are scheduled for review so the same weak question does not disappear after one attempt and then return in the real test.",
  },
]

const PREP_JOURNEYS = [
  {
    title: "The aptitude-first fresher",
    stage: "Started with weak speed and random prep",
    path: "Used chapter-first quant and reasoning practice, then daily challenges and one mock each week.",
    outcome: "Became consistent enough to clear aptitude cutoffs and enter interview rounds with less panic.",
  },
  {
    title: "The service-company applicant",
    stage: "Needed a broad plan across TCS, Infosys and Wipro",
    path: "Picked multiple target tracks, followed the first free sections, then used company-wise mocks to spot pattern differences.",
    outcome: "Stopped preparing blindly and focused on the exact sections that changed mock scores fastest.",
  },
  {
    title: "The interview-repair student",
    stage: "Good marks, weaker follow-up answers in HR and technical rounds",
    path: "Used mock analysis, interview prompts, communication practice and readiness tracking in one loop.",
    outcome: "Reached interviews better prepared with clearer answers, stronger self-introduction and better structure.",
  },
]

export function LandingPage() {
  const { state, hydrated } = useStoreState()
  const signedUp = hydrated && state.onboarded
  const startHref = signedUp ? "/dashboard" : "/auth/signup"

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader startHref={startHref} signedUp={signedUp} />
      <Hero startHref={startHref} />
      <ProofStrip />
      <ProblemSection startHref={startHref} />
      <FeatureBento />
      <MethodSection />
      <PrepJourneysSection startHref={startHref} />
      <PricingSection startHref={startHref} />
      <HomeFaqSection startHref={startHref} />
      <ShareScoreCta startHref={startHref} />
      <FinalCta startHref={startHref} />
      <SiteFooter />
    </div>
  )
}

function SiteHeader({
  startHref,
  signedUp,
}: {
  startHref: string
  signedUp: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <StudyBenchWordmark href="/" />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <PrimaryCta href={startHref} placement="header_primary">
            {signedUp ? "Open app" : "Start free"}
          </PrimaryCta>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-heading">
                  <StudyBenchMark className="size-8" />
                  <span>
                    <span className="font-medium text-foreground/70">Study</span>
                    <span className="font-extrabold text-primary">Bench</span>
                  </span>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation menu.
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
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
    <section className="relative overflow-hidden border-b border-border/70">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.95_0.04_90/.75),transparent_42%),radial-gradient(circle_at_bottom_right,oklch(0.93_0.03_220/.45),transparent_40%)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-[1.1fr_.9fr] md:px-6 md:py-24">
        <div className="relative animate-in duration-700 fade-in slide-in-from-bottom-4 motion-reduce:animate-none">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            <Icon name="BookOpen" className="size-3.5" />
            Campus placement prep for Indian freshers
          </span>
          <h1 className="mt-5 max-w-3xl text-balance font-heading text-4xl leading-[1.03] font-extrabold tracking-[-0.04em] md:text-5xl lg:text-6xl">
            Stop preparing randomly.
            <span className="block text-primary">
              Know what to study next for the company you want.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            StudyBench turns placement prep into a daily system: company-wise tracks,
            section-wise practice, timed mocks, coding drills and one honest readiness score.
          </p>

          <div className="mt-6 grid gap-2 sm:max-w-xl">
            {HERO_POINTS.map((point) => (
              <p key={point} className="flex items-center gap-2 text-sm text-foreground/85">
                <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon name="Check" className="size-3.5" />
                </span>
                {point}
              </p>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <PrimaryCta href={startHref} placement="hero_primary" size="lg">
              Start free
            </PrimaryCta>
            <Button asChild size="lg" variant="outline">
              <Link
                href="#pricing"
                onClick={() => track("marketing_cta_click", { placement: "hero_pricing" })}
              >
                See pricing
              </Link>
            </Button>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            No card needed. Free users get the full first section in every track.
          </p>
        </div>

        <div className="relative animate-in duration-700 [animation-delay:120ms] fade-in slide-in-from-bottom-6 motion-reduce:animate-none">
          <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-[0_30px_80px_-50px_oklch(0.2_0.03_90/_0.35)]">
            <div className="flex items-center gap-5">
              <PriRing value={72} size={108} label="Overall" tone="success" />
              <div>
                <p className="font-heading text-lg font-semibold">Your readiness view</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  One score across every company you are targeting.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {PREVIEW.map((row) => {
                const company = SELECTABLE_COMPANIES.find((item) => item.id === row.id)!
                return (
                  <div key={row.id} className="flex items-center gap-3">
                    <CompanyAvatar id={row.id} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{company.short}</span>
                        <span className="tabular-nums text-muted-foreground">
                          PRI {row.pri} · ~{row.prob}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-sm bg-muted">
                        <div
                          className="h-full rounded-sm bg-primary"
                          style={{ width: `${row.pri}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">What improves paid conversion later</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Students convert when they already trust the free flow, see their weak areas,
                and want deeper mocks, chapter depth and coding practice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProofStrip() {
  return (
    <section className="bg-muted/35">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-6 md:grid-cols-4 md:px-6">
        {PROOF_POINTS.map((point) => (
          <div key={point.label} className="rounded-xl border border-border/80 bg-background/85 px-4 py-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              {point.label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{point.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProblemSection({ startHref }: { startHref: string }) {
  const cards = [
    {
      icon: "SearchX",
      title: "Most students lose time to scattered prep",
      body: "YouTube for aptitude, Telegram for PYQs, random blogs for HR, and no clear way to know what actually improves your odds.",
    },
    {
      icon: "ListChecks",
      title: "The app should tell you the next move",
      body: "Pick a company, finish one chapter, take one mock, review one weak area. Good prep needs that level of clarity.",
    },
    {
      icon: "TrendingUp",
      title: "Paid users appear after value becomes obvious",
      body: "Users upgrade when the free plan gets them started and the premium plan clearly unlocks more depth, more mocks and better feedback.",
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.03em]">
            Why visitors are not converting yet
          </h2>
          <p className="mt-2 text-muted-foreground">
            Your analytics suggest the drop happens before signup. The homepage needs
            to explain the offer faster, prove the free value, and make pricing feel clear.
          </p>
        </div>
        <PrimaryCta href={startHref} placement="problem_section_cta">
          Try the free plan
        </PrimaryCta>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-border bg-card p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon name={card.icon} className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeatureBento() {
  const features = [
    {
      icon: "Target",
      title: "Company-wise tracks",
      body: "Prepare differently for TCS, Infosys, Wipro, Accenture, Zoho, Cognizant and core placement prep.",
    },
    {
      icon: "BookOpen",
      title: "PYQ-style practice",
      body: "Pattern-aligned questions help students understand how each company actually tests aptitude, verbal and coding basics.",
    },
    {
      icon: "ClipboardList",
      title: "Timed mock tests",
      body: "Section-wise mock analysis shows whether the problem is speed, pressure, accuracy or a specific weak topic.",
    },
    {
      icon: "Code2",
      title: "Coding ladder",
      body: "Solve company-relevant problems with visible tests, hidden edge cases and practical editorials.",
    },
    {
      icon: "Mic",
      title: "Interview and communication",
      body: "Technical, HR, managerial and communication preparation live in the same product instead of separate tabs and notes.",
    },
    {
      icon: "BarChart3",
      title: "Readiness tracking",
      body: "The app turns daily actions into progress, weak-topic visibility and a single company-wise readiness score.",
    },
  ]

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.03em]">
            Everything a fresher needs in one prep flow
          </h2>
          <p className="mt-2 text-muted-foreground">
            Not just content volume. The value is that the app connects chapters,
            practice, mock tests and next-step guidance into one system.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon name={feature.icon} className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MethodSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-heading text-3xl font-bold tracking-[-0.03em]">
          Built around honest readiness, not fake guarantees
        </h2>
        <p className="mt-2 text-muted-foreground">
          The app should feel trustworthy before it tries to upsell. That trust is
          what improves paid conversion later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {METHOD_PRINCIPLES.map((principle) => (
          <div
            key={principle.title}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon name={principle.icon} className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-lg font-semibold">{principle.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {principle.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function PricingSection({ startHref }: { startHref: string }) {
  return (
    <section id="pricing" className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.03em]">
            Simple pricing with a clear free starting point
          </h2>
          <p className="mt-2 text-muted-foreground">
            Free should be good enough to start. Premium should be an obvious upgrade
            only when the student wants more depth and more company-specific practice.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-border bg-background p-6">
            <p className="text-sm font-semibold text-muted-foreground">Free</p>
            <p className="mt-2 font-heading text-3xl font-bold">Rs 0</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Enough to understand the flow, start learning, and decide whether the app is useful.
            </p>

            <div className="mt-5 space-y-3">
              {PLAN_FEATURES.slice(0, 4).map((row) => (
                <div key={row.feature} className="rounded-xl bg-muted/55 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {row.feature}
                  </p>
                  <p className="mt-1 text-sm">{row.free}</p>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" className="mt-6 w-full">
              <Link
                href={startHref}
                onClick={() => track("marketing_cta_click", { placement: "pricing_free" })}
              >
                Start free
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-primary/25 bg-background p-6 shadow-[0_30px_80px_-50px_oklch(0.2_0.03_90/_0.35)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Best for serious placement prep
                </p>
                <p className="mt-3 font-heading text-3xl font-bold">{premiumPriceLabel()}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Unlock deeper sections, full PYQ banks, company mock series, coding depth and better analytics once the free plan has already proven useful.
                </p>
              </div>
              <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Why people pay
                </p>
                <p className="mt-1 text-sm font-medium">
                  More depth, more mocks, better feedback
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PLAN_FEATURES.map((row) => (
                <div key={row.feature} className="rounded-xl bg-muted/50 px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {row.feature}
                  </p>
                  <p className="mt-1 text-sm font-medium">{row.premium}</p>
                </div>
              ))}
            </div>

            <Button asChild className="mt-6 w-full">
              <Link
                href={startHref}
                onClick={() => track("marketing_cta_click", { placement: "pricing_premium_path" })}
              >
                Start free and upgrade later
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function PrepJourneysSection({ startHref }: { startHref: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.03em]">
            How students use StudyBench to get interview-ready
          </h2>
          <p className="mt-2 text-muted-foreground">
            These are representative preparation journeys based on common fresher patterns, not named endorsements or guaranteed placement claims.
          </p>
        </div>
        <PrimaryCta href={startHref} placement="prep_journeys_cta">
          Start your journey
        </PrimaryCta>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PREP_JOURNEYS.map((journey) => (
          <article key={journey.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Preparation journey
              </span>
              <Icon name="Quote" className="size-4 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-semibold">{journey.title}</h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p>
                <span className="font-semibold text-foreground">Started with:</span>{" "}
                <span className="text-muted-foreground">{journey.stage}</span>
              </p>
              <p>
                <span className="font-semibold text-foreground">Used StudyBench to:</span>{" "}
                <span className="text-muted-foreground">{journey.path}</span>
              </p>
              <p>
                <span className="font-semibold text-foreground">Got better at:</span>{" "}
                <span className="text-muted-foreground">{journey.outcome}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function HomeFaqSection({ startHref }: { startHref: string }) {
  const featuredFaqs = FAQS.slice(0, 4)

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-heading text-3xl font-bold tracking-[-0.03em]">
              Questions students search before they start placement prep
            </h2>
            <p className="mt-2 text-muted-foreground">
              Clear answers help both search engines and students understand what the product actually does.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/faq" onClick={() => track("marketing_cta_click", { placement: "home_faq_open" })}>
              View all FAQs
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredFaqs.map((faq) => (
            <article key={faq.id} className="rounded-2xl border border-border bg-background p-5">
              <h3 className="font-heading text-lg font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer.replace(/\*\*/g, "")}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <p className="font-heading text-lg font-semibold">Ready to try the free plan?</p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Start with the free flow, see your first readiness signals, then decide if the deeper premium plan is worth it for you.
          </p>
          <PrimaryCta href={startHref} placement="home_faq_cta" className="mt-4">
            Start free
          </PrimaryCta>
        </div>
      </div>
    </section>
  )
}

function ShareScoreCta({ startHref }: { startHref: string }) {
  const { state, hydrated } = useStoreState()
  const primary = state.primary
  const company = getCompany(primary)
  const pri = hydrated ? computePRI(primary, state.progress[primary]) : 0
  const hasRealScore = hydrated && state.onboarded && pri > 0

  const shareText = hasRealScore
    ? `My ${company.short} placement readiness is ${pri}/100 on StudyBench. Track yours free:`
    : "I am preparing for campus placements on StudyBench. Track your readiness free:"
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${SITE_URL}`)}`

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-heading text-2xl font-bold">
            {hasRealScore
              ? `Your ${company.short} readiness is ${pri}/100`
              : "Know someone preparing for placements?"}
          </p>
          <p className="mt-2 text-muted-foreground">
            {hasRealScore
              ? "Share your real readiness score with a friend on WhatsApp."
              : "Send them a cleaner way to prepare than scattered notes and random videos."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("marketing_cta_click", { placement: "whatsapp_share" })}
            className="inline-flex items-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2.5 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
          >
            <Icon name="Share2" className="size-4" />
            Share on WhatsApp
          </a>
          <PrimaryCta href={startHref} placement="share_section_primary">
            Start your own prep
          </PrimaryCta>
        </div>
      </div>
    </section>
  )
}

function FinalCta({ startHref }: { startHref: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-10">
        <h2 className="max-w-3xl font-heading text-3xl font-bold tracking-[-0.03em]">
          The next growth step is simple: make the free plan easy to trust, then let premium sell the deeper value.
        </h2>
        <p className="mt-3 max-w-2xl text-primary-foreground/85">
          That is the path from visitors to signups, and from signups to paid users.
          Start with the free flow. Upgrade only when you want the full depth.
        </p>
        <PrimaryCta href={startHref} placement="final_cta" className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          Start free
        </PrimaryCta>
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
          <Link href="/prep" className="hover:text-foreground">
            Company guides
          </Link>
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
}

function PrimaryCta({
  href,
  placement,
  children,
  size,
  className,
}: {
  href: string
  placement: string
  children: React.ReactNode
  size?: "default" | "lg"
  className?: string
}) {
  return (
    <Button asChild size={size} className={className}>
      <Link href={href} onClick={() => track("marketing_cta_click", { placement })}>
        {children}
        <Icon name="ArrowRight" className="size-4" />
      </Link>
    </Button>
  )
}
