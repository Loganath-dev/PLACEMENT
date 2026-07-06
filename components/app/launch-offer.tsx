"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/app/icon"
import {
  PREMIUM_DURATION_LABEL,
  PREMIUM_ORIGINAL_PRICE_INR,
  PREMIUM_PRICE_INR,
  premiumDiscountPercent,
} from "@/lib/access"
import { useStoreSelector } from "@/lib/store"
import { useLaunchOffer } from "@/lib/use-offer"
import { cn } from "@/lib/utils"

const SAVINGS = PREMIUM_ORIGINAL_PRICE_INR - PREMIUM_PRICE_INR

/** One boxed countdown digit-pair with its unit label, in an urgency red. */
function TimerUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="grid h-9 min-w-9 place-items-center rounded-md bg-destructive/10 px-1.5 font-mono text-lg font-bold tabular-nums text-[color:var(--destructive)] ring-1 ring-destructive/20">
        {value}
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return (
    <span className="flex h-9 items-center font-mono text-lg font-bold text-[color:var(--destructive)]">
      :
    </span>
  )
}

/**
 * Launch-offer pricing block. During the first-visit window it anchors the real
 * ₹1399/yr regular price against the ₹399/yr launch price with a boxed,
 * urgency-coloured countdown (the high-conversion pattern). Once the window
 * ends it collapses to a clean ₹399/yr — no fake reset.
 */
export function LaunchOffer({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact"
  className?: string
}) {
  const offer = useLaunchOffer()
  const live = offer.ready && !offer.expired

  // After the launch window: just the plain price (₹1399 becomes the price later).
  if (offer.ready && offer.expired) {
    if (variant === "compact") {
      return (
        <span className={cn("font-heading text-base font-bold", className)}>
          ₹{PREMIUM_PRICE_INR}
          <span className="text-xs font-normal text-muted-foreground">/{PREMIUM_DURATION_LABEL}</span>
        </span>
      )
    }
    return (
      <p className={cn("font-heading text-2xl font-bold", className)}>
        ₹{PREMIUM_PRICE_INR}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          / {PREMIUM_DURATION_LABEL}
        </span>
      </p>
    )
  }

  if (variant === "compact") {
    return (
      <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
        <span className="text-xs text-muted-foreground line-through">₹{PREMIUM_ORIGINAL_PRICE_INR}</span>
        <span className="font-heading text-base font-bold">₹{PREMIUM_PRICE_INR}</span>
        <span className="text-xs text-muted-foreground">/{PREMIUM_DURATION_LABEL}</span>
        {live ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-[color:var(--destructive)] ring-1 ring-destructive/15">
            <span className="size-1.5 rounded-full bg-[color:var(--destructive)] motion-safe:animate-pulse" />
            <span className="font-mono tabular-nums">
              {offer.hh}:{offer.mm}:{offer.ss}
            </span>
          </span>
        ) : null}
      </span>
    )
  }

  // Full block (settings).
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-[color:var(--destructive)]">
          {premiumDiscountPercent()}% OFF
        </span>
        <span className="text-xs font-semibold text-muted-foreground">
          Save ₹{SAVINGS.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-base text-muted-foreground line-through">₹{PREMIUM_ORIGINAL_PRICE_INR}</span>
        <span className="font-heading text-3xl font-bold tracking-tight">₹{PREMIUM_PRICE_INR}</span>
        <span className="text-sm text-muted-foreground">/ {PREMIUM_DURATION_LABEL}</span>
      </div>
      {live ? (
        <div className="inline-flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.05] px-3 py-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[color:var(--destructive)]">
            <Icon name="Clock" className="size-3.5" /> Ends in
          </span>
          <div className="flex items-start gap-1">
            <TimerUnit value={offer.hh} label="hrs" />
            <Colon />
            <TimerUnit value={offer.mm} label="min" />
            <Colon />
            <TimerUnit value={offer.ss} label="sec" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Prominent top-of-dashboard welcome banner. Shows ONLY to a brand-new,
 * non-premium account while its first-hour launch window is still live —
 * renders nothing for premium users or once the window has passed.
 */
export function LaunchOfferBanner({ className }: { className?: string }) {
  const premium = useStoreSelector((store) => store.state.premium)
  const offer = useLaunchOffer()

  if (premium || !offer.ready || offer.expired) return null

  return (
    <div
      className={cn(
        "animate-rise overflow-hidden rounded-2xl border border-destructive/20 bg-[linear-gradient(135deg,var(--accent),transparent)] p-4 shadow-[0_18px_48px_-34px_oklch(0.55_0.2_27_/_45%)] sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-bold text-[color:var(--destructive)]">
            <Icon name="Crown" className="size-4" /> Welcome offer — new members only
          </p>
          <LaunchOffer />
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/settings">
            Claim ₹{PREMIUM_PRICE_INR} <Icon name="ArrowRight" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
