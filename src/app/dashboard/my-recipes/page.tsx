"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { UserRecipe, UserRecipeStatus } from "@/types/community";
import { Plus, BookOpen, Clock, CheckCircle, XCircle, Flag } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const TABS: { label: string; value: UserRecipeStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_CONFIG: Record<
  UserRecipeStatus,
  { label: string; tone: "pending" | "approved" | "rejected" | "flagged"; icon: typeof Clock }
> = {
  pending: { label: "Pending", tone: "pending", icon: Clock },
  approved: { label: "Approved", tone: "approved", icon: CheckCircle },
  rejected: { label: "Rejected", tone: "rejected", icon: XCircle },
  flagged: { label: "Flagged", tone: "flagged", icon: Flag },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
/*  Supabase client (untyped, since user_recipes isn't in generated schema)   */
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
/*  Skeleton                                                                  */
/* -------------------------------------------------------------------------- */

function RecipeSkeleton() {
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

export default function MyRecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<UserRecipeStatus | "all">("all");

  /* ---- Auth guard -------------------------------------------------------- */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  /* ---- Fetch recipes ---------------------------------------------------- */

  const fetchRecipes = useCallback(async () => {
    if (!user) return;
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getClient();
      const { data, error: dbError } = await supabase
        .from("user_recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      setRecipes((data as UserRecipe[]) ?? []);
    } catch {
      setError("Failed to load your recipes.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  /* ---- Filter ----------------------------------------------------------- */

  const filtered =
    activeTab === "all"
      ? recipes
      : recipes.filter((r) => r.status === activeTab);

  /* ---- Render ----------------------------------------------------------- */

  if (authLoading || !user) {
    return (
      <div>
        <h1 className="page-title page-title-sm">My recipes</h1>
        <p className="dashboard-inner-dek">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="dashboard-notif-head">
        <div>
          <h1 className="page-title page-title-sm">My recipes</h1>
          <p className="dashboard-inner-dek">
            Recipes you&apos;ve submitted to the community.
          </p>
        </div>
        <Link
          href="/dashboard/my-recipes/new"
          className="hero-cta hero-cta-primary"
        >
          <Plus className="h-4 w-4" />
          Submit a recipe
        </Link>
      </div>

      {/* Status filter — paper tabs, no rounded fills */}
      <div className="dashboard-myrx-tabs">
        {TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? recipes.length
              : recipes.filter((r) => r.status === tab.value).length;
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
          Array.from({ length: 3 }).map((_, i) => <RecipeSkeleton key={i} />)
        ) : error ? (
          <div className="dashboard-notif-empty">
            <p className="dashboard-notif-empty-title">{error}</p>
            <button
              type="button"
              onClick={fetchRecipes}
              className="dashboard-notif-retry"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dashboard-notif-empty">
            <BookOpen
              className="dashboard-notif-empty-icon"
              aria-hidden
            />
            <p className="dashboard-notif-empty-title">
              {activeTab === "all"
                ? "Nothing submitted yet"
                : `No ${activeTab} recipes`}
            </p>
            <p className="dashboard-notif-empty-dek">
              Share your tone recipes with the community.
            </p>
            <Link
              href="/dashboard/my-recipes/new"
              className="hero-cta hero-cta-primary dashboard-myrx-empty-cta"
            >
              <Plus className="h-4 w-4" />
              Submit a recipe
            </Link>
          </div>
        ) : (
          filtered.map((recipe) => {
            const status = STATUS_CONFIG[recipe.status];
            const StatusIcon = status.icon;
            return (
              <article key={recipe.id} className="dashboard-myrx-row">
                <div className="dashboard-myrx-row-head">
                  <h3 className="dashboard-myrx-title">{recipe.title}</h3>
                  <span
                    className={`dashboard-myrx-status dashboard-myrx-status-${status.tone}`}
                  >
                    <StatusIcon className="h-3 w-3" aria-hidden />
                    {status.label}
                  </span>
                </div>
                {recipe.description && (
                  <p className="dashboard-myrx-dek">{recipe.description}</p>
                )}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="dashboard-myrx-tags">
                    {recipe.tags.map((tag) => (
                      <span key={tag} className="dashboard-myrx-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="dashboard-myrx-foot">
                  <span>Submitted {formatDate(recipe.created_at)}</span>
                  {recipe.moderator_notes && (
                    <span className="dashboard-myrx-modnote">
                      <em>Moderator: {recipe.moderator_notes}</em>
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
