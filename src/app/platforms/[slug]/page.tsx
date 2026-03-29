import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import RecipeCard from "@/components/recipe/RecipeCard";
import { getSongBySlug, getArtistBySlug } from "@/lib/data";
import {
  getPlatformInfo,
  getAllPlatforms,
  getRecipesForPlatform,
  getGearWithEquivalent,
  getPlatformTips,
  getBlogPostsForPlatform,
} from "@/lib/data/platforms";

// ---------------------------------------------------------------------------
// "Why [Platform] players love Fader & Knob" — per-platform bullet points
// ---------------------------------------------------------------------------

const WHY_BULLETS: Record<string, string[]> = {
  helix: [
    "Every recipe includes exact Helix block names, so you never have to guess which model matches the original gear.",
    "Signal-chain order is mapped one-to-one — drop blocks in the same order and you are 90% there before you touch a knob.",
    "Settings are translated to Helix parameter ranges, not generic 0-10 values.",
    "Snapshots, footswitch assignments, and routing tips are included when a recipe calls for them.",
  ],
  quad_cortex: [
    "Recipes list the exact QC model names, including Neural Capture equivalents when available.",
    "Parallel-row routing suggestions help you take full advantage of the QC's four signal paths.",
    "Every setting is scaled to the Quad Cortex parameter range — no mental math required.",
    "Cortex Cloud links are included when a community capture matches the recipe's target amp.",
  ],
  tonex: [
    "Recipes reference specific Tone Model categories so you can find the right capture in ToneNET.",
    "The stomp + Tone Model + EQ chain structure mirrors how TONEX pedal users actually build patches.",
    "Gain-staging advice accounts for how Tone Models respond differently than traditional amp sims.",
    "Settings translate cleanly to the TONEX pedal, TONEX SE plugin, and AmpliTube 5 integration.",
  ],
  kemper: [
    "Recipes reference Rig Exchange profile types so you can search for the right starting point.",
    "Morph and performance-mode tips are baked in when a recipe needs multiple gain stages.",
    "Settings respect Kemper's unique gain structure — soft-to-hard parameter ranges are accounted for.",
    "Pure Cabinet and cab-off recommendations are included for monitoring through FRFR or studio monitors.",
  ],
  fractal: [
    "Recipes use Axe-FX model names and firmware-specific parameters where they differ across versions.",
    "Scene layout recommendations help you organize rhythm, lead, and clean tones in a single preset.",
    "Advanced amp-block parameters (speaker impedance, negative feedback, bias) are included when they matter.",
    "Routing suggestions leverage Fractal's flexible series/parallel architecture for complex rigs.",
  ],
  katana: [
    "Recipes translate to the Katana's available amp types and effects, keeping it practical for a single-amp setup.",
    "Tone Studio panel numbers and hidden amp variations are called out so you can access the full model library.",
    "Power Control and gain-staging tips ensure great recorded tone at bedroom volumes.",
    "Effect slot assignments (Booster / Mod / FX / Delay / Reverb) are mapped to the Katana's channel structure.",
  ],
};

// ---------------------------------------------------------------------------
// Gear-type labels for grouping
// ---------------------------------------------------------------------------

