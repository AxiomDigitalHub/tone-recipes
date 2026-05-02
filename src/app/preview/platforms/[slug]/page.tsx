import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPlatformInfo,
  getAllPlatforms,
  getRecipesForPlatform,
} from "@/lib/data/platforms";
import {
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import type { Platform } from "@/types/recipe";
import { recipeToBlocks } from "../../_components/recipe-to-blocks";
import { LpArt, monogramFor } from "../../_components/LpArt";

export function generateStaticParams() {
  return getAllPlatforms().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlatformInfo(slug);
  return {
    title: p
      ? `Preview · ${p.label} — Fader & Knob`
      : "Preview — Fader & Knob",
    robots: { index: false, follow: false },
  };
}

const HUE_BY_PLATFORM: Record<string, number> = {
  helix: 1,
  quad_cortex: 4,
  tonex: 6,
  fractal: 3,
  kemper: 5,
  katana: 2,
};

export default async function PreviewPlatformDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const platform = getPlatformInfo(slug);
  if (!platform) notFound();

  const recipes = getRecipesForPlatform(slug);
  const hue = HUE_BY_PLATFORM[slug] ?? 1;
  const allPlatforms = getAllPlatforms();

  return (
    <div className="container">
      <div className="platform-detail">
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <Link href="/preview/platforms">Platforms</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{platform.label}</span>
        </div>

        <header className={`platform-head lp-hue-${hue}`}>
          <div>
            <div className="recipe-issue">
              <span className="pill">{platform.manufacturer}</span>
              <span>{recipes.length} recipes translated</span>
            </div>
            <h1 className="recipe-title display">{platform.label}</h1>
            <p className="platform-tagline">{platform.tagline}</p>
          </div>
          <div className="platform-stripe" aria-hidden="true" />
        </header>

        <section className="platform-section">
          <div className="how-head">
            <h2 className="display">Why {platform.label} players use Fader &amp; Knob</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <ol className="how-steps">
            <li className="how-step">
              <span className="how-step-no">01</span>
              <h3 className="how-step-title">Block names you can search</h3>
              <p className="how-step-body">
                Every recipe lists the exact {platform.label} block names —
                the same strings that show up in HX Edit, the editor, or your
                unit&apos;s display. No guessing which model matches what.
              </p>
            </li>
            <li className="how-step">
              <span className="how-step-no">02</span>
              <h3 className="how-step-title">Parameters in your units</h3>
              <p className="how-step-body">
                Settings are translated to your platform&apos;s actual ranges —
                not generic 0–10 marks. dB is dB. Hz is Hz. Time is ms.
              </p>
            </li>
            <li className="how-step">
              <span className="how-step-no">03</span>
              <h3 className="how-step-title">Snapshots &amp; routing included</h3>
              <p className="how-step-body">
                Where the original tone uses snapshot switching, parallel
                routing, or a specific footswitch assignment, we say so. You
                shouldn&apos;t have to reverse-engineer it.
              </p>
            </li>
          </ol>
        </section>

        <section className="platform-section">
          <div className="how-head">
            <h2 className="display">The {platform.label} archive</h2>
            <span className="section-rule" aria-hidden="true" />
            <span className="section-meta">{recipes.length} translations</span>
          </div>
          <div className="audition-grid">
            {recipes.slice(0, 12).map((r) => {
              const rSong = getSongBySlug(r.song_slug);
              const rArtist = rSong
                ? getArtistBySlug(rSong.artist_slug)
                : undefined;
              const rIdx =
                toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
              const rBlocks = recipeToBlocks(r, slug as Platform);
              return (
                <Link
                  key={r.slug}
                  href={`/preview/recipe/${r.slug}?platform=${slug}`}
                  className="audition-card"
                >
                  <div className="audition-art">
                    <LpArt
                      cover={rSong?.album_art_url}
                      monogram={monogramFor(rArtist?.name)}
                      meta={`${rBlocks.length} blocks`}
                      hue={rIdx}
                      alt={`${rSong?.album ?? rSong?.title ?? r.title} cover`}
                    />
                  </div>
                  <div className="audition-meta">
                    <span className="audition-song">
                      {rSong?.title ?? r.title}
                    </span>
                    <span className="audition-artist">
                      <em>{rArtist?.name ?? "Unknown"}</em>
                    </span>
                    {rSong?.album && (
                      <span className="audition-album">
                        {rSong.album}
                        {rSong.year ? ` · ${rSong.year}` : ""}
                      </span>
                    )}
                    <span className="audition-cta">
                      Open patch <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          {recipes.length > 12 && (
            <Link
              href={`/preview/browse?platform=${slug}`}
              className="platform-see-all"
            >
              See all {recipes.length} {platform.label} recipes →
            </Link>
          )}
        </section>

        {/* Other platforms — quiet jumper rail */}
        <section className="platform-section platform-other">
          <div className="how-head">
            <h2 className="display">Other modelers</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="platform-jumper">
            {allPlatforms
              .filter((p) => p.id !== slug)
              .map((p, i) => {
                const recipesCount = getRecipesForPlatform(p.id).length;
                const otherHue = HUE_BY_PLATFORM[p.id] ?? ((i % 6) + 1);
                return (
                  <Link
                    key={p.id}
                    href={`/preview/platforms/${p.id}`}
                    className={`platform-jumper-item lp-hue-${otherHue}`}
                  >
                    <span className="platform-jumper-stripe" aria-hidden="true" />
                    <span className="platform-jumper-mfr">{p.manufacturer}</span>
                    <span className="platform-jumper-name">{p.label}</span>
                    <span className="platform-jumper-count">
                      {recipesCount} recipes
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
