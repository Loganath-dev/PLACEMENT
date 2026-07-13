"use client"

import Link from "next/link"
import * as React from "react"
import { Menu } from "lucide-react"
import { StudyBenchMark, StudyBenchWordmark } from "@/components/app/brand"
import { Icon } from "@/components/app/icon"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { track } from "@/lib/analytics"
import { FAQS } from "@/lib/content/faq"
import { useStoreState } from "@/lib/store"

const NAV_LINKS = [
  { href: "/prep", label: "Company guides" },
  { href: "/blog", label: "Preparation guide" },
  { href: "/faq", label: "Help" },
]

const STUDY_STEPS = [
  {
    number: "01",
    title: "Choose your target",
    body: "Select the companies you are applying to. Each track puts the right aptitude, coding and interview work together.",
  },
  {
    number: "02",
    title: "Finish today's task",
    body: "Follow a short chapter, practice the pattern, and save mistakes for revision. No searching through scattered notes.",
  },
  {
    number: "03",
    title: "Test and improve",
    body: "Use mocks to find the topics costing you marks, then return to the exact chapter that needs attention.",
  },
]

const STUDY_AREAS = [
  { icon: "Calculator", title: "Aptitude and reasoning", body: "Build speed in the topics that appear in screening tests." },
  { icon: "Code2", title: "Coding practice", body: "Work through beginner-friendly problems, visible cases and practical explanations." },
  { icon: "ClipboardCheck", title: "Mocks and review", body: "Practise with a timer, then use your result to decide what to revise next." },
  { icon: "Mic", title: "Interview preparation", body: "Prepare technical, HR and communication answers with clear prompts." },
]

export function LandingPage() {
  const { state, hydrated } = useStoreState()
  const startHref = hydrated && state.onboarded ? "/dashboard" : "/auth/signup"

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader startHref={startHref} />
      <main>
        <Hero startHref={startHref} />
        <StudySteps />
        <StudyAreas />
        <PracticeSection startHref={startHref} />
        <FaqPreview />
        <FinalCta startHref={startHref} />
      </main>
      <SiteFooter />
    </div>
  )
}

function SiteHeader({ startHref }: { startHref: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <StudyBenchWordmark href="/" />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/auth/login">Sign in</Link></Button>
          <PrimaryCta href={startHref} placement="header_primary">Start preparing</PrimaryCta>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu"><Menu className="size-5" /></Button></SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-heading"><StudyBenchMark className="size-8" />StudyBench</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">{link.label}</Link>)}
                <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">Sign in</Link>
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
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.08fr_.92fr] md:items-center md:px-6 md:py-24">
        <div>
          <p className="font-mono text-xs font-semibold tracking-[0.1em] text-primary uppercase">Campus placement preparation</p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
            Prepare for your campus placement, one task at a time.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Choose your target company. Study the right chapters. Take mocks. Fix weak topics before the drive.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryCta href={startHref} placement="hero_primary" size="lg">Start preparing</PrimaryCta>
            <Button asChild variant="outline" size="lg"><Link href="/prep">View company tracks</Link></Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Start with the free study path. Keep going when it helps you.</p>
        </div>

        <div className="border border-border bg-card p-5 shadow-[0_22px_55px_-42px_oklch(0.28_0.04_80_/_0.38)] sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div><p className="font-heading text-lg font-semibold">Today&apos;s study plan</p><p className="mt-1 text-sm text-muted-foreground">TCS preparation</p></div>
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">45 min</span>
          </div>
          <ol className="mt-4 space-y-3">
            <PlanRow number="1" title="Percentages: practice set" detail="12 questions" done />
            <PlanRow number="2" title="Arrays: starter problem" detail="20 minutes" />
            <PlanRow number="3" title="Review your mistakes" detail="6 cards due" />
          </ol>
          <div className="mt-5 border-t border-border pt-4"><p className="text-sm font-medium">Next mock</p><p className="mt-1 text-sm text-muted-foreground">Try a timed core-prep mock this week.</p></div>
        </div>
      </div>
    </section>
  )
}

