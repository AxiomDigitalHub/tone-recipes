/**
 * Read-only analytics pull → docs/social-queue/v2/metrics.jsonl.
 * Zernio has `saves` and `shares` per post but no separate "sends" field; Meta's
 * `shares` includes DM sends, so the digest labels it "shares (incl. DM sends)".
 * Score is computed here, never taken from Zernio's engagementRate (whose
 * denominator varies by post).
 */
import fs from "fs";
import path from "path";
import { latestByKey, readLedger } from "./ledger";
import { METRICS_FILE } from "./paths";
import { accountId, getAccountInsights, getAnalytics } from "./zernio";
import type { MetricRow } from "./types";

interface ZAnalytics {
  impressions?: number;
  reach?: number;
  views?: number;
  saves?: number;
  shares?: number;
  likes?: number;
  comments?: number;
  profileViews?: number;
  follows?: number | null;
}
interface ZListPost {
  _id: string;
  latePostId?: string | null;
  publishedAt?: string | null;
  status?: string;
  analytics?: ZAnalytics;
  platforms?: { platform?: string; platformPostUrl?: string | null; syncStatus?: string; analytics?: ZAnalytics }[];
  platform?: string;
  platformPostUrl?: string | null;
  syncStatus?: string;
}

export function score(saves: number, shares: number, reach: number): number | null {
  return reach > 0 ? ((saves + shares) / reach) * 1000 : null;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export async function pullMetrics(days = 21): Promise<{ rows: MetricRow[]; account: unknown; note?: string }> {
  const ledger = [...latestByKey(readLedger()).values()];
  const byPostId = new Map(ledger.filter((r) => r.zernioPostId).map((r) => [r.zernioPostId!, r]));
  const byUrl = new Map(ledger.filter((r) => r.platformPostUrl).map((r) => [r.platformPostUrl!, r]));
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);
  const rows: MetricRow[] = [];
  const pulledAt = new Date().toISOString();
  for (let page = 1; page <= 10; page++) {
    const r = await getAnalytics({ source: "late", fromDate: iso(from), toDate: iso(to), limit: "50", page: String(page) });
    if (r.status === 403) return { rows, account: null, note: "analytics add-on required (403)" };
    if (!r.ok) throw new Error(`GET /analytics ${r.status}: ${r.text.slice(0, 300)}`);
    const posts = ((r.data as { posts?: ZListPost[] })?.posts ?? []) as ZListPost[];
    for (const p of posts) {
      for (const pl of p.platforms?.length ? p.platforms : [{ platform: p.platform, platformPostUrl: p.platformPostUrl, syncStatus: p.syncStatus, analytics: p.analytics }]) {
        const a = pl.analytics ?? p.analytics ?? {};
        const led = (p.latePostId && byPostId.get(p.latePostId)) || (pl.platformPostUrl && byUrl.get(pl.platformPostUrl)) || null;
        rows.push({
          pulledAt,
          zernioPostId: p.latePostId ?? p._id,
          fkKey: led?.fkKey ?? null,
          platform: pl.platform ?? "?",
          format: led?.format ?? null,
          hookStyle: led?.hookStyle ?? null,
          publishedAt: p.publishedAt ?? null,
          syncStatus: pl.syncStatus ?? p.syncStatus ?? "?",
          reach: a.reach ?? 0,
          impressions: a.impressions ?? 0,
          views: a.views ?? 0,
          saves: a.saves ?? 0,
          shares: a.shares ?? 0,
          likes: a.likes ?? 0,
          comments: a.comments ?? 0,
          profileViews: a.profileViews ?? 0,
          follows: a.follows ?? null,
        });
      }
    }
    if (posts.length < 50) break;
  }
  let account: unknown = null;
  try {
    const igId = await accountId("instagram");
    const ai = igId ? await getAccountInsights({ accountId: igId, fromDate: iso(from), toDate: iso(to) }) : null;
    account = ai ? (ai.ok ? ai.data : { error: ai.status }) : { error: "no instagram account" };
  } catch (e) {
    account = { error: String(e) };
  }
  fs.mkdirSync(path.dirname(METRICS_FILE), { recursive: true });
  fs.appendFileSync(METRICS_FILE, rows.map((x) => JSON.stringify(x)).join("\n") + (rows.length ? "\n" : ""));
  return { rows, account };
}

/** Latest snapshot per post. */
export function readMetrics(file = METRICS_FILE): MetricRow[] {
  try {
    const all = fs
      .readFileSync(file, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as MetricRow);
    const m = new Map<string, MetricRow>();
    for (const r of all) m.set(`${r.zernioPostId}|${r.platform}`, r);
    return [...m.values()];
  } catch {
    return [];
  }
}
