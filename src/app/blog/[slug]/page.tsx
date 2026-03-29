import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  getPostBySlug,
  getPostSlugs,
  getAllPosts,
  BLOG_CATEGORIES,
} from "@/lib/blog";
import { getDefinitionsForPost } from "@/lib/definitions";
import BlogCard from "@/components/blog/BlogCard";
import TableOfContents, { MobileTableOfContents, type TocItem } from "@/components/blog/TableOfContents";

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

  // Related posts: same category, excluding this post, limit 3
  const related = getAllPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": { "@type": "Organization", "name": "Fader & Knob" },
    "datePublished": post.date,
    "publisher": { "@type": "Organization", "name": "Fader & Knob" },
  };

  return (
    <article className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
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

      {/* Post header */}
      <header className="mx-auto max-w-3xl">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${catColor}`}
        >
          {catLabel}
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-muted">{post.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>{post.author}</span>
          <span className="text-border">|</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-border">|</span>
          <span>{post.readingTime}</span>
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

        <hr className="mt-8 border-border" />
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

          {/* Back link */}
          <div className="mx-auto mt-16 max-w-3xl lg:mx-0">
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
