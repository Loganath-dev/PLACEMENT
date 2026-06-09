import crypto from "crypto"
import { NextResponse } from "next/server"

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
  if (event.event === "order.paid" || event.event === "payment.captured") {
    return NextResponse.json({ ok: true, event: event.event })
  }

  return NextResponse.json({ ok: true, event: event.event ?? "ignored" })
}
