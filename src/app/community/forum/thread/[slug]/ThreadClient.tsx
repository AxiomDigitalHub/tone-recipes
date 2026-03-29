"use client";

import { useState, useTransition, useRef } from "react";
import {
  ThumbsUp,
  Flag,
  Lock,
  Send,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createReply } from "@/lib/db/forum";
import type { ForumReply } from "@/types/community";

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
/*  Reply Card                                                                */
/* -------------------------------------------------------------------------- */

function ReplyCard({
  reply,
  onVote,
  onReport,
}: {
  reply: ForumReply;
  onVote: (replyId: string) => void;
  onReport: (replyId: string) => void;
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-surface p-4">
      {/* Author avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
        {reply.author?.display_name?.charAt(0).toUpperCase() ?? "?"}
      </div>

      <div className="min-w-0 flex-1">
        {/* Reply meta */}
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-medium text-foreground">
            {reply.author?.display_name ?? "Anonymous"}
          </span>
          <span className="text-border">|</span>
          <time>{timeAgo(reply.created_at)}</time>
          {reply.is_accepted && (
            <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400">
              Accepted
            </span>
          )}
        </div>

        {/* Body */}
        <div className="mt-2 text-sm leading-relaxed text-foreground/90">
          {reply.body.split("\n").map((paragraph, i) =>
            paragraph.trim() ? (
              <p key={i} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ) : null,
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => onVote(reply.id)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted transition-colors hover:bg-accent/10 hover:text-accent"
            aria-label={`Upvote reply, ${reply.upvotes} upvotes`}
          >
            <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
            {reply.upvotes > 0 && <span>{reply.upvotes}</span>}
          </button>
          <button
            onClick={() => onReport(reply.id)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Report reply"
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ThreadClient                                                              */
/* -------------------------------------------------------------------------- */

interface ThreadClientProps {
  threadId: string;
  threadSlug: string;
  isLocked: boolean;
  initialReplies: ForumReply[];
}

export default function ThreadClient({
  threadId,
  threadSlug,
  isLocked,
  initialReplies,
}: ThreadClientProps) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<ForumReply[]>(initialReplies);
  const [replyBody, setReplyBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleVote = (replyId: string) => {
    if (!user) return;
    // Optimistic upvote toggle
    setReplies((prev) =>
      prev.map((r) =>
        r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r,
      ),
    );
  };

  const handleReport = (replyId: string) => {
    if (!user) return;
    // In a full implementation this would open a report modal
    alert("Report submitted. Our moderators will review this reply.");
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyBody.trim() || isPending) return;

    setError(null);

    // Create optimistic reply
    const optimisticReply: ForumReply = {
      id: `optimistic-${Date.now()}`,
      thread_id: threadId,
      user_id: user.id,
      body: replyBody.trim(),
      is_accepted: false,
      upvotes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        display_name: user.displayName ?? "You",
        username: user.email?.split("@")[0] ?? "user",
        avatar_url: user.avatarUrl ?? null,
      },
    };

    setReplies((prev) => [...prev, optimisticReply]);
    const submittedBody = replyBody.trim();
    setReplyBody("");

    startTransition(async () => {
      try {
        const newReply = await createReply({
          thread_id: threadId,
          user_id: user.id,
          body: submittedBody,
        });

        if (newReply) {
          // Replace optimistic reply with real one
          setReplies((prev) =>
            prev.map((r) => (r.id === optimisticReply.id ? newReply : r)),
          );
        } else {
          // Remove optimistic reply on failure
          setReplies((prev) =>
            prev.filter((r) => r.id !== optimisticReply.id),
          );
          setError("Failed to post reply. Please try again.");
          setReplyBody(submittedBody);
        }
      } catch {
        setReplies((prev) =>
          prev.filter((r) => r.id !== optimisticReply.id),
        );
        setError("Something went wrong. Please try again.");
        setReplyBody(submittedBody);
      }
    });
  };

  return (
    <section className="mt-10" aria-label="Replies">
      {/* Replies heading */}
      <h2 className="text-lg font-semibold text-foreground">
        Replies ({replies.length})
      </h2>

      {/* Reply list */}
      {replies.length > 0 ? (
        <div className="mt-4 space-y-3">
          {replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              onVote={handleVote}
              onReport={handleReport}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">
          No replies yet. Be the first to respond!
        </p>
      )}

      {/* Reply form or locked notice */}
      <div className="mt-8">
        {isLocked ? (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-4 text-sm text-muted">
            <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
            This thread is locked. New replies are not allowed.
          </div>
        ) : user ? (
          <form ref={formRef} onSubmit={handleSubmitReply}>
            <label htmlFor="reply-body" className="sr-only">
              Write a reply
            </label>
            <textarea
              id="reply-body"
              name="body"
              rows={4}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write your reply..."
              required
              minLength={1}
              className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
            {error && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isPending || !replyBody.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                {isPending ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted">
            <a
              href="/login"
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </a>{" "}
            to join the discussion.
          </div>
        )}
      </div>
    </section>
  );
}
