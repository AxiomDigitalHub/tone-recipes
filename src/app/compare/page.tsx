"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { getChainIcon } from "@/lib/chain-icons";
import {
  toneRecipes,
  songs,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import type { ToneRecipe, Song, Artist, SignalChainNode } from "@/types/recipe";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slugA = searchParams.get("a") || "";
  const slugB = searchParams.get("b") || "";

  const recipeA = slugA ? getRecipeBySlug(slugA) : undefined;
  const recipeB = slugB ? getRecipeBySlug(slugB) : undefined;

  const songA = recipeA ? getSongBySlug(recipeA.song_slug) : undefined;
  const songB = recipeB ? getSongBySlug(recipeB.song_slug) : undefined;

  const artistA = songA ? getArtistBySlug(songA.artist_slug) : undefined;
  const artistB = songB ? getArtistBySlug(songB.artist_slug) : undefined;

  function updateSlug(side: "a" | "b", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(side, value);
    } else {
      params.delete(side);
    }
    router.push(`/compare?${params.toString()}`);
  }

  const bothSelected = recipeA && recipeB;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/browse" className="hover:text-foreground">
          Browse
        </Link>
        <span>/</span>
        <span className="text-foreground">Compare</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold md:text-4xl">Compare Tones</h1>
      <p className="mb-4 text-muted">
        Select two recipes to compare their signal chains, guitar specs, and
        tonal approach side by side.
      </p>
      <p className="mb-10 text-sm text-muted">
        Comparing two recipes highlights differences in tuning, pickup configuration, effects count, and signal chain structure. This is useful when you want to understand what separates a clean Fender-style tone from a high-gain Marshall sound, or see how two artists approach similar genres with different gear choices.
      </p>

      {/* Selectors */}
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <RecipeSelector
          label="Recipe A"
          value={slugA}
          excludeSlug={slugB}
          onChange={(v) => updateSlug("a", v)}
        />
        <RecipeSelector
          label="Recipe B"
          value={slugB}
          excludeSlug={slugA}
          onChange={(v) => updateSlug("b", v)}
        />
      </div>

      {/* Comparison */}
      {bothSelected ? (
        <>
          <div className="grid gap-8 md:grid-cols-2">
            <RecipeColumn recipe={recipeA} song={songA} artist={artistA} />
            <RecipeColumn recipe={recipeB} song={songB} artist={artistB} />
          </div>

          {/* Key Differences */}
          <KeyDifferences
            recipeA={recipeA}
            recipeB={recipeB}
            songA={songA}
            songB={songB}
            artistA={artistA}
            artistB={artistB}
          />
        </>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-lg text-muted">
            {!slugA && !slugB
              ? "Pick two recipes above to start comparing."
              : "Select a second recipe to see the comparison."}
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Recipe Selector                                                           */
/* -------------------------------------------------------------------------- */

function RecipeSelector({
  label,
  value,
  excludeSlug,
  onChange,
}: {
  label: string;
  value: string;
  excludeSlug: string;
  onChange: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = toneRecipes
    .filter((r) => r.slug !== excludeSlug)
    .map((r) => {
      const song = getSongBySlug(r.song_slug);
      const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
      return {
        slug: r.slug,
        label: `${artist?.name || ""} - ${r.title}`,
        sub: song ? `${song.title} (${song.year})` : "",
        searchText: `${artist?.name || ""} ${r.title} ${song?.title || ""}`.toLowerCase(),
      };
    });

  const filtered = query
    ? options.filter((o) => o.searchText.includes(query.toLowerCase()))
    : options;

  const selectedOption = options.find((o) => o.slug === value);

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-xs font-medium text-muted">
        {label}
      </label>
      <input
        type="text"
        placeholder={selectedOption ? selectedOption.label : "Type to search recipes..."}
        value={open ? query : (selectedOption?.label || "")}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-colors focus:border-accent/60 focus:outline-none"
      />
      {open && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-surface shadow-xl">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No recipes match</p>
          ) : (
            filtered.map((o) => (
              <button
                key={o.slug}
                onClick={() => {
                  onChange(o.slug);
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex w-full flex-col px-4 py-2.5 text-left transition-colors hover:bg-surface-hover ${
                  o.slug === value ? "bg-accent/10" : ""
                }`}
              >
                <span className="text-sm font-medium text-foreground">{o.label}</span>
                <span className="text-xs text-muted">{o.sub}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Recipe Column                                                             */
/* -------------------------------------------------------------------------- */

function RecipeColumn({
  recipe,
  song,
  artist,
}: {
  recipe: ToneRecipe;
  song?: Song;
  artist?: Artist;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        {song?.album_art_url && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
            <Image
              src={song.album_art_url}
              alt={`${song.album} album art`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div>
          {artist && (
            <p className="text-xs font-medium text-accent">{artist.name}</p>
          )}
          <h2 className="mt-1 text-xl font-bold text-foreground">
            <Link
              href={`/recipe/${recipe.slug}`}
              className="hover:text-accent transition-colors"
            >
              {recipe.title}
            </Link>
          </h2>
          {song && (
            <p className="mt-1 text-sm text-muted">
              {song.title} ({song.year}) &middot; {song.album}
            </p>
          )}
        </div>
      </div>

      {/* Mini chain preview */}
      <div className="mt-4 flex items-center gap-1 overflow-hidden">
        {recipe.signal_chain.map((node, i) => {
          const NodeIcon = getChainIcon(node.category, node.subcategory);
          return (
            <div key={i} className="flex items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border"
                style={{ borderColor: node.icon_color + "60" }}
                title={node.gear_name}
              >
                <NodeIcon
                  className="h-4 w-4"
                  style={{ color: node.icon_color }}
                  strokeWidth={1.5}
                />
              </div>
              {i < recipe.signal_chain.length - 1 && (
                <div className="h-px w-3 bg-border" />
              )}
            </div>
          );
        })}
      </div>

      {/* Guitar Specs */}
      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Guitar
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <SpecItem label="Model" value={recipe.guitar_specs.model_name} />
          <SpecItem
            label="Pickups"
            value={`${recipe.guitar_specs.pickup_config} (${recipe.guitar_specs.pickup_position})`}
          />
          <SpecItem label="Tuning" value={recipe.guitar_specs.tuning} />
          <SpecItem label="Strings" value={recipe.guitar_specs.string_gauge} />
        </div>
        {recipe.guitar_specs.notable_mods && (
          <p className="mt-2 text-xs text-muted">
            {recipe.guitar_specs.notable_mods}
          </p>
        )}
      </div>

      {/* Signal Chain */}
      <div className="mt-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Signal Chain
        </h3>
        <div className="flex flex-col gap-3">
          {recipe.signal_chain.map((node) => (
            <ChainNodeCard key={node.position} node={node} />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {recipe.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small helper components                                                   */
/* -------------------------------------------------------------------------- */

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function ChainNodeCard({ node }: { node: SignalChainNode }) {
  const settingEntries = Object.entries(node.settings);
  const Icon = getChainIcon(node.category, node.subcategory);

  return (
    <div
      className="rounded-lg border border-border bg-background/50 p-3"
      style={{ borderLeftWidth: 3, borderLeftColor: node.icon_color }}
    >
      <div className="flex items-start gap-2.5">
        <Icon
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: node.icon_color }}
          strokeWidth={1.5}
        />
        <div>
          <p className="text-sm font-semibold text-foreground">
            {node.gear_name}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted">
            {node.category}
            {node.subcategory ? ` / ${node.subcategory}` : ""}
            {node.is_in_effects_loop ? " (FX Loop)" : ""}
          </p>
        </div>
      </div>
      {settingEntries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {settingEntries.map(([key, val]) => (
            <Badge key={key} variant="outline">
              {key}: {String(val)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Key Differences                                                           */
/* -------------------------------------------------------------------------- */

function KeyDifferences({
  recipeA,
  recipeB,
  songA,
  songB,
  artistA,
  artistB,
}: {
  recipeA: ToneRecipe;
  recipeB: ToneRecipe;
  songA?: Song;
  songB?: Song;
  artistA?: Artist;
  artistB?: Artist;
}) {
  const diffs: string[] = [];

  // Tuning
  if (recipeA.guitar_specs.tuning !== recipeB.guitar_specs.tuning) {
    diffs.push(
      `Different tuning: ${recipeA.guitar_specs.tuning} vs ${recipeB.guitar_specs.tuning}`
    );
  }

  // String gauge
  if (recipeA.guitar_specs.string_gauge !== recipeB.guitar_specs.string_gauge) {
    diffs.push(
      `Different string gauge: ${recipeA.guitar_specs.string_gauge} vs ${recipeB.guitar_specs.string_gauge}`
    );
  }

  // Pickup config
  if (
    recipeA.guitar_specs.pickup_config !== recipeB.guitar_specs.pickup_config
  ) {
    diffs.push(
      `Different pickup configuration: ${recipeA.guitar_specs.pickup_config} vs ${recipeB.guitar_specs.pickup_config}`
    );
  }

  // Pickup position
  if (
    recipeA.guitar_specs.pickup_position !==
    recipeB.guitar_specs.pickup_position
  ) {
    diffs.push(
      `Different pickup position: ${recipeA.guitar_specs.pickup_position} vs ${recipeB.guitar_specs.pickup_position}`
    );
  }

  // Number of effects
  const effectsA = recipeA.signal_chain.filter(
    (n) => n.category === "effect" || n.category === "wet_effect"
  );
  const effectsB = recipeB.signal_chain.filter(
    (n) => n.category === "effect" || n.category === "wet_effect"
  );
  if (effectsA.length !== effectsB.length) {
    diffs.push(
      `Different number of effects: ${effectsA.length} vs ${effectsB.length}`
    );
  }

  // Chain length
  if (recipeA.signal_chain.length !== recipeB.signal_chain.length) {
    diffs.push(
      `Signal chain length: ${recipeA.signal_chain.length} nodes vs ${recipeB.signal_chain.length} nodes`
    );
  }

  // Wet effects
  const hasWetA = recipeA.signal_chain.some(
    (n) => n.category === "wet_effect"
  );
  const hasWetB = recipeB.signal_chain.some(
    (n) => n.category === "wet_effect"
  );
  if (hasWetA !== hasWetB) {
    const nameA = artistA?.name || recipeA.title;
    const nameB = artistB?.name || recipeB.title;
    diffs.push(
      hasWetA
        ? `${nameA} uses wet effects (delay/reverb); ${nameB} does not`
        : `${nameB} uses wet effects (delay/reverb); ${nameA} does not`
    );
  }

  // Era / year
  if (songA && songB && Math.abs(songA.year - songB.year) >= 5) {
    diffs.push(
      `Different eras: ${songA.year} vs ${songB.year} (${Math.abs(songA.year - songB.year)} years apart)`
    );
  }

  // Difficulty
  if (songA && songB && songA.difficulty !== songB.difficulty) {
    diffs.push(
      `Different difficulty: ${songA.difficulty} vs ${songB.difficulty}`
    );
  }

  if (diffs.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-6 text-xl font-bold">Key Differences</h2>
      <div className="rounded-xl border border-border bg-surface p-6">
        <ul className="space-y-2">
          {diffs.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page export with Suspense boundary                                        */
/* -------------------------------------------------------------------------- */

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Compare Tones
          </h1>
          <p className="text-muted">Loading comparison...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
