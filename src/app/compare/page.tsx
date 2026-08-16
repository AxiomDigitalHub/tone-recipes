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
  alternates: { canonical: "/compare" },
  title: "Compare tone recipes side-by-side — Fader & Knob",
  description:
    "Pick any two recipes from the archive and view their signal chains side-by-side. Switch the platform to see how each chain ports across modelers.",
  openGraph: {
    title: "Compare tone recipes — Fader & Knob",
    description: "Two signal chains, side-by-side, on every modeler.",
    type: "website",
  },
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
    return `/compare${qs.toString() ? `?${qs}` : ""}`;
  };

  return (
    <div className="container">
      <section className="compare-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
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

        {/* The page was a lede plus two pickers — under 100 words, and
            flagged as thin. This is the part that makes the comparison
            useful rather than decorative. */}
        <section className="hub-prose" aria-labelledby="compare-how-head">
          <div className="how-head">
            <h2 id="compare-how-head" className="display">
              How to read a side-by-side
            </h2>
            <span className="section-rule" aria-hidden="true" />
          </div>

          <p>
            Two chains rarely differ everywhere. Most of the time one or two
            blocks are doing the work that makes the tones sound unrelated,
            and the rest is close enough to ignore. Putting them next to
            each other is how you find which ones.
          </p>

          <h3>Start at the amp, not the pedals</h3>
          <p>
            The amp model and its gain setting decide most of what you hear.
            If one chain runs a clean amp with a drive pedal doing the
            distortion and the other runs a cranked amp with a boost, no
            amount of matching the pedals will get you across — those are
            two different distortion sources with different compression and
            different response to your picking hand.
          </p>

          <h3>Then check what&apos;s in front of it</h3>
          <p>
            Order matters more than the count of blocks. A boost before a
            drive pushes the drive harder; the same boost after it just gets
            louder. When two chains share a pedal but sound different,
            check where it sits relative to the amp before you touch a
            single knob.
          </p>

          <h3>Ignore the effects until last</h3>
          <p>
            Delay and reverb settings are the most visible difference
            between two chains and usually the least important to the core
            tone. Get the amp and drive right first — the ambience is quick
            to match once the front of the chain is in the right place.
          </p>

          <h3>Compare on your own platform</h3>
          <p>
            The switcher above re-expresses both chains in your modeler&apos;s
            blocks, so you&apos;re comparing what you&apos;d actually dial
            rather than two hardware rigs you don&apos;t own. If your unit
            isn&apos;t listed, the pedalboard view shows the original
            hardware for both. More on how that translation works on the{" "}
            <Link href="/platforms">platforms page</Link>, or browse{" "}
            <Link href="/browse">the full archive</Link> to pick a second
            recipe.
          </p>
        </section>
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
          href="/browse"
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
          <Link href={`/recipe/${recipe.slug}`}>
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
