import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "@/lib/auth/request-user";

/**
 * GET /api/admin/growth
 *
 * The "growth command center" feed for the admin dashboard. Unlike
 * /api/admin/metrics (which is open — it only exposes catalog counts and
 * coarse user totals), THIS route exposes revenue, so it MUST be
 * auth-gated. We verify the caller's `Authorization: Bearer <token>`,
 * look up their profile role, and refuse anyone who isn't an admin.
 *
 * All numbers come straight from Supabase (the source of truth) using the
 * service-role key — NOT GA4 estimates. Query shapes mirror the proven
 * scripts/business-health.ts.
 *
 * Degrades gracefully per-block: each table read is wrapped in its own
 * try/catch, and a missing/erroring table returns `null` for that block
 * instead of 500-ing the whole route.
 */

export const runtime = "nodejs";

// Admin gate lives in @/lib/auth/request-user (shared with /api/admin/metrics).

// Estimated monthly price per paid role. Annual plans exist too, so this is
// deliberately an ESTIMATE — Stripe is the exact number.
const EST_MONTHLY_PRICE: Record<string, number> = {
  pass: 4.99,
  pro: 7.99,
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** ISO-week bucket key (year + week number), used for the signup sparkline. */
function isoWeekKey(d: Date): string {
  // Copy so we don't mutate the input.
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // Thursday of this week decides the ISO year.
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If Supabase isn't configured we can neither auth nor read. Return 503
  // so the dashboard shows its "couldn't load growth data" note.
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 503 },
    );
  }

  // ── Auth gate (revenue must not be publicly fetchable) ──────────────
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const sb = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = Date.now();
  const sevenDaysAgo = now - WEEK_MS;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const sevenDaysAgoIso = new Date(sevenDaysAgo).toISOString();
  const thirtyDaysAgoIso = new Date(thirtyDaysAgo).toISOString();

  // ── accounts + paid (both derived from profiles) ────────────────────
  let accounts: unknown = null;
  let paid: unknown = null;
  try {
    const { data, error } = await sb
      .from("profiles")
      .select("role, created_at");
    if (error) throw error;
    const profiles = (data ?? []) as { role: string | null; created_at: string }[];

    const total = profiles.length;
    const byRole: Record<string, number> = {};
    let new7d = 0;
    let new30d = 0;
    for (const p of profiles) {
      const r = p.role ?? "free";
      byRole[r] = (byRole[r] ?? 0) + 1;
      const t = new Date(p.created_at).getTime();
      if (t > sevenDaysAgo) new7d++;
      if (t > thirtyDaysAgo) new30d++;
    }

    // 8-week signup sparkline: oldest → newest, weekly new-signup counts.
    const weekKeys: string[] = [];
    for (let i = 7; i >= 0; i--) {
      weekKeys.push(isoWeekKey(new Date(now - i * WEEK_MS)));
    }
    const weekCounts: Record<string, number> = Object.fromEntries(
      weekKeys.map((k) => [k, 0]),
    );
    for (const p of profiles) {
      const k = isoWeekKey(new Date(p.created_at));
      if (k in weekCounts) weekCounts[k]++;
    }
    const sparkline = weekKeys.map((k) => weekCounts[k]);

    accounts = { total, new7d, new30d, byRole, sparkline };

    // paid: pass + pro roles, estimated MRR, free→paid conversion.
    const passCount = byRole.pass ?? 0;
    const proCount = byRole.pro ?? 0;
    const paidTotal = passCount + proCount;
    const estMrr =
      passCount * EST_MONTHLY_PRICE.pass + proCount * EST_MONTHLY_PRICE.pro;
    paid = {
      pass: passCount,
      pro: proCount,
      paidTotal,
      estMrr: Math.round(estMrr * 100) / 100,
      // free→paid conversion across the whole base.
      conversionRate: total > 0 ? paidTotal / total : 0,
    };
  } catch (err) {
    console.error("[growth] profiles read failed:", err);
    accounts = null;
    paid = null;
  }

  // ── newsletter ──────────────────────────────────────────────────────
  let newsletter: unknown = null;
  try {
    const { data, error } = await sb
      .from("newsletter_subscribers")
      .select("subscribed_at, unsubscribed_at");
    if (error) throw error;
    const subs = (data ?? []) as {
      subscribed_at: string | null;
      unsubscribed_at: string | null;
    }[];
    const active = subs.filter((s) => !s.unsubscribed_at);
    const new7d = active.filter(
      (s) => s.subscribed_at && new Date(s.subscribed_at).getTime() > sevenDaysAgo,
    ).length;
    newsletter = {
      active: active.length,
      unsubscribed: subs.length - active.length,
      new7d,
    };
  } catch (err) {
    console.error("[growth] newsletter read failed:", err);
    newsletter = null;
  }

  // ── downloads (last 7d) ─────────────────────────────────────────────
  // Column-name defense: business-health.ts selects `download_type`, but
  // migration 014 also defines a `platform` column — the two may have
  // drifted in the live DB. Introspect real columns via a select('*')
  // probe, then only select columns that actually exist.
  let downloads: unknown = null;
  try {
    const { data: probe, error: probeErr } = await sb
      .from("recipe_downloads")
      .select("*")
      .limit(1);
    if (probeErr) throw probeErr;
    const cols = probe && probe.length > 0 ? Object.keys(probe[0] as object) : [];
    const hasType = cols.length === 0 || cols.includes("download_type");
    const hasPlatform = cols.includes("platform");
    // Always have recipe_slug + created_at; add the optional ones if present.
    const selectCols = ["recipe_slug", "created_at"];
    if (hasType) selectCols.push("download_type");
    if (hasPlatform) selectCols.push("platform");

    const { data, error } = await sb
      .from("recipe_downloads")
      .select(selectCols.join(", "))
      .gte("created_at", sevenDaysAgoIso);
    if (error) throw error;
    const rows = (data ?? []) as unknown as Record<string, unknown>[];
    const byRecipe: Record<string, number> = {};
    for (const r of rows) {
      const slug = (r.recipe_slug as string) ?? "?";
      byRecipe[slug] = (byRecipe[slug] ?? 0) + 1;
    }
    const top = Object.entries(byRecipe)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slug, count]) => ({ slug, count }));
    downloads = { total: rows.length, top };
  } catch (err) {
    console.error("[growth] recipe_downloads read failed:", err);
    downloads = null;
  }

  // ── set packs (purchases + interest) ────────────────────────────────
  let set_packs: unknown = null;
  try {
    let purchasesBlock: unknown = null;
    try {
      const { data, error } = await sb
        .from("set_pack_purchases")
        .select("pack_slug, amount_paid_cents, refunded_at, created_at");
      if (error) throw error;
      const purchases = (data ?? []) as {
        pack_slug: string | null;
        amount_paid_cents: number | null;
        refunded_at: string | null;
        created_at: string;
      }[];
      const active = purchases.filter((p) => !p.refunded_at);
      const totalCents = active.reduce((n, p) => n + (p.amount_paid_cents ?? 0), 0);
      const last7d = active.filter(
        (p) => new Date(p.created_at).getTime() > sevenDaysAgo,
      );
      const last7dCents = last7d.reduce((n, p) => n + (p.amount_paid_cents ?? 0), 0);
      purchasesBlock = {
        active: active.length,
        refunded: purchases.length - active.length,
        totalCents,
        last7dCount: last7d.length,
        last7dCents,
      };
    } catch (err) {
      console.error("[growth] set_pack_purchases read failed:", err);
    }

    let interestBlock: { pack: string; count: number }[] | null = null;
    try {
      const { data, error } = await sb
        .from("set_pack_interest")
        .select("pack_slug");
      if (error) throw error;
      const rows = (data ?? []) as { pack_slug: string | null }[];
      const byPack: Record<string, number> = {};
      for (const r of rows) {
        const s = r.pack_slug ?? "?";
        byPack[s] = (byPack[s] ?? 0) + 1;
      }
      interestBlock = Object.entries(byPack)
        .sort((a, b) => b[1] - a[1])
        .map(([pack, count]) => ({ pack, count }));
    } catch (err) {
      console.error("[growth] set_pack_interest read failed:", err);
    }

    // Only null the whole block if BOTH sub-reads failed.
    if (purchasesBlock === null && interestBlock === null) {
      set_packs = null;
    } else {
      set_packs = { purchases: purchasesBlock, interest: interestBlock };
    }
  } catch (err) {
    console.error("[growth] set_packs block failed:", err);
    set_packs = null;
  }

  // ── funnel (server-side events, last 30d) ───────────────────────────
  // HONEST NOTE: the `events` table holds SERVER-side events only
  // (newsletter_sent, set_pack_*, checkout webhooks, etc.). The
  // client-side funnel steps — checkout_start, signup_start — are sent to
  // GA4 via lib/analytics, NOT here. So this is the reliable server
  // signal, not the full top-of-funnel.
  let funnel: unknown = null;
  try {
    const { data, error } = await sb
      .from("events")
      .select("name, created_at")
      .gte("created_at", thirtyDaysAgoIso);
    if (error) throw error;
    const rows = (data ?? []) as { name: string }[];
    const byName: Record<string, number> = {};
    for (const e of rows) {
      byName[e.name] = (byName[e.name] ?? 0) + 1;
    }
    funnel = {
      total: rows.length,
      byName: Object.entries(byName)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    };
  } catch (err) {
    console.error("[growth] events read failed:", err);
    funnel = null;
  }

  return NextResponse.json({
    accounts,
    paid,
    newsletter,
    downloads,
    set_packs,
    funnel,
  });
}
