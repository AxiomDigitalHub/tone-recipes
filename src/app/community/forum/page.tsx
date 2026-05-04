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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Forum",
  description:
    "Discuss tone recipes, share gear setups, get help dialing in sounds, and connect with fellow guitar players.",
  openGraph: {
    title: "Community Forum | Fader & Knob",
    description:
      "Discuss tone recipes, share gear setups, get help dialing in sounds, and connect with fellow guitar players.",
    type: "website",
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
      className="forum-cat-card"
    >
      <div className="forum-cat-card-head">
        <span className="forum-cat-icon" aria-hidden>
          <CategoryIcon slug={category.slug} />
        </span>
        <div className="forum-cat-card-body">
          <h3 className="display forum-cat-title">{category.name}</h3>
          {category.description && (
            <p className="forum-cat-dek">{category.description}</p>
          )}
        </div>
      </div>
      <div className="forum-cat-foot">
        <span className="forum-cat-count">
          <MessageSquare className="h-3 w-3" aria-hidden />
          {category.thread_count ?? 0} thread
          {(category.thread_count ?? 0) !== 1 ? "s" : ""}
        </span>
        {category.latest_thread ? (
          <span className="forum-cat-latest">
            <Clock className="h-3 w-3" aria-hidden />
            <span className="forum-cat-latest-title">
              {category.latest_thread.title}
            </span>
            <span className="forum-cat-latest-when">
              {timeAgo(category.latest_thread.created_at)}
            </span>
          </span>
        ) : (
          <span className="forum-cat-latest-empty">No threads yet</span>
        )}
      </div>
    </Link>
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export default async function ForumPage() {
  const [categories, recentThreads] = await Promise.all([
    withTimeout(getForumCategories(), 8000, []),
    withTimeout(getRecentThreads(5), 8000, []),
  ]);

  return (
    <div className="container">
      <div className="recipe">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/community">Community</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Forum</span>
        </div>

        <header className="forum-head">
          <div>
            <div className="recipe-issue">
              <span className="pill">Forum</span>
            </div>
            <h1 className="recipe-title display">Community forum</h1>
            <p className="recipe-summary">
              Discuss tone recipes, share your rig, get help dialing in
              sounds, and connect with other players. Every thread is
              searchable, so the advice here builds into a lasting
              resource.
            </p>
          </div>
          <Link
            href="/community/forum/new"
            className="hero-cta hero-cta-primary forum-new-btn"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New thread
          </Link>
        </header>

        <div className="forum-grid">
          <section className="forum-cats-col">
            <div className="how-head">
              <h2 className="display">Categories</h2>
              <span className="section-rule" aria-hidden="true" />
            </div>
            {categories.length > 0 ? (
              <div className="forum-cats">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="dashboard-notif-empty">
                <MessageSquare
                  className="dashboard-notif-empty-icon"
                  aria-hidden
                />
                <p className="dashboard-notif-empty-title">
                  Forum categories coming soon
                </p>
                <p className="dashboard-notif-empty-dek">
                  Check back shortly — the community forum is being set up.
                </p>
              </div>
            )}
          </section>

          <aside className="forum-recent-col">
            <div className="how-head">
              <h2 className="display">Recent activity</h2>
              <span className="section-rule" aria-hidden="true" />
            </div>
            {recentThreads.length > 0 ? (
              <ul className="forum-recent-list" role="list">
                {recentThreads.map((thread) => (
                  <li key={thread.id} className="forum-recent-row">
                    <Link
                      href={`/community/forum/thread/${thread.slug}`}
                      className="forum-recent-link"
                    >
                      <p className="forum-recent-title">{thread.title}</p>
                      <div className="forum-recent-meta">
                        {thread.category && (
                          <span className="forum-recent-cat">
                            {thread.category.name}
                          </span>
                        )}
                        <span>
                          <em>{thread.author?.display_name ?? "Anonymous"}</em>
                        </span>
                        <span>·</span>
                        <span>{timeAgo(thread.created_at)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="forum-recent-empty">
                <em>No recent activity yet.</em>
              </p>
            )}
            {recentThreads.length > 0 && (
              <Link
                href="/community/forum/general"
                className="forum-recent-all"
              >
                View all threads
                <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
