"use client"

import * as React from "react"
import { PREMIUM_OFFER_DURATION_MS } from "@/lib/access"

const KEY = "studybench.offer.startedAt"

export interface LaunchOfferState {
  /** True once hydrated on the client (avoids SSR flash). */
  ready: boolean
  remainingMs: number
  expired: boolean
  hh: string
  mm: string
  ss: string
}

/**
 * Drives the first-visit launch-offer countdown. The window starts the first
 * time a user lands (persisted per device in localStorage) and runs for
 * PREMIUM_OFFER_DURATION_MS. This is a genuine launch offer — ₹1399 is the real
 * regular price and ₹399 the launch price — so the urgency is honest, not a
 * resetting fake timer.
 */
export function useLaunchOffer(): LaunchOfferState {
  const [startedAt, setStartedAt] = React.useState<number | null>(null)
  const [now, setNow] = React.useState<number | null>(null)

  React.useEffect(() => {
    let start: number
    try {
      const raw = localStorage.getItem(KEY)
      const parsed = raw ? Number(raw) : NaN
      if (Number.isFinite(parsed)) {
        start = parsed
      } else {
        start = Date.now()
        localStorage.setItem(KEY, String(start))
      }
    } catch {
      start = Date.now()
    }
    setStartedAt(start)
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (startedAt === null || now === null) {
    return { ready: false, remainingMs: PREMIUM_OFFER_DURATION_MS, expired: false, hh: "00", mm: "00", ss: "00" }
  }

  const remainingMs = Math.max(0, startedAt + PREMIUM_OFFER_DURATION_MS - now)
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
