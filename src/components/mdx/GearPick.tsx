import { getAffiliateLinks } from "@/lib/affiliate";
import AffiliateCta from "@/components/ui/AffiliateCta";

/**
 * <GearPick> — editor's-pick attribution block for gear roundup posts.
 *
 * Usage in MDX:
 *
 *   <GearPick
 *     name="FRFR-112 MkII"
 *     manufacturer="Headrush"
 *     verdict="Best balance of stage volume and price"
 *     price="$499"
 *     pros={["Loud enough for full band", "Solid build", "Tilt-back position"]}
 *     cons={["Not flat — has its own voicing", "Single 1×12 limits low end"]}
 *   >
 *     The FRFR-112 MkII is what we recommend most often when someone
 *     asks "I have $500 and need to gig with a modeler." …
 *   </GearPick>
 *
 * Renders an attribution box with:
 *   - Product name + manufacturer kicker
 *   - One-line verdict + price
 *   - Optional pros/cons grid
 *   - Children = editorial reasoning (the why)
 *   - Three buy buttons (Sweetwater / Reverb / Amazon) — rendered as
 *     real <a rel="nofollow sponsored"> so they're click-trackable
 *     and don't pass PageRank.
 *
 * The block uses semantic, theme-token-driven styles (paper/ink/amber)
 * so it inherits the v3 magazine look without leaking the dark global
 * theme into the post body.
 */

interface GearPickProps {
  name: string;
  manufacturer?: string;
  verdict?: string;
  price?: string;
  pros?: string[];
  cons?: string[];
  /**
   * Experiment arm id, when this block is part of a running affiliate
   * experiment (see docs/AFFILIATE_EXPERIMENTS.md). Flows through to the
   * affiliate_click event so arms can be compared without splitting
   * traffic — at this site's volume, page-level arms are the only design
   * with any statistical power.
   */
  experiment?: string;
  /**
   * Analytics placement label. Defaults to "gear_pick". Override to measure
   * a distinct use of this block separately — E1 in
   * docs/AFFILIATE_EXPERIMENTS.md uses "settings_companion" for the
   * companion-gear blocks on settings guides, which need to be compared
   * against the amp-offer blocks on the same pages.
   */
  placement?: string;
  /**
   * Put Amazon first instead of Sweetwater. This is the E4 decision rule,
   * settled on commission structure rather than a test that could never
   * reach significance: below roughly $200, Amazon's 24-hour cookie is
   * survivable on an impulse buy, Prime friction is lowest, and cart-wide
   * attribution pays on the rest of the basket. Above that, Sweetwater's
   * 3–8% and 14–30 day cookie win on gear people deliberate over.
   */
  amazonFirst?: boolean;
  children?: React.ReactNode;
}

/** Stable-ish product id for analytics grouping (no gear record exists here). */
function pickSlug(name: string, manufacturer?: string): string {
  return `${manufacturer ?? ""} ${name}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function GearPick({
  name,
  manufacturer,
  verdict,
  price,
  pros,
  cons,
  experiment,
  placement = "gear_pick",
  amazonFirst = false,
  children,
}: GearPickProps) {
  const links = getAffiliateLinks(name, manufacturer);
  const slug = pickSlug(name, manufacturer);

  const buttons: { label: string; url: string | undefined }[] = amazonFirst
    ? [
        { label: "Amazon", url: links.amazon },
        { label: "Sweetwater", url: links.sweetwater },
        { label: "Reverb", url: links.reverb },
      ]
    : [
        { label: "Sweetwater", url: links.sweetwater },
        { label: "Reverb", url: links.reverb },
        { label: "Amazon", url: links.amazon },
      ];

  return (
    <aside
      className="gear-pick"
      aria-label={`Editor's pick: ${manufacturer ? manufacturer + " " : ""}${name}`}
    >
      <header className="gear-pick-head">
        <div className="gear-pick-kicker">
          <span className="gear-pick-mark" aria-hidden="true">★</span>
          <span>Editor&rsquo;s pick</span>
          {price && (
            <>
              <span className="sep">·</span>
              {/* Labelled "street" on purpose. Amazon's Operating Agreement
                  bars showing a price as if it were theirs unless it comes
                  live from PA-API — this is a hand-written ballpark, so it
                  must never read as the price behind the Amazon button. */}
              <span
                className="gear-pick-price"
                title="Approximate street price when written — not a live retailer quote"
              >
                Street {price}
              </span>
            </>
          )}
        </div>
        <h3 className="gear-pick-title">
          {manufacturer && (
            <span className="gear-pick-mfr">{manufacturer}</span>
          )}
          <span className="gear-pick-name">{name}</span>
        </h3>
        {verdict && <p className="gear-pick-verdict">{verdict}</p>}
      </header>

      {children && <div className="gear-pick-body">{children}</div>}

      {(pros?.length || cons?.length) && (
        <div className="gear-pick-pros-cons">
          {pros && pros.length > 0 && (
            <div>
              <div className="gear-pick-pc-label gear-pick-pc-pros">Pros</div>
              <ul>
                {pros.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {cons && cons.length > 0 && (
            <div>
              <div className="gear-pick-pc-label gear-pick-pc-cons">Cons</div>
              <ul>
                {cons.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="gear-pick-cta-row">
        <span className="gear-pick-cta-label">Check price</span>
        {buttons.map(
          (b) =>
            b.url && (
              <AffiliateCta
                key={b.label}
                retailer={b.label}
                url={b.url}
                placement={placement}
                gearSlug={slug}
                experiment={experiment}
                unstyled
                className="gear-pick-cta"
              />
            ),
        )}
      </div>

      <p className="gear-pick-disclosure">
        Affiliate links — we may earn a small commission at no extra cost
        to you, and as an Amazon Associate we earn from qualifying
        purchases. Picks are editorial; prices are approximate street
        prices, not live retailer quotes.
      </p>
    </aside>
  );
}
