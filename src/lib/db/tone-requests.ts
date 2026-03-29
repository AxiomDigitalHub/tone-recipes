import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

/**
 * Untyped browser client for tone_requests tables that aren't in the
 * generated Database schema yet. We use `as any` on insert/upsert/update
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
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface ToneRequest {
  id: string;
  song_name: string;
  artist_name: string;
  part: string;
  description: string | null;
  reference_url: string | null;
  requested_by: string | null;
  requested_by_email: string | null;
  status: "pending" | "in_progress" | "completed" | "declined";
  completed_recipe_slug: string | null;
  upvotes: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Fetch tone requests with pagination and sorting.
 */
export async function getRequests(options: {
  status?: string;
  sort?: "newest" | "popular";
  limit?: number;
  offset?: number;
}): Promise<ToneRequest[]> {
  if (!isSupabaseConfigured()) return [];

  const { status, sort = "popular", limit = 20, offset = 0 } = options;
  const supabase = getClient();

  let query = supabase
    .from("tone_requests")
    .select("*");

  if (status) {
    query = query.eq("status", status);
  }

  if (sort === "popular") {
    query = query.order("upvotes", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error || !data) return [];
  return data as ToneRequest[];
}

/**
 * Submit a new tone request.
 */
export async function createRequest(data: {
  song_name: string;
  artist_name: string;
  part: string;
  description?: string;
  reference_url?: string;
  requested_by?: string;
  requested_by_email?: string;
}): Promise<ToneRequest | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: row, error } = await (supabase.from("tone_requests") as any)
    .insert({
      song_name: data.song_name,
      artist_name: data.artist_name,
      part: data.part,
      description: data.description ?? null,
      reference_url: data.reference_url ?? null,
      requested_by: data.requested_by ?? null,
      requested_by_email: data.requested_by_email ?? null,
    })
    .select("*")
    .single();

  if (error || !row) return null;
  return row as ToneRequest;
}

/**
 * Toggle upvote on a request. If the user already voted, remove the vote.
 * Returns the new upvote count, or null on error.
 */
export async function upvoteRequest(
  requestId: string,
  userId: string,
): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();

  // Check if user already voted
  const { data: existing } = await supabase
    .from("tone_request_votes")
    .select("request_id")
    .eq("request_id", requestId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    // Remove vote
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("tone_request_votes") as any)
      .delete()
      .eq("request_id", requestId)
      .eq("user_id", userId);

    if (error) return null;
  } else {
    // Add vote
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("tone_request_votes") as any)
      .insert({ request_id: requestId, user_id: userId });

    if (error) return null;
  }

  // Fetch updated count
  const { data: updated } = await supabase
    .from("tone_requests")
    .select("upvotes")
    .eq("id", requestId)
    .single();

  if (!updated) return null;
  return (updated as Record<string, unknown>).upvotes as number;
}

/**
 * Check if a user has already upvoted a request.
 */
export async function hasUpvoted(
  requestId: string,
  userId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  const { data } = await supabase
    .from("tone_request_votes")
    .select("request_id")
    .eq("request_id", requestId)
    .eq("user_id", userId)
    .maybeSingle();

  return !!data;
}

/**
 * Update request status (admin only — RLS enforced).
 */
export async function updateRequestStatus(
  requestId: string,
  status: string,
  adminNotes?: string,
  completedRecipeSlug?: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("tone_requests") as any)
    .update({
      status,
      admin_notes: adminNotes ?? null,
      completed_recipe_slug: completedRecipeSlug ?? null,
    })
    .eq("id", requestId);

  return !error;
}
