import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { blogMdxComponents } from "@/components/mdx";
import { settingsMdxComponents } from "@/components/settings/mdx-components";
import {
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
  getCallNumber,
  BLOG_CATEGORIES,
} from "@/lib/blog";
import { getWriter } from "@/lib/writers";
import { extractToc } from "@/lib/toc";
import { ToC } from "../_components/ToC";
import type { Metadata } from "next";

/**
 * /preview/blog/[slug] — editorial post detail, audition route.
 *
 * Magazine-style feature layout: cover image with overlaid masthead,
 * a Key Takeaways block that answer engines can quote directly, the
 * MDX body rendered in a reading column with a sticky ToC in the
 * right rail, an FAQ section at the bottom, a writer bio card, and
 * Article + FAQPage JSON-LD in the document head for rich results.
 */

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post
      ? `Preview · ${post.title} — Field Notes`
      : "Preview — Field Notes",
    robots: { index: false, follow: false },
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const SITE_URL = "https://faderandknob.com";

export default async function PreviewBlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const catLabel = BLOG_CATEGORIES[post.category] ?? post.category;
  const callNo = getCallNumber(post.slug);
  const writer = getWriter(post.authorSlug);
  const tocEntries = extractToc(post.content);

  // Related: same category, excluding this post, up to 3
  const related = getAllPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // JSON-LD — Article schema gives answer engines a clean, structured
  // summary of the post. Published + modified dates, author with URL,
  // hero image, category as articleSection, word count. The keywords
  // field uses tags.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: post.image ? `${SITE_URL}${post.image}` : undefined,
    author: {
      "@type": "Person",
      name: writer.name,
      url: `${SITE_URL}/writers/${writer.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Fader & Knob",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    articleSection: catLabel,
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
  };

  // Only emit FAQPage schema when the post actually has Q&A pairs.
  const faqLd = post.faq && post.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      }
    : null;

  return (
    <div className="container">
      {/* Article JSON-LD — Article schema always; FAQPage only when FAQs exist. */}
      <Script
        id="article-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <Script
          id="faq-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <article className="recipe">
        {/* Breadcrumbs */}
        <div className="recipe-crumbs">
          <Link href="/preview">Home</Link>
          <span className="sep">/</span>
          <Link href="/preview/blog">Field Notes</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>{catLabel}</span>
        </div>

        {/* Hero cover — title, masthead, dek, byline all overlaid on the
            feature image. Reads like a magazine cover / LP jacket. */}
        <div className={`post-cover ${post.image ? "has-image" : "no-image"}`}>
          {post.image && (
            <>
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 960px) 100vw, 960px"
                className="post-cover-img"
              />
              <div className="post-cover-scrim" aria-hidden="true" />
            </>
          )}

          <div className="post-cover-inner">
            {/* Masthead strip — pinned to the top */}
            <div className="post-cover-masthead">
              <span className="pill">No. {callNo}</span>
              <span>{catLabel}</span>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime}</span>
              {post.updated && (
                <>
                  <span>·</span>
                  <span>Updated {formatDate(post.updated)}</span>
                </>
              )}
            </div>

            {/* Title + dek — bottom-anchored */}
            <div className="post-cover-headline">
              <h1 className="post-title display">{post.title}</h1>
              <p className="post-dek">{post.description}</p>
              <div className="post-cover-byline">
                <div>
                  <span className="label">Filed by</span>
                  <em>{post.author}</em>
                </div>
                <div>
                  <span className="label">Tagged</span>
                  <span>{post.tags.slice(0, 4).join(" · ")}</span>
                </div>
                <div className="side-mark">
                  <span>Side A</span>
                  <span>File {callNo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways — boxed, bulleted summary for quick scanning
            and for AI answer engines to quote directly. Only rendered
            if the post frontmatter supplies them. */}
        {post.takeaways && post.takeaways.length > 0 && (
          <aside className="post-takeaways" aria-label="Key takeaways">
            <div className="post-takeaways-head">
              <span className="post-takeaways-mark" aria-hidden="true">
                ⤷
              </span>
              <span className="post-takeaways-label">Key takeaways</span>
              <span className="post-takeaways-meta">
                {post.readingTime} · {post.wordCount.toLocaleString()} words
              </span>
            </div>
            <ul className="post-takeaways-list">
              {post.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </aside>
        )}

        {/* Reading frame — sticky ToC in the right rail, prose on the left.
            ToC collapses to an inline accordion below the dek on narrow
            viewports (handled in CSS). */}
        <div className="post-reading">
          <div className="post-body">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                  ],
                },
              }}
              components={{
                ...blogMdxComponents,
                ...settingsMdxComponents,
              }}
            />
          </div>
          {tocEntries.length > 0 && <ToC entries={tocEntries} />}
        </div>

        {/* FAQ — rendered as real <h3> Q / <p> A pairs so the prose is
            indexable and so the FAQPage JSON-LD above has a visible
            on-page counterpart. */}
        {post.faq && post.faq.length > 0 && (
          <section className="post-faq" aria-labelledby="faq-head">
            <div className="section-head">
              <span className="section-mark">?</span>
              <h2 id="faq-head" className="section-title">
                Frequently asked
              </h2>
              <span className="section-rule" aria-hidden="true" />
              <span className="section-meta">
                {post.faq.length}{" "}
                {post.faq.length === 1 ? "question" : "questions"}
              </span>
            </div>
            <dl className="post-faq-list">
              {post.faq.map((f, i) => (
                <div key={f.q} className="post-faq-item">
                  <dt className="post-faq-q">
                    <span className="post-faq-num" aria-hidden="true">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{f.q}</span>
                  </dt>
                  <dd className="post-faq-a">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* About the writer — E-E-A-T signal + humanises the byline */}
        <section className="post-author" aria-labelledby="author-head">
          <div className="section-head">
            <span className="section-mark">¤</span>
            <h2 id="author-head" className="section-title">
              About the writer
            </h2>
            <span className="section-rule" aria-hidden="true" />
            <span className="section-meta">Field correspondent</span>
          </div>
          <div className="post-author-card">
            {writer.image && (
              <div className="post-author-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={writer.image} alt={writer.name} />
              </div>
            )}
            <div className="post-author-body">
              <div className="post-author-name">{writer.name}</div>
              {writer.title && (
                <div className="post-author-title">{writer.title}</div>
              )}
              <p className="post-author-bio">{writer.bio}</p>
            </div>
          </div>
        </section>

        {/* End-of-file mark */}
        <div className="post-endmark" aria-hidden="true">
          ▪ ▪ ▪
        </div>

        {/* Related filings */}
        {related.length > 0 && (
          <div className="related">
            <h3 className="display">Also filed under {catLabel}</h3>
            <div className="feat-grid">
              {related.map((r) => (
                <div key={r.slug} style={{ gridColumn: "span 4" }}>
                  <Link
                    href={`/preview/blog/${r.slug}`}
                    className="feat-card"
                    style={{ display: "block" }}
                  >
                    <div className="feat-card-num">
                      No. {getCallNumber(r.slug)}
                    </div>
                    <div className="feat-card-art">
                      {r.image && (
                        <Image
                          src={r.image}
                          alt={r.imageAlt ?? r.title}
                          fill
                          unoptimized
                          sizes="(max-width: 960px) 33vw, 300px"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div className="feat-card-song">{r.title}</div>
                    <div className="feat-card-artist">
                      {r.author} · {formatDate(r.date)}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
