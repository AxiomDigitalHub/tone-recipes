/**
 * Weekly scorecard — the Monday-morning number that decides the week.
 *
 * North star: **Weekly Tones Deployed** — preset + recipe-PDF downloads by
 * SIGNED-IN users in the last 7 days. Not pageviews, not sessions, not
 * "AI mentions". A tone deployed is a guitarist who has our sound in their
 * rig; it is the only event that is simultaneously the product working, the
 * user getting value, and the leading indicator of a paid conversion.
 *
 * Everything else on this scorecard exists to explain a move in that number:
 *   new accounts        → is the top of the funnel filling?
 *   activation rate     → do new accounts ever get their first tone?
 *   4-week return rate  → does it become a habit, or a one-night stand?
 *   downloads/active    → depth of use among people who show up
 *   QUOTA HITS          → free users who hit the 5/month cap. Nobody watches
 *                         this today. It is the most direct revenue signal
 *                         we own: a person who ran out of downloads has
 *                         already told us they want more than free.
 *   tone requests       → demand we've promised to fulfil, and how stale it is
 *
 * Usage:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/weekly-metrics.ts
 *   npx tsx scripts/weekly-metrics.ts --json      # machine-readable
 *   npx tsx scripts/weekly-metrics.ts --weeks=12  # trend window (default 8)
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * If either is missing this prints the exact SQL it WOULD run and exits 0 —
 * so it stays useful (and copy-pasteable into the Supabase SQL editor) on a
 * machine with no secrets, and never fails a CI step.
 *
 * Read-only. No writes, no side effects. Safe to run any number of times.
 */

import { createClient } from "@supabase/supabase-js";
import { FREE_DOWNLOAD_LIMIT } from "../src/lib/permissions";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

/** Downloads that count as a "tone deployed". PDFs count: a printed recipe
 *  played off a music stand is the tone deployed just as much as a .hlx. */
const TONE_DOWNLOAD_TYPES = ["preset", "pdf"] as const;

/** Activation window: a new account has this long to pull its first tone. */
const ACTIVATION_WINDOW_DAYS = 7;

/** Free users this close to the cap are the pre-emptive upgrade audience. */
const NEAR_QUOTA_THRESHOLD = FREE_DOWNLOAD_LIMIT - 1;

const PAID_ROLES = new Set(["pass", "pro", "premium", "creator"]);
const STAFF_ROLES = new Set(["admin", "super_admin"]);

/* -------------------------------------------------------------------------- */
/*  Row shapes (only the columns we read)                                     */
/* -------------------------------------------------------------------------- */

interface DownloadRow {
  user_id: string | null;
  email: string | null;
  recipe_slug: string | null;
  download_type: string | null;
  created_at: string;
}

interface ProfileRow {
  id: string;
  role: string | null;
  created_at: string | null;
}

