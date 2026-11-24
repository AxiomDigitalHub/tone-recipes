import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, type BlogPost } from "@/lib/blog";
import { PILLARS, getPillar, pillarFor } from "@/lib/pillars";
import { thumbFor } from "@/lib/gear/thumbs";
import Thumb from "@/components/gear/Thumb";
import PillarTiles from "@/components/guides/PillarTiles";
import { SITE_URL } from "@/lib/constants";

/**
 * /guides/[slug]: a pillar page. Data lives in src/lib/pillars.ts.
 *
 * Curated sections first (reading order), then every other guide that
 * belongs to the pillar, so the page links down to all of its guides and
 * each guide's breadcrumb links back up.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) return {};
  return {
    title: { absolute: pillar.seoTitle },
    description: pillar.description,
    alternates: { canonical: `/guides/${pillar.slug}` },
    openGraph: { title: pillar.seoTitle, description: pillar.description, type: "website" },
  };
}

const minutes = (readingTime: string) => readingTime.replace(/\s*read$/i, "");

function Rows({ posts, thumbs }: { posts: BlogPost[]; thumbs: boolean }) {
  return (
    <ul className="fk-guiderows">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={`/blog/${p.slug}`} className={thumbs ? "has-thumb" : undefined}>
            {thumbs && <Thumb spec={thumbFor(p)} gearHeight={48} ratio="1 / 1" radius="r-md" />}
            <span className="fk-guiderow-title">{p.headline}</span>
            <span className="fk-data fk-guiderow-meta">{minutes(p.readingTime)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function PillarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  const all = getAllPosts();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const sections = pillar.sections
    .map((s) => ({ title: s.title, posts: s.slugs.map((x) => bySlug.get(x)).filter((p): p is BlogPost => Boolean(p)) }))
    .filter((s) => s.posts.length > 0);
  const curated = new Set(sections.flatMap((s) => s.posts.map((p) => p.slug)));
  const rest = all.filter((p) => !curated.has(p.slug) && pillarFor(p)?.slug === pillar.slug);
  const members = [...sections.flatMap((s) => s.posts), ...rest];

  const url = `${SITE_URL}/guides/${pillar.slug}`;
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pillar.title,
    description: pillar.description,
    url,
    hasPart: members.map((p) => ({ "@type": "Article", headline: p.headline, url: `${SITE_URL}/blog/${p.slug}` })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Learn", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 2, name: pillar.title, item: url },
    ],
  };

  return (
    <div className="fk-learn fk-pillar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="fk-wrap fk-guide-top">
        <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
          <Link href="/blog">Learn</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{pillar.title}</span>
        </nav>
        <div className="fk-guide-head">
          <div className="fk-guide-headcopy">
            <h1 className="fk-guide-h1">{pillar.title}</h1>
            <p className="fk-lead">{pillar.lede}</p>
            {pillar.intro.map((para) => (
              <p key={para} className="fk-body fk-muted">
                {para}
              </p>
            ))}
          </div>
          <Thumb {...pillar.art} ratio="4 / 3" />
        </div>
      </section>

      <div className="fk-wrap fk-pillar-sections">
        {sections.map((s) => (
          <section key={s.title} className="fk-pillar-sec">
            <h2 className="fk-t2">{s.title}</h2>
            <Rows posts={s.posts} thumbs />
          </section>
        ))}
      </div>

      {pillar.cta && (
        <section className="fk-wrap fk-pillar-cta">
          <div className="fk-tile fk-pillar-ctatile">
            <div>
              <h2 className="fk-t3">{pillar.cta.title}</h2>
              <p className="fk-body fk-muted">{pillar.cta.body}</p>
            </div>
            <Link href={pillar.cta.href} className="fk-btn fk-btn-secondary">
              {pillar.cta.label}
            </Link>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="fk-wrap fk-learn-every">
          <h2 className="fk-t2">More {pillar.title.charAt(0).toLowerCase() + pillar.title.slice(1)} guides</h2>
          <Rows posts={rest} thumbs={false} />
        </section>
      )}

      <section className="fk-wrap fk-learn-new fk-pillar-others">
        <h2 className="fk-t2">Other subjects</h2>
        <PillarTiles exclude={pillar.slug} heading="h3" />
      </section>
    </div>
  );
}
