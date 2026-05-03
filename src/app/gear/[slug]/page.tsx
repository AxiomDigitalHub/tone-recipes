import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  gearItems,
  getGearBySlug,
  toneRecipes,
  getSongBySlug,
  getArtistBySlug,
} from "@/lib/data";
import { recipeToBlocks } from "@/components/v3/recipe-to-blocks";
import { LpArt, monogramFor } from "@/components/v3/LpArt";
import { FieldNotesRail } from "@/components/v3/FieldNotesRail";
import { findRelatedPosts } from "@/components/v3/findRelatedPosts";

export function generateStaticParams() {
  return gearItems.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGearBySlug(slug);
  if (!g) {
    return { title: "Preview — Fader & Knob", robots: { index: false, follow: false } };
  }
  const title = `${g.name} — Recipes & modeler equivalents | Fader & Knob`;
  const description = `${g.name} on Fader & Knob: which recipes use it, how to model it on Helix, Quad Cortex, TONEX, Fractal, and Kemper.`;
  return {
    title,
    description,
    keywords: [g.name, g.type, g.manufacturer, "tone recipe", "modeler equivalent", "guitar gear"].filter(
      Boolean,
    ) as string[],
    openGraph: { title, description, type: "website" },
    robots: { index: false, follow: false },
  };
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gear = getGearBySlug(slug);
  if (!gear) notFound();

  // Recipes that include this gear in their signal chain
  const usedIn = toneRecipes.filter((r) =>
    (r.signal_chain ?? []).some((b) => b.gear_slug === slug),
  );

  const relatedPosts = findRelatedPosts({
    keywords: [gear.name, gear.manufacturer],
    tags: [gear.slug],
    limit: 3,
  });

  return (
    <div className="container">
      <div className="gear-detail">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Gear</span>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{gear.name}</span>
        </div>

        <header className="gear-head">
          <div>
            <div className="recipe-issue">
              <span className="pill">{gear.manufacturer}</span>
              <span>{gear.type}</span>
              {gear.subcategory && (
                <>
                  <span>·</span>
                  <span>{gear.subcategory}</span>
                </>
              )}
            </div>
            <h1 className="recipe-title display">{gear.name}</h1>
            {gear.description && (
              <p className="gear-description">{gear.description}</p>
            )}
          </div>
        </header>

        {gear.modeler_equivalents && Object.keys(gear.modeler_equivalents).length > 0 && (
          <section className="platform-section">
            <div className="how-head">
              <h2 className="display">Modeler equivalents</h2>
              <span className="section-rule" aria-hidden="true" />
            </div>
            <dl className="gear-equivalents">
              {Object.entries(gear.modeler_equivalents).map(([platform, model]) => (
                <div key={platform} className="gear-equivalent">
                  <dt>{platform}</dt>
                  <dd>{String(model)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {usedIn.length > 0 && (
          <section className="platform-section">
            <div className="how-head">
              <h2 className="display">Recipes using this gear</h2>
              <span className="section-rule" aria-hidden="true" />
            </div>
            <div className="audition-grid">
              {usedIn.slice(0, 12).map((r) => {
                const rSong = getSongBySlug(r.song_slug);
                const rArtist = rSong
                  ? getArtistBySlug(rSong.artist_slug)
                  : undefined;
                const rIdx =
                  toneRecipes.findIndex((tr) => tr.slug === r.slug) + 1;
                const rBlocks = recipeToBlocks(r, "helix");
                return (
                  <Link
                    key={r.slug}
                    href={`/recipe/${r.slug}`}
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
                        See the chain <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <FieldNotesRail
          title={`Field notes on the ${gear.name}`}
          posts={relatedPosts}
        />
      </div>
    </div>
  );
}
