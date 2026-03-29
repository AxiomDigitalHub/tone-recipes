"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  MessageSquare,
  Guitar,
  UserPlus,
  UserMinus,
  Loader2,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/lib/auth/auth-context";
import { toggleFollow, isFollowing } from "@/lib/db/follows";
import Badge from "@/components/ui/Badge";
import { PLATFORMS } from "@/lib/constants";
import type { PublicProfile } from "@/types/community";
import type { UserRecipe } from "@/types/community";
import type { UserGearItem } from "@/lib/db/profile";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Tab = "recipes" | "comments" | "gear";

interface ProfileComment {
  id: string;
  recipe_slug: string;
  body: string;
  created_at: string;
}

interface ProfileClientProps {
  profile: PublicProfile;
}

/* -------------------------------------------------------------------------- */
/*  Supabase helper (untyped client for community tables)                     */
/* -------------------------------------------------------------------------- */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ProfileClient({ profile }: ProfileClientProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;

  /* ---- Follow state ---- */
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!user || isOwnProfile) return;
    isFollowing(user.id, profile.id).then(setFollowing);
  }, [user, profile.id, isOwnProfile]);

  const handleFollow = useCallback(async () => {
    if (!user || isOwnProfile) return;
    setFollowLoading(true);
    try {
      const nowFollowing = await toggleFollow(user.id, profile.id);
      setFollowing(nowFollowing);
    } finally {
      setFollowLoading(false);
    }
  }, [user, profile.id, isOwnProfile]);

  /* ---- Tabs ---- */
  const [activeTab, setActiveTab] = useState<Tab>("recipes");
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [gear, setGear] = useState<UserGearItem[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState<Record<Tab, boolean>>({
    recipes: false,
    comments: false,
    gear: false,
  });

  const fetchTabData = useCallback(
    async (tab: Tab) => {
      if (hasFetched[tab]) return;
      setTabLoading(true);
      const supabase = getSupabase();

      try {
        if (tab === "recipes") {
          const { data } = await supabase
            .from("user_recipes")
            .select(
              "id, user_id, title, slug, description, tags, status, created_at, updated_at",
            )
            .eq("user_id", profile.id)
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(20);

          setRecipes((data as UserRecipe[]) ?? []);
        } else if (tab === "comments") {
          const { data } = await supabase
            .from("comments")
            .select("id, recipe_slug, body, created_at")
            .eq("user_id", profile.id)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false })
            .limit(30);

          setComments((data as ProfileComment[]) ?? []);
        } else if (tab === "gear") {
          const { data } = await supabase
            .from("user_gear")
            .select("id, gear_name, gear_type, notes")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: true });

          setGear((data as UserGearItem[]) ?? []);
        }
      } finally {
        setTabLoading(false);
        setHasFetched((prev) => ({ ...prev, [tab]: true }));
      }
    },
    [profile.id, hasFetched],
  );

  /* Fetch on tab change */
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  /* ---- Tab definitions ---- */
  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: "recipes", label: "Recipes", icon: BookOpen },
    { key: "comments", label: "Comments", icon: MessageSquare },
    { key: "gear", label: "Gear", icon: Guitar },
  ];

  /* ---- Gear type styles ---- */
  const gearTypeVariant = (type: string) => {
    switch (type) {
      case "guitar":
        return "accent" as const;
      case "amp":
      case "effect":
        return "default" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="mt-8">
      {/* ---- Follow button ---- */}
      {user && !isOwnProfile && (
        <div className="mb-8 flex justify-center sm:justify-start">
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              following
                ? "border border-border bg-surface text-muted hover:border-red-500/40 hover:text-red-400"
                : "bg-accent text-white hover:bg-accent/90"
            }`}
          >
            {followLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : following ? (
              <UserMinus className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {following ? "Unfollow" : "Follow"}
          </button>
        </div>
      )}

      {/* ---- Tab bar ---- */}
      <nav className="flex gap-1 border-b border-border">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === key
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* ---- Tab content ---- */}
      <div className="mt-6 min-h-[200px]">
        {tabLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : (
          <>
            {/* Recipes */}
            {activeTab === "recipes" && (
              <div>
                {recipes.length === 0 ? (
                  <EmptyState message="No published recipes yet." />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recipes.map((recipe) => (
                      <Link
                        key={recipe.id}
                        href={`/recipe/${recipe.slug}`}
                        className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:bg-surface-hover"
                      >
                        <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                          {recipe.title}
                        </h3>
                        {recipe.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted">
                            {recipe.description}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {recipe.tags?.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-muted">
                          {new Date(recipe.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            {activeTab === "comments" && (
              <div>
                {comments.length === 0 ? (
                  <EmptyState message="No comments yet." />
                ) : (
                  <ul className="space-y-3">
                    {comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="rounded-xl border border-border bg-surface p-4"
                      >
                        <p className="text-sm text-foreground line-clamp-3">
                          {comment.body}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                          <Link
                            href={`/recipe/${comment.recipe_slug}`}
                            className="text-accent hover:underline"
                          >
                            View recipe
                          </Link>
                          <span aria-hidden="true">&middot;</span>
                          <time>
                            {new Date(comment.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Gear */}
            {activeTab === "gear" && (
              <div>
                {gear.length === 0 ? (
                  <EmptyState message="No gear listed yet." />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gear.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border bg-surface p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {item.gear_name}
                          </h3>
                          <Badge variant={gearTypeVariant(item.gear_type)}>
                            {item.gear_type}
                          </Badge>
                        </div>
                        {item.notes && (
                          <p className="mt-2 text-xs leading-relaxed text-muted">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty State                                                               */
/* -------------------------------------------------------------------------- */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
