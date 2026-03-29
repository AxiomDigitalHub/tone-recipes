import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";
import type {
  ForumCategory,
  ForumThread,
  ForumReply,
} from "@/types/community";

/**
 * Untyped browser client for forum tables that aren't in the
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
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* -------------------------------------------------------------------------- */
/*  Categories                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Get all forum categories ordered by sort_order, with thread count.
 */
export async function getForumCategories(): Promise<ForumCategory[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getClient();
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*, forum_threads(count)")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    const threads = row.forum_threads as Array<{ count: number }> | undefined;
    const threadCount = threads?.[0]?.count ?? 0;
    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      description: (row.description as string) ?? null,
      sort_order: row.sort_order as number,
      icon: (row.icon as string) ?? null,
      created_at: row.created_at as string,
      thread_count: threadCount,
    } as ForumCategory;
  });
}

/* -------------------------------------------------------------------------- */
/*  Threads                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get threads in a category. Pinned first, then by last_reply_at desc.
 * Paginated with defaults: page=1, limit=20.
 */
export async function getThreadsByCategory(
  categorySlug: string,
  options?: { page?: number; limit?: number },
): Promise<{ threads: ForumThread[]; total: number }> {
  if (!isSupabaseConfigured()) return { threads: [], total: 0 };

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = getClient();

  // Get the category by slug first
  const { data: catData, error: catError } = await supabase
    .from("forum_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (catError || !catData) return { threads: [], total: 0 };
  const categoryId = (catData as Record<string, unknown>).id as string;

  // Get total count
  const { count } = await supabase
    .from("forum_threads")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);

  // Get paginated threads with author + category
  const { data, error } = await supabase
    .from("forum_threads")
    .select("*, profiles!forum_threads_user_id_fkey(display_name, username, avatar_url), forum_categories!forum_threads_category_id_fkey(name, slug)")
    .eq("category_id", categoryId)
    .order("is_pinned", { ascending: false })
    .order("last_reply_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error || !data) return { threads: [], total: count ?? 0 };

  const threads = data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    category_id: row.category_id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    slug: row.slug as string,
    body: row.body as string,
    is_pinned: row.is_pinned as boolean,
    is_locked: row.is_locked as boolean,
    view_count: row.view_count as number,
    reply_count: row.reply_count as number,
    last_reply_at: (row.last_reply_at as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author: row.profiles as ForumThread["author"],
    category: row.forum_categories as ForumThread["category"],
  })) as ForumThread[];

  return { threads, total: count ?? 0 };
}

/**
 * Get a single thread by slug with author info. Increments view_count.
 */
export async function getThread(
  threadSlug: string,
): Promise<ForumThread | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();

  const { data, error } = await supabase
    .from("forum_threads")
    .select("*, profiles!forum_threads_user_id_fkey(display_name, username, avatar_url)")
    .eq("slug", threadSlug)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;

  // Increment view count (fire-and-forget)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase.from("forum_threads") as any)
    .update({ view_count: ((row.view_count as number) ?? 0) + 1 })
    .eq("id", row.id)
    .then(() => {});

  return {
    id: row.id as string,
    category_id: row.category_id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    slug: row.slug as string,
    body: row.body as string,
    is_pinned: row.is_pinned as boolean,
    is_locked: row.is_locked as boolean,
    view_count: row.view_count as number,
    reply_count: row.reply_count as number,
    last_reply_at: (row.last_reply_at as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author: row.profiles as ForumThread["author"],
  } as ForumThread;
}

/**
 * Create a new thread. Auto-generates slug from title with random suffix.
 */
export async function createThread(params: {
  category_id: string;
  user_id: string;
  title: string;
  body: string;
}): Promise<ForumThread | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();
  const slug = `${slugify(params.title)}-${Math.random().toString(36).slice(2, 8)}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("forum_threads") as any)
    .insert({
      category_id: params.category_id,
      user_id: params.user_id,
      title: params.title,
      slug,
      body: params.body,
    })
    .select("*, profiles!forum_threads_user_id_fkey(display_name, username, avatar_url)")
    .single();

  if (error || !data) return null;
  return data as ForumThread;
}

/**
 * Get most recent threads across all categories.
 */
export async function getRecentThreads(
  limit?: number,
): Promise<ForumThread[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getClient();
  const { data, error } = await supabase
    .from("forum_threads")
    .select("*, profiles!forum_threads_user_id_fkey(display_name, username, avatar_url), forum_categories!forum_threads_category_id_fkey(name, slug)")
    .order("created_at", { ascending: false })
    .limit(limit ?? 10);

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    category_id: row.category_id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    slug: row.slug as string,
    body: row.body as string,
    is_pinned: row.is_pinned as boolean,
    is_locked: row.is_locked as boolean,
    view_count: row.view_count as number,
    reply_count: row.reply_count as number,
    last_reply_at: (row.last_reply_at as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author: row.profiles as ForumThread["author"],
    category: row.forum_categories as ForumThread["category"],
  })) as ForumThread[];
}

/* -------------------------------------------------------------------------- */
/*  Replies                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get replies for a thread, joined with profiles. Ordered by created_at asc.
 * Paginated with defaults: page=1, limit=20.
 */
export async function getReplies(
  threadId: string,
  options?: { page?: number; limit?: number },
): Promise<{ replies: ForumReply[]; total: number }> {
  if (!isSupabaseConfigured()) return { replies: [], total: 0 };

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = getClient();

  // Get total count
  const { count } = await supabase
    .from("forum_replies")
    .select("*", { count: "exact", head: true })
    .eq("thread_id", threadId);

  // Get paginated replies
  const { data, error } = await supabase
    .from("forum_replies")
    .select("*, profiles!forum_replies_user_id_fkey(display_name, username, avatar_url)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error || !data) return { replies: [], total: count ?? 0 };

  const replies = data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    thread_id: row.thread_id as string,
    user_id: row.user_id as string,
    body: row.body as string,
    is_accepted: row.is_accepted as boolean,
    upvotes: row.upvotes as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author: row.profiles as ForumReply["author"],
  })) as ForumReply[];

  return { replies, total: count ?? 0 };
}

/**
 * Create a reply and update reply_count + last_reply_at on the thread.
 */
export async function createReply(params: {
  thread_id: string;
  user_id: string;
  body: string;
}): Promise<ForumReply | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("forum_replies") as any)
    .insert({
      thread_id: params.thread_id,
      user_id: params.user_id,
      body: params.body,
    })
    .select("*, profiles!forum_replies_user_id_fkey(display_name, username, avatar_url)")
    .single();

  if (error || !data) return null;

  // Update thread reply_count and last_reply_at (fire-and-forget)
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase.from("forum_threads") as any)
    .update({ last_reply_at: now })
    .eq("id", params.thread_id)
    .then(() => {});

  // Increment reply_count via rpc or manual read+write
  const { data: threadData } = await supabase
    .from("forum_threads")
    .select("reply_count")
    .eq("id", params.thread_id)
    .single();

  if (threadData) {
    const currentCount = (threadData as Record<string, unknown>).reply_count as number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("forum_threads") as any)
      .update({ reply_count: currentCount + 1 })
      .eq("id", params.thread_id);
  }

  return data as ForumReply;
}
