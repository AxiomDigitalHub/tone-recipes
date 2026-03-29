"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getRequests,
  createRequest,
  upvoteRequest,
  hasUpvoted,
  type ToneRequest,
} from "@/lib/db/tone-requests";
import {
  ChevronUp,
  Clock,
  CheckCircle2,
  Loader2,
  Music,
  ExternalLink,
  Send,
} from "lucide-react";
import Link from "next/link";

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

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/15 text-yellow-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-500/15 text-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/15 text-green-400",
  },
  declined: {
    label: "Declined",
    className: "bg-zinc-500/15 text-zinc-400",
  },
};

const PART_OPTIONS = [
  "Lead Guitar",
  "Rhythm Guitar",
  "Bass",
  "Synth/Keys",
  "Other",
];

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */

export default function RequestPage() {
  const { user } = useAuth();

  // Queue state
  const [requests, setRequests] = useState<ToneRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"popular" | "newest">("popular");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Upvote tracking
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [votingId, setVotingId] = useState<string | null>(null);

  // Form state
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [part, setPart] = useState("Lead Guitar");
  const [description, setDescription] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const PAGE_SIZE = 20;

  /* ---- Fetch requests --------------------------------------------------- */

  const fetchRequests = useCallback(
    async (reset = false) => {
      const currentOffset = reset ? 0 : offset;
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const data = await getRequests({
          sort,
          limit: PAGE_SIZE,
          offset: currentOffset,
        });

        if (reset) {
          setRequests(data);
          setOffset(PAGE_SIZE);
        } else {
          setRequests((prev) => [...prev, ...data]);
          setOffset((prev) => prev + PAGE_SIZE);
        }

        setHasMore(data.length === PAGE_SIZE);
      } catch {
        // silent
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort, offset],
  );

  // Initial load + reload on sort change
  useEffect(() => {
    fetchRequests(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // Check user votes when requests load
  useEffect(() => {
    if (!user || requests.length === 0) return;

    async function checkVotes() {
      const votes = new Set<string>();
      for (const req of requests) {
        const voted = await hasUpvoted(req.id, user!.id);
        if (voted) votes.add(req.id);
      }
      setUserVotes(votes);
    }

    checkVotes();
  }, [user, requests]);

  /* ---- Upvote handler --------------------------------------------------- */

  async function handleUpvote(requestId: string) {
    if (!user) return;
    setVotingId(requestId);

    try {
      const newCount = await upvoteRequest(requestId, user.id);
      if (newCount !== null) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, upvotes: newCount } : r,
          ),
        );
        setUserVotes((prev) => {
          const next = new Set(prev);
          if (next.has(requestId)) {
            next.delete(requestId);
          } else {
            next.add(requestId);
          }
          return next;
        });
      }
    } catch {
      // silent
    } finally {
      setVotingId(null);
    }
  }

  /* ---- Submit handler --------------------------------------------------- */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!songName.trim() || !artistName.trim()) {
      setSubmitError("Song name and artist are required.");
      return;
    }

    if (!user && !email.trim()) {
      setSubmitError("Please provide your email so we can notify you.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await createRequest({
        song_name: songName.trim(),
        artist_name: artistName.trim(),
        part: part.toLowerCase(),
        description: description.trim() || undefined,
        reference_url: referenceUrl.trim() || undefined,
        requested_by: user?.id,
        requested_by_email: user ? user.email : email.trim(),
      });

      if (result) {
        setSubmitSuccess(true);
        setSongName("");
        setArtistName("");
        setPart("Lead Guitar");
        setDescription("");
        setReferenceUrl("");
        setEmail("");
        // Refresh the list
        fetchRequests(true);
      } else {
        setSubmitError("Failed to submit request. Please try again.");
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Render ----------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15">
          <Music className="h-7 w-7 text-accent" />
        </div>
        <h1
          className="text-3xl font-bold text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Request a Tone
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted">
          Can&apos;t find the tone you&apos;re looking for? Tell us what you
          want to hear and we&apos;ll build it.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_2fr]">
        {/* ---- Request Form ---- */}
        <div className="order-2 lg:order-1">
          <div className="sticky top-24 rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Submit a Request
            </h2>
            <p className="mt-1 text-sm text-muted">
              We&apos;ll add it to the queue and build the recipe.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Song Name */}
              <div>
                <label
                  htmlFor="song-name"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Song Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="song-name"
                  type="text"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  placeholder="e.g. Comfortably Numb"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Artist */}
              <div>
                <label
                  htmlFor="artist-name"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Artist <span className="text-red-400">*</span>
                </label>
                <input
                  id="artist-name"
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="e.g. Pink Floyd"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Part */}
              <div>
                <label
                  htmlFor="part"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Part
                </label>
                <select
                  id="part"
                  value={part}
                  onChange={(e) => setPart(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {PART_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Description{" "}
                  <span className="text-xs text-muted">(optional)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the specific moment or sound, e.g. 'the solo tone at 3:42' or 'the clean intro'"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Reference URL */}
              <div>
                <label
                  htmlFor="reference-url"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Reference URL{" "}
                  <span className="text-xs text-muted">(optional)</span>
                </label>
                <input
                  id="reference-url"
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="YouTube or Spotify link"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Email (only for non-logged-in users) */}
              {!user && (
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-foreground"
                  >
                    Your Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="So we can notify you when it's ready"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Submitting..." : "Submit Request"}
              </button>

              {submitSuccess && (
                <p className="text-sm font-medium text-green-400">
                  Request submitted! It&apos;s now in the queue.
                </p>
              )}
              {submitError && (
                <p className="text-sm font-medium text-red-400">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* ---- Request Queue ---- */}
        <div className="order-1 lg:order-2">
          {/* Sort toggle */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Request Queue
            </h2>
            <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
              <button
                onClick={() => setSort("popular")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === "popular"
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Most Requested
              </button>
              <button
                onClick={() => setSort("newest")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === "newest"
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Newest
              </button>
            </div>
          </div>

          {/* Queue list */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <div className="h-4 w-2/3 animate-pulse rounded bg-border" />
                  <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-border" />
                  <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-border" />
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16">
              <Music className="mb-4 h-10 w-10 text-muted" />
              <p className="text-lg font-semibold text-foreground">
                No requests yet
              </p>
              <p className="mt-1 text-sm text-muted">
                Be the first to request a tone!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const statusCfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
                const voted = userVotes.has(req.id);

                return (
                  <div
                    key={req.id}
                    className="flex gap-4 rounded-xl border border-border bg-surface p-5"
                  >
                    {/* Upvote button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleUpvote(req.id)}
                        disabled={!user || votingId === req.id}
                        title={
                          user
                            ? voted
                              ? "Remove upvote"
                              : "Upvote this request"
                            : "Log in to upvote"
                        }
                        className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg border transition-colors ${
                          voted
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-border text-muted hover:border-accent hover:text-accent"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <ChevronUp className="h-4 w-4" />
                        <span className="text-xs font-bold">{req.upvotes}</span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">
                          {req.song_name}
                        </h3>
                        <span className="text-sm text-muted">
                          by {req.artist_name}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          {req.part}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>

                      {req.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted">
                          {req.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(req.created_at)}
                        </span>

                        {req.reference_url && (
                          <a
                            href={req.reference_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-accent hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Reference
                          </a>
                        )}

                        {req.status === "completed" &&
                          req.completed_recipe_slug && (
                            <Link
                              href={`/recipe/${req.completed_recipe_slug}`}
                              className="flex items-center gap-1 font-medium text-green-400 hover:underline"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              View Recipe
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Load more */}
              {hasMore && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => fetchRequests(false)}
                    disabled={loadingMore}
                    className="rounded-lg border border-border bg-surface px-6 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Login prompt for upvoting */}
          {!user && requests.length > 0 && (
            <p className="mt-4 text-center text-xs text-muted">
              <Link href="/login" className="text-accent hover:underline">
                Log in
              </Link>{" "}
              to upvote requests.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
