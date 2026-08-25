import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

/**
 * Bearer-token request authentication for API routes.
 *
 * This was previously copy-pasted (with drift) into four routes —
 * tone-requests, recipes/[slug]/download, admin/metrics, admin/growth.
 * Auth logic duplicated across files is where privilege bugs live; this is
 * now the single implementation.
 *
 * The client is constructed with the ANON key + the caller's JWT, so all
 * reads/writes made through it are RLS-scoped to the caller — no service
 * role here, ever.
 */

export interface RequestUser {
  id: string;
  email: string;
  /** profiles.role, defaulting to "free" when the profile row is missing. */
  role: string;
  /** profiles.is_moderator — admin surfaces accept this as an alternative
   * to role ∈ {admin, super_admin}, so a subscription webhook writing
   * `role` can never clobber admin access (see the Stripe webhook's
   * PROTECTED_ROLES note). */
  isModerator: boolean;
  /** The raw bearer token, for follow-up RLS-scoped clients. */
  token: string;
}

/** Anon-key client that forwards the user's JWT — every query is RLS-scoped. */
export function getAuthenticatedSupabase(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
}

/**
 * Resolve the caller from the Authorization header. Returns null for a
 * missing/invalid token or unconfigured Supabase env.
 */
export async function getUserFromRequest(
  req: NextRequest,
): Promise<RequestUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = getAuthenticatedSupabase(token);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_moderator")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    role: ((profile as { role?: string } | null)?.role as string) || "free",
    isModerator:
      (profile as { is_moderator?: boolean } | null)?.is_moderator === true,
    token,
  };
}

const ADMIN_ROLES = new Set(["admin", "super_admin"]);

/** True when the caller is an admin (role) or moderator (flag). */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const user = await getUserFromRequest(req);
  if (!user) return false;
  return ADMIN_ROLES.has(user.role) || user.isModerator;
}
