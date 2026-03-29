"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getComments, addComment, voteOnComment } from "@/lib/db/comments";
import type { Comment } from "@/types/community";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface CommentSectionProps {
  recipeSlug: string;
}

interface CommentNode extends Comment {
  replies: CommentNode[];
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

function buildTree(comments: Comment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  // Create nodes
  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  // Build tree
  for (const comment of comments) {
    const node = map.get(comment.id)!;
    if (comment.parent_id) {
      const parent = map.get(comment.parent_id);
      if (parent) {
        parent.replies.push(node);
      } else {
        // Orphaned reply — treat as root
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function getEffectiveDepth(depth: number): number {
  return Math.min(depth, 3);
}

/* -------------------------------------------------------------------------- */
/*  Loading Skeleton                                                          */
/* -------------------------------------------------------------------------- */

function CommentSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-surface" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-surface" />
            <div className="h-4 w-full rounded bg-surface" />
            <div className="h-4 w-3/4 rounded bg-surface" />
            <div className="flex gap-4">
              <div className="h-3 w-12 rounded bg-surface" />
              <div className="h-3 w-12 rounded bg-surface" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Comment Form                                                              */
/* -------------------------------------------------------------------------- */

function CommentForm({
  onSubmit,
  placeholder,
  autoFocus = false,
  onCancel,
}: {
  onSubmit: (body: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setBody("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder ?? "Add a comment..."}
        rows={3}
        className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Post"
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Single Comment                                                            */
/* -------------------------------------------------------------------------- */

function CommentItem({
  comment,
  depth,
  recipeSlug,
  onCommentAdded,
}: {
  comment: CommentNode;
  depth: number;
  recipeSlug: string;
  onCommentAdded: (comment: Comment) => void;
}) {
  const { user } = useAuth();
  const [replyOpen, setReplyOpen] = useState(false);
  const [voteCounts, setVoteCounts] = useState({
    up: comment.upvotes,
    down: comment.downvotes,
  });
  const [userVote, setUserVote] = useState<"up" | "down" | null>(
    comment.user_vote ?? null,
  );
  const [voting, setVoting] = useState(false);

  const effectiveDepth = getEffectiveDepth(depth);
  const indentClass =
    effectiveDepth === 0
      ? ""
      : effectiveDepth === 1
        ? "ml-6 sm:ml-8"
        : effectiveDepth === 2
          ? "ml-12 sm:ml-16"
          : "ml-12 sm:ml-16";

  const handleVote = async (type: "up" | "down") => {
    if (!user || voting) return;
    setVoting(true);

    // Optimistic update
    const prevVote = userVote;
    const prevCounts = { ...voteCounts };

    if (userVote === type) {
      // Toggling off — not supported by backend, but keep UI consistent
      setUserVote(null);
      setVoteCounts((c) => ({
        ...c,
        [type]: c[type === "up" ? "up" : "down"] - 1,
      }));
    } else {
      if (userVote) {
        // Switching vote
        setVoteCounts((c) => ({
          up: c.up + (type === "up" ? 1 : -1),
          down: c.down + (type === "down" ? 1 : -1),
        }));
      } else {
        setVoteCounts((c) => ({
          ...c,
          [type]: c[type === "up" ? "up" : "down"] + 1,
        }));
      }
      setUserVote(type);
    }

    const success = await voteOnComment(comment.id, user.id, type);
    if (!success) {
      // Rollback
      setUserVote(prevVote);
      setVoteCounts(prevCounts);
    }

    setVoting(false);
  };

  const handleReplySubmit = async (body: string) => {
    if (!user) return;
    const newComment = await addComment({
      recipe_slug: recipeSlug,
      user_id: user.id,
      parent_id: comment.id,
      body,
    });
    if (newComment) {
      onCommentAdded(newComment);
      setReplyOpen(false);
    }
  };

  if (comment.is_deleted) {
    return (
      <div className={indentClass}>
        <div className="py-2">
          <p className="text-sm italic text-muted">[deleted]</p>
        </div>
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            depth={depth + 1}
            recipeSlug={recipeSlug}
            onCommentAdded={onCommentAdded}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={indentClass}>
      <div
        className={`py-3 ${depth > 0 ? "border-l-2 border-border pl-4" : ""}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">
            {comment.author?.display_name ?? comment.author?.username ?? "Anonymous"}
          </span>
          <span className="text-xs text-muted">
            {timeAgo(comment.created_at)}
          </span>
        </div>

        {/* Body */}
        <p className="text-sm text-foreground whitespace-pre-wrap mb-2">
          {comment.body}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleVote("up")}
            disabled={!user || voting}
            className={`inline-flex items-center gap-1 text-xs transition-colors ${
              userVote === "up"
                ? "text-accent"
                : "text-muted hover:text-foreground"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Upvote"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {voteCounts.up > 0 && <span>{voteCounts.up}</span>}
          </button>

          <button
            type="button"
            onClick={() => handleVote("down")}
            disabled={!user || voting}
            className={`inline-flex items-center gap-1 text-xs transition-colors ${
              userVote === "down"
                ? "text-red-400"
                : "text-muted hover:text-foreground"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Downvote"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {voteCounts.down > 0 && <span>{voteCounts.down}</span>}
          </button>

          {user && depth < 3 && (
            <button
              type="button"
              onClick={() => setReplyOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Reply
            </button>
          )}
        </div>

        {/* Inline reply form */}
        {replyOpen && user && (
          <div className="mt-3">
            <CommentForm
              onSubmit={handleReplySubmit}
              placeholder={`Reply to ${comment.author?.display_name ?? "this comment"}...`}
              autoFocus
              onCancel={() => setReplyOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          depth={depth + 1}
          recipeSlug={recipeSlug}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export default function CommentSection({ recipeSlug }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const data = await getComments(recipeSlug);
      setComments(data);
      setError(null);
    } catch {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [recipeSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentAdded = useCallback((newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
  }, []);

  const handleTopLevelSubmit = async (body: string) => {
    if (!user) return;
    const newComment = await addComment({
      recipe_slug: recipeSlug,
      user_id: user.id,
      body,
    });
    if (newComment) {
      handleCommentAdded(newComment);
    }
  };

  const tree = buildTree(comments);

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Comments</h3>

      {/* Top-level form */}
      {user ? (
        <CommentForm onSubmit={handleTopLevelSubmit} />
      ) : (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
          <a href="/login" className="text-accent hover:underline">
            Sign in
          </a>{" "}
          to leave a comment.
        </div>
      )}

      {/* Content */}
      {loading ? (
        <CommentSkeleton />
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : tree.length === 0 ? (
        <p className="text-sm text-muted py-4">
          No comments yet — be the first!
        </p>
      ) : (
        <div className="space-y-1">
          {tree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              recipeSlug={recipeSlug}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      )}
    </section>
  );
}
