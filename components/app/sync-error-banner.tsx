"use client"

import * as React from "react"
import { toast } from "sonner"
import { syncAll } from "@/lib/supabase/db"
import { useStoreState } from "@/lib/store"

/**
 * Invisible component that listens for Supabase sync failures and surfaces a
 * dismissible toast with a one-click retry. Uses refs so it never re-renders
 * on state changes — the only purpose is to react to the sync-error event.
 */
export function SyncErrorBanner() {
  const { state, userId } = useStoreState()
  const stateRef = React.useRef(state)
  const userIdRef = React.useRef(userId)

  React.useEffect(() => {
    stateRef.current = state
  }, [state])
  React.useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  React.useEffect(() => {
    function handler() {
      toast.warning("Sync failed — changes saved locally", {
        id: "sync-error",
        description: "Your progress is safe. We'll retry on the next action.",
        action: {
          label: "Retry now",
          onClick: () => {
            const uid = userIdRef.current
            if (uid) syncAll(uid, stateRef.current)
          },
        },
      })
    }
    window.addEventListener("studybench:sync-error", handler)
    return () => window.removeEventListener("studybench:sync-error", handler)
  }, [])

  return null
}
