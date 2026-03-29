import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

/**
 * Untyped browser client for follows table that isn't in the
 * generated Database schema yet.
 */
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
/*  Is Following                                                              */
/* -------------------------------------------------------------------------- */

export async function isFollowing(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .single();

  if (error || !data) return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/*  Toggle Follow                                                             */
/* -------------------------------------------------------------------------- */

export async function toggleFollow(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();
  const already = await isFollowing(followerId, followingId);

  if (already) {
    // Unfollow
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("follows") as any)
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (error) return true; // still following on error

    // Decrement counts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("decrement_follower_count", {
      p_user_id: followingId,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("decrement_following_count", {
      p_user_id: followerId,
    });

    return false;
  }

  // Follow
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("follows") as any).insert({
    follower_id: followerId,
    following_id: followingId,
  });

  if (error) return false; // not following on error

  // Increment counts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)("increment_follower_count", {
    p_user_id: followingId,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)("increment_following_count", {
    p_user_id: followerId,
  });

  return true;
}

/* -------------------------------------------------------------------------- */
/*  Get Followers                                                             */
/* -------------------------------------------------------------------------- */

export async function getFollowers(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<
  Array<{
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  }>
> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getClient();
  const { data, error } = await supabase
    .from("follows")
    .select("profiles:follower_id(id, display_name, username, avatar_url)")
    .eq("following_id", userId)
    .range(offset, offset + limit - 1);

  if (error || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => row.profiles).filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*  Get Following                                                             */
/* -------------------------------------------------------------------------- */

export async function getFollowing(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<
  Array<{
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  }>
> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getClient();
  const { data, error } = await supabase
    .from("follows")
    .select("profiles:following_id(id, display_name, username, avatar_url)")
    .eq("follower_id", userId)
    .range(offset, offset + limit - 1);

  if (error || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => row.profiles).filter(Boolean);
}
