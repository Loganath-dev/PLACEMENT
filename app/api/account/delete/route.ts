import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Service-role deletion must run on the Node runtime (not edge).
export const runtime = "nodejs"

/**
 * Permanently deletes the signed-in user's account and all their data -
 * the DPDP "right to erasure" the Privacy Policy promises. Identity comes from
 * the session cookie (server client); the destructive work uses the service-role
 * admin client. Deleting the auth user cascades to every owned row via the
 * ON DELETE CASCADE foreign keys, but we also delete rows explicitly so erasure
 * is complete even if the cascade migration hasn't been applied yet.
 */
export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }

  const admin = createAdminClient()
  const uid = user.id

  await Promise.allSettled([
    admin.from("company_progress").delete().eq("user_id", uid),
    admin.from("daily_challenges").delete().eq("id", uid),
    admin.from("user_state").delete().eq("id", uid),
    admin.from("profiles").delete().eq("id", uid),
  ])

  const { error } = await admin.auth.admin.deleteUser(uid)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}


