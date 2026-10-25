/**
 * Monday digest → docs/social-queue/v2/digests/{date}.md
 *
 * Decision rules (02-marketing-lead §d, 04 sign-offs):
 *  - week ≥4: lowest-scoring format gives its next slot to the highest — only when
 *    every format has ≥3 synced posts AND ≥500 reach; written to slot-overrides.json.
 *  - Day-45 rule (Mara #5, Sasha's version): median reach < 150 AND score below the
 *    weeks 1–2 baseline → a FLAGGED REVIEW for Daniel. Never an automatic change.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { buildInventory } from "./inventory";
import { latestByKey, readLedger } from "./ledger";
import { readMetrics, score } from "./metrics";
import { DIGEST_DIR, OVERRIDES_FILE, loadConfig, writeJson } from "./paths";
import { runway, WEEKDAYS } from "./scheduler";
import type { Format, LedgerRow, MetricRow } from "./types";

const FORMATS: Format[] = ["sunday_sound", "worship_rig", "knob_card", "new_tone", "fix_it"];

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
const fmt = (n: number | null, d = 1) => (n === null || Number.isNaN(n) ? "—" : n.toFixed(d));

async function socialSignups(sinceIso: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return "not available (needs SUPABASE_SERVICE_ROLE_KEY; subscriber rows are service-role read only)";
  try {
    const sb = createClient(url, key);
    const { data, error } = await sb.from("newsletter_subscribers").select("source, subscribed_at").like("source", "social:%").gte("subscribed_at", sinceIso);
    if (error) return `error: ${error.message}`;
    const by: Record<string, number> = {};
    for (const r of (data ?? []) as { source: string }[]) {
      const k = r.source.split(":")[1] ?? "?";
      by[k] = (by[k] ?? 0) + 1;
    }
    return `${(data ?? []).length} (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(", ") || "none"})`;
  } catch (e) {
    return `error: ${String(e)}`;
  }
}

export async function buildDigest(today: string): Promise<{ file: string; text: string }> {
  const cfg = loadConfig();
  const ledger = [...latestByKey(readLedger()).values()];
  const metrics = readMetrics();
  const since14 = new Date(Date.parse(`${today}T12:00:00Z`) - 14 * 86_400_000).toISOString();
  const recent = metrics.filter((m) => m.fkKey && m.publishedAt && m.publishedAt >= since14 && m.platform === "instagram");

  const rows = FORMATS.map((f) => {
    const ms = recent.filter((m) => m.format === f);
    const reach = ms.reduce((n, m) => n + m.reach, 0);
    const saves = ms.reduce((n, m) => n + m.saves, 0);
    const shares = ms.reduce((n, m) => n + m.shares, 0);
    const byHook = (h: "H1" | "H2") => {
      const x = ms.filter((m) => m.hookStyle === h);
      return score(x.reduce((n, m) => n + m.saves, 0), x.reduce((n, m) => n + m.shares, 0), x.reduce((n, m) => n + m.reach, 0));
    };
    const gateFails = ledger.filter((r) => r.format === f && r.state === "gate_failed" && r.date >= since14.slice(0, 10)).length;
    return { f, n: ms.length, synced: ms.filter((m) => m.syncStatus === "synced").length, medReach: median(ms.map((m) => m.reach)), saves, shares, reach, score: score(saves, shares, reach), h1: byHook("H1"), h2: byHook("H2"), gateFails };
  });

  const sent = ledger.filter((r) => ["published", "scheduled", "pending_approval"].includes(r.state)).sort((a, b) => a.date.localeCompare(b.date));
  const start = sent[0]?.date ?? null;
  const dayN = start ? Math.round((Date.parse(today) - Date.parse(start)) / 86_400_000) : 0;
  const week = Math.floor(dayN / 7) + 1;

  // Week-4 reallocation (automatic, data-floored)
  let decision = "none (before week 4)";
  if (week >= 4) {
    const eligible = rows.filter((r) => r.n > 0);
    const enough = eligible.length >= 2 && eligible.every((r) => r.synced >= 3 && r.reach >= 500);
    if (!enough) decision = "insufficient data (needs ≥3 synced posts and ≥500 reach per format)";
    else {
      const ranked = [...eligible].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      const best = ranked[0].f;
      const worst = ranked[ranked.length - 1].f;
      const slots = { ...cfg.slots };
      const wd = WEEKDAYS.find((d) => slots[d] === worst);
      if (wd && best !== worst) {
        writeJson(OVERRIDES_FILE, { writtenAt: today, reason: `${worst} lowest, ${best} highest`, slots: { [wd]: best } });
        decision = `next ${wd} slot moves ${worst} → ${best} (slot-overrides.json)`;
      } else decision = "no change";
    }
  }

  // Day-45 review flag (never automatic)
  let day45 = `not yet (day ${dayN})`;
  if (dayN >= 45) {
    const all = metrics.filter((m) => m.fkKey && m.platform === "instagram");
    const base = all.filter((m) => m.publishedAt && start && Date.parse(m.publishedAt) < Date.parse(start) + 14 * 86_400_000);
    const baseline = score(base.reduce((n, m) => n + m.saves, 0), base.reduce((n, m) => n + m.shares, 0), base.reduce((n, m) => n + m.reach, 0));
    const med = median(recent.map((m) => m.reach));
    const cur = score(recent.reduce((n, m) => n + m.saves, 0), recent.reduce((n, m) => n + m.shares, 0), recent.reduce((n, m) => n + m.reach, 0));
    const flagged = med < 150 && cur !== null && baseline !== null && cur < baseline;
    day45 = flagged
      ? `⚑ REVIEW FOR DANIEL: median reach ${med} < 150 AND score ${fmt(cur)} < weeks 1–2 baseline ${fmt(baseline)}. No automatic change made.`
      : `ok: median reach ${med}, score ${fmt(cur)} vs baseline ${fmt(baseline)}`;
  }

  const inv = buildInventory(cfg);
  const run = FORMATS.map((f) => `${f} ${runway(inv, ledger, f)}`).join(" · ");
  const needs: string[] = [];
  const gf = ledger.filter((r: LedgerRow) => r.state === "gate_failed").map((r) => r.slotId);
  if (gf.length) needs.push(`gate_failed slots: ${gf.join(", ")}`);
  const unk = ledger.filter((r) => r.state === "unknown").map((r) => `${r.slotId}/${r.platform}`);
  if (unk.length) needs.push(`unknown publishes (check Zernio, never re-send): ${unk.join(", ")}`);
  const pend = ledger.filter((r) => r.state === "pending_approval").map((r) => r.slotId);
  if (pend.length) needs.push(`approve in Zernio: ${pend.join(", ")}`);
  if (!cfg.fixItAllowlist.length) needs.push("Fix-It allowlist empty → Wednesday runs Knob Card. Review scripts/social/fixit-candidates.json");
  if (!cfg.profileReady) needs.push("profileReady=false — nothing will publish until the profile + /ig page are done");
  const signups = await socialSignups(since14);

  const best = [...recent].sort((a, b) => (score(b.saves, b.shares, b.reach) ?? -1) - (score(a.saves, a.shares, a.reach) ?? -1));
  const label = (m?: MetricRow) => (m ? `${ledger.find((r) => r.fkKey === m.fkKey)?.slotId ?? m.zernioPostId} (${fmt(score(m.saves, m.shares, m.reach))})` : "—");

  const text = [
    `## Social digest ${today} (trailing 14 days, Instagram)`,
    "",
    "| Format | Posts | Median reach | Saves | Shares (incl. DM sends) | (Saves+Shares)/1k reach | H1 / H2 score | Gate fails |",
    "|---|---|---|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.f} | ${r.n} | ${fmt(r.medReach, 0)} | ${r.saves} | ${r.shares} | ${fmt(r.score)} | ${fmt(r.h1)} / ${fmt(r.h2)} | ${r.gateFails} |`),
    "",
    `Social-sourced email signups (14d, subscriber table): ${signups}`,
    `Top post: ${label(best[0])} · Bottom post: ${label(best[best.length - 1])}`,
    `Runway (entities left): ${run}`,
    `Decisions applied: ${decision}`,
    `Day-45 check: ${day45}`,
    "",
    "**Needs Daniel**",
    ...(needs.length ? needs.map((n) => `- ${n}`) : ["- nothing"]),
    "",
  ].join("\n");
  const file = path.join(DIGEST_DIR, `${today}.md`);
  fs.mkdirSync(DIGEST_DIR, { recursive: true });
  fs.writeFileSync(file, text);
  return { file, text };
}
