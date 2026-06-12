import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F172A",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Left page — indigo */}
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 34,
            width: 58,
            height: 82,
            background: "#818CF8",
            borderRadius: "8px 3px 3px 8px",
          }}
        />
        {/* Right page — cyan */}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 34,
            width: 58,
            height: 82,
            background: "#22D3EE",
            borderRadius: "3px 8px 8px 3px",
          }}
        />
        {/* Spine */}
        <div
          style={{
            position: "absolute",
            left: 85,
            top: 34,
            width: 10,
            height: 82,
            background: "#0F172A",
          }}
        />
        {/* Left page lines */}
        <div style={{ position: "absolute", left: 30, top: 60, width: 42, height: 7, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ position: "absolute", left: 30, top: 74, width: 34, height: 7, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        {/* Right page lines */}
        <div style={{ position: "absolute", right: 30, top: 60, width: 42, height: 7, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ position: "absolute", right: 30, top: 74, width: 34, height: 7, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        {/* Amber bench line */}
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 30,
            height: 12,
            borderRadius: 999,
            background: "#F59E0B",
          }}
        />
      </div>
    ),
    size,
  )
}
