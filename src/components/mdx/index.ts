import FAQ from "./FAQ";
import SaveThisTone from "./SaveThisTone";
import AffiliateGearLink from "../ui/AffiliateGearLink";
import GearPick from "./GearPick";

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
 */
export const blogMdxComponents = {
  FAQ,
  SaveThisTone,
  AffiliateGearLink,
  GearPick,
};
