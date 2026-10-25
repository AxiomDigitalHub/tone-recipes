/**
 * Publisher: build the Zernio bodies for a rendered slot, then (only with
 * --live and profileReady) upload media and create the post.
 *
 * Idempotency (Mara's challenge): fkKey is written to the ledger as
 * `publishing` BEFORE the HTTP call and sent as Idempotency-Key. Rows in
 * publishing/unknown are never auto-resent; reconcile() resolves them from
 * GET /posts by metadata.fkKey.
 */
import fs from "fs";
import path from "path";
import { append, fkKey, latest, latestByKey, PRE_SEND_STATES, readLedger } from "./ledger";
import { readJson, writeJson } from "./paths";
import { accountId, createPost, listPosts, uploadMedia, validatePost } from "./zernio";
import type { Config, Copy, FactSheet, GateReport, LedgerRow, LedgerState, SlideSpec, SocialPlatform } from "./types";

export interface SlotArtifacts {
  dir: string;
  fs: FactSheet;
  copy: Copy;
  gate: GateReport;
  slides: SlideSpec[];
  pin: SlideSpec;
  caption: string;
  slideFiles: string[]; // jpg, in order
  pinFile: string | null;
}

export function loadSlot(dir: string): SlotArtifacts {
  const fsx = readJson<FactSheet>(path.join(dir, "factsheet.json"));
  const rendered = readJson<{ slides: SlideSpec[]; pin: SlideSpec; caption: string; slideFiles: string[]; pinFile: string | null }>(path.join(dir, "rendered.json"));
  return {
    dir,
    fs: fsx,
    copy: readJson<Copy>(path.join(dir, "copy.json")),
    gate: readJson<GateReport>(path.join(dir, "gate.json")),
    ...rendered,
  };
}

export function utmUrl(fsx: FactSheet, source: SocialPlatform): string {
  const u = new URL(fsx.source.url);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", fsx.format);
  u.searchParams.set("utm_content", fsx.slotId);
  return u.toString();
}

export function buildBodies(
  a: SlotArtifacts,
  cfg: Config,
  scheduledFor: string,
  media: { slides: string[]; pin: string | null },
  accounts: Partial<Record<SocialPlatform, string>>,
): { platform: SocialPlatform; key: string; body: Record<string, unknown> }[] {
  const fsx = a.fs;
  const weekTag = `wk:${fsx.slotId.slice(0, 10)}`;
  const requiresApproval = cfg.approvalMode || a.gate.forceApproval; // Mara #3: non-independent critic forces approval
  const common = {
    scheduledFor,
    timezone: cfg.timezone,
    ...(requiresApproval ? { requiresApproval: true } : {}),
    tags: ["fk-v2", `fmt:${fsx.format}`, `hook:${fsx.hookStyle}`, weekTag],
  };
  const out: { platform: SocialPlatform; key: string; body: Record<string, unknown> }[] = [];
  if (cfg.platforms.instagram) {
    const key = fkKey("instagram", fsx.slotId, fsx.entityKey, fsx.format);
    out.push({
      platform: "instagram",
      key,
      body: {
        content: a.caption,
        mediaItems: media.slides.map((url, i) => ({ type: "image", url, altText: a.slides[i]?.altText })),
        platforms: [{ platform: "instagram", accountId: accounts.instagram ?? "<instagram accountId>", platformSpecificData: { isAiGenerated: false } }],
        ...common,
        metadata: { fkKey: key, slotId: fsx.slotId, format: fsx.format, hookStyle: fsx.hookStyle, entityKey: fsx.entityKey, sourcePath: fsx.source.path, utmContent: fsx.slotId, headline: a.copy.slide1_headline },
      },
    });
  }
  if (cfg.platforms.pinterest && media.pin) {
    const key = fkKey("pinterest", fsx.slotId, fsx.entityKey, fsx.format);
    out.push({
      platform: "pinterest",
      key,
      body: {
        content: `${a.copy.caption_line1}\n\n${a.copy.caption_body}\n\n${fsx.disclosure}`,
        mediaItems: [{ type: "image", url: media.pin, altText: a.pin.altText.slice(0, 500) }],
        platforms: [
          {
            platform: "pinterest",
            accountId: accounts.pinterest ?? "<pinterest accountId>",
            platformSpecificData: { title: a.copy.slide1_headline.slice(0, 100), boardId: cfg.pinterestBoardId ?? "<boardId>", link: utmUrl(fsx, "pinterest"), isAiGenerated: false },
          },
        ],
        ...common,
        metadata: { fkKey: key, slotId: fsx.slotId, format: fsx.format, hookStyle: fsx.hookStyle, entityKey: fsx.entityKey, sourcePath: fsx.source.path, utmContent: fsx.slotId, headline: a.copy.slide1_headline },
      },
    });
  }
  return out;
}

