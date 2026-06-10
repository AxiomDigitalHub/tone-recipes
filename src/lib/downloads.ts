import { createClient } from "@/lib/db/client";
import { FREE_DOWNLOAD_LIMIT } from "@/lib/permissions";

export { FREE_DOWNLOAD_LIMIT };

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
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("download_type", "preset")
    .gte("created_at", monthStart);

  if (error) {
    console.error("Error fetching download count:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * Check whether a user can download a preset right now.
 *
 * Priority order:
 *   1. `legacyUnlimited` flag (grandfathered accounts) — always allowed
 *   2. Paid roles (pass, premium, creator, admin, super_admin) — always allowed
 *   3. Free role — allowed only if monthly count < FREE_DOWNLOAD_LIMIT
 *
 * The two non-free paths return `remaining: Infinity` so the UI can
 * render "Unlimited" rather than a stale finite number. Free returns
 * an honest remaining count so the DownloadCounter component can show
 * "3 of 5 free downloads this month".
 */
export async function canDownload(
  userId: string,
  role: string,
  legacyUnlimited: boolean = false,
): Promise<{ allowed: boolean; remaining: number }> {
  if (legacyUnlimited) {
    return { allowed: true, remaining: Infinity };
  }
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
