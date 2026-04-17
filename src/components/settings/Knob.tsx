import type { CSSProperties } from "react";

/**
 * <Knob> — rotary control that visualizes a setting value as a physical pedal
 * knob. Intended for embedding in MDX blog posts and recipe pages.
 *
 * Visual language (locked 2026-04):
 *   - Sweep: 270° from 7 o'clock (min) to 5 o'clock (max), matching guitar
 *     amp knob convention. Straight-up pointer (12 o'clock) = middle value.
 *   - Body: dark fill with thin border ring and minor tick marks.
 *   - Value arc: accent-color stroke traces from 7 o'clock to current angle.
 *   - Pointer: accent-color line from center toward current angle.
 *   - Label: small-caps uppercase below. Value inside the knob face.
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

  // Value arc — traces from 7 o'clock to the current pointer position.
  // Angle convention for arc helper: 0° at 12 o'clock, clockwise positive.
  // Our rotate() convention: 0° straight up. So startDeg = -135 maps directly.
  const arcStartDeg = SWEEP_START_DEG; // -135 (7 o'clock)
  const arcEndDeg = angle; // current pointer
  // If the value is at the minimum, don't draw a zero-length arc.
  const showArc = Math.abs(arcEndDeg - arcStartDeg) > 0.5;

  // Tick marks — 11 major ticks across the 270° sweep (0, 1, 2, …, 10 on an amp knob).
  const tickCount = 11;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tAngle = SWEEP_START_DEG + (i / (tickCount - 1)) * SWEEP_RANGE;
    return tAngle;
  });

  const printed = display ?? formatValue(value, min, max);
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

        {/* Value arc — sweeps from min to current value */}
        {showArc && (
          <path
            d={arcPath(cx, cy, rInner - 3, arcStartDeg, arcEndDeg)}
            fill="none"
            stroke={accentColor}
            strokeWidth={stroke + 1}
            strokeLinecap="round"
            opacity={0.85}
          />
        )}

        {/* Pointer — rotates to angle. Drawn at 12 o'clock, then rotated. */}
        <line
          x1={cx}
          y1={cy - rInner + 6}
          x2={cx}
          y2={cy - rInner + rInner * 0.35}
          stroke={accentColor}
          strokeWidth={stroke + 1.5}
          strokeLinecap="round"
          style={pointerStyle}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={stroke + 0.5} fill={accentColor} />
      </svg>

      {/* Value — rendered below (not inside) so it works at every size */}
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
 *  Keeps integers integer, shows one decimal for fractional values,
 *  and strips trailing zeros so "5.0" doesn't look pedantic on an amp knob. */
function formatValue(value: number, min: number, max: number): string {
  // If the range is [0, 1] (mix/level style), show two decimals
  if (max <= 1 && min >= 0) {
    return value.toFixed(2);
  }
  // For negative-range values like dB, keep one decimal if non-integer
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(1).replace(/\.0$/, "");
}
