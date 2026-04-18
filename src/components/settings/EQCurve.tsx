/**
 * <EQCurve> — renders a frequency-response curve for an equalizer block.
 *
 * Design brief (2026-04-17):
 *   When a block on a recipe page is an EQ, the knobs alone don't communicate
 *   what the EQ is doing to the signal. A frequency-response curve does —
 *   at a glance you see the tonal shape being applied: cutting the lows,
 *   notching 1 kHz, boosting 5 kHz, etc. This is the same visual language
 *   that every pro audio EQ plugin uses (Pro-Q, Oxford, etc.).
 *
 * Visual model:
 *   - Log-scale X axis from 20 Hz to 20 kHz
 *   - Linear Y axis from -12 dB to +12 dB (default; tunable)
 *   - Grid at 0 dB (prominent) and at every 100 Hz / 1 kHz / 10 kHz tick
 *   - Dark fill under the curve with accent color outline
 *   - Small markers at each band's center frequency + a label
 *
 * Math (approximation):
 *   For a visual curve we don't need the full biquad peaking-EQ transfer
 *   function — an exponential falloff at each band produces a curve that's
 *   visually indistinguishable from the real filter at the scale this
 *   renders at. Each band contributes a Gaussian in log-frequency space:
 *
 *     contribution_at_f(band) = band.gain * exp(-( (log2(f / band.freq) / bw )^2 ))
 *
 *   where bw is the band's bandwidth in octaves (default 1 octave).
 *   Total response is the sum across all bands.
 *
 * This is deliberately not a biquad simulation. It gets close enough to
 * communicate EQ shape to a guitarist scanning a recipe page.
 */

export interface EQBand {
  /** Center frequency in Hz. */
  freq: number;
  /** Gain in dB. Positive boosts, negative cuts. */
  gain: number;
  /** Bandwidth in octaves. Default 1.0. Lower Q = wider band.
   *  For a graphic EQ band, 1.0 is realistic. For a parametric, 0.5 narrower. */
  bandwidth?: number;
}

export interface EQCurveProps {
  bands: EQBand[];
  /** Minimum frequency on the X axis (Hz). Default 20. */
  fMin?: number;
  /** Maximum frequency on the X axis (Hz). Default 20000. */
  fMax?: number;
  /** Y-axis range (dB). Default 12 = from -12 dB to +12 dB. */
  dbRange?: number;
  /** Size variant. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Accent color for the curve. Defaults to theme accent. */
  color?: string;
  /** Optional title shown above the curve. */
  title?: string;
}

const SIZE_MAP = {
  sm: { width: 320, height: 120, padX: 24, padY: 16, labelSize: 9 },
  md: { width: 480, height: 180, padX: 32, padY: 22, labelSize: 10 },
  lg: { width: 640, height: 240, padX: 40, padY: 28, labelSize: 11 },
} as const;

/** Log-10 position of frequency f within [fMin, fMax], normalized 0..1. */
function logPos(f: number, fMin: number, fMax: number): number {
  return (
    (Math.log10(f) - Math.log10(fMin)) /
    (Math.log10(fMax) - Math.log10(fMin))
  );
}

/** Sum of band contributions at frequency f. */
function responseAt(f: number, bands: EQBand[]): number {
  let sum = 0;
  if (!Array.isArray(bands)) return sum;
  for (const b of bands) {
    if (!b || !Number.isFinite(b.freq) || b.freq <= 0) continue;
    const bw = b.bandwidth ?? 1.0;
    const octaves = Math.log2(f / b.freq);
    sum += b.gain * Math.exp(-((octaves / bw) ** 2));
  }
  return sum;
}

