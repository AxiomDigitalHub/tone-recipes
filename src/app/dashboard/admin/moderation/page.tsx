"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import { getPendingReports, resolveReport } from "@/lib/db/reports";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Report, UserRecipe } from "@/types/community";
import {
  Shield,
  AlertTriangle,
  BookOpen,
  BarChart3,
  CheckCircle,
  XCircle,
  Users,
  MessageSquare,
  Clock,
  ShieldOff,
  Music,
  ChevronUp,
  Play,
  Ban,
  Link as LinkIcon,
} from "lucide-react";
import {
  getRequests,
  updateRequestStatus,
  type ToneRequest,
} from "@/lib/db/tone-requests";
import { createNotification } from "@/lib/db/notifications";

/* -------------------------------------------------------------------------- */
/*  Supabase client                                                           */
/* -------------------------------------------------------------------------- */

let _client: ReturnType<typeof createSupabaseClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ModerationTab = "reports" | "recipes" | "tone_requests" | "overview";

interface PendingRecipeWithAuthor extends UserRecipe {
  author?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
}

interface OverviewStats {
  pendingReports: number;
  pendingRecipes: number;
  totalUsers: number;
  totalComments: number;
}

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

const REASON_LABELS: Record<string, string> = {
  spam: "Spam",
  harassment: "Harassment",
  inappropriate: "Inappropriate",
  misinformation: "Misinformation",
  other: "Other",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  comment: "Comment",
  forum_thread: "Forum Thread",
  forum_reply: "Forum Reply",
  user_recipe: "User Recipe",
  user: "User",
};

