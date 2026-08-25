import { notFound } from "next/navigation";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import {
  helixCategory,
  type PreviewBlockData,
} from "@/components/v3/preview-helpers";
import { BlockIcon } from "@/components/v3/BlockIcon";
import { PreviewSchematicChain } from "@/components/v3/PreviewSchematicChain";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { getCanonicalParams } from "@/lib/parameters/canonical";
import { lookupParam } from "@/lib/parameters/registry";
import { platformLabel } from "@/lib/constants";
import type { Metadata } from "next";
import type { Platform, PlatformTranslation } from "@/types/recipe";

/**
 * /recipe/[slug]/print — print-optimized version of the recipe.
 *
 * Cover page is the love letter to the guitar + pedalboard:
 * GuitarProfile + chain row via the same PreviewSchematicChain the
 * recipe page renders when "Pedalboard" is the active platform. Then
 * one page per platform translation, each rendering the per-block
 * settings via PreviewBlockDetail. To save as PDF: open the URL, hit
 * ⌘P / Ctrl+P, set destination to "Save as PDF".
 *
 * The /api/recipes/[slug]/download endpoint can later be upgraded to
 * drive this route through Puppeteer for email-gated downloads —
 * documented in V4_FOLLOWUPS.
 */

export function generateStaticParams() {
  return toneRecipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  return {
    title: recipe
      ? `${recipe.title} — print`
      : "Print preview — Fader & Knob",
    robots: { index: false, follow: false },
  };
}

// Labels come from the canonical PLATFORMS list — see platformLabel()
// in @/lib/constants.

const PLATFORM_MFR: Record<string, string> = {
  helix: "Line 6",
  quad_cortex: "Neural DSP",
  tonex: "IK Multimedia",
  fractal: "Fractal Audio",
  kemper: "Kemper",
  katana: "Boss",
  pedalboard: "Physical rig",
};

const PLATFORM_ORDER: Platform[] = [
  "pedalboard",
  "helix",
  "quad_cortex",
  "katana",
  "kemper",
  "fractal",
  "tonex",
];

/** Power-section / tube internals on a Helix amp model — kept grouped so
 *  the spec table reads the way a tech would write it (front-of-amp tone
 *  stack first, then the rarely-touched power-section internals). */
const AMP_INTERNAL_PARAMS = new Set([
  "Bias",
  "BiasX",
  "Sag",
  "Hum",
  "Ripple",
  "MasterCut",
]);

/**
 * One settings table per platform — columns Block · Setting · Value, in the
 * site's type/ink/cream system. Replaces the per-block knob-dial cards,
 * which were beautiful but ate ~half a page each. The block name spans its
 * rows; amp blocks keep the "Tone & gain" / "Tube internals" split as
 * labeled sub-rows. This is the original jsPDF table density, styled like
 * the website.
 */
type SpecLine =
  | { kind: "group"; label: string }
  | { kind: "param"; control: string };

function blockLines(block: PreviewBlockData): SpecLine[] {
  const visible = block.controls.filter(
    (c) => block.values[c] !== undefined,
  );
  if (block.variant !== "amp") {
    return visible.map((control) => ({ kind: "param", control }));
  }
  const tone = visible.filter((c) => !AMP_INTERNAL_PARAMS.has(c));
  const internals = visible.filter((c) => AMP_INTERNAL_PARAMS.has(c));
  const lines: SpecLine[] = [];
  if (tone.length) {
    lines.push({ kind: "group", label: "Tone & gain" });
    tone.forEach((control) => lines.push({ kind: "param", control }));
  }
  if (internals.length) {
    lines.push({ kind: "group", label: "Tube internals" });
    internals.forEach((control) => lines.push({ kind: "param", control }));
  }
  return lines;
}

