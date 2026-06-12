import { ImageResponse } from "next/og"
import { SITE_NAME } from "@/lib/content/blocks"

export const runtime = "edge"
export const alt = "StudyBench campus placement preparation app"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fafc",
          color: "#0f172a",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#0F172A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Left page */}
            <div style={{ position: "absolute", left: 14, top: 18, width: 21, height: 28, borderRadius: "5px 2px 2px 5px", background: "#818CF8" }} />
            {/* Right page */}
            <div style={{ position: "absolute", right: 14, top: 18, width: 21, height: 28, borderRadius: "2px 5px 5px 2px", background: "#22D3EE" }} />
            {/* Bench line */}
            <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, height: 6, borderRadius: 999, background: "#F59E0B" }} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>{SITE_NAME}</div>
        </div>
        <div>
          <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.05, maxWidth: 960 }}>
            Campus placement preparation for Indian freshers
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#475569", maxWidth: 920 }}>
            Aptitude, coding, CS core, mocks, PYQs, interviews and readiness analytics in one app.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#1d4ed8", fontWeight: 700 }}>
          <span>Company-wise tracks</span>
          <span>-</span>
          <span>Mock tests</span>
          <span>-</span>
          <span>Readiness score</span>
        </div>
      </div>
    ),
    size,
  )
}


