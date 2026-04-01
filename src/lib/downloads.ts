import { createClient } from "@/lib/db/client";
import { FREE_DOWNLOAD_LIMIT } from "@/lib/permissions";

export { FREE_DOWNLOAD_LIMIT };

/**
 * Count the number of preset downloads a user has made.
 * Only counts "preset" type downloads (PDFs are unlimited / email-gated).
 */
export async function getDownloadCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("recipe_downloads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("download_type", "preset");

  if (error) {
    console.error("Error fetching download count:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * Check whether a user can download a preset.
 * Premium / creator / admin users have unlimited downloads.
 * Free users get FREE_DOWNLOAD_LIMIT preset downloads.
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