const GEAR_TYPE_LABELS: Record<string, string> = {
  amp: "Amps",
  effect: "Effects Pedals",
  guitar: "Guitars",
  cabinet: "Cabinets",
  microphone: "Microphones",
};

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllPlatforms().map((p) => ({ slug: p.id }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface PlatformPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PlatformPageProps): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatformInfo(slug);
  if (!platform) return { title: "Platform Not Found" };

  const recipeCount = getRecipesForPlatform(slug).length;

  return {
    title: `${platform.label} Tone Recipes — ${platform.manufacturer}`,
    description: `${recipeCount} tone recipes translated for ${platform.label} by ${platform.manufacturer}. Exact block names, settings, and signal-chain order for your modeler.`,
    openGraph: {
      title: `${platform.label} Tone Recipes | Fader & Knob`,
      description: `Dial in iconic guitar tones on your ${platform.label}. ${recipeCount} recipes with exact model names and settings.`,
      type: "website",
    },
    keywords: [
      platform.label,
      platform.manufacturer,
      "tone recipes",
      "guitar modeler",
      "signal chain",
      "amp models",
    ],
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PlatformDetailPage({
  params,
}: PlatformPageProps) {
  const { slug } = await params;
  const platform = getPlatformInfo(slug);
  if (!platform) notFound();

  const recipes = getRecipesForPlatform(slug);
  const gearMappings = getGearWithEquivalent(slug);
  const tips = getPlatformTips(slug);
  const blogPosts = getBlogPostsForPlatform(slug);
  const whyBullets = WHY_BULLETS[slug] ?? [];

  // Group gear by type
  const gearByType: Record<string, typeof gearMappings> = {};
  for (const item of gearMappings) {
    const type = item.gear.type;
    if (!gearByType[type]) gearByType[type] = [];
    gearByType[type].push(item);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      {/* ---- Hero ---- */}
      <section className="mb-16">
        <Link
          href="/platforms"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr; All Platforms
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: platform.color }}
            >
              {platform.manufacturer}
            </p>
            <h1 className="mt-1 text-4xl font-bold text-foreground sm:text-5xl">
              {platform.label}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted leading-relaxed">
              {platform.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
              style={{ backgroundColor: platform.color }}
            >
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>
        </div>

        {/* Accent divider */}
        <div
          className="mt-8 h-1 w-24 rounded-full"
          style={{ backgroundColor: platform.color }}
        />
      </section>

      {/* ---- Why section ---- */}
      {whyBullets.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground">
            Why {platform.label} players love Fader &amp; Knob
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {whyBullets.map((bullet, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border bg-surface p-4"
              >
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-muted">{bullet}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---- Featured Recipes ---- */}
      {recipes.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground">
            {platform.label} Recipes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Every recipe with a {platform.label} translation, ready to dial in.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const song = getSongBySlug(recipe.song_slug);
              const artist = song
                ? getArtistBySlug(song.artist_slug)
                : undefined;
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  artist={artist}
                  song={song}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ---- Gear Model Mappings ---- */}
      {gearMappings.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground">
            Gear &rarr; {platform.label} Model Mappings
          </h2>
          <p className="mt-1 text-sm text-muted">
            Real gear names mapped to their {platform.label} equivalents.
          </p>

          <div className="mt-6 space-y-8">
            {Object.entries(gearByType).map(([type, items]) => (
              <div key={type}>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {GEAR_TYPE_LABELS[type] ?? type}
                </h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          Real Gear
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          <span style={{ color: platform.color }}>
                            {platform.label}
                          </span>{" "}
                          Model
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(({ gear, equivalentName }) => (
                        <tr
                          key={gear.slug}
                          className="border-b border-border last:border-0 transition-colors hover:bg-surface-hover"
                        >
                          <td className="px-4 py-2.5 text-muted">
                            <Link
                              href={`/gear/${gear.slug}`}
                              className="hover:text-foreground transition-colors"
                            >
                              {gear.name}
                            </Link>
                          </td>
                          <td
                            className="px-4 py-2.5 font-medium"
                            style={{ color: platform.color }}
                          >
                            {equivalentName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---- Platform Tips ---- */}
      {tips.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground">
            {platform.label} Tips
          </h2>
          <p className="mt-1 text-sm text-muted">
            Get more out of your {platform.label} with these practical tips.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    {i + 1}
                  </span>
                  {tip.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---- Related Blog Posts ---- */}
      {blogPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground">
            Related Articles
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-transparent hover:shadow-lg"
              >
                <p className="text-xs text-muted">{post.date}</p>
                <h3 className="mt-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-foreground">
          Make {platform.label} your default platform
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Set {platform.label} as your default and every recipe will
          automatically show the {platform.label} translation first.
        </p>
        <Link
          href="/browse"
          className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: platform.color }}
        >
          Set {platform.label} as Default
        </Link>
      </section>
    </main>
  );
}
