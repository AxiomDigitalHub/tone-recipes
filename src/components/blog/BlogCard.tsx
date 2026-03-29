import Link from "next/link";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog";

/** Category badge colour map */
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const colors = categoryColors[post.category] ?? "bg-accent/15 text-accent";
  const label = BLOG_CATEGORIES[post.category] ?? post.category;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      {/* Category badge */}
      <span
        className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}
      >
        {label}
      </span>

      {/* Title */}
      <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors group-hover:text-accent line-clamp-2">
        {post.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
        {post.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted">
        <span>{formatDate(post.date)}</span>
        <span className="text-border">|</span>
        <span>{post.readingTime}</span>
        <span className="text-border">|</span>
        <span>{post.author}</span>
      </div>
    </Link>
  );
}
