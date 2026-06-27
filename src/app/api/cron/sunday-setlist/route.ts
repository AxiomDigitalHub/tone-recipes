import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { songs, getRecipesBySongSlug, getArtistBySlug } from "@/lib/data";
import { sendSundaySetlist, type SetlistSong } from "@/lib/email";

/**
 * GET /api/cron/sunday-setlist
 *
 * The "Sunday Setlist" email (docs/research: the killer worship concept).
 * Fires from a Vercel Cron on Tuesdays — worship guitarists get their
 * setlist early in the week and need tones by Sunday, so Tuesday is the
 * purchase/learn trigger.
 *
 * It is fully automated: it assembles a setlist of worship songs that
 * actually have recipes on the site, rotating the window each week (by ISO
 * week number) so the email is fresh, then sends to every active newsletter
 * subscriber via the existing sendSundaySetlist() template.
 *
 * Auth: Vercel Cron attaches `Authorization: Bearer ${CRON_SECRET}`. We
 * reject anything else so the endpoint can't be triggered publicly to spam
 * the list. Configure CRON_SECRET in Vercel.
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

/** Next upcoming Sunday, formatted like "June 29". */
function nextSundayLabel(from: Date): string {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + ((7 - d.getUTCDay()) % 7 || 7));
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
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

  // ---- Build the setlist from worship songs that actually have recipes ----
  // Stable sort so the weekly rotation is deterministic and idempotent.
  const eligible = songs
    .filter((s) => s.genres.some((g) => WORSHIP_GENRES.has(g)))
    .filter((s) => getRecipesBySongSlug(s.slug).length > 0)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (eligible.length === 0) {
    console.error("[sunday-setlist] no worship songs with recipes — aborting");
    return NextResponse.json({ error: "No eligible content." }, { status: 500 });
  }

  const now = new Date();
  const start = (isoWeek(now) * SONGS_PER_EMAIL) % eligible.length;
  const picks = Array.from({ length: Math.min(SONGS_PER_EMAIL, eligible.length) }, (_, i) =>
    eligible[(start + i) % eligible.length],
  );

  const setlistSongs: SetlistSong[] = picks.map((song) => {
    const recipe = getRecipesBySongSlug(song.slug)[0];
    const artist = getArtistBySlug(song.artist_slug);
    return {
      title: song.title,
      artist: artist?.name ?? song.artist_slug,
      tone: toneNote(recipe.description),
      links: [{ label: "Get this tone", url: `/recipe/${recipe.slug}` }],
    };
  });

  const sundayDate = nextSundayLabel(now);

  // ---- Send ----
  const result = await sendSundaySetlist({
    to,
    subject: `Sunday Setlist: ${picks[0].title} & ${picks.length - 1} more`,
    intro:
      `Your setlist's in. Here are tones for ${picks.length} songs you might be ` +
      `playing this Sunday — amp, snapshot, and the recipe to dial each one in. ` +
      `Got the rest of the set? Reply and we'll point you at the right tones.`,
    sundayDate,
    songs: setlistSongs,
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
        songs: picks.map((p) => p.slug),
        sunday_date: sundayDate,
      },
    } as never);
  }

  console.log(
    `[sunday-setlist]${isTest ? " TEST" : ""} sent to ${result.sent} ` +
      `recipient${result.sent === 1 ? "" : "s"} (${picks.length} songs)`,
  );
  return NextResponse.json({
    sent: result.sent,
    test: isTest,
    songs: picks.map((p) => p.slug),
    sundayDate,
  });
}
