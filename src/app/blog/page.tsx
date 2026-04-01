import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, BLOG_CATEGORIES } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tone deep dives, platform comparisons, artist tone breakdowns, and gear guides for guitar players.",
  openGraph: {
    title: "Blog | Fader & Knob",
    description:
      "Tone deep dives, platform comparisons, artist tone breakdowns, and gear guides.",
    type: "website",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;
  const featured = category ? [] : posts.filter((p) => p.featured);
  const rest = category ? posts : posts.filter((p) => !p.featured);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Fader & Knob Blog",
    "description": "Guitar tone guides, signal chain theory, and gear comparisons.",
    "url": "https://faderandknob.com/blog",
    "publisher": { "@type": "Organization", "name": "Fader & Knob" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Tone deep dives, platform comparisons, artist breakdowns, and
          practical guides for dialing in the sounds you hear.
        </p>
      </section>

      {/* Category filter chips */}
      <div className="mt-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/blog"
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !category
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:border-accent/40 hover:text-accent"
          }`}
        >
          All
        </Link>
        {Object.entries(BLOG_CATEGORIES).map(([key, label]) => (
          <Link
            key={key}
            href={`/blog?category=${key}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === key
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-accent/40 hover:text-accent"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Active filter label */}
      {category && BLOG_CATEGORIES[category as keyof typeof BLOG_CATEGORIES] && (
        <div className="mt-6 flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {BLOG_CATEGORIES[category as keyof typeof BLOG_CATEGORIES]}
          </h2>
          <span className="text-sm text-muted">
            ({posts.length} {posts.length === 1 ? "post" : "posts"})
          </span>
        </div>
      )}

      {/* Featured posts */}
      {featured.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Featured
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
              >
                {post.image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-hover">
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <span className="w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                    Featured
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-5 text-xs text-muted">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-border">|</span>
                    <span>{post.readingTime}</span>
                    <span className="text-border">|</span>
                    <span>{post.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <section className="mt-12">
          {featured.length > 0 && (
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              All Posts
            </h2>
          )}
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-border p-16 text-center">
          <p className="text-lg font-semibold text-muted">
            Blog posts coming soon
          </p>
          <p className="mt-2 text-sm text-muted">
            Articles about tone building, platform comparisons, and artist
            breakdowns.
          </p>
        </div>
      )}
    </div>
  );
}
