"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  toneRecipes as staticRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import type { ToneRecipe, Platform } from "@/types/recipe";

interface RecipeRow {
  slug: string;
  title: string;
  artistName: string;
  songTitle: string;
  platformCount: number;
  isEditorial: boolean;
}

export default function AdminRecipesList() {
  const [rows, setRows] = useState<RecipeRow[]>([]);

  useEffect(() => {
    const mapped: RecipeRow[] = staticRecipes.map((r: ToneRecipe) => {
      const song = getSongBySlug(r.song_slug);
      const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
      return {
        slug: r.slug,
        title: r.title,
        artistName: artist?.name ?? "Unknown",
        songTitle: song?.title ?? "Unknown",
        platformCount: Object.keys(r.platform_translations).length,
        isEditorial: r.is_editorial,
      };
    });
    setRows(mapped);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recipes</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} recipe{rows.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          + Add Recipe
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Artist</th>
              <th className="px-4 py-3">Song</th>
              <th className="px-4 py-3 text-center">Platforms</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.slug}
                className="border-b border-border transition-colors hover:bg-surface-hover"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {row.title}
                </td>
                <td className="px-4 py-3 text-muted">{row.artistName}</td>
                <td className="px-4 py-3 text-muted">{row.songTitle}</td>
                <td className="px-4 py-3 text-center text-muted">
                  {row.platformCount}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.isEditorial ? (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                      Editorial
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-muted">
                      Community
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/recipe/${row.slug}`}
                    className="text-xs text-accent hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted"
                >
                  No recipes yet. Click &quot;Add Recipe&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
