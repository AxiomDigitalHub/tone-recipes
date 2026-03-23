"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { getChainIcon } from "@/lib/chain-icons";
import type { ToneRecipe, Artist, Song } from "@/types/recipe";
import { DIFFICULTY_COLORS, PLATFORMS } from "@/lib/constants";

interface RecipeCardProps {
  recipe: ToneRecipe;
  artist?: Artist;
  song?: Song;
}

export default function RecipeCard({ recipe, artist, song }: RecipeCardProps) {
  const router = useRouter();
  const chainLength = recipe.signal_chain.length;
  const platformKeys = Object.keys(recipe.platform_translations);

  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="card-hover group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-accent/40 hover:bg-surface-hover"
    >
      {/* Album art header */}
      {song?.album_art_url ? (
        <div className="relative h-40 w-full overflow-hidden bg-primary/30">
          <Image
            src={song.album_art_url}
            alt={`${song.album} album art`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

      <div className="flex flex-1 flex-col p-5">
        {/* Top-right actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {song?.genres?.[0] && (
            <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {song.genres[0]}
            </span>
          )}
          <FavoriteButton slug={recipe.slug} size="sm" />
        </div>

        {/* Header */}
        <div className="mb-3">
          {!song?.album_art_url && artist && (
            <p className="text-xs font-medium text-accent">{artist.name}</p>
          )}
          {song && (
            <p className="text-sm text-muted">
              {song.title} ({song.year})
            </p>
          )}
          <h3 className="mt-1 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {recipe.title}
          </h3>
        </div>

        {/* Mini signal chain preview */}
        <div className="mb-3 flex items-center gap-1 overflow-hidden">
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

        {/* Description snippet */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted">
          {recipe.description}
        </p>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-2">
          {song && (
            <Badge variant="outline">
              <span className={DIFFICULTY_COLORS[song.difficulty]}>
                {song.difficulty}
              </span>
            </Badge>
          )}
          {recipe.tags.slice(0, 2).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}

          {/* Compare link */}
          <span
            role="link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/compare?a=${recipe.slug}`);
            }}
            className="text-xs text-muted transition-colors hover:text-accent cursor-pointer"
          >
            Compare
          </span>

          {/* Platform dots */}
          <div className="ml-auto flex items-center gap-1.5">
            {platformKeys.map((key) => {
              const platform = PLATFORMS.find((p) => p.id === key);
              if (!platform) return null;
              return (
                <span
                  key={key}
                  title={platform.label}
                  className="h-2.5 w-2.5 rounded-full border border-background/50"
                  style={{ backgroundColor: platform.color }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
