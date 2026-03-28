import { notFound } from "next/navigation";
import {
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
  getSongsByArtistSlug,
  getRecipesBySongSlug,
  toneRecipes,
} from "@/lib/data";
import UnifiedChainView from "@/components/signal-chain/UnifiedChainView";
import Badge from "@/components/ui/Badge";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import ReadMore from "@/components/ui/ReadMore";
import RecipeCard from "@/components/recipe/RecipeCard";
import FavoriteButton from "@/components/ui/FavoriteButton";
import Image from "next/image";
import Link from "next/link";
import type { Platform } from "@/types/recipe";
import AffiliateGearLink from "@/components/ui/AffiliateGearLink";
import AffiliateDisclosure from "@/components/ui/AffiliateDisclosure";
import SpotifyEmbed from "@/components/ui/SpotifyEmbed";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe Not Found" };

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
      ...recipe.tags,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "article",
      ...(song?.album_art_url ? { images: [{ url: song.album_art_url, alt: `${song.album} album art` }] } : {}),
    },
    twitter: {
      card: song?.album_art_url ? "summary_large_image" : "summary",
      title,
      description,
      ...(song?.album_art_url ? { images: [song.album_art_url] } : {}),
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;

  const nodeCount = recipe.signal_chain.length;
  const hasLearn =
    song && (song.external_tab_url || song.external_video_url);
  const hasSources = recipe.sources.length > 0;

  // ---------------------------------------------------------------------------
  // Related recipes
  // ---------------------------------------------------------------------------

  let relatedRecipes: typeof toneRecipes = [];

  if (artist) {
    const artistSongs = getSongsByArtistSlug(artist.slug);
    for (const s of artistSongs) {
      const recipesForSong = getRecipesBySongSlug(s.slug);
      for (const r of recipesForSong) {
        if (r.slug !== recipe.slug) {
          relatedRecipes.push(r);
        }
      }
    }
  }

  // If fewer than 4, fill with other recipes
  if (relatedRecipes.length < 4) {
    const others = toneRecipes.filter(
      (r) => r.slug !== recipe.slug && !relatedRecipes.some((rr) => rr.slug === r.slug)
    );
    // Deterministic "random" — just take from the list
    relatedRecipes = [...relatedRecipes, ...others].slice(0, 4);
  } else {
    relatedRecipes = relatedRecipes.slice(0, 4);
  }

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": recipe.title,
    "description": recipe.description,
    "author": { "@type": "Organization", "name": "ToneRecipes" },
    "step": recipe.signal_chain.map((node, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": node.gear_name,
      "text": `Set ${node.gear_name}: ${Object.entries(node.settings).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
    })),
    "tool": recipe.signal_chain.map((n) => ({ "@type": "HowToTool", "name": n.gear_name })),
  };

  const musicRecordingJsonLd = song
    ? {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        "name": song.title,
        "byArtist": artist
          ? { "@type": "MusicGroup", "name": artist.name }
          : undefined,
        "inAlbum": { "@type": "MusicAlbum", "name": song.album },
        ...(song.album_art_url ? { "image": song.album_art_url } : {}),
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Browse", "item": "https://faderandknob.com/browse" },
      ...(artist
        ? [{ "@type": "ListItem", "position": 2, "name": artist.name, "item": `https://faderandknob.com/artist/${artist.slug}` }]
        : []),
      ...(song
        ? [{ "@type": "ListItem", "position": artist ? 3 : 2, "name": song.title }]
        : []),
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 md:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {musicRecordingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicRecordingJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* ----------------------------------------------------------------- */}
      {/* Compact hero — title + chain immediately visible */}
      {/* ----------------------------------------------------------------- */}

      {/* Breadcrumb */}
      <nav className="mb-2 flex items-center gap-2 text-xs text-muted">
        <Link href="/browse" className="hover:text-foreground">Browse</Link>
        <span>/</span>
        {artist && (
          <>
            <Link href={`/artist/${artist.slug}`} className="hover:text-foreground">{artist.name}</Link>
            <span>/</span>
          </>
        )}
        {song && <span className="text-foreground">{song.title}</span>}
      </nav>

      {/* Title row: album art + title + actions */}
      <div className="mb-3 flex items-center gap-3">
        {song?.album_art_url && !song.spotify_track_id && (
          <Image
            src={song.album_art_url}
            alt={`${song.album} album art`}
            width={48}
            height={48}
            priority
            className="hidden sm:block rounded-md border border-border shadow-sm"
            sizes="48px"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold md:text-2xl leading-tight">{recipe.title}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {artist?.name && <span className="text-accent">{artist.name}</span>}
            {song && <> &middot; {song.title} ({song.year})</>}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/compare?a=${recipe.slug}`}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
          >
            Compare
          </Link>
          <FavoriteButton slug={recipe.slug} size="md" />
        </div>
      </div>

      {/* Spotify Player */}
      {song?.spotify_track_id && (
        <div className="mb-4">
          <SpotifyEmbed trackId={song.spotify_track_id} />
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Signal Chain — THE HERO */}
      {/* ----------------------------------------------------------------- */}
      <section id="signal-chain" className="mb-8">
        <UnifiedChainView
          guitarSpecs={recipe.guitar_specs}
          signalChain={recipe.signal_chain}
          platformTranslations={
            recipe.platform_translations as Partial<
              Record<Platform, (typeof recipe.platform_translations)["helix"]>
            >
          }
          presetName={recipe.title}
          recipeSlug={recipe.slug}
        />
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Details below the chain — collapsible, secondary */}
      {/* ----------------------------------------------------------------- */}

      {/* Description (collapsed by default — the chain tells the story) */}
      <CollapsibleSection
        id="description"
        title="About This Tone"
        defaultOpen={false}
        badge={`${nodeCount} nodes`}
      >
        <div className="rounded-xl border border-border bg-surface p-5 md:p-6">
          <ReadMore text={recipe.description} lines={4} />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Original Gear */}
      <CollapsibleSection
        id="gear"
        title="Original Gear (Recording)"
        defaultOpen={true}
      >
        <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted">Guitar</p>
              <p className="text-sm font-medium">
                <AffiliateGearLink name={recipe.original_gear.guitar} />
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Amp</p>
              <p className="text-sm font-medium">
                <AffiliateGearLink name={recipe.original_gear.amp} />
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Effects</p>
              <ul className="text-sm font-medium">
                {recipe.original_gear.effects.map((fx) => (
                  <li key={fx}>
                    <AffiliateGearLink name={fx} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-muted">Cabinet</p>
              <p className="text-sm font-medium">
                {recipe.original_gear.cabinet}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Microphone</p>
              <p className="text-sm font-medium">
                {recipe.original_gear.microphone}
              </p>
            </div>
          </div>
          {recipe.original_gear.other_notes && (
            <p className="mt-4 text-sm italic text-muted">
              {recipe.original_gear.other_notes}
            </p>
          )}
        </div>
      </CollapsibleSection>

      {/* Learn the Song */}
      {hasLearn && (
        <CollapsibleSection
          id="learn"
          title="Learn the Song"
          defaultOpen={false}
        >
          <div className="flex flex-wrap gap-3">
            {song.external_tab_url && (
              <a
                href={song.external_tab_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium transition-colors hover:border-accent/40"
              >
                View Tab on Songsterr
              </a>
            )}
            {song.external_video_url && (
              <a
                href={song.external_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium transition-colors hover:border-accent/40"
              >
                Find Video Lessons
              </a>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Sources */}
      {hasSources && (
        <CollapsibleSection
          id="sources"
          title="Sources"
          defaultOpen={false}
        >
          <ul className="space-y-1">
            {recipe.sources.map((src) => (
              <li key={src}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline break-all"
                >
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {/* Affiliate Disclosure */}
      <AffiliateDisclosure />

      {/* ----------------------------------------------------------------- */}
      {/* Related Recipes */}
      {/* ----------------------------------------------------------------- */}
      {relatedRecipes.length > 0 && (
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="mb-4 text-xl font-bold">Related Recipes</h2>
          <div className="relative">
            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {relatedRecipes.map((r) => {
                const rSong = getSongBySlug(r.song_slug);
                const rArtist = rSong
                  ? getArtistBySlug(rSong.artist_slug)
                  : undefined;
                return (
                  <div key={r.slug} className="w-72 shrink-0">
                    <RecipeCard recipe={r} artist={rArtist} song={rSong} />
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent" />
          </div>
        </section>
      )}
    </div>
  );
}
