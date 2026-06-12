import Link from "next/link"
import { cn } from "@/lib/utils"

export function StudyBenchMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-xl",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 64 64"
        className="size-full"
        role="img"
        aria-label="StudyBench"
      >
        <rect width="64" height="64" rx="16" fill="#EFF6FF" />
        <rect x="12" y="12" width="40" height="40" rx="12" fill="#FFFFFF" />
        <rect x="19" y="35" width="22" height="5.5" rx="2.75" fill="#0F172A" />
        <rect x="19" y="26.5" width="18" height="5.5" rx="2.75" fill="#2563EB" />
        <rect x="19" y="18" width="27" height="5.5" rx="2.75" fill="#F59E0B" />
        <path
          d="M30 45.5L44 31.5"
          stroke="#0F172A"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M39 31.5H44V36.5"
          stroke="#0F172A"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="48" cy="18" r="4" fill="#22C55E" />
      </svg>
    </span>
  )
}

export function StudyBenchWordmark({
  href = "/dashboard",
  size = "default",
  className,
}: {
  href?: string
  size?: "default" | "compact"
  className?: string
}) {
  const markSize = size === "compact" ? "size-8" : "size-10"
  const textSize = size === "compact" ? "text-lg" : "text-xl"

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-xl px-1.5 py-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        className,
      )}
    >
      <StudyBenchMark className={markSize} />
      <span
        className={cn(
          "font-heading tracking-[-0.02em] transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-75",
          textSize,
        )}
      >
        <span className="font-medium text-foreground/70">Study</span>
        <span className="font-extrabold text-primary">Bench</span>
      </span>
    </Link>
  )
}
