import Knob from "./Knob";
import Fader from "./Fader";
import { lookupParam, type ParamMeta } from "@/lib/parameters/registry";

/**
 * <SettingDisplay> — routes a raw (key, value) pair coming out of a recipe's
 * `node.settings` or `platformBlock.settings` to the right visual.
 *
 * The decision is driven by the central PARAM_REGISTRY (src/lib/parameters/
 * registry.ts). That file is the single source of truth for:
 *   - What kind of control a parameter is (knob / fader / switch / text)
 *   - The min/max range for that parameter
 *   - The neutral / default position, drawn as a marker on the dial
 *   - The unit label, if any
 *
 * Parameters not in the registry fall back to a plain numeric card — the
 * same visual the pre-2026-04 grid used — so the panel stays legible even
 * when a new parameter name appears in recipe data.
 */

export interface SettingDisplayProps {
  settingKey: string;
  value: string | number;
  /** Accent color forwarded to the knob/fader. Matches the block's platform color. */
  color?: string;
  /** Size variant for the knob/fader. Recipe block panels use "md"; dense
   *  contexts like compact tables can use "sm". Default "md". */
  size?: "sm" | "md" | "lg";
  /** Block category (e.g. "Compressor", "Amp") — used to apply
   *  BLOCK_OVERRIDES from the registry where the same param name means
   *  different things in different blocks. */
  blockCategory?: string;
}

export default function SettingDisplay({
  settingKey,
  value,
  color,
  size = "md",
  blockCategory,
}: SettingDisplayProps) {
  // Non-numeric values (amp channel names like "Brown", mic model strings)
  // always render as a plain text card.
  if (typeof value !== "number") {
    return <NumericCard label={settingKey} value={String(value)} color={color} />;
  }

  const meta: ParamMeta | undefined = lookupParam(settingKey, blockCategory);

  if (meta?.kind === "knob") {
    return (
      <Knob
        name={settingKey}
        value={value}
        min={meta.min}
        max={meta.max}
        neutral={meta.neutral}
        unit={meta.unit}
        size={size}
        color={color}
      />
    );
  }

  if (meta?.kind === "fader") {
    return (
      <Fader
        name={settingKey}
        value={value}
        min={meta.min}
        max={meta.max}
        neutral={meta.neutral}
        unit={meta.unit}
        size={size}
        color={color}
      />
    );
  }

  // kind === "switch" | "text" | undefined → fallback to numeric card so
  // values stay legible without pretending they're a dial.
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
