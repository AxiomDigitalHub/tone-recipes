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
            Vol. 04 · Issue 14 · {monthYear.toUpperCase()} · Live Archive
          </div>
          <div>Stop tweaking. Start playing.</div>
        </div>
      </div>

      {/* Preview-only sub-nav. Lets the user navigate the v3 surfaces. */}
      <nav className="preview-subnav">
        <div className="preview-subnav-inner">
          <Link href="/preview" className="preview-subnav-brand">
            Fader &amp; Knob
          </Link>
          <div className="preview-subnav-links">
            <Link href="/preview/browse">Archive</Link>
            <Link href="/preview/platforms">Platforms</Link>
            <Link href="/preview/blog">Field Notes</Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
