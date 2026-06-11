import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const PREMIUM_AMOUNT_INR = 399

/**
 * Creates a Razorpay order tied to the authenticated user.
 * The user ID is embedded in the `notes` field so the webhook can
 * activate premium server-side even if the client tab is closed.
 */
export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay keys are not configured." },
      { status: 500 },
    )
  }

  // Authenticate the caller.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }

  const receipt = `sb_${user.id.slice(0, 8)}_${Date.now()}`
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: PREMIUM_AMOUNT_INR * 100,
      currency: "INR",
      receipt,
      notes: { user_id: user.id }, // used by webhook for server-side activation
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    return NextResponse.json(
      { error: data?.error?.description ?? "Could not create Razorpay order." },
      { status: response.status },
    )
  }

  return NextResponse.json({
    keyId,
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    planName: "StudyBench Premium",
  })
}
