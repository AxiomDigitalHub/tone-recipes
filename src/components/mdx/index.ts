import FAQ from "./FAQ";
import SaveThisTone from "./SaveThisTone";
import AffiliateGearLink from "../ui/AffiliateGearLink";
import GearPick from "./GearPick";
import GearShortlist, { GearShortlistItem } from "./GearShortlist";
import ScrollableTable from "./ScrollableTable";

/**
 * Blog-specific MDX components (content-strategy sprint 2026-04-17):
 *   <FAQ>               — FAQ block + FAQPage JSON-LD for AEO.
 *   <SaveThisTone>      — end-of-post CTA linking to the preset library.
 *   <AffiliateGearLink> — inline "name + Buy" popover linking to
 *                         Sweetwater / Reverb / Amazon. Affiliate tags
 *                         read from env vars at request time.
 *   <GearPick>          — editor's-pick BLOCK component for gear
 *                         roundups (FRFR, IRs, amps, IRs). Higher CTR
 *                         than inline buttons; renders an attribution
 *                         box with reasoning + buy buttons.
 *   table               — every markdown table is wrapped in its own
 *                         horizontal scroller. 344 of 398 posts contain a
 *                         table, and comparison tables run wider than a
 *                         phone; unwrapped they pushed the whole document
 *                         sideways (390px viewport, 440px scrollWidth).
 *   <GearShortlist>     — compact "what's being compared" row for EARLY
 *                         placement. Orients rather than recommends, so
 *                         it can sit at 25–35% depth (where ~2/3 of
 *                         readers still are) without claiming a verdict
 *                         the prose hasn't earned yet.
 */
export const blogMdxComponents = {
  table: ScrollableTable,
  FAQ,
  SaveThisTone,
  AffiliateGearLink,
  GearPick,
  GearShortlist,
  GearShortlistItem,
};
