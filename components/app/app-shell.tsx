"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { AppSidebar, AppTopbar } from "@/components/app/nav"
import { SyncErrorBanner } from "@/components/app/sync-error-banner"
import { useStoreState } from "@/lib/store"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state, hydrated } = useStoreState()
  const router = useRouter()

  React.useEffect(() => {
    if (hydrated && !state.onboarded) router.replace("/onboarding")
  }, [hydrated, state.onboarded, router])

  if (!hydrated) {
    return (
      <div className="grid min-h-svh place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-sm">Loading StudyBench...</p>
        </div>
      </div>
    )
  }

  if (!state.onboarded) return null

  return (
    <div className="flex min-h-svh">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-background px-4 py-2 text-sm font-semibold text-foreground shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SyncErrorBanner />
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
