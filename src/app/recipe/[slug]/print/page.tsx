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
import { monogramFor } from "@/components/v3/LpArt";
import { Wordmark } from "@/components/brand/Logo";
import ChainStrip from "@/app/_pages/ChainStrip";
import { getCanonicalParams } from "@/lib/parameters/canonical";
import { lookupParam } from "@/lib/parameters/registry";
import { platformLabel } from "@/lib/constants";
import type { Metadata } from "next";
import type { Platform, PlatformTranslation } from "@/types/recipe";

/**
 * /recipe/[slug]/print: print-optimized version of the recipe, and the
 * source of the downloadable settings PDF (the download endpoint renders
 * it with headless Chrome in screen media).
 *
 * Cover page: title, credits, cover art and the pedalboard chain drawn
 * with the redesign's gear drawings. Then one page per platform
 * translation, each a settings table. To save as PDF by hand: open the
 * URL, hit Cmd+P / Ctrl+P, set destination to "Save as PDF".
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
      ? `${recipe.title} (print)`
      : "Print preview | Fader & Knob",
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
 * One settings table per platform, columns Block, Setting, Value. The
 * block name spans its rows; amp blocks keep the "Tone & gain" and
 * "Tube internals" split as labeled sub-rows. Values are data, so they
 * set in mono; everything else is Geist.
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
                  Engaged, no adjustable parameters
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
 * parameter for the (platform, block_category) pair renders, even
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

  // Which platforms have translations? Render in canonical order.
  const availablePlatforms = PLATFORM_ORDER.filter((p) => {
    if (p === "pedalboard") return (recipe.signal_chain ?? []).length > 0;
    return Boolean(recipe.platform_translations?.[p]);
  });

  const meta = [
    song?.year ? String(song.year) : null,
    artist?.genres?.[0] ?? null,
    recipe.signal_chain ? `${recipe.signal_chain.length} blocks` : null,
  ].filter(Boolean);

  return (
    <div className="print-doc">
      {/* Cover page: masthead, title block with the cover art on the
          right, then the pedalboard chain. */}
      <section className="print-page print-cover">
        <header className="print-masthead">
          <Wordmark tone="ink" className="print-masthead-logo" />
          <span>faderandknob.com</span>
        </header>

        <div className="print-cover-top">
          <div className="print-cover-text">
            <h1 className="print-cover-title">
              {song?.title ?? recipe.title}
            </h1>

            <p className="print-cover-credits">
              {artist && <span className="print-cover-artist">{artist.name}</span>}
              {song?.album && (
                <span>
                  {song.album}
                  {song.year ? ` · ${song.year}` : ""}
                </span>
              )}
            </p>

            {meta.length > 0 && (
              <p className="print-cover-meta">{meta.join(" · ")}</p>
            )}

            <p className="print-cover-dek">{recipe.description}</p>
          </div>

          <div className="print-cover-art">
            {song?.album_art_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={song.album_art_url}
                alt={`${song?.album ?? song?.title ?? recipe.title} cover`}
              />
            ) : (
              <span aria-hidden="true">
                {monogramFor(song?.title ?? recipe.title)}
              </span>
            )}
          </div>
        </div>

        <div className="print-cover-hero">
          <div className="print-section-head">
            <h2 className="print-section-title">Signal path</h2>
            <p className="print-section-caption">
              Input → output · {recipe.signal_chain.length} blocks
            </p>
          </div>
          <ChainStrip
            blocks={recipeToBlocks(recipe, "pedalboard")}
            height={118}
            wrap
            label="Signal path, pedalboard"
          />
        </div>
      </section>

      {/* One page per platform translation */}
      {availablePlatforms
        .filter((p): p is Exclude<Platform, "pedalboard"> => p !== "pedalboard")
        .map((platform) => {
          const translation = recipe.platform_translations[platform];
          if (!translation) return null;
          // Enrich the translation so every canonical parameter for each
          // block's category renders, even at neutral defaults.
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
                <h2 className="print-page-title">
                  {platformLabel(platform)}
                </h2>
                <p className="print-page-sub">
                  {PLATFORM_MFR[platform]} · Translation
                </p>
                {translation.notes && (
                  <p className="print-page-dek">{translation.notes}</p>
                )}
              </header>

              {/* The chain first, as a table of contents for the
                  settings below. */}
              <div className="print-platform-chain">
                <p className="print-section-caption">
                  Signal path · {platformLabel(platform)} blocks
                </p>
                <ChainStrip
                  blocks={blocks}
                  height={84}
                  wrap
                  label={`Signal path, ${platformLabel(platform)}`}
                />
              </div>

              {/* Every canonical param is shown, even when the recipe
                  data didn't set it (filled with the registry neutral). */}
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

      {/* Sources page (if any) */}
      {recipe.sources && recipe.sources.length > 0 && (
        <section className="print-page print-sources-page">
          <header className="print-page-head">
            <h2 className="print-page-title">Sources</h2>
            <p className="print-page-dek">
              Primary citations backing this recipe&apos;s signal-chain
              claims.
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
