import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllNewsPosts,
  NEWS_CATEGORIES,
  NEWS_CATEGORY_COLORS,
  type NewsCategory,
} from "@/lib/news";

export const metadata: Metadata = {
  title: "Modeler News",
  description:
    "The latest firmware updates, gear announcements, industry news, and tips for guitar modeler players.",
  openGraph: {
    title: "Modeler News | Fader & Knob",
    description:
      "Firmware updates, gear announcements, and tips for guitar modeler players.",
    type: "website",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = getAllNewsPosts();
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Modeler News | Fader & Knob",
    description:
      "The latest firmware updates, gear announcements, industry news, and tips for guitar modeler players.",
    url: "https://faderandknob.com/news",
    publisher: { "@type": "Organization", name: "Fader & Knob" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Modeler News
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Firmware updates, gear announcements, industry trends, and practical
          tips for guitar modeler players.
        </p>
      </section>

      {/* Category filter tabs */}
      <div className="mt-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/news"
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !category
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:border-accent/40 hover:text-accent"
          }`}
        >
          All
        </Link>
        {(
          Object.entries(NEWS_CATEGORIES) as [NewsCategory, string][]
        ).map(([key, label]) => (
          <Link
            key={key}
            href={`/news?category=${key}`}
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
      {category &&
        NEWS_CATEGORIES[category as NewsCategory] && (
          <div className="mt-6 flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              {NEWS_CATEGORIES[category as NewsCategory]}
            </h2>
            <span className="text-sm text-muted">
              ({posts.length} {posts.length === 1 ? "article" : "articles"})
            </span>
          </div>
        )}

      {/* News grid */}
      {posts.length > 0 && (
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const catColor =
              NEWS_CATEGORY_COLORS[post.category] ??
              "bg-accent/15 text-accent";
            const catLabel =
              NEWS_CATEGORIES[post.category as NewsCategory] ??
              post.category;

            return (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-surface transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
              >
                {/* Image placeholder */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-surface-hover">
                  <div className="flex h-full items-center justify-center text-muted/40">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor}`}
                    >
                      {catLabel}
                    </span>
                    <span className="text-xs text-muted">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted">
                    <span>{post.readingTime}</span>
                    {post.source_url &&
                      !post.source_url.includes("faderandknob") && (
                        <span className="truncate">
                          via{" "}
                          {new URL(post.source_url).hostname.replace(
                            "www.",
                            ""
                          )}
                        </span>
                      )}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-border p-16 text-center">
          <p className="text-lg font-semibold text-muted">
            No news articles found
          </p>
          <p className="mt-2 text-sm text-muted">
            {category
              ? "Try selecting a different category."
              : "News articles coming soon."}
          </p>
        </div>
      )}
    </div>
  );
}
