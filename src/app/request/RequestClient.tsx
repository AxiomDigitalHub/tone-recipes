"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getRequests,
  createRequest,
  upvoteRequest,
  hasUpvoted,
  type ToneRequest,
} from "@/lib/db/tone-requests";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
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

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
};

const PART_OPTIONS = ["Lead Guitar", "Rhythm Guitar", "Bass", "Synth/Keys", "Other"];
const PAGE_SIZE = 20;

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RequestClient() {
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

  /* ---- Fetch ---- */

  const fetchRequests = useCallback(
    async (reset = false) => {
      const currentOffset = reset ? 0 : offset;
      if (reset) setLoading(true);
      else setLoadingMore(true);
      try {
        const data = await getRequests({ sort, limit: PAGE_SIZE, offset: currentOffset });
        if (reset) {
          setRequests(data);
          setOffset(PAGE_SIZE);
        } else {
          setRequests((prev) => [...prev, ...data]);
          setOffset((prev) => prev + PAGE_SIZE);
        }
        setHasMore(data.length === PAGE_SIZE);
      } catch {
        // silent — same as production
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort, offset],
  );

  useEffect(() => {
    fetchRequests(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    if (!user || requests.length === 0) return;
    let cancelled = false;
    (async () => {
      const votes = new Set<string>();
      for (const req of requests) {
        const voted = await hasUpvoted(req.id, user.id);
        if (voted) votes.add(req.id);
      }
      if (!cancelled) setUserVotes(votes);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, requests]);

  /* ---- Upvote ---- */

  async function handleUpvote(requestId: string) {
    if (!user) return;
    setVotingId(requestId);
    try {
      const newCount = await upvoteRequest(requestId, user.id);
      if (newCount !== null) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, upvotes: newCount } : r)),
        );
        setUserVotes((prev) => {
          const next = new Set(prev);
          if (next.has(requestId)) next.delete(requestId);
          else next.add(requestId);
          return next;
        });
      }
    } catch {
      // silent
    } finally {
      setVotingId(null);
    }
  }

  /* ---- Submit ---- */

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

  /* ---- Render ---- */

  return (
    <div className="container">
      <div className="request-page">
        <div className="recipe-crumbs">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>Request a tone</span>
        </div>

        <header className="request-head">
          <div className="recipe-issue">
            <span className="pill">Open queue</span>
            <span>·</span>
            <span>Submit · upvote · build</span>
          </div>
          <h1 className="display request-title">Request a tone</h1>
          <p className="request-dek">
            Can&apos;t find the tone you&apos;re looking for? File a request, watch
            the community upvote it, and we&apos;ll cut a verified recipe.
          </p>
        </header>

        <div className="request-grid">
          {/* Form */}
          <aside className="request-form-col">
            <div className="auth-card">
              <header className="auth-card-head">
                <h2 className="display auth-title">Submit a request</h2>
                <p className="auth-sub">We&apos;ll add it to the queue and build the recipe.</p>
              </header>

              <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-field">
                  <span className="auth-label">
                    Song <span style={{ color: "var(--tape)" }}>*</span>
                  </span>
                  <input
                    type="text"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    placeholder="e.g. Comfortably Numb"
                    required
                    className="auth-input"
                  />
                </label>

                <label className="auth-field">
                  <span className="auth-label">
                    Artist <span style={{ color: "var(--tape)" }}>*</span>
                  </span>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g. Pink Floyd"
                    required
                    className="auth-input"
                  />
                </label>

                <label className="auth-field">
                  <span className="auth-label">Part</span>
                  <select
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                    className="auth-input"
                  >
                    {PART_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="auth-field">
                  <span className="auth-label">
                    Description <span style={{ opacity: 0.6 }}>(optional)</span>
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="The specific moment or sound — e.g. 'the solo at 3:42' or 'the clean intro'"
                    rows={3}
                    className="auth-input"
                  />
                </label>

                <label className="auth-field">
                  <span className="auth-label">
                    Reference URL <span style={{ opacity: 0.6 }}>(optional)</span>
                  </span>
                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="YouTube or Spotify link"
                    className="auth-input"
                  />
                </label>

                {!user && (
                  <label className="auth-field">
                    <span className="auth-label">
                      Your email <span style={{ color: "var(--tape)" }}>*</span>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="So we can notify you when it's ready"
                      required
                      className="auth-input"
                    />
                  </label>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="hero-cta hero-cta-primary auth-submit"
                >
                  {submitting ? "Submitting…" : "Submit request"}
                </button>

                {submitSuccess && (
                  <p className="request-flash request-flash-ok">
                    Request submitted — it&apos;s now in the queue.
                  </p>
                )}
                {submitError && <p className="request-flash request-flash-err">{submitError}</p>}
              </form>
            </div>
          </aside>

          {/* Queue */}
          <section className="request-queue-col">
            <div className="request-queue-head">
              <h2 className="display request-queue-title">The queue</h2>
              <div className="request-sort">
                <button
                  type="button"
                  className={`request-sort-btn ${sort === "popular" ? "is-active" : ""}`}
                  onClick={() => setSort("popular")}
                >
                  Most requested
                </button>
                <button
                  type="button"
                  className={`request-sort-btn ${sort === "newest" ? "is-active" : ""}`}
                  onClick={() => setSort("newest")}
                >
                  Newest
                </button>
              </div>
            </div>

            {loading ? (
              <div className="request-list">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="request-card request-card-skeleton" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="request-empty">
                <p className="display request-empty-title">No requests yet</p>
                <p className="request-empty-sub">Be the first to request a tone.</p>
              </div>
            ) : (
              <div className="request-list">
                {requests.map((req) => {
                  const voted = userVotes.has(req.id);
                  const statusLabel = STATUS_LABEL[req.status] ?? STATUS_LABEL.pending;
                  return (
                    <article key={req.id} className="request-card">
                      <button
                        type="button"
                        onClick={() => handleUpvote(req.id)}
                        disabled={!user || votingId === req.id}
                        className={`request-vote ${voted ? "is-voted" : ""}`}
                        title={
                          user
                            ? voted
                              ? "Remove upvote"
                              : "Upvote this request"
                            : "Log in to upvote"
                        }
                      >
                        <span className="request-vote-arrow" aria-hidden>
                          ▲
                        </span>
                        <span className="request-vote-count">{req.upvotes}</span>
                      </button>

                      <div className="request-card-body">
                        <div className="request-card-titles">
                          <h3 className="request-card-title">{req.song_name}</h3>
                          <span className="request-card-artist">by {req.artist_name}</span>
                        </div>

                        <div className="request-card-meta">
                          <span className="pill request-pill-part">{req.part}</span>
                          <span className={`pill request-pill-status request-status-${req.status}`}>
                            {statusLabel}
                          </span>
                        </div>

                        {req.description && (
                          <p className="request-card-desc">{req.description}</p>
                        )}

                        <div className="request-card-foot">
                          <span>{timeAgo(req.created_at)}</span>
                          {req.reference_url && (
                            <a
                              href={req.reference_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="request-card-link"
                            >
                              Reference ↗
                            </a>
                          )}
                          {req.status === "completed" && req.completed_recipe_slug && (
                            <Link
                              href={`/recipe/${req.completed_recipe_slug}`}
                              className="request-card-link request-card-link-strong"
                            >
                              View recipe →
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}

                {hasMore && (
                  <div className="request-loadmore">
                    <button
                      type="button"
                      onClick={() => fetchRequests(false)}
                      disabled={loadingMore}
                      className="hero-cta hero-cta-secondary"
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user && requests.length > 0 && (
              <p className="request-login-hint">
                <Link href="/login" className="auth-link auth-link-strong">
                  Log in
                </Link>{" "}
                to upvote requests.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
