import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fitTitle } from "@/lib/seo-title";
import { platformLabel } from "@/lib/constants";
import {
  gearItems,
  getGearBySlug,
  toneRecipes,
} from "@/lib/data";
import Gear from "@/components/gear/Gear";
import { drawingFor } from "@/lib/gear/gear-drawing";
import { GUITARS, guitarSrc } from "@/lib/gear/guitars";
import ToneCard from "@/components/recipe/redesign/ToneCard";
import PostsRail from "@/app/_pages/PostsRail";
import { findRelatedPosts } from "@/components/v3/findRelatedPosts";
import { gearJsonLdSet } from "@/lib/seo/jsonld";

// Hard-404 unknown slugs. The segment's loading.tsx starts streaming a 200
// before notFound() can throw, so garbage slugs were soft-404s; with
// dynamicParams=false, non-generated slugs 404 without rendering at all.
export const dynamicParams = false;

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
    return { title: "Preview | Fader & Knob", robots: { index: false, follow: false } };
  }
  // Brand comes from the root layout's title template; don't repeat it.
  const fullTitle = `${g.name}: recipes and modeler equivalents`;
  const title = fitTitle([
    fullTitle,
    `${g.name}: modeler equivalents`,
    g.name,
  ]);
  const description = `${g.name} on Fader & Knob: which recipes use it, how to model it on Helix, Quad Cortex, TONEX, Fractal, and Kemper.`;
  return {
    title,
    description,
    alternates: { canonical: `/gear/${slug}` },
    keywords: [g.name, g.type, g.manufacturer, "tone recipe", "modeler equivalent", "guitar gear"].filter(
      Boolean,
    ) as string[],
    openGraph: { title: fullTitle, description, type: "website" },
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

  const { product, breadcrumb } = gearJsonLdSet(gear);
  const drawing = drawingFor(gear);
  const tags = [gear.type, gear.subcategory].filter(Boolean) as string[];

  return (
    <div className="fk-wrap fkp-page">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/gear">Gear</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{gear.name}</span>
      </nav>

      <header className="fkp-profile">
        <div className="fkp-profile-text">
          <h1 className="fk-display">{gear.name}</h1>
          <p className="fk-lead">{gear.manufacturer}</p>
          {tags.length > 0 && (
            <ul className="fkp-tags" aria-label="Type">
              {tags.map((t) => (
                <li key={t} className="fkp-tag">{t}</li>
              ))}
            </ul>
          )}
          {gear.description && <p className="fk-body fkp-measure">{gear.description}</p>}
        </div>
        {drawing && (
          <div className="fkp-profile-art fkp-gear-art" aria-hidden="true">
            {drawing.type === "guitar" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={guitarSrc(drawing.guitar)} alt={GUITARS[drawing.guitar]} className="fkp-gear-guitar" />
            ) : (
              <Gear
                kind={drawing.pick.kind}
                height={220}
                vals={drawing.pick.vals}
                title={drawing.pick.title}
                disp={drawing.pick.disp}
                color={drawing.pick.color}
                label=""
              />
            )}
          </div>
        )}
      </header>

      {gear.modeler_equivalents && Object.keys(gear.modeler_equivalents).length > 0 && (
        <section className="fkp-section">
          <h2 className="fk-t2">Modeler equivalents</h2>
          <dl className="fkp-tiles fkp-equivs">
            {Object.entries(gear.modeler_equivalents).map(([platform, model]) => (
              <div key={platform} className="fk-tile">
                <dt className="fk-caption">{platformLabel(platform)}</dt>
                <dd className="fk-label">{String(model)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {usedIn.length > 0 && (
        <section className="fkp-section">
          <h2 className="fk-t2">Recipes using this gear</h2>
          <div className="fk-card-grid">
            {usedIn.slice(0, 12).map((r) => (
              <ToneCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      )}

      <PostsRail title={`Field notes on the ${gear.name}`} posts={relatedPosts} />
    </div>
  );
}
