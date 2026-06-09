import { cn } from "@/lib/utils"

const TONE_VAR: Record<string, string> = {
  danger: "var(--destructive)",
  warning: "var(--warning)",
  info: "var(--primary)",
  success: "var(--success)",
}

/** Circular readiness gauge (PRI). Pure SVG - no client JS required. */
export function PriRing({
  value,
  size = 132,
  stroke = 11,
  label = "PRI",
  tone = "info",
  sublabel,
  className,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
  tone?: "danger" | "warning" | "info" | "success"
  sublabel?: string
  className?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, value))
  const offset = c - (clamped / 100) * c
  const color = TONE_VAR[tone]

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold tabular-nums leading-none">
          {clamped}
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {sublabel ? (
          <span className="mt-0.5 text-[11px] text-muted-foreground">{sublabel}</span>
        ) : null}
      </div>
    </div>
  )
}


