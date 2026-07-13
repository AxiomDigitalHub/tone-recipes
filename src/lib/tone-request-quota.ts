import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getToneRequestLimit } from "@/lib/permissions";
import type { UserRole } from "@/lib/auth/auth-context";

/**
 * Count tone requests this user has made IN THE CURRENT CALENDAR MONTH.
 *
 * Same UTC-month window as the preset-download quota (src/lib/downloads.ts)
 * so both meters reset at the same instant. Backed by
 * idx_tone_requests_user_month (migration 024).
 *
 * Untyped client — tone_requests isn't in the generated Database schema
 * (same caveat as src/lib/db/tone-requests.ts).
 */
export async function getToneRequestCount(userId: string): Promise<number> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();

  const { count, error } = await supabase
    .from("tone_requests")
    .select("*", { count: "exact", head: true })
    .eq("requested_by", userId)
    .gte("created_at", monthStart);

  if (error) {
    console.error("Error fetching tone request count:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * Check whether a user can submit a tone request right now.
 *
 * Every tier is metered (unlike downloads, where paid = unlimited) —
 * fulfillment has real marginal cost. Admin roles are exempt. The DB
 * trigger in migration 024 is the enforcement backstop; this function
 * exists so the API route can return a friendly 402 with an honest
 * remaining count instead of a raw trigger error.
 */
export async function canRequestTone(
  userId: string,
  role: string,
): Promise<{ allowed: boolean; remaining: number; limit: number; used: number }> {
  const limit = getToneRequestLimit(role as UserRole);

  if (!Number.isFinite(limit)) {
    return { allowed: true, remaining: Infinity, limit, used: 0 };
  }

  const used = await getToneRequestCount(userId);
  const remaining = Math.max(0, limit - used);

  return { allowed: remaining > 0, remaining, limit, used };
}
