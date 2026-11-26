import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllWriters, getWriter } from "@/lib/writers";
import { getAllPosts } from "@/lib/blog";
import { writerJsonLdSet } from "@/lib/seo/jsonld";
import { fitTitle } from "@/lib/seo-title";

/**
 * /writers/[slug]: AI editorial voice profile page.
 *
 * Honest authorship (2026-07-06): these writers are AI personas, and the
 * page now says so on its face: an "AI writer" tag, an explicit disclosure
 * line, and WebPage (not Person) schema. The persona/backstory data in
 * src/lib/writers.ts stays intact: it's the prompt scaffolding that gives
 * each voice its character, presented as the character card it is.
 *
 * Posts by the voice come from getAllPosts() filtered by authorSlug.
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
      title: "Writer not found | Fader & Knob",
      robots: { index: false, follow: false },
    };
  }
  // Lead with the voice and its beat, not the persona's name: these are AI
  // writers, and a name-first title reads like a real person's byline page.
  // The name stays in the <h1> above the "AI writer" tag. Brand comes from
  // the root layout's template.
  const title = writer.beat
    ? fitTitle([`${writer.title}: ${writer.beat}`, writer.title])
    : writer.name;
  const ogTitle = writer.beat ? `${writer.title}: ${writer.beat} (AI Writer)` : writer.name;
  return {
    title,
    description: writer.bio.slice(0, 160),
    alternates: { canonical: `/writers/${slug}` },
    openGraph: { title: ogTitle, description: writer.bio.slice(0, 160), type: "profile" },
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

  const { profile, breadcrumb } = writerJsonLdSet(writer);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profile) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <article className="fk-wrap fkp-page">
        <div className="fkp-textcol">
          <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
            <Link href="/blog">Learn</Link>
            <span aria-hidden="true">/</span>
            <span>Writers</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{writer.name}</span>
          </nav>

          <header className="fkp-head">
            <h1 className="fk-display">{writer.name}</h1>
            <ul className="fkp-tags" aria-label="Byline">
              <li className="fkp-tag">AI writer</li>
              <li className="fkp-tag">{writer.title}</li>
            </ul>
            <p className="fk-lead">{writer.bio}</p>
            <p className="fk-body-sm fkp-muted">
              {/* One string: the compiler dropped the space after {writer.name}
                  when the sentence ran on as multi-line JSX text. */}
              {`${writer.name} is not a person. This is one of Fader & Knob's AI editorial voices: a differently-trained writing persona, and the bio above is its character card. Why we write this way is documented in`}{" "}
              <Link href="/experiment" className="fk-link">
                the experiment
              </Link>
              .
            </p>
          </header>

          {writer.backstory && (
            <section className="fkp-section">
              <p className="fk-body">{writer.backstory.whyTheyWrite}</p>
              <blockquote className="fk-tile fkp-quote">
                <p className="fk-body">
                  &ldquo;{writer.backstory.tonePhilosophy}&rdquo;
                </p>
              </blockquote>
            </section>
          )}

          <section className="fkp-section">
            <div className="fkp-sectionhead">
              <h2 className="fk-t2">Field notes by {writer.name}</h2>
              <span className="fk-caption">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </span>
            </div>
            {posts.length === 0 ? (
              <p className="fk-body-sm fkp-muted">
                No posts published yet under this byline.
              </p>
            ) : (
              <ul className="fkp-postlist">
                {posts.slice(0, 30).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="fkp-postlist-link">
                      <span className="fkp-postlist-head">
                        <span className="fk-t3">{p.headline}</span>
                        <time className="fk-data fkp-muted" dateTime={p.date.slice(0, 10)}>
                          {p.date.slice(0, 10)}
                        </time>
                      </span>
                      <span className="fk-body-sm fkp-muted">{p.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </article>
    </>
  );
}
