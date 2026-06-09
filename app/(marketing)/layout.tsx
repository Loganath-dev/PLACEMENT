import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/app/icon"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-gradient-to-b from-accent/30 to-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="GraduationCap" className="size-4" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">
              Study<span className="text-primary">Bench</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium sm:gap-4">
            <Link href="/blog" className="px-2 text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/faq" className="px-2 text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <Button asChild size="sm">
              <Link href="/auth/signup">Start free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} StudyBench. All rights reserved.</span>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <Link href="/faq" className="hover:text-foreground">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}


