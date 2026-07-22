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
          <h1 className="page-title page-title-sm">Recipes</h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {rows.length} recipe{rows.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="rounded-lg border border-[var(--ink)] bg-[var(--amber)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)] hover:text-[var(--paper)]"
        >
          + Add Recipe
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--ink-faint)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--ink-faint)] bg-[var(--paper-2)] text-xs uppercase text-[var(--ink-muted)]">
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
                className="border-b border-[var(--ink-faint)] transition-colors hover:bg-[var(--paper-2)]"
              >
                <td className="px-4 py-3 font-medium text-[var(--ink)]">
                  {row.title}
                </td>
                <td className="px-4 py-3 text-[var(--ink-muted)]">{row.artistName}</td>
                <td className="px-4 py-3 text-[var(--ink-muted)]">{row.songTitle}</td>
                <td className="px-4 py-3 text-center text-[var(--ink-muted)]">
                  {row.platformCount}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.isEditorial ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-[var(--amber-2)]">
                      Editorial
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--paper-2)] px-2 py-0.5 text-xs font-medium text-[var(--ink-muted)]">
                      Community
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/recipe/${row.slug}`}
                    className="text-xs text-[var(--amber-2)] hover:underline"
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
                  className="px-4 py-8 text-center text-[var(--ink-muted)]"
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
