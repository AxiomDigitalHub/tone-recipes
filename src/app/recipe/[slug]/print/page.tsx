import { notFound } from "next/navigation";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import {
  PreviewBlockDetail,
  PreviewHFader,
} from "@/components/v3/PreviewBlocks";
import {
  isFaderBlock,
  isHFaderControl,
  faderValue,
  helixCategory,
  type PreviewBlockData,
} from "@/components/v3/preview-helpers";
import PreviewKnob from "@/components/v3/PreviewKnob";
import { BlockIcon } from "@/components/v3/BlockIcon";
import { PreviewSchematicChain } from "@/components/v3/PreviewSchematicChain";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { getCanonicalParams } from "@/lib/parameters/canonical";
import { lookupParam } from "@/lib/parameters/registry";
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

const PLATFORM_LABELS: Record<string, string> = {
  helix: "Helix",
  quad_cortex: "Quad Cortex",
  tonex: "TONEX",
  fractal: "Fractal",
  kemper: "Kemper",
  katana: "Boss Katana",
  pedalboard: "Pedalboard",
};

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

/**
 * Compact horizontal fader row for volume-pedal-style blocks. The
 * full PreviewBlockDetail renders these as a tall vertical ramp,
 * which eats huge vertical space on the printed page for a control
 * that's typically just at 100%. (Daniel 2026-05-05: "vol pedal can
 * go horizontal to save space.") A single row — name + horizontal
 * bar + percentage — fits in ~32px instead of ~140px.
 */
function PrintFaderRow({ block }: { block: PreviewBlockData }) {
  const value = faderValue(block);
  const control = block.controls[0] ?? "Position";
  return (
    <div className="print-fader-row">
      <div className="print-fader-row-text">
        <span className="print-fader-row-name">{block.name}</span>
        <span className="print-fader-row-kind">{helixCategory(block)}</span>
      </div>
      <div className="print-fader-row-bar" aria-hidden="true">
        <span
          className="print-fader-row-fill"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="print-fader-row-meta">
        <span>{control}</span>
        <span className="print-fader-row-value">{value}%</span>
      </div>
    </div>
  );
}

/** Power-section / tube internals on a Helix amp model. Set once at
 *  factory neutral, rarely touched — separated from the per-recipe
 *  tone controls (Drive / Bass / Mid / Treble / Presence / Volume)
 *  so the spec sheet reads the way a tech would write it. */
const AMP_INTERNAL_PARAMS = new Set([
  "Bias",
  "BiasX",
  "Sag",
  "Hum",
  "Ripple",
  "MasterCut",
]);

/**
 * Print-specific detail card for amp blocks. Same head as
 * PreviewBlockDetail, but the knob grid is split into two labeled
 * groups — "Tone & gain" (front-of-amp tone-stack + volume stage)
 * and "Tube internals" (Bias / BiasX / Sag / Hum / Ripple) — so the
 * editorial logic stays visible. Daniel 2026-05-05: "the amp's 13
 * knobs are mashed into one undifferentiated grid."
 */
function PrintAmpDetail({ block }: { block: PreviewBlockData }) {
  const visible = block.controls.filter(
    (c) => block.values[c] !== undefined,
  );
  const hfaders = visible.filter(isHFaderControl);
  const knobs = visible.filter((c) => !isHFaderControl(c));
  const internals = knobs.filter((c) => AMP_INTERNAL_PARAMS.has(c));
  const tone = knobs.filter((c) => !AMP_INTERNAL_PARAMS.has(c));

  const renderKnob = (c: string) => {
    const range = block.ranges?.[c];
    return (
      <PreviewKnob
        key={c}
        label={c}
        value={block.values[c] ?? 5}
        min={range?.min}
        max={range?.max ?? 10}
        neutral={range?.neutral}
        unit={range?.unit}
        size={52}
        interactive={false}
      />
    );
  };

  const className = [
    "block-detail",
    block.color ? `node-color-${block.color}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div className="block-detail-head">
        <div className="head-icon" aria-hidden="true">
          <BlockIcon block={block} size={22} />
        </div>
        <div className="head-title">
          <div className="name">{block.name}</div>
          {block.sub && <div className="sub">{block.sub}</div>}
        </div>
        <span className="kind">{helixCategory(block)}</span>
      </div>

      {hfaders.length > 0 && (
        <div className="block-hfaders">
          {hfaders.map((c) => {
            const range = block.ranges?.[c];
            return (
              <PreviewHFader
                key={c}
                label={c}
                value={block.values[c] ?? 0}
                min={range?.min ?? 0}
                max={range?.max ?? 100}
                unit={range?.unit}
              />
            );
          })}
        </div>
      )}

      {tone.length > 0 && (
        <div className="print-amp-group">
          <div className="print-amp-group-head">Tone &amp; gain</div>
          <div className="block-settings">{tone.map(renderKnob)}</div>
        </div>
      )}

      {internals.length > 0 && (
        <div className="print-amp-group">
          <div className="print-amp-group-head">Tube internals</div>
          <div className="block-settings">{internals.map(renderKnob)}</div>
        </div>
      )}
    </div>
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
                  {PLATFORM_LABELS[platform]}
                </h2>
                {translation.notes && (
                  <p className="print-page-dek">
                    <em>{translation.notes}</em>
                  </p>
                )}
              </header>

              {/* Block-by-block details — every canonical param is
                  shown, even when the recipe data didn't set it
                  (filled with the registry neutral). Volume-pedal /
                  expression-style blocks render as a single
                  horizontal row instead of the tall vertical fader
                  to save page real estate. */}
              <div className="print-platform-details">
                {blocks
                  .filter((b) => b.variant !== "source")
                  .map((b, i) => {
                    const isFader = isFaderBlock(b);
                    const isAmp = b.variant === "amp";
                    return (
                      <div
                        key={`${b.name}-${i}`}
                        className={`print-block-card${isFader ? " print-block-card-fader" : ""}${isAmp ? " print-block-card-amp" : ""}`}
                      >
                        {isFader ? (
                          <PrintFaderRow block={b} />
                        ) : isAmp ? (
                          <PrintAmpDetail block={b} />
                        ) : (
                          <PreviewBlockDetail block={b} isSelected={false} />
                        )}
                      </div>
                    );
                  })}
              </div>

              <footer className="print-page-foot">
                <span>Fader &amp; Knob · faderandknob.com</span>
                <span className="print-cover-foot-rule" aria-hidden="true" />
                <span>{PLATFORM_LABELS[platform]}</span>
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
