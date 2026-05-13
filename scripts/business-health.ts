/**
 * 30-second business-health snapshot. Run whenever you want to see if
 * anyone actually paid this week without clicking through 4 dashboards.
 *
 * Pulls (read-only) from Supabase via the service role key:
 *   - profile counts by role (free / premium / creator / admin)
 *   - newsletter subscribers (active vs unsubscribed)
 *   - set_pack_interest list with per-pack counts
 *   - set_pack_purchases (the new $19 one-time revenue path)
 *   - recipe_downloads in the last 7d
 *   - recent server-side events (newsletter_submit, set_pack_*, etc.)
 *
 * Usage:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/business-health.ts
 *
 * Required env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 *
 * No writes. Safe to run any number of times.
 */

import { createClient } from "@supabase/supabase-js";

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function fmt(n: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(n ?? 0);
}

function fmtCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function rule(): void {
  console.log("─".repeat(64));
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    fail(
      "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. `set -a && source .env.local && set +a` first.",
    );
  }
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("");
  console.log("Fader & Knob — business health");
  console.log(`Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`);
  rule();

  // ── Profiles ──────────────────────────────────────────────────────
  const { data: profileRows, error: profErr } = await sb
    .from("profiles")
    .select("role, created_at");
  if (profErr) fail(`profiles read failed: ${profErr.message}`);

  const profiles = (profileRows ?? []) as { role: string; created_at: string }[];
  const byRole = profiles.reduce<Record<string, number>>((acc, p) => {
    const r = p.role ?? "free";
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});
  const totalProfiles = profiles.length;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const last7dProfiles = profiles.filter(
    (p) => new Date(p.created_at).getTime() > sevenDaysAgo,
  ).length;

  console.log("Profiles");
  console.log(`  Total:                ${fmt(totalProfiles)}`);
  console.log(`  New in last 7 days:   ${fmt(last7dProfiles)}`);
  for (const [role, n] of Object.entries(byRole).sort(
    (a, b) => b[1] - a[1],
  )) {
    console.log(`    ${role.padEnd(20)} ${fmt(n)}`);
  }
  rule();

  // ── Set Pack purchases — the new revenue line ─────────────────────
  const { data: purchaseRows, error: purchErr } = await sb
    .from("set_pack_purchases")
    .select("pack_slug, amount_paid_cents, currency, refunded_at, created_at")
    .order("created_at", { ascending: false });
  // Don't fail outright — table may not exist yet on local. Just report.
  if (purchErr) {
    console.log(`Set Pack purchases:   ⚠ ${purchErr.message}`);
  } else {
    const purchases = (purchaseRows ?? []) as {
      pack_slug: string;
      amount_paid_cents: number;
      currency: string;
      refunded_at: string | null;
      created_at: string;
    }[];
    const active = purchases.filter((p) => !p.refunded_at);
    const totalCents = active.reduce(
      (n, p) => n + (p.amount_paid_cents ?? 0),
      0,
    );
    const last7d = active.filter(
      (p) => new Date(p.created_at).getTime() > sevenDaysAgo,
    );
    const last7dCents = last7d.reduce(
      (n, p) => n + (p.amount_paid_cents ?? 0),
      0,
    );
    const byPack = active.reduce<Record<string, { n: number; cents: number }>>(
      (acc, p) => {
        const s = p.pack_slug ?? "?";
        if (!acc[s]) acc[s] = { n: 0, cents: 0 };
        acc[s].n++;
        acc[s].cents += p.amount_paid_cents ?? 0;
        return acc;
      },
      {},
    );

    console.log("Set Pack purchases");
    console.log(
      `  All-time:             ${fmt(active.length)}  (${fmtCents(totalCents)})`,
    );
    console.log(
      `  Last 7 days:          ${fmt(last7d.length)}  (${fmtCents(last7dCents)})`,
    );
    console.log(
      `  Refunded:             ${fmt(purchases.length - active.length)}`,
    );
    for (const [slug, agg] of Object.entries(byPack).sort(
      (a, b) => b[1].cents - a[1].cents,
    )) {
      console.log(
        `    ${slug.padEnd(20)} ${fmt(agg.n).padStart(4)}  ${fmtCents(agg.cents)}`,
      );
    }
  }
  rule();

  // ── Newsletter ────────────────────────────────────────────────────
  const { data: subRows, error: subErr } = await sb
    .from("newsletter_subscribers")
    .select("source, subscribed_at, unsubscribed_at");
  if (subErr) {
    console.log(`Newsletter:           ⚠ ${subErr.message}`);
  } else {
    const subs = (subRows ?? []) as {
      source: string | null;
      subscribed_at: string;
      unsubscribed_at: string | null;
    }[];
    const active = subs.filter((s) => !s.unsubscribed_at);
    const last7d = active.filter(
      (s) => new Date(s.subscribed_at).getTime() > sevenDaysAgo,
    );

    console.log("Newsletter");
    console.log(`  Active:               ${fmt(active.length)}`);
    console.log(`  Unsubscribed:         ${fmt(subs.length - active.length)}`);
    console.log(`  New in last 7 days:   ${fmt(last7d.length)}`);
  }
  rule();

  // ── Set Pack interest (the "notify me" capture) ───────────────────
  const { data: interestRows, error: intErr } = await sb
    .from("set_pack_interest")
    .select("pack_slug, created_at");
  if (intErr) {
    console.log(`Set Pack interest:    ⚠ ${intErr.message}`);
  } else {
    const interests = (interestRows ?? []) as {
      pack_slug: string;
      created_at: string;
    }[];
    const byPack = interests.reduce<Record<string, number>>((acc, i) => {
      const s = i.pack_slug ?? "?";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});

    console.log("Set Pack interest (notify-me)");
    console.log(`  Total signals:        ${fmt(interests.length)}`);
    for (const [slug, n] of Object.entries(byPack).sort(
      (a, b) => b[1] - a[1],
    )) {
      console.log(`    ${slug.padEnd(20)} ${fmt(n)}`);
    }
    if (interests.length > 0) {
      const max = Object.entries(byPack).sort((a, b) => b[1] - a[1])[0];
      console.log(`  ⤷ next pack to ship: ${max[0]} (${fmt(max[1])} interested)`);
    }
  }
  rule();

  // ── Recipe downloads (last 7 days) ────────────────────────────────
  const since = new Date(sevenDaysAgo).toISOString();
  const { data: dlRows, error: dlErr } = await sb
    .from("recipe_downloads")
    .select("recipe_slug, download_type, created_at")
    .gte("created_at", since);
  if (dlErr) {
    console.log(`Recipe downloads:     ⚠ ${dlErr.message}`);
  } else {
    const dls = (dlRows ?? []) as { recipe_slug: string; download_type: string }[];
    const byType = dls.reduce<Record<string, number>>((acc, d) => {
      acc[d.download_type] = (acc[d.download_type] ?? 0) + 1;
      return acc;
    }, {});
    const byRecipe = dls.reduce<Record<string, number>>((acc, d) => {
      acc[d.recipe_slug] = (acc[d.recipe_slug] ?? 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(byRecipe)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    console.log("Recipe downloads (last 7 days)");
    console.log(`  Total:                ${fmt(dls.length)}`);
    for (const [t, n] of Object.entries(byType)) {
      console.log(`    ${t.padEnd(20)} ${fmt(n)}`);
    }
    if (top.length > 0) {
      console.log("  Top 5 recipes:");
      for (const [slug, n] of top) {
        console.log(`    ${slug.padEnd(40)} ${fmt(n)}`);
      }
    }
  }
  rule();

  // ── Server-side events (funnel signal) ────────────────────────────
  const { data: eventRows, error: evErr } = await sb
    .from("events")
    .select("name, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  if (evErr) {
    console.log(`Server events:        ⚠ ${evErr.message}`);
  } else {
    const events = (eventRows ?? []) as { name: string }[];
    const byName = events.reduce<Record<string, number>>((acc, e) => {
      acc[e.name] = (acc[e.name] ?? 0) + 1;
      return acc;
    }, {});

    console.log("Server events (last 7 days)");
    console.log(`  Total:                ${fmt(events.length)}`);
    for (const [name, n] of Object.entries(byName).sort(
      (a, b) => b[1] - a[1],
    )) {
      console.log(`    ${name.padEnd(40)} ${fmt(n)}`);
    }
  }
  rule();
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
