import Link from "next/link";
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
  BLOG_CATEGORIES,
} from "@/lib/blog";
import Thumb from "@/components/gear/Thumb";
import { thumbFor, TOPIC_TITLE } from "@/lib/gear/thumbs";
import { getWriter } from "@/lib/writers";
import { extractToc } from "@/lib/toc";
import { ToC } from "@/components/v3/ToC";
import { RelatedRecipes } from "@/components/RelatedRecipes";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import type { Metadata } from "next";

/**
 * /blog/[slug] — editorial post detail, audition route.
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
  if (!post) {
    return { title: "Preview — Field Notes", robots: { index: false, follow: false } };
  }
  return {
    // `absolute` drops the "| Fader & Knob" root template — 15 chars of
    // every SERP title spent restating the domain, which is already on the
    // result. Same call the recipe route makes, for the same reason.
    // `seo_title` frontmatter overrides when the editorial headline is
    // longer than a SERP will render; the H1 keeps the full headline.
    title: { absolute: post.seoTitle ?? post.title },
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      ...(post.image ? { images: [{ url: post.image, alt: post.imageAlt ?? post.title }] } : {}),
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(post.image ? { images: [post.image] } : {}),
    },
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
  const thumb = thumbFor(post);
  const allPosts = getAllPosts();
  const writer = getWriter(post.authorSlug);
  const tocEntries = extractToc(post.content);

  // Related: same category, excluding this post, up to 3
  // Keep learning: same topic first, then same category, newest first.
  const others = allPosts.filter((p) => p.slug !== post.slug);
  const sameTopic = thumb.topic === "other" ? [] : others.filter((p) => thumbFor(p).topic === thumb.topic);
  const related = [...sameTopic, ...others.filter((p) => p.category === post.category && !sameTopic.includes(p))].slice(0, 3);
  const moreTitle =
    thumb.topic === "other"
      ? `More in ${catLabel.charAt(0) + catLabel.slice(1).toLowerCase()}`
      : `Keep learning about ${TOPIC_TITLE[thumb.topic].charAt(0).toLowerCase() + TOPIC_TITLE[thumb.topic].slice(1)}`;

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
    // Honest authorship (2026-07-06): bylines are AI editorial voices, not
    // people, so the schema author is the Organization — never Person. The
    // persona name stays in the visible byline, labeled as an AI voice, with
    // the disclosure living at /writers/[slug] and /experiment.
    author: {
      "@type": "Organization",
      name: "Fader & Knob",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Fader & Knob",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 600,
        height: 60,
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

  // BreadcrumbList — Browse > Field Notes > {category} > {post}
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Field Notes", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 2, name: catLabel },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  // HowTo schema for tone-recipes and settings-guides — H2s become steps.
  const isHowTo = post.category === "tone-recipes" || post.category === "settings-guides";
  const howToLd = isHowTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.title,
        description: post.description,
        step: tocEntries
          .filter((e) => e.level === 2)
          .map((e, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: e.text,
          })),
      }
    : null;

  return (
    <div className="fk-guide">
      {/* JSON-LD: Article + Breadcrumb always; FAQPage and HowTo
          conditionally. Switched from next/script's <Script
          strategy="beforeInteractive"> to plain <script> on 2026-05-12
          because beforeInteractive renders these client-side, which
          makes the SSR HTML schema-empty until JS executes — bad for
          crawlers that don't render. Plain script tags ship inline in
          the SSR HTML, which is what Googlebot and AI engines want. */}
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {howToLd && (
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      )}

      <article>
        <section className="fk-wrap fk-guide-top">
          <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
            <Link href="/blog">Learn</Link>
            <span aria-hidden="true">/</span>
            {thumb.topic === "other" ? (
              <Link href={`/blog#guides:category=${post.category}`}>
                {catLabel.charAt(0) + catLabel.slice(1).toLowerCase()}
              </Link>
            ) : (
              <Link href={`/blog#guides:topic=${thumb.topic}`}>{TOPIC_TITLE[thumb.topic]}</Link>
            )}
          </nav>
          <div className="fk-guide-head">
            <div className="fk-guide-headcopy">
              <h1 className="fk-guide-h1">{post.title}</h1>
              <p className="fk-lead">{post.description}</p>
              {/* The writers are AI voices and are labelled as such. */}
              <p className="fk-caption">
                By <Link href={`/writers/${writer.slug}`} className="fk-link">{post.author}</Link>, an AI
                voice. {formatDate(post.date)}. {post.readingTime.replace(/^(\d+ min) read$/, "$1 read")}.
                {post.updated && <> Updated {formatDate(post.updated)}.</>}
              </p>
            </div>
            <Thumb spec={thumb} gearHeight={230} ratio="4 / 3" />
          </div>
        </section>

        {/* The short version: a numbered summary for quick scanning and for
            AI answer engines to quote. Only when the post supplies it. */}
        {post.takeaways && post.takeaways.length > 0 && (
          <section className="fk-wrap fk-guide-short">
            <div className="fk-tile fk-guide-shorttile" aria-label="Key takeaways">
              <h2 className="fk-t3">The short version</h2>
              <ol>
                {post.takeaways.map((t, i) => (
                  <li key={t}>
                    <span className="fk-data" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Contents rail on the left, the guide on the right. */}
        <section className="fk-wrap fk-guide-body">
          {tocEntries.length > 0 && <ToC entries={tocEntries} />}
          <div className="fk-guide-main">
            <div className="fk-prose">
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

            {/* FAQ: real question and answer pairs so the prose is indexable
                and the FAQPage JSON-LD has a visible counterpart. */}
            {post.faq && post.faq.length > 0 && (
              <section className="fk-guide-faq" aria-labelledby="faq-head">
                <h2 id="faq-head" className="fk-t2">
                  Questions
                </h2>
                <dl>
                  {post.faq.map((f) => (
                    <div key={f.q}>
                      <dt className="fk-t3">{f.q}</dt>
                      <dd className="fk-body fk-muted">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* End-of-guide email capture, where a finished reader lands. */}
            <div className="fk-guide-signup">
              <NewsletterSignup
                variant="banner"
                headline="Get new tone recipes by email"
                subtext="New recipes, settings guides and modeler news in one weekly email. Unsubscribe anytime."
                buttonText="Subscribe"
                source={`blog:${post.slug}`}
                className="post-signup"
              />
            </div>
          </div>
        </section>

        {/* From the recipe archive: auto-matched recipe pages, linking the
            guides into the catalog. Renders nothing when no recipe matches. */}
        <div className="fk-wrap fk-recipe-legacy fk-guide-recipes">
          <RelatedRecipes postTitle={post.title} postTags={post.tags} />
        </div>

        {related.length > 0 && (
          <section className="fk-wrap fk-guide-more">
            <div className="fk-learn-rule">
              <h2 className="fk-t2">{moreTitle}</h2>
              <div className="fk-guide-moregrid">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="fk-card">
                    <Thumb spec={thumbFor(r)} gearHeight={150} />
                    <div className="fk-card-body">
                      <h3 className="fk-t3">{r.title}</h3>
                      <p className="fk-caption">
                        {r.author}. {r.readingTime}.
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