function PlanRow({ number, title, detail, done = false }: { number: string; title: string; detail: string; done?: boolean }) {
  return <li className="flex items-center gap-3"><span className={done ? "grid size-7 place-items-center rounded-full bg-success/15 text-[color:var(--success)]" : "grid size-7 place-items-center rounded-full bg-muted text-muted-foreground"}>{done ? <Icon name="Check" className="size-4" /> : number}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{detail}</p></div><Icon name="ChevronRight" className="size-4 text-muted-foreground" /></li>
}

function StudySteps() {
  return <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20"><div className="max-w-2xl"><p className="text-sm font-semibold text-primary">A clear routine</p><h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">A practical path from first chapter to final round.</h2></div><div className="mt-9 grid gap-0 border-y border-border md:grid-cols-3">{STUDY_STEPS.map((step) => <article key={step.number} className="border-b border-border py-6 last:border-b-0 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0"><p className="font-mono text-sm font-semibold text-primary">{step.number}</p><h3 className="mt-5 font-heading text-xl font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p></article>)}</div></section>
}

function StudyAreas() {
  return <section className="bg-muted/45"><div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20"><div className="max-w-2xl"><p className="text-sm font-semibold text-primary">What you will practise</p><h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">The work that actually appears in placement rounds.</h2></div><div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">{STUDY_AREAS.map((area) => <article key={area.title} className="flex gap-4 border-b border-border pb-6"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-card text-primary"><Icon name={area.icon} className="size-5" /></span><div><h3 className="font-heading text-lg font-semibold">{area.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{area.body}</p></div></article>)}</div></div></section>
}

function PracticeSection({ startHref }: { startHref: string }) {
  return <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[.75fr_1.25fr] md:items-start md:px-6 md:py-20"><div><p className="text-sm font-semibold text-primary">Built for revision</p><h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">Do not lose the questions that taught you something.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Wrong answers return in your Mistake Notebook. Use it for a short revision session before your next mock.</p><PrimaryCta href={startHref} placement="revision_cta" className="mt-6">Create your study plan</PrimaryCta></div><div className="border-l-4 border-primary bg-card p-5 sm:p-6"><p className="font-heading text-xl font-semibold">Trainer note</p><p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Do not wait to complete every topic before taking a mock. Take one early, identify the 2 or 3 topics that cost marks, and revise those first.</p><div className="mt-5 flex flex-wrap gap-2">{["Why this matters", "Common wrong answer", "Exam trap", "Review in 3 days"].map((item) => <span key={item} className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">{item}</span>)}</div></div></section>
}

function FaqPreview() {
  return <section className="bg-muted/45"><div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Before you start</p><h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">Questions students usually ask.</h2></div><Button asChild variant="outline"><Link href="/faq">View all help</Link></Button></div><div className="mt-8 grid gap-6 md:grid-cols-2">{FAQS.slice(0, 4).map((faq) => <article key={faq.id} className="border-b border-border pb-5"><h3 className="font-heading text-lg font-semibold">{faq.question}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer.replace(/\*\*/g, "")}</p></article>)}</div></div></section>
}

function FinalCta({ startHref }: { startHref: string }) {
  return <section className="mx-auto max-w-6xl px-4 py-16 md:px-6"><div className="border border-primary/25 bg-primary/8 px-6 py-10 sm:px-10"><h2 className="max-w-2xl font-heading text-3xl font-bold tracking-tight">Start with the company you want to prepare for.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Build a study plan you can actually finish this week.</p><PrimaryCta href={startHref} placement="final_cta" className="mt-6">Start preparing</PrimaryCta></div></section>
}

function SiteFooter() {
  return <footer className="border-t border-border"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6"><p>Copyright {new Date().getFullYear()} StudyBench.</p><div className="flex flex-wrap gap-4"><Link href="/privacy" className="hover:text-foreground">Privacy</Link><Link href="/terms" className="hover:text-foreground">Terms</Link></div></div></footer>
}

function PrimaryCta({ href, placement, children, size, className }: { href: string; placement: string; children: React.ReactNode; size?: "default" | "lg"; className?: string }) {
  return <Button asChild size={size} className={className}><Link href={href} onClick={() => track("marketing_cta_click", { placement })}>{children}<Icon name="ArrowRight" className="size-4" /></Link></Button>
}
