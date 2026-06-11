/**
 * Send the weekly "Sunday Setlist" email from a draft JSON file.
 *
 * The draft is produced by the sunday-setlist scheduled routine (or by hand)
 * at content/newsletters/sunday-setlist-YYYY-MM-DD.json:
 *
 *   {
 *     "subject": "Sunday Setlist — June 14: 6 songs, 3 snapshots",
 *     "sundayDate": "June 14",
 *     "intro": "...",
 *     "songs": [
 *       { "title": "...", "artist": "...", "tone": "...",
 *         "links": [{ "label": "Dotted-eighth guide", "url": "/blog/..." }] }
 *     ],
 *     "outro": "..."
 *   }
 *
 * Flags:
 *   --file=<path>     Draft JSON (required)
 *   --test=<email>    Send only to this address
 *   --dry-run         Print plan + recipient count, don't send
 *   --yes             Skip interactive confirmation
 *
 * Required env: RESEND_API_KEY, NEXT_PUBLIC_SUPABASE_URL,
 *               SUPABASE_SERVICE_ROLE_KEY, NEWSLETTER_UNSUBSCRIBE_SECRET.
 *
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/send-sunday-setlist.ts --file=content/newsletters/sunday-setlist-2026-06-16.json --test=you@example.com
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline/promises";
import { sendSundaySetlist, type SetlistSong } from "../src/lib/email";

interface Draft {
  subject: string;
  sundayDate: string;
  intro: string;
  songs: SetlistSong[];
  outro?: string;
}

interface Args {
  file?: string;
  test?: string;
  dryRun: boolean;
  yes: boolean;
}

function parseArgs(): Args {
  const out: Args = { dryRun: false, yes: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--yes") out.yes = true;
    else if (a.startsWith("--file=")) out.file = a.slice(7);
    else if (a.startsWith("--test=")) out.test = a.slice(7);
  }
  return out;
}

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function validateDraft(d: unknown): Draft {
  const draft = d as Draft;
  if (!draft.subject) fail("draft missing subject");
  if (!draft.sundayDate) fail("draft missing sundayDate");
  if (!draft.intro) fail("draft missing intro");
  if (!Array.isArray(draft.songs) || draft.songs.length < 3)
    fail("draft needs at least 3 songs");
  for (const s of draft.songs) {
    if (!s.title || !s.artist || !s.tone) fail(`song incomplete: ${JSON.stringify(s)}`);
    if (!Array.isArray(s.links) || s.links.length === 0)
      fail(`song "${s.title}" has no site links — every song must link back to F&K`);
    for (const l of s.links) {
      if (!l.url?.startsWith("/")) fail(`song "${s.title}" link must be a site-relative URL: ${l.url}`);
    }
  }
  return draft;
}

async function loadSubscribers(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) fail("Supabase env vars missing.");
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .is("unsubscribed_at", null);
  if (error) fail(`Supabase read failed: ${error.message}`);
  const emails = ((data as { email: string }[] | null) ?? [])
    .map((r) => r.email.trim().toLowerCase())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  return [...new Set(emails)];
}

async function confirm(prompt: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = (await rl.question(prompt)).trim().toLowerCase();
  rl.close();
  return ans === "y" || ans === "yes";
}

async function main() {
  const args = parseArgs();
  if (!args.file) fail("--file=<draft.json> required");

  if (!process.env.RESEND_API_KEY) fail("RESEND_API_KEY not set");
  if (!process.env.NEWSLETTER_UNSUBSCRIBE_SECRET)
    fail("NEWSLETTER_UNSUBSCRIBE_SECRET not set — needed for unsubscribe links");

  const draft = validateDraft(JSON.parse(readFileSync(args.file, "utf8")));

  let recipients: string[];
  if (args.test) {
    recipients = [args.test.trim().toLowerCase()];
    console.log(`Test mode: sending only to ${recipients[0]}`);
  } else {
    recipients = await loadSubscribers();
  }

  console.log("");
  console.log("Sunday Setlist — plan");
  console.log("─────────────────────");
  console.log(`Subject:      ${draft.subject}`);
  console.log(`Songs:        ${draft.songs.map((s) => s.title).join(" · ")}`);
  console.log(`Recipients:   ${recipients.length}`);
  console.log("");

  if (args.dryRun) {
    console.log("Dry run — no email sent.");
    return;
  }
  if (recipients.length === 0) {
    console.log("No recipients — nothing to do.");
    return;
  }
  if (!args.yes) {
    const ok = await confirm(`Send to ${recipients.length} recipient(s)? [y/N] `);
    if (!ok) {
      console.log("Aborted.");
      return;
    }
  }

  const result = await sendSundaySetlist({
    to: recipients,
    subject: draft.subject,
    intro: draft.intro,
    sundayDate: draft.sundayDate,
    songs: draft.songs,
    outro: draft.outro,
  });

  if (result.success) {
    console.log(`✓ Sent to ${result.sent} recipient(s).`);
  } else {
    fail(`Send failed: ${(result.error as Error | undefined)?.message ?? "unknown"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
