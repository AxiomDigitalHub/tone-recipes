import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { FREE_DOWNLOAD_LIMIT } from "@/lib/permissions";

export { FREE_DOWNLOAD_LIMIT };

/**
 * Service-role client. The quota count MUST run privileged: the anon
 * client used previously carried no user JWT, so the RLS "read own rows"
 * policy matched nothing and the counter always read 0 — the free-tier
 * cap was silently fail-open. Server-only module (imported by the
 * download API route); the key never reaches a client bundle.
 */
function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/**
 * Count preset downloads this user has made IN THE CURRENT CALENDAR MONTH.
 *
 * Quota is per-month, not all-time: a free user gets a fresh 5 each
 * month, on the 1st, by clock. PDF downloads are not counted (PDFs stay
 * unlimited / email-gated for the free tier).
 *
 * The query is backed by recipe_downloads_user_month_idx (migration 019),
 * so even a heavy user with hundreds of historical rows hits the index
 * for the current-month window.
 */
export async function getDownloadCount(userId: string): Promise<number> {
  const supabase = createClient();

  // First of the current month, in UTC. We use UTC so quota resets at a
  // predictable instant globally rather than drifting with the user's
  // local timezone. The resulting `monthStart` ISO string is comparable
  // against the `created_at` column directly.
  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();

  const { count, error } = await supabase
    .from("recipe_downloads")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("download_type", "preset")
    .gte("created_at", monthStart);

  if (error) {
    // Throw — do NOT return 0. "Count failed" returned as "0 used" made
    // the free-tier cap silently fail-open (the exact bug class this
    // module's header documents having shipped once already). Callers
    // treat a throw as "can't verify quota" → 503.
    throw new Error(`download count failed: ${error.message}`);
  }

  return count ?? 0;
}

/**
 * Check whether a user can download a preset right now.
 *
 * Priority order:
 *   1. Paid roles (pass, pro, admin, super_admin) — always allowed
 *   2. Free role — allowed only if monthly count < FREE_DOWNLOAD_LIMIT
 *
 * Non-free roles return `remaining: Infinity` so the UI can render
 * "Unlimited" rather than a stale finite number. Free returns an honest
 * remaining count so the DownloadCounter can show "3 of 5 free downloads".
 */
export async function canDownload(
  userId: string,
  role: string,
): Promise<{ allowed: boolean; remaining: number }> {
  if (role !== "free") {
    return { allowed: true, remaining: Infinity };
  }

  const count = await getDownloadCount(userId);
  const remaining = Math.max(0, FREE_DOWNLOAD_LIMIT - count);

  return {
    allowed: remaining > 0,
    remaining,
  };
}
