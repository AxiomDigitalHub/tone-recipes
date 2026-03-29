import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Clock, MessageSquare } from "lucide-react";
import { getThread, getReplies, getForumCategories } from "@/lib/db/forum";
import ThreadClient from "./ThreadClient";

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const thread = await getThread(slug);

  if (!thread) {
    return { title: "Thread Not Found" };
  }

  const description = thread.body.slice(0, 160);

  return {
    title: `${thread.title} — Forum`,
    description,
    openGraph: {
      title: `${thread.title} — Forum | Fader & Knob`,
      description,
      type: "article",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function ThreadPage({ params }: PageProps) {
  const { slug } = await params;
  const thread = await getThread(slug);
  if (!thread) notFound();

  const [{ replies }, categories] = await Promise.all([
    getReplies(thread.id, { page: 1, limit: 50 }),
    getForumCategories(),
  ]);

  const category = categories.find((c) => c.id === thread.category_id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              href="/community/forum"
              className="transition-colors hover:text-accent"
            >
              Forum
            </Link>
          </li>
          <li aria-hidden="true" className="text-border">
            /
          </li>
          {category && (
            <>
              <li>
                <Link
                  href={`/community/forum/${category.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                /
              </li>
            </>
          )}
          <li className="truncate font-medium text-foreground">
            {thread.title}
          </li>
        </ol>
      </nav>

      {/* Thread header */}
      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {thread.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
              {thread.author?.display_name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <span className="font-medium text-foreground">
              {thread.author?.display_name ?? "Anonymous"}
            </span>
          </div>

          <span className="text-border">|</span>

          {/* Created */}
          <span
            className="flex items-center gap-1"
            title={formatDate(thread.created_at)}
          >
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {timeAgo(thread.created_at)}
          </span>

          <span className="text-border">|</span>

          {/* Views */}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {thread.view_count} view{thread.view_count !== 1 ? "s" : ""}
          </span>

          <span className="text-border">|</span>

          {/* Replies */}
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            {thread.reply_count} repl{thread.reply_count !== 1 ? "ies" : "y"}
          </span>
        </div>
      </header>

      {/* Thread body */}
      <article className="mt-8 rounded-xl border border-border bg-surface p-6">
        <div className="prose-invert max-w-none text-sm leading-relaxed text-foreground/90">
          {thread.body.split("\n").map((paragraph, i) =>
            paragraph.trim() ? (
              <p key={i} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ) : null,
          )}
        </div>
      </article>

      {/* Replies + interactive client section */}
      <ThreadClient
        threadId={thread.id}
        threadSlug={thread.slug}
        isLocked={thread.is_locked}
        initialReplies={replies}
      />
    </div>
  );
}
