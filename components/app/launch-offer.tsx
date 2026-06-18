"use client"

import { Icon } from "@/components/app/icon"
import {
  PREMIUM_DURATION_LABEL,
  PREMIUM_ORIGINAL_PRICE_INR,
  PREMIUM_PRICE_INR,
  premiumDiscountPercent,
} from "@/lib/access"
import { useLaunchOffer } from "@/lib/use-offer"
import { cn } from "@/lib/utils"

/** Monospace HH:MM:SS countdown segment. */
function Clock({ hh, mm, ss }: { hh: string; mm: string; ss: string }) {
  return (
    <span className="font-mono font-semibold tabular-nums">
      {hh}:{mm}:{ss}
    </span>
  )
}

/**
 * Launch-offer pricing: the real ₹1399/yr regular price struck through next to
 * the ₹399/yr launch price, the discount badge, and a live first-visit countdown.
 */
export function LaunchOffer({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact"
  className?: string
}) {
  const offer = useLaunchOffer()
  const showTimer = offer.ready && !offer.expired

  if (variant === "compact") {
    return (
      <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
        <span className="text-xs text-muted-foreground line-through">₹{PREMIUM_ORIGINAL_PRICE_INR}</span>
        <span className="font-heading text-base font-bold">₹{PREMIUM_PRICE_INR}</span>
        <span className="text-xs text-muted-foreground">/{PREMIUM_DURATION_LABEL}</span>
        {showTimer ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            <Icon name="Clock" className="size-3" />
            <Clock hh={offer.hh} mm={offer.mm} ss={offer.ss} />
          </span>
        ) : null}
      </span>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-base text-muted-foreground line-through">₹{PREMIUM_ORIGINAL_PRICE_INR}</span>
        <span className="font-heading text-3xl font-bold tracking-tight">₹{PREMIUM_PRICE_INR}</span>
        <span className="text-sm text-muted-foreground">/ {PREMIUM_DURATION_LABEL}</span>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-[color:var(--success)]">
          {premiumDiscountPercent()}% OFF
        </span>
      </div>
      {showTimer ? (
        <div className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.06] px-3 py-1.5 text-sm text-primary">
          <Icon name="Clock" className="size-4" />
          <span>Launch offer ends in</span>
          <Clock hh={offer.hh} mm={offer.mm} ss={offer.ss} />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Launch price — ₹{PREMIUM_PRICE_INR}/{PREMIUM_DURATION_LABEL} (regular ₹{PREMIUM_ORIGINAL_PRICE_INR}).
        </p>
      )}
    </div>
  )
}
