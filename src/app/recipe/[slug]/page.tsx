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
import SignalChainViewer from "@/components/signal-chain/SignalChainViewer";
import PlatformView from "@/components/signal-chain/PlatformView";
import Badge from "@/components/ui/Badge";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import ReadMore from "@/components/ui/ReadMore";
import RecipeCard from "@/components/recipe/RecipeCard";
import { DIFFICULTY_COLORS } from "@/lib/constants";
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

  return {
    title: `${recipe.title} - ${artist?.name || ""}`,
    description: recipe.description.slice(0, 160),
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
    { id: "signal-chain", label: "Signal Chain", show: true },
    { id: "platforms", label: "Platforms", show: platformCount > 0 },
    { id: "guitar", label: "Guitar", show: true },
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
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* ----------------------------------------------------------------- */}
      {/* Hero area */}
      {/* ----------------------------------------------------------------- */}

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
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

      {/* Title block */}
      <div className="mb-4">
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
      <p className="mb-6 text-sm text-muted">
        {nodeCount} nodes &middot; {platformCount} platform
        {platformCount !== 1 ? "s" : ""} &middot;{" "}
        <span className="capitalize">{difficulty}</span>
        {toneContext && <> &middot; <span className="capitalize">{toneContext}</span></>}
      </p>

      {/* Description */}
      <div className="mb-8 rounded-xl border border-border bg-surface p-6">
        <ReadMore text={recipe.description} lines={3} />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Sticky section nav */}
      {/* ----------------------------------------------------------------- */}
      <nav className="sticky top-16 z-40 -mx-4 mb-8 overflow-x-auto border-b border-border bg-background/90 px-4 backdrop-blur-sm">
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

      {/* Signal Chain */}
      <CollapsibleSection
        id="signal-chain"
        title="Signal Chain"
        defaultOpen={true}
        badge={`${nodeCount} nodes`}
      >
        <div className="rounded-xl border border-border bg-surface">
          <p className="px-6 pt-4 text-xs text-muted">
            Click any node to see settings and tips
          </p>
          <SignalChainViewer
            guitarSpecs={recipe.guitar_specs}
            signalChain={recipe.signal_chain}
          />
        </div>
      </CollapsibleSection>

      {/* Platform Translations */}
      {platformCount > 0 && (
        <CollapsibleSection
          id="platforms"
          title="Platform Translations"
          defaultOpen={true}
          badge={`${platformCount} platform${platformCount !== 1 ? "s" : ""}`}
        >
          <PlatformView
            translations={
              recipe.platform_translations as Partial<
                Record<Platform, (typeof recipe.platform_translations)["helix"]>
              >
            }
          />
        </CollapsibleSection>
      )}

      {/* Guitar & Setup */}
      <CollapsibleSection
        id="guitar"
        title="Guitar &amp; Setup"
        defaultOpen={false}
      >
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted">Model</p>
              <p className="font-medium">{recipe.guitar_specs.model_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Pickups</p>
              <p className="font-medium">
                {recipe.guitar_specs.pickup_config} (
                {recipe.guitar_specs.pickup_position})
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Tuning</p>
              <p className="font-medium">{recipe.guitar_specs.tuning}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Strings</p>
              <p className="font-medium">{recipe.guitar_specs.string_gauge}</p>
            </div>
          </div>
          {recipe.guitar_specs.notable_mods && (
            <p className="mt-4 text-sm text-muted">
              {recipe.guitar_specs.notable_mods}
            </p>
          )}
        </div>
      </CollapsibleSection>

      {/* Original Gear */}
      <CollapsibleSection
        id="gear"
        title="Original Gear (Recording)"
        defaultOpen={false}
      >
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
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
                  className="text-sm text-accent hover:underline"
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
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Related Recipes</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
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
        </section>
      )}
    </div>
  );
}