function stateFromCreate(status: number, postStatus?: string): LedgerState {
  if (status === 409) return "unknown";
  if (status >= 500 || status === 0) return "unknown";
  if (status === 207) return postStatus === "scheduled" ? "scheduled" : "failed_permanent";
  if (status >= 200 && status < 300) {
    if (postStatus === "pending_approval") return "pending_approval";
    if (postStatus === "published") return "published";
    return "scheduled";
  }
  return "failed_permanent";
}

function baseRow(a: SlotArtifacts, platform: SocialPlatform, key: string): Omit<LedgerRow, "state" | "at"> {
  return {
    fkKey: key,
    slotId: a.fs.slotId,
    date: a.fs.slotId.slice(0, 10),
    platform,
    format: a.fs.format,
    entityKey: a.fs.entityKey,
    sourceSlug: a.fs.source.slug,
    hookStyle: a.fs.hookStyle,
    hook: a.copy.slide1_headline,
    captionLine1: a.copy.caption_line1,
  };
}

export interface PublishOutcome {
  platform: SocialPlatform;
  action: "dry_run" | "validated" | "sent" | "skipped";
  state?: LedgerState;
  detail?: string;
  bodyFile: string;
}

export async function publishSlot(
  a: SlotArtifacts,
  cfg: Config,
  scheduledFor: string,
  opts: { live: boolean; validate: boolean; validateMediaUrl?: string },
): Promise<PublishOutcome[]> {
  const outcomes: PublishOutcome[] = [];
  if (!a.gate.pass) return [{ platform: "instagram", action: "skipped", detail: "gate failed", bodyFile: "" }];
  const ledger = readLedger();
  const placeholders = { slides: a.slideFiles.map((f) => `local://${path.basename(f)}`), pin: a.pinFile ? `local://${path.basename(a.pinFile)}` : null };
  const accounts: Partial<Record<SocialPlatform, string>> = {};
  if (opts.validate || opts.live) {
    for (const p of ["instagram", "pinterest"] as SocialPlatform[]) {
      if (cfg.platforms[p]) accounts[p] = (await accountId(p)) ?? undefined;
    }
  }
  const dryBodies = buildBodies(a, cfg, scheduledFor, placeholders, accounts);
  for (const { platform, key, body } of dryBodies) {
    const bodyFile = path.join(a.dir, `body.${platform}.json`);
    writeJson(bodyFile, body);
    const prev = latest(key, ledger);
    if (prev && !PRE_SEND_STATES.includes(prev.state) && !["gate_failed", "skipped"].includes(prev.state)) {
      outcomes.push({ platform, action: "skipped", state: prev.state, detail: `already ${prev.state} (fkKey ${key.slice(0, 8)}…) — never re-sent`, bodyFile });
      continue;
    }
    // Daily cap: one feed post per platform per local date.
    const date = a.fs.slotId.slice(0, 10);
    const sameDay = [...latestByKey(ledger).values()].find(
      (r) => r.platform === platform && r.date === date && r.fkKey !== key && ["publishing", "scheduled", "pending_approval", "published", "unknown"].includes(r.state),
    );
    if (sameDay) {
      outcomes.push({ platform, action: "skipped", detail: `daily_cap: ${sameDay.slotId} already ${sameDay.state}`, bodyFile });
      continue;
    }
    if (opts.validate) {
      // Zernio's validator fetches every media URL, and in dry-run our slides aren't uploaded yet, so
      // local:// placeholders are swapped for one public image. NOTE: faderandknob.com URLs come back
      // 403 to Zernio's fetcher (Cloudflare bot mode) — pass --validate-media <url> to use another host.
      const vbody = JSON.parse(JSON.stringify(body));
      for (const m of vbody.mediaItems) m.url = opts.validateMediaUrl ?? "https://faderandknob.com/opengraph-image";
      const v = await validatePost(vbody);
      outcomes.push({ platform, action: "validated", detail: v.valid ? `valid${v.warnings.length ? ` (warnings: ${v.warnings.join("; ")})` : ""}` : `INVALID: ${v.errors.join("; ")}`, bodyFile });
      if (!v.valid && opts.live) continue;
    }
    if (!opts.live) {
      if (!opts.validate) outcomes.push({ platform, action: "dry_run", detail: "payload written, nothing sent", bodyFile });
      continue;
    }
    if (!cfg.profileReady) {
      outcomes.push({ platform, action: "skipped", detail: "profile gate closed (config.profileReady=false)", bodyFile });
      continue;
    }
    if (!accounts[platform]) {
      outcomes.push({ platform, action: "skipped", detail: `no connected ${platform} account in Zernio`, bodyFile });
      continue;
    }
    const hoursOut = (Date.parse(`${scheduledFor}Z`) - Date.now()) / 3_600_000 + 6; // +6h margin for TZ
    const files = platform === "pinterest" ? [a.pinFile!] : a.slideFiles;
    const urls: string[] = [];
    for (const f of files) urls.push(await uploadMedia(f, hoursOut));
    const real = buildBodies(a, cfg, scheduledFor, { slides: platform === "instagram" ? urls : a.slideFiles, pin: platform === "pinterest" ? urls[0] : null }, accounts).find((b) => b.platform === platform)!;
    writeJson(bodyFile, real.body);
    append({ ...baseRow(a, platform, key), state: "publishing" });
    let state: LedgerState = "unknown";
    let detail = "";
    try {
      const r = await createPost(real.body, key);
      state = r.status === 422 ? "failed_permanent" : stateFromCreate(r.status, r.postStatus);
      detail = r.status === 422 ? `idempotency_conflict: ${r.error}` : `${r.status} ${r.postStatus ?? ""} ${r.error ?? ""}`.trim();
      append({ ...baseRow(a, platform, key), state, zernioPostId: r.postId, platformPostUrl: r.platformPostUrl, detail });
    } catch (e) {
      detail = `network/timeout: ${e instanceof Error ? e.message : String(e)}`;
      append({ ...baseRow(a, platform, key), state: "unknown", detail });
    }
    outcomes.push({ platform, action: "sent", state, detail, bodyFile });
  }
  return outcomes;
}

