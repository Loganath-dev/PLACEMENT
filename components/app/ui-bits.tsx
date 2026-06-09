import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icon } from "@/components/app/icon"
import { getCompany } from "@/lib/data/companies"
import { getSections } from "@/lib/data/content"
import type { Band } from "@/lib/scoring"
import {
  computePRI,
  mockMastery,
  PRI_WEIGHTS,
  PROBABILITY_DISCLAIMER,
  sectionMastery,
} from "@/lib/scoring"
import type { CompanyId, CompanyProgress } from "@/lib/types"
import { cn } from "@/lib/utils"

/** Square initials chip tinted with the company accent. */
export function CompanyAvatar({
  id,
  size = 40,
  className,
}: {
  id: CompanyId
  size?: number
  className?: string
}) {
  const c = getCompany(id)
  const initials = c.short.slice(0, 2).toUpperCase()
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-heading font-bold text-white shadow-[inset_0_1px_0_oklch(1_0_0_/_24%),0_10px_24px_-18px_oklch(0.2_0.08_260_/_55%)]",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: c.accent,
        fontSize: size * 0.36,
      }}
      aria-hidden
    >
      {initials}
    </span>
  )
}

const TONE_CLASS: Record<Band["tone"], string> = {
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  info: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/15 text-[color:var(--success)] border-success/30",
}

export function ToneBadge({ band, className }: { band: Band; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md font-semibold", TONE_CLASS[band.tone], className)}
    >
      {band.label}
    </Badge>
  )
}

