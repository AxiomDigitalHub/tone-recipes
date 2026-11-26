import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import {
  toneRecipes,
  getRecipeBySlug,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { monogramFor } from "@/components/v3/LpArt";
import ChainStrip from "@/app/_pages/ChainStrip";
import type { Platform } from "@/types/recipe";

export const metadata: Metadata = {
  alternates: { canonical: "/compare" },
  title: "Compare tone recipes side by side",
  description:
    "Pick any two recipes from the archive and view their signal chains side-by-side. Switch the platform to see how each chain ports across modelers.",
  openGraph: {
    title: "Compare tone recipes | Fader & Knob",
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
    <div className="fk-wrap fkp-page">
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Compare</span>
      </nav>

      <header className="fkp-head">
        <h1 className="fk-display">Compare two tones</h1>
        <p className="fk-lead fkp-measure">
          Pick two recipes and see the chain, the gear, and the settings
          side by side. Useful for &quot;Should I cop SRV&apos;s tone or
          Mayer&apos;s clean?&quot; decisions.
        </p>
      </header>

      {/* Platform switcher: applies to both columns */}
      {(a || b) && (
        <div className="fkp-compare-platforms">
          <span className="fk-label">Compare on</span>
          <div className="fk-chips">
            {PLATFORMS.map((p) => (
              <Link
                key={p.id}
                href={buildHref({ platform: p.id })}
                className="fk-chip"
                aria-current={platform === p.id ? "page" : undefined}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="fkp-compare-grid">
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

      {/* The page was a lede plus two pickers, under 100 words, and
          flagged as thin. This is the part that makes the comparison
          useful rather than decorative. */}
      <section className="fkp-section fkp-prose" aria-labelledby="compare-how-head">
        <h2 id="compare-how-head" className="fk-t2">
          How to read a side-by-side
        </h2>

        <p>
          Two chains rarely differ everywhere. Most of the time one or two
          blocks are doing the work that makes the tones sound unrelated,
          and the rest is close enough to ignore. Putting them next to
          each other is how you find which ones.
        </p>

        <h3 className="fk-t3">Start at the amp, not the pedals</h3>
        <p>
          The amp model and its gain setting decide most of what you hear.
          If one chain runs a clean amp with a drive pedal doing the
          distortion and the other runs a cranked amp with a boost, no
          amount of matching the pedals will get you across. Those are
          two different distortion sources with different compression and
          different response to your picking hand.
        </p>

        <h3 className="fk-t3">Then check what&apos;s in front of it</h3>
        <p>
          Order matters more than the count of blocks. A boost before a
          drive pushes the drive harder; the same boost after it just gets
          louder. When two chains share a pedal but sound different,
          check where it sits relative to the amp before you touch a
          single knob.
        </p>

        <h3 className="fk-t3">Ignore the effects until last</h3>
        <p>
          Delay and reverb settings are the most visible difference
          between two chains and usually the least important to the core
          tone. Get the amp and drive right first; the ambience is quick
          to match once the front of the chain is in the right place.
        </p>

        <h3 className="fk-t3">Compare on your own platform</h3>
        <p>
          The switcher above re-expresses both chains in your modeler&apos;s
          blocks, so you&apos;re comparing what you&apos;d actually dial
          rather than two hardware rigs you don&apos;t own. If your unit
          isn&apos;t listed, the pedalboard view shows the original
          hardware for both. More on how that translation works on the{" "}
          <Link href="/platforms" className="fk-link">platforms page</Link>, or browse{" "}
          <Link href="/browse" className="fk-link">the full archive</Link> to pick a second
          recipe.
        </p>
      </section>
    </div>
  );
}

function CompareColumn({
  recipe,
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
  const label = `Slot ${slot.toUpperCase()}`;
  if (!recipe) {
    // Empty slot: show a picker
    const picks = toneRecipes.slice(0, 12);
    return (
      <div className="fk-tile fkp-compare-col">
        <div className="fkp-compare-colhead">
          <p className="fk-caption">{label}</p>
          <h2 className="fk-t3">Pick a recipe</h2>
        </div>
        <ul className="fkp-rows">
          {picks.map((r) => {
            const s = getSongBySlug(r.song_slug);
            const ar = s ? getArtistBySlug(s.artist_slug) : undefined;
            const href = buildHref(
              slot === "a" ? { a: r.slug } : { b: r.slug },
            );
            return (
              <li key={r.slug}>
                <Link href={href} className="fkp-row">
                  <span className="fkp-row-main">
                    <span className="fk-rowcard-title">{s?.title ?? r.title}</span>
                    <span className="fk-caption">{ar?.name ?? "Unknown"}</span>
                  </span>
                  <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
        <div>
          <Link href="/browse" className="fk-btn fk-btn-secondary fk-btn-sm">
            Browse all
          </Link>
        </div>
      </div>
    );
  }

  const song = getSongBySlug(recipe.song_slug);
  const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
  const blocks = recipeToBlocks(recipe, platform);

  // "Swap recipe" strips just this slot
  const swapHref = buildHref(
    slot === "a"
      ? { a: undefined }
      : { b: undefined },
  );

  return (
    <div className="fk-tile fkp-compare-col">
      <div className="fkp-compare-colhead is-row">
        <p className="fk-caption">{label}</p>
        <Link href={swapHref} className="fk-link fk-body-sm">
          Swap recipe
        </Link>
      </div>
      <div className="fk-rowcard">
        <div className="fk-rowcard-art">
          {song?.album_art_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={song.album_art_url}
              alt={`${song?.album ?? song?.title ?? recipe.title} cover`}
              width={96}
              height={96}
            />
          ) : (
            <span className="fk-t3" aria-hidden="true">
              {monogramFor(artist?.name)}
            </span>
          )}
        </div>
        <div className="fkp-row-main">
          <h2 className="fk-t3">
            <Link href={`/recipe/${recipe.slug}`}>
              {song?.title ?? recipe.title}
            </Link>
          </h2>
          <p className="fk-body-sm">{artist?.name ?? "Unknown"}</p>
          {song?.album && (
            <p className="fk-caption">
              {song.album}
              {song.year ? ` · ${song.year}` : ""}
            </p>
          )}
        </div>
      </div>
      <ChainStrip
        blocks={blocks}
        height={96}
        wrap
        label={`Signal chain, ${song?.title ?? recipe.title}`}
      />
    </div>
  );
}
