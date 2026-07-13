"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import {
  getRequestsForUser,
  type ToneRequest,
} from "@/lib/db/tone-requests";
import { Plus, Music, Clock, Loader, CheckCircle, XCircle } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

type RequestStatus = ToneRequest["status"];

const TABS: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; tone: "pending" | "approved" | "rejected" | "flagged"; icon: typeof Clock }
> = {
  pending: { label: "Pending", tone: "pending", icon: Clock },
  in_progress: { label: "In progress", tone: "flagged", icon: Loader },
  completed: { label: "Completed", tone: "approved", icon: CheckCircle },
  declined: { label: "Declined", tone: "rejected", icon: XCircle },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
/*  Skeleton                                                                  */
/* -------------------------------------------------------------------------- */

function RequestSkeleton() {
  return (
    <div className="dashboard-myrx-row dashboard-myrx-row-skeleton">
      <span className="dashboard-myrx-skel-line dashboard-myrx-skel-50" />
      <span className="dashboard-myrx-skel-line dashboard-myrx-skel-100" />
      <span className="dashboard-myrx-skel-line dashboard-myrx-skel-75" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function MyTonesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<ToneRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<RequestStatus | "all">("all");

  /* ---- Auth guard -------------------------------------------------------- */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  /* ---- Fetch ------------------------------------------------------------- */

  const fetchTones = useCallback(async () => {
    if (!user) return;
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getRequestsForUser(user.id);
      setRequests(data);
    } catch {
      setError("Failed to load your tone requests.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTones();
  }, [fetchTones]);

  /* ---- Filter ------------------------------------------------------------ */

  const filtered =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  /* ---- Render ------------------------------------------------------------ */

  if (authLoading || !user) {
    return (
      <div>
        <h1 className="page-title page-title-sm">Your tones</h1>
        <p className="dashboard-inner-dek">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="dashboard-notif-head">
        <div>
          <h1 className="page-title page-title-sm">Your tones</h1>
          <p className="dashboard-inner-dek">
            Tones you&apos;ve requested — completed ones link straight to the recipe.
          </p>
        </div>
        <Link href="/request" className="hero-cta hero-cta-primary">
          <Plus className="h-4 w-4" />
          Request a tone
        </Link>
      </div>

      {/* Status filter — paper tabs, no rounded fills */}
      <div className="dashboard-myrx-tabs">
        {TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? requests.length
              : requests.filter((r) => r.status === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`dashboard-myrx-tab ${activeTab === tab.value ? "is-active" : ""}`}
            >
              {tab.label}
              <span className="dashboard-myrx-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="dashboard-myrx-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <RequestSkeleton key={i} />)
        ) : error ? (
          <div className="dashboard-notif-empty">
            <p className="dashboard-notif-empty-title">{error}</p>
            <button
              type="button"
              onClick={fetchTones}
              className="dashboard-notif-retry"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dashboard-notif-empty">
            <Music className="dashboard-notif-empty-icon" aria-hidden />
            <p className="dashboard-notif-empty-title">
              {activeTab === "all"
                ? "No tone requests yet"
                : `No ${TABS.find((t) => t.value === activeTab)?.label.toLowerCase()} requests`}
            </p>
            <p className="dashboard-notif-empty-dek">
              Tell us the song — we&apos;ll build the recipe.
            </p>
            <Link
              href="/request"
              className="hero-cta hero-cta-primary dashboard-myrx-empty-cta"
            >
              <Plus className="h-4 w-4" />
              Request a tone
            </Link>
          </div>
        ) : (
          filtered.map((req) => {
            const status = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = status.icon;
            return (
              <article key={req.id} className="dashboard-myrx-row">
                <div className="dashboard-myrx-row-head">
                  <h3 className="dashboard-myrx-title">
                    {req.song_name}
                    <span className="dashboard-mytones-artist"> — {req.artist_name}</span>
                  </h3>
                  <span
                    className={`dashboard-myrx-status dashboard-myrx-status-${status.tone}`}
                  >
                    <StatusIcon className="h-3 w-3" aria-hidden />
                    {status.label}
                  </span>
                </div>
                {req.description && (
                  <p className="dashboard-myrx-dek">{req.description}</p>
                )}
                <div className="dashboard-myrx-foot">
                  <span>Requested {formatDate(req.created_at)}</span>
                  <span className="dashboard-myrx-tag">{req.part}</span>
                  {req.upvotes > 1 && <span>▲ {req.upvotes}</span>}
                  {req.status === "completed" && req.completed_recipe_slug && (
                    <Link
                      href={`/recipe/${req.completed_recipe_slug}`}
                      className="request-card-link request-card-link-strong"
                    >
                      View your recipe →
                    </Link>
                  )}
                  {req.status === "declined" && req.admin_notes && (
                    <span className="dashboard-myrx-modnote">
                      <em>{req.admin_notes}</em>
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
