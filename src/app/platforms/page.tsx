import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllPlatforms,
  getRecipesForPlatform,
} from "@/lib/data/platforms";

export const metadata: Metadata = {
  title: "Modeler Platforms",
  description:
    "Find tone recipes translated for your specific modeler. Helix, Quad Cortex, TONEX, Kemper, Fractal Axe-FX, and Boss Katana — every recipe mapped to your gear.",
  openGraph: {
    title: "Modeler Platforms | Fader & Knob",
    description:
      "Tone recipes translated for every major guitar modeler platform.",
    type: "website",
  },
  keywords: [
    "guitar modeler",
    "Helix",
    "Quad Cortex",
    "TONEX",
    "Kemper",
    "Fractal",
    "Axe-FX",
    "Boss Katana",
    "amp modeler",
    "tone recipes",
  ],
};

export default function PlatformsPage() {
  const platforms = getAllPlatforms();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Modeler Platforms
        </h1>
        <p className="mt-3 text-lg text-muted">
          Every recipe on Fader &amp; Knob is translated for the platforms
          below. Pick yours and see exactly what to dial in.
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => {
          const recipeCount = getRecipesForPlatform(platform.id).length;
          return (
            <Link
              key={platform.id}
              href={`/platforms/${platform.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-transparent hover:shadow-lg"
            >
              {/* Color accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-1 transition-all group-hover:h-1.5"
                style={{ backgroundColor: platform.color }}
              />

              <div className="mt-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: platform.color }}
                >
                  {platform.manufacturer}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  {platform.label}
                </h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {platform.tagline}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-muted">
                  {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
                </span>
                <span
                  className="text-sm font-semibold transition-colors"
                  style={{ color: platform.color }}
                >
                  Explore &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
