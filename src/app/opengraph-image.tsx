import { ImageResponse } from "next/og";
import { WORDMARK_VIEWBOX, WORDMARK_F, WORDMARK_REST } from "@/components/brand/logo-paths";

export const alt = "Fader & Knob - Tone recipes from the songs you love.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Redesign tokens. next/og bundles Geist Regular as its default font, so
// the type is Geist with no font fetch at build time (one weight: 400).
const PAPER = "#ffffff";
const WASH = "#f6f6f4";
const INK = "#131416";
const ACCENT = "#e4a235";

export default function OGImage() {
  // Wordmark at 420px wide; height follows the viewBox.
  const [, , vbW, vbH] = WORDMARK_VIEWBOX.split(" ").map(Number);
  const markW = 420;
  const markH = Math.round((markW * vbH) / vbW);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          padding: 40,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: WASH,
            borderRadius: 30,
            padding: "64px 72px",
          }}
        >
          {/* The F swash is the one accent. */}
          <svg width={markW} height={markH} viewBox={WORDMARK_VIEWBOX}>
            {WORDMARK_F.map((d, i) => (
              <path key={`f${i}`} d={d} fill={ACCENT} />
            ))}
            {WORDMARK_REST.map((d, i) => (
              <path key={`r${i}`} d={d} fill={INK} />
            ))}
          </svg>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: INK,
              maxWidth: 900,
            }}
          >
            Tone recipes from the songs you love.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
