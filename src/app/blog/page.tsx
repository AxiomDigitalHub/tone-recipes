import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, BLOG_CATEGORIES } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tone deep dives, platform comparisons, artist tone breakdowns, and gear guides for guitar players.",
  openGraph: {
    title: "Blog | ToneRecipes",
    description:
      "Tone deep dives, platform comparisons, artist tone breakdowns, and gear guides.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
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
          className="shrink-0 rounded-full border border-accent bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
        >
          All
        </Link>
        {Object.entries(BLOG_CATEGORIES).map(([key, label]) => (
          <Link
            key={key}
            href={`/blog?category=${key}`}
            className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            {label}
          </Link>
        ))}
      </div>

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
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 md:p-8"
              >
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
