"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getSongBySlug, getArtistBySlug } from "@/lib/data";
import type { ToneRecipe } from "@/types/recipe";

/**
 * Horizontal rail of recipe cards. Designed for the dashboard home.
 *
 * - Scrollable horizontally with mouse drag, trackpad swipe, or arrow buttons
 * - Partial-visibility edges signal "there's more" without needing a "View all" CTA
 * - Eyebrow label above (small caps, tracked, accent color)
 * - Each card is a compact 200px-wide recipe tile with album art (or gradient fallback)
 */

interface RecipeRailProps {
  /** Small-caps eyebrow label above the rail */
  eyebrow: string;
  /** Larger section title */
  title: string;
  /** Optional subtitle shown below the title */
  subtitle?: string;
  /** Recipes to render */
  recipes: ToneRecipe[];
  /** Optional link for a "View all" action on the right side */
  viewAllHref?: string;
  /** Empty state message when recipes is empty */
  emptyMessage?: string;
}

/** Deterministic 2-color gradient from a recipe slug. Used when no album art. */
function gradientFromSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1} 55% 22%), hsl(${hue2} 60% 12%))`;
}

function RecipeRailCard({ recipe }: { recipe: ToneRecipe }) {
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const albumArt = song?.album_art_url;
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group relative flex w-[200px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#1e2840] bg-[#0b0f1a] transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]"
    >
      {/* Visual anchor: album art with gradient fallback on error */}
      <div className="relative aspect-square w-full overflow-hidden">
        {albumArt && !imgError ? (
          <Image
            src={albumArt}
            alt={song?.title ?? recipe.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="200px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: gradientFromSlug(recipe.slug) }}
          >
            <span className="text-3xl font-bold text-white/30">
              {(artist?.name ?? recipe.title)[0]}
            </span>
          </div>
        )}
        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/20 to-transparent" />
      </div>

      {/* Text body */}
      <div className="flex flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-accent">
          {song ? song.title : recipe.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted">
          {artist?.name ?? " "}
        </p>
      </div>
    </Link>
  );
}

export default function RecipeRail({
  eyebrow,
  title,
  subtitle,
  recipes,
  viewAllHref,
  emptyMessage,
}: RecipeRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (recipes.length === 0 && emptyMessage) {
    return (
      <div>
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        <div className="rounded-xl border border-dashed border-[#1e2840] bg-[#0b0f1a] p-6 text-center">
          <p className="text-sm text-muted">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) return null;

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="mr-2 text-xs font-semibold text-muted hover:text-accent"
            >
              View all
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollBy(-420)}
            aria-label="Scroll rail left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1e2840] bg-[#0b0f1a] text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(420)}
            aria-label="Scroll rail right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1e2840] bg-[#0b0f1a] text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable rail */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {recipes.map((recipe) => (
          <div key={recipe.slug} style={{ scrollSnapAlign: "start" }}>
            <RecipeRailCard recipe={recipe} />
          </div>
        ))}
        {/* Trailing spacer so last card can snap without getting clipped */}
        <div className="w-4 shrink-0" aria-hidden />
      </div>
    </div>
  );
}
