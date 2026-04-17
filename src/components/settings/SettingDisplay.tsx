import Knob from "./Knob";
import Fader from "./Fader";

/**
 * <SettingDisplay> — data-driven router that picks the right visual for a
 * raw (key, value) setting pair coming out of `node.settings` or
 * `platformBlock.settings`.
 *
 * Strategy:
 *   - Known amp/pedal knob labels (Gain, Bass, Mid, …) → <Knob> on 0–10.
 *   - Known engineered parameters (Threshold, LowCut, …) → <Fader> with
 *     the appropriate dB/Hz/ms range.
 *   - String values (amp channel names, mic models) → plain text card.
 *   - Everything else → plain numeric card (same look as the old grid)
 *     so nothing breaks when we meet a setting name we haven't profiled.
 *
 * The inference table is deliberately conservative. When a parameter with an
 * unusual range (e.g. Mix=100 in one recipe, Mix=0.74 in another) would look
 * wrong as a knob, we fall back to plain text rather than render a
 * misleading dial position.
 */

export interface SettingDisplayProps {
  settingKey: string;
  value: string | number;
  /** Accent color forwarded to the knob/fader. Matches the block's platform color. */
  color?: string;
}

type Inference =
  | { kind: "knob"; min: number; max: number; unit?: string }
  | { kind: "fader"; min: number; max: number; unit?: string }
  | { kind: "text" };

/** Case-insensitive parameter name lookup. Returns null if unknown. */
function inferControl(key: string, value: number): Inference | null {
  const k = key.toLowerCase().trim();

  // Standard amp/pedal 0–10 knobs — the brand visual anchors.
  const AMP_KNOBS_0_10 = [
    "gain",
    "bass",
    "mid",
    "middle",
    "treble",
    "presence",
    "master",
    "volume",
    "tone",
    "drive",
    "level",
    "sustain",
    "ch vol",
    "mv",
    "boost",
    "fuzz",
    "dist",
    "reverb",
    "volume i",
    "volume ii",
  ];
  if (AMP_KNOBS_0_10.includes(k)) {
    // Values up to 12 appear occasionally (e.g. Master at 12). Widen the
    // range so the pointer doesn't clip at the top.
    const max = value > 10 ? 12 : 10;
    return { kind: "knob", min: 0, max };
  }

  // Compressor knee — dB, usually 0–12.
  if (k === "knee") return { kind: "knob", min: 0, max: 12, unit: "dB" };

  // Compressor ratio — 1:1 up to 20:1.
  if (k === "ratio") {
    return { kind: "knob", min: 1, max: 20, unit: ":1" };
  }

  // Threshold (dB) — negative range, fader feels right.
  if (k === "threshold") {
    return { kind: "fader", min: -60, max: 0, unit: "dB" };
  }

  // High-pass / low-pass cut frequencies.
  if (k === "lowcut" || k === "low cut" || k === "hpf") {
    return { kind: "fader", min: 20, max: 500, unit: "Hz" };
  }
  if (k === "highcut" || k === "high cut" || k === "lpf") {
    return { kind: "fader", min: 2000, max: 20000, unit: "Hz" };
  }

  // Reverb decay (seconds).
  if (k === "decay") {
    return { kind: "knob", min: 0, max: 10, unit: "s" };
  }

  // Delay / pre-delay times (ms).
  if (k === "time" || k === "pre delay" || k === "predelay") {
    return { kind: "fader", min: 0, max: 2000, unit: "ms" };
  }

  // Attack / Release — we have values ranging 0.06…20 across the data.
  // Safest: plain text for now since ranges are inconsistent.
  if (k === "attack" || k === "release") {
    // Normalize: if value < 1, assume seconds fraction (knob 0–1).
    if (value <= 1) return { kind: "knob", min: 0, max: 1, unit: "s" };
    // Otherwise likely ms-ish — render as numeric text via fallback.
    return null;
  }

  // Mix — 0–1 in most recipes, 0–100% in a few. Infer from value.
  if (k === "mix") {
    if (value <= 1) return { kind: "knob", min: 0, max: 1 };
    return { kind: "knob", min: 0, max: 100, unit: "%" };
  }

  // Rate / Speed for modulation (Hz-ish or BPM-ish, usually low digits).
  if (k === "rate" || k === "speed") {
    const max = value > 10 ? 20 : 10;
    return { kind: "knob", min: 0, max, unit: "Hz" };
  }

  // Depth — percentage if value > 1, otherwise 0–1.
  if (k === "depth") {
    if (value <= 1) return { kind: "knob", min: 0, max: 1 };
    return { kind: "knob", min: 0, max: 100, unit: "%" };
  }

  // Feedback — usually a percentage on delays.
  if (k === "feedback") {
    if (value <= 1) return { kind: "knob", min: 0, max: 1 };
    return { kind: "knob", min: 0, max: 100, unit: "%" };
  }

  // Mic distance / position — keep numeric. These are physical measurements.
  if (k === "distance" || k.startsWith("position")) return null;

  // Amp tube internals (Sag, Bias, Ripple, Hum, BiasX) — all 0–1 in our data.
  if (["sag", "bias", "ripple", "hum", "biasx"].includes(k)) {
    return { kind: "knob", min: 0, max: 1 };
  }

  // Mic model index (MicA, MicB) — integer index, not a knob. Keep text.
  if (k === "mica" || k === "micb") return null;

  // Angle, EarlyReflections — simulator-specific, keep text.
  if (k === "angle" || k === "earlyreflections") return null;

  // Pedal Position — slot index, keep text.
  if (k === "pedal position") return null;

  // Default: unknown parameter. Render as text.
  return null;
}

export default function SettingDisplay({
  settingKey,
  value,
  color,
}: SettingDisplayProps) {
  // Non-numeric values (e.g. amp channel names like "Brown", mic model strings)
  // always render as plain text.
  if (typeof value !== "number") {
    return <NumericCard label={settingKey} value={String(value)} color={color} />;
  }

  const inf = inferControl(settingKey, value);

  if (inf?.kind === "knob") {
    return (
      <Knob
        name={settingKey}
        value={value}
        min={inf.min}
        max={inf.max}
        unit={inf.unit}
        size="sm"
        color={color}
      />
    );
  }

  if (inf?.kind === "fader") {
    return (
      <Fader
        name={settingKey}
        value={value}
        min={inf.min}
        max={inf.max}
        unit={inf.unit}
        size="sm"
        color={color}
      />
    );
  }

  // Fallback: plain numeric card — same visual as the pre-2026-04 grid so the
  // block detail panel stays legible for parameters we haven't profiled.
  return <NumericCard label={settingKey} value={value} color={color} />;
}

function NumericCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid var(--color-border, #1e2840)",
        background: "var(--color-surface, #0b0f1a)",
        minWidth: 72,
      }}
    >
      <span
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontWeight: 700,
          fontSize: 18,
          color: color ?? "var(--color-accent, #f59e0b)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          marginTop: 6,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-muted, #5a6880)",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}
