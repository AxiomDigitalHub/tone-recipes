import Link from "next/link";
import type { Metadata } from "next";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { PreviewSchematicChain } from "@/components/v3/PreviewSchematicChain";
import type { Platform } from "@/types/recipe";

export const metadata: Metadata = {
  title: "Compare tone recipes side-by-side — Fader & Knob",
  description:
    "Pick any two recipes from the archive and view their signal chains side-by-side. Switch the platform to see how each chain ports across modelers.",
  openGraph: {
    title: "Compare tone recipes — Fader & Knob",
    description: "Two signal chains, side-by-side, on every modeler.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "helix", label: "Helix" },
  { id: "quad_cortex", label: "Quad Cortex" },
  { id: "tonex", label: "TONEX" },
  { id: "fractal", label: "Fractal" },
  { id: "kemper", label: "Kemper" },
  { id: "katana", label: "Katana" },
  { id: "pedalboard", label: "Pedalboard" },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; platform?: string }>;
}) {
  const sp = await searchParams;
  const aSlug = sp.a;
  const bSlug = sp.b;
  const platform: Platform = (PLATFORMS.find((p) => p.id === sp.platform)?.id) ?? "helix";

  const a = aSlug ? getRecipeBySlug(aSlug) : undefined;
  const b = bSlug ? getRecipeBySlug(bSlug) : undefined;

  const buildHref = (next: { a?: string; b?: string; platform?: string }) => {
    const merged: Record<string, string | undefined> = {
      a: aSlug,
      b: bSlug,
      platform: platform === "helix" ? undefined : platform,
      ...next,
    };
    const qs = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    return `/preview/compare${qs.toString() ? `?${qs}` : ""}`;
  };

  return (
    <div className="container">
      <section className="compare-page">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Compare</span>
        </div>

        <header className="archive-page-head browse-page-head">
          <h1 className="archive-title">Compare two tones</h1>
        </header>

        <p className="compare-lede">
          Pick two recipes — see the chain, the gear, and the settings
          side by side. Useful for &quot;Should I cop SRV&apos;s tone or
          Mayer&apos;s clean?&quot; decisions.
        </p>

        {/* Platform switcher — applies to both columns */}
        {(a || b) && (
          <div className="compare-platform-row">
            <span className="browse-filter-label">Compare on</span>
            <div className="compare-platform-tabs">
              {PLATFORMS.map((p) => (
                <Link
                  key={p.id}
                  href={buildHref({ platform: p.id })}
                  className={`browse-filter-pill ${platform === p.id ? "is-active" : ""}`}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="compare-grid">
          <CompareColumn
            recipe={a}
            otherSlug={bSlug}
            slot="a"
            platform={platform}
            buildHref={buildHref}
          />
          <CompareColumn
            recipe={b}
            otherSlug={aSlug}
            slot="b"
            platform={platform}
            buildHref={buildHref}
          />
        </div>
      </section>
    </div>
  );
}

function CompareColumn({
  recipe,
  otherSlug,
  slot,
  platform,
  buildHref,
}: {
  recipe: ReturnType<typeof getRecipeBySlug>;
  otherSlug: string | undefined;
  slot: "a" | "b";
  platform: Platform;
  buildHref: (next: { a?: string; b?: string; platform?: string }) => string;
}) {
  if (!recipe) {
    // Empty slot — show a picker
    const picks = toneRecipes.slice(0, 12);
    return (
      <div className="compare-col compare-col-empty">
        <div className="compare-col-head">
          <span className="compare-col-label">Slot {slot.toUpperCase()}</span>
          <h2 className="display">Pick a recipe</h2>
        </div>
        <ul className="compare-pick-list">
          {picks.map((r) => {
            const s = getSongBySlug(r.song_slug);
            const ar = s ? getArtistBySlug(s.artist_slug) : undefined;
            const href = buildHref(
              slot === "a" ? { a: r.slug } : { b: r.slug },
            );
            return (
              <li key={r.slug}>
                <Link href={href} className="compare-pick-link">
                  <span className="compare-pick-song">
                    {s?.title ?? r.title}
                  </span>
                  <span className="compare-pick-artist">
                    <em>{ar?.name ?? "Unknown"}</em>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/preview/browse"
          className="hero-cta hero-cta-secondary compare-pick-browse"
        >
          Browse all
        </Link>
      </div>
    );
  }

  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const recipeIdx = toneRecipes.findIndex((r) => r.slug === recipe.slug) + 1;
  const blocks = recipeToBlocks(recipe, platform);

  // "Swap to a different recipe" link strips just this slot
  const swapHref = buildHref(
    slot === "a"
      ? { a: undefined }
      : { b: undefined },
  );

  return (
    <div className="compare-col">
      <div className="compare-col-head">
        <span className="compare-col-label">Slot {slot.toUpperCase()}</span>
        <Link href={swapHref} className="compare-swap">
          Swap recipe ✕
        </Link>
      </div>
      <div className="compare-col-cover">
        <LpArt
          cover={song?.album_art_url}
          monogram={monogramFor(artist?.name)}
          meta={`${blocks.length} blocks`}
          hue={recipeIdx}
          alt={`${song?.album ?? song?.title ?? recipe.title} cover`}
        />
      </div>
      <div className="compare-col-meta">
        <h2 className="compare-col-song">
          <Link href={`/preview/recipe/${recipe.slug}`}>
            {song?.title ?? recipe.title}
          </Link>
        </h2>
        <span className="compare-col-artist">
          <em>{artist?.name ?? "Unknown"}</em>
        </span>
        {song?.album && (
          <span className="compare-col-album">
            {song.album}
            {song.year ? ` · ${song.year}` : ""}
          </span>
        )}
      </div>
      <div className="compare-col-chain">
        <PreviewSchematicChain
          blocks={blocks}
          selectedIndex={null}
          interactive={false}
        />
      </div>
    </div>
  );
}
