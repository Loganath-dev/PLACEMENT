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
          background: "#0f172a",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            borderRadius: 104,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 255,
              height: 255,
              borderRadius: 56,
              background: "#2563eb",
              transform: "rotate(-8deg)",
              position: "absolute",
            }}
          />
          <div
            style={{
              width: 230,
              height: 230,
              borderRadius: 48,
              border: "24px solid #0f172a",
              background: "#ffffff",
              transform: "rotate(5deg)",
              position: "absolute",
            }}
          />
          {[183, 238, 293].map((top) => (
            <div
              key={top}
              style={{
                position: "absolute",
                width: 126,
                height: 24,
                borderRadius: 999,
                background: "#0f172a",
                top,
                left: 193,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              width: 86,
              height: 86,
              borderRadius: 999,
              background: "#14b8a6",
              right: 106,
              bottom: 107,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 19,
                height: 42,
                borderRadius: 999,
                background: "#ffffff",
                transform: "rotate(45deg)",
                left: 46,
                top: 22,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 19,
                height: 28,
                borderRadius: 999,
                background: "#ffffff",
                transform: "rotate(-45deg)",
                left: 27,
                top: 35,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 74,
            top: 67,
            color: "#ffffff",
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: -2,
            fontFamily: "Arial, sans-serif",
          }}
        >
          SB
        </div>
      </div>
    ),
    size,
  )
}
