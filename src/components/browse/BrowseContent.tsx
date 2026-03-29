"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { artists, songs, toneRecipes, getAllGenres } from "@/lib/data";
import RecipeCard from "@/components/recipe/RecipeCard";
import { PLATFORMS } from "@/lib/constants";
import { useBrowseStore } from "@/lib/stores/browse-store";
import { usePlatformStore } from "@/lib/stores/platform-store";

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

  const { preferredPlatform } = usePlatformStore();
  const hasAppliedPreference = useRef(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Auto-apply preferred platform filter on first load
  useEffect(() => {
    if (hasAppliedPreference.current) return;
    hasAppliedPreference.current = true;
    if (preferredPlatform && platformFilter === null) {
      setPlatformFilter(preferredPlatform);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (genreFilter) {
      results = results.filter(({ song }) =>
        song?.genres.includes(genreFilter)
      );
    }

    if (platformFilter) {
      results = results.filter(({ recipe }) =>
        Object.keys(recipe.platform_translations).includes(platformFilter)
      );
    }

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

  /* -------------------------------------------------------------- */
  /*  Sidebar filter panel (shared between desktop sidebar + mobile) */
  /* -------------------------------------------------------------- */
  const filterPanel = (
    <div className="flex flex-col gap-6">
      {/* Genre */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Genre
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setGenreFilter(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              genreFilter === null
                ? "bg-accent text-background"
                : "border border-border text-muted hover:border-accent/60 hover:text-accent"
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setGenreFilter(genre)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                genreFilter === genre
                  ? "bg-accent text-background"
                  : "border border-border text-muted hover:border-accent/60 hover:text-accent"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Platform
        </h3>
        <div className="flex flex-col gap-1.5">
          {PLATFORMS.filter((p) => p.id !== "physical").map((platform) => {
            const isActive = platformFilter === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() =>
                  setPlatformFilter(isActive ? null : platform.id)
                }
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left ${
                  isActive
                    ? "bg-surface-hover"
                    : "hover:bg-surface-hover"
                }`}
                style={{
                  color: isActive ? platform.color : undefined,
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: platform.color }}
                />
                {platform.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Sort by
        </h3>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "popular" | "newest" | "artist-az")
          }
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors hover:border-accent/40 focus:border-accent"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Artists */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          By Artist
        </h3>
        <div className="flex flex-col gap-1">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artist/${artist.slug}`}
              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {artist.image_url ? (
                <Image
                  src={artist.image_url}
                  alt={artist.name}
                  width={22}
                  height={22}
                  loading="lazy"
                  className="rounded-full object-cover"
                  sizes="22px"
                />
              ) : (
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
                  {artist.name.charAt(0)}
                </span>
              )}
              {artist.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-accent/60 hover:text-accent"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Find your tone.</h1>
          <p className="mt-1 text-sm text-muted">
            50 iconic sounds, broken down by signal chain and translated for your platform. Filter by genre, artist, or gear.
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Every recipe includes the full signal chain from guitar to speaker, with exact settings for each pedal and amp block. Select your platform to see the right model names and parameter values for your specific rig.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Every recipe includes the complete signal chain, individual pedal and amp settings, and platform-specific translations for Helix, Quad Cortex, TONEX, Fractal, Kemper, and physical rigs. Use the filters to narrow results by genre or the platform you own, or browse by artist to explore a specific player&apos;s catalog.
          </p>
          <p className="mt-1 text-xs text-muted">
            {filteredRecipes.length} of {toneRecipes.length} recipes
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 text-accent hover:underline"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/40 lg:hidden"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-background">
              {(genreFilter ? 1 : 0) + (platformFilter ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="mb-6 rounded-xl border border-border bg-surface p-4 lg:hidden">
          {filterPanel}
        </div>
      )}

      {/* Main layout: sidebar + content */}
      <div className="flex gap-8">
        {/* Left sidebar — desktop only */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide pr-2">
            {filterPanel}
          </div>
        </aside>

        {/* Recipe grid */}
        <div className="flex-1 min-w-0">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRecipes.map(({ recipe, artist, song }) => (
              <RecipeCard
                key={recipe.slug}
                recipe={recipe}
                artist={artist}
                song={song}
              />
            ))}
          </div>

          {/* Empty state */}
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
        </div>
      </div>
    </div>
  );
}
