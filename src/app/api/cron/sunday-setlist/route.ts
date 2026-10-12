import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { songs, getRecipesBySongSlug, getArtistBySlug } from "@/lib/data";
import { sendSundaySetlist, type SetlistSong } from "@/lib/email";
import { findDraftForSunday, nextSundayLabel } from "@/lib/newsletter-draft";

/**
 * GET /api/cron/sunday-setlist
 *
 * The "Sunday Setlist" email (docs/research: the killer worship concept).
 * Fires from a GitHub Actions cron on Tuesdays (see
 * .github/workflows/sunday-setlist-cron.yml) — worship guitarists get
 * their setlist early in the week and need tones by Sunday, so Tuesday
 * is the purchase/learn trigger.
 *
 * Content comes from one of two places, in order:
 *
 *   1. A hand-researched draft in content/newsletters/ whose `sundayDate`
 *      matches the upcoming Sunday (see src/lib/newsletter-draft.ts). These
 *      are CCLI-chart-aware and carry real delay times, BPMs and snapshot
 *      names — this is the email we actually want to send.
 *   2. Failing that, an auto-generated setlist of worship songs that have
 *      recipes on the site, rotating by ISO week. A weaker email (its tone
 *      notes are just truncated recipe descriptions), but it keeps the
 *      newsletter from silently going dark when no draft was written.
 *
 * Either way it sends to every active newsletter subscriber via the existing
 * sendSundaySetlist() template, and reports which source it used.
 *
 * Auth: the workflow attaches `Authorization: Bearer ${CRON_SECRET}`. We
 * reject anything else so the endpoint can't be triggered publicly to spam
 * the list. CRON_SECRET lives in GitHub secrets + the droplet env.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SONGS_PER_EMAIL = 5;
const WORSHIP_GENRES = new Set(["worship", "ccm"]);

/** ISO-8601 week number — drives the deterministic weekly rotation. */
function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Trim a recipe description to a tight 2-sentence tone note. */
function toneNote(description: string): string {
  const sentences = description.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]+/g) ?? [description];
  const note = sentences.slice(0, 2).join(" ").trim();
  return note.length > 280 ? note.slice(0, 277).trimEnd() + "…" : note;
}

export async function GET(req: NextRequest) {
  // ---- Cron auth ----
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[sunday-setlist] CRON_SECRET not set");
    return NextResponse.json({ error: "Cron not configured." }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // ---- Env guards ----
  if (!process.env.RESEND_API_KEY) {
    console.error("[sunday-setlist] RESEND_API_KEY not set — cannot send");
    return NextResponse.json({ error: "Email not configured." }, { status: 503 });
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) {
    console.error("[sunday-setlist] Supabase service role not configured");
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ---- Recipients ----
  // `?test=<email>` (still requires the valid CRON_SECRET above) sends the
  // real email to a single address only — for verifying delivery/rendering
  // without blasting the whole list. Otherwise: every active subscriber.
  const testEmail = req.nextUrl.searchParams.get("test");
  const isTest = Boolean(testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail));

  let to: string[];
  if (isTest) {
    to = [testEmail as string];
  } else {
    const { data: subs, error: subsError } = await admin
      .from("newsletter_subscribers")
      .select("email")
      .is("unsubscribed_at", null);
    if (subsError) {
      console.error("[sunday-setlist] subscriber query failed:", subsError.message);
      return NextResponse.json({ error: "Subscriber query failed." }, { status: 500 });
    }
    to = (subs ?? []).map((s) => (s as { email: string }).email).filter(Boolean);
  }
  if (to.length === 0) {
    console.log("[sunday-setlist] no active subscribers — nothing to send");
    return NextResponse.json({ sent: 0, reason: "no active subscribers" });
  }

  // ---- Content: a hand-researched draft if one exists, else generated ----
  const now = new Date();
  const sundayDate = nextSundayLabel(now);

  let source: "draft" | "generated";
  let subject: string;
  let intro: string;
  let outro: string | undefined;
  let setlistSongs: SetlistSong[];
  /** Recipe/song slugs for the event log — empty for draft-sourced sends. */
  let songSlugs: string[] = [];

  const lookup = findDraftForSunday(sundayDate, now);

  if (lookup.draft) {
    const { draft, file } = lookup.draft;
    source = "draft";
    subject = draft.subject;
    intro = draft.intro;
    outro = draft.outro;
    setlistSongs = draft.songs;
    console.log(`[sunday-setlist] using draft ${file} (${draft.songs.length} songs)`);
  } else {
    // No usable draft. Say why — this is the line that tells you whether the
    // researched email is being skipped for a fixable reason (bad sundayDate,
    // failed validation) rather than because nobody wrote one.
    console.warn(`[sunday-setlist] falling back to generated setlist: ${lookup.reason}`);

    // Stable sort so the weekly rotation is deterministic and idempotent.
    const eligible = songs
      .filter((s) => s.genres.some((g) => WORSHIP_GENRES.has(g)))
      .filter((s) => getRecipesBySongSlug(s.slug).length > 0)
      .sort((a, b) => a.slug.localeCompare(b.slug));

    if (eligible.length === 0) {
      console.error("[sunday-setlist] no worship songs with recipes — aborting");
      return NextResponse.json({ error: "No eligible content." }, { status: 500 });
    }

    const start = (isoWeek(now) * SONGS_PER_EMAIL) % eligible.length;
    const picks = Array.from({ length: Math.min(SONGS_PER_EMAIL, eligible.length) }, (_, i) =>
      eligible[(start + i) % eligible.length],
    );

    source = "generated";
    songSlugs = picks.map((p) => p.slug);
    subject = `Sunday Setlist: ${picks[0].title} & ${picks.length - 1} more`;
    intro =
      `Your setlist's in. Here are tones for ${picks.length} songs you might be ` +
      `playing this Sunday — amp, snapshot, and the recipe to dial each one in. ` +
      `Got the rest of the set? Reply and we'll point you at the right tones.`;
    setlistSongs = picks.map((song) => {
      const recipe = getRecipesBySongSlug(song.slug)[0];
      const artist = getArtistBySlug(song.artist_slug);
      return {
        title: song.title,
        artist: artist?.name ?? song.artist_slug,
        tone: toneNote(recipe.description),
        links: [{ label: "Get this tone", url: `/recipe/${recipe.slug}` }],
      };
    });
  }

  // ---- Send ----
  const result = await sendSundaySetlist({
    to,
    subject,
    intro,
    sundayDate,
    songs: setlistSongs,
    outro,
  });

  if (!result.success) {
    return NextResponse.json({ error: "Send failed.", detail: String(result.error) }, { status: 500 });
  }

  // ---- Log the send for the funnel/admin view (skip test fires) ----
  if (!isTest) {
    await admin.from("events").insert({
      name: "newsletter_sent",
      params: {
        type: "sunday_setlist",
        recipients: result.sent,
        source,
        songs: songSlugs,
        titles: setlistSongs.map((s) => s.title),
        sunday_date: sundayDate,
      },
    } as never);
  }

  console.log(
    `[sunday-setlist]${isTest ? " TEST" : ""} sent to ${result.sent} ` +
      `recipient${result.sent === 1 ? "" : "s"} (${setlistSongs.length} songs, ${source})`,
  );
  return NextResponse.json({
    sent: result.sent,
    test: isTest,
    source,
    songs: setlistSongs.map((s) => s.title),
    sundayDate,
  });
}
