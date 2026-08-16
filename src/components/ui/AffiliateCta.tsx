"use client";

/**
 * A single trackable affiliate button — the one place affiliate outbound
 * clicks get measured.
 *
 * The only reason this is a client component is the GA4 event; the href is
 * built by getAffiliateLinks() on the server so the tag still bakes into
 * prerendered HTML. Before this existed, affiliate CTAs carried a
 * `data-analytics` attribute that nothing ever read, so click-through was
 * completely invisible — Clarity's "Outbound click" smart event (16
 * sessions/30d) was the only signal, and it counts source citations and
 * every other external link too.
 *
 * `depthPct` and `experiment` exist because the 2026-07 Clarity scroll
 * audit showed placement depth, not copy, is the dominant variable: on the
 * top blog page only 22% of readers ever reach 70% depth, where its single
 * GearPick sits. Emitting depth with the click is what makes that
 * measurable instead of inferred. See docs/AFFILIATE_EXPERIMENTS.md.
 *
 * rel="nofollow sponsored" is required by Google for paid links; noopener
 * because we open a new tab.
 */

import { useRef } from "react";
import { track } from "@/lib/analytics";

export interface AffiliateCtaProps {
  /** Retailer name, shown on the button ("Amazon", "Sweetwater", …). */
  retailer: string;
  url: string;
  /** Where on the site this button lives, e.g. "recipe_mic", "gear_pick". */
  placement: string;
  /** Which product it points at, for per-product revenue attribution. */
  gearSlug: string;
  /** Page the click happened on — recipe slug or blog slug. */
  pageSlug?: string;
  /** Experiment arm id, when this CTA is part of a running experiment. */
  experiment?: string;
  /** Visually emphasise this one as the recommended retailer. */
  primary?: boolean;
  /**
   * Drop the default `.aff-cta` styling and use only `className`. Needed by
   * <GearPick>, which has its own long-standing `.gear-pick-cta` look —
   * emitting both classes would leave the winner down to stylesheet source
   * order, and `.aff-cta` (declared later) would silently strip GearPick's
   * dark fill.
   */
  unstyled?: boolean;
  className?: string;
}

/**
 * How far down the page this button actually sits, measured from the DOM at
 * click time and bucketed to keep GA4 cardinality low.
 *
 * Measured rather than passed in: MDX authors would have to hand-maintain a
 * percentage that changes every time the post is edited, and the rendered
 * position doesn't track line position anyway (images and tables render far
 * taller than their source lines). The element knows where it is; ask it.
 */
function depthBucketOf(el: HTMLElement | null): string | undefined {
  if (!el) return undefined;
  const pageHeight = document.documentElement.scrollHeight;
  if (!pageHeight) return undefined;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const pct = (top / pageHeight) * 100;
  if (pct < 25) return "0-25";
  if (pct < 50) return "25-50";
  if (pct < 75) return "50-75";
  return "75-100";
}

export default function AffiliateCta({
  retailer,
  url,
  placement,
  gearSlug,
  pageSlug,
  experiment,
  primary = false,
  unstyled = false,
  className = "",
}: AffiliateCtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const base = unstyled
    ? ""
    : `aff-cta${primary ? " aff-cta-primary" : ""}`;

  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={`${base} ${className}`.trim()}
      onClick={() =>
        track("affiliate_click", {
          retailer: retailer.toLowerCase(),
          placement,
          gear_slug: gearSlug,
          page_slug: pageSlug,
          depth_bucket: depthBucketOf(ref.current),
          experiment,
        })
      }
    >
      {retailer} <span aria-hidden="true">↗</span>
    </a>
  );
}
