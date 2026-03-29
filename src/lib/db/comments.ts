import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";
import type { Comment } from "@/types/community";

interface CommentVoteRow {
  vote_type: string;
}

/**
 * Untyped browser client for community tables that aren't in the
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

/**
 * Fetch all comments for a recipe, joined with profiles for author info.
 * Returns a flat array — the client is responsible for building the reply tree.
 */
export async function getComments(recipeSlug: string): Promise<Comment[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*, author:profiles!user_id(display_name, username, avatar_url)")
    .eq("recipe_slug", recipeSlug)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as Comment[];
}

/**
 * Insert a new comment on a recipe.
 */
export async function addComment(params: {
  recipe_slug: string;
  user_id: string;
  parent_id?: string;
  body: string;
}): Promise<Comment | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: row, error } = await (supabase.from("comments") as any)
    .insert({
      recipe_slug: params.recipe_slug,
      user_id: params.user_id,
      parent_id: params.parent_id ?? null,
      body: params.body,
      upvotes: 0,
      downvotes: 0,
      is_deleted: false,
    })
    .select("*, author:profiles!user_id(display_name, username, avatar_url)")
    .single();

  if (error || !row) return null;
  return row as Comment;
}

/**
 * Update the body of a comment. Only the comment's author may update it.
 */
export async function updateComment(
  commentId: string,
  userId: string,
  body: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("comments") as any)
    .update({ body, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("user_id", userId);

  return !error;
}

/**
 * Soft-delete a comment by setting is_deleted = true.
 * Only the comment's author may delete it.
 */
export async function deleteComment(
  commentId: string,
  userId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("comments") as any)
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("user_id", userId);

  return !error;
}

/**
 * Vote on a comment. Uses an upsert to the comment_votes table so each
 * user can only vote once per comment, then updates the aggregated
 * counts on the comment itself.
 */
export async function voteOnComment(
  commentId: string,
  userId: string,
  voteType: "up" | "down",
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: voteError } = await (supabase.from("comment_votes") as any)
    .upsert(
      {
        comment_id: commentId,
        user_id: userId,
        vote_type: voteType,
      },
      { onConflict: "comment_id,user_id" },
    );

  if (voteError) return false;

  // Re-aggregate counts
  const { data: votes } = await supabase
    .from("comment_votes")
    .select("vote_type")
    .eq("comment_id", commentId);

  const typedVotes = (votes ?? []) as CommentVoteRow[];
  const upvotes = typedVotes.filter((v) => v.vote_type === "up").length;
  const downvotes = typedVotes.filter((v) => v.vote_type === "down").length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase.from("comments") as any)
    .update({ upvotes, downvotes })
    .eq("id", commentId);

  return !updateError;
}
