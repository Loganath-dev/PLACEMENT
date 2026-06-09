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
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            SB
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


