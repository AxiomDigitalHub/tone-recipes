import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";
import type { Notification, NotificationType } from "@/types/community";

/**
 * Untyped browser client for notification tables that aren't in the
 * generated Database schema yet. We use `as any` on insert/update
 * calls because the typed schema doesn't know about these tables.
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
/*  Read                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Get notifications for a user. Optionally filter to unread only.
 * Joined with profiles for actor info. Ordered by created_at desc.
 */
export async function getNotifications(
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number; offset?: number },
): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  const supabase = getClient();

  let query = supabase
    .from("notifications")
    .select("*, profiles!notifications_actor_id_fkey(display_name, username, avatar_url)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.unreadOnly) {
    query = query.eq("is_read", false);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    type: row.type as NotificationType,
    title: row.title as string,
    body: (row.body as string) ?? null,
    link: (row.link as string) ?? null,
    is_read: row.is_read as boolean,
    actor_id: (row.actor_id as string) ?? null,
    created_at: row.created_at as string,
    actor: row.profiles as Notification["actor"],
  })) as Notification[];
}

/**
 * Get count of unread notifications for a user.
 */
export async function getUnreadCount(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) return 0;
  return count ?? 0;
}

/* -------------------------------------------------------------------------- */
/*  Write                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Mark a single notification as read.
 */
export async function markAsRead(
  notificationId: string,
  userId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("notifications") as any)
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  return !error;
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllAsRead(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("notifications") as any)
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  return !error;
}

/**
 * Create a notification. Called internally when events happen
 * (comment reply, new follower, etc).
 */
export async function createNotification(params: {
  user_id: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
  actor_id?: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("notifications") as any)
    .insert({
      user_id: params.user_id,
      type: params.type,
      title: params.title,
      body: params.body ?? null,
      link: params.link ?? null,
      actor_id: params.actor_id ?? null,
    });

  return !error;
}
