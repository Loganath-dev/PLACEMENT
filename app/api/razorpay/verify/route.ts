import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { hmacSha256Hex, timingSafeStringEqual } from "@/lib/crypto/edge-hmac"

export const runtime = "edge"

/**
 * Verifies a Razorpay payment signature and, on success, writes premium=true
 * and premium_until to user_state using the service-role key so the client
 * cannot self-grant premium without a real payment.
 */
export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return NextResponse.json(
      { error: "Razorpay secret is not configured." },
      { status: 500 },
    )
  }

  // 1. Authenticate the caller from the session cookie.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }

  // 2. Verify Razorpay signature.
  const body = await request.json()
  const orderId = String(body.razorpay_order_id ?? "")
  const paymentId = String(body.razorpay_payment_id ?? "")
  const signature = String(body.razorpay_signature ?? "")
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing Razorpay verification fields." }, { status: 400 })
  }

  const expected = await hmacSha256Hex(keySecret, `${orderId}|${paymentId}`)

  if (!timingSafeStringEqual(expected, signature)) {
    return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 })
  }

  // 3. Write premium entitlement to the database via service-role key
  //    so the client cannot spoof this update.
  const premiumUntil = new Date()
  premiumUntil.setFullYear(premiumUntil.getFullYear() + 1)
  const premiumUntilIso = premiumUntil.toISOString()

  const admin = createAdminClient()
  const { error: dbError } = await admin
    .from("user_state")
    .update({ premium: true, premium_until: premiumUntilIso })
    .eq("id", user.id)

  if (dbError) {
    console.error("[razorpay/verify] DB write failed:", dbError)
    return NextResponse.json(
      { error: "Payment verified but could not activate premium. Contact support." },
      { status: 500 },
    )
  }

  return NextResponse.json({
    ok: true,
    paymentId,
    premiumUntil: premiumUntilIso,
  })
}
