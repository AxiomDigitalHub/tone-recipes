import { notFound } from "next/navigation";
import Link from "next/link";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { RelatedPosts } from "@/components/RelatedPosts";
import RecipePlatformView from "./RecipePlatformView";
import RecipeCompatibility from "@/components/recipe/RecipeCompatibility";
import RecipeInteractions from "./RecipeInteractions";
import RecipeAudioDemo from "@/components/recipe/RecipeAudioDemo";
import RecipeMicPick from "@/components/recipe/RecipeMicPick";
import RecipeVerification from "@/components/recipe/RecipeVerification";
import SpotifyEmbed from "@/components/ui/SpotifyEmbed";
import { recipeJsonLdSet, recipeMediaJsonLd } from "@/lib/seo/jsonld";
import audioDemos from "@/data/audio-demos.json";
import type { RecipeAudioDemo as RecipeAudioDemoData } from "@/types/recipe";
import type { RatingStats } from "@/types/community";
import type { Metadata } from "next";

/**
 * /recipe/[slug] — audition route for the new editorial / hardware-
 * catalog visual direction.
 *
 * Uses the same real recipe data as production but renders through the new
 * visual system. When the direction locks and migrates, this route retires.
 */

// 1-hour ISR so the AggregateRating in JSON-LD doesn't lag too far
// behind incoming ratings (rest of the page is content-stable).
export const revalidate = 3600;

