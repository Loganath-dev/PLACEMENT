// Referral capture: the /invite page links to /auth/signup?ref=<uid>. We stash
// that uid client-side at signup time and only attribute it once we have a
// real authenticated uid to attribute it to (after onboarding completes) —
// signup itself may not yield a session yet if email confirmation is on.

import { SITE_URL } from "@/lib/content/blocks"

const PENDING_REFERRAL_KEY = "sb_pending_referral"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function capturePendingReferral(ref: string | null | undefined): void {
  if (typeof window === "undefined" || !ref || !UUID_RE.test(ref)) return
  // First referrer wins if multiple invite links were opened before signing up.
  if (window.localStorage.getItem(PENDING_REFERRAL_KEY)) return
  window.localStorage.setItem(PENDING_REFERRAL_KEY, ref)
}

/** Reads and clears the pending referral. Returns null for self-referrals or bad data. */
export function consumePendingReferral(currentUserId: string): string | null {
  if (typeof window === "undefined") return null
  const ref = window.localStorage.getItem(PENDING_REFERRAL_KEY)
  window.localStorage.removeItem(PENDING_REFERRAL_KEY)
  if (!ref || !UUID_RE.test(ref) || ref === currentUserId) return null
  return ref
}

export function referralLink(userId: string): string {
  return `${SITE_URL}/invite?ref=${userId}`
}
