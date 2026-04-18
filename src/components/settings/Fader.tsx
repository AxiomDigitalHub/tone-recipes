import type { CSSProperties } from "react";

/**
 * <Fader> — linear slider visualization for settings that feel more like a
 * studio fader than a rotary knob: mix levels, thresholds in dB, filter
 * frequencies, time-based parameters.
 *
 * Same visual language family as <Knob>: thin strokes, dark body, accent-color
 * fill on the active portion, value + label below.
 *
 * Use Fader for:
 *   - dB values with a large range (e.g. -60..0)
 *   - Linear 0..1 mixes where a slider makes more sense visually
 *   - Long time/frequency values that don't fit an amp-knob convention
 *
 * Use Knob for:
 *   - Traditional 0..10 amp controls
 *   - Any setting with a "sweep" mental model (gain, treble, presence)
 */

export interface FaderProps {
  name: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: "sm" | "md" | "lg";
  display?: string;
  color?: string;
  /** Optional neutral/default value. Renders a small notch across the track
   *  at that position. Same semantics as Knob's `neutral` prop. */
  neutral?: number;
}

const SIZE_MAP = {
  sm: { trackHeight: 72, width: 36, valueSize: 13, labelSize: 9 },
  md: { trackHeight: 96, width: 48, valueSize: 16, labelSize: 10 },
  lg: { trackHeight: 140, width: 64, valueSize: 22, labelSize: 11 },
} as const;

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export default function Fader({
  name,
  value: rawValue,
  min = 0,
  max = 10,
  unit,
  size = "md",
  display,
  color,
  neutral,
}: FaderProps) {
  const value =
    typeof rawValue === "number" && Number.isFinite(rawValue) ? rawValue : min;
  const { trackHeight, width, valueSize, labelSize } = SIZE_MAP[size];
  const trackWidth = 4;
  const capHeight = 14;
  const capWidth = width - 8;

  // Handle position: top of track (highest value) to bottom (lowest)
  const pct = max === min ? 0 : clamp((value - min) / (max - min), 0, 1);
  const capY = (1 - pct) * (trackHeight - capHeight);

  const isBipolar = min < 0 && max > 0;
  const printed = display ?? formatValue(value, isBipolar);
  const ariaLabel = `${name}: ${printed}${unit ? ` ${unit}` : ""}`;

  const accentColor = color ?? "var(--color-accent, #f59e0b)";
  const bodyFill = "var(--color-surface, #0b0f1a)";
  const borderColor = "var(--color-border, #1e2840)";
  const mutedColor = "var(--color-muted, #5a6880)";

  // Tick marks on the side of the track
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const y = (i / (tickCount - 1)) * trackHeight;
    return y;
  });

  const containerStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    verticalAlign: "middle",
  };

  return (
    <div role="meter" aria-label={ariaLabel} aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} style={containerStyle}>
      <svg
        width={width}
        height={trackHeight + 8}
        viewBox={`0 0 ${width} ${trackHeight + 8}`}
        style={{ display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Tick marks on the right side */}
        {ticks.map((y, i) => (
          <line
            key={i}
            x1={width / 2 + trackWidth / 2 + 4}
            y1={y + capHeight / 2}
            x2={width / 2 + trackWidth / 2 + 8}
            y2={y + capHeight / 2}
            stroke={i === 0 || i === tickCount - 1 ? mutedColor : borderColor}
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}

        {/* Track background — full-length thin rectangle */}
        <rect
          x={width / 2 - trackWidth / 2}
          y={capHeight / 2}
          width={trackWidth}
          height={trackHeight - capHeight / 2}
          rx={trackWidth / 2}
          fill={borderColor}
        />

        {/* Neutral marker — horizontal notch across the track at the
            parameter's neutral position. Only rendered when `neutral` is
            provided. Same semantic as the Knob neutral marker. */}
        {typeof neutral === "number" && Number.isFinite(neutral) && (() => {
          const neutralPct =
            max === min ? 0 : clamp((neutral - min) / (max - min), 0, 1);
          const notchY = (1 - neutralPct) * (trackHeight - capHeight) + capHeight / 2;
          const notchHalfWidth = (capWidth + 6) / 2;
          return (
            <line
              x1={width / 2 - notchHalfWidth}
              y1={notchY}
              x2={width / 2 + notchHalfWidth}
              y2={notchY}
              stroke="var(--color-foreground, #e2e8f0)"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.45}
            />
          );
        })()}

        {/* Cap / handle — the moving part. The handle position alone
            communicates value; no track fill needed (matches the Knob
            treatment where position is the only amount signal). */}
        <rect
          x={(width - capWidth) / 2}
          y={capY}
          width={capWidth}
          height={capHeight}
          rx={2}
          fill={bodyFill}
          stroke={accentColor}
          strokeWidth={1.5}
        />
        {/* Cap indicator line — running across the cap horizontally */}
        <line
          x1={(width - capWidth) / 2 + 3}
          y1={capY + capHeight / 2}
          x2={(width + capWidth) / 2 - 3}
          y2={capY + capHeight / 2}
          stroke={accentColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          fontSize: valueSize,
          fontWeight: 700,
          color: "var(--color-foreground, #e2e8f0)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {printed}
        {unit && (
          <span
            style={{
              fontSize: valueSize * 0.55,
              fontWeight: 500,
              color: mutedColor,
              marginLeft: 2,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: labelSize,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: mutedColor,
          lineHeight: 1,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function formatValue(value: number, bipolar: boolean): string {
  let text: string;
  if (Number.isInteger(value)) {
    text = value.toString();
  } else {
    text = value.toFixed(1).replace(/\.0$/, "");
  }
  if (bipolar && value > 0 && !text.startsWith("+")) {
    text = `+${text}`;
  }
  return text;
}
