"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { createBrowserClient, isSupabaseConfigured } from "@/lib/db/client";
import {
  getRequests,
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

/** null limit/remaining = unlimited (admin roles). */
interface RequestQuota {
  used: number;
  limit: number | null;
  remaining: number | null;
}

async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RequestClient({
  initialRequests = [],
}: {
  /** Server-rendered first page of the queue (popular sort): crawlable content + instant first paint. */
  initialRequests?: ToneRequest[];
}) {
  const { user } = useAuth();

  // Queue state, seeded from the server render; the client refetches on
  // sort change or after a submission.
  const [requests, setRequests] = useState<ToneRequest[]>(initialRequests);
  const [loading, setLoading] = useState(initialRequests.length === 0);
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
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Quota state (signed-in only)
  const [quota, setQuota] = useState<RequestQuota | null>(null);

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
        // silent, same as production
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort, offset],
  );

  const seededFromServer = useRef(initialRequests.length > 0);
  useEffect(() => {
    // First mount with server-seeded data (popular sort): keep it instead of
    // refetching over it; just wire up pagination state. ISR keeps the seed
    // ≤5 min stale, and any sort change or submission refetches live.
    if (seededFromServer.current && sort === "popular") {
      seededFromServer.current = false;
      setOffset(PAGE_SIZE);
      setHasMore(initialRequests.length === PAGE_SIZE);
      setLoading(false);
      return;
    }
    seededFromServer.current = false;
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

  /* ---- Quota ---- */

  useEffect(() => {
    if (!user) {
      setQuota(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const res = await fetch("/api/tone-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = (await res.json()) as RequestQuota;
        if (!cancelled) setQuota(data);
      } catch {
        // silent; quota display is best-effort
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
    setShowUpgrade(false);

    if (!songName.trim() || !artistName.trim()) {
      setSubmitError("Song name and artist are required.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setSubmitError("Your session expired. Please log in again.");
        return;
      }

      const res = await fetch("/api/tone-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          song_name: songName.trim(),
          artist_name: artistName.trim(),
          part: part.toLowerCase(),
          description: description.trim() || undefined,
          reference_url: referenceUrl.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSubmitSuccess(true);
        setSongName("");
        setArtistName("");
        setPart("Lead Guitar");
        setDescription("");
        setReferenceUrl("");
        if (typeof data.used === "number") {
          setQuota({ used: data.used, limit: data.limit, remaining: data.remaining });
        }
        fetchRequests(true);
      } else {
        setSubmitError(data.error || "Failed to submit request. Please try again.");
        if (res.status === 402) {
          setQuota((prev) =>
            prev ? { ...prev, remaining: 0 } : prev,
          );
          if (data.upgrade_url) setShowUpgrade(true);
        }
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Render ---- */

  return (
    <div className="fk-wrap fkp-page">
      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Request a tone</span>
      </nav>

      <header className="fkp-head">
        <h1 className="fk-display">Request a tone</h1>
        <p className="fk-lead fkp-measure">
          Can&apos;t find the tone you&apos;re looking for? File a request, watch
          the community upvote it, and we&apos;ll research and publish the recipe.
        </p>
      </header>

      <div className="fkp-request-grid">
        {/* Form */}
        <aside className="fk-tile fkp-request-form">
          {!user ? (
            <>
              <h2 className="fk-t2">Submit a request</h2>
              <p className="fk-body-sm fkp-muted">
                Requests are a member feature. Sign in and your fulfilled
                tones land in your dashboard.
              </p>
              <Link href="/login" className="fk-btn">
                Log in to request a tone
              </Link>
              <p className="fk-body-sm fkp-muted">
                No account yet?{" "}
                <Link href="/signup" className="fk-link">
                  Sign up free
                </Link>
                . Free accounts get 2 requests a month.
              </p>
            </>
          ) : (
            <>
              <h2 className="fk-t2">Submit a request</h2>
              <p className="fk-body-sm fkp-muted">
                We&apos;ll add it to the queue and build the recipe.
              </p>

              <form className="fkp-form" onSubmit={handleSubmit}>
                <label className="fkp-field">
                  <span className="fk-label">
                    Song <span aria-hidden="true">*</span>
                  </span>
                  <input
                    type="text"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    placeholder="e.g. Comfortably Numb"
                    required
                    className="fk-input"
                  />
                </label>

                <label className="fkp-field">
                  <span className="fk-label">
                    Artist <span aria-hidden="true">*</span>
                  </span>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g. Pink Floyd"
                    required
                    className="fk-input"
                  />
                </label>

                <label className="fkp-field">
                  <span className="fk-label">Part</span>
                  <select
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                    className="fk-input"
                  >
                    {PART_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="fkp-field">
                  <span className="fk-label">
                    Description <span className="fkp-muted">(optional)</span>
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="The specific moment or sound, e.g. 'the solo at 3:42' or 'the clean intro'"
                    rows={3}
                    className="fk-input fkp-textarea"
                  />
                </label>

                <label className="fkp-field">
                  <span className="fk-label">
                    Reference URL <span className="fkp-muted">(optional)</span>
                  </span>
                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="YouTube or Spotify link"
                    className="fk-input"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting || quota?.remaining === 0}
                  className="fk-btn"
                >
                  {submitting ? "Submitting…" : "Submit request"}
                </button>

                {quota && quota.limit !== null && (
                  <p className="fk-caption">
                    {quota.remaining === 0
                      ? "0 requests left this month."
                      : `${quota.remaining} of ${quota.limit} requests left this month.`}
                  </p>
                )}

                {submitSuccess && (
                  <p className="fk-body-sm fkp-flash" role="status">
                    Request submitted. It&apos;s now in the queue. Track it in{" "}
                    <Link href="/dashboard/my-tones" className="fk-link">
                      your tones
                    </Link>
                    .
                  </p>
                )}
                {submitError && (
                  <p className="fk-body-sm fkp-flash is-error" role="alert">
                    {submitError}
                  </p>
                )}
                {showUpgrade && (
                  <Link href="/pricing" className="fk-btn fk-btn-secondary">
                    Upgrade to Pass for 10 requests a month
                  </Link>
                )}
              </form>
            </>
          )}
        </aside>

        {/* Queue */}
        <section className="fkp-request-queue">
          <div className="fkp-sectionhead">
            <h2 className="fk-t2">The queue</h2>
            <div className="fk-chips" role="group" aria-label="Sort requests">
              <button
                type="button"
                className="fk-chip"
                aria-pressed={sort === "popular"}
                onClick={() => setSort("popular")}
              >
                Most requested
              </button>
              <button
                type="button"
                className="fk-chip"
                aria-pressed={sort === "newest"}
                onClick={() => setSort("newest")}
              >
                Newest
              </button>
            </div>
          </div>

          {loading ? (
            <div className="fkp-request-list" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="fk-tile fkp-request-skeleton" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="fk-tile">
              <p className="fk-t3">No requests yet</p>
              <p className="fk-body-sm fkp-muted">Be the first to request a tone.</p>
            </div>
          ) : (
            <div className="fkp-request-list">
              {requests.map((req) => {
                const voted = userVotes.has(req.id);
                const statusLabel = STATUS_LABEL[req.status] ?? STATUS_LABEL.pending;
                return (
                  <article key={req.id} className="fk-tile fkp-request-card">
                    <button
                      type="button"
                      onClick={() => handleUpvote(req.id)}
                      disabled={!user || votingId === req.id}
                      className={`fkp-vote${voted ? " is-voted" : ""}`}
                      aria-pressed={voted}
                      title={
                        user
                          ? voted
                            ? "Remove upvote"
                            : "Upvote this request"
                          : "Log in to upvote"
                      }
                    >
                      <ChevronUp size={18} strokeWidth={1.75} aria-hidden />
                      <span className="fk-data">{req.upvotes}</span>
                    </button>

                    <div className="fkp-request-body">
                      <div>
                        <h3 className="fk-t3">{req.song_name}</h3>
                        <p className="fk-body-sm fkp-muted">by {req.artist_name}</p>
                      </div>

                      <div className="fkp-tags">
                        <span className="fkp-tag">{req.part}</span>
                        <span className={`fkp-tag fkp-status is-${req.status}`}>
                          {statusLabel}
                        </span>
                      </div>

                      {req.description && (
                        <p className="fk-body-sm">{req.description}</p>
                      )}

                      <div className="fkp-request-foot fk-caption">
                        <span>{timeAgo(req.created_at)}</span>
                        {req.reference_url && (
                          <a
                            href={req.reference_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fk-link"
                          >
                            Reference
                          </a>
                        )}
                        {req.status === "completed" && req.completed_recipe_slug && (
                          <Link
                            href={`/recipe/${req.completed_recipe_slug}`}
                            className="fk-link"
                          >
                            View recipe
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {hasMore && (
                <div>
                  <button
                    type="button"
                    onClick={() => fetchRequests(false)}
                    disabled={loadingMore}
                    className="fk-btn fk-btn-secondary"
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </div>
          )}

          {!user && requests.length > 0 && (
            <p className="fk-body-sm fkp-muted">
              <Link href="/login" className="fk-link">
                Log in
              </Link>{" "}
              to upvote requests.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
