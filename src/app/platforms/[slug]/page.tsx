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
// Pillar content intros — prose that establishes topical authority for SEO
// ---------------------------------------------------------------------------

const PLATFORM_INTROS: Record<string, string[]> = {
  helix: [
    "The Line 6 Helix family changed what guitarists expect from a modeler. When it launched in 2015, it was the first floor unit that gave touring professionals a genuine alternative to hauling amps — not because the sounds were \"close enough,\" but because the HX modeling engine captured the feel of a tube amp under your fingers. Pick dynamics, volume-knob cleanup, power-amp sag — the things that make a real amp responsive — translated in a way that earlier modelers never managed.",
    "Today the Helix ecosystem spans the Helix Floor, Helix LT, HX Stomp, HX Stomp XL, HX Effects, HX One, POD Go, and the flagship Helix Stadium with its next-generation Agoura engine. Every unit in the family runs the same core models, which means a preset you build on a Floor loads on an LT and a Stomp without conversion. That cross-compatibility, combined with a deep library of community presets on CustomTone and third-party IR packs, makes the Helix the most widely supported modeler in the market.",
    "Where the Helix really shines for tone chasers is its signal-chain architecture. You get two parallel paths with up to 32 blocks, snapshots for instant parameter changes without audible switching gaps, and a routing flexibility that lets you run two amps in stereo, blend a dry DI with a processed signal, or build a full pedalboard with amp and cab in a single preset. Every recipe on Fader & Knob includes exact Helix block names, parameter values scaled to Helix ranges, and snapshot suggestions so you can go from reading to playing in minutes.",
  ],
  quad_cortex: [
    "The Neural DSP Quad Cortex arrived in 2021 and immediately shifted the conversation about what a modeler could be. Its headline feature — Neural Captures — lets you clone the sound of any physical amp, pedal, or signal chain using machine learning. Point a mic at your vintage Marshall, run the capture process, and you get a playable digital replica that responds to your pick attack and volume knob the way the real amp does. No other platform offers anything quite like it.",
    "Under the hood, the Quad Cortex runs four SHARC DSP cores, a 7-inch capacitive touchscreen, and CorOS — an operating system that gets meaningful feature updates every few months. The signal flow supports up to four parallel rows, which means you can run two full amp rigs with independent effects chains and blend them at the output. For players coming from a traditional pedalboard-into-amp setup, that kind of routing flexibility is a revelation.",
    "The Cortex Cloud ecosystem ties it all together. Thousands of Neural Captures and complete presets are available for download, searchable by amp type, genre, and artist. When you find a recipe on Fader & Knob with a Quad Cortex translation, every block name matches the QC model library exactly, settings are scaled to QC parameter ranges, and capture recommendations point you to the best starting points on Cortex Cloud.",
  ],
  kemper: [
    "The Kemper Profiler invented the concept of amp profiling when it launched in 2012 — and more than a decade later, it remains the standard that competitors measure themselves against. The idea was radical at the time: instead of modeling an amp from circuit schematics, the Kemper analyzes the actual behavior of your physical amp through a series of test tones and builds a playable digital profile. The result captures not just the EQ curve but the gain structure, compression characteristics, and touch sensitivity of the original.",
    "The Kemper ecosystem now includes the original Profiler (rack and toaster), the Profiler Stage (pedalboard format), the Kemper Player (compact and affordable), and the MK2 generation with enhanced DSP. The Rig Exchange library contains tens of thousands of community-uploaded profiles covering every amp you can imagine — from vintage Fender blackface to modern high-gain monsters. With the recent Profiling 2.0 update in OS 14, capture accuracy has taken another major leap forward, especially for high-gain amps with complex EQ curves.",
    "Kemper recipes on Fader & Knob reference Rig Exchange profile types and categories so you can search for the right starting point. Performance mode tips, morph assignments, and Pure Cabinet recommendations are included when the recipe calls for them.",
  ],
  katana: [
    "The Boss Katana is the best-selling modeling amp in the world for a reason: it sounds significantly better than it has any right to at its price point. Under the familiar practice-amp exterior, it runs the same BOSS tube-amp modeling algorithms found in their GT-1000 flagship processor. Most Katana owners never discover this because the stock presets are conservative and the front panel only scratches the surface of what the amp can do.",
    "The real power unlocks when you connect to Boss Tone Studio. The Katana's five amp types (Clean, Crunch, Lead, Brown, Acoustic) each have multiple hidden variations — a total of 22 amp models accessible only through the software. Add in 60+ effects (the same BOSS stompbox models from their MDP platform), five simultaneous effects slots, and a Power Control that lets you get cranked-amp tone at bedroom volumes, and you have a genuinely deep tone platform hiding inside an affordable combo.",
    "Katana recipes on Fader & Knob translate to the amp's available controls and effects, call out Tone Studio panel numbers and hidden amp variations, and include Power Control settings so your tones translate from bedroom to stage.",
  ],
  fractal: [
    "Fractal Audio set the standard for accuracy in digital amp modeling. The Axe-FX, introduced in 2006, was the first unit that convinced studio engineers they could track guitars through a modeler without anyone knowing the difference. Two decades of firmware updates later, the current generation — Axe-FX III, FM9, and FM3 — uses Fractal's Cygnus amp modeling engine, which models individual circuit components down to the transformer iron and speaker cone breakup.",
    "What separates Fractal from other platforms is the depth of control. Every amp model exposes parameters that other modelers hide or simplify: input impedance, negative feedback, bias excursion, transformer match, speaker impedance curves, power tube sag. For players who want to understand exactly why an amp sounds the way it does and tweak every variable, nothing else comes close. The tradeoff is a steeper learning curve — but the routing flexibility (series, parallel, matrix mixing) and scene/channel system reward the investment.",
    "Fractal recipes on Fader & Knob use the correct Axe-FX model names, specify firmware-relevant parameters, and include scene layout recommendations so you can organize rhythm, lead, and clean tones within a single preset.",
  ],
  tonex: [
    "IK Multimedia's TONEX took a different approach to the amp-modeling problem: instead of modeling circuits or profiling amps, it uses AI-powered machine learning to create Tone Models — neural network snapshots of real amplifiers and pedals. The technology is similar in concept to Neural DSP's captures but optimized for IK's ecosystem, which spans the TONEX Pedal, TONEX software (standalone and plugin), and integration with AmpliTube 5.",
    "The TONEX Pedal is where most guitarists encounter the platform. It packs three Tone Model slots, a built-in tuner, and basic effects (compressor, overdrive, modulation, delay, reverb) into a compact stompbox format. The real depth comes from ToneNET — IK's cloud library of community-uploaded Tone Models. Search for any amp by name and you will find dozens of captures from different users, each with slightly different mic positions, settings, and character. It is the largest library of AI amp models available.",
    "TONEX recipes on Fader & Knob reference specific ToneNET search terms and Tone Model categories so you can find the right capture quickly. Since TONEX focuses on amp and pedal tone rather than full signal chains, recipes include guidance on which effects to handle externally via pedals or your DAW.",
  ],
};

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

      {/* ---- Pillar intro prose ---- */}
      {PLATFORM_INTROS[slug] && (
        <section className="mb-16 max-w-3xl">
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {PLATFORM_INTROS[slug].map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

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
