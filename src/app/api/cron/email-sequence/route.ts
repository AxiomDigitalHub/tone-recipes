import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSequenceEmail, getSequenceStep, type SequenceName } from "@/lib/email";

/**
 * GET /api/cron/email-sequence
 *
 * Drains email_sequence_queue (migration 025; spec: docs/WELCOME_SEQUENCE.md).
 * Fires hourly from GitHub Actions (.github/workflows/email-sequence-cron.yml)
 * so the "instant" step A1 lands within the hour of signup, and the day-3 /
 * day-5 / day-7 steps land in the hour they come due.
 *
 * Suppression happens HERE, at send time (not enqueue time):
 *   - any step: skipped + cancelled if the address has unsubscribed
 *   - account step 3 (the Pass/Pro upsell): skipped + cancelled if the user's
 *     role is anything but 'free' — a paid user getting the upsell is the one
 *     email that reads as machine-blind
 *   - newsletter step 2 (create-an-account nudge): skipped + cancelled if the
 *     email now has an account
 * Failed sends are left in the queue and retried on the next hourly run.
 *
 * Test mode: `?test=<email>` (still requires CRON_SECRET) sends EVERY step in
 * both sequences to that one address immediately, without touching the queue
 * or event log. Used to proof the rendering and copy:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     "https://faderandknob.com/api/cron/email-sequence?test=daniel.livengood@gmail.com"
 *
 * Auth: same pattern as sunday-setlist — Bearer CRON_SECRET, reject otherwise.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_LIMIT = 200;

/** Every defined step, for test mode and validation. */
const ALL_STEPS: { sequence: SequenceName; step: number }[] = [
  { sequence: "account", step: 1 },
  { sequence: "account", step: 2 },
  { sequence: "account", step: 3 },
  { sequence: "newsletter", step: 2 },
];

interface QueueRow {
  id: string;
  email: string;
  user_id: string | null;
  sequence: SequenceName;
  step: number;
}

interface EmailContext {
  has_profile: boolean | null;
  user_role: string | null;
  unsubscribed: boolean | null;
}

export async function GET(req: NextRequest) {
  // ---- Cron auth ----
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[email-sequence] CRON_SECRET not set");
    return NextResponse.json({ error: "Cron not configured." }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // ---- Env guards ----
  if (!process.env.RESEND_API_KEY) {
    console.error("[email-sequence] RESEND_API_KEY not set — cannot send");
    return NextResponse.json({ error: "Email not configured." }, { status: 503 });
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) {
    console.error("[email-sequence] Supabase service role not configured");
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ---- Test mode: proof every step to one address, touch nothing ----
  const testEmail = req.nextUrl.searchParams.get("test");
  if (testEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      return NextResponse.json({ error: "Invalid test email." }, { status: 400 });
    }
    const results: Record<string, boolean> = {};
    for (const s of ALL_STEPS) {
      const r = await sendSequenceEmail({ to: testEmail, ...s });
      results[`${s.sequence}:${s.step}`] = r.success;
    }
    console.log(`[email-sequence] TEST sent all steps to ${testEmail}`, results);
    return NextResponse.json({ test: true, to: testEmail, results });
  }

  // ---- Fetch due rows ----
  const { data: due, error: dueError } = await admin
    .from("email_sequence_queue")
    .select("id, email, user_id, sequence, step")
    .is("sent_at", null)
    .is("cancelled_at", null)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true })
    .limit(BATCH_LIMIT);

  if (dueError) {
    console.error("[email-sequence] queue query failed:", dueError.message);
    return NextResponse.json({ error: "Queue query failed." }, { status: 500 });
  }

  const rows = (due ?? []) as QueueRow[];
  if (rows.length === 0) {
    return NextResponse.json({ sent: 0, cancelled: 0, failed: 0, reason: "queue empty" });
  }

  let sent = 0;
  let cancelled = 0;
  let failed = 0;

  const cancel = async (row: QueueRow, reason: string) => {
    await admin
      .from("email_sequence_queue")
      .update({ cancelled_at: new Date().toISOString(), cancel_reason: reason } as never)
      .eq("id", row.id);
    cancelled++;
  };

  for (const row of rows) {
    if (!getSequenceStep(row.sequence, row.step)) {
      await cancel(row, "unknown_step");
      continue;
    }

    // ---- Send-time suppression ----
    const { data: ctxRows, error: ctxError } = await admin.rpc("sequence_email_context", {
      p_email: row.email,
    });
    if (ctxError) {
      // Can't evaluate suppression safely — leave the row for the next run.
      console.error(`[email-sequence] context rpc failed for ${row.email}:`, ctxError.message);
      failed++;
      continue;
    }
    const ctx = ((ctxRows ?? []) as EmailContext[])[0] ?? {
      has_profile: false,
      user_role: null,
      unsubscribed: false,
    };

    if (ctx.unsubscribed) {
      await cancel(row, "unsubscribed");
      continue;
    }
    if (row.sequence === "account" && row.step === 3 && ctx.user_role && ctx.user_role !== "free") {
      await cancel(row, "already_paid");
      continue;
    }
    if (row.sequence === "newsletter" && row.step === 2 && ctx.has_profile) {
      await cancel(row, "has_account");
      continue;
    }

    // ---- Send ----
    const result = await sendSequenceEmail({
      to: row.email,
      sequence: row.sequence,
      step: row.step,
    });
    if (result.success) {
      await admin
        .from("email_sequence_queue")
        .update({ sent_at: new Date().toISOString() } as never)
        .eq("id", row.id);
      sent++;
    } else {
      failed++; // retried next hour
    }
  }

  // ---- Log the run for the funnel/admin view ----
  if (sent > 0 || cancelled > 0) {
    await admin.from("events").insert({
      name: "sequence_emails_sent",
      params: { sent, cancelled, failed, batch: rows.length },
    } as never);
  }

  console.log(`[email-sequence] sent=${sent} cancelled=${cancelled} failed=${failed} of ${rows.length} due`);
  return NextResponse.json({ sent, cancelled, failed, batch: rows.length });
}
