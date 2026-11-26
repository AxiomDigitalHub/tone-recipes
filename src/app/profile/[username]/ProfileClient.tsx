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

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="fkp-profile-client">
      {/* ---- Follow button ---- */}
      {user && !isOwnProfile && (
        <div>
          <button
            type="button"
            onClick={handleFollow}
            disabled={followLoading}
            aria-pressed={following}
            className={`fk-btn${following ? " fk-btn-secondary fkp-unfollow" : ""}`}
          >
            {followLoading ? (
              <Loader2 size={16} className="animate-spin" aria-hidden />
            ) : following ? (
              <UserMinus size={16} strokeWidth={1.75} aria-hidden />
            ) : (
              <UserPlus size={16} strokeWidth={1.75} aria-hidden />
            )}
            {following ? "Unfollow" : "Follow"}
          </button>
        </div>
      )}

      {/* ---- Tab bar ---- */}
      <nav className="fk-chips" aria-label="Profile sections">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className="fk-chip"
            aria-pressed={activeTab === key}
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      {/* ---- Tab content ---- */}
      <div className="fkp-profile-tab">
        {tabLoading ? (
          <div className="fkp-profile-loading">
            <Loader2 size={24} className="animate-spin fkp-muted" aria-label="Loading" />
          </div>
        ) : (
          <>
            {/* Recipes */}
            {activeTab === "recipes" && (
              <div>
                {recipes.length === 0 ? (
                  <EmptyState message="No published recipes yet." />
                ) : (
                  <div className="fkp-tiles">
                    {recipes.map((recipe) => (
                      <Link
                        key={recipe.id}
                        href={`/recipe/${recipe.slug}`}
                        className="fk-tile fkp-linktile"
                      >
                        <h3 className="fk-t3">{recipe.title}</h3>
                        {recipe.description && (
                          <p className="fk-body-sm line-clamp-2">
                            {recipe.description}
                          </p>
                        )}
                        {recipe.tags && recipe.tags.length > 0 && (
                          <ul className="fkp-tags">
                            {recipe.tags.slice(0, 4).map((tag) => (
                              <li key={tag} className="fkp-tag">
                                {tag}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="fk-caption">{fmtDate(recipe.created_at)}</p>
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
                  <ul className="fkp-profile-comments">
                    {comments.map((comment) => (
                      <li key={comment.id} className="fk-tile">
                        <p className="fk-body-sm line-clamp-3">{comment.body}</p>
                        <p className="fk-caption">
                          <Link href={`/recipe/${comment.recipe_slug}`} className="fk-link">
                            View recipe
                          </Link>
                          <span aria-hidden="true"> &middot; </span>
                          <time dateTime={comment.created_at}>{fmtDate(comment.created_at)}</time>
                        </p>
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
                  <div className="fkp-tiles">
                    {gear.map((item) => (
                      <div key={item.id} className="fk-tile fkp-linktile">
                        <div className="fkp-linktile-head">
                          <h3 className="fk-t3">{item.gear_name}</h3>
                          <span className="fkp-tag">{item.gear_type}</span>
                        </div>
                        {item.notes && (
                          <p className="fk-body-sm">{item.notes}</p>
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
    <div className="fk-tile fkp-profile-empty">
      <p className="fk-body-sm fkp-muted">{message}</p>
    </div>
  );
}
