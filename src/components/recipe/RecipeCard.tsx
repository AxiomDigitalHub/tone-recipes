"use client";

import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/ui/FavoriteButton";
import VerificationBadge from "@/components/ui/VerificationBadge";
import { getChainIcon } from "@/lib/chain-icons";
import { getVerificationLevel } from "@/lib/verification";
import type { ToneRecipe, Artist, Song } from "@/types/recipe";

interface RecipeCardProps {
  recipe: ToneRecipe;
  artist?: Artist;
  song?: Song;
}

export default function RecipeCard({ recipe, artist, song }: RecipeCardProps) {
  const chainLength = recipe.signal_chain.length;
  const verificationLevel = getVerificationLevel(recipe);

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="card-hover group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-accent/40 hover:bg-surface-hover hover:translate-y-[-2px]"
    >
      {/* Album art header */}
      {song?.album_art_url ? (
        <div className="relative h-40 w-full overflow-hidden bg-primary/30">
          <Image
            src={song.album_art_url}
            alt={`${song.album} album art`}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          {/* Artist name overlay */}
          {artist && (
            <p className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow-lg">
              {artist.name}
            </p>
          )}
        </div>
      ) : (
        <div className="h-3 w-full bg-gradient-to-r from-accent/20 to-accent/5" />
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* Top-right actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {song?.genres?.[0] && (
            <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold capitalize tracking-wider text-white backdrop-blur-sm">
              {song.genres[0].replace(/-/g, " ")}
            </span>
          )}
          <FavoriteButton slug={recipe.slug} size="sm" />
        </div>

        {/* Title: Song + Artist */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
              {song ? song.title : recipe.title}
            </h3>
            <VerificationBadge level={verificationLevel} size="sm" />
          </div>
          {!song?.album_art_url && artist && (
            <p className="text-sm text-muted">{artist.name}</p>
          )}
        </div>

        {/* One-line description */}
        {recipe.description && (
          <p className="text-xs text-muted line-clamp-1 mb-3">
            {recipe.description}
          </p>
        )}

        {/* Mini signal chain preview */}
        <div className="flex items-center gap-1 overflow-hidden">
          {recipe.signal_chain.slice(0, 5).map((node, i) => {
            const NodeIcon = getChainIcon(node.category, node.subcategory);
            return (
            <div key={i} className="flex items-center gap-1">
              <div
                className="node-glow flex h-8 w-8 items-center justify-center rounded-md border border-border transition-all"
                style={{ borderColor: node.icon_color + "60" }}
                title={node.gear_name}
              >
                <NodeIcon
                  className="h-4 w-4"
                  style={{ color: node.icon_color }}
                  strokeWidth={1.5}
                />
              </div>
              {i < Math.min(recipe.signal_chain.length - 1, 4) && (
                <div className="signal-line h-px w-3" />
              )}
            </div>
            );
          })}
          {chainLength > 5 && (
            <span className="text-xs text-muted">+{chainLength - 5}</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:underline">
            Get this tone
            <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
