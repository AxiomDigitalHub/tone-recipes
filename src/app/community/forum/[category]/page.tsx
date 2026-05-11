import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MessageSquare,
  Pin,
  Lock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  getForumCategories,
  getThreadsByCategory,
} from "@/lib/db/forum";
import type { ForumThread } from "@/types/community";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getForumCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const description =
    category.description ??
    `Browse threads in the ${category.name} forum category.`;

  return {
    title: `${category.name} — Forum`,
    description,
    openGraph: {
      title: `${category.name} — Forum | Fader & Knob`,
      description,
      type: "website",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Thread Row                                                                */
/* -------------------------------------------------------------------------- */

function ThreadRow({ thread }: { thread: ForumThread }) {
  const lastActivity = thread.last_reply_at ?? thread.created_at;

  return (
    <Link
      href={`/community/forum/thread/${thread.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-[var(--ink)]/15 bg-[var(--paper-2)] px-4 py-3.5 transition-all hover:border-[var(--amber)]/40 hover:shadow-md hover:shadow-accent/5"
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--amber)]/10 text-sm font-bold text-[var(--amber-2)]">
        {thread.author?.display_name?.charAt(0).toUpperCase() ?? "?"}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {thread.is_pinned && (
            <Pin
              className="h-3.5 w-3.5 shrink-0 text-[var(--amber-2)]"
              aria-label="Pinned"
            />
          )}
          {thread.is_locked && (
            <Lock
              className="h-3.5 w-3.5 shrink-0 text-[var(--ink-muted)]"
              aria-label="Locked"
            />
          )}
          <h3 className="truncate font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--amber-2)]">
            {thread.title}
          </h3>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--ink-muted)]">
          <span>{thread.author?.display_name ?? "Anonymous"}</span>
          <span className="text-border">|</span>
          <span>{timeAgo(thread.created_at)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden shrink-0 items-center gap-5 text-xs text-[var(--ink-muted)] sm:flex">
        <span
          className="flex items-center gap-1"
          title={`${thread.reply_count} replies`}
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          {thread.reply_count}
        </span>
        <span
          className="flex items-center gap-1"
          title={`${thread.view_count} views`}
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          {thread.view_count}
        </span>
        <span className="w-16 text-right" title="Last activity">
          {timeAgo(lastActivity)}
        </span>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const THREADS_PER_PAGE = 20;

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;

  // Resolve category
  const categories = await getForumCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { threads, total } = await getThreadsByCategory(categorySlug, {
    page: currentPage,
    limit: THREADS_PER_PAGE,
  });

  const totalPages = Math.max(1, Math.ceil(total / THREADS_PER_PAGE));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--ink-muted)]">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              href="/community/forum"
              className="transition-colors hover:text-[var(--amber-2)]"
            >
              Forum
            </Link>
          </li>
          <li aria-hidden="true" className="text-border">
            /
          </li>
          <li className="font-medium text-[var(--ink)]">{category.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-[var(--ink-muted)]">{category.description}</p>
          )}
        </div>
        <Link
          href={`/community/forum/new?category=${categorySlug}`}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[var(--amber)] px-4 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--amber)]/90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Thread
        </Link>
      </div>

      {/* Thread list */}
      <div className="mt-8 space-y-2">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--ink)]/15 p-16 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-[var(--ink-faint)]" />
            <p className="mt-3 text-lg font-semibold text-[var(--ink-muted)]">
              No threads yet -- start the conversation!
            </p>
            <Link
              href={`/community/forum/new?category=${categorySlug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--amber)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--amber)]/90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create the first thread
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Thread pagination"
          className="mt-8 flex items-center justify-center gap-2"
        >
          {currentPage > 1 ? (
            <Link
              href={`/community/forum/${categorySlug}?page=${currentPage - 1}`}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--ink)]/15 px-3 text-sm text-[var(--ink-muted)] transition-colors hover:border-[var(--amber)]/40 hover:text-[var(--amber-2)]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </Link>
          ) : (
            <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-lg border border-[var(--ink)]/15 px-3 text-sm text-[var(--ink-faint)]">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </span>
          )}

          <span className="px-3 text-sm text-[var(--ink-muted)]">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={`/community/forum/${categorySlug}?page=${currentPage + 1}`}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--ink)]/15 px-3 text-sm text-[var(--ink-muted)] transition-colors hover:border-[var(--amber)]/40 hover:text-[var(--amber-2)]"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-lg border border-[var(--ink)]/15 px-3 text-sm text-[var(--ink-faint)]">
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
