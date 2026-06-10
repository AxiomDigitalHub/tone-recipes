import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllWriters, getWriter } from "@/lib/writers";
import { getAllPosts } from "@/lib/blog";
import { writerJsonLdSet } from "@/lib/seo/jsonld";

/**
 * /writers/[slug] — staff writer profile page.
 *
 * Built 2026-05-12 to close schema audit finding #1: blog Article.author.url
 * had been pointing at /writers/${slug} which didn't exist. Now the URL is
 * real, the route ships Person schema (the E-E-A-T authorship signal Google
 * looks for), and the blog Article schema is restored to include the URL.
 *
 * Reads from src/lib/writers.ts (10 writers). Posts by the writer come
 * from getAllPosts() filtered by authorSlug.
 */

export function generateStaticParams() {
  return getAllWriters().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writer = getWriter(slug);
  if (!writer) {
    return {
      title: "Writer not found — Fader & Knob",
      robots: { index: false, follow: false },
    };
  }
  const title = `${writer.name} — ${writer.title} | Fader & Knob`;
  return {
    title,
    description: writer.bio.slice(0, 160),
    openGraph: { title, description: writer.bio.slice(0, 160), type: "profile" },
  };
}

export default async function WriterProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writer = getWriter(slug);
  if (!writer || writer.slug === "fader-and-knob") notFound();

  const posts = getAllPosts()
    .filter((p) => p.authorSlug === slug)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const { person, breadcrumb } = writerJsonLdSet(writer);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="recipe-crumbs">
          <Link href="/blog">Field Notes</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Writers</span>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{writer.name}</span>
        </div>

        <header className="archive-masthead">
          <div className="archive-kicker">
            <span>Writer</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{writer.title}</span>
          </div>
          <h1 className="archive-title">{writer.name}</h1>
          <p className="archive-lede">{writer.bio}</p>
        </header>

        {writer.backstory && (
          <section className="mt-10">
            <p
              className="text-base leading-relaxed md:text-lg"
              style={{ color: "var(--ink)" }}
            >
              {writer.backstory.whyTheyWrite}
            </p>
            <p
              className="mt-4 text-sm italic md:text-base"
              style={{
                color: "var(--ink-muted)",
                fontFamily: "var(--font-display)",
              }}
            >
              &ldquo;{writer.backstory.tonePhilosophy}&rdquo;
            </p>
          </section>
        )}

        <section className="mt-16 md:mt-20">
          <div className="section-head">
            <span className="section-mark">¤</span>
            <h2 className="section-title">Field notes by {writer.name}</h2>
            <span className="section-rule" aria-hidden="true" />
            <span className="section-meta">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </div>
          {posts.length === 0 ? (
            <p
              className="mt-4 text-sm"
              style={{ color: "var(--ink-muted)" }}
            >
              No posts published yet under this byline.
            </p>
          ) : (
            <ul
              className="border-b"
              style={{ borderColor: "rgba(10,9,8,0.18)" }}
            >
              {posts.slice(0, 30).map((p) => (
                <li
                  key={p.slug}
                  className="border-t group"
                  style={{ borderColor: "rgba(10,9,8,0.18)" }}
                >
                  <Link href={`/blog/${p.slug}`} className="block py-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3
                        className="display text-lg group-hover:underline md:text-xl"
                        style={{
                          color: "var(--ink)",
                          letterSpacing: "-0.01em",
                          textDecorationThickness: "1px",
                          textUnderlineOffset: "4px",
                        }}
                      >
                        {p.title}
                      </h3>
                      <span
                        className="shrink-0 text-[10px] uppercase tracking-[0.18em]"
                        style={{
                          color: "var(--ink-muted)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {p.date.slice(0, 10)}
                      </span>
                    </div>
                    <p
                      className="mt-2 max-w-[58ch] text-sm leading-relaxed"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {p.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div
          className="mt-16 text-center text-[10px] tracking-[0.4em]"
          style={{ color: "var(--ink-faint)" }}
          aria-hidden="true"
        >
          ▪ ▪ ▪
        </div>
      </article>
    </>
  );
}
