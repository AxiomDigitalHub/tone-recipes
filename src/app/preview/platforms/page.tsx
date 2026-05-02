import Link from "next/link";
import type { Metadata } from "next";
import { getAllPlatforms, getRecipesForPlatform } from "@/lib/data/platforms";

export const metadata: Metadata = {
  title: "Preview · Platforms — Fader & Knob",
  robots: { index: false, follow: false },
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

  return (
    <div className="container">
      <section className="platforms-index">
        <div className="how-head">
          <h2 className="display">
            Built for the rig <em>you already own</em>
          </h2>
          <span className="section-rule" aria-hidden="true" />
          <span className="section-meta">{platforms.length} modelers</span>
        </div>
        <p className="audition-lede">
          Every recipe is translated into the exact block names and parameter
          values your modeler expects. Pick your unit and start playing.
        </p>

        <div className="platforms-grid">
          {platforms.map((p, i) => {
            const recipes = getRecipesForPlatform(p.id);
            const hue = HUE_BY_PLATFORM[p.id] ?? ((i % 6) + 1);
            return (
              <Link
                key={p.id}
                href={`/preview/platforms/${p.id}`}
                className={`platform-card lp-hue-${hue}`}
              >
                <span className="platform-card-stripe" aria-hidden="true" />
                <div className="platform-card-meta">
                  <span className="platform-card-mfr">{p.manufacturer}</span>
                  <span className="platform-card-count">
                    {recipes.length} recipes
                  </span>
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
