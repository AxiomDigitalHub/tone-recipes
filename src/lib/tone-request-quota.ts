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
 * Service role, for two reasons (mirrors src/lib/downloads.ts):
 *   - the anon client here carried no user JWT, so RLS matched nothing and
 *     the counter always read 0 — the per-plan cap was silently fail-open
 *     (the migration-024 DB trigger was the only thing actually enforcing).
 *   - migration 026 revoked SELECT on requested_by_email/admin_notes for
 *     client roles, so a client-role `select("*", head)` count errors with
 *     "permission denied for column".
 * Server-only module (imported by the tone-requests API route); the key
 * never reaches a client bundle.
 *
 * Throws on query failure — callers must treat that as "can't verify quota"
 * (503), NOT as "0 used". The old `return 0` fail-open is the same bug
 * class downloads.ts documents having shipped once already.
 */
export async function getToneRequestCount(userId: string): Promise<number> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();

  const { count, error } = await supabase
    .from("tone_requests")
    .select("id", { count: "exact", head: true })
    .eq("requested_by", userId)
    .gte("created_at", monthStart);

  if (error) {
    throw new Error(`tone request count failed: ${error.message}`);
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
 *
 * Throws if the usage count can't be read (see getToneRequestCount).
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
