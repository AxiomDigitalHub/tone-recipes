"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { getSongBySlug, getArtistBySlug } from "@/lib/data";
import type { ToneRecipe } from "@/types/recipe";

/**
 * The dashboard hero. Shows the last recipe the user viewed as a large
 * "Continue where you left off" card, with album art, artist, song title,
 * platform compatibility, and a big Open CTA.
 *
 * If there's no recent recipe, falls back to an editorial "Start here"
 * card pointing to a popular recipe for new users.
 */

interface ContinueHeroProps {
  /** The most recently viewed recipe. Required. */
  recipe: ToneRecipe;
  /** Optional eyebrow override. Defaults to "CONTINUE". */
  eyebrow?: string;
  /** Greeting shown above the title (e.g. "Good evening, Dan") */
  greeting?: string;
}

function gradientFromSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1} 55% 22%), hsl(${hue2} 60% 12%))`;
}

export default function ContinueHero({
  recipe,
  eyebrow = "CONTINUE",
  greeting,
}: ContinueHeroProps) {
  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const albumArt = song?.album_art_url;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1e2840] bg-[#0b0f1a]">
      <div className="flex flex-col gap-0 sm:flex-row">
        {/* Visual anchor: album art or gradient */}
        <div className="relative aspect-square w-full shrink-0 overflow-hidden sm:w-48 md:w-64">
          {albumArt ? (
            <Image
              src={albumArt}
              alt={song?.title ?? recipe.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 256px"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: gradientFromSlug(recipe.slug) }}
            />
          )}
          {/* Soft vignette into the card body */}
          <div className="absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-r from-transparent to-[#0b0f1a] sm:block" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0f1a] to-transparent sm:hidden" />
        </div>

        {/* Text + CTA */}
        <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
          {greeting && (
            <p className="text-sm text-muted">{greeting}</p>
          )}

          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
            {eyebrow}
          </p>

          <div>
            <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
              {song ? song.title : recipe.title}
            </h2>
            {artist && (
              <p className="mt-1 text-sm text-muted">{artist.name}</p>
            )}
          </div>

          {recipe.description && (
            <p className="line-clamp-2 max-w-md text-sm text-muted">
              {recipe.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/recipe/${recipe.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              Open recipe
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent"
            >
              Browse more
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
