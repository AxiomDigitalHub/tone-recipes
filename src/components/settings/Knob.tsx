import type { CSSProperties } from "react";

/**
 * <Knob> — rotary control that visualizes a setting value as a physical pedal
 * knob. Intended for embedding in MDX blog posts and recipe pages.
 *
 * Visual language (locked 2026-04, tightened 2026-04-17):
 *   - Sweep: 270° from 7 o'clock (min) to 5 o'clock (max), matching guitar
 *     amp knob convention. Straight-up pointer (12 o'clock) = middle value.
 *   - Body: dark fill with thin border ring and minor tick marks.
 *   - Pointer: accent-color line from center toward current angle.
 *   - Neutral marker: brighter tick on outer ring at the parameter's neutral
 *     value (center-detent for bipolar params, factory default otherwise).
 *   - Value: large number centered INSIDE the knob body. No sweep arc —
 *     pointer position + tick marks already communicate amount.
 *   - Bipolar formatting: values render with explicit sign (+/-) when the
 *     range crosses zero, so a center-detent control like cab Level reads
 *     as "+3 dB" or "-6 dB".
 *   - Label: small-caps uppercase below.
 *
 * Accessibility:
 *   - role="meter" with aria-valuenow, aria-valuemin, aria-valuemax
 *   - aria-label combines the setting name + current value + unit
 *   - Works print-friendly: SVG scales, no raster dependencies.
 */

export interface KnobProps {
  /** Setting name, e.g. "Gain", "Threshold". Rendered as lowercase-uppercase label. */
  name: string;
  /** Current value. Clamped to [min, max] when rotating the pointer. */
  value: number;
  /** Lower bound of the knob sweep. Default 0. */
  min?: number;
  /** Upper bound of the knob sweep. Default 10 (matches amp knobs). */
  max?: number;
  /** Optional unit rendered after the value, e.g. "dB", "Hz", "ms". */
  unit?: string;
  /** Size variant. Default "md" (80px). */
  size?: "sm" | "md" | "lg";
  /** Override the printed value (e.g. "5.5–6.0" for a range). The pointer still
   *  uses the numeric `value`. */
  display?: string;
  /** Optional color override for the pointer + value arc. Defaults to --accent. */
  color?: string;
  /** Optional neutral/default value. When provided, a small marker tick is
   *  drawn at that position on the knob body so the reader can see at a
   *  glance whether the recipe pushes the control (e.g. "Gain at 7" reads
   *  very differently when Gain's neutral is 0 vs 5). If omitted, no marker
   *  is drawn. */
  neutral?: number;
}

const SIZE_MAP = {
  sm: { outer: 56, stroke: 1.5, valueSize: 14, labelSize: 9 },
  md: { outer: 88, stroke: 2, valueSize: 18, labelSize: 10 },
  lg: { outer: 128, stroke: 2.5, valueSize: 26, labelSize: 11 },
} as const;

/** Sweep from 7 o'clock to 5 o'clock, clockwise. 270° total travel. */
const SWEEP_START_DEG = -135; // pointer angle at `min` (rotate() units, 0° = up)
const SWEEP_END_DEG = 135; // pointer angle at `max`
const SWEEP_RANGE = SWEEP_END_DEG - SWEEP_START_DEG; // 270

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function valueToAngle(value: number, min: number, max: number): number {
  if (max === min) return SWEEP_START_DEG;
  const pct = clamp((value - min) / (max - min), 0, 1);
  return SWEEP_START_DEG + pct * SWEEP_RANGE;
}

/** Points on a circle where 0° is 12 o'clock and angle increases clockwise. */
function polarPoint(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Safe number → fixed-decimal string. Returns "0" if the input is not a
 *  finite number (guards against NaN/undefined crashing the SVG render). */
function fx(n: number, decimals = 2): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : "0";
}

