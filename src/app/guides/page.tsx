import type { Metadata } from "next";
import Link from "next/link";
import PillarTiles from "@/components/guides/PillarTiles";
import { PILLARS } from "@/lib/pillars";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";

/**
 * /guides: the index of the five pillar pages (see src/lib/pillars.ts).
 * Learn (/blog) shows the same five tiles; this page exists so the
 * /guides/<pillar> URLs have a parent.
 */

const DESCRIPTION =
  "The five subjects Fader & Knob covers in depth: worship guitar on Helix, modeler setup, amp and pedal settings, signal chain and effects, and fixing your tone.";

export const metadata: Metadata = {
  title: "Guides by subject",
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  const collectionLd = collectionPageJsonLd({
    name: "Guides by subject | Fader & Knob",
    description: DESCRIPTION,
    url: "https://faderandknob.com/guides",
    items: PILLARS.map((p) => ({
      url: `https://faderandknob.com/guides/${p.slug}`,
      name: p.title,
      description: p.description,
    })),
  });

  return (
    <div className="fk-learn fk-pillar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <section className="fk-wrap fk-learn-top">
        <div>
          <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
            <Link href="/blog">Learn</Link>
          </nav>
          <div className="fk-learn-head">
            <h1 className="fk-display">Guides by subject</h1>
            <p className="fk-lead">Five subjects, each with its guides in reading order.</p>
          </div>
        </div>
        <PillarTiles />
      </section>
    </div>
  );
}