// Hard-404 unknown slugs. Also keep NO loading.tsx in this segment: an
// early-flushed loading shell commits HTTP 200 before notFound() can set
// the status. Don't re-add loading.tsx.
//
// Nothing in this component may read `searchParams`, `cookies()` or
// `headers()`. Any one of them opts the route into per-request rendering,
// which discards `revalidate` above, moves the getRatingStats() Supabase
// call onto the hot path, and takes TTFB from ~0.1s to 3–5s.
export const dynamicParams = false;

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
    // recipe.title is already artist-led and keyword-rich (e.g. "Buck
    // Dharma's Don't Fear the Reaper Clean Riff Tone"). Appending
    // "- {artist}" AND the "| Fader & Knob" template pushed 17 recipe
    // titles past ~60 chars (truncated in SERPs — flagged in the audit).
    // Use the bare recipe title as the absolute <title> to stay under the
    // limit; the fuller `title` string still feeds OG/Twitter below where
    // length isn't penalized.
    title: { absolute: recipe.title },
    description,
    // The platform switcher uses ?platform=<id> on the same page. Without
    // a canonical, every variant (?platform=helix, ?platform=fractal, …)
    // is crawled as a distinct page with identical title/description/body
    // — the source of the duplicate-title / duplicate-meta / duplicate-
    // content flags in the site audit. Self-canonical to the bare recipe
    // URL consolidates all seven variants into one indexable page.
    alternates: { canonical: `/recipe/${slug}` },
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;

  // Platform selection happens on the CLIENT (<RecipePlatformView/>).
  // Reading `?platform=` here made the route dynamic and threw away the
  // ISR config below it — see the note on that component. The server
  // renders the first available platform (what crawlers index) and ships
  // every platform's blocks so the switch needs no round-trip.
  const validPlatforms = PLATFORMS.filter((p) =>
    p.id === "pedalboard" ? true : Boolean(recipe.platform_translations?.[p.id]),
  );
  const defaultPlatform = validPlatforms[0]?.id ?? "pedalboard";
  const blocksByPlatform = Object.fromEntries(
    validPlatforms.map((p) => [p.id, recipeToBlocks(recipe, p.id)]),
  );

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

  // Aggregate rating stats for AggregateRating in JSON-LD. Read at
  // request time (this page is ISR-revalidated, so it's per-build, not
  // per-request hot path). Failure / no Supabase → undefined → schema
  // simply omits AggregateRating.
  // Full rating stats drive BOTH the JSON-LD AggregateRating and the
  // server-rendered <RecipeInteractions/> display, so the visible stars match
  // the structured data in raw HTML (no SSR/crawler mismatch).
  let ratingStats: RatingStats | undefined;
  try {
    const { getRatingStats } = await import("@/lib/db/ratings");
    const s = await getRatingStats(recipe.slug);
    if (s.count > 0) ratingStats = s;
  } catch {
    // analytics never break SSR
  }
  const stats = ratingStats
    ? { average: ratingStats.average, count: ratingStats.count }
    : undefined;

  // Tone demo: manifest (written by scripts/render-recipe-audio.mjs) wins,
  // falling back to anything hand-set on the recipe object.
  const audioDemo: RecipeAudioDemoData | undefined =
    (audioDemos as Record<string, RecipeAudioDemoData>)[recipe.slug] ??
    recipe.audio_demo;
  const recipeForSchema = audioDemo ? { ...recipe, audio_demo: audioDemo } : recipe;

  const { howTo, musicRecording, breadcrumb } = recipeJsonLdSet(
    recipe,
    song,
    artist,
    stats,
  );
  const mediaNodes = recipeMediaJsonLd(recipeForSchema, song);

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
      {mediaNodes.map((node, i) => (
        <script
          key={`media-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
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

        {/* Platform switcher, export buttons, download chip and the
            interactive chain. All platform-dependent, all client-owned so
            this route stays statically rendered. */}
        <RecipePlatformView
          slug={recipe.slug}
          platforms={validPlatforms}
          blocksByPlatform={blocksByPlatform}
          defaultPlatform={defaultPlatform}
        >
          {/* My Rig compatibility — reads viewer's user_gear (Supabase or
              localStorage) and reports how many signal-chain blocks match.
              Renders nothing while loading; shows a "Set up My Rig" prompt
              when empty. Sits between the chip and the chain, so it's
              passed through as children rather than hoisted out. */}
          <RecipeCompatibility
            signalChain={(recipe.signal_chain ?? []).map((b) => ({
              gear_name: b.gear_name ?? "",
              gear_slug: b.gear_slug ?? null,
              category: b.category ?? "",
            }))}
          />
        </RecipePlatformView>

        {/* What a program actually checked about this recipe — preset build
            result, blocks that don't survive into the file, DSP cost, source
            tier, attribution confidence, and the matching list of what nobody
            checked. Sits directly under the chain because "can I trust these
            numbers?" is the next question after reading them. */}
        <RecipeVerification recipe={recipe} />

        {/* Self-produced tone demo (renders only when a clip exists). The
            audible proof + "Verified" date that backs the settings. */}
        <RecipeAudioDemo demo={audioDemo} />

        {/* Mic affiliate module. Placed after the chain and the demo — the
            reader has seen how the tone is built and heard it, which is the
            moment the one buyable part of the chain is worth surfacing.
            Renders nothing when the chain's mic can't be resolved. */}
        <RecipeMicPick
          signalChain={recipe.signal_chain ?? []}
          recipeSlug={recipe.slug}
        />

        {/* The "Engineer's note" block was removed 2026-08-05. It reprinted
            `recipe.description` verbatim — the same paragraph already rendered
            as `.recipe-summary` at the top of the page, roughly halving the
            unique word count — and then signed it "— {artist.name}", which
            presented an AI-written summary as a quote from a real, frequently
            deceased, guitarist. Neither the duplication nor the fabricated
            attribution was defensible, and the verification band above now
            occupies this slot with something the reader can check. */}

        {/* Sources — primary citations backing the signal-chain claims. */}
        {recipe.sources && recipe.sources.length > 0 && (
          <div
            className="recipe-sources"
            style={{
              marginTop: 32,
              paddingTop: 16,
              borderTop: "1px solid var(--rule, rgba(0,0,0,0.08))",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
                marginBottom: 8,
              }}
            >
              Sources · Verified by
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 16px",
                fontSize: 13,
              }}
            >
              {recipe.sources.map((url) => {
                let label = url;
                try {
                  label = new URL(url).hostname.replace(/^www\./, "");
                } catch {
                  // Not a parseable URL — render the raw string.
                }
                return (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="recipe-source-link"
                    >
                      {label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Ratings + comments — recipe_ratings + comments tables.
            Auth-gated post; anon users see read-only with sign-in CTA. */}
        <RecipeInteractions recipeSlug={recipe.slug} initialStats={ratingStats} />

        {/* Field notes on this tone — precision-first recipe→blog links
            (reverse of RelatedRecipes on /blog/[slug]; renders nothing
            when no post genuinely matches). */}
        <RelatedPosts recipe={recipe} />

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
