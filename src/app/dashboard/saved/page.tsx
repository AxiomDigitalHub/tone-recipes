"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RecipeCard from "@/components/recipe/RecipeCard";
import { useFavoritesStore } from "@/lib/stores/favorites-store";
import {
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import type { ToneRecipe, Song, Artist } from "@/types/recipe";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ResolvedRecipe {
  recipe: ToneRecipe;
  song?: Song;
  artist?: Artist;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function DashboardSavedPage() {
  const { getFavorites, hydrate } = useFavoritesStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Recipes</h1>
        <p className="mt-1 text-sm text-muted">Loading...</p>
      </div>
    );
  }

  const slugs = getFavorites();

  const resolved: ResolvedRecipe[] = slugs
    .map((slug) => {
      const recipe = getRecipeBySlug(slug);
      if (!recipe) return null;
      const song = getSongBySlug(recipe.song_slug);
      const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
      return { recipe, song, artist };
    })
    .filter(Boolean) as ResolvedRecipe[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Saved Recipes</h1>
      <p className="mt-1 text-sm text-muted">
        {resolved.length > 0
          ? `${resolved.length} recipe${resolved.length !== 1 ? "s" : ""} saved`
          : "Recipes you save will appear here."}
      </p>

      {resolved.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <svg
            className="mb-6 h-16 w-16 text-border"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            />
          </svg>
          <p className="text-lg font-medium text-muted">
            No saved recipes yet
          </p>
          <p className="mt-2 max-w-md text-sm text-muted">
            Browse recipes and tap the heart icon to save them for quick access
            later.
          </p>
          <Link
            href="/browse"
            className="mt-8 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resolved.map(({ recipe, song, artist }) => (
            <RecipeCard
              key={recipe.slug}
              recipe={recipe}
              artist={artist}
              song={song}
            />
          ))}
        </div>
      )}
    </div>
  );
}
