import { useId } from "react";
import { drawGear, GEAR_NAMES, type GearKind, type GearOptions } from "@/lib/gear/draw";

/**
 * One piece of gear, drawn as SVG: pedal, amp, cab or mic.
 *
 *   <Gear kind="drive" vals={[1.5, 5, 7]} title="Scream 808" height={200} />
 *
 * `vals` are the control values on a 0 to 10 scale, in the order listed in
 * GearOptions (src/lib/gear/draw.ts). Drive every knob from the recipe's
 * stored settings. Works as a server component.
 */
export interface GearProps extends Omit<GearOptions, "fonts"> {
  kind: GearKind;
  /** Rendered height in px. Width follows the drawing's aspect ratio. */
  height?: number;
  /** Accessible name. Defaults to the gear's generic name. Pass "" to hide. */
  label?: string;
  className?: string;
}

export default function Gear({ kind, height = 200, label, className, ...opts }: GearProps) {
  const uid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const { vw, vh, inner } = drawGear(kind, uid, opts);
  const name = label ?? GEAR_NAMES[kind];
  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      width={(height * vw) / vh}
      height={height}
      role={name ? "img" : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