/** Resolve publishing/unknown/scheduled/pending rows against Zernio by metadata.fkKey. Never re-sends. */
export async function reconcile(sinceDate: string): Promise<string[]> {
  const rows = [...latestByKey(readLedger()).values()].filter((r) => ["publishing", "unknown", "scheduled", "pending_approval"].includes(r.state));
  if (!rows.length) return [];
  const posts = await listPosts(sinceDate);
  const notes: string[] = [];
  for (const r of rows) {
    const p = posts.find((x) => x.metadata?.fkKey === r.fkKey);
    if (!p) {
      if (r.state === "publishing" || r.state === "unknown") notes.push(`${r.slotId}/${r.platform}: no Zernio post found for ${r.state} row — left as unknown (digest)`);
      continue;
    }
    const s = (p.platforms?.[0]?.status ?? p.status ?? "") as string;
    const state: LedgerState = s === "published" ? "published" : s === "failed" ? "failed_permanent" : p.status === "pending_approval" ? "pending_approval" : "scheduled";
    if (state !== r.state || !r.zernioPostId) {
      append({ ...r, state, zernioPostId: p._id, platformPostUrl: p.platforms?.[0]?.platformPostUrl ?? r.platformPostUrl, detail: `reconciled from Zernio (${s})` });
      notes.push(`${r.slotId}/${r.platform}: ${r.state} → ${state}`);
    }
  }
  return notes;
}

export function slotDirs(week: string): string[] {
  if (!fs.existsSync(week)) return [];
  return fs
    .readdirSync(week)
    .filter((d) => fs.statSync(path.join(week, d)).isDirectory())
    .sort()
    .map((d) => path.join(week, d));
}
