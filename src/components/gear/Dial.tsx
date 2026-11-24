import { useId } from "react";
import { drawDial } from "@/lib/gear/draw";

/**
 * The dial: the tone recipe card's signature. An amber arc around a knob
 * shows where the setting sits in its range.
 *
 *   <Dial value={3.5} />                      0 to 10 knob
 *   <Dial value={480} min={0} max={2000} />   a time in ms
 *
 * Map each parameter's real min and max from the data. Works as a server
 * component. Decorative by default: print the label and value next to it
 * as text (see DialCell).
 */
export interface DialProps {
  value: number;
  min?: number;
  max?: number;
  /** Rendered size in px (square). */
  size?: number;
  /** Arc colour. Defaults to amber. */
  accent?: string;
  /** Track colour. Use "#2b2e32" on the dark inverse band. */
  track?: string;
  /** Accessible name. Omit when the value is printed beside the dial. */
  label?: string;
  className?: string;
}

export default function Dial({
  value,
  min = 0,
  max = 10,
  size = 60,
  accent,
  track,
  label,
  className,
}: DialProps) {
  const uid = "d" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const span = max - min;
  const frac = span > 0 && Number.isFinite(value) ? Math.max(0, Math.min(1, (value - min) / span)) : 0;
  const { vw, vh, inner } = drawDial(uid, frac, accent, track);
  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      width={size}
      height={size}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

/**
 * A dial with its label and value underneath. The value is real data, so
 * it is set in mono.
 */
export function DialCell({
  label,
  display,
  inverse = false,
  size = 60,
  ...dial
}: Omit<DialProps, "label" | "track"> & {
  label: string;
  /** The value as printed, e.g. "3.5" or "480 ms". */
  display: string;
  /** On the dark inverse band. */
  inverse?: boolean;
}) {
  return (
    <div className={`fk-dialcell${inverse ? " is-inverse" : ""}`}>
      {/* Track colours are tokens, so the dial follows the theme. */}
      <Dial {...dial} size={size} track={inverse ? "var(--fk-inverse-line, #2b2e32)" : "var(--fk-line, #DCDFE2)"} />
      <span className="fk-dialcell-label">{label}</span>
      <span className="fk-dialcell-value">{display}</span>
    </div>
  );
}