export default function EQCurve({
  bands,
  fMin = 20,
  fMax = 20000,
  dbRange = 12,
  size = "md",
  color,
  title,
}: EQCurveProps) {
  // Defensive: MDX/RSC can occasionally pass a non-array if the frontmatter
  // or JSX prop serialization goes sideways. Fall back to empty array so we
  // render a flat curve instead of crashing SSR.
  const safeBands: EQBand[] = Array.isArray(bands)
    ? bands.filter(
        (b): b is EQBand =>
          !!b &&
          typeof b.freq === "number" &&
          Number.isFinite(b.freq) &&
          typeof b.gain === "number" &&
          Number.isFinite(b.gain),
      )
    : [];

  const { width, height, padX, padY, labelSize } = SIZE_MAP[size];
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const accent = color ?? "var(--color-accent, #f59e0b)";
  const gridColor = "var(--color-border, #1e2840)";
  const textColor = "var(--color-muted, #5a6880)";
  const zeroLineColor = "var(--color-muted, #5a6880)";

  // Sample the curve at many points to draw a smooth path.
  const SAMPLES = 200;
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const f = fMin * Math.pow(fMax / fMin, t); // log-spaced frequency
    const db = responseAt(f, safeBands);
    const x = padX + t * plotW;
    // clamp to plot range visually
    const clampedDb = Math.max(-dbRange, Math.min(dbRange, db));
    const y = padY + ((dbRange - clampedDb) / (dbRange * 2)) * plotH;
    points.push([x, y]);
  }

  const pathData =
    "M " +
    points
      .map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" L ");

  // Filled area beneath the curve down to 0 dB (or to the bottom if you prefer).
  // Fill toward the zero line emphasizes deviation from flat.
  const zeroY = padY + plotH / 2;
  const fillData =
    pathData +
    ` L ${(padX + plotW).toFixed(1)} ${zeroY.toFixed(1)} L ${padX.toFixed(
      1,
    )} ${zeroY.toFixed(1)} Z`;

  // Grid frequencies we want labeled.
  const gridFreqs = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

  return (
    <div
      style={{
        display: "inline-block",
        padding: 12,
        borderRadius: 12,
        border: `1px solid ${gridColor}`,
        background: "var(--color-surface, rgba(11, 15, 26, 0.6))",
        maxWidth: width + 24,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: textColor,
            marginBottom: 8,
          }}
        >
          {title}
        </div>
      )}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block", overflow: "visible" }}
        aria-label="Frequency response curve"
      >
        {/* Vertical grid at labeled frequencies */}
        {gridFreqs.map((f) => {
          const x = padX + logPos(f, fMin, fMax) * plotW;
          return (
            <line
              key={f}
              x1={x}
              x2={x}
              y1={padY}
              y2={padY + plotH}
              stroke={gridColor}
              strokeWidth={0.5}
              opacity={0.6}
            />
          );
        })}

        {/* Horizontal dB grid — every 6 dB */}
        {[-12, -6, 0, 6, 12].map((db) => {
          if (Math.abs(db) > dbRange) return null;
          const y = padY + ((dbRange - db) / (dbRange * 2)) * plotH;
          const isZero = db === 0;
          return (
            <line
              key={db}
              x1={padX}
              x2={padX + plotW}
              y1={y}
              y2={y}
              stroke={isZero ? zeroLineColor : gridColor}
              strokeWidth={isZero ? 1 : 0.5}
              opacity={isZero ? 0.85 : 0.4}
              strokeDasharray={isZero ? "0" : "2,3"}
            />
          );
        })}

        {/* Filled response area */}
        <path d={fillData} fill={accent} opacity={0.14} />

        {/* Response curve line */}
        <path
          d={pathData}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Band center markers — small dots at the peak of each band */}
        {safeBands.map((b, i) => {
          if (!Number.isFinite(b.freq) || b.freq < fMin || b.freq > fMax) return null;
          const x = padX + logPos(b.freq, fMin, fMax) * plotW;
          const clampedDb = Math.max(-dbRange, Math.min(dbRange, b.gain));
          const y = padY + ((dbRange - clampedDb) / (dbRange * 2)) * plotH;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={3} fill={accent} stroke="var(--color-surface, #0b0f1a)" strokeWidth={1.5} />
            </g>
          );
        })}

        {/* X-axis frequency labels */}
        {gridFreqs.map((f) => {
          const x = padX + logPos(f, fMin, fMax) * plotW;
          const label = f >= 1000 ? `${f / 1000}k` : `${f}`;
          return (
            <text
              key={f}
              x={x}
              y={padY + plotH + 12}
              textAnchor="middle"
              style={{
                fontSize: labelSize,
                fill: textColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {label}
            </text>
          );
        })}

        {/* Y-axis dB labels (left side) */}
        {[-12, 0, 12].map((db) => {
          if (Math.abs(db) > dbRange) return null;
          const y = padY + ((dbRange - db) / (dbRange * 2)) * plotH;
          return (
            <text
              key={db}
              x={padX - 4}
              y={y + labelSize * 0.35}
              textAnchor="end"
              style={{
                fontSize: labelSize,
                fill: textColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {db > 0 ? `+${db}` : db}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helper: extract EQ bands from a raw settings object                        */
/* -------------------------------------------------------------------------- */

/** Katana-style 5-band EQ uses these fixed center frequencies. */
const KATANA_5BAND_FREQS: Record<string, number> = {
  "80Hz": 80,
  "240Hz": 240,
  "750Hz": 750,
  "2200Hz": 2200,
  "6600Hz": 6600,
};

/** 3-band graphic-EQ default centers. */
const GRAPHIC_3BAND_FREQS: Record<string, number> = {
  Low: 100,
  "Low Freq": 100,
  Mid: 800,
  "Mid Freq": 800,
  High: 5000,
  "High Freq": 5000,
};

/** Parse a setting value into a dB number. Accepts:
 *   42         → 42
 *   "-3.5"     → -3.5
 *   "+6dB"     → 6
 *   "-8 dB"    → -8
 *   "off"/""   → null
 */
function parseDb(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const m = value.match(/([+-]?\d+(\.\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

/** Extract EQ bands from a settings object. Returns null if this doesn't look
 *  like an EQ (no recognizable band frequencies). The returned array can be
 *  passed directly to <EQCurve bands={...}>. */
export function extractEQBands(
  settings: Record<string, unknown> | undefined,
): EQBand[] | null {
  if (!settings) return null;
  const bands: EQBand[] = [];

  // Try Katana 5-band first (most specific).
  for (const [key, freq] of Object.entries(KATANA_5BAND_FREQS)) {
    if (key in settings) {
      const gain = parseDb(settings[key]);
      if (gain !== null) bands.push({ freq, gain, bandwidth: 1.0 });
    }
  }
  if (bands.length >= 2) return bands;

  // Graphic 3-band fallback.
  for (const [key, freq] of Object.entries(GRAPHIC_3BAND_FREQS)) {
    if (key in settings) {
      const gain = parseDb(settings[key]);
      if (gain !== null) bands.push({ freq, gain, bandwidth: 1.5 });
    }
  }
  if (bands.length >= 2) return bands;

  return null;
}