interface ToneRequestRow {
  id: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

function fmt(n: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(n ?? 0);
}

function pct(numerator: number, denominator: number): string {
  if (denominator <= 0) return "n/a";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function ratio(numerator: number, denominator: number): string {
  if (denominator <= 0) return "n/a";
  return (numerator / denominator).toFixed(2);
}

function rule(): void {
  console.log("─".repeat(66));
}

function heading(text: string): void {
  console.log("");
  console.log(text);
}

function line(label: string, value: string, note = ""): void {
  const padded = `  ${label}`.padEnd(34);
  console.log(note ? `${padded}${value.padEnd(12)}${note}` : `${padded}${value}`);
}

function ts(ms: number): string {
  return new Date(ms).toISOString();
}

function argValue(flag: string): string | null {
  const hit = process.argv.find((a) => a.startsWith(`--${flag}=`));
  return hit ? hit.slice(flag.length + 3) : null;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(`--${flag}`);
}

/** Sparkline for a small integer series. Cheap trend, no dependencies. */
function spark(values: number[]): string {
  if (values.length === 0) return "";
  const blocks = "▁▂▃▄▅▆▇█";
  const max = Math.max(...values);
  if (max === 0) return blocks[0].repeat(values.length);
  return values
    .map((v) => blocks[Math.min(blocks.length - 1, Math.round((v / max) * (blocks.length - 1)))])
    .join("");
}

/**
 * Supabase caps a select at 1000 rows. Page until exhausted so a busy month
 * doesn't silently truncate the denominator of every rate on this page.
 */
type PageResult = {
  data: unknown[] | null;
  error: { message: string } | null;
};

async function fetchAll<T>(
  /** Build a fresh query for one page — PostgREST builders are single-use. */
  build: (from: number, to: number) => PromiseLike<PageResult>,
): Promise<{ rows: T[]; error: string | null }> {
  const pageSize = 1000;
  const out: T[] = [];
  for (let page = 0; page < 200; page++) {
    const { data, error } = await build(
      page * pageSize,
      page * pageSize + pageSize - 1,
    );
    if (error) return { rows: out, error: error.message };
    const batch = (data ?? []) as T[];
    out.push(...batch);
    if (batch.length < pageSize) break;
  }
  return { rows: out, error: null };
}

/* -------------------------------------------------------------------------- */
/*  Dry run — the queries this script would issue                             */
/* -------------------------------------------------------------------------- */

function printDryRun(): void {
  console.log("");
  console.log("Fader & Knob — weekly metrics (DRY RUN)");
  console.log(
    "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — no queries were run.",
  );
  console.log("Run `set -a && source .env.local && set +a` first, or paste the SQL below");
  console.log("into the Supabase SQL editor. Every query is read-only.");
  rule();

  const queries: Array<{ title: string; sql: string }> = [
    {
      title: "1. NORTH STAR — Weekly Tones Deployed (last 7 days)",
      sql: `SELECT count(*)                        AS tones_deployed,
       count(DISTINCT user_id)            AS active_users,
       count(*) FILTER (WHERE download_type = 'preset') AS presets,
       count(*) FILTER (WHERE download_type = 'pdf')    AS pdfs
FROM recipe_downloads
WHERE created_at >= now() - interval '7 days'
  AND user_id IS NOT NULL
  AND download_type IN ('preset','pdf');`,
    },
    {
      title: "2. North-star trend (weekly buckets, 8 weeks)",
      sql: `SELECT date_trunc('week', created_at) AS week,
       count(*)                          AS tones_deployed,
       count(DISTINCT user_id)           AS active_users
FROM recipe_downloads
WHERE created_at >= now() - interval '8 weeks'
  AND user_id IS NOT NULL
  AND download_type IN ('preset','pdf')
GROUP BY 1 ORDER BY 1;`,
    },
    {
      title: "3. New accounts (last 7 days, by role)",
      sql: `SELECT coalesce(role,'free') AS role, count(*)
FROM profiles
WHERE created_at >= now() - interval '7 days'
GROUP BY 1 ORDER BY 2 DESC;`,
    },
    {
      title: "4. Activation rate — signup → first tone within 7 days",
      sql: `WITH cohort AS (
  SELECT id, created_at
  FROM profiles
  -- Cohort must be old enough to have had its full 7-day window.
  WHERE created_at >= now() - interval '35 days'
    AND created_at <  now() - interval '7 days'
)
SELECT count(*)                                   AS cohort_size,
       count(*) FILTER (WHERE d.first_dl IS NOT NULL) AS activated,
       round(100.0 * count(*) FILTER (WHERE d.first_dl IS NOT NULL)
             / nullif(count(*),0), 1)             AS activation_pct
FROM cohort c
LEFT JOIN LATERAL (
  SELECT min(created_at) AS first_dl
  FROM recipe_downloads r
  WHERE r.user_id = c.id
    AND r.download_type IN ('preset','pdf')
    AND r.created_at <= c.created_at + interval '7 days'
) d ON true;`,
    },
    {
      title: "5. 4-week return rate — active 4 weeks ago, active again this week",
      sql: `WITH cohort AS (
  SELECT DISTINCT user_id FROM recipe_downloads
  WHERE user_id IS NOT NULL
    AND download_type IN ('preset','pdf')
    AND created_at >= now() - interval '35 days'
    AND created_at <  now() - interval '28 days'
), returned AS (
  SELECT DISTINCT user_id FROM recipe_downloads
  WHERE user_id IS NOT NULL
    AND download_type IN ('preset','pdf')
    AND created_at >= now() - interval '7 days'
)
SELECT (SELECT count(*) FROM cohort)                              AS cohort,
       (SELECT count(*) FROM cohort c JOIN returned r USING (user_id)) AS retained;`,
    },
    {
      title: `6. QUOTA HITS — free users at/over the ${FREE_DOWNLOAD_LIMIT}/month preset cap (upgrade candidates)`,
      sql: `WITH usage AS (
  SELECT r.user_id, count(*) AS presets_this_month
  FROM recipe_downloads r
  WHERE r.download_type = 'preset'
    AND r.created_at >= date_trunc('month', now() AT TIME ZONE 'utc')
    AND r.user_id IS NOT NULL
  GROUP BY 1
)
SELECT p.id, p.email, u.presets_this_month
FROM usage u
JOIN profiles p ON p.id = u.user_id
WHERE coalesce(p.role,'free') = 'free'
  AND u.presets_this_month >= ${FREE_DOWNLOAD_LIMIT}
ORDER BY u.presets_this_month DESC;
-- ...and the warm list, one download from the wall:
--   AND u.presets_this_month = ${NEAR_QUOTA_THRESHOLD}`,
    },
    {
      title: "7. Tone requests — volume and backlog age",
      sql: `SELECT status, count(*),
       round(extract(epoch FROM avg(now() - created_at))/86400, 1) AS avg_age_days,
       round(extract(epoch FROM max(now() - created_at))/86400, 1) AS oldest_days
FROM tone_requests
GROUP BY status ORDER BY 2 DESC;

SELECT count(*) AS requests_last_7d
FROM tone_requests WHERE created_at >= now() - interval '7 days';`,
    },
    {
      title: "8. Top tones this week (what to write more of)",
      sql: `SELECT recipe_slug, count(*) AS n
FROM recipe_downloads
WHERE created_at >= now() - interval '7 days'
  AND download_type IN ('preset','pdf')
GROUP BY 1 ORDER BY 2 DESC LIMIT 10;`,
    },
  ];

  for (const q of queries) {
    console.log("");
    console.log(`-- ${q.title}`);
    console.log(q.sql);
  }

  console.log("");
  rule();
  console.log("NOT QUERYABLE TODAY (instrumentation gaps — see docs/MEASUREMENT_PLAN.md):");
  console.log("  · traffic source per download/signup  — no source column anywhere");
  console.log("  · quota-block events (HTTP 402)       — refusals are returned, never logged");
  console.log("  · AI crawler hits                     — no server-side UA log");
  console.log("");
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const asJson = hasFlag("json");
  const weeks = Math.max(2, Math.min(52, Number(argValue("weeks") ?? 8) || 8));

  if (!url || !key) {
    if (asJson) {
      console.log(
        JSON.stringify({ ok: false, reason: "missing_supabase_env" }, null, 2),
      );
    } else {
      printDryRun();
    }
    process.exit(0);
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = Date.now();
  const weekAgo = now - WEEK_MS;
  const trendStart = now - weeks * WEEK_MS;
  const monthStartIso = new Date(
    Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), 1),
  ).toISOString();
  // Pull enough history to cover the trend window, the retention cohort
  // (35d) and the activation cohort in one round trip.
  const historyStart = Math.min(trendStart, now - 60 * DAY_MS);

  /* ── Fetch ──────────────────────────────────────────────────────────── */

  const dl = await fetchAll<DownloadRow>((from, to) =>
    sb
      .from("recipe_downloads")
      .select("user_id, email, recipe_slug, download_type, created_at")
      .gte("created_at", ts(historyStart))
      .order("created_at", { ascending: true })
      .range(from, to),
  );
  if (dl.error) {
    console.error(`error: recipe_downloads read failed: ${dl.error}`);
    process.exit(1);
  }

  const pf = await fetchAll<ProfileRow>((from, to) =>
    sb
      .from("profiles")
      .select("id, role, created_at")
      .order("created_at", { ascending: true })
      .range(from, to),
  );
  if (pf.error) {
    console.error(`error: profiles read failed: ${pf.error}`);
    process.exit(1);
  }

  const tr = await fetchAll<ToneRequestRow>((from, to) =>
    sb
      .from("tone_requests")
      .select("id, status, created_at, updated_at")
      .order("created_at", { ascending: true })
      .range(from, to),
  );
  // Non-fatal: the scorecard is still useful without the request queue.
  const toneRequests = tr.error ? [] : tr.rows;

  const downloads = dl.rows;
  const profiles = pf.rows;

  const isTone = (r: DownloadRow): boolean =>
    r.download_type !== null &&
    (TONE_DOWNLOAD_TYPES as readonly string[]).includes(r.download_type);

  const tones = downloads.filter(isTone);
  const at = (r: { created_at: string | null }): number =>
    r.created_at ? new Date(r.created_at).getTime() : 0;

  /* ── 1. North star ──────────────────────────────────────────────────── */

  const thisWeek = tones.filter((r) => at(r) >= weekAgo && r.user_id);
  const prevWeek = tones.filter(
    (r) => at(r) >= weekAgo - WEEK_MS && at(r) < weekAgo && r.user_id,
  );
  const tonesDeployed = thisWeek.length;
  const tonesPrev = prevWeek.length;
  const activeUsers = new Set(thisWeek.map((r) => r.user_id)).size;
  const presets = thisWeek.filter((r) => r.download_type === "preset").length;
  const pdfs = thisWeek.filter((r) => r.download_type === "pdf").length;
  const anonTones = tones.filter((r) => at(r) >= weekAgo && !r.user_id).length;

  const trend: number[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const end = now - i * WEEK_MS;
    const start = end - WEEK_MS;
    trend.push(
      tones.filter((r) => r.user_id && at(r) >= start && at(r) < end).length,
    );
  }

  /* ── 2. New accounts ────────────────────────────────────────────────── */

  const newAccounts = profiles.filter((p) => at(p) >= weekAgo);
  const newAccountsPrev = profiles.filter(
    (p) => at(p) >= weekAgo - WEEK_MS && at(p) < weekAgo,
  ).length;

  /* ── 3. Activation (signup → first tone within 7 days) ──────────────── */
  // Cohort: accounts created 8–35 days ago, so every member has had a full
  // 7-day window. Including this week's signups would drag the rate down
  // with people who simply haven't had time yet.
  const firstToneByUser = new Map<string, number>();
  for (const r of tones) {
    if (!r.user_id) continue;
    const t = at(r);
    const prev = firstToneByUser.get(r.user_id);
    if (prev === undefined || t < prev) firstToneByUser.set(r.user_id, t);
  }

  const activationCohort = profiles.filter(
    (p) => at(p) >= now - 35 * DAY_MS && at(p) < weekAgo,
  );
  const activated = activationCohort.filter((p) => {
    const first = firstToneByUser.get(p.id);
    return first !== undefined && first <= at(p) + ACTIVATION_WINDOW_DAYS * DAY_MS;
  }).length;

  /* ── 4. 4-week return rate ──────────────────────────────────────────── */

  const cohortStart = now - 35 * DAY_MS;
  const cohortEnd = now - 28 * DAY_MS;
  const retentionCohort = new Set(
    tones
      .filter((r) => r.user_id && at(r) >= cohortStart && at(r) < cohortEnd)
      .map((r) => r.user_id as string),
  );
  const returnedSet = new Set(thisWeek.map((r) => r.user_id as string));
  let retained = 0;
  for (const u of retentionCohort) if (returnedSet.has(u)) retained++;

  /* ── 5. Quota hits — the unwatched revenue signal ────────────────────── */

  const roleById = new Map<string, string>();
  for (const p of profiles) roleById.set(p.id, p.role ?? "free");

  const presetsThisMonth = new Map<string, number>();
  for (const r of downloads) {
    if (!r.user_id) continue;
    if (r.download_type !== "preset") continue;
    if (r.created_at < monthStartIso) continue;
    presetsThisMonth.set(r.user_id, (presetsThisMonth.get(r.user_id) ?? 0) + 1);
  }

  let quotaHit = 0;
  let nearQuota = 0;
  const quotaHitUsers: Array<{ user_id: string; count: number }> = [];
  for (const [userId, count] of presetsThisMonth) {
    const role = roleById.get(userId) ?? "free";
    if (role !== "free") continue;
    if (count >= FREE_DOWNLOAD_LIMIT) {
      quotaHit++;
      quotaHitUsers.push({ user_id: userId, count });
    } else if (count >= NEAR_QUOTA_THRESHOLD) {
      nearQuota++;
    }
  }
  quotaHitUsers.sort((a, b) => b.count - a.count);

  const paidCount = profiles.filter((p) => PAID_ROLES.has(p.role ?? "free")).length;
  const staffCount = profiles.filter((p) => STAFF_ROLES.has(p.role ?? "free")).length;

  /* ── 6. Tone requests ───────────────────────────────────────────────── */

  const requestsThisWeek = toneRequests.filter((r) => at(r) >= weekAgo).length;
  const pending = toneRequests.filter(
    (r) => r.status === "pending" || r.status === "in_progress",
  );
  const pendingAges = pending
    .map((r) => (now - at(r)) / DAY_MS)
    .filter((d) => Number.isFinite(d) && d >= 0)
    .sort((a, b) => a - b);
  const oldestPending = pendingAges.length ? pendingAges[pendingAges.length - 1] : 0;
  const medianPending = pendingAges.length
    ? pendingAges[Math.floor(pendingAges.length / 2)]
    : 0;
  const completed = toneRequests.filter((r) => r.status === "completed").length;

  /* ── 7. Top tones ───────────────────────────────────────────────────── */

  const bySlug = new Map<string, number>();
  for (const r of thisWeek) {
    const slug = r.recipe_slug ?? "(unknown)";
    bySlug.set(slug, (bySlug.get(slug) ?? 0) + 1);
  }
  const topTones = [...bySlug.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  /* ── Output ─────────────────────────────────────────────────────────── */

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          generated_at: new Date(now).toISOString(),
          window_days: 7,
          north_star: {
            tones_deployed: tonesDeployed,
            previous_week: tonesPrev,
            presets,
            pdfs,
            active_users: activeUsers,
            downloads_per_active_user:
              activeUsers > 0 ? tonesDeployed / activeUsers : null,
            trend_weeks: trend,
            anonymous_tones_excluded: anonTones,
          },
          accounts: {
            new_this_week: newAccounts.length,
            new_previous_week: newAccountsPrev,
            total: profiles.length,
            paid: paidCount,
            staff: staffCount,
          },
          activation: {
            cohort: activationCohort.length,
            activated,
            rate: activationCohort.length ? activated / activationCohort.length : null,
            window_days: ACTIVATION_WINDOW_DAYS,
          },
          retention_4w: {
            cohort: retentionCohort.size,
            retained,
            rate: retentionCohort.size ? retained / retentionCohort.size : null,
          },
          quota: {
            limit: FREE_DOWNLOAD_LIMIT,
            hit_cap_this_month: quotaHit,
            one_away: nearQuota,
            top_users: quotaHitUsers.slice(0, 20),
          },
          tone_requests: {
            new_this_week: requestsThisWeek,
            open: pending.length,
            completed_all_time: completed,
            oldest_open_days: Number(oldestPending.toFixed(1)),
            median_open_days: Number(medianPending.toFixed(1)),
          },
          top_tones: topTones.map(([slug, n]) => ({ slug, n })),
        },
        null,
        2,
      ),
    );
    return;
  }

  const delta = tonesDeployed - tonesPrev;
  const deltaStr =
    tonesPrev > 0
      ? `${delta >= 0 ? "+" : ""}${delta} (${delta >= 0 ? "+" : ""}${((delta / tonesPrev) * 100).toFixed(0)}%) vs last week`
      : "no prior week to compare";

  console.log("");
  console.log("Fader & Knob — weekly scorecard");
  console.log(
    `Week ending ${new Date(now).toISOString().slice(0, 10)} · generated ${new Date(now)
      .toISOString()
      .slice(0, 16)
      .replace("T", " ")} UTC`,
  );
  rule();

  heading("★ NORTH STAR — Weekly Tones Deployed");
  line("Tones deployed (7d)", fmt(tonesDeployed), deltaStr);
  line("  presets", fmt(presets));
  line("  recipe PDFs", fmt(pdfs));
  line("Active users (7d)", fmt(activeUsers));
  line("Downloads / active user", ratio(tonesDeployed, activeUsers));
  line(`Trend (${weeks}w)`, spark(trend), trend.join(" · "));
  if (anonTones > 0) {
    line("Excluded (no user_id)", fmt(anonTones), "anonymous/email-gated PDFs");
  }
  rule();

  heading("Acquisition");
  line("New accounts (7d)", fmt(newAccounts.length), `prev week ${fmt(newAccountsPrev)}`);
  line("Total accounts", fmt(profiles.length), `${fmt(paidCount)} paid · ${fmt(staffCount)} staff`);
  rule();

  heading("Activation & retention");
  line(
    `Activation (≤${ACTIVATION_WINDOW_DAYS}d)`,
    pct(activated, activationCohort.length),
    `${fmt(activated)}/${fmt(activationCohort.length)} of accounts created 8–35d ago`,
  );
  line(
    "4-week return rate",
    pct(retained, retentionCohort.size),
    `${fmt(retained)}/${fmt(retentionCohort.size)} active 4w ago, active again this week`,
  );
  rule();

  heading(`Quota pressure — free cap is ${FREE_DOWNLOAD_LIMIT} presets/month`);
  line("Hit the cap this month", fmt(quotaHit), "← upgrade candidates, contact them");
  line("One download away", fmt(nearQuota), "← pre-emptive upgrade audience");
  if (quotaHitUsers.length > 0) {
    console.log("  Heaviest free users this month:");
    for (const u of quotaHitUsers.slice(0, 5)) {
      console.log(`    ${u.user_id}  ${u.count} presets`);
    }
  }
  console.log(
    "  NOTE: this counts users who REACHED the cap. The 402 refusals themselves",
  );
  console.log(
    "  are never logged, so demand beyond the wall is invisible — see gap #2 in",
  );
  console.log("  docs/MEASUREMENT_PLAN.md.");
  rule();

  heading("Tone requests");
  line("New requests (7d)", fmt(requestsThisWeek));
  line("Open (pending + WIP)", fmt(pending.length));
  line("Oldest open", `${oldestPending.toFixed(1)}d`, `median ${medianPending.toFixed(1)}d`);
  line("Completed all-time", fmt(completed));
  if (tr.error) {
    console.log(`  ⚠ tone_requests read failed: ${tr.error}`);
  }
  rule();

  if (topTones.length > 0) {
    heading("Top tones this week");
    for (const [slug, n] of topTones) {
      console.log(`  ${String(n).padStart(4)}  ${slug}`);
    }
    rule();
  }

  console.log("");
  console.log(
    "Blind spot: not one row above can be attributed to a traffic source.",
  );
  console.log(
    "No table records where a user came from, so 'do AI referrals convert?' is",
  );
  console.log("unanswerable today. Fix = gap #1 in docs/MEASUREMENT_PLAN.md.");
  console.log("");
}

main().catch((err: unknown) => {
  console.error("weekly-metrics failed:", err);
  process.exit(1);
});
