import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared layout for the legal pages — Privacy / Terms / Affiliate
 * Disclosure. Just paper + ink prose with the v3 chrome above.
 */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="container">
      <section className="legal-page">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{title}</span>
        </div>

        <header className="archive-page-head browse-page-head">
          <h1 className="archive-title">{title}</h1>
        </header>

        <p className="legal-updated">Last updated {updated}</p>

        <div className="legal-prose">{children}</div>
      </section>
    </div>
  );
}