/** Readiness estimate with the mandatory "estimate, not a guarantee" note. */
export function ProbabilityStat(props: {
  value: number
  band: Band
  compact?: boolean
}) {
  const { value, compact = false } = props
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "font-heading font-bold tabular-nums",
          compact ? "text-base" : "text-2xl",
        )}
      >
        {value}%
      </span>
      <span className="text-xs text-muted-foreground">readiness estimate</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-muted-foreground/70 hover:text-foreground"
            aria-label="About this estimate"
          >
            <Icon name="CircleHelp" className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-56 text-center">
          {PROBABILITY_DISCLAIMER}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export function ProbabilityInputs({
  companyId,
  progress,
  compact = false,
}: {
  companyId: CompanyId
  progress: CompanyProgress
  compact?: boolean
}) {
  const company = getCompany(companyId)
  const pri = computePRI(companyId, progress)
  const mock = mockMastery(progress)
  const sections = getSections(companyId)
    .map((section) => ({
      label: section.short,
      value: sectionMastery(companyId, section.id, progress),
      weight: PRI_WEIGHTS[section.id],
    }))
    .sort((a, b) => a.value - b.value)
  const weakest = sections[0]

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/35 p-3 text-xs text-muted-foreground",
        compact ? "space-y-2" : "space-y-3",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <Icon name="ListChecks" className="size-3.5 text-primary" />
          Estimate inputs
        </span>
        <span>PRI {pri}/100</span>
        <span>Target {company.cutoffPRI}</span>
        <span>Mock avg {mock || "none"}</span>
        {weakest ? <span>Weakest {weakest.label} {weakest.value}%</span> : null}
      </div>
      {!compact ? (
        <div className="grid gap-1.5 sm:grid-cols-3">
          {sections.slice(0, 6).map((section) => (
            <div key={section.label} className="flex items-center justify-between gap-2">
              <span className="truncate">{section.label}</span>
              <span className="tabular-nums text-foreground">
                {section.value}% - {Math.round(section.weight * 100)}%
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <p>
        Uses only in-app chapter scores, mock average and this company&apos;s PRI target.
        It does not include eligibility, hiring demand, interview performance or recruiter decisions.
      </p>
    </div>
  )
}

/** Minimal markdown-ish renderer for lesson bodies. */
export function Prose({ body }: { body: string }) {
  const blocks = body.split("\n\n")
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-foreground/90">
      {blocks.map((block, i) => {
        const section = proseSection(block)
        if (section) {
          return (
            <div
              key={i}
              className={cn(
                "rounded-lg border p-3.5",
                section.tone === "example" &&
                  "border-primary/20 bg-primary/[0.06]",
                section.tone === "tip" &&
                  "border-success/25 bg-success/[0.08]",
                section.tone === "mistake" &&
                  "border-warning/30 bg-warning/[0.12]",
                section.tone === "practice" &&
                  "border-border bg-muted/45",
              )}
            >
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Icon name={section.icon} className="size-3.5" />
                {section.label}
              </p>
              <div>{renderInline(section.body)}</div>
            </div>
          )
        }

        if (isListBlock(block)) {
          return (
            <div key={i} className="rounded-lg bg-muted/35 p-3.5">
              {renderListBlock(block)}
            </div>
          )
        }

        return <p key={i}>{renderInline(block)}</p>
      })}
    </div>
  )
}

function proseSection(block: string) {
  const match = block.match(/^\*\*(Why recruiters test this|Worked example|Worked intuition|Example|Exam tip|Placement tip|Tip \/ trick|Shortcut|Shortcut mindset|Common mistake|Common trap|Practice like a topper|Fast revision loop|Interview transfer):\*\*\s*([\s\S]*)$/)
  if (!match) return null

  const [, label, body] = match
  const lowered = label.toLowerCase()
  if (lowered.includes("mistake") || lowered.includes("trap")) {
    return { label, body, tone: "mistake" as const, icon: "Flag" }
  }
  if (lowered.includes("recruiters")) {
    return { label, body, tone: "practice" as const, icon: "Briefcase" }
  }
  if (lowered.includes("tip") || lowered.includes("shortcut")) {
    return { label, body, tone: "tip" as const, icon: "Target" }
  }
  if (lowered.includes("practice") || lowered.includes("revision") || lowered.includes("transfer")) {
    return { label, body, tone: "practice" as const, icon: "Target" }
  }
  return { label, body, tone: "example" as const, icon: "BookOpen" }
}

function isListBlock(block: string) {
  return block
    .split("\n")
    .some((line) => /^(\d+\.|- )/.test(line.trim()))
}

function renderListBlock(block: string) {
  const lines = block.split("\n")
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim()
        const ordered = trimmed.match(/^(\d+)\.\s+(.*)$/)
        const unordered = trimmed.match(/^-\s+(.*)$/)
        if (ordered) {
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-background text-[11px] font-semibold text-primary ring-1 ring-border">
                {ordered[1]}
              </span>
              <span>{renderInline(ordered[2])}</span>
            </div>
          )
        }
        if (unordered) {
          return (
            <div key={index} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{renderInline(unordered[1])}</span>
            </div>
          )
        }
        return <p key={index}>{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text: string) {
  // Support **bold** only; render the rest as plain text with line breaks.
  const lines = text.split("\n")
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span key={li}>
        {parts.map((part, pi) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={pi} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={pi}>{part}</span>
          ),
        )}
        {li < lines.length - 1 ? <br /> : null}
      </span>
    )
  })
}

export function UpgradeBanner() {
  return (
    <div className="surface-panel flex flex-col items-start justify-between gap-3 rounded-xl border-primary/20 bg-[linear-gradient(135deg,var(--card),var(--accent))] p-4 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Icon name="Crown" className="size-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-sm font-semibold">Unlock StudyBench Premium</p>
          </div>
          <p className="text-sm text-muted-foreground">
            All chapters across every company, full PYQ bank, all mocks & full
            readiness for Rs 399/year.
          </p>
        </div>
      </div>
      <Button asChild className="shrink-0">
        <Link href="/settings">Go Premium</Link>
      </Button>
    </div>
  )
}

export function LockedFeatureCard({
  title,
  description,
  cta = "Upgrade",
}: {
  title: string
  description: string
  cta?: string
}) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-background text-primary ring-1 ring-border">
        <Icon name="Lock" className="size-5" />
      </span>
      <p className="mt-3 font-heading text-lg font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-4">
        <Link href="/settings">
          {cta} <Icon name="ArrowRight" className="size-4" />
        </Link>
      </Button>
    </div>
  )
}

export function SectionProgressBar({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon?: string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          {icon ? <Icon name={icon} className="size-3.5 text-muted-foreground" /> : null}
          {label}
        </span>
        <span className="tabular-nums text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted ring-1 ring-border/60">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}


