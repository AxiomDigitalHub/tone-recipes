"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useFavoritesStore } from "@/lib/stores/favorites-store";
import { getRecipeBySlug, getSongBySlug, getArtistBySlug } from "@/lib/data";
import type { ToneRecipe } from "@/types/recipe";
import { LpArt, monogramFor } from "@/components/v3/LpArt";

export default function PreviewDashboardSaved() {
  const { user } = useAuth();
  const hydrate = useFavoritesStore((s) => s.hydrate);
  const favoritesSet = useFavoritesStore((s) => s.favorites);

  useEffect(() => {
    hydrate(user?.id);
  }, [hydrate, user?.id]);

  const recipes = useMemo(
    () =>
      [...favoritesSet]
        .map((slug) => getRecipeBySlug(slug))
        .filter((r): r is ToneRecipe => Boolean(r)),
    [favoritesSet],
  );

  return (
    <div>
      <h1 className="page-title page-title-sm">Saved recipes</h1>
      <p className="dashboard-inner-dek">
        Recipes you&apos;ve saved to revisit later.
      </p>

      {recipes.length === 0 ? (
        <div className="dashboard-empty">
          <p className="display dashboard-empty-title">No saved recipes yet</p>
          <p className="dashboard-empty-hint">
            Tap the heart on any recipe to save it here. Your saves sync across
            devices when you&apos;re signed in.
          </p>
          <Link href="/browse" className="hero-cta hero-cta-primary">
            Browse recipes
          </Link>
        </div>
      ) : (
        <div className="dashboard-grid-wide">
          {recipes.map((r, i) => {
            const song = getSongBySlug(r.song_slug);
            const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
            return (
              <Link
                key={r.slug}
                href={`/recipe/${r.slug}`}
                className="dashboard-card"
              >
                <LpArt
                  cover={song?.album_art_url}
                  monogram={monogramFor(song?.title ?? r.title)}
                  hue={(i % 6) + 1}
                  shape="square"
                />
                <div className="dashboard-card-body">
                  <div className="dashboard-card-title">{song?.title ?? r.title}</div>
                  {artist && (
                    <div className="dashboard-card-artist">
                      <em>{artist.name}</em>
                    </div>
                  )}
                  {r.signal_chain && (
                    <div className="dashboard-card-meta">
                      {r.signal_chain.length} blocks
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
