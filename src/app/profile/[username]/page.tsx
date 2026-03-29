import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { PublicProfile } from "@/types/community";
import { PLATFORMS } from "@/lib/constants";
import ProfileClient from "./ProfileClient";

/* -------------------------------------------------------------------------- */
/*  Data Fetching                                                             */
/* -------------------------------------------------------------------------- */

async function getProfileByUsername(
  username: string,
): Promise<PublicProfile | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, avatar_url, bio, primary_platform, follower_count, following_count, recipe_count, created_at",
    )
    .eq("username", username)
    .single();

  if (!data) return null;
  return data as PublicProfile;
}

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return { title: "Profile Not Found" };
  }

  const title = `${profile.display_name} (@${profile.username})`;
  const description = profile.bio
    ? `${profile.bio.slice(0, 155)}${profile.bio.length > 155 ? "..." : ""}`
    : `${profile.display_name}'s tone recipes, gear, and activity on Fader & Knob.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(profile.avatar_url
        ? { images: [{ url: profile.avatar_url, alt: profile.display_name }] }
        : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Page Component (Server)                                                   */
/* -------------------------------------------------------------------------- */

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) notFound();

  const platform = PLATFORMS.find((p) => p.id === profile.primary_platform);
  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* ---- Profile Header ---- */}
      <header className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-24 w-24 rounded-full border-2 border-border object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-border bg-surface text-3xl font-bold text-accent">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          {/* Name row */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {profile.display_name}
            </h1>
            {platform && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  color: platform.color,
                  backgroundColor: platform.color + "15",
                }}
              >
                {platform.label}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-sm text-muted">@{profile.username}</p>

          {profile.bio && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {profile.bio}
            </p>
          )}

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-semibold text-foreground">
                {profile.follower_count}
              </span>
              <span className="text-xs text-muted">Followers</span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-semibold text-foreground">
                {profile.following_count}
              </span>
              <span className="text-xs text-muted">Following</span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-semibold text-foreground">
                {profile.recipe_count}
              </span>
              <span className="text-xs text-muted">Recipes</span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-xs text-muted">Joined {joinDate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---- Client interactive section (follow button + tabs) ---- */}
      <ProfileClient profile={profile} />
    </div>
  );
}
