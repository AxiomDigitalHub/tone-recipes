import { gearItems } from "@/lib/data";
import { getAffiliateLinks } from "@/lib/affiliate";
import AffiliateCta from "@/components/ui/AffiliateCta";
import type { SignalChainNode } from "@/types/recipe";

/**
 * "The mic in this chain" — affiliate module for the microphone position of
 * a recipe's signal chain.
 *
 * Why the mic specifically, and why Amazon-first: the mic is the one piece
 * of a vintage chain a reader can actually buy new today for under $100.
 * The amps and cabs our recipes name (Super Lead 1959, Hiwatt DR103, Mesa
 * Mark IIC+) are discontinued — Amazon doesn't sell them, and at 3% with a
 * 24-hour cookie it would be the wrong program for them anyway. The SM57
 * sits in ~150 of our recipes, is Prime-eligible, and earns cart-wide.
 * So this module is where Amazon actually fits.
 *
 * Renders nothing unless the mic resolves to a real gear item. That matters:
 * `gear_name` is free text and frequently reads "Shure SM57 + Neumann U87
 * (room)", "Close mic on the 4x12 (model undocumented)", or "Studio mic
 * (undocumented)". Searching those strings would send readers to garbage
 * results, so the query is always built from the resolved gear record
 * (manufacturer + name), never from gear_name — and an unresolvable mic
 * gets no link at all rather than a guess.
 */

/** Free-text markers meaning "we inferred this mic, the source didn't say". */
const HEDGE = /assumed|or similar|undocumented|^stage\/|^dynamic mic|^close mic/i;

/**
 * Gear records in this dataset store the manufacturer inside `name` too
 * ("Shure SM57", manufacturer "Shure"), so passing both straight through
 * to getAffiliateLinks() searches for "Shure Shure SM57" — which returns
 * junk on every retailer. Strip the redundant prefix first.
 */
function bareModelName(name: string, manufacturer: string): string {
  if (!manufacturer) return name;
  const escaped = manufacturer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return name.replace(new RegExp(`^${escaped}\\s+`, "i"), "");
}

export default function RecipeMicPick({
  signalChain,
  recipeSlug,
}: {
  signalChain: SignalChainNode[];
  recipeSlug: string;
}) {
  const micNodes = (signalChain ?? []).filter(
    (n) => n.category === "microphone" && n.gear_slug,
  );
  if (micNodes.length === 0) return null;

  // Dedupe by slug — a chain can mike two cabs with the same model.
  const seen = new Set<string>();
  const mics = micNodes.flatMap((node) => {
    const slug = node.gear_slug!;
    if (seen.has(slug)) return [];
    const gear = gearItems.find((g) => g.slug === slug);
    if (!gear) return [];
    seen.add(slug);
    return [{ gear, hedged: HEDGE.test(node.gear_name ?? "") }];
  });
  if (mics.length === 0) return null;

  return (
    <section className="mic-pick" aria-label="Microphone used in this chain">
      <div className="mic-pick-kicker">
        {mics.length > 1 ? "The mics in this chain" : "The mic in this chain"}
      </div>

      {mics.map(({ gear, hedged }) => {
        const model = bareModelName(gear.name, gear.manufacturer);
        const links = getAffiliateLinks(model, gear.manufacturer);
        return (
          <div key={gear.slug} className="mic-pick-row">
            <div className="mic-pick-meta">
              <h3 className="mic-pick-name">
                <span className="mic-pick-mfr">{gear.manufacturer}</span>{" "}
                {model}
              </h3>
              <p className="mic-pick-note">
                {hedged
                  ? "The source doesn't name the mic — this is the standard choice for this sound, and what the chain above assumes."
                  : "Still made, still the studio default. The cheapest part of this chain to get right."}
              </p>
            </div>

            <div className="mic-pick-ctas">
              {links.amazon && (
                <AffiliateCta
                  retailer="Amazon"
                  url={links.amazon}
                  placement="recipe_mic"
                  gearSlug={gear.slug}
                  pageSlug={recipeSlug}
                  primary
                />
              )}
              {links.sweetwater && (
                <AffiliateCta
                  retailer="Sweetwater"
                  url={links.sweetwater}
                  placement="recipe_mic"
                  gearSlug={gear.slug}
                  pageSlug={recipeSlug}
                />
              )}
            </div>
          </div>
        );
      })}

      <p className="mic-pick-disclosure">
        Affiliate links — we may earn a commission at no extra cost to you,
        and as an Amazon Associate we earn from qualifying purchases. The mic
        is listed because the chain uses it, not because anyone paid for the
        placement.
      </p>
    </section>
  );
}
