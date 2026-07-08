/**
 * Affiliate-link assembly.
 *
 * Tags are read from environment variables so the actual program IDs can
 * be rotated in Vercel without a deploy. When a tag is unset, we fall
 * back to an unattributed link so the UX still works (and existing
 * posts don't 404) — we just don't get paid for that click.
 *
 * Programs supported today:
 *   - Sweetwater  (best for new boutique/amp gear, US-centric)
 *   - Reverb      (best for used + vintage; international)
 *   - Amazon Associates (broad, mediocre commission, fastest approval)
 *
 * Tags bake into SSG pages at BUILD time, so they must be present in the
 * image build (Dockerfile ARG + build-image.yml build-arg from the GitHub
 * repo variable), not just runtime env:
 *   AMAZON_ASSOCIATES_TAG="faderandknob-20"   <- real StoreID, per the
 *     Associates dashboard. (An earlier version of this comment said
 *     "faderknob-20", which got installed as fact during the 2026-07
 *     migration and mis-attributed links until caught. Doc examples
 *     become config — keep this one exact.)
 *   SWEETWATER_AFFILIATE_ID="<impact id>"
 *   REVERB_AFFILIATE_ID="<impact id>"
 *
 * Then rebuild + deploy. No code change required to start earning.
 *
 * Note on Sweetwater / Reverb: both programs run through Impact /
 * Avantlink with click-tracking redirects rather than URL tag params,
 * so even with an ID set, the destination URL is the plain search URL.
 * The tag lives on the redirect layer (configured in the network
 * dashboard, not in this file).
 */

export interface AffiliateLinks {
  sweetwater?: string;
  reverb?: string;
  amazon?: string;
  pluginBoutique?: string;
}

const AFFILIATE_TAGS = {
  amazon: process.env.AMAZON_ASSOCIATES_TAG ?? "",
  sweetwater: process.env.SWEETWATER_AFFILIATE_ID ?? "",
  reverb: process.env.REVERB_AFFILIATE_ID ?? "",
};

/**
 * Build the three search URLs for a given product. Manufacturer is
 * prepended when present so "Tube Screamer" alone doesn't collide
 * with knockoffs.
 */
export function getAffiliateLinks(
  productName: string,
  manufacturer?: string,
): AffiliateLinks {
  const query = encodeURIComponent(
    `${manufacturer || ""} ${productName}`.trim(),
  );

  const sweetwater = `https://www.sweetwater.com/store/search.php?s=${query}`;
  const reverb = `https://reverb.com/marketplace?query=${query}`;
  const amazon = AFFILIATE_TAGS.amazon
    ? `https://www.amazon.com/s?k=${query}&tag=${AFFILIATE_TAGS.amazon}`
    : `https://www.amazon.com/s?k=${query}`;

  return { sweetwater, reverb, amazon };
}

/** True when at least one affiliate program has a tag configured. */
export function hasAffiliateProgram(): boolean {
  return Object.values(AFFILIATE_TAGS).some((tag) => tag.length > 0);
}
