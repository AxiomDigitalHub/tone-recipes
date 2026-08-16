import Link from "next/link";
import type { Metadata } from "next";
import { getAllPlatforms } from "@/lib/data/platforms";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Platforms — Fader & Knob",
  description:
    "Every recipe ports to Helix, Quad Cortex, TONEX, Fractal Axe-Fx, Kemper, Boss Katana, and pedalboard. Pick your modeler.",
  alternates: { canonical: "/platforms" },
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

        {/* What porting a recipe actually means. This page used to be a
            grid of seven links and ~45 words, which read as thin to
            crawlers and answered none of the questions a player arrives
            with. */}
        <section className="hub-prose" aria-labelledby="porting-head">
          <div className="how-head">
            <h2 id="porting-head" className="display">
              What gets translated
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>

          <p>
            A tone recipe starts as the physical rig: the guitar and pickup
            position, the pedals in front, the amp and its knob positions,
            the cabinet and where the mic sat. That chain is the source of
            truth. Every platform page below is that same chain re-expressed
            in the block names and parameter ranges your unit actually uses
            — a Tube Screamer becomes a Screamer on Helix and a TS808 on
            Fractal, and the drive knob is converted into whatever scale
            that block reports, not copied across as a number that happens
            to look right.
          </p>

          <h3>Where you get a file, and where you get settings</h3>
          <p>
            Helix, Quad Cortex, and Boss Katana recipes build a preset file
            you can import — a <code>.hlx</code>, a bundle, or a{" "}
            <code>.tsl</code> — because those formats are documented well
            enough to write correctly. TONEX, Fractal, and Kemper recipes
            give you the full block list and every value to dial in by hand.
            That split is a limitation of the file formats, not of the
            research behind the recipe, and it&apos;s marked on each recipe
            before you click anything.
          </p>

          <h3>What survives the port, and what doesn&apos;t</h3>
          <p>
            Gain structure, block order, and the relationships between
            settings port cleanly: if the amp is on the edge of breakup with
            a boost slamming the front, that survives on every platform.
            Exact captures don&apos;t. A Kemper profile of a specific 1959
            Bassman and a Helix model of the same amp are different pieces
            of software, so the recipe gives you the closest model plus the
            settings that get its behaviour into the same place, not a
            claim that they are identical. Where a platform has no
            equivalent block at all, the chain says so rather than
            substituting something quietly.
          </p>

          <h3>Don&apos;t own a modeler?</h3>
          <p>
            The pedalboard view drops the translation layer and shows the
            original hardware chain — real pedals, real amp, real settings.
            It&apos;s the same recipe, which is the point: the modeler
            versions are derived from it, not the other way round. You can
            also put two chains next to each other on the{" "}
            <Link href="/compare">compare page</Link> to see how a rig
            changes from one player to another, or start from{" "}
            <Link href="/browse">the full archive</Link>.
          </p>
        </section>
      </section>
    </div>
  );
}
