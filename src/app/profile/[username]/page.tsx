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
    <div className="fk-wrap fkp-page">
      {/* ---- Profile Header ---- */}
      <header className="fkp-person">
        {/* Avatar */}
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="fkp-avatar"
          />
        ) : (
          <div className="fkp-avatar fkp-avatar-mono" aria-hidden="true">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="fkp-person-text">
          {/* Name row */}
          <div className="fkp-person-name">
            <h1 className="fk-t1">{profile.display_name}</h1>
            {platform && <span className="fkp-tag">{platform.label}</span>}
          </div>

          <p className="fk-body-sm fkp-muted">@{profile.username}</p>

          {profile.bio && <p className="fk-body fkp-measure">{profile.bio}</p>}

          {/* Stats row */}
          <dl className="fkp-person-stats">
            <div>
              <dt className="fk-caption">Followers</dt>
              <dd className="fk-data">{profile.follower_count}</dd>
            </div>
            <div>
              <dt className="fk-caption">Following</dt>
              <dd className="fk-data">{profile.following_count}</dd>
            </div>
            <div>
              <dt className="fk-caption">Recipes</dt>
              <dd className="fk-data">{profile.recipe_count}</dd>
            </div>
            <div>
              <dt className="fk-caption">Joined</dt>
              <dd className="fk-body-sm">{joinDate}</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* ---- Client interactive section (follow button + tabs) ---- */}
      <ProfileClient profile={profile} />
    </div>
  );
}