/** Build an SVG arc path from startDeg to endDeg (clockwise sweep, 12 o'clock = 0°). */
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polarPoint(cx, cy, r, startDeg);
  const end = polarPoint(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${fx(start.x)} ${fx(start.y)} A ${r} ${r} 0 ${largeArc} 1 ${fx(end.x)} ${fx(end.y)}`;
}

export default function Knob({
  name,
  value: rawValue,
  min = 0,
  max = 10,
  unit,
  size = "md",
  display,
  color,
  neutral,
}: KnobProps) {
  // Defensive: MDX JSX can occasionally pass `undefined` during SSR if an
  // authoring mistake swallows the attribute. Default to min so the knob
  // renders at its lowest position instead of crashing the prerender.
  const value =
    typeof rawValue === "number" && Number.isFinite(rawValue) ? rawValue : min;
  const { outer, stroke, valueSize, labelSize } = SIZE_MAP[size];
  const pad = 4;
  const box = outer + pad * 2;
  const cx = box / 2;
  const cy = box / 2;
  const r = outer / 2;
  const rInner = r - 6;

  const angle = valueToAngle(value, min, max);

  // Tick marks — 11 major ticks across the 270° sweep (0, 1, 2, …, 10 on an amp knob).
  const tickCount = 11;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tAngle = SWEEP_START_DEG + (i / (tickCount - 1)) * SWEEP_RANGE;
    return tAngle;
  });

  const isBipolar = min < 0 && max > 0;
  const printed = display ?? formatValue(value, min, max, isBipolar);
  const ariaLabel = `${name}: ${printed}${unit ? ` ${unit}` : ""}`;

  // CSS var fallback; explicit `color` overrides.
  const accentColor = color ?? "var(--color-accent, #f59e0b)";
  const bodyFill = "var(--color-surface, #0b0f1a)";
  const borderColor = "var(--color-border, #1e2840)";
  const mutedColor = "var(--color-muted, #5a6880)";

  // Pointer line: from center up to just inside the body edge, rotated to angle.
  // Inline style for the transform so SSR and client match.
  const pointerStyle: CSSProperties = {
    transform: `rotate(${angle}deg)`,
    transformOrigin: `${cx}px ${cy}px`,
  };

  return (
    <div
      role="meter"
      aria-label={ariaLabel}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        // Prevent rendering oddities when placed inline in prose
        verticalAlign: "middle",
      }}
    >
      <svg
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        style={{ display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Outer tick ring — a full circle for structure */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={borderColor}
          strokeWidth={stroke}
        />

        {/* Tick marks — minor strokes around the sweep */}
        {ticks.map((t, i) => {
          const outerP = polarPoint(cx, cy, r + 2, t);
          const innerP = polarPoint(cx, cy, r - 3, t);
          const isMajor = i === 0 || i === tickCount - 1 || i === Math.floor(tickCount / 2);
          return (
            <line
              key={i}
              x1={outerP.x}
              y1={outerP.y}
              x2={innerP.x}
              y2={innerP.y}
              stroke={isMajor ? mutedColor : borderColor}
              strokeWidth={isMajor ? stroke : stroke * 0.7}
              strokeLinecap="round"
            />
          );
        })}

        {/* Inner body — the "cap" of the knob */}
        <circle cx={cx} cy={cy} r={rInner} fill={bodyFill} stroke="none" />

        {/* Neutral marker — a small brighter tick on the outer ring at the
            parameter's neutral position. Lets the reader see at a glance
            whether the current value is above, at, or below the factory
            default. Omitted when `neutral` prop isn't provided. */}
        {typeof neutral === "number" && Number.isFinite(neutral) && (() => {
          const neutralAngle = valueToAngle(neutral, min, max);
          const outerP = polarPoint(cx, cy, r + 4, neutralAngle);
          const innerP = polarPoint(cx, cy, r - 5, neutralAngle);
          return (
            <line
              x1={outerP.x}
              y1={outerP.y}
              x2={innerP.x}
              y2={innerP.y}
              stroke="var(--color-foreground, #e2e8f0)"
              strokeWidth={stroke + 0.5}
              strokeLinecap="round"
              opacity={0.55}
            />
          );
        })()}

        {/* Pointer — rotates to angle. Drawn at 12 o'clock, then rotated.
            Shortened to leave room for the value text at the center. */}
        <line
          x1={cx}
          y1={cy - rInner + 4}
          x2={cx}
          y2={cy - rInner + rInner * 0.45}
          stroke={accentColor}
          strokeWidth={stroke + 1.5}
          strokeLinecap="round"
          style={pointerStyle}
        />

        {/* Value — rendered inside the knob body. SVG <text> scales cleanly
            and stays centered at any size. The unit suffix is appended with
            a smaller font so "0.06 s" reads as one token. */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: valueSize,
            fontWeight: 700,
            fill: "var(--color-foreground, #e2e8f0)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {printed}
          {unit && (
            <tspan
              dx={3}
              style={{
                fontSize: valueSize * 0.5,
                fontWeight: 500,
                fill: mutedColor,
              }}
            >
              {unit}
            </tspan>
          )}
        </text>
      </svg>

      {/* Label */}
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

/** Format the numeric value for display.
 *  - Keeps integers integer, shows one decimal for fractional values.
 *  - Strips trailing zeros so "5.0" doesn't look pedantic on an amp knob.
 *  - For bipolar ranges (e.g. -12..+12 dB), prefixes a "+" on positive
 *    values so a center-detent control reads unambiguously ("+3" not "3"). */
function formatValue(
  value: number,
  min: number,
  max: number,
  bipolar: boolean,
): string {
  let text: string;
  if (max <= 1 && min >= -1 && min !== 0) {
    // Ratio-like small-range values, keep two decimals
    text = value.toFixed(2);
  } else if (max <= 1 && min >= 0) {
    text = value.toFixed(2);
  } else if (Number.isInteger(value)) {
    text = value.toString();
  } else {
    text = value.toFixed(1).replace(/\.0$/, "");
  }
  // Bipolar formatting: prepend "+" on positives so the sign is explicit.
  // Negatives already carry their "-" sign from toString/toFixed.
  if (bipolar && value > 0 && !text.startsWith("+")) {
    text = `+${text}`;
  }
  return text;
}
