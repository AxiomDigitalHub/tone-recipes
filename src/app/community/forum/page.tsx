import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  Guitar,
  HelpCircle,
  Lightbulb,
  Image,
  Cpu,
  Plus,
  Clock,
  ArrowRight,
} from "lucide-react";
import { getForumCategories, getRecentThreads } from "@/lib/db/forum";
import type { ForumCategory } from "@/types/community";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Community Forum",
  description:
    "Discuss tone recipes, share gear setups, get help dialing in sounds, and connect with fellow guitar players.",
  openGraph: {
    title: "Community Forum | Fader & Knob",
    description:
      "Discuss tone recipes, share gear setups, get help dialing in sounds, and connect with fellow guitar players.",
  },
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  general: MessageSquare,
  gear: Guitar,
  "tone-help": HelpCircle,
  "tips-tricks": Lightbulb,
  "show-tell": Image,
  "platform-specific": Cpu,
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function CategoryIcon({ slug }: { slug: string }) {
  const Icon = CATEGORY_ICONS[slug] ?? MessageSquare;
  return <Icon className="h-6 w-6 text-accent" aria-hidden="true" />;
}

function CategoryCard({ category }: { category: ForumCategory }) {
  return (
    <Link
      href={`/community/forum/${category.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10">
          <CategoryIcon slug={category.slug} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1 text-sm leading-relaxed text-muted line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
          <MessageSquare className="h-3 w-3" aria-hidden="true" />
          {category.thread_count ?? 0} thread
          {(category.thread_count ?? 0) !== 1 ? "s" : ""}
        </span>

        {category.latest_thread ? (
          <span className="flex items-center gap-1.5 truncate pl-3">
            <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{category.latest_thread.title}</span>
            <span className="shrink-0 text-muted/60">
              {timeAgo(category.latest_thread.created_at)}
            </span>
          </span>
        ) : (
          <span className="text-muted/60">No threads yet</span>
        )}
      </div>
    </Link>
  );
}

export default async function ForumPage() {
  const [categories, recentThreads] = await Promise.all([
    getForumCategories(),
    getRecentThreads(5),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Community Forum
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Discuss tone recipes, share your rig, get help dialing in sounds,
            and connect with fellow guitar players.
          </p>
        </div>
        <Link
          href="/community/forum/new"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-background transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Thread
        </Link>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        {/* Category grid */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Categories
          </h2>

          {categories.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border p-12 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-muted/40" />
              <p className="mt-3 font-semibold text-muted">
                Forum categories coming soon
              </p>
              <p className="mt-1 text-sm text-muted/70">
                Check back shortly -- the community forum is being set up.
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity sidebar */}
        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Recent Activity
          </h2>

          {recentThreads.length > 0 ? (
            <ul className="mt-4 space-y-3" role="list">
              {recentThreads.map((thread) => (
                <li key={thread.id}>
                  <Link
                    href={`/community/forum/thread/${thread.slug}`}
                    className="group block rounded-lg border border-border bg-surface p-4 transition-all hover:border-accent/40"
                  >
                    <p className="text-sm font-medium text-foreground transition-colors group-hover:text-accent line-clamp-2">
                      {thread.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                      {thread.category && (
                        <>
                          <span className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">
                            {thread.category.name}
                          </span>
                          <span className="text-border">|</span>
                        </>
                      )}
                      <span>{thread.author?.display_name ?? "Anonymous"}</span>
                      <span className="text-border">|</span>
                      <span>{timeAgo(thread.created_at)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted/60">
              No recent activity yet.
            </p>
          )}

          {recentThreads.length > 0 && (
            <Link
              href="/community/forum/general"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View all threads
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
