import { notFound } from "next/navigation";
import Link from "next/link";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { PreviewRecipeClient } from "@/components/v3/PreviewRecipeClient";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { FieldNotesRail } from "@/components/v3/FieldNotesRail";
import { findRelatedPosts } from "@/components/v3/findRelatedPosts";
import RecipePdfButton from "@/components/v3/RecipePdfButton";
import RecipeDownloadChip from "@/components/v3/RecipeDownloadChip";
import SpotifyEmbed from "@/components/ui/SpotifyEmbed";
import { recipeJsonLdSet } from "@/lib/seo/jsonld";
import type { Metadata } from "next";

/**
 * /recipe/[slug] — audition route for the new editorial / hardware-
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
  if (!recipe) {
    return { title: "Preview — Fader & Knob", robots: { index: false, follow: false } };
  }
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const title = `${recipe.title} - ${artist?.name || ""}`;
  const description = recipe.description.slice(0, 160);
  return {
    title,
    description,
    keywords: [
      artist?.name,
      song?.title,
      "tone recipe",
      "signal chain",
      "guitar tone",
      ...(recipe.tags ?? []),
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      type: "article",
      ...(song?.album_art_url
        ? { images: [{ url: song.album_art_url, alt: `${song.album} album art` }] }
        : {}),
    },
    twitter: {
      card: song?.album_art_url ? "summary_large_image" : "summary",
      title,
      description,
      ...(song?.album_art_url ? { images: [song.album_art_url] } : {}),
    },
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

  // Related Field Notes — match against the recipe's tags + the gear
  // names in its signal chain + the artist + the song title. Posts get
  // ranked, top 3 shown.
  const gearKeywords = (recipe.signal_chain ?? [])
    .map((b) => b.gear_name)
    .filter((s): s is string => Boolean(s))
    .slice(0, 8);
  const relatedPosts = findRelatedPosts({
    keywords: [
      ...(artist?.name ? [artist.name] : []),
      ...(song?.title ? [song.title] : []),
      ...gearKeywords,
    ],
    tags: recipe.tags ?? [],
    limit: 3,
  });

  const { howTo, musicRecording, breadcrumb } = recipeJsonLdSet(recipe, song, artist);

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      {musicRecording && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicRecording) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="recipe">
        {/* Breadcrumbs */}
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/browse">Archive</Link>
          {artist && (
            <>
              <span className="sep">/</span>
              <Link href={`/artist/${artist.slug}`}>
                {artist.name}
              </Link>
            </>
          )}
          {song && (
            <>
              <span className="sep">/</span>
              <Link href={`/song/${song.slug}`}>
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
                  href={`/artist/${artist.slug}`}
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
                  <Link
                    href={`/song/${song.slug}`}
                    className="song-artist-link"
                    style={{ marginTop: 6, display: "inline-block" }}
                  >
                    {song.album}
                    {song.year ? ` · ${song.year}` : ""}
                  </Link>
                </>
              )}
            </div>
            {recipe.description && (
              <p className="recipe-summary">{recipe.description}</p>
            )}
            {(song?.external_video_url || song?.external_tab_url) && (
              <div className="recipe-listen-row">
                {song?.external_video_url && (
                  <a
                    href={song.external_video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="song-listen-cta"
                  >
                    Listen on YouTube <span aria-hidden="true">↗</span>
                  </a>
                )}
                {song?.external_tab_url && (
                  <a
                    href={song.external_tab_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="song-listen-cta song-listen-cta-secondary"
                  >
                    Tab on Songsterr <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
            {song?.spotify_track_id && (
              <div className="recipe-spotify">
                <SpotifyEmbed
                  trackId={song.spotify_track_id}
                  size="compact"
                />
              </div>
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
        <div id="recipe-platform-switcher" className="platform-switcher">
          <span className="label">Settings for</span>
          <div className="tabs">
            {validPlatforms.map((p) => (
              <Link
                key={p.id}
                href={`/recipe/${recipe.slug}?platform=${p.id}`}
                className={`tab ${platform === p.id ? "on" : ""}`}
              >
                {p.short}
              </Link>
            ))}
          </div>
          <div className="platform-switcher-exports">
            {platform === "helix" && (
              <a
                href={`/presets/${recipe.slug}.hlx`}
                download
                className="export"
              >
                Download .hlx ↓
              </a>
            )}
            {platform === "katana" && (
              <a
                href={`/presets/${recipe.slug}.tsl`}
                download
                className="export"
              >
                Download .tsl ↓
              </a>
            )}
            {platform !== "helix" && platform !== "katana" && (
              <span className="export export-disabled" aria-disabled="true">
                Preset coming soon
              </span>
            )}
            <RecipePdfButton slug={recipe.slug} />
          </div>
        </div>
        <RecipeDownloadChip slug={recipe.slug} platform={platform} />

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

        {/* Related Field Notes — pulls from the blog when there's a
            keyword/tag overlap (gear, artist, song). */}
        <FieldNotesRail
          title="Field notes for this tone"
          posts={relatedPosts}
        />

        {/* Related recipes */}
        {related.length > 0 && (
          <div className="related">
            <div className="related-head">
              <h3 className="display">More like this</h3>
              <span className="related-meta">Curated</span>
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
                      href={`/recipe/${r.slug}`}
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

        {/* Catch-all browse affordance — without this, the only path
            back to the catalogue is the global sub-nav. */}
        <div className="recipe-foot-browse">
          <Link href="/browse" className="recipe-foot-browse-link">
            Browse all recipes →
          </Link>
        </div>
      </div>
    </div>
  );
}
