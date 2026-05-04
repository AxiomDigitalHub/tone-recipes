import { notFound } from "next/navigation";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import {
  PreviewPedal,
  PreviewAmpBlock,
  PreviewSourceBlock,
  PreviewBlockDetail,
  type PreviewBlockData,
} from "@/components/v3/PreviewBlocks";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import type { Metadata } from "next";
import type { Platform } from "@/types/recipe";

/**
 * /recipe/[slug]/print — print-optimized version of the recipe.
 *
 * One platform per page. Renders the same pedal chain components the
 * site uses (PreviewPedal / PreviewAmpBlock / PreviewSourceBlock /
 * PreviewBlockDetail) so the PDF *is* the website. To save as PDF:
 * open the URL, hit ⌘P / Ctrl+P, set destination to "Save as PDF".
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

/** Print-friendly chain row — same component family as the site's
 *  PreviewSignalChain but on paper bg (no `.on-dark` class) and with
 *  every block expanded inline. */
function PrintChain({ blocks }: { blocks: PreviewBlockData[] }) {
  return (
    <div className="print-chain-row">
      {blocks.map((b, i) => {
        const el = (() => {
          if (b.variant === "source" || b.variant === "cab")
            return <PreviewSourceBlock block={b} />;
          if (b.variant === "amp") return <PreviewAmpBlock block={b} />;
          return <PreviewPedal block={b} />;
        })();
        return (
          <div key={`${b.name}-${i}`} className="print-chain-cell">
            {i > 0 && <div className="print-chain-wire" aria-hidden="true" />}
            <div className="print-chain-block">{el}</div>
          </div>
        );
      })}
    </div>
  );
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
      {/* ── Cover page ─────────────────────────────────────────────── */}
      <section className="print-page print-cover">
        <header className="print-masthead">
          <span>Fader &amp; Knob</span>
          <span>faderandknob.com</span>
        </header>

        <div className="print-cover-body">
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

        <footer className="print-cover-foot">
          <span>The original signal chain</span>
          <span className="print-cover-foot-rule" aria-hidden="true" />
          <span>{recipe.signal_chain.length} blocks</span>
        </footer>

        {/* Original signal chain at the foot of the cover */}
        <div className="print-cover-chain">
          <PrintChain blocks={recipeToBlocks(recipe, "pedalboard")} />
        </div>
      </section>

      {/* ── One page per platform translation ───────────────────────── */}
      {availablePlatforms
        .filter((p) => p !== "pedalboard")
        .map((platform) => {
          const translation = recipe.platform_translations[platform];
          if (!translation) return null;
          const blocks = recipeToBlocks(recipe, platform);

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

              {/* The pedal chain — same component as the site */}
              <div className="print-platform-chain">
                <PrintChain blocks={blocks} />
              </div>

              {/* Block-by-block details */}
              <div className="print-platform-details">
                {blocks
                  .filter((b) => b.variant !== "source")
                  .map((b, i) => (
                    <div key={`${b.name}-${i}`} className="print-block-card">
                      <PreviewBlockDetail block={b} isSelected={false} />
                    </div>
                  ))}
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
