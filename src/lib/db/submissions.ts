import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

export interface CommunitySubmission {
  id: string;
  recipe_slug: string;
  platform: string;
  user_email: string;
  user_display_name: string;
  settings: Array<{ block_name: string; param: string; value: string | number }>;
  notes: string;
  upvotes: number;
  downvotes: number;
  status: string;
  created_at: string;
}

interface SubmissionVoteRow {
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
 * Fetch submissions for a recipe + platform, ordered by newest first.
 */
export async function getSubmissions(
  recipeSlug: string,
  platform: string,
): Promise<CommunitySubmission[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getClient();
  const { data, error } = await supabase
    .from("community_submissions")
    .select("*")
    .eq("recipe_slug", recipeSlug)
    .eq("platform", platform)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as CommunitySubmission[];
}

/**
 * Submit new community settings for a recipe + platform.
 */
export async function createSubmission(payload: {
  recipe_slug: string;
  platform: string;
  user_email: string;
  user_display_name: string;
  settings: Array<{ block_name: string; param: string; value: string | number }>;
  notes: string;
}): Promise<CommunitySubmission | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: row, error } = await (supabase.from("community_submissions") as any)
    .insert({
      recipe_slug: payload.recipe_slug,
      platform: payload.platform,
      user_email: payload.user_email,
      user_display_name: payload.user_display_name,
      settings: payload.settings,
      notes: payload.notes,
      upvotes: 0,
      downvotes: 0,
      status: "active",
    })
    .select()
    .single();

  if (error || !row) return null;
  return row as CommunitySubmission;
}

/**
 * Vote on a submission. Uses an upsert to the submission_votes table
 * so each user can only vote once per submission, then updates the
 * aggregated counts on the submission itself.
 */
export async function voteOnSubmission(
  submissionId: string,
  userEmail: string,
  voteType: "up" | "down",
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: voteError } = await (supabase.from("submission_votes") as any)
    .upsert(
      {
        submission_id: submissionId,
        user_email: userEmail,
        vote_type: voteType,
      },
      { onConflict: "submission_id,user_email" },
    );

  if (voteError) return false;

  // Re-aggregate counts
  const { data: votes } = await supabase
    .from("submission_votes")
    .select("vote_type")
    .eq("submission_id", submissionId);

  const typedVotes = (votes ?? []) as SubmissionVoteRow[];
  const upvotes = typedVotes.filter((v) => v.vote_type === "up").length;
  const downvotes = typedVotes.filter((v) => v.vote_type === "down").length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase.from("community_submissions") as any)
    .update({ upvotes, downvotes })
    .eq("id", submissionId);

  return !updateError;
}
