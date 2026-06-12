import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F172A",
          borderRadius: 108,
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
            left: 72,
            top: 100,
            width: 164,
            height: 228,
            background: "#818CF8",
            borderRadius: "20px 6px 6px 20px",
          }}
        />
        {/* Right page — cyan */}
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 100,
            width: 164,
            height: 228,
            background: "#22D3EE",
            borderRadius: "6px 20px 20px 6px",
          }}
        />
        {/* Centre spine — dark gap between pages */}
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 100,
            width: 32,
            height: 228,
            background: "#0F172A",
          }}
        />
        {/* Left page lines */}
        <div style={{ position: "absolute", left: 96,  top: 166, width: 116, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ position: "absolute", left: 96,  top: 210, width: 96,  height: 18, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ position: "absolute", left: 96,  top: 254, width: 108, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        {/* Right page lines */}
        <div style={{ position: "absolute", right: 96, top: 166, width: 116, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ position: "absolute", right: 96, top: 210, width: 96,  height: 18, borderRadius: 999, background: "rgba(255,255,255,0.55)" }} />
        {/* Amber bench line */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 90,
            height: 32,
            borderRadius: 999,
            background: "#F59E0B",
          }}
        />
      </div>
    ),
    size,
  )
}
