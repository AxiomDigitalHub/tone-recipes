"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavoritesStore } from "@/lib/stores/favorites-store";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";
import { getRecipeBySlug, getSongBySlug, getArtistBySlug } from "@/lib/data";
import type { ToneRecipe } from "@/types/recipe";
import { LpArt, monogramFor } from "../_components/LpArt";

const STARTER_PICKS = [
  "srv-pride-and-joy-rhythm",
  "gilmour-comfortably-numb-solo",
  "hendrix-voodoo-child-wah",
  "evh-eruption-brown-sound",
  "hetfield-master-of-puppets-rhythm",
  "mayer-slow-dancing-burning-room",
];

function RecipeCard({ recipe, hue }: { recipe: ToneRecipe; hue: number }) {
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  return (
    <Link href={`/preview/recipe/${recipe.slug}`} className="dashboard-card">
      <LpArt
        cover={song?.album_art_url}
        monogram={monogramFor(song?.title ?? recipe.title)}
        hue={hue}
        shape="square"
      />
      <div className="dashboard-card-body">
        <div className="dashboard-card-title">{song?.title ?? recipe.title}</div>
        {artist && <div className="dashboard-card-artist"><em>{artist.name}</em></div>}
      </div>
    </Link>
  );
}

export default function PreviewDashboardOverview() {
  const { user } = useAuth();
  const favoritesHydrate = useFavoritesStore((s) => s.hydrate);
  const recentHydrate = useRecentlyViewedStore((s) => s.hydrate);
  const favoritesSet = useFavoritesStore((s) => s.favorites);
  const recentSlugs = useRecentlyViewedStore((s) => s.slugs);

  useEffect(() => {
    favoritesHydrate(user?.id);
    recentHydrate();
  }, [favoritesHydrate, recentHydrate, user?.id]);

  const savedRecipes = useMemo(
    () =>
      [...favoritesSet]
        .map((slug) => getRecipeBySlug(slug))
        .filter((r): r is ToneRecipe => Boolean(r))
        .slice(0, 6),
    [favoritesSet],
  );

  const recentRecipes = useMemo(
    () =>
      recentSlugs
        .map((slug) => getRecipeBySlug(slug))
        .filter((r): r is ToneRecipe => Boolean(r))
        .slice(0, 6),
    [recentSlugs],
  );

  // Continue hero — most recent, then most saved, then a starter pick
  const heroRecipe = useMemo<ToneRecipe | null>(() => {
    if (recentRecipes[0]) return recentRecipes[0];
    if (savedRecipes[0]) return savedRecipes[0];
    for (const slug of STARTER_PICKS) {
      const r = getRecipeBySlug(slug);
      if (r) return r;
    }
    return null;
  }, [recentRecipes, savedRecipes]);

  const starterRecipes = useMemo(
    () =>
      STARTER_PICKS.map((s) => getRecipeBySlug(s)).filter(
        (r): r is ToneRecipe => Boolean(r),
      ),
    [],
  );

  const heroSong = heroRecipe ? getSongBySlug(heroRecipe.song_slug) : undefined;
  const heroArtist = heroSong ? getArtistBySlug(heroSong.artist_slug) : undefined;

  return (
    <>
      {/* Continue hero — picks up where the user left off */}
      {heroRecipe && (
        <section className="dashboard-hero">
          <div className="dashboard-hero-art">
            <LpArt
              cover={heroSong?.album_art_url}
              monogram={monogramFor(heroSong?.title ?? heroRecipe.title)}
              hue={1}
              shape="square"
            />
          </div>
          <div className="dashboard-hero-body">
            <div className="recipe-issue">
              <span className="pill">
                {recentRecipes[0]
                  ? "Continue where you left off"
                  : savedRecipes[0]
                    ? "From your saves"
                    : "Editor's pick"}
              </span>
              {heroSong?.year && <span>·</span>}
              {heroSong?.year && <span>{heroSong.year}</span>}
            </div>
            <h2 className="display dashboard-hero-title">
              {heroSong?.title ?? heroRecipe.title}
            </h2>
            {heroArtist && (
              <p className="dashboard-hero-artist">
                <em>{heroArtist.name}</em>
                {heroSong?.album && (
                  <>
                    {" — "}
                    <span>{heroSong.album}</span>
                  </>
                )}
              </p>
            )}
            {heroRecipe.description && (
              <p className="dashboard-hero-dek">{heroRecipe.description}</p>
            )}
            <Link
              href={`/preview/recipe/${heroRecipe.slug}`}
              className="hero-cta hero-cta-primary"
            >
              Open recipe
            </Link>
          </div>
        </section>
      )}

      {/* Saved rail */}
      <section className="dashboard-section">
        <header className="dashboard-section-head">
          <h2 className="display">Saved</h2>
          <Link href="/preview/dashboard/saved" className="dashboard-section-all">
            See all →
          </Link>
        </header>
        {savedRecipes.length === 0 ? (
          <div className="dashboard-empty">
            <p>You haven&apos;t saved any recipes yet.</p>
            <p className="dashboard-empty-hint">
              Tap the heart on any recipe to keep it here.
            </p>
          </div>
        ) : (
          <div className="dashboard-rail">
            {savedRecipes.map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} hue={(i % 6) + 1} />
            ))}
          </div>
        )}
      </section>

      {/* Recently viewed rail */}
      {recentRecipes.length > 0 && (
        <section className="dashboard-section">
          <header className="dashboard-section-head">
            <h2 className="display">Recently viewed</h2>
          </header>
          <div className="dashboard-rail">
            {recentRecipes.map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} hue={((i + 2) % 6) + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Starter picks for empty-state users */}
      {savedRecipes.length === 0 && recentRecipes.length === 0 && (
        <section className="dashboard-section">
          <header className="dashboard-section-head">
            <h2 className="display">Start here</h2>
            <Link href="/preview/browse" className="dashboard-section-all">
              Browse all →
            </Link>
          </header>
          <div className="dashboard-rail">
            {starterRecipes.map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} hue={(i % 6) + 1} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
