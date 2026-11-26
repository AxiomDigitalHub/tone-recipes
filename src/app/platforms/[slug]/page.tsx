import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPlatformInfo,
  getAllPlatforms,
  getRecipesForPlatform,
} from "@/lib/data/platforms";
import {
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import type { Platform } from "@/types/recipe";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { monogramFor } from "@/components/v3/LpArt";
import PostsRail from "@/app/_pages/PostsRail";
import { findRelatedPosts } from "@/components/v3/findRelatedPosts";
import { platformJsonLdSet } from "@/lib/seo/jsonld";

export function generateStaticParams() {
  return getAllPlatforms().map((p) => ({ slug: p.id }));
}

// Unknown slugs 404 via notFound() below → the segment's not-found.tsx
// (helpful "request platform support" UI, real 404 status). No
// dynamicParams=false here: the routing-layer 404 it produces skips the
// segment boundary and lands on the root not-found page.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlatformInfo(slug);
  if (!p) {
    return { title: "Preview | Fader & Knob", robots: { index: false, follow: false } };
  }
  const recipeCount = getRecipesForPlatform(slug as Platform).length;
  // Brand comes from the root layout's title template: don't repeat it.
  const title = `${p.label}${p.manufacturer ? ` (${p.manufacturer})` : ""} Tone Recipes`;
  const description = `${recipeCount} tone recipes for the ${p.label}. Full signal chains, exact block settings, and presets ready to import.`;
  return {
    title,
    description,
    alternates: { canonical: `/platforms/${slug}` },
    keywords: [p.label, p.manufacturer, "tone recipe", "patch", "preset", "guitar tone"].filter(
      Boolean,
    ) as string[],
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

/**
 * Per-platform editorial: the model lineup ("the family") plus the
 * Fader & Knob conventions that any patch on this platform follows.
 * Placeholder copy: Daniel will edit before launch. Each platform
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
    /**
     * Numbered steps for getting a recipe preset onto the unit. Drafted
     * for Helix + Katana first; other platforms add as we ship preset
     * formats for them.
     */
    preset_load?: string[];
    /**
     * 2–3 paragraph editorial on how Fader & Knob builds patches for
     * this platform: era-correct gear, real ranges, hardware testing.
     */
    methodology?: string[];
    /**
     * Short gotchas / "things to watch for" bullets. Practical issues
     * that bite players who skip the recipe notes.
     */
    gotchas?: string[];
  }
> = {
  helix: {
    photoCaption: "Line 6 Helix family: Floor, LT, HX Stomp, HX Effects, HX One, POD Go, Helix Stadium",
    intro:
      "The Helix family runs the same HX modeling engine across every form factor. A patch built on a Floor loads on an LT and a Stomp without conversion. Recipes here download as .hlx files; import once and they live in your unit forever.",
    models: [
      { name: "Helix Floor / LT", note: "Full-fat unit, 2 paths, 32 blocks, all the I/O" },
      { name: "Helix Stadium", note: "Next-gen Agoura engine, more headroom for cabs" },
      { name: "HX Stomp / Stomp XL", note: "Pedalboard-friendly, 6 / 8 blocks" },
      { name: "HX Effects", note: "Effects-only, runs the FX from any patch" },
      { name: "HX One", note: "Single-block stompbox, snapshots included" },
      { name: "POD Go", note: "Fixed signal flow, runs the same models" },
    ],
    conventions: [
      "Every patch ends in a Tilt EQ: global brightness adjustment without reaching for an amp's tone stack",
      "Volume Pedal as block 1 so you can ride dynamics from the expression pedal",
      "Multi-drive recipes ship with the alternate drive blocks bypassed; stomp them in for variants",
      "Cab + Mic always uses WithPan when the dual-mic blend is part of the original tone",
    ],
    preset_load: [
      "Download the .hlx file from the recipe's platform switcher (the one labelled HELIX).",
      "Connect your Helix to the computer via USB. The unit doesn't need to be in any special mode.",
      "Open HX Edit (free from Line 6). Your unit shows up in the device picker at the top of the window.",
      "File → Open Preset (or ⌘O / Ctrl+O) and pick the .hlx file. The preset loads into the current edit buffer.",
      "Drag the preset from the edit buffer to a setlist slot (for example, Setlist 1 → 01A). That's the permanent home.",
      "HX Edit auto-syncs the slot to the unit. Confirm by stepping to the slot on the Helix itself; the title should match the recipe.",
    ],
    methodology: [
      "Era-correct models. Every Helix recipe targets the actual amp, cab, and pedals on the original session, mapped to the closest HX models. We don't substitute models that just sound similar. If the song was a Tweed Bassman, we use Tweed Blues / Tweed Brt, not a generic clean.",
      "Real ranges. Amp gain sits in dB-equivalent territory, not on an abstract 0–10 scale. Delay times are real ms values. EQ frequency points are real Hz. Where the model exposes a Bias knob, we set it the way a tech would, not the way a knob graphic suggests.",
      "Built against ground truth. Presets are generated against a structured dataset harvested from 250+ real HX Edit preset files. Every model ID and parameter structure is checked against that corpus so patches load clean. Dual-mic cab balances are documented in the recipe (e.g. 57 + 121 on a 4x12 G12M, 70/30 toward the 57). When a patch loads wrong or reads wrong, the fix ships as a public commit.",
    ],
    gotchas: [
      ".hlx vs. .hlb: recipes ship .hlx (single preset) so importing won't overwrite your other patches. .hlb files are full setlist backups; we never publish those.",
      "Helix Stadium parity. Stadium runs the new Agoura engine; legacy patches load fine but cabs read slightly different. Recipes built for Stadium are flagged in the recipe note.",
      "Snapshot recall mode. If a recipe uses snapshots for clean → drive → solo, set the unit's snapshot recall to Discrete (Global Settings → Footswitches). Recall mode set to Recall will smooth the parameter changes and you'll lose the envelope step between snapshots.",
    ],
  },
  quad_cortex: {
    photoCaption: "Neural DSP Quad Cortex: capture, model, route",
    intro:
      "Quad Cortex blends Neural Capture (deep-learning amp profiles) with traditional modeling and a flexible four-grid routing canvas. Recipes here use the modeling library by default; capture-based variants are flagged where the original tone is best matched by a community capture.",
    models: [
      { name: "Quad Cortex", note: "The full unit, 8 blocks per grid, 4 grids" },
      { name: "Nano Cortex", note: "Capture-focused stompbox, smaller grid" },
    ],
    conventions: [
      "Recipes load as .qcs scenes. Drag onto the Cortex Cloud or sideload via USB",
      "Captures referenced by a public Cortex Cloud handle when relevant",
      "Stereo grids used wherever the original tone is wet/dry/wet, labelled in the recipe notes",
    ],
  },
  tonex: {
    photoCaption: "IK Multimedia TONEX: pedal, software, mobile",
    intro:
      "TONEX is built around AI Tone Models: neural captures of real amps and pedals. Recipes here pair an inventory model with a small modeling chain (compressor, EQ, delay, reverb) so the captured amp does the heavy lifting.",
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
      "Recipes load as .syx files. Axe-Edit III imports, no manual block placement",
      "Block IDs match the recipe order; no need to renumber on import",
      "Cab IRs sourced from the Factory 1 / Factory 2 banks for portability",
    ],
  },
  kemper: {
    photoCaption: "Kemper Profiler: Stage, PowerHead, Rack",
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
    photoCaption: "Boss Katana family: MkII and Gen 3",
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
    preset_load: [
      "Download the .tsl file from the recipe's platform switcher (look for KATANA).",
      "Connect the Katana to the computer via USB and turn the amp on.",
      "Open Boss Tone Studio (free from BOSS). The editor connects to the Katana automatically once the unit is detected.",
      "Click the LIBRARIAN tab. Hit the menu (•••) and pick Import, then choose the .tsl file you just downloaded.",
      "Drag the imported patch from the librarian panel onto a CH (channel) memory slot: CH1 / CH2 / CH3 / CH4 (and the variations on Gen 3 / MkII).",
      "Press WRITE on the amp itself, or Send to Pedal in BTS. The unit stores the patch in that slot.",
    ],
    methodology: [
      "Amp character mapped by gain structure. Each Katana recipe picks the closest of Acoustic, Clean, Crunch, Lead, or Brown: the one that matches the gain shape of the original, not just the genre. AC30-style breakup → Crunch; JCM800 saturation → Brown. The recipe note explains the call so you can change it if your guitar's pickups push the picture differently.",
      "Effects budget aware. Katana gives you eight effect slots across BOOSTER, MOD/FX, and DLY/REV. Recipes are designed to fit. When the original tone really needs a ninth thing, the gotcha note tells you what to swap (typically the BOOSTER, since most recipes don't lean on it heavily).",
      "Translated, then corrected in public. Katana recipes are AI-translated from the recipe's reference chain into the eight-slot format, and fixes ship as public commits when a reader flags one. Worth knowing: Boss applies a different speaker-emulation EQ to the headphone path than the speaker output, so a tone that sits right through a 12\" can read very different on cans, so re-check level and treble when you switch.",
    ],
    gotchas: [
      "Channel slots vs. variations. MkII has four memory channels; Gen 3 has two variations per channel for eight patches total. Recipes ship one .tsl per channel, and moving a Gen 3 .tsl onto MkII drops the second variation.",
      "Booster placement. The BOOSTER slot sits before the amp by default. Recipes that need a clean boost after the amp sim use the FX slot (FX2 → Treble Booster). The recipe note flags this when it matters.",
      "Cabinet resonance. The global Cab Resonance setting changes how the reverb decay reads. Recipes assume Vintage. If the tone reads dryer or thinner than it should, check GLOBAL → Cab Resonance and reset to Vintage.",
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
  if (!platform) notFound(); // dynamicParams=false makes this unreachable; belt-and-suspenders

  const recipes = getRecipesForPlatform(slug);
  // Field Notes that talk about this platform: match by label,
  // manufacturer, and the slug itself.
  const platformPosts = findRelatedPosts({
    keywords: [platform.label, platform.manufacturer, slug.replace(/_/g, " ")],
    tags: [slug, platform.label.toLowerCase()],
    categories: ["platform-guide"],
    limit: 3,
  });
  const allPlatforms = getAllPlatforms();
  const family = PLATFORM_FAMILY[slug];

  const { breadcrumb: platformBreadcrumb } = platformJsonLdSet(platform);

  return (
    <div className="fk-wrap fkp-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformBreadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/platforms">Platforms</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{platform.label}</span>
      </nav>

      <header className={family?.photoUrl ? "fkp-profile" : "fkp-head"}>
        <div className="fkp-profile-text">
          <h1 className="fk-display">{platform.label}</h1>
          <p className="fk-lead fkp-measure">{platform.tagline}</p>
          {platform.manufacturer && (
            <ul className="fkp-tags" aria-label="Manufacturer">
              <li className="fkp-tag">{platform.manufacturer}</li>
            </ul>
          )}
        </div>
        {family?.photoUrl && (
          <figure
            className="fkp-photo"
            aria-label={family.photoCaption ?? `${platform.label} family photo`}
          >
            <div className="fkp-profile-art">
              {/* TODO: drop in actual product photography here. */}
              <span className="fk-t3">{platform.label}</span>
            </div>
            {family.photoCaption && (
              <figcaption className="fk-caption">{family.photoCaption}</figcaption>
            )}
          </figure>
        )}
      </header>

      {family && (
        <section className="fkp-section">
          <h2 className="fk-t2">About the {platform.label} family</h2>
          <div className="fkp-family">
            <p className="fk-body">{family.intro}</p>
            <div className="fk-tile fkp-family-col">
              <h3 className="fk-t3">Models in this family</h3>
              <ul className="fkp-modellist">
                {family.models.map((m) => (
                  <li key={m.name}>
                    <span className="fk-label">{m.name}</span>
                    <span className="fk-body-sm">{m.note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="fk-tile fkp-family-col">
              <h3 className="fk-t3">Patch conventions on Fader &amp; Knob</h3>
              <ul className="fkp-list fk-body-sm">
                {family.conventions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {family?.preset_load && family.preset_load.length > 0 && (
        <section className="fkp-section">
          <h2 className="fk-t2">Loading a {platform.label} recipe</h2>
          <ol className="fkp-steps">
            {family.preset_load.map((step, i) => (
              <li key={i}>
                <span className="fk-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <p className="fk-body">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {family?.methodology && family.methodology.length > 0 && (
        <section className="fkp-section fkp-prose">
          <h2 className="fk-t2">How we build {platform.label} patches</h2>
          {family.methodology.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {family?.gotchas && family.gotchas.length > 0 && (
        <section className="fkp-section">
          <h2 className="fk-t2">Things to watch for</h2>
          <ul className="fkp-list fkp-measure">
            {family.gotchas.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="fkp-section">
        <h2 className="fk-t2">Why {platform.label} players use Fader &amp; Knob</h2>
        <div className="fkp-tiles">
          <div className="fk-tile fkp-linktile">
            <h3 className="fk-t3">Block names you can search</h3>
            <p className="fk-body-sm">
              Every recipe lists the exact {platform.label} block names:
              the same strings that show up in the editor or your
              unit&apos;s display. No guessing which model matches what.
            </p>
          </div>
          <div className="fk-tile fkp-linktile">
            <h3 className="fk-t3">Parameters in your units</h3>
            <p className="fk-body-sm">
              Settings are translated to your platform&apos;s actual ranges,
              not generic 0–10 marks. dB is dB. Hz is Hz. Time is ms.
            </p>
          </div>
          <div className="fk-tile fkp-linktile">
            <h3 className="fk-t3">Snapshots &amp; routing included</h3>
            <p className="fk-body-sm">
              Where the original tone uses snapshot switching, parallel
              routing, or a specific footswitch assignment, we say so. You
              shouldn&apos;t have to reverse-engineer it.
            </p>
          </div>
        </div>
      </section>

      <section className="fkp-section">
        <h2 className="fk-t2">The {platform.label} archive</h2>
        <div className="fk-card-grid">
          {recipes.slice(0, 12).map((r) => {
            const rSong = getSongBySlug(r.song_slug);
            const rArtist = rSong
              ? getArtistBySlug(rSong.artist_slug)
              : undefined;
            const rBlocks = recipeToBlocks(r, slug as Platform);
            return (
              <Link
                key={r.slug}
                href={`/recipe/${r.slug}?platform=${slug}`}
                className="fk-card"
              >
                <div className="fk-card-art">
                  {rSong?.album_art_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rSong.album_art_url}
                      alt={`${rSong?.album ?? rSong?.title ?? r.title} cover`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="fk-t2" aria-hidden="true">
                      {monogramFor(rArtist?.name)}
                    </span>
                  )}
                </div>
                <div className="fk-card-body">
                  <div className="fk-card-head">
                    <h3 className="fk-t3">{rSong?.title ?? r.title}</h3>
                    <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
                  </div>
                  <p className="fk-body-sm">{rArtist?.name ?? "Unknown"}</p>
                  <p className="fk-card-meta">
                    {[rSong?.year, `${rBlocks.length} blocks`].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {recipes.length > 12 && (
          <div>
            <Link href={`/browse?platform=${slug}`} className="fk-btn fk-btn-secondary">
              See all {platform.label} recipes
            </Link>
          </div>
        )}
      </section>

      {/* Field notes that talk about this platform */}
      <PostsRail
        title={`Field notes for ${platform.label} players`}
        posts={platformPosts}
      />

      {/* Set Pack cross-link. Helix only: the pack is a Helix preset,
          and this page is the highest-authority page on the site that a
          player looking for one would already be on. The pack previously
          had a single inbound internal link. */}
      {slug === "helix" && (
        <section className="fkp-section fkp-prose" aria-labelledby="setpack-head">
          <h2 id="setpack-head" className="fk-t2">Playing a whole set?</h2>
          <p>
            Individual recipes get you one song. The{" "}
            <Link href="/set-packs/worship">Worship Set Pack</Link> is the
            other approach: one Helix preset with eight snapshots (clean,
            drive, lead, ambient, swells) that covers an entire setlist
            without swapping patches between songs. Built around an AC30
            with a Klon and a pair of delays, and it works on HX Stomp too.
          </p>
        </section>
      )}

      {/* Other platforms */}
      <section className="fkp-section">
        <h2 className="fk-t2">Other modelers</h2>
        <div className="fkp-tiles fkp-tiles-sm">
          {allPlatforms
            .filter((p) => p.id !== slug)
            .map((p) => {
              const recipesCount = getRecipesForPlatform(p.id).length;
              return (
                <Link key={p.id} href={`/platforms/${p.id}`} className="fk-tile fkp-jumper">
                  <span className="fk-caption">{p.manufacturer}</span>
                  <span className="fk-t3">{p.label}</span>
                  <span className="fk-data fkp-muted">{recipesCount} recipes</span>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
