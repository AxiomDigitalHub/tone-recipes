import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Image from "next/image";
import {
  getPostBySlug,
  getPostSlugs,
  getAllPosts,
  BLOG_CATEGORIES,
} from "@/lib/blog";
import { getDefinitionsForPost } from "@/lib/definitions";
import { getWriter } from "@/lib/writers";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import TableOfContents, { MobileTableOfContents, type TocItem } from "@/components/blog/TableOfContents";

/* ---------- FAQ extractor ---------- */

function extractFaqItems(
  content: string
): Array<{ question: string; answer: string }> {
  // Find the FAQ section by looking for ## FAQ or ## Frequently Asked Questions
  const faqSectionRegex =
    /^##\s+(?:FAQ|Frequently Asked Questions)\s*$/im;
  const faqMatch = faqSectionRegex.exec(content);
  if (!faqMatch) return [];

  // Get content after the FAQ heading, up to the next H2 or end of string
  const afterFaq = content.slice(faqMatch.index + faqMatch[0].length);
  const nextH2 = afterFaq.search(/^##\s+/m);
  const faqContent = nextH2 !== -1 ? afterFaq.slice(0, nextH2) : afterFaq;

  // Extract H3 headings as questions and the first paragraph after each as answers
  const items: Array<{ question: string; answer: string }> = [];
  const h3Regex = /^###\s+(.+)$/gm;
  let h3Match;
  const h3Positions: Array<{ question: string; index: number }> = [];

  while ((h3Match = h3Regex.exec(faqContent)) !== null) {
    h3Positions.push({
      question: h3Match[1].replace(/\*\*/g, "").replace(/`/g, "").trim(),
      index: h3Match.index + h3Match[0].length,
    });
  }

  for (let i = 0; i < h3Positions.length; i++) {
    const start = h3Positions[i].index;
    const nextStart =
      i + 1 < h3Positions.length
        ? faqContent.lastIndexOf("###", h3Positions[i + 1].index)
        : faqContent.length;
    const sectionText = faqContent.slice(start, nextStart);

    // Extract first non-empty paragraph
    const paragraphs = sectionText
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && !p.startsWith("#"));

    if (paragraphs.length > 0) {
      items.push({
        question: h3Positions[i].question,
        answer: paragraphs[0],
      });
    }
  }

  return items;
}

/* ---------- Heading extractor ---------- */

function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, "").replace(/`/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    items.push({ id, text, level });
  }
  return items;
}

/* ---------- Static generation ---------- */

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | Fader & Knob`,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

/* ---------- Date formatter ---------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ---------- Category badge colour map ---------- */

const categoryColors: Record<string, string> = {
  "signal-chain": "bg-blue-500/15 text-blue-400",
  "platform-guide": "bg-purple-500/15 text-purple-400",
  "artist-tone": "bg-amber-500/15 text-amber-400",
  "tone-recipes": "bg-orange-500/15 text-orange-400",
  "settings-guides": "bg-teal-500/15 text-teal-400",
  "quick-fixes": "bg-rose-500/15 text-rose-400",
  gear: "bg-emerald-500/15 text-emerald-400",
  effects: "bg-pink-500/15 text-pink-400",
  workflow: "bg-cyan-500/15 text-cyan-400",
};

/* ---------- Page ---------- */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const catLabel = BLOG_CATEGORIES[post.category] ?? post.category;
  const catColor =
    categoryColors[post.category] ?? "bg-accent/15 text-accent";

  const headings = extractHeadings(post.content);
  const definitions = getDefinitionsForPost(post.tags, post.category);
  const writer = getWriter(post.authorSlug);

  // Related posts: same category, excluding this post, limit 3
  const related = getAllPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  /* ---------- Structured data (JSON-LD) ---------- */

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Fader & Knob",
      url: "https://faderandknob.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://faderandknob.com/blog/${slug}`,
    },
  };

  // HowTo schema for tone-recipes and settings-guides
  const isHowTo =
    post.category === "tone-recipes" || post.category === "settings-guides";
  const howToJsonLd = isHowTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.title,
        description: post.description,
        step: headings
          .filter((h) => h.level === 2)
          .map((h, i) => ({
            "@type": "HowToStep",
            name: h.text,
            position: i + 1,
          })),
      }
    : null;

  // FAQ schema when post contains an FAQ section
  const faqItems = extractFaqItems(post.content);
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-sm text-muted"
      >
        <Link href="/blog" className="transition-colors hover:text-foreground">
          Blog
        </Link>
        <span>/</span>
        <Link
          href={`/blog?category=${post.category}`}
          className="transition-colors hover:text-foreground"
        >
          {catLabel}
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{post.title}</span>
      </nav>

      {/* Post header — split layout: text left, image right */}
      <header className={post.image ? "grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start" : ""}>
        <div>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${catColor}`}
          >
            {catLabel}
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-muted">{post.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-border">
              {writer.image ? (
                <Image
                  src={writer.image}
                  alt={writer.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent/10 text-sm font-bold text-accent">
                  {writer.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {writer.name}
                {writer.title && (
                  <span className="ml-2 font-normal text-muted">
                    {writer.title}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="text-border">|</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hero image — right column on desktop, below header on mobile */}
        {post.image && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-hover lg:aspect-square">
            <Image
              src={post.image}
              alt={post.imageAlt ?? post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 400px"
              priority
            />
          </div>
        )}

        <hr className="mt-4 border-border lg:col-span-full" />
      </header>

      {/* Mobile TOC (collapsible, shown below header on small screens) */}
      {headings.length >= 3 && (
        <div className="mt-8">
          <MobileTableOfContents items={headings} />
        </div>
      )}

      {/* Two-column layout: sticky TOC left, content right */}
      <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10 xl:grid-cols-[260px_1fr]">
        {/* Desktop sticky TOC sidebar */}
        {headings.length >= 3 && (
          <aside className="hidden lg:block">
            <TableOfContents items={headings} />
          </aside>
        )}
        {/* If no headings, skip the sidebar column */}
        {headings.length < 3 && <div className="hidden lg:block" />}

        {/* Main content column */}
        <div>
          {/* MDX prose content */}
          <div className="prose-dark mx-auto max-w-3xl lg:mx-0">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                },
              }}
            />
          </div>

          {/* Definitions / Glossary */}
          {definitions.length > 0 && (
            <section className="mx-auto mt-16 max-w-3xl lg:mx-0">
              <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
                <h2 className="mb-4 text-lg font-bold">Key Terms</h2>
                <dl className="space-y-4">
                  {definitions.map((def) => (
                    <div key={def.term}>
                      <dt className="text-sm font-semibold text-accent">
                        {def.term}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-muted">
                        {def.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {/* Writer bio card */}
          {writer.slug !== "fader-and-knob" && (
            <div className="mx-auto mt-16 max-w-3xl lg:mx-0">
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 md:p-6">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border">
                  {writer.image ? (
                    <Image
                      src={writer.image}
                      alt={writer.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent/10 text-lg font-bold text-accent">
                      {writer.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{writer.name}</p>
                  {writer.title && (
                    <p className="text-sm text-accent">{writer.title}</p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {writer.bio}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Newsletter signup */}
          <div className="mx-auto mt-12 max-w-3xl lg:mx-0">
            <NewsletterSignup variant="inline" />
          </div>

          {/* Back link */}
          <div className="mx-auto mt-8 max-w-3xl lg:mx-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl border-t border-border pt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Related Posts
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
