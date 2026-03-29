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
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/15 text-yellow-400",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    className: "bg-green-500/15 text-green-400",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/15 text-red-400",
    icon: XCircle,
  },
  flagged: {
    label: "Flagged",
    className: "bg-orange-500/15 text-orange-400",
    icon: Flag,
  },
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
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="h-5 w-1/2 animate-pulse rounded bg-border" />
      <div className="mt-3 h-3 w-full animate-pulse rounded bg-border" />
      <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-border" />
      <div className="mt-4 h-3 w-1/4 animate-pulse rounded bg-border" />
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Recipes</h1>
          <p className="mt-1 text-sm text-muted">
            Recipes you&apos;ve submitted to the community.
          </p>
        </div>
        <Link
          href="/dashboard/my-recipes/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Submit New Recipe
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-border bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.value !== "all" && (
              <span className="ml-1.5 text-xs opacity-60">
                {recipes.filter((r) =>
                  tab.value === "all" ? true : r.status === tab.value,
                ).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <RecipeSkeleton key={i} />)
        ) : error ? (
          <div className="rounded-lg border border-border bg-surface p-6 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchRecipes}
              className="mt-3 text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16">
            <BookOpen className="mb-4 h-10 w-10 text-muted" />
            <p className="text-lg font-semibold text-foreground">
              {activeTab === "all"
                ? "You haven't submitted any recipes yet"
                : `No ${activeTab} recipes`}
            </p>
            <p className="mt-1 text-sm text-muted">
              Share your tone recipes with the community.
            </p>
            <Link
              href="/dashboard/my-recipes/new"
              className="mt-4 flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" />
              Submit a Recipe
            </Link>
          </div>
        ) : (
          filtered.map((recipe) => {
            const status = STATUS_CONFIG[recipe.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={recipe.id}
                className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-foreground">
                      {recipe.title}
                    </h3>
                    {recipe.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-border/50 px-2 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                  <span>Submitted {formatDate(recipe.created_at)}</span>
                  {recipe.moderator_notes && (
                    <span className="text-yellow-400">
                      Moderator note: {recipe.moderator_notes}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