/* -------------------------------------------------------------------------- */
/*  Skeleton                                                                  */
/* -------------------------------------------------------------------------- */

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
      <div className="h-4 w-1/3 animate-pulse rounded bg-border" />
      <div className="mt-3 h-3 w-full animate-pulse rounded bg-border" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-border" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ModerationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isModerator, setIsModerator] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<ModerationTab>("reports");

  // Reports state
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // Pending recipes state
  const [pendingRecipes, setPendingRecipes] = useState<
    PendingRecipeWithAuthor[]
  >([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  // Tone requests state
  const [toneRequests, setToneRequests] = useState<ToneRequest[]>([]);
  const [toneRequestsLoading, setToneRequestsLoading] = useState(true);
  const [toneRequestsError, setToneRequestsError] = useState<string | null>(null);
  const [toneAdminNotes, setToneAdminNotes] = useState<Record<string, string>>({});
  const [toneRecipeSlugs, setToneRecipeSlugs] = useState<Record<string, string>>({});

  // Overview state
  const [stats, setStats] = useState<OverviewStats>({
    pendingReports: 0,
    pendingRecipes: 0,
    totalUsers: 0,
    totalComments: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Action states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  /* ---- Auth guard + moderator check ------------------------------------- */

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isSupabaseConfigured()) {
      setIsModerator(false);
      return;
    }

    async function checkModerator() {
      const supabase = getClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("is_moderator")
        .eq("id", user!.id)
        .single();

      if (error || !data) {
        setIsModerator(false);
        return;
      }
      setIsModerator(!!(data as Record<string, unknown>).is_moderator);
    }

    checkModerator();
  }, [authLoading, user, router]);

  /* ---- Fetch reports ---------------------------------------------------- */

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    setReportsError(null);

    try {
      const data = await getPendingReports({ limit: 50 });
      setReports(data);
    } catch {
      setReportsError("Failed to load reports.");
    } finally {
      setReportsLoading(false);
    }
  }, []);

  /* ---- Fetch pending recipes -------------------------------------------- */

  const fetchPendingRecipes = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setRecipesLoading(false);
      return;
    }

    setRecipesLoading(true);
    setRecipesError(null);

    try {
      const supabase = getClient();
      const { data, error } = await supabase
        .from("user_recipes")
        .select(
          "*, profiles!user_recipes_user_id_fkey(display_name, username, avatar_url)",
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data ?? []).map((row: Record<string, unknown>) => ({
        ...(row as unknown as UserRecipe),
        author: row.profiles as PendingRecipeWithAuthor["author"],
      }));

      setPendingRecipes(mapped);
    } catch {
      setRecipesError("Failed to load pending recipes.");
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  /* ---- Fetch overview stats --------------------------------------------- */

  const fetchStats = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setStatsLoading(false);
      return;
    }

    setStatsLoading(true);

    try {
      const supabase = getClient();

      const [reportsRes, recipesRes, usersRes, commentsRes] =
        await Promise.all([
          supabase
            .from("reports")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("user_recipes")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("comments")
            .select("*", { count: "exact", head: true }),
        ]);

      setStats({
        pendingReports: reportsRes.count ?? 0,
        pendingRecipes: recipesRes.count ?? 0,
        totalUsers: usersRes.count ?? 0,
        totalComments: commentsRes.count ?? 0,
      });
    } catch {
      // silent
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* ---- Fetch tone requests ----------------------------------------------- */

  const fetchToneRequests = useCallback(async () => {
    setToneRequestsLoading(true);
    setToneRequestsError(null);

    try {
      const data = await getRequests({ sort: "popular", limit: 50 });
      setToneRequests(data);
    } catch {
      setToneRequestsError("Failed to load tone requests.");
    } finally {
      setToneRequestsLoading(false);
    }
  }, []);

  /* ---- Load data on tab switch ------------------------------------------ */

  useEffect(() => {
    if (isModerator !== true) return;

    if (activeTab === "reports") fetchReports();
    else if (activeTab === "recipes") fetchPendingRecipes();
    else if (activeTab === "tone_requests") fetchToneRequests();
    else if (activeTab === "overview") fetchStats();
  }, [activeTab, isModerator, fetchReports, fetchPendingRecipes, fetchToneRequests, fetchStats]);

  /* ---- Report actions --------------------------------------------------- */

  async function handleResolveReport(
    reportId: string,
    action: "resolved" | "dismissed",
  ) {
    if (!user) return;
    setProcessingId(reportId);

    try {
      const success = await resolveReport(reportId, user.id, action);
      if (success) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      }
    } catch {
      // silent
    } finally {
      setProcessingId(null);
    }
  }

  /* ---- Recipe moderation actions ---------------------------------------- */

  async function handleRecipeAction(
    recipeId: string,
    action: "approved" | "rejected",
  ) {
    if (!user) return;
    setProcessingId(recipeId);

    try {
      const supabase = getClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("user_recipes") as any)
        .update({
          status: action,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          moderator_notes: rejectNotes[recipeId]?.trim() || null,
        })
        .eq("id", recipeId);

      if (error) throw error;
      setPendingRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch {
      // silent
    } finally {
      setProcessingId(null);
    }
  }

  /* ---- Tone request actions ---------------------------------------------- */

  async function handleToneRequestAction(
    requestId: string,
    status: "in_progress" | "completed" | "declined",
  ) {
    setProcessingId(requestId);

    try {
      const success = await updateRequestStatus(
        requestId,
        status,
        toneAdminNotes[requestId]?.trim(),
        status === "completed" ? toneRecipeSlugs[requestId]?.trim() : undefined,
      );

      if (success) {
        setToneRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: status as ToneRequest["status"] } : r)),
        );

        // Ping the requester when their tone ships. Best-effort — a failed
        // notification must not roll back the fulfillment.
        if (status === "completed") {
          const fulfilled = toneRequests.find((r) => r.id === requestId);
          const slug = toneRecipeSlugs[requestId]?.trim();
          if (fulfilled?.requested_by) {
            createNotification({
              user_id: fulfilled.requested_by,
              type: "request_completed",
              title: `Your tone request is ready: ${fulfilled.song_name}`,
              body: `${fulfilled.song_name} — ${fulfilled.artist_name} is now a full recipe.`,
              link: slug ? `/recipe/${slug}` : "/dashboard/my-tones",
            }).catch(() => {});
          }
        }
      }
    } catch {
      // silent
    } finally {
      setProcessingId(null);
    }
  }

  /* ---- Render ----------------------------------------------------------- */

  // Loading auth
  if (authLoading || !user || isModerator === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[var(--ink-muted)]">Loading...</p>
      </div>
    );
  }

  // Access denied
  if (!isModerator) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
        <ShieldOff className="mb-4 h-12 w-12 text-[var(--ink-muted)]" />
        <h1 className="page-title page-title-sm">Access Denied</h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          You do not have moderator permissions to access this page.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-lg border border-[var(--ink)] bg-[var(--amber)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--amber-2)] hover:text-[var(--paper)]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const TABS: {
    value: ModerationTab;
    label: string;
    icon: typeof Shield;
  }[] = [
    { value: "reports", label: "Reports", icon: AlertTriangle },
    { value: "recipes", label: "Pending Recipes", icon: BookOpen },
    { value: "tone_requests", label: "Tone Requests", icon: Music },
    { value: "overview", label: "Overview", icon: BarChart3 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-[var(--amber-2)]" />
        <div>
          <h1 className="page-title page-title-sm">Moderation Dashboard</h1>
          <p className="text-sm text-[var(--ink-muted)]">
            Review reports and user-submitted content.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-1">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-amber-500/15 text-[var(--amber-2)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {/* ---- Reports Tab ---- */}
        {activeTab === "reports" && (
          <div className="space-y-3">
            {reportsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : reportsError ? (
              <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-6 text-center">
                <p className="text-sm text-red-700">{reportsError}</p>
                <button
                  onClick={fetchReports}
                  className="mt-3 text-sm font-medium text-[var(--amber-2)] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] py-16">
                <CheckCircle className="mb-4 h-10 w-10 text-green-700" />
                <p className="text-lg font-semibold text-[var(--ink)]">
                  No pending reports
                </p>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  All reports have been reviewed.
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-700">
                          {CONTENT_TYPE_LABELS[report.content_type] ??
                            report.content_type}
                        </span>
                        <span className="rounded-md bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-400">
                          {REASON_LABELS[report.reason] ?? report.reason}
                        </span>
                      </div>
                      {report.details && (
                        <p className="mt-2 text-sm text-[var(--ink)]">
                          {report.details}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-[var(--ink-muted)]">
                        {timeAgo(report.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() =>
                          handleResolveReport(report.id, "resolved")
                        }
                        disabled={processingId === report.id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-500/25 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Resolve
                      </button>
                      <button
                        onClick={() =>
                          handleResolveReport(report.id, "dismissed")
                        }
                        disabled={processingId === report.id}
                        className="flex items-center gap-1.5 rounded-lg bg-border/50 px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors hover:bg-border disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ---- Pending Recipes Tab ---- */}
        {activeTab === "recipes" && (
          <div className="space-y-3">
            {recipesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : recipesError ? (
              <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-6 text-center">
                <p className="text-sm text-red-700">{recipesError}</p>
                <button
                  onClick={fetchPendingRecipes}
                  className="mt-3 text-sm font-medium text-[var(--amber-2)] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : pendingRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] py-16">
                <CheckCircle className="mb-4 h-10 w-10 text-green-700" />
                <p className="text-lg font-semibold text-[var(--ink)]">
                  No pending recipes
                </p>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  All recipe submissions have been reviewed.
                </p>
              </div>
            ) : (
              pendingRecipes.map((recipe) => {
                const chainNodes =
                  (
                    recipe.signal_chain as {
                      nodes?: { category: string; gear_name: string }[];
                    }
                  )?.nodes ?? [];
                const chainSummary = chainNodes
                  .map((n) => n.gear_name || n.category)
                  .join(" -> ");

                return (
                  <div
                    key={recipe.id}
                    className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-[var(--ink)]">
                        {recipe.title}
                      </h3>
                      {recipe.author?.display_name && (
                        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                          by {recipe.author.display_name}
                          {recipe.author.username
                            ? ` (@${recipe.author.username})`
                            : ""}
                        </p>
                      )}
                      {recipe.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--ink-muted)]">
                          {recipe.description}
                        </p>
                      )}
                      {chainSummary && (
                        <p className="mt-2 text-xs text-[var(--ink-muted)]">
                          <span className="font-medium text-[var(--ink)]">
                            Signal chain:
                          </span>{" "}
                          {chainSummary}
                        </p>
                      )}
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {recipe.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-[var(--amber-2)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-xs text-[var(--ink-muted)]">
                        Submitted {timeAgo(recipe.created_at)}
                      </p>
                    </div>

                    {/* Moderator notes input */}
                    <div className="mt-3">
                      <input
                        type="text"
                        value={rejectNotes[recipe.id] ?? ""}
                        onChange={(e) =>
                          setRejectNotes((prev) => ({
                            ...prev,
                            [recipe.id]: e.target.value,
                          }))
                        }
                        placeholder="Moderator notes (optional)..."
                        className="w-full rounded-lg border border-[var(--ink-faint)] bg-[var(--paper)] px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--amber-2)] focus:outline-none focus:ring-1 focus:ring-[var(--amber-2)]"
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          handleRecipeAction(recipe.id, "approved")
                        }
                        disabled={processingId === recipe.id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500/15 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-500/25 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleRecipeAction(recipe.id, "rejected")
                        }
                        disabled={processingId === recipe.id}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ---- Tone Requests Tab ---- */}
        {activeTab === "tone_requests" && (
          <div className="space-y-3">
            {toneRequestsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : toneRequestsError ? (
              <div className="rounded-lg border border-[var(--ink-faint)] bg-[var(--paper-2)] p-6 text-center">
                <p className="text-sm text-red-700">{toneRequestsError}</p>
                <button
                  onClick={fetchToneRequests}
                  className="mt-3 text-sm font-medium text-[var(--amber-2)] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : toneRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] py-16">
                <CheckCircle className="mb-4 h-10 w-10 text-green-700" />
                <p className="text-lg font-semibold text-[var(--ink)]">
                  No tone requests
                </p>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  No requests have been submitted yet.
                </p>
              </div>
            ) : (
              toneRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-[var(--ink)]">
                        {req.song_name}
                      </h3>
                      <span className="text-sm text-[var(--ink-muted)]">
                        by {req.artist_name}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-[var(--amber-2)]">
                        <ChevronUp className="h-3 w-3" />
                        {req.upvotes}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          req.status === "pending"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : req.status === "in_progress"
                              ? "bg-blue-500/15 text-blue-400"
                              : req.status === "completed"
                                ? "bg-green-500/15 text-green-700"
                                : "bg-zinc-500/15 text-zinc-400"
                        }`}
                      >
                        {req.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                      <span>{req.part}</span>
                      <span>{timeAgo(req.created_at)}</span>
                    </div>

                    {req.description && (
                      <p className="mt-2 text-sm text-[var(--ink-muted)]">
                        {req.description}
                      </p>
                    )}

                    {req.reference_url && (
                      <a
                        href={req.reference_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--amber-2)] hover:underline"
                      >
                        <LinkIcon className="h-3 w-3" />
                        Reference link
                      </a>
                    )}
                  </div>

                  {/* Admin controls */}
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      value={toneAdminNotes[req.id] ?? ""}
                      onChange={(e) =>
                        setToneAdminNotes((prev) => ({
                          ...prev,
                          [req.id]: e.target.value,
                        }))
                      }
                      placeholder="Admin notes (optional)..."
                      className="w-full rounded-lg border border-[var(--ink-faint)] bg-[var(--paper)] px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--amber-2)] focus:outline-none focus:ring-1 focus:ring-[var(--amber-2)]"
                    />
                    <input
                      type="text"
                      value={toneRecipeSlugs[req.id] ?? ""}
                      onChange={(e) =>
                        setToneRecipeSlugs((prev) => ({
                          ...prev,
                          [req.id]: e.target.value,
                        }))
                      }
                      placeholder="Completed recipe slug (for completed status)..."
                      className="w-full rounded-lg border border-[var(--ink-faint)] bg-[var(--paper)] px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--amber-2)] focus:outline-none focus:ring-1 focus:ring-[var(--amber-2)]"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {req.status === "pending" && (
                      <button
                        onClick={() =>
                          handleToneRequestAction(req.id, "in_progress")
                        }
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/25 disabled:opacity-50"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start
                      </button>
                    )}
                    {(req.status === "pending" ||
                      req.status === "in_progress") && (
                      <>
                        <button
                          onClick={() =>
                            handleToneRequestAction(req.id, "completed")
                          }
                          disabled={processingId === req.id}
                          className="flex items-center gap-1.5 rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-500/25 disabled:opacity-50"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Complete
                        </button>
                        <button
                          onClick={() =>
                            handleToneRequestAction(req.id, "declined")
                          }
                          disabled={processingId === req.id}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ---- Overview Tab ---- */}
        {activeTab === "overview" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5"
                >
                  <div className="h-4 w-1/2 animate-pulse rounded bg-border" />
                  <div className="mt-3 h-8 w-1/3 animate-pulse rounded bg-border" />
                </div>
              ))
            ) : (
              <>
                <div className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    Pending Reports
                  </div>
                  <p className="mt-2 text-3xl font-bold text-[var(--ink)]">
                    {stats.pendingReports}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                    <Clock className="h-4 w-4 text-[var(--amber-2)]" />
                    Pending Recipes
                  </div>
                  <p className="mt-2 text-3xl font-bold text-[var(--ink)]">
                    {stats.pendingRecipes}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                    <Users className="h-4 w-4 text-green-700" />
                    Total Users
                  </div>
                  <p className="mt-2 text-3xl font-bold text-[var(--ink)]">
                    {stats.totalUsers}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--ink-faint)] bg-[var(--paper-2)] p-5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    Total Comments
                  </div>
                  <p className="mt-2 text-3xl font-bold text-[var(--ink)]">
                    {stats.totalComments}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
