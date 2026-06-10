import Link from "next/link";
import type { Metadata } from "next";
import { getAllPlatforms } from "@/lib/data/platforms";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Platforms — Fader & Knob",
  description:
    "Every recipe ports to Helix, Quad Cortex, TONEX, Fractal Axe-Fx, Kemper, Boss Katana, and pedalboard. Pick your modeler.",
  openGraph: {
    title: "Platforms — Fader & Knob",
    description: "Recipes for every major modeler. Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana.",
    type: "website",
  },
};

const HUE_BY_PLATFORM: Record<string, number> = {
  helix: 1,
  quad_cortex: 4,
  tonex: 6,
  fractal: 3,
  kemper: 5,
  katana: 2,
};

export default function PreviewPlatformsIndex() {
  const platforms = getAllPlatforms();

  const collectionLd = collectionPageJsonLd({
    name: "Platforms — Fader & Knob",
    description:
      "Every recipe ports to Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss Katana, and pedalboard. Pick your modeler.",
    url: "https://faderandknob.com/platforms",
    items: platforms.map((p) => ({
      url: `https://faderandknob.com/platforms/${p.id}`,
      name: p.label,
      description: p.tagline,
    })),
  });

  return (
    <div className="container">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <section className="platforms-index">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Platforms</span>
        </div>

        <header className="archive-masthead archive-masthead-tight">
          <div className="recipe-issue">
            <span className="pill">Platforms</span>
          </div>
          <h1 className="recipe-title display">
            Built for the rig <em>you already own</em>
          </h1>
          <p className="recipe-summary">
            Every recipe is translated into the exact block names and parameter
            values your modeler expects. Pick your unit and start playing.
          </p>
        </header>

        <div className="platforms-grid">
          {platforms.map((p, i) => {
            const hue = HUE_BY_PLATFORM[p.id] ?? ((i % 6) + 1);
            return (
              <Link
                key={p.id}
                href={`/platforms/${p.id}`}
                className={`platform-card lp-hue-${hue}`}
              >
                <span className="platform-card-stripe" aria-hidden="true" />
                <div className="platform-card-meta">
                  <span className="platform-card-mfr">{p.manufacturer}</span>
                </div>
                <h3 className="platform-card-name">{p.label}</h3>
                <p className="platform-card-tagline">{p.tagline}</p>
                <span className="platform-card-cta">
                  Open the manual <span aria-hidden="true">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
