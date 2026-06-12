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
        {/* Background */}
        <rect width="64" height="64" rx="14" fill="#0F172A" />
        {/* Left page — indigo */}
        <path
          d="M14 19c7-2.8 13.2-2 18 2.6v25.8c-5-4-11-5-18-2.8V19Z"
          fill="#818CF8"
        />
        {/* Right page — cyan */}
        <path
          d="M50 19c-7-2.8-13.2-2-18 2.6v25.8c5-4 11-5 18-2.8V19Z"
          fill="#22D3EE"
        />
        {/* Spine */}
        <path d="M32 21.6v24" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* Left page text lines */}
        <path
          d="M19.5 28c3.2-.8 6-.4 8.5 1.1M19.5 34.5c3.2-.8 6-.4 8.5 1.1"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Right page text lines */}
        <path
          d="M36 29.1c2.5-1.5 5.3-1.9 8.5-1.1M36 35.6c2.5-1.5 5.3-1.9 8.5-1.1"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Amber bench line */}
        <path d="M11 51h42" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
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
        <span className="font-medium text-foreground/70">Study</span><span className="font-extrabold text-primary">Bench</span>
      </span>
    </Link>
  )
}
