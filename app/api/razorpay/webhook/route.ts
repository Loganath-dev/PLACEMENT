import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { hmacSha256Hex, timingSafeStringEqual } from "@/lib/crypto/edge-hmac"

export const runtime = "edge"

/**
 * Razorpay webhook — server-side reconciliation for premium activation.
 * This fires even if the user's browser tab was closed after payment,
 * guaranteeing premium is activated via the notes.user_id embedded at order creation.
 */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "Razorpay webhook secret is not configured." },
      { status: 500 },
    )
  }

  const rawBody = await request.text()
  const signature = request.headers.get("x-razorpay-signature") ?? ""
  const expected = await hmacSha256Hex(secret, rawBody)

  if (!signature || !timingSafeStringEqual(expected, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 })
  }

  const event = JSON.parse(rawBody)
  const eventName: string = event.event ?? ""

  // Note: we do NOT reject "old" events. The HMAC signature already guarantees
  // authenticity, and Razorpay legitimately retries a signed delivery for hours
  // with backoff. Re-applying a signed activation is harmless because the update
  // below is idempotent (it never shortens an entitlement).

  if (eventName === "payment.captured" || eventName === "order.paid") {
    // Extract user ID from order notes (embedded at order creation).
    const userId: string | undefined =
      event.payload?.payment?.entity?.notes?.user_id ??
      event.payload?.order?.entity?.notes?.user_id

    if (userId) {
      const oneYearOut = new Date()
      oneYearOut.setFullYear(oneYearOut.getFullYear() + 1)

      const admin = createAdminClient()

      // Grant one year from now, but never shorten an existing, longer entitlement
      // (a promo grant or a still-valid prior purchase). Using max() also makes
      // retries safe: a re-delivered event recomputes the same value and never
      // downgrades the user.
      const { data: existing } = await admin
        .from("user_state")
        .select("premium_until")
        .eq("id", userId)
        .single()

      const existingUntil = existing?.premium_until ? new Date(existing.premium_until) : null
      const premiumUntil =
        existingUntil && existingUntil > oneYearOut ? existingUntil : oneYearOut

      const { error } = await admin
        .from("user_state")
        .update({ premium: true, premium_until: premiumUntil.toISOString() })
        .eq("id", userId)

      if (error) {
        console.error("[webhook] Failed to activate premium:", error.message)
        // Return 200 so Razorpay doesn't retry indefinitely.
        return NextResponse.json({ ok: false, error: error.message })
      }

      console.info("[webhook] Premium activation handled for event:", eventName)
    }
  }

  return NextResponse.json({ ok: true, event: eventName || "ignored" })
}
