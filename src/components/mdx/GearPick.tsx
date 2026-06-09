import { getAffiliateLinks } from "@/lib/affiliate";

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
  children?: React.ReactNode;
}

export default function GearPick({
  name,
  manufacturer,
  verdict,
  price,
  pros,
  cons,
  children,
}: GearPickProps) {
  const links = getAffiliateLinks(name, manufacturer);

  const buttons: { label: string; url: string | undefined }[] = [
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
              <span className="gear-pick-price">{price}</span>
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
              <a
                key={b.label}
                href={b.url}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="gear-pick-cta"
                data-analytics={`gear_pick_${b.label.toLowerCase()}`}
              >
                {b.label} <span aria-hidden="true">↗</span>
              </a>
            ),
        )}
      </div>

      <p className="gear-pick-disclosure">
        Affiliate links — we may earn a small commission at no extra cost
        to you. Picks are editorial.
      </p>
    </aside>
  );
}
