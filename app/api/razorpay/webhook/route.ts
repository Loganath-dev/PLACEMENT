import crypto from "crypto"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

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
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")

  if (
    !signature ||
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 })
  }

  const event = JSON.parse(rawBody)
  const eventName: string = event.event ?? ""

  if (eventName === "payment.captured" || eventName === "order.paid") {
    // Extract user ID from order notes (embedded at order creation).
    const userId: string | undefined =
      event.payload?.payment?.entity?.notes?.user_id ??
      event.payload?.order?.entity?.notes?.user_id

    if (userId) {
      const premiumUntil = new Date()
      premiumUntil.setFullYear(premiumUntil.getFullYear() + 1)

      const admin = createAdminClient()
      const { error } = await admin
        .from("user_state")
        .update({ premium: true, premium_until: premiumUntil.toISOString() })
        .eq("id", userId)

      if (error) {
        console.error("[webhook] Failed to activate premium for", userId, error)
        // Return 200 so Razorpay doesn't retry indefinitely.
        return NextResponse.json({ ok: false, error: error.message })
      }
      console.info("[webhook] Premium activated for user", userId)
    }
  }

  return NextResponse.json({ ok: true, event: eventName || "ignored" })
}
