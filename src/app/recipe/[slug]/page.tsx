import { notFound } from "next/navigation";
import {
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
  getSongsByArtistSlug,
  getRecipesBySongSlug,
  toneRecipes,
  songs,
} from "@/lib/data";
import UnifiedChainView from "@/components/signal-chain/UnifiedChainView";
import Badge from "@/components/ui/Badge";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import ReadMore from "@/components/ui/ReadMore";
import RecipeCard from "@/components/recipe/RecipeCard";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import type { Platform } from "@/types/recipe";

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

// ---------------------------------------------------------------------------
// Section nav items
// ---------------------------------------------------------------------------

interface NavItem {
  id: string;
  label: string;
  show: boolean;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;

  // Stats
  const nodeCount = recipe.signal_chain.length;
  const platformCount = Object.keys(recipe.platform_translations).length;
  const difficulty = song?.difficulty ?? "intermediate";
  const toneContext = recipe.tone_context
    ? recipe.tone_context.replace("_", " ")
    : null;

  // Section visibility
  const hasLearn =
    song && (song.external_tab_url || song.external_video_url);
  const hasSources = recipe.sources.length > 0;

  const navItems: NavItem[] = [
    { id: "signal-chain", label: `Signal Chain${platformCount > 0 ? ` · ${platformCount + 1}` : ""}`, show: true },
    { id: "gear", label: "Gear", show: true },
    { id: "learn", label: "Learn", show: !!hasLearn },
    { id: "sources", label: "Sources", show: !!hasSources },
  ];

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      {/* ----------------------------------------------------------------- */}
      {/* Hero area */}
      {/* ----------------------------------------------------------------- */}

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/browse" className="hover:text-foreground">
          Browse
        </Link>
        <span>/</span>
        {artist && (
          <>
            <Link
              href={`/artist/${artist.slug}`}
              className="hover:text-foreground"
            >
              {artist.name}
            </Link>
            <span>/</span>
          </>
        )}
        {song && <span className="text-foreground">{song.title}</span>}
      </nav>

      {/* Title block with album art */}
      <div className="mb-4 flex items-start gap-5">
        {song?.album_art_url && (
          <div className="hidden sm:block shrink-0">
            <Image
              src={song.album_art_url}
              alt={`${song.album} album art`}
              width={120}
              height={120}
              priority
              className="rounded-lg border border-border shadow-lg"
              sizes="120px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {artist && (
            <p className="text-sm font-medium text-accent">{artist.name}</p>
          )}
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">{recipe.title}</h1>
          {song && (
            <p className="mt-2 text-muted">
              {song.title} ({song.year}) &middot; {song.album}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/compare?a=${recipe.slug}`}
            className="shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
          >
            Compare
          </Link>
          <FavoriteButton slug={recipe.slug} size="md" />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {song && (
          <Badge variant="outline">
            <span className={DIFFICULTY_COLORS[song.difficulty]}>
              {song.difficulty}
            </span>
          </Badge>
        )}
        {toneContext && <Badge variant="accent">{toneContext}</Badge>}
        {recipe.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
        {recipe.is_editorial && <Badge variant="accent">Editorial</Badge>}
      </div>

      {/* Quick stats */}
      <p className="mb-8 text-sm text-muted">
        {nodeCount} nodes &middot; {platformCount} platform
        {platformCount !== 1 ? "s" : ""} &middot;{" "}
        <span className="capitalize">{difficulty}</span>
        {toneContext && <> &middot; <span className="capitalize">{toneContext}</span></>}
      </p>

      {/* Description */}
      <div className="mb-12 rounded-xl border border-border bg-surface p-6 md:p-8">
        <ReadMore text={recipe.description} lines={3} />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Sticky section nav */}
      {/* ----------------------------------------------------------------- */}
      <nav className="scrollbar-hide sticky top-16 z-40 -mx-4 mb-12 overflow-x-auto border-b border-border bg-background/90 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 py-2">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
        </div>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* Collapsible sections */}
      {/* ----------------------------------------------------------------- */}

      {/* Signal Chain (unified: Physical + all platforms) */}
      <CollapsibleSection
        id="signal-chain"
        title="Signal Chain"
        defaultOpen={true}
        badge={`${platformCount + 1} platforms · ${nodeCount} nodes`}
      >
        <UnifiedChainView
          guitarSpecs={recipe.guitar_specs}
          signalChain={recipe.signal_chain}
          platformTranslations={
            recipe.platform_translations as Partial<
              Record<Platform, (typeof recipe.platform_translations)["helix"]>
            >
          }
          presetName={recipe.title}
        />
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
                {recipe.original_gear.guitar}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Amp</p>
              <p className="text-sm font-medium">{recipe.original_gear.amp}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Effects</p>
              <ul className="text-sm font-medium">
                {recipe.original_gear.effects.map((fx) => (
                  <li key={fx}>{fx}</li>
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
