"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { artists, songs, toneRecipes, getAllGenres } from "@/lib/data";
import RecipeCard from "@/components/recipe/RecipeCard";
import { PLATFORMS } from "@/lib/constants";
import { useBrowseStore } from "@/lib/stores/browse-store";

const SORT_OPTIONS = [
  { value: "popular" as const, label: "Most Popular" },
  { value: "newest" as const, label: "Newest" },
  { value: "artist-az" as const, label: "Artist A-Z" },
];

export default function BrowseContent() {
  const {
    genreFilter,
    platformFilter,
    sortBy,
    setGenreFilter,
    setPlatformFilter,
    setSortBy,
    clearFilters,
  } = useBrowseStore();

  const genres = useMemo(() => getAllGenres(), []);

  const hasActiveFilters = genreFilter !== null || platformFilter !== null;

  const filteredRecipes = useMemo(() => {
    let results = toneRecipes.map((recipe) => {
      const song = songs.find((s) => s.slug === recipe.song_slug);
      const artist = song
        ? artists.find((a) => a.slug === song.artist_slug)
        : undefined;
      return { recipe, song, artist };
    });

    // Filter by genre
    if (genreFilter) {
      results = results.filter(({ song }) =>
        song?.genres.includes(genreFilter)
      );
    }

    // Filter by platform
    if (platformFilter) {
      results = results.filter(({ recipe }) =>
        Object.keys(recipe.platform_translations).includes(platformFilter)
      );
    }

    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.recipe.view_count - a.recipe.view_count;
        case "newest":
          return (b.song?.year ?? 0) - (a.song?.year ?? 0);
        case "artist-az":
          return (a.artist?.name ?? "").localeCompare(b.artist?.name ?? "");
        default:
          return 0;
      }
    });

    return results;
  }, [genreFilter, platformFilter, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Tone Recipes</h1>
          <p className="mt-2 text-muted">
            Find the tone you want. Every recipe includes the full signal chain,
            settings, and platform translations.
          </p>
        </div>

        {/* Sort by dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="sort"
            className="text-sm text-muted whitespace-nowrap"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as "popular" | "newest" | "artist-az"
              )
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors hover:border-accent/40 focus:border-accent"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre filters */}
      <div className="scrollbar-hide mb-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0">
        <button
          onClick={() => setGenreFilter(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            genreFilter === null
              ? "bg-accent text-background"
              : "border border-border text-muted hover:border-accent/60 hover:text-accent hover:bg-accent/10"
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenreFilter(genre)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              genreFilter === genre
                ? "bg-accent text-background"
                : "border border-border text-muted hover:border-accent/60 hover:text-accent hover:bg-accent/10"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Platform filters */}
      <div className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Platform
        </h2>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 md:overflow-x-visible md:pb-0">
          {PLATFORMS.filter((p) => p.id !== "physical").map((platform) => {
            const isActive = platformFilter === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => setPlatformFilter(platform.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-surface-hover ring-2 ring-offset-1 ring-offset-background"
                    : "hover:bg-surface-hover"
                }`}
                style={{
                  borderColor: isActive
                    ? platform.color
                    : platform.color + "40",
                  color: platform.color,
                  boxShadow: isActive
                    ? `0 0 0 2px var(--color-background), 0 0 0 4px ${platform.color}`
                    : undefined,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                {platform.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active filter summary + clear */}
      {hasActiveFilters && (
        <div className="mb-6 flex items-center gap-3">
          <p className="text-sm text-muted">
            Showing {filteredRecipes.length} of {toneRecipes.length} recipes
          </p>
          <button
            onClick={clearFilters}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Artists quick links */}
      <div className="mb-14">
        <h2 className="mb-4 text-lg font-semibold text-muted">By Artist</h2>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artist/${artist.slug}`}
              className="group shrink-0 flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
            >
              {artist.image_url ? (
                <Image
                  src={artist.image_url}
                  alt={artist.name}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  {artist.name.charAt(0)}
                </span>
              )}
              {artist.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Recipe grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map(({ recipe, artist, song }) => (
          <RecipeCard
            key={recipe.slug}
            recipe={recipe}
            artist={artist}
            song={song}
          />
        ))}
      </div>

      {/* Empty state - no filter results */}
      {filteredRecipes.length === 0 && hasActiveFilters && (
        <div className="mt-12 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-lg font-semibold text-muted">
            No recipes match your filters
          </p>
          <p className="mt-2 text-sm text-muted">
            Try adjusting your genre or platform filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Empty state - small catalog */}
      {toneRecipes.length <= 2 && !hasActiveFilters && (
        <div className="mt-12 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-lg font-semibold text-muted">
            More recipes coming soon
          </p>
          <p className="mt-2 text-sm text-muted">
            We are building out the database with 200+ iconic guitar tones
            across every genre.
          </p>
        </div>
      )}
    </div>
  );
}
