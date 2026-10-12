/**
 * Sunday Setlist draft loading + validation.
 *
 * The hand-researched drafts in content/newsletters/ are the *real* email:
 * CCLI-chart-aware song picks with actual delay times, BPMs and snapshot
 * names ("coordinates, not vibes"). They used to be readable only by
 * scripts/send-sunday-setlist.ts, which nothing automated ever called — so
 * subscribers got the cron route's auto-generated fallback instead, whose
 * "tone notes" are just recipe descriptions truncated to two sentences.
 *
 * This module is the shared seam: the cron route prefers a draft and the
 * send script validates against the same rules, so a draft that passes
 * locally is a draft the route will send.
 *
 * content/ is COPY'd into the runtime image (see Dockerfile), so the
 * process.cwd() reads below work in production exactly as src/lib/blog.ts's do.
 */

import fs from "node:fs";
import path from "node:path";
import type { SetlistSong } from "./email";

export interface SetlistDraft {
  subject: string;
  sundayDate: string;
  intro: string;
  songs: SetlistSong[];
  outro?: string;
}

export const NEWSLETTER_DIR = path.join(process.cwd(), "content", "newsletters");

/** A draft authored more than this many days ago is never auto-sent. */
const MAX_DRAFT_AGE_DAYS = 14;

/**
 * Next upcoming Sunday, formatted like "June 29".
 *
 * Shared so the label a draft is matched on is produced by exactly one
 * function. Called on a Sunday it returns the Sunday *following* — the cron
 * fires Tuesdays, and a manual Sunday run shouldn't retarget the same day.
 */
export function nextSundayLabel(from: Date): string {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + ((7 - d.getUTCDay()) % 7 || 7));
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
}

/**
 * Structural validation. Returns a list of human-readable problems; empty
 * means the draft is sendable. Deliberately returns rather than throws so
 * the route can log-and-fall-back while the script can fail hard.
 */
export function validateDraft(raw: unknown): string[] {
  const errors: string[] = [];
  if (typeof raw !== "object" || raw === null) return ["draft is not an object"];
  const d = raw as Partial<SetlistDraft>;

  if (!d.subject?.trim()) errors.push("missing subject");
  if (!d.sundayDate?.trim()) errors.push("missing sundayDate");
  if (!d.intro?.trim()) errors.push("missing intro");

  if (!Array.isArray(d.songs) || d.songs.length < 3) {
    errors.push("needs at least 3 songs");
    return errors;
  }

  for (const s of d.songs) {
    const label = s?.title ? `song "${s.title}"` : `song ${JSON.stringify(s)?.slice(0, 60)}`;
    if (!s?.title?.trim() || !s?.artist?.trim() || !s?.tone?.trim()) {
      errors.push(`${label} is incomplete (needs title, artist, tone)`);
      continue;
    }
    // The brand promise is coordinates, not vibes — a tone note with no
    // number in it has no delay time, no BPM and no snapshot to act on.
    if (!/\d/.test(s.tone)) {
      errors.push(`${label} tone note contains no number (BPM / ms / snapshot)`);
    }
    if (!Array.isArray(s.links) || s.links.length === 0) {
      errors.push(`${label} has no site links — every song must link back to F&K`);
      continue;
    }
    for (const l of s.links) {
      if (!l?.url?.startsWith("/")) {
        errors.push(`${label} link must be a site-relative URL: ${l?.url}`);
      }
      if (!l?.label?.trim()) errors.push(`${label} has a link with no label`);
    }
  }

  return errors;
}

/** Parse `sunday-setlist-YYYY-MM-DD.json` → the authoring date, or null. */
function authoredOn(filename: string): Date | null {
  const m = /^sunday-setlist-(\d{4})-(\d{2})-(\d{2})\.json$/.exec(filename);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? null : d;
}

export interface LoadedDraft {
  draft: SetlistDraft;
  file: string;
}

export interface DraftLookup {
  draft?: LoadedDraft;
  /** Why no draft was used — for logging. Absent when one was found. */
  reason?: string;
}

/**
 * Find the draft written for `sundayLabel` (e.g. "October 18").
 *
 * Matching on the draft's own sundayDate rather than on the filename is what
 * makes a stale draft un-sendable: last week's file simply doesn't match, so
 * the caller falls back instead of emailing an out-of-date setlist. The
 * age window additionally stops a draft from a previous year matching on a
 * recycled month/day label.
 */
export function findDraftForSunday(
  sundayLabel: string,
  now: Date = new Date(),
  dir: string = NEWSLETTER_DIR,
): DraftLookup {
  if (!fs.existsSync(dir)) return { reason: `no newsletters directory at ${dir}` };

  const candidates = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse(); // newest authoring date first

  if (candidates.length === 0) return { reason: "no draft JSON files found" };

  const skipped: string[] = [];

  for (const file of candidates) {
    const authored = authoredOn(file);
    if (!authored) {
      skipped.push(`${file}: filename is not sunday-setlist-YYYY-MM-DD.json`);
      continue;
    }

    const ageDays = (now.getTime() - authored.getTime()) / 86_400_000;
    if (ageDays > MAX_DRAFT_AGE_DAYS) {
      // Sorted newest-first, so everything after this is older still.
      skipped.push(`${file}: authored ${Math.round(ageDays)}d ago (max ${MAX_DRAFT_AGE_DAYS}d)`);
      break;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch (err) {
      skipped.push(`${file}: unparseable JSON (${(err as Error).message})`);
      continue;
    }

    const draft = parsed as SetlistDraft;
    if (draft?.sundayDate?.trim() !== sundayLabel) {
      skipped.push(`${file}: sundayDate "${draft?.sundayDate}" != "${sundayLabel}"`);
      continue;
    }

    const errors = validateDraft(parsed);
    if (errors.length > 0) {
      skipped.push(`${file}: invalid (${errors.join("; ")})`);
      continue;
    }

    return { draft: { draft, file } };
  }

  return { reason: `no draft matched "${sundayLabel}" — ${skipped.join(" | ")}` };
}