function PlatformSpecTable({ blocks }: { blocks: PreviewBlockData[] }) {
  const rows = blocks.filter((b) => b.variant !== "source");
  return (
    <table className="print-spec">
      <thead>
        <tr>
          <th className="print-spec-h-block">Block</th>
          <th className="print-spec-h-set">Setting</th>
          <th className="print-spec-h-val">Value</th>
        </tr>
      </thead>
      {rows.map((b, bi) => {
        const lines = blockLines(b);
        const span = Math.max(lines.length, 1);
        const blockCell = (
          <th className="print-spec-block" scope="rowgroup" rowSpan={span}>
            <span className="bi" aria-hidden="true">
              <BlockIcon block={b} size={18} />
            </span>
            <span className="bn">{b.name}</span>
            {b.sub && <span className="bs">{b.sub}</span>}
            <span className="bk">{helixCategory(b)}</span>
          </th>
        );
        if (lines.length === 0) {
          return (
            <tbody key={`${b.name}-${bi}`} className="print-spec-group">
              <tr className="print-spec-row print-spec-first">
                {blockCell}
                <td className="print-spec-empty" colSpan={2}>
                  Engaged — no adjustable parameters
                </td>
              </tr>
            </tbody>
          );
        }
        return (
          <tbody key={`${b.name}-${bi}`} className="print-spec-group">
            {lines.map((ln, li) => (
              <tr
                key={li}
                className={`print-spec-row${li === 0 ? " print-spec-first" : ""}`}
              >
                {li === 0 && blockCell}
                {ln.kind === "group" ? (
                  <td className="print-spec-grouplabel" colSpan={2}>
                    {ln.label}
                  </td>
                ) : (
                  <>
                    <td className="print-spec-set">{ln.control}</td>
                    <td className="print-spec-val">
                      {String(b.values[ln.control])}
                      {b.ranges?.[ln.control]?.unit ? (
                        <span className="u"> {b.ranges?.[ln.control]?.unit}</span>
                      ) : null}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        );
      })}
    </table>
  );
}

/**
 * Enrich a platform translation's blocks so every canonical
 * parameter for the (platform, block_category) pair renders — even
 * when the recipe data didn't set one. Missing params get filled with
 * the registry neutral so the printed PDF always shows e.g. LowCut /
 * HighCut / Resonance on a Cab block, even if the recipe predates
 * those fields. (Daniel's note 2026-05-04: "we need to make sure
 * those are all called out, even if they're at OFF or default.")
 */
function enrichTranslation(
  translation: PlatformTranslation,
  platform: Platform,
): PlatformTranslation {
  return {
    ...translation,
    chain_blocks: translation.chain_blocks.map((block) => {
      const canonical = getCanonicalParams(platform, block.block_category);
      if (canonical.length === 0) return block;
      const settings = { ...block.settings };
      for (const name of canonical) {
        if (name in settings) continue;
        const meta = lookupParam(name, block.block_category);
        if (!meta) continue;
        settings[name] = meta.neutral;
      }
      return { ...block, settings };
    }),
  };
}

export default async function RecipePrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;

  const recipeIdx =
    toneRecipes.findIndex((r) => r.slug === recipe.slug) + 1;

  // Which platforms have translations? Render in canonical order.
  const availablePlatforms = PLATFORM_ORDER.filter((p) => {
    if (p === "pedalboard") return (recipe.signal_chain ?? []).length > 0;
    return Boolean(recipe.platform_translations?.[p]);
  });

  return (
    <div className="print-doc">
      {/* ── Cover page — love letter for the guitar + the pedalboard ──
          Top: masthead. Then a compact title/credits/dek block on the
          left with a small square of LP art on the right. The hero is
          the GuitarProfile card + the schematic signal chain — same
          components the recipe page renders when "Pedalboard" is the
          active platform, so the print is a faithful echo of the live
          editorial spread. */}
      <section className="print-page print-cover">
        <header className="print-masthead">
          <span>Fader &amp; Knob</span>
          <span>faderandknob.com</span>
        </header>

        <div className="print-cover-top">
          <div className="print-cover-text">
            <div className="recipe-issue">
              <span className="pill">
                No. {String(recipeIdx).padStart(3, "0")}
              </span>
              {song?.year && <span>·</span>}
              {song?.year && <span>{song.year}</span>}
              {artist?.genres?.[0] && (
                <>
                  <span>·</span>
                  <span>{artist.genres[0]}</span>
                </>
              )}
              {recipe.signal_chain && (
                <>
                  <span>·</span>
                  <span>{recipe.signal_chain.length} blocks</span>
                </>
              )}
            </div>

            <h1 className="recipe-title display print-cover-title">
              {song?.title ?? recipe.title}
            </h1>

            <div className="recipe-credits print-cover-credits">
              {artist && <em>{artist.name}</em>}
              {song?.album && (
                <>
                  <br />
                  <span>
                    {song.album}
                    {song.year ? ` · ${song.year}` : ""}
                  </span>
                </>
              )}
            </div>

            <p className="recipe-summary print-cover-dek">
              {recipe.description}
            </p>
          </div>

          <div className="print-cover-art">
            <LpArt
              cover={song?.album_art_url}
              monogram={monogramFor(song?.title ?? recipe.title)}
              hue={recipeIdx}
              shape="square"
              alt={`${song?.album ?? song?.title ?? recipe.title} cover`}
            />
          </div>
        </div>

        {/* Hero: guitar profile card + signal chain — the same view the
            recipe page renders when "Pedalboard" is the active platform. */}
        <div className="print-cover-hero">
          <div className="print-cover-hero-eyebrow">
            <span>Signal path</span>
            <span aria-hidden="true">·</span>
            <span>Input → output</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.signal_chain.length} blocks</span>
          </div>
          <PreviewSchematicChain
            blocks={recipeToBlocks(recipe, "pedalboard")}
            selectedIndex={null}
            interactive={false}
          />
        </div>
      </section>

      {/* ── One page per platform translation ───────────────────────── */}
      {availablePlatforms
        .filter((p): p is Exclude<Platform, "pedalboard"> => p !== "pedalboard")
        .map((platform) => {
          const translation = recipe.platform_translations[platform];
          if (!translation) return null;
          // Enrich the translation so every canonical parameter for each
          // block's category renders, even at neutral defaults. Then the
          // chain-block detail cards always show the full param set.
          const enriched = enrichTranslation(translation, platform);
          const enrichedRecipe = {
            ...recipe,
            platform_translations: {
              ...recipe.platform_translations,
              [platform]: enriched,
            },
          };
          const blocks = recipeToBlocks(enrichedRecipe, platform);

          return (
            <section
              key={platform}
              className="print-page print-platform-page"
            >
              <header className="print-page-head">
                <div className="print-page-eyebrow">
                  <span>{PLATFORM_MFR[platform]}</span>
                  <span> · </span>
                  <span>Translation</span>
                </div>
                <h2 className="display print-page-title">
                  {platformLabel(platform)}
                </h2>
                {translation.notes && (
                  <p className="print-page-dek">
                    <em>{translation.notes}</em>
                  </p>
                )}
              </header>

              {/* Signal-chain TOC — icon nodes + block names beneath.
                  Sits above the per-block detail cards as a visual
                  table-of-contents so readers see the chain flow
                  before scrolling into the knob breakdown. Different
                  role than the cards (chain shape vs. settings) — not
                  a duplicate. */}
              <div className="print-platform-chain">
                <div className="print-platform-chain-eyebrow">
                  <span>Signal path</span>
                  <span aria-hidden="true">·</span>
                  <span>{platformLabel(platform)} blocks</span>
                </div>
                <PreviewSchematicChain
                  blocks={blocks}
                  selectedIndex={null}
                  interactive={false}
                />
              </div>

              {/* Block-by-block details — every canonical param is
                  shown, even when the recipe data didn't set it
                  (filled with the registry neutral). Volume-pedal /
                  expression-style blocks render as a single
                  horizontal row instead of the tall vertical fader
                  to save page real estate. */}
              <div className="print-platform-details">
                <PlatformSpecTable blocks={blocks} />
              </div>

              <footer className="print-page-foot">
                <span>Fader &amp; Knob · faderandknob.com</span>
                <span className="print-cover-foot-rule" aria-hidden="true" />
                <span>{platformLabel(platform)}</span>
              </footer>
            </section>
          );
        })}

      {/* ── Sources page (if any) ──────────────────────────────────── */}
      {recipe.sources && recipe.sources.length > 0 && (
        <section className="print-page print-sources-page">
          <header className="print-page-head">
            <div className="print-page-eyebrow">
              <span>Verified by</span>
            </div>
            <h2 className="display print-page-title">Sources</h2>
            <p className="print-page-dek">
              <em>
                Primary citations backing this recipe&apos;s signal-chain
                claims.
              </em>
            </p>
          </header>
          <ul className="print-sources-list">
            {recipe.sources.map((url) => {
              let label = url;
              try {
                label = new URL(url).hostname.replace(/^www\./, "");
              } catch {
                /* not a parseable URL; show the raw string */
              }
              return (
                <li key={url} className="print-sources-row">
                  <span className="print-sources-host">{label}</span>
                  <span className="print-sources-url">{url}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
