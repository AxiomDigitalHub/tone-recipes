import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";
import type {
  Report,
  ReportContentType,
  ReportReason,
} from "@/types/community";

/**
 * Untyped browser client for report tables that aren't in the
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
/*  Create                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Submit a report for content (comment, thread, reply, recipe, or user).
 */
export async function createReport(params: {
  reporter_id: string;
  content_type: ReportContentType;
  content_id: string;
  reason: ReportReason;
  details?: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("reports") as any)
    .insert({
      reporter_id: params.reporter_id,
      content_type: params.content_type,
      content_id: params.content_id,
      reason: params.reason,
      details: params.details ?? null,
      status: "pending",
    });

  return !error;
}

/* -------------------------------------------------------------------------- */
/*  Read (admin/moderator)                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Get pending reports ordered by created_at. For admin/moderator use.
 */
export async function getPendingReports(
  options?: { limit?: number; offset?: number },
): Promise<Report[]> {
  if (!isSupabaseConfigured()) return [];

  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  const supabase = getClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data as Report[];
}

/* -------------------------------------------------------------------------- */
/*  Resolve                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Mark a report as resolved or dismissed.
 */
export async function resolveReport(
  reportId: string,
  reviewerId: string,
  status: "resolved" | "dismissed",
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("reports") as any)
    .update({
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  return !error;
}
