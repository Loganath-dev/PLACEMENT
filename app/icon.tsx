import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = {
  width: 512,
  height: 512,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F172A",
          borderRadius: 112,
        }}
      >
        {/* Left page */}
        <div
          style={{
            position: "absolute",
            left: 88,
            top: 112,
            width: 150,
            height: 210,
            borderRadius: "18px 4px 4px 18px",
            background: "#818CF8",
            clipPath: "polygon(0 8%, 100% 0%, 100% 100%, 0 92%)",
          }}
        />
        {/* Right page */}
        <div
          style={{
            position: "absolute",
            right: 88,
            top: 112,
            width: 150,
            height: 210,
            borderRadius: "4px 18px 18px 4px",
            background: "#22D3EE",
            clipPath: "polygon(0 0%, 100% 8%, 100% 92%, 0 100%)",
          }}
        />
        {/* Lines on left page */}
        {[175, 220, 265].map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              left: 112,
              top,
              width: 100,
              height: 14,
              borderRadius: 999,
              background: "rgba(255,255,255,0.45)",
            }}
          />
        ))}
        {/* Lines on right page */}
        {[175, 220].map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              right: 112,
              top,
              width: 100,
              height: 14,
              borderRadius: 999,
              background: "rgba(255,255,255,0.45)",
            }}
          />
        ))}
        {/* Amber bench line */}
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 100,
            height: 28,
            borderRadius: 999,
            background: "#F59E0B",
          }}
        />
      </div>
    ),
    size,
  )
}
