import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  getNewsPostBySlug,
  getNewsSlugs,
  getAllNewsPosts,
  NEWS_CATEGORIES,
  NEWS_CATEGORY_COLORS,
  type NewsCategory,
} from "@/lib/news";
import { getNewsImageSync, getNewsImageCredit } from "@/lib/unsplash";

/* ---------- Static generation ---------- */

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Fader & Knob`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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

/* ---------- Page ---------- */

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) notFound();

  const catLabel =
    NEWS_CATEGORIES[post.category as NewsCategory] ?? post.category;
  const catColor =
    NEWS_CATEGORY_COLORS[post.category] ?? "bg-accent/15 text-accent";

  // Related news: same category, excluding this post, limit 3
  const related = getAllNewsPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  /* ---------- Structured data (JSON-LD) ---------- */

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "Fader & Knob",
      url: "https://faderandknob.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://faderandknob.com/news/${slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-sm text-muted"
      >
        <Link
          href="/news"
          className="transition-colors hover:text-foreground"
        >
          News
        </Link>
        <span>/</span>
        <Link
          href={`/news?category=${post.category}`}
          className="transition-colors hover:text-foreground"
        >
          {catLabel}
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{post.title}</span>
      </nav>

      {/* Post header */}
      <header>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${catColor}`}
        >
          {catLabel}
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-muted">{post.excerpt}</p>

        <div className="mt-6 flex items-center gap-3 text-sm text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-border">|</span>
          <span>{post.readingTime}</span>
          {post.source_url &&
            !post.source_url.includes("faderandknob") && (
              <>
                <span className="text-border">|</span>
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent transition-colors hover:text-accent-hover"
                >
                  Source
                </a>
              </>
            )}
        </div>

        {/* Hero image */}
        <div className="mt-8 relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-surface-hover">
          <Image
            src={getNewsImageSync(post.slug, post.category, post.image_url || undefined)}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
        {(() => {
          const credit = getNewsImageCredit(post.slug, post.category, post.image_url || undefined);
          return credit ? <p className="mt-2 text-[10px] text-muted/40 text-right">{credit}</p> : null;
        })()}
      </header>

      {/* MDX prose content */}
      <div className="prose-dark mx-auto mt-10 max-w-3xl">
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
        />
      </div>

      {/* Source attribution */}
      {post.source_url && !post.source_url.includes("faderandknob") && (
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">
              Originally reported by{" "}
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent transition-colors hover:text-accent-hover"
              >
                {new URL(post.source_url).hostname.replace("www.", "")}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mx-auto mt-8 max-w-3xl">
        <Link
          href="/news"
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
          Back to News
        </Link>
      </div>

      {/* Related news */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Related News
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => {
              const relCatColor =
                NEWS_CATEGORY_COLORS[p.category] ??
                "bg-accent/15 text-accent";
              const relCatLabel =
                NEWS_CATEGORIES[p.category as NewsCategory] ??
                p.category;

              return (
                <Link
                  key={p.slug}
                  href={`/news/${p.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                >
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${relCatColor}`}
                  >
                    {relCatLabel}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">
                    {p.excerpt}
                  </p>
                  <span className="mt-3 text-xs text-muted">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
