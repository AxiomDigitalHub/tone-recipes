import type { SupabaseClient } from "@supabase/supabase-js";

/** The public author fields community UIs render. */
export interface Author {
  display_name: string;
  username: string;
  avatar_url: string | null;
}

/**
 * Author info for a set of user ids, keyed by id.
 *
 * Community tables (comments, forum_threads, forum_replies, …) reference
 * auth.users, not profiles, so a PostgREST embed like `profiles!user_id(...)`
 * or `profiles!forum_threads_user_id_fkey(...)` has no relationship to
 * follow and fails the whole request with PGRST200 (HTTP 400). profiles.id
 * is the same auth.users id, so a second `in` lookup joins them instead.
 */
export async function fetchAuthors(client: SupabaseClient, userIds: string[]): Promise<Map<string, Author>> {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (!ids.length) return new Map();
  const { data } = await client.from("profiles").select("id, display_name, username, avatar_url").in("id", ids);
  const rows = (data ?? []) as (Author & { id: string })[];
  return new Map(rows.map(({ id, ...author }) => [id, author]));
}

/** Attach `author` to each row by its `user_id`. Rows whose profile is missing get no author. */
export async function withAuthors<T extends { user_id: string }>(client: SupabaseClient, rows: T[]): Promise<(T & { author?: Author })[]> {
  const authors = await fetchAuthors(client, rows.map((r) => r.user_id));
  return rows.map((r) => ({ ...r, author: authors.get(r.user_id) }));
}
