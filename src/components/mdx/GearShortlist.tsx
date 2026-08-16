import { getAffiliateLinks } from "@/lib/affiliate";
import AffiliateCta from "@/components/ui/AffiliateCta";

/**
 * <GearShortlist> — compact "here's what's being compared" row, designed to
 * be placed EARLY in a post.
 *
 * Why this exists rather than just moving <GearPick> up the page: the
 * 2026-07 Clarity scroll audit found the binding constraint is depth, not
 * copy. On the top blog page only 22% of readers reach 70% depth, and 41%
 * reach the halfway mark. But every <GearPick> in the vs/roundup posts sits
 * inside a "Buy the X If…" or "So Which One Should You Buy" section — which
 * is editorially *correct*. Hoisting a verdict block to 30% depth would
 * mean recommending a product before the article has made its argument.
 *
 * So this is the honest early-placement primitive: it orients rather than
 * recommends. No "Editor's pick" mark, no verdict, no pros/cons — just the
 * contenders, their street prices, and a link for the reader who has
 * already decided and only came for the price. The <GearPick> verdict
 * blocks stay exactly where the prose earns them.
 *
 * ── Why children instead of an `items={[…]}` array prop ──
 * Array/object expression props are unreliable through this MDX pipeline.
 * Verified 2026-07-29: a server-side probe showed `label` (a string
 * attribute) arriving correctly while `items={[{…}]}` arrived as
 * `undefined`, on a build that compiled cleanly — and `@mdx-js/mdx`
 * compiles all of those shapes without error, so the loss happens after
 * compile, not during it. The same failure silently blanks the in-MDX
 * `<FAQ questions={[…]}>` blocks in 57 posts, and both FAQ and EQCurve
 * already carry defensive `Array.isArray()` guards, so it has bitten
 * before. Plain string attributes are the shape that always survives
 * (see <GearPick>'s long comma-laden `verdict`), so items are expressed
 * as child elements with string-only props.
 *
 * Usage in MDX:
 *
 *   <GearShortlist label="What's in this comparison">
 *     <GearShortlistItem name="Studio JTM (ST20H)" manufacturer="Marshall" note="JTM45 circuit, tube rectifier" />
 *     <GearShortlistItem name="Studio Classic (SC20C)" manufacturer="Marshall" note="1959 Plexi circuit, EL34s" />
 *   </GearShortlist>
 */

interface GearShortlistProps {
  label?: string;
  children?: React.ReactNode;
}

export default function GearShortlist({
  label = "What's in this comparison",
  children,
}: GearShortlistProps) {
  return (
    <aside className="gear-shortlist" aria-label={label}>
      <div className="gear-shortlist-label">{label}</div>

      <div className="gear-shortlist-items">{children}</div>

      <p className="gear-shortlist-disclosure">
        Our verdict is further down — nothing here is a recommendation yet.
        Affiliate links; as an Amazon Associate we earn from qualifying
        purchases, at no extra cost to you.
      </p>
    </aside>
  );
}

interface GearShortlistItemProps {
  name: string;
  manufacturer?: string;
  /** Approximate street price. Never presented as a live retailer quote. */
  price?: string;
  /** One short clause — what this one is, not why to buy it. */
  note?: string;
}

function itemSlug(name: string, manufacturer?: string): string {
  return `${manufacturer ?? ""} ${name}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function GearShortlistItem({
  name,
  manufacturer,
  price,
  note,
}: GearShortlistItemProps) {
  const links = getAffiliateLinks(name, manufacturer);
  const slug = itemSlug(name, manufacturer);

  return (
    <div className="gear-shortlist-item">
      <div className="gear-shortlist-meta">
        <span className="gear-shortlist-name">
          {manufacturer && (
            <span className="gear-shortlist-mfr">{manufacturer} </span>
          )}
          {name}
        </span>
        {price && (
          <span
            className="gear-shortlist-price"
            title="Approximate street price — not a live retailer quote"
          >
            Street {price}
          </span>
        )}
        {note && <span className="gear-shortlist-note">{note}</span>}
      </div>
      <div className="gear-shortlist-ctas">
        {links.sweetwater && (
          <AffiliateCta
            retailer="Sweetwater"
            url={links.sweetwater}
            placement="gear_shortlist"
            gearSlug={slug}
          />
        )}
        {links.amazon && (
          <AffiliateCta
            retailer="Amazon"
            url={links.amazon}
            placement="gear_shortlist"
            gearSlug={slug}
          />
        )}
      </div>
    </div>
  );
}
