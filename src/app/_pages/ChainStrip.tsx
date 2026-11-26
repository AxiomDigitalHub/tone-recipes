import Gear from "@/components/gear/Gear";
import { gearForChain, gearTypeLabel } from "@/lib/gear/recipe-gear";
import type { PreviewBlockData } from "@/components/v3/preview-helpers";

/**
 * A static signal chain in the redesign's drawing style: every block as
 * its gear drawing with the knobs at the recipe's settings, a type
 * caption and the block name. The same pieces as the recipe page's
 * chain (RecipeChain), without the platform switcher or anchors, so it
 * works in server pages: the print view and /compare.
 *
 * `wrap` lets the row wrap (print, narrow columns) instead of scrolling.
 */
export default function ChainStrip({
  blocks,
  height = 110,
  wrap = false,
  label,
}: {
  blocks: PreviewBlockData[];
  height?: number;
  wrap?: boolean;
  /** Accessible name for the list. */
  label?: string;
}) {
  const picks = gearForChain(blocks);
  const items = blocks
    .map((block, i) => ({ block, pick: picks[i], i }))
    .filter((x) => x.pick !== null);
  if (items.length === 0) return null;
  return (
    <div className={`fk-chain r-lg fkp-chainstrip${wrap ? " is-wrap" : ""}`}>
      <ol className="fk-chain-row" aria-label={label}>
        {items.map(({ block, pick, i }) =>
          pick ? (
            <li key={`${block.name}-${i}`} className="fk-chain-item">
              <Gear
                kind={pick.kind}
                height={height}
                vals={pick.vals}
                title={pick.title}
                disp={pick.disp}
                color={pick.color}
                label=""
              />
              <span className="fk-caption">{gearTypeLabel(block, pick)}</span>
              <span className="fk-chain-name">{block.name}</span>
            </li>
          ) : null,
        )}
      </ol>
    </div>
  );
}
