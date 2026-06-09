import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return NextResponse.json(
      { error: "Razorpay secret is not configured." },
      { status: 500 },
    )
  }

  const body = await request.json()
  const orderId = String(body.razorpay_order_id ?? "")
  const paymentId = String(body.razorpay_payment_id ?? "")
  const signature = String(body.razorpay_signature ?? "")
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing Razorpay verification fields." }, { status: 400 })
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")

  if (
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 })
  }

  const premiumUntil = new Date()
  premiumUntil.setFullYear(premiumUntil.getFullYear() + 1)

  return NextResponse.json({
    ok: true,
    paymentId,
    premiumUntil: premiumUntil.toISOString(),
  })
}
