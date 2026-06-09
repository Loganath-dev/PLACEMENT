"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"
import { Icon } from "@/components/app/icon"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLevel, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export interface NavItem {
  href: string
  label: string
  icon: string
}

/**
 * Primary navigation grouped into four zones (Plan / Learn / Practice / Review)
 * so the sidebar reads as an intentional workflow instead of a flat 12-item list.
 */
export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Plan",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/plan", label: "Weekly Plan", icon: "CalendarCheck" },
      { href: "/sprint", label: "7-Day Sprint", icon: "Target" },
    ],
  },
  {
    label: "Learn",
    items: [{ href: "/learn", label: "Tracks", icon: "GraduationCap" }],
  },
  {
    label: "Practice",
    items: [
      { href: "/practice", label: "PYQs", icon: "BookOpen" },
      { href: "/chapter-practice", label: "Chapter Practice", icon: "BookOpenCheck" },
      { href: "/coding", label: "Coding", icon: "Code2" },
      { href: "/mock", label: "Mock Tests", icon: "Target" },
      { href: "/interview", label: "Interview", icon: "Mic" },
      { href: "/challenges", label: "Daily Challenges", icon: "CalendarCheck" },
    ],
  },
  {
    label: "Review",
    items: [
      { href: "/readiness", label: "Readiness", icon: "TrendingUp" },
      { href: "/analytics", label: "Analytics", icon: "ChartColumn" },
      { href: "/revision", label: "Revision Sheets", icon: "NotebookTabs" },
      { href: "/mistakes", label: "Mistake Notebook", icon: "Flag" },
    ],
  },
]

/** Flat list kept for any consumer that needs every primary destination. */
export const NAV_ITEMS: readonly NavItem[] = NAV_GROUPS.flatMap((g) => g.items)

const FOOTER_ITEMS: NavItem[] = [
  { href: "/profile", label: "Profile", icon: "User" },
  { href: "/settings", label: "Settings", icon: "Settings" },
]

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_14px_28px_-18px_var(--primary)]">
        <Icon name="GraduationCap" className="size-5" />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight">
        Study<span className="text-primary">Bench</span>
      </span>
    </Link>
  )
}

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string
  label: string
  icon: string
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        active
          ? "bg-background text-sidebar-foreground shadow-sm ring-1 ring-sidebar-border"
          : "text-sidebar-foreground/65 hover:bg-background/70 hover:text-sidebar-foreground",
      )}
    >
      <Icon name={icon} className="size-[18px]" />
      {label}
    </Link>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useStore()
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  async function handleSignOut() {
    onNavigate?.()
    await signOut()
    router.push("/auth/login")
  }

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-0.5">
          <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase text-sidebar-foreground/45">
            {group.label}
          </p>
          {group.items.map((it) => (
            <NavLink key={it.href} {...it} active={isActive(it.href)} onClick={onNavigate} />
          ))}
        </div>
      ))}
      <div className="my-2 h-px bg-sidebar-border" />
      {FOOTER_ITEMS.map((it) => (
        <NavLink key={it.href} {...it} active={isActive(it.href)} onClick={onNavigate} />
      ))}
      <button
        type="button"
        onClick={handleSignOut}
        className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-sidebar-foreground/65 transition-colors hover:bg-background/70 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <Icon name="LogOut" className="size-[18px]" />
        Sign out
      </button>
    </nav>
  )
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-4 border-r border-sidebar-border bg-sidebar/95 p-4 backdrop-blur lg:flex">
      <div className="pt-2">
        <Brand />
      </div>
      <NavList />
      <PremiumNudge />
    </aside>
  )
}

function PremiumNudge() {
  const { state } = useStore()
  if (state.premium) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-xs">
        <p className="flex items-center gap-1.5 font-semibold text-[color:var(--success)]">
          <Icon name="Crown" className="size-3.5" /> Premium active
        </p>
        <p className="mt-1 text-muted-foreground">All tracks unlocked. Good luck!</p>
      </div>
    )
  }
  return (
    <Link
      href="/settings"
      className="block rounded-lg border border-primary/20 bg-background/70 p-3 text-xs transition-colors hover:bg-primary/10"
    >
      <p className="flex items-center gap-1.5 font-semibold text-primary">
        <Icon name="Crown" className="size-3.5" /> Go Premium
      </p>
      <p className="mt-1 text-muted-foreground">
        Unlock all chapters & companies for Rs 399/yr.
      </p>
    </Link>
  )
}

export function AppTopbar() {
  const { state } = useStore()
  const lvl = useLevel()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <MobileNav />
        <Brand />
      </div>
      <div className="hidden flex-1 lg:block" />
      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className="flex min-h-10 items-center gap-1.5 rounded-lg bg-warning/15 px-3 py-2 text-sm font-semibold text-warning-foreground"
          title="Daily streak"
        >
          <Icon name="CalendarCheck" className="size-4 text-primary" />
          <span className="tabular-nums">{state.streak.count}</span>
        </span>
        <Link
          href="/profile"
          className="flex min-h-10 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"
          title={`Level ${lvl.level} - ${state.xp} XP`}
        >
          <Icon name="Target" className="size-4" />
          <span className="tabular-nums">Lv {lvl.level}</span>
          <span className="hidden tabular-nums text-primary/70 sm:inline">
            - {state.xp} XP
          </span>
        </Link>
      </div>
    </header>
  )
}

function MobileNav() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Icon name="LayoutDashboard" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-4">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="mb-4 pt-2">
          <Brand />
        </div>
        <NavList onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}


