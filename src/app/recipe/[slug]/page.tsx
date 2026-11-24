import { notFound } from "next/navigation";
import Link from "next/link";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { monogramFor } from "@/components/v3/LpArt";
import { RelatedPosts } from "@/components/RelatedPosts";
import { RecipePlatformProvider } from "@/components/recipe/redesign/RecipePlatform";
import RecipeActions from "@/components/recipe/redesign/RecipeActions";
import RecipeChain from "@/components/recipe/redesign/RecipeChain";
import { ChevronRight } from "lucide-react";
import { guitarArt, wiringLink } from "@/lib/gear/guitars";
import { buyInfoFor, type BuyInfo } from "@/lib/gear/retail";
import { formatPickups, formatTuning, guitarModelName } from "@/lib/guitar-specs";
import { getBandName } from "@/lib/song-band";
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
 * /recipe/[slug]: the tone recipe page (redesign step 3).
 *
 * Layout follows the handoff reference (Recipe.html, RecipePedalboard.html):
 * album cover by the title, the guitar card, the signal chain drawn with
 * every knob at the recipe's setting, then every setting broken out as a
 * dial. Data, URLs and structured data are unchanged from before.
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

  // Buy info for the Pedalboard view, resolved on the server: the affiliate
  // tag is a server-side env var. Aligned with blocksByPlatform.pedalboard,
  // which leads with the guitar when the recipe has guitar specs.
  const pedalBuy: (BuyInfo | null)[] = [
    ...(recipe.guitar_specs ? [null] : []),
    ...(recipe.signal_chain ?? []).map((n) => buyInfoFor(n)),
  ];

  const band = song ? getBandName(song, artist) : null;
  const credit = [artist?.name, band, song?.year].filter(Boolean).join(", ");
  const guitar = recipe.guitar_specs;
  const art = guitarArt(recipe.slug, guitar);
  const wiring = wiringLink(art.key);
  const facts: [string, string][] = guitar
    ? ([
        ["Pickups", guitar.pickup_config ? formatPickups(guitar) : ""],
        ["Tuning", guitar.tuning ? formatTuning(guitar) : ""],
        ["Strings", guitar.string_gauge ?? ""],
      ] as [string, string][]).filter(([, v]) => v)
    : [];

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
    <RecipePlatformProvider platforms={validPlatforms} defaultPlatform={defaultPlatform}>
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
      <div className="fk-wrap fk-recipe">
        <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
          <Link href="/browse">Tones</Link>
          {artist && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/artist/${artist.slug}`}>{artist.name}</Link>
            </>
          )}
          {song && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/song/${song.slug}`} aria-current="page">
                {song.title}
              </Link>
            </>
          )}
        </nav>

        {/* Title, summary and buttons on the left. Guitar card on the right. */}
        <div className="fk-recipe-top">
          <div className="fk-recipe-intro">
            <div className="fk-recipe-titlerow">
              <div className="fk-recipe-cover r-md">
                {song?.album_art_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={song.album_art_url}
                    alt={`${song.album ?? song.title} album cover`}
                    width={132}
                    height={132}
                  />
                ) : (
                  <span className="fk-t2" aria-hidden="true">
                    {monogramFor(artist?.name)}
                  </span>
                )}
              </div>
              <div className="fk-recipe-titles">
                <h1 className="fk-display">{song?.title ?? recipe.title}</h1>
                {credit && (
                  <p className="fk-lead">
                    {artist ? (
                      <Link href={`/artist/${artist.slug}`}>{artist.name}</Link>
                    ) : null}
                    {artist && (band || song?.year) ? ", " : ""}
                    {[band, song?.year].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
            {recipe.description && <p className="fk-body fk-recipe-summary">{recipe.description}</p>}
            <RecipeActions
              slug={recipe.slug}
              videoUrl={song?.external_video_url}
              tabUrl={song?.external_tab_url}
            />
            {song?.spotify_track_id && (
              <div className="fk-recipe-spotify">
                <SpotifyEmbed trackId={song.spotify_track_id} size="compact" />
              </div>
            )}
          </div>

          {guitar && (
            <div className="fk-guitarcard r-lg">
              {/* Decorative: the model name is the card's heading. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.src}
                alt={art.alt}
                width={260}
                height={205}
                className="fk-guitarcard-art"
              />
              <div className="fk-guitarcard-facts">
                <h2 className="fk-t3">{guitarModelName(guitar) || "Guitar"}</h2>
                <dl>
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className="fk-body-sm">{k}</dt>
                      <dd className="fk-data">{v}</dd>
                    </div>
                  ))}
                </dl>
                {/* Sister site: how this style of guitar is wired. */}
                {wiring && (
                  <a href={wiring.href} className="fk-link fk-body-sm fk-guitarcard-wiring">
                    How {wiring.label} is wired
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Platform chips, the chain and the per-block cards. All
            platform-dependent, all client-owned so this route stays
            statically rendered. */}
        <RecipeChain slug={recipe.slug} blocksByPlatform={blocksByPlatform} pedalBuy={pedalBuy} />

        {/* What a program actually checked about this recipe: preset build
            result, blocks that don't survive into the file, DSP cost, source
            tier, attribution confidence, and the matching list of what nobody
            checked. Sits directly under the settings because "can I trust
            these numbers?" is the next question after reading them. */}
        <div className="fk-recipe-section fk-recipe-section-md fk-recipe-legacy">
          <RecipeVerification recipe={recipe} />

          {/* Self-produced tone demo (renders only when a clip exists). */}
          <RecipeAudioDemo demo={audioDemo} />

          {/* Mic affiliate module. Renders nothing when the chain's mic
              can't be resolved. */}
          <RecipeMicPick signalChain={recipe.signal_chain ?? []} recipeSlug={recipe.slug} />
        </div>

        {/* The "Engineer's note" block was removed 2026-08-05. It reprinted
            `recipe.description` verbatim and signed it with the artist's
            name, presenting an AI-written summary as a quote. Do not bring
            it back. */}

        {/* Sources: primary citations backing the signal-chain claims. */}
        {recipe.sources && recipe.sources.length > 0 && (
          <section className="fk-recipe-section fk-recipe-section-md fk-sources">
            <h2 className="fk-t3">Sources</h2>
            <ul>
              {recipe.sources.map((url) => {
                let label = url;
                try {
                  label = new URL(url).hostname.replace(/^www\./, "");
                } catch {
                  // Not a parseable URL: render the raw string.
                }
                return (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="fk-link fk-body-sm"
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Ratings + comments: recipe_ratings + comments tables.
            Auth-gated post; anon users see read-only with sign-in CTA. */}
        <div className="fk-recipe-legacy">
          <RecipeInteractions recipeSlug={recipe.slug} initialStats={ratingStats} />

          {/* Guides on this tone: precision-first recipe to blog links
              (renders nothing when no post genuinely matches). */}
          <RelatedPosts recipe={recipe} />
        </div>

        {related.length > 0 && (
          <section className="fk-recipe-section fk-recipe-section-lg">
            <div className="fk-recipe-sectionhead">
              <h2 className="fk-t2">More like this</h2>
              <Link href="/browse" className="fk-link fk-label">
                Browse all recipes
              </Link>
            </div>
            <div className="fk-card-grid">
              {related.map((r) => {
                const rSong = getSongBySlug(r.song_slug);
                const rArtist = rSong ? getArtistBySlug(rSong.artist_slug) : undefined;
                const rBand = rSong ? getBandName(rSong, rArtist) : null;
                const rBlocks = r.signal_chain?.length ?? 0;
                return (
                  <Link key={r.slug} href={`/recipe/${r.slug}`} className="fk-card">
                    <div className="fk-card-art">
                      {rSong?.album_art_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rSong.album_art_url}
                          alt={`${rSong.album ?? rSong.title} album cover`}
                          loading="lazy"
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
                      <p className="fk-body-sm">
                        {[rBand, rArtist?.name].filter(Boolean).join(", ")}
                      </p>
                      <p className="fk-card-meta">
                        {[rSong?.year, rBlocks ? `${rBlocks} blocks` : null].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </RecipePlatformProvider>
  );
}
