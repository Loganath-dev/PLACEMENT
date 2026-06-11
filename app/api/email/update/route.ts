import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildProductUpdateEmail, sendEmail } from "@/lib/email/resend"

export const runtime = "edge"

const MAX_TITLE_LENGTH = 90
const MAX_MESSAGE_LENGTH = 800

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const title =
    typeof body.title === "string" ? body.title.slice(0, MAX_TITLE_LENGTH) : "StudyBench update"
  const message =
    typeof body.message === "string"
      ? body.message.slice(0, MAX_MESSAGE_LENGTH)
      : "Your StudyBench preparation updates are enabled."

  const email = buildProductUpdateEmail({
    title,
    message,
    ctaLabel: "Continue preparing",
  })

  const result = await sendEmail({
    to: user.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  })

  if (!result.ok) {
    console.error("[email/update] Resend failed:", result.error)
    return NextResponse.json({ error: "Could not send update email." }, { status: 502 })
  }

  return NextResponse.json({ ok: true, skipped: result.skipped ?? false })
}
