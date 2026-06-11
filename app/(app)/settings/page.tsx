"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@/components/app/icon"
import { PageHeader } from "@/components/app/page-header"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { FREE_COMPANY_CAP } from "@/lib/access"
import { SELECTABLE_COMPANIES, getCompany } from "@/lib/data/companies"
import { useStore } from "@/lib/store"
import type { CompanyId, Profile } from "@/lib/types"

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void }
  }
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpaySuccessResponse) => void
  prefill?: { name?: string }
  theme?: { color?: string }
}

type RazorpaySuccessResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}


export default function SettingsPage() {
  const {
    state,
    setPremium,
    setPrimary,
    addInterested,
    removeInterested,
    updateProfile,
    reset,
    deleteAccount,
  } = useStore()

  const available = SELECTABLE_COMPANIES.filter((c) => !state.interested.includes(c.id))
  const [checkingOut, setCheckingOut] = React.useState(false)
  const activeUntil = state.premiumUntil ?? null

  function tryAdd(id: CompanyId) {
    if (!state.premium && state.interested.length >= FREE_COMPANY_CAP) {
      toast.error("Upgrade to add more companies", {
        description: "Upgrade to Premium to prepare across every track.",
      })
      return
    }
    addInterested(id)
    toast.success(`Added ${getCompany(id).short}`)
  }

  async function startPremiumCheckout() {
    if (checkingOut) return
    setCheckingOut(true)
    try {
      await loadRazorpayCheckout()
      const orderResponse = await fetch("/api/razorpay/order", { method: "POST" })
      const order = await orderResponse.json()
      if (!orderResponse.ok) throw new Error(order.error ?? "Could not start checkout.")
      if (!window.Razorpay) throw new Error("Razorpay checkout did not load.")

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "StudyBench",
        description: "StudyBench Premium - 1 year",
        order_id: order.orderId,
        prefill: { name: state.profile.name },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          })
          const verified = await verifyResponse.json()
          if (!verifyResponse.ok) {
            toast.error(verified.error ?? "Payment verification failed")
            return
          }
          setPremium(true, verified.premiumUntil)
          toast.success("Premium activated", {
            description: "Payment verified and your plan is active for one year.",
          })
        },
      })
      checkout.open()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout")
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account setup"
        title="Settings"
        description="Subscription, target companies and your profile."
      />

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-base">
            <Icon name="Crown" className="size-4 text-primary" /> Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.premium ? (
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="flex items-center gap-1.5 font-semibold text-[color:var(--success)]">
                  <Icon name="CircleCheckBig" className="size-4" /> Premium active
                </p>
                <p className="text-sm text-muted-foreground">
                  All chapters, all companies, full PYQs, mocks and readiness unlocked.
                  {activeUntil ? ` Valid until ${new Date(activeUntil).toLocaleDateString()}.` : ""}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setPremium(false)
                  toast("Premium access removed on this device")
                }}
              >
                Remove access
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-primary/5 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-heading text-lg font-semibold">StudyBench Premium</p>
                <p className="text-sm text-muted-foreground">
                  Everything unlocked across all tracks for <strong>Rs 399/year</strong>. No ads.
                </p>
              </div>
              <Button
                onClick={startPremiumCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? "Opening checkout..." : "Pay with Razorpay"}
              </Button>
            </div>
          )}
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {PREMIUM_FEATURES.map((feature) => (
              <div key={feature} className="rounded-lg border border-border bg-muted/35 p-3 text-sm">
                {feature}
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* Target companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-base">
            <Icon name="Target" className="size-4 text-primary" /> Target companies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Primary (your dashboard focus)</Label>
            <Select value={state.primary} onValueChange={(v) => setPrimary(v as CompanyId)}>
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(state.interested.length ? state.interested : (["general"] as CompanyId[])).map(
                  (id) => (
                    <SelectItem key={id} value={id}>
                      {getCompany(id).name}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Interested companies</Label>
            <div className="mt-2 space-y-2">
              {state.interested.length === 0 ? (
                <p className="text-sm text-muted-foreground">None yet - add some below.</p>
              ) : (
                state.interested.map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-3 rounded-xl border border-border p-2.5"
                  >
                    <CompanyAvatar id={id} size={32} />
                    <span className="flex-1 font-medium">{getCompany(id).name}</span>
                    {id === state.primary ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Primary
                      </span>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        removeInterested(id)
                        toast(`Removed ${getCompany(id).short}`, {
                          description: "Progress is kept if you add it back.",
                        })
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {available.length > 0 ? (
            <div>
              <Label className="text-sm">Add a company</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {available.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => tryAdd(c.id)}
                    className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50"
                  >
                    <CompanyAvatar id={c.id} size={20} /> {c.short}
                    <Icon name="ArrowRight" className="size-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
              {!state.premium ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Upgrade to prepare across every company track.
                </p>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Profile */}
      <ProfileEditor profile={state.profile} onSave={updateProfile} />

      {/* Notifications */}
      <NotificationSettings />

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="font-heading text-base text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Reset progress</p>
              <p className="text-sm text-muted-foreground">
                Clear all progress, XP, streaks and target companies. Your account stays.
              </p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => {
                reset()
                toast("All progress reset")
              }}
            >
              Reset everything
            </Button>
          </div>

          <div className="h-px bg-destructive/15" />

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all personal data. This cannot be undone.
              </p>
            </div>
            <DeleteAccountDialog onConfirm={deleteAccount} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function loadRazorpayCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Checkout is available only in the browser."))
      return
    }
    if (window.Razorpay) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    )
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error("Razorpay checkout failed to load.")), {
        once: true,
      })
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Razorpay checkout failed to load."))
    document.body.appendChild(script)
  })
}

function DeleteAccountDialog({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")
  const [deleting, setDeleting] = React.useState(false)
  const canDelete = confirmText.trim().toUpperCase() === "DELETE"

  async function handleDelete() {
    if (!canDelete || deleting) return
    setDeleting(true)
    try {
      await onConfirm()
      toast("Your account and data have been deleted.")
      router.replace("/")
    } catch {
      setDeleting(false)
      toast.error("Couldn't delete your account. Please try again or contact support.")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setConfirmText("")
      }}
    >
      <DialogTrigger asChild>
        <Button className="shrink-0" variant="destructive">
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently erases your profile, progress, XP, streaks and subscription
            status. It cannot be undone. Type <strong>DELETE</strong> to confirm.
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          aria-label="Type DELETE to confirm"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={deleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" disabled={!canDelete || deleting} onClick={handleDelete}>
            {deleting ? (
              <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              "Delete permanently"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ProfileEditor({
  profile,
  onSave,
}: {
  profile: Profile
  onSave: (p: Partial<Profile>) => void
}) {
  const [draft, setDraft] = React.useState(profile)
  const fields: { key: keyof Profile; label: string }[] = [
    { key: "name", label: "Full name" },
    { key: "college", label: "College" },
    { key: "branch", label: "Branch" },
    { key: "gradYear", label: "Graduation year" },
    { key: "cgpa", label: "CGPA" },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading text-base">
          <Icon name="User" className="size-4 text-primary" /> Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-sm">{f.label}</Label>
              <Input
                value={draft[f.key]}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              onSave(draft)
              toast.success("Profile saved")
            }}
          >
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const NOTIF_PREFS_KEY = "studybench.notifs.v1"
const LEGACY_NOTIF_PREFS_KEY = "placeready.notifs.v1"
const DEFAULT_NOTIF_PREFS = { daily: true, drive: true, reengage: false }
type NotifPrefs = typeof DEFAULT_NOTIF_PREFS

const PREMIUM_FEATURES = [
  "All company tracks",
  "Full-length mocks",
  "Complete PYQ bank",
  "Interview answer bank",
  "Detailed analytics",
  "Revision sheets",
  "Coding practice ladder",
  "Mistake-based quizzes",
]

function NotificationSettings() {
  const [prefs, setPrefs] = React.useState<NotifPrefs>(() => {
    if (typeof window === "undefined") return DEFAULT_NOTIF_PREFS
    try {
      const raw = localStorage.getItem(NOTIF_PREFS_KEY) ?? localStorage.getItem(LEGACY_NOTIF_PREFS_KEY)
      if (!raw) return DEFAULT_NOTIF_PREFS
      if (!localStorage.getItem(NOTIF_PREFS_KEY)) {
        localStorage.setItem(NOTIF_PREFS_KEY, raw)
        localStorage.removeItem(LEGACY_NOTIF_PREFS_KEY)
      }
      return { ...DEFAULT_NOTIF_PREFS, ...JSON.parse(raw) }
    } catch {
      return DEFAULT_NOTIF_PREFS
    }
  })

  function update(key: keyof NotifPrefs, value: boolean) {
    setPrefs((p: NotifPrefs) => {
      const next = { ...p, [key]: value }
      try {
        localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(next))
      } catch {
        /* quota / private mode */
      }
      return next
    })
  }

  const items: { key: keyof NotifPrefs; label: string; desc: string }[] = [
    { key: "daily", label: "Daily challenge reminder", desc: "A nudge to keep your streak alive." },
    { key: "drive", label: "Drive-date countdown", desc: "Reminders as your drive approaches." },
    { key: "reengage", label: "Re-engagement emails", desc: "If you've been away for a while." },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading text-base">
          <Icon name="Bell" className="size-4 text-primary" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.key} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{it.label}</p>
              <p className="text-xs text-muted-foreground">{it.desc}</p>
            </div>
            <Switch
              checked={prefs[it.key]}
              onCheckedChange={(v) => update(it.key, v)}
            />
          </div>
        ))}
        <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          Your preferences are saved. Email &amp; push delivery roll out soon - until then these
          control what you&apos;ll receive at launch.
        </p>
      </CardContent>
    </Card>
  )
}


