import { ImageResponse } from "next/og";

export const alt = "Fader & Knob - Tone recipes from the songs you love.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          fontFamily: "system-ui, sans-serif",
          padding: 80,
        }}
      >
        {/* FK badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 16,
            background: "#1a1a24",
            border: "2px solid #f59e0b",
            color: "#f59e0b",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          FK
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Fader & Knob
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: "#f59e0b",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Tone recipes from the songs you love.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
