import { NextResponse } from "next/server"

const PREMIUM_AMOUNT_INR = 399

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay keys are not configured." },
      { status: 500 },
    )
  }

  const receipt = `studybench_${Date.now()}`
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
