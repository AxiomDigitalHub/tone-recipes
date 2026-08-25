import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "@/lib/oauth-discovery";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { canRequestTone } from "@/lib/tone-request-quota";
import { PUBLIC_COLUMNS, type ToneRequest } from "@/lib/db/tone-requests";
import {
  getAuthenticatedSupabase,
  getUserFromRequest,
} from "@/lib/auth/request-user";

export const runtime = "nodejs";

const VALID_PARTS = new Set([
  "lead guitar",
  "rhythm guitar",
  "bass",
  "synth/keys",
  "other",
]);

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */
// Request auth lives in @/lib/auth/request-user (shared with the download
// and admin routes).

/** Infinity doesn't survive JSON — admins read `remaining: null` as unlimited. */
function quotaPayload(q: { remaining: number; limit: number; used: number }) {
  return {
    used: q.used,
    limit: Number.isFinite(q.limit) ? q.limit : null,
    remaining: Number.isFinite(q.remaining) ? q.remaining : null,
  };
}

/* -------------------------------------------------------------------------- */
/*  GET — quota status for the signed-in user                                  */
/* -------------------------------------------------------------------------- */

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized({ error: "Sign in required." });
  }

  // Fail closed: an unreadable count is "can't verify", never "0 used".
  try {
    const quota = await canRequestTone(user.id, user.role);
    return NextResponse.json(quotaPayload(quota));
  } catch (err) {
    console.error("[tone-requests] quota read failed:", err);
    return NextResponse.json(
      { error: "Couldn't check your quota. Try again in a minute." },
      { status: 503 },
    );
  }
}

/* -------------------------------------------------------------------------- */
/*  POST — submit a tone request (signed-in, metered per plan)                 */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  // 10 submissions per minute per IP — generous for humans, hostile to loops.
  const { limited } = rateLimit(`tone-request:${getClientIp(req)}`, 10, 60_000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return unauthorized({ error: "Sign in to request a tone." });
    }

    const body = await req.json();
    const song_name = String(body.song_name ?? "").trim();
    const artist_name = String(body.artist_name ?? "").trim();
    const part = String(body.part ?? "lead guitar").trim().toLowerCase();
    const description = String(body.description ?? "").trim();
    const reference_url = String(body.reference_url ?? "").trim();

    if (!song_name || !artist_name) {
      return NextResponse.json(
        { error: "Song name and artist are required." },
        { status: 400 },
      );
    }
    if (song_name.length > 200 || artist_name.length > 200) {
      return NextResponse.json(
        { error: "Song or artist name is too long." },
        { status: 400 },
      );
    }
    if (description.length > 1000) {
      return NextResponse.json(
        { error: "Description is too long (1000 characters max)." },
        { status: 400 },
      );
    }
    if (reference_url && !/^https?:\/\//i.test(reference_url)) {
      return NextResponse.json(
        { error: "Reference URL must start with http(s)://." },
        { status: 400 },
      );
    }
    if (!VALID_PARTS.has(part)) {
      return NextResponse.json({ error: "Invalid part." }, { status: 400 });
    }

    // Quota gate. 402 → the client renders an upgrade prompt, mirroring the
    // preset-download route. The DB trigger (migration 024) backstops this.
    // Fail closed on a quota-read error (503), never fail open.
    let quota;
    try {
      quota = await canRequestTone(user.id, user.role);
    } catch (err) {
      console.error("[tone-requests] quota read failed:", err);
      return NextResponse.json(
        { error: "Couldn't check your quota. Try again in a minute." },
        { status: 503 },
      );
    }
    if (!quota.allowed) {
      const isFree = user.role === "free";
      return NextResponse.json(
        {
          error: isFree
            ? `You've used your ${quota.limit} free tone requests this month. Upgrade to Pass for 10 a month.`
            : `You've used all ${quota.limit} tone requests for this month. Your quota resets on the 1st.`,
          ...quotaPayload(quota),
          ...(isFree ? { upgrade_url: "/pricing" } : {}),
        },
        { status: 402 },
      );
    }

    // Insert with the USER'S token so RLS ownership (requested_by = auth.uid())
    // and the quota trigger both apply — no service-role bypass.
    const supabase = getAuthenticatedSupabase(user.token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: row, error } = await (supabase.from("tone_requests") as any)
      .insert({
        song_name,
        artist_name,
        part,
        description: description || null,
        reference_url: reference_url || null,
        requested_by: user.id,
        requested_by_email: user.email || null,
      })
      // NOT select("*"): migration 026 revoked SELECT on requested_by_email/
      // admin_notes for client roles, and INSERT ... RETURNING requires
      // SELECT on every returned column — a "*" here aborts the whole
      // insert with "permission denied for column". PUBLIC_COLUMNS is the
      // exact grant list from 026.
      .select(PUBLIC_COLUMNS)
      .single();

    if (error) {
      // Trigger backstop fired (route raced another submission).
      if (String(error.message).includes("tone_request_quota_exceeded")) {
        return NextResponse.json(
          { error: "Monthly tone request limit reached.", remaining: 0 },
          { status: 402 },
        );
      }
      console.error("Tone request insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit request. Please try again." },
        { status: 500 },
      );
    }

    const after = quotaPayload({
      used: quota.used + 1,
      limit: quota.limit,
      remaining: Number.isFinite(quota.remaining)
        ? quota.remaining - 1
        : quota.remaining,
    });

    return NextResponse.json({ request: row as ToneRequest, ...after });
  } catch (err) {
    console.error("Tone request route error:", err);
    return NextResponse.json(
      { error: "Unable to process request. Please try again later." },
      { status: 500 },
    );
  }
}
