import { useId } from "react";
import Gear from "./Gear";
import { drawPattern, FRAME, type ThumbColor, type ThumbFrame, type ThumbPattern, type ThumbSpec } from "@/lib/gear/thumbs";
import type { GearKind } from "@/lib/gear/draw";
import Dial from "./Dial";
import { GUITARS, guitarSrc, type GuitarKey } from "@/lib/gear/guitars";

/**
 * A thumbnail: gear drawing(s) on a patterned ground, in one of eight
 * framings. Decorative: the title beside it carries the meaning.
 *
 *   <Thumb spec={thumbFor(post)} gearHeight={150} />
 *   <Thumb pattern="ripple" gear={[{ kind: "delay" }, { kind: "reverb" }]} />
 */
export interface ThumbProps {
  /** A post's computed thumbnail. Or set the parts by hand below. */
  spec?: ThumbSpec;
  pattern?: ThumbPattern;
  frame?: ThumbFrame;
  color?: ThumbColor | null;
  gear?: { kind: GearKind; color?: string; cloth?: string; disp?: string; vals?: number[] }[];
  /**
   * How several drawings sit together. "row": side by side (default).
   * "scatter": overlapped and turned a little, like pedals tipped out of a
   * bag. "stagger": stepped up and down.
   */
  layout?: "row" | "scatter" | "stagger";
  /** Show dials instead of gear: values 0 to 10. */
  dials?: number[];
  /** Show a guitar drawing instead of gear. */
  guitar?: GuitarKey;
  /** Drawing height in px. */
  gearHeight?: number;
  /** CSS aspect-ratio, e.g. "16 / 10". */
  ratio?: string;
  /** Corner class. */
  radius?: "r-md" | "r-lg";
  className?: string;
}

export default function Thumb({
  spec,
  pattern = spec?.pattern ?? "plain",
  frame = spec?.frame ?? "front",
  color = spec?.color,
  gear = spec ? [{ kind: spec.gear }] : [],
  layout = "row",
  dials,
  guitar,
  gearHeight = 150,
  ratio = "16 / 10",
  radius = "r-lg",
  className = "",
}: ThumbProps) {
  const uid = "t" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const { bg, inner } = drawPattern(pattern, uid, color);
  const tf = FRAME[frame];
  return (
    <div className={`fk-thumb ${radius} ${className}`.trim()} style={{ background: bg, aspectRatio: ratio }} aria-hidden="true">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="fk-thumb-pattern" dangerouslySetInnerHTML={{ __html: inner }} />
      <div className={`fk-thumb-gear is-${layout}`} style={tf ? { transform: tf } : undefined}>
        {guitar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={guitarSrc(guitar)} alt={GUITARS[guitar]} className="fk-thumb-guitar" style={{ height: gearHeight }} loading="lazy" />
        ) : dials ? (
          dials.map((v, i) => <Dial key={i} value={v} size={gearHeight} track="rgba(19,20,22,0.18)" accent="#131416" />)
        ) : (
          gear.map((g, i) => (
            <Gear key={i} kind={g.kind} height={gearHeight} color={g.color} cloth={g.cloth} disp={g.disp} vals={g.vals} label="" />
          ))
        )}
      </div>
    </div>
  );
}
