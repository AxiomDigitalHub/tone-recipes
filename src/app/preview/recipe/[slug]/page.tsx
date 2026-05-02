import { notFound } from "next/navigation";
import Link from "next/link";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "../../_components/recipe-to-blocks";
import { PreviewRecipeClient } from "../../_components/PreviewRecipeClient";
import { LpArt, monogramFor } from "../../_components/LpArt";
import type { Metadata } from "next";

/**
 * /preview/recipe/[slug] — audition route for the new editorial / hardware-
 * catalog visual direction.
 *
 * Uses the same real recipe data as production but renders through the new
 * visual system. When the direction locks and migrates, this route retires.
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
      ? `Preview · ${recipe.title} — Fader & Knob`
      : "Preview — Fader & Knob",
    robots: { index: false, follow: false },
  };
}

// Platforms shown in the switcher. Matches production platform list.
const PLATFORMS: Array<{ id: "pedalboard" | "helix" | "quad_cortex" | "tonex" | "fractal" | "kemper" | "katana"; short: string; name: string }> = [
  { id: "helix", short: "Helix", name: "Line 6 Helix" },
  { id: "quad_cortex", short: "QC", name: "Neural DSP Quad Cortex" },
  { id: "tonex", short: "TONEX", name: "IK TONEX" },
  { id: "fractal", short: "Fractal", name: "Fractal Axe-Fx" },
  { id: "kemper", short: "Kemper", name: "Kemper Profiler" },
  { id: "katana", short: "Katana", name: "Boss Katana" },
  { id: "pedalboard", short: "Pedalboard", name: "Pedalboard" },
];

export default async function PreviewRecipePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ platform?: string }>;
}) {
  const { slug } = await params;
  const { platform: platformParam } = await searchParams;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;

  // Platform selection: URL ?platform=helix wins. Otherwise first available.
  const validPlatforms = PLATFORMS.filter((p) =>
    p.id === "pedalboard" ? true : Boolean(recipe.platform_translations?.[p.id]),
  );
  const platform =
    (platformParam &&
      validPlatforms.find((p) => p.id === platformParam)?.id) ||
    validPlatforms[0]?.id ||
    "pedalboard";
  const activePlatform = PLATFORMS.find((p) => p.id === platform);

  const blocks = recipeToBlocks(recipe, platform);

  const recipeIdx =
    toneRecipes.findIndex((r) => r.slug === recipe.slug) + 1;

  // Related recipes — same artist if possible, else same first tag
  const related = toneRecipes
    .filter((r) => r.slug !== recipe.slug)
    .filter((r) => {
      if (song) {
        const rSong = getSongBySlug(r.song_slug);
        if (rSong?.artist_slug === song.artist_slug) return true;
      }
      const firstTag = recipe.tags?.[0];
      return firstTag ? r.tags?.includes(firstTag) : false;
    })
    .slice(0, 3);

  return (
    <div className="container">
      <div className="recipe">
        {/* Breadcrumbs */}
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <Link href="/preview/browse">Archive</Link>
          {artist && (
            <>
              <span className="sep">/</span>
              <Link href={`/preview/artist/${artist.slug}`}>
                {artist.name}
              </Link>
            </>
          )}
          {song && (
            <>
              <span className="sep">/</span>
              <Link href={`/preview/song/${song.slug}`}>
                {song.title}
              </Link>
            </>
          )}
        </div>

        {/* Title / credits / artwork — song · artist · album · year order */}
        <div className="recipe-head">
          <div>
            <div className="recipe-issue">
              <span className="pill">No. {String(recipeIdx).padStart(3, "0")}</span>
              {song?.year && <span>{song.year}</span>}
              {song?.year && <span>·</span>}
              {artist?.genres?.[0] && <span>{artist.genres[0]}</span>}
              {recipe.signal_chain && (
                <>
                  <span>·</span>
                  <span>{recipe.signal_chain.length} blocks</span>
                </>
              )}
            </div>
            <h1 className="recipe-title display">
              {song?.title ?? recipe.title}
            </h1>
            <div className="recipe-credits">
              {artist ? (
                <Link
                  href={`/preview/artist/${artist.slug}`}
                  className="song-artist-link"
                >
                  <em>{artist.name}</em>
                </Link>
              ) : (
                <em>Unknown</em>
              )}
              {song?.album && (
                <>
                  <br />
                  {song ? (
                    <Link
                      href={`/preview/song/${song.slug}`}
                      className="song-artist-link"
                      style={{ marginTop: 6, display: "inline-block" }}
                    >
                      {song.album}
                      {song.year ? ` · ${song.year}` : ""}
                    </Link>
                  ) : (
                    <span style={{ marginTop: 6, display: "inline-block" }}>
                      {song.album}
                      {song.year ? ` · ${song.year}` : ""}
                    </span>
                  )}
                </>
              )}
            </div>
            {recipe.description && (
              <p className="recipe-summary">{recipe.description}</p>
            )}
          </div>
          <div className="recipe-art recipe-art-lp">
            <LpArt
              cover={song?.album_art_url}
              monogram={monogramFor(artist?.name)}
              meta={song?.album ?? `Side A · T.${String(recipeIdx).padStart(2, "0")}`}
              hue={recipeIdx}
              alt={`${song?.album ?? song?.title ?? recipe.title} cover`}
            />
          </div>
        </div>

        {/* Platform switcher */}
        <div className="platform-switcher">
          <span className="label">Settings for</span>
          <div className="tabs">
            {validPlatforms.map((p) => (
              <Link
                key={p.id}
                href={`/preview/recipe/${recipe.slug}?platform=${p.id}`}
                className={`tab ${platform === p.id ? "on" : ""}`}
              >
                {p.short}
              </Link>
            ))}
          </div>
          <button type="button" className="export">
            Export preset ↓
          </button>
        </div>

        {/* Interactive schematic + sticky detail panel. Click a tile,
            the detail swaps in place (no scroll). */}
        <PreviewRecipeClient
          blocks={blocks}
          platformLabel={activePlatform?.name ?? platform}
        />

        {/* Engineer's note — editorial voice block. Uses the recipe description
            as a proxy until we get real per-recipe engineer notes. */}
        {recipe.description && (
          <div className="eng-note">
            <div>
              <h4>Engineer&apos;s note</h4>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-faint)",
                  marginTop: 8,
                }}
              >
                File {String(recipeIdx).padStart(3, "0")}
              </div>
            </div>
            <div className="eng-note-body">
              {recipe.description}
              {artist?.name && (
                <div className="eng-note-sig">— {artist.name}</div>
              )}
            </div>
          </div>
        )}

        {/* Related recipes */}
        {related.length > 0 && (
          <div className="related">
            <div className="related-head">
              <h3 className="display">More like this</h3>
              <span className="related-meta">
                {related.length} of {toneRecipes.length} · curated
              </span>
            </div>
            <div className="feat-grid">
              {related.map((r, i) => {
                const rSong = getSongBySlug(r.song_slug);
                const rArtist = rSong ? getArtistBySlug(rSong.artist_slug) : undefined;
                const rIdx =
                  toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
                const rBlocks = recipeToBlocks(r, "helix");
                return (
                  <div
                    key={r.slug}
                    style={{ gridColumn: "span 4" }}
                  >
                    <Link
                      href={`/preview/recipe/${r.slug}`}
                      className="feat-card"
                      style={{ display: "block" }}
                    >
                      <div className="feat-card-num">
                        No. {String(rIdx).padStart(3, "0")} · Side {(["A","B","C","D"][i % 4])}
                      </div>
                      <div className="feat-card-art-wrap">
                        <LpArt
                          cover={rSong?.album_art_url}
                          monogram={monogramFor(rArtist?.name)}
                          meta={`${rBlocks.length} blocks`}
                          hue={rIdx}
                          shape="banner"
                          alt={`${rSong?.album ?? rSong?.title ?? r.title} cover`}
                        />
                      </div>
                      <div className="feat-card-song">
                        {rSong?.title ?? r.title}
                      </div>
                      <div className="feat-card-artist">
                        <em>{rArtist?.name ?? "Unknown"}</em>
                        {rSong?.year ? ` · ${rSong.year}` : ""}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
