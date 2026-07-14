import { cn } from "@/lib/utils"

const TONE_VAR: Record<string, string> = {
  danger: "var(--destructive)",
  warning: "var(--warning)",
  info: "#2563eb", // Using a rich cobalt blue instead of default primary for a non-AI aesthetic
  success: "var(--success)",
}

/**
 * Signature readiness gauge (PRI). Pure SVG — no client JS — so it renders on
 * the server and still draws on. Enhanced with premium aesthetics.
 */
export function PriRing({
  value,
  size = 140,
  stroke = 14,
  label = "Readiness",
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
  const gid = `pri-grad-${tone}`

  // Faint graduation ticks sit just inside the track — the gauge "bezel".
  const tickR = r - stroke / 2 - 3.5
  const tickC = 2 * Math.PI * tickR

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>

        {/* Track with subtle inner shadow feel */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeOpacity={0.5}
          strokeWidth={stroke}
        />

        {/* Graduation ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={tickR > 0 ? tickR : 0}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity={0.2}
          strokeWidth={1}
          strokeDasharray={`1.5 ${Math.max(6, tickC / 36 - 1.5)}`}
        />

        {/* Progress arc — gradient + tinted glow, draws on from empty */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={
            {
              "--pri-c": `${c}`,
              "--pri-offset": `${offset}`,
              filter: `drop-shadow(0 4px 8px color-mix(in oklch, ${color} 30%, transparent))`,
              transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)",
            } as React.CSSProperties
          }
        />
        
        {/* Empty state pulsing ring when score is 0 */}
        {clamped === 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeOpacity={0.15}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`1 8`}
            className="animate-spin"
            style={{ transformOrigin: "center", animationDuration: "12s" }}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-4xl font-extrabold tabular-nums tracking-tight text-foreground">
          {clamped}
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
        {sublabel ? (
          <span className="mt-0.5 text-[10px] text-muted-foreground">{sublabel}</span>
        ) : null}
      </div>
    </div>
  )
}
