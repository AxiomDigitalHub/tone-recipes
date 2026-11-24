/**
 * Buy links for the Pedalboard view (redesign step 3, handoff "Affiliate").
 *
 * Rules this file enforces:
 * - Every affiliate link gets rel="sponsored nofollow" (see BuyLink).
 * - Never hard-code a price. Prices and product photos come live from a
 *   retailer feed. No feed is connected yet, so no price or photo renders.
 * - Gear built into the amp (its speakers, its reverb) is not listed for sale.
 * - Out-of-production gear links to a current stand-in.
 *
 * PLACEHOLDERS FOR DANIEL (handoff: [RETAILER], [KLONE PICK],
 * [VOLUME PEDAL PICK], [EQ PEDAL PICK]):
 * - PRIMARY_RETAILER below is a default, not a decision.
 * - STAND_INS entries with `pick: null` are still to be chosen. Until then
 *   the page says so and shows no buy link for that piece.
 */
import { getAffiliateLinks } from "@/lib/affiliate";
import type { SignalChainNode } from "@/types/recipe";

/** [RETAILER]: Amazon is the only programme with a live affiliate tag today. */
export const PRIMARY_RETAILER: { key: "amazon" | "sweetwater" | "reverb"; label: string } = {
  key: "amazon",
  label: "Amazon",
};

/** Out-of-production originals and the current gear to link instead. */
export const STAND_INS: { match: RegExp; what: string; pick: string | null }[] = [
  { match: /klon|centaur/i, what: "klone", pick: null }, // [KLONE PICK]
];

/** Generic slots that need a named product before they can link anywhere. */
export const GENERIC_PICKS: { match: RegExp; what: string; pick: string | null }[] = [
  { match: /^volume pedal$/i, what: "volume pedal", pick: null }, // [VOLUME PEDAL PICK]
  { match: /^(tilt )?eq( pedal)?$/i, what: "EQ pedal", pick: null }, // [EQ PEDAL PICK]
];

export interface BuyInfo {
  /** "shop": has a link. "builtin": part of the amp. "pending": no product chosen yet. "none": not sold here. */
  status: "shop" | "builtin" | "pending" | "none";
  /** The product the link is for (the original, or its stand-in). */
  product?: string;
  url?: string;
  retailer?: string;
  /** One line shown instead of, or beside, the buy row. */
  note?: string;
  /** Rig item type for "I own this". */
  rigType: string;
}

const BUILT_IN = /built-?in|onboard|on-board|combo speaker|stock speaker|amp'?s (own|spring|reverb)|spring tank/i;

export function buyInfoFor(node: SignalChainNode): BuyInfo {
  const name = node.gear_name || "";
  const rigType =
    node.category === "cabinet" ? "cabinet"
    : node.category === "microphone" ? "microphone"
    : node.category === "preamp" || node.category === "power_amp" ? "amp"
    : node.category === "guitar" ? "guitar"
    : "effect";

  // The mic has its own module on the page (RecipeMicPick).
  if (node.category === "microphone" || node.category === "guitar") return { status: "none", rigType };
  if (BUILT_IN.test(name) || (node.category === "cabinet" && /speakers?$/i.test(name))) {
    return { status: "builtin", rigType, note: "Built into the amp. Nothing separate to buy." };
  }
  for (const s of [...STAND_INS, ...GENERIC_PICKS]) {
    if (!s.match.test(name)) continue;
    const oop = STAND_INS.includes(s);
    if (!s.pick) {
      return {
        status: "pending",
        rigType,
        note: oop
          ? `The original is long out of production. We have not picked a current ${s.what} to link yet.`
          : `Any ${s.what} works here. We have not picked one to link yet.`,
      };
    }
    const links = getAffiliateLinks(s.pick);
    return {
      status: "shop",
      rigType,
      product: s.pick,
      url: links[PRIMARY_RETAILER.key],
      retailer: PRIMARY_RETAILER.label,
      note: oop ? `The original is long out of production, so this links to a current ${s.what}: ${s.pick}.` : undefined,
    };
  }
  if (!name) return { status: "none", rigType };
  const links = getAffiliateLinks(name);
  const url = links[PRIMARY_RETAILER.key];
  return url ? { status: "shop", rigType, product: name, url, retailer: PRIMARY_RETAILER.label } : { status: "none", rigType };
}
