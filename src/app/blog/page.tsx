import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCallNumber, BLOG_CATEGORIES } from "@/lib/blog";
import { getAllWriters } from "@/lib/writers";
import { BlogArchive, type ArchiveGroup } from "@/components/v3/BlogArchive";
import type { Metadata } from "next";

/**
 * /blog — editorial archive, audition route.
 *
 * Magazine-style index: the current issue up top (one hero + three side
 * items), a Departments rail of every category, then the full backlog
 * rendered as a dense ledger grouped by volume/quarter, and a Masthead
 * colophon listing the writers. Every post carries a permanent call
 * number (oldest = No. 001) so the same number follows it everywhere.
 */

export const metadata: Metadata = {
  title: "Field Notes — Fader & Knob",
  description:
    "Long-form writing on tone, gear, and the songs you love. Pedalboard architecture, modeler block deep-dives, vintage gear histories, signal chain forensics.",
  openGraph: {
    title: "Field Notes — Fader & Knob",
    description: "Long-form writing on tone, gear, and the songs you love.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

const FEATURED_SLUGS = [
  "signal-chain-order-guide",
  "helix-vs-quad-cortex-vs-kemper",
  "overdrive-vs-distortion-vs-fuzz",
  "tube-screamer-settings-guide",
];

/** Roman numerals for volume labels (max needed for our lifetime is ~X). */
const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
function volumeFor(year: number): string {
  // Volume I starts in 2023 (arbitrary but stable — matches the "Vol. IV"
  // already in the site masthead for 2026).
  const vol = Math.max(1, year - 2022);
  return ROMAN[vol] ?? String(vol);
}

function formatDate(iso: string, opts?: { long?: boolean }): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: opts?.long ? "long" : "short",
    day: "numeric",
  });
}

function quarterOf(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return {
    key: `${y}-Q${q}`,
    // Sort descending — newest quarter first.
    sort: -(y * 10 + q),
    label: `Vol. ${volumeFor(y)} · Q${q} ${y}`,
  };
}

export default function PreviewBlogIndex() {
  const all = getAllPosts(); // already sorted newest → oldest
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  // Current issue picks
  const picks = FEATURED_SLUGS.map((s) => bySlug.get(s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  if (picks.length === 0) return null;
  const [hero, ...rest] = picks;

  // Archive = everything not featured this issue
  const featuredSet = new Set(FEATURED_SLUGS);
  const archive = all.filter((p) => !featuredSet.has(p.slug));

  // Group the archive by quarter for the ledger, shaped for the
  // BlogArchive client component. We keep the grouping in the data
  // shape so the client can still filter, but the rendered ledger no
  // longer breaks on volume — it reads as one newest-first stream.
  const groupsMap = new Map<
    string,
    { key: string; label: string; sort: number; posts: ArchiveGroup["posts"] }
  >();
  for (const p of archive) {
    const q = quarterOf(p.date);
    const row = {
      slug: p.slug,
      title: p.title,
      date: p.date,
      category: p.category,
      categoryLabel: BLOG_CATEGORIES[p.category] ?? p.category,
      author: p.author,
      callNo: getCallNumber(p.slug),
    };
    const g = groupsMap.get(q.key);
    if (g) g.posts.push(row);
    else
      groupsMap.set(q.key, {
        key: q.key,
        label: q.label,
        sort: q.sort,
        posts: [row],
      });
  }
  const groups: ArchiveGroup[] = [...groupsMap.values()]
    .sort((a, b) => a.sort - b.sort)
    .map(({ key, label, posts }) => ({ key, label, posts }));

  // Departments — only show categories that have posts
  const categoryCounts = new Map<string, number>();
  for (const p of all) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
  }
  const departments = Object.entries(BLOG_CATEGORIES)
    .map(([slug, label]) => ({
      slug,
      label,
      count: categoryCounts.get(slug) ?? 0,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  const writers = getAllWriters();

  return (
    <div className="container">
      <div className="recipe">
        {/* Breadcrumbs — same language as the recipe detail page */}
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Field Notes</span>
        </div>

        {/* Page head — just the title, then straight into the content */}
        <div className="archive-masthead archive-masthead-tight">
          <h1 className="archive-title display">Field Notes</h1>
        </div>

        {/* 2-up editorial layout: one hero feature, three sidebar items */}
        <div className="archive-grid">
          {/* Hero feature — current issue's lead */}
          <Link
            href={`/blog/${hero.slug}`}
            className="archive-hero"
          >
            <div className="archive-hero-art">
              {hero.image && (
                <Image
                  src={hero.image}
                  alt={hero.imageAlt ?? hero.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 960px) 100vw, 66vw"
                  className="archive-hero-img"
                />
              )}
              <div className="archive-hero-label">
                <span>No. {getCallNumber(hero.slug)}</span>
                <span>Lead · Side A</span>
              </div>
            </div>
            <div className="archive-hero-body">
              <div className="archive-eyebrow">
                <span className="pill">
                  {BLOG_CATEGORIES[hero.category] ?? hero.category}
                </span>
                <span>{formatDate(hero.date)}</span>
                <span>·</span>
                <span>{hero.readingTime}</span>
              </div>
              <h2 className="archive-hero-title display">{hero.title}</h2>
              <p className="archive-hero-dek">{hero.description}</p>
              <div className="archive-byline">
                <em>By {hero.author}</em>
              </div>
            </div>
          </Link>

          {/* Sidebar column — the other three, stacked. Each card pairs
              a 160px thumbnail with a serif title; the column reads as
              a tight editorial sidebar rather than a labelled section. */}
          <div className="archive-side">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="archive-item"
              >
                <div className="archive-item-art">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      priority={i === 0}
                      unoptimized
                      sizes="160px"
                      className="archive-item-img"
                    />
                  )}
                </div>
                <div className="archive-item-body">
                  <div className="archive-eyebrow">
                    <span>
                      {BLOG_CATEGORIES[post.category] ?? post.category}
                    </span>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="archive-item-title display">{post.title}</h3>
                  <div className="archive-byline">
                    <em>By {post.author}</em>
                    <span> · {formatDate(post.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Departments filter (left sidebar) + backlog ledger
            (client-rendered so the dept chips can filter rows in
            place without a page nav). */}
        <BlogArchive departments={departments} groups={groups} />

        {/* Masthead colophon — who writes this thing */}
        <section className="colophon-section" aria-labelledby="colophon-head">
          <div className="section-head">
            <h2 id="colophon-head" className="section-title">Masthead</h2>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="colophon-grid">
            {writers.map((w) => (
              <div key={w.slug} className="colophon-writer">
                <div className="colophon-writer-name">{w.name}</div>
                <div className="colophon-writer-title">
                  {w.title || "Contributing Writer"}
                </div>
              </div>
            ))}
          </div>
          <div className="colophon-foot">
            <span>
              Edited in the field, filed from the garage, the basement,
              and the tour bus.
            </span>
            <span className="colophon-mark" aria-hidden="true">▪ ▪ ▪</span>
          </div>
        </section>
      </div>
    </div>
  );
}
