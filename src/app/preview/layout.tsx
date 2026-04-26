import type { ReactNode } from "react";
import Link from "next/link";
import { toneRecipes, artists } from "@/lib/data";
import "./preview.css";

/**
 * /preview/* — sandbox for auditioning new visual directions.
 *
 * Everything under this route uses the "editorial / hardware-catalog"
 * aesthetic from the Claude Design prototype (2026-04-18). Scoped via the
 * `fk-preview` class on the root element so the new stylesheet doesn't leak
 * into production pages. When the direction is locked, the winning bits
 * migrate to the main site in a single PR and /preview goes away.
 *
 * The pages here deliberately opt OUT of the main site's Header + Footer
 * so the editorial chrome (masthead bar, brand, nav) can be tried in context.
 */
export const metadata = {
  title: "Preview — Fader & Knob visual direction",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  const recipeCount = toneRecipes.length;
  const playerCount = artists.length;
  const issue = new Date("2026-04-18");
  const monthYear = issue.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fk-preview">
      {/* Preview banner — always visible so nobody confuses this with prod */}
      <div className="preview-banner">
        <div className="preview-banner-inner">
          <span>
            <strong>Preview.</strong> Auditioning a new visual direction. The
            live site at{" "}
            <Link href="/" className="preview-banner-link">
              faderandknob.com
            </Link>{" "}
            is unchanged.
          </span>
          <Link href="/" className="preview-banner-exit">
            Back to production →
          </Link>
        </div>
      </div>

      {/* Masthead bar — v2 editorial chrome */}
      <div className="masthead-bar">
        <div className="masthead-bar-inner">
          <div>
            <span className="tape-dot" />
            Vol. 04 · Issue 14 · {monthYear.toUpperCase()}
            <span className="sep">/</span>
            {recipeCount.toLocaleString()} recipes
            <span className="sep">/</span>
            {playerCount} players
            <span className="sep">/</span>7 platforms
          </div>
          <div>Made for the basement · The garage · The tour bus</div>
        </div>
      </div>

      {children}
    </div>
  );
}
