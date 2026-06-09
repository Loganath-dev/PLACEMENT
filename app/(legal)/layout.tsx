import Link from "next/link"
import { Icon } from "@/components/app/icon"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-gradient-to-b from-accent/30 to-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="GraduationCap" className="size-4" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">
              Study<span className="text-primary">Bench</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <Icon name="ChevronRight" className="size-4 rotate-180" /> Back to home
          </Link>
        </div>
      </header>

      {children}

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} StudyBench. All rights reserved.</span>
          <nav className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}


