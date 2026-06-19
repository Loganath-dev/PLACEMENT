"use client"

import * as React from "react"
import { PREMIUM_OFFER_DURATION_MS } from "@/lib/access"
import { useStoreState } from "@/lib/store"

export interface LaunchOfferState {
  /** True once we have a real registration anchor + a client clock. */
  ready: boolean
  remainingMs: number
  expired: boolean
  hh: string
  mm: string
  ss: string
}

/**
 * Drives the first-time launch-offer countdown, anchored to the user's account
 * registration time (from the Supabase session). This makes the offer genuinely
 * "first-time, first hour" per account — it cannot be reset by clearing browser
 * storage or switching devices, and only brand-new registrations ever see the
 * live timer. Signed-out users (no anchor) get `ready: false` → nothing shown.
 */
export function useLaunchOffer(): LaunchOfferState {
  const { userCreatedAt } = useStoreState()
  const [now, setNow] = React.useState<number | null>(null)

  React.useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const anchor = userCreatedAt ? Date.parse(userCreatedAt) : NaN

  if (now === null || Number.isNaN(anchor)) {
    return { ready: false, remainingMs: PREMIUM_OFFER_DURATION_MS, expired: false, hh: "00", mm: "00", ss: "00" }
  }

  const remainingMs = Math.max(0, anchor + PREMIUM_OFFER_DURATION_MS - now)
  const totalSec = Math.floor(remainingMs / 1000)
  return {
    ready: true,
    remainingMs,
    expired: remainingMs <= 0,
    hh: String(Math.floor(totalSec / 3600)).padStart(2, "0"),
    mm: String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0"),
    ss: String(totalSec % 60).padStart(2, "0"),
  }
}
