"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  artists as staticArtists,
  songs as staticSongs,
  gearItems as staticGear,
  toneRecipes as staticRecipes,
} from "@/lib/data";

interface Counts {
  artists: number;
  songs: number;
  recipes: number;
  gear: number;
}

const cards: { key: keyof Counts; label: string; href: string; icon: string }[] = [
  { key: "artists", label: "Artists", href: "/admin/artists", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "songs", label: "Songs", href: "/admin/songs", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" },
  { key: "recipes", label: "Recipes", href: "/admin/recipes", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { key: "gear", label: "Gear Items", href: "/admin/gear", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    artists: 0,
    songs: 0,
    recipes: 0,
    gear: 0,
  });

  useEffect(() => {
    // For now, counts come from static data
    setCounts({
      artists: staticArtists.length,
      songs: staticSongs.length,
      recipes: staticRecipes.length,
      gear: staticGear.length,
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted">
          Manage tone recipes, artists, songs, and gear.
        </p>
      </div>

      {/* Status banner */}
      <div className="mb-8 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500" />
        Connect Supabase to enable database. Currently using static data.
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-surface-hover"
          >
            <div className="mb-3 flex items-center justify-between">
              <svg
                className="h-6 w-6 text-muted group-hover:text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
            </div>
            <p className="text-2xl font-bold text-foreground">{counts[card.key]}</p>
            <p className="text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/recipes/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            + New Recipe
          </Link>
          <Link
            href="/admin/recipes"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
          >
            Manage Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
