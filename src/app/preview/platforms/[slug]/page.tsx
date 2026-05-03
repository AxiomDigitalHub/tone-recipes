import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPlatformInfo,
  getAllPlatforms,
  getRecipesForPlatform,
} from "@/lib/data/platforms";
import {
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import type { Platform } from "@/types/recipe";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { FieldNotesRail } from "@/components/v3/FieldNotesRail";
import { findRelatedPosts } from "@/components/v3/findRelatedPosts";

export function generateStaticParams() {
  return getAllPlatforms().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlatformInfo(slug);
  if (!p) {
    return { title: "Preview — Fader & Knob", robots: { index: false, follow: false } };
  }
  const recipeCount = getRecipesForPlatform(slug as Platform).length;
  const title = `${p.label}${p.manufacturer ? ` (${p.manufacturer})` : ""} Tone Recipes — Fader & Knob`;
  const description = `${recipeCount} verified tone recipes for the ${p.label}. Signal chains, block settings, and presets ready to import.`;
  return {
    title,
    description,
    keywords: [p.label, p.manufacturer, "tone recipe", "patch", "preset", "guitar tone"].filter(
      Boolean,
    ) as string[],
    openGraph: {
      title,
      description,
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}

const HUE_BY_PLATFORM: Record<string, number> = {
  helix: 1,
  quad_cortex: 4,
  tonex: 6,
  fractal: 3,
  kemper: 5,
  katana: 2,
};

/**
 * Per-platform editorial: the model lineup ("the family") plus the
 * Fader & Knob conventions that any patch on this platform follows.
 * Placeholder copy — Daniel will edit before launch. Each platform
 * gets its own photo URL (drop in when assets are ready).
 */
const PLATFORM_FAMILY: Record<
  string,
  {
    photoUrl?: string;
    photoCaption?: string;
    intro: string;
    models: { name: string; note: string }[];
    conventions: string[];
  }
> = {
  helix: {
    photoCaption: "Line 6 Helix family — Floor, LT, HX Stomp, HX Effects, HX One, POD Go, Helix Stadium",
    intro:
      "The Helix family runs the same HX modeling engine across every form factor. A patch built on a Floor loads on an LT and a Stomp without conversion. Recipes here download as .hlx files; import once and they live in your unit forever.",
    models: [
      { name: "Helix Floor / LT", note: "Full-fat unit — 2 paths, 32 blocks, all the I/O" },
      { name: "Helix Stadium", note: "Next-gen Agoura engine, more headroom for cabs" },
      { name: "HX Stomp / Stomp XL", note: "Pedalboard-friendly, 6 / 8 blocks" },
      { name: "HX Effects", note: "Effects-only — runs the FX from any patch" },
      { name: "HX One", note: "Single-block stompbox, snapshots included" },
      { name: "POD Go", note: "Fixed signal flow, runs the same models" },
    ],
    conventions: [
      "Every patch ends in a Tilt EQ — global brightness adjustment without reaching for an amp's tone stack",
      "Volume Pedal as block 1 so you can ride dynamics from the expression pedal",
      "Multi-drive recipes ship with the alternate drive blocks bypassed; stomp them in for variants",
      "Cab + Mic always uses WithPan when the dual-mic blend is part of the original tone",
    ],
  },
  quad_cortex: {
    photoCaption: "Neural DSP Quad Cortex — Capture, model, route",
    intro:
      "Quad Cortex blends Neural Capture (deep-learning amp profiles) with traditional modeling and a flexible four-grid routing canvas. Recipes here use the modeling library by default; capture-based variants are flagged where the original tone is best matched by a community capture.",
    models: [
      { name: "Quad Cortex", note: "The full unit — 8 blocks per grid, 4 grids" },
      { name: "Nano Cortex", note: "Capture-focused stompbox, smaller grid" },
    ],
    conventions: [
      "Recipes load as .qcs scenes — drag onto the Cortex Cloud or sideload via USB",
      "Captures referenced by a public Cortex Cloud handle when relevant",
      "Stereo grids used wherever the original tone is wet/dry/wet — labelled in the recipe notes",
    ],
  },
  tonex: {
    photoCaption: "IK Multimedia TONEX — pedal, software, mobile",
    intro:
      "TONEX is built around AI Tone Models — neural captures of real amps and pedals. Recipes here pair an inventory model with a small modeling chain (compressor, EQ, delay, reverb) so the captured amp does the heavy lifting.",
    models: [
      { name: "TONEX Pedal", note: "Hardware unit, 150 model slots" },
      { name: "TONEX ONE", note: "Single-Tone Model stompbox" },
      { name: "TONEX SE", note: "Software-only, runs as plugin or standalone" },
    ],
    conventions: [
      "Recipes specify the Tone Model URL on the IK ToneNET community",
      "Compressor + Tilt EQ wrapped around the Tone Model on every patch",
      "Reverb / delay run post in the modeling chain, not baked into the capture",
    ],
  },
  fractal: {
    photoCaption: "Fractal Audio Axe-Fx III + FM family",
    intro:
      "Fractal patches use Cygnus amp models with the deep parameter set Fractal players expect. Recipes here lean on Cygnus 2.0 amps where available; preset packs are zipped with the routing diagram.",
    models: [
      { name: "Axe-Fx III", note: "Studio-grade, the reference Fractal" },
      { name: "FM3 / FM9", note: "Floor units, scaled-down DSP" },
    ],
    conventions: [
      "Recipes load as .syx files — Axe-Edit III imports, no manual block placement",
      "Block IDs match the recipe order; no need to renumber on import",
      "Cab IRs sourced from the Factory 1 / Factory 2 banks for portability",
    ],
  },
  kemper: {
    photoCaption: "Kemper Profiler — Stage, PowerHead, Rack",
    intro:
      "The Kemper recipe is a Profile + the post stack: stomps in front, the Profile, post EQ and effects. Recipes link to the Rig Manager profile we used and the post chain runs as Kemper FX blocks.",
    models: [
      { name: "Profiler Stage", note: "Floor unit, full I/O" },
      { name: "Profiler PowerHead / Rack", note: "Original head, optional power amp" },
    ],
    conventions: [
      "Recipes link to a public Rig Exchange profile by author + name",
      "Stomps before the Profile use the A / B / C / D slots; effects after use X / MOD / DLY / REV",
      "Cab usually monitored on, IR-driven via the Profile",
    ],
  },
  katana: {
    photoCaption: "Boss Katana family — MkII and Gen 3",
    intro:
      "Katana patches are designed for the unit's eight effect slots and four amp characters. Recipes here translate the original tone into Katana variations and ship as TSL files for Boss Tone Studio.",
    models: [
      { name: "Katana 50 / 100 / 100 212", note: "Combo amps in three sizes" },
      { name: "Katana Head", note: "Head-only for separate cab" },
      { name: "Katana Air / Mini", note: "Practice variants, recipes adapt where models map" },
    ],
    conventions: [
      "Recipes target the closest of Acoustic, Clean, Crunch, Lead, Brown",
      "TSL preset can be loaded slot-by-slot or via Boss Tone Studio",
      "Effect chain uses BOOSTER → MOD → FX → DLY → REV per Boss convention",
    ],
  },
};

export default async function PreviewPlatformDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const platform = getPlatformInfo(slug);
  if (!platform) notFound();

  const recipes = getRecipesForPlatform(slug);
  // Field Notes that talk about this platform — match by label,
  // manufacturer, and the slug itself.
  const platformPosts = findRelatedPosts({
    keywords: [platform.label, platform.manufacturer, slug.replace(/_/g, " ")],
    tags: [slug, platform.label.toLowerCase()],
    categories: ["platform-guide"],
    limit: 3,
  });
  const hue = HUE_BY_PLATFORM[slug] ?? 1;
  const allPlatforms = getAllPlatforms();
  const family = PLATFORM_FAMILY[slug];

  return (
    <div className="container">
      <div className="platform-detail">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <Link href="/preview/platforms">Platforms</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{platform.label}</span>
        </div>

        <header
          className={`platform-head lp-hue-${hue}${
            family?.photoUrl ? "" : " platform-head-solo"
          }`}
        >
          <div>
            <div className="recipe-issue">
              <span className="pill">{platform.manufacturer}</span>
            </div>
            <h1 className="recipe-title display">{platform.label}</h1>
            <p className="platform-tagline">{platform.tagline}</p>
          </div>
          {family?.photoUrl && (
            <figure
              className="platform-photo"
              aria-label={family.photoCaption ?? `${platform.label} family photo`}
            >
              <div className="platform-photo-frame">
                {/* TODO: drop in actual product photography here. */}
                <span className="platform-photo-pending">{platform.label}</span>
              </div>
              {family.photoCaption && (
                <figcaption className="platform-photo-caption">
                  {family.photoCaption}
                </figcaption>
              )}
            </figure>
          )}
        </header>

        {family && (
          <section className="platform-section">
            <div className="how-head">
              <h2 className="display">About the {platform.label} family</h2>
              <span className="section-rule" aria-hidden="true" />
            </div>
            <div className="platform-family-grid">
              <p className="platform-family-intro">{family.intro}</p>
              <div className="platform-family-models">
                <h3 className="platform-family-subhead">Models in this family</h3>
                <ul className="platform-family-list">
                  {family.models.map((m) => (
                    <li key={m.name}>
                      <span className="platform-family-name">{m.name}</span>
                      <span className="platform-family-note">{m.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="platform-family-conventions">
                <h3 className="platform-family-subhead">
                  Patch conventions on Fader &amp; Knob
                </h3>
                <ul className="platform-family-list platform-family-list-conventions">
                  {family.conventions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="platform-section">
          <div className="how-head">
            <h2 className="display">Why {platform.label} players use Fader &amp; Knob</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <ol className="how-steps">
            <li className="how-step">
              <span className="how-step-no" aria-hidden="true">1</span>
              <h3 className="how-step-title">Block names you can search</h3>
              <p className="how-step-body">
                Every recipe lists the exact {platform.label} block names —
                the same strings that show up in the editor or your
                unit&apos;s display. No guessing which model matches what.
              </p>
            </li>
            <li className="how-step">
              <span className="how-step-no" aria-hidden="true">2</span>
              <h3 className="how-step-title">Parameters in your units</h3>
              <p className="how-step-body">
                Settings are translated to your platform&apos;s actual ranges —
                not generic 0–10 marks. dB is dB. Hz is Hz. Time is ms.
              </p>
            </li>
            <li className="how-step">
              <span className="how-step-no" aria-hidden="true">3</span>
              <h3 className="how-step-title">Snapshots &amp; routing included</h3>
              <p className="how-step-body">
                Where the original tone uses snapshot switching, parallel
                routing, or a specific footswitch assignment, we say so. You
                shouldn&apos;t have to reverse-engineer it.
              </p>
            </li>
          </ol>
        </section>

        <section className="platform-section">
          <div className="how-head">
            <h2 className="display">The {platform.label} archive</h2>
            <span className="section-rule" aria-hidden="true" />
            <span className="section-meta">{recipes.length} translations</span>
          </div>
          <div className="audition-grid">
            {recipes.slice(0, 12).map((r) => {
              const rSong = getSongBySlug(r.song_slug);
              const rArtist = rSong
                ? getArtistBySlug(rSong.artist_slug)
                : undefined;
              const rIdx =
                toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
              const rBlocks = recipeToBlocks(r, slug as Platform);
              return (
                <Link
                  key={r.slug}
                  href={`/preview/recipe/${r.slug}?platform=${slug}`}
                  className="audition-card"
                >
                  <div className="audition-art">
                    <LpArt
                      cover={rSong?.album_art_url}
                      monogram={monogramFor(rArtist?.name)}
                      meta={`${rBlocks.length} blocks`}
                      hue={rIdx}
                      alt={`${rSong?.album ?? rSong?.title ?? r.title} cover`}
                    />
                  </div>
                  <div className="audition-meta">
                    <span className="audition-song">
                      {rSong?.title ?? r.title}
                    </span>
                    <span className="audition-artist">
                      <em>{rArtist?.name ?? "Unknown"}</em>
                    </span>
                    {rSong?.album && (
                      <span className="audition-album">
                        {rSong.album}
                        {rSong.year ? ` · ${rSong.year}` : ""}
                      </span>
                    )}
                    <span className="audition-cta">
                      Open patch <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          {recipes.length > 12 && (
            <Link
              href={`/preview/browse?platform=${slug}`}
              className="platform-see-all"
            >
              See all {recipes.length} {platform.label} recipes →
            </Link>
          )}
        </section>

        {/* Field Notes that talk about this platform */}
        <FieldNotesRail
          title={`Field notes for ${platform.label} players`}
          posts={platformPosts}
        />

        {/* Other platforms — quiet jumper rail */}
        <section className="platform-section platform-other">
          <div className="how-head">
            <h2 className="display">Other modelers</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="platform-jumper">
            {allPlatforms
              .filter((p) => p.id !== slug)
              .map((p, i) => {
                const recipesCount = getRecipesForPlatform(p.id).length;
                const otherHue = HUE_BY_PLATFORM[p.id] ?? ((i % 6) + 1);
                return (
                  <Link
                    key={p.id}
                    href={`/preview/platforms/${p.id}`}
                    className={`platform-jumper-item lp-hue-${otherHue}`}
                  >
                    <span className="platform-jumper-stripe" aria-hidden="true" />
                    <span className="platform-jumper-mfr">{p.manufacturer}</span>
                    <span className="platform-jumper-name">{p.label}</span>
                    <span className="platform-jumper-count">
                      {recipesCount} recipes
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
