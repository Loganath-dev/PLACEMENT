import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontSize: 42,
          fontWeight: 900,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: 36,
            background: "#ffffff",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 82,
            height: 82,
            borderRadius: 18,
            border: "10px solid #0f172a",
            background: "#ffffff",
            transform: "rotate(5deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 38,
            bottom: 38,
            width: 34,
            height: 34,
            borderRadius: 999,
            background: "#14b8a6",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 8,
              height: 17,
              borderRadius: 999,
              background: "#ffffff",
              transform: "rotate(45deg)",
              left: 18,
              top: 8,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 8,
              height: 12,
              borderRadius: 999,
              background: "#ffffff",
              transform: "rotate(-45deg)",
              left: 11,
              top: 13,
            }}
          />
        </div>
        <div style={{ position: "absolute", left: 28, top: 26 }}>SB</div>
      </div>
    ),
    size,
  )
}
