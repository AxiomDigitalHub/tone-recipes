/**
 * Thin Zernio client for social v2 (shapes from zernio.com/openapi.yaml).
 * Traps carried over from src/lib/social/publishers/zernio.ts:
 *   - accounts are keyed `_id`
 *   - HTTP 207 is a 2xx: branch on post.status
 *   - hashtags must live in `content` (the `hashtags` field is reference-only)
 */
import fs from "fs";
import path from "path";
import type { SocialPlatform } from "./types";

const BASE = "https://zernio.com/api/v1";

function key(): string {
  const k = process.env.ZERNIO_API_KEY;
  if (!k) throw new Error("ZERNIO_API_KEY is not set");
  return k;
}
function headers(extra: Record<string, string> = {}): Record<string, string> {
  return { Authorization: `Bearer ${key()}`, "Content-Type": "application/json", ...extra };
}

export interface ZResponse<T = unknown> {
  status: number;
  ok: boolean;
  data: T;
  text: string;
}

async function call<T>(method: string, p: string, body?: unknown, extra?: Record<string, string>): Promise<ZResponse<T>> {
  const res = await fetch(`${BASE}${p}`, {
    method,
    headers: headers(extra),
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* non-JSON */
  }
  return { status: res.status, ok: res.ok, data: data as T, text };
}

/**
 * Upload a local image. Presigned uploads land under media.zernio.com/temp/ with
 * UNDOCUMENTED retention, so anything scheduled > 20h out goes through
 * /media/upload-direct (documented 7-day retention, ~4.5 MB cap).
 */
export async function uploadMedia(file: string, ttlNeededHours: number): Promise<string> {
  const buf = fs.readFileSync(file);
  const contentType = file.endsWith(".png") ? "image/png" : "image/jpeg";
  if (ttlNeededHours > 20) {
    if (buf.length > 4_400_000) throw new Error(`${file} is ${buf.length} bytes; upload-direct caps ~4.5 MB`);
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buf)], { type: contentType }), path.basename(file));
    form.append("contentType", contentType);
    const res = await fetch(`${BASE}/media/upload-direct`, { method: "POST", headers: { Authorization: `Bearer ${key()}` }, body: form, signal: AbortSignal.timeout(60_000) });
    const text = await res.text();
    if (!res.ok) throw new Error(`upload-direct ${res.status}: ${text}`);
    return (JSON.parse(text) as { url: string }).url;
  }
  const pre = await call<{ uploadUrl: string; publicUrl: string }>("POST", "/media/presign", { filename: path.basename(file), contentType, size: buf.length });
  if (!pre.ok) throw new Error(`presign ${pre.status}: ${pre.text}`);
  const put = await fetch(pre.data.uploadUrl, { method: "PUT", headers: { "Content-Type": contentType }, body: new Uint8Array(buf), signal: AbortSignal.timeout(60_000) });
  if (!put.ok) throw new Error(`presign PUT ${put.status}: ${await put.text()}`);
  return pre.data.publicUrl;
}

let accountsCache: { _id?: string; platform: string; isActive?: boolean; needsReconnection?: boolean }[] | null = null;
export async function accountId(platform: SocialPlatform): Promise<string | null> {
  if (!accountsCache) {
    const q = process.env.ZERNIO_PROFILE_ID ? `?profileId=${encodeURIComponent(process.env.ZERNIO_PROFILE_ID)}` : "";
    const r = await call<{ accounts?: typeof accountsCache } | NonNullable<typeof accountsCache>>("GET", `/accounts${q}`);
    if (!r.ok) throw new Error(`GET /accounts ${r.status}: ${r.text}`);
    accountsCache = (Array.isArray(r.data) ? r.data : r.data?.accounts) ?? [];
  }
  const a = accountsCache.find((x) => x.platform === platform && x.isActive !== false && x.needsReconnection !== true);
  return a?._id ?? null;
}

export interface CreateResult {
  status: number;
  postId?: string;
  postStatus?: string;
  platformPostUrl?: string;
  error?: string;
  warnings?: string[];
}

export async function createPost(body: object, idempotencyKey: string): Promise<CreateResult> {
  const r = await call<{
    post?: { _id?: string; status?: string; platforms?: { platformPostUrl?: string; error?: string }[] };
    error?: string;
    message?: string;
    warnings?: string[];
  }>("POST", "/posts", body, { "Idempotency-Key": idempotencyKey });
  const p = r.data?.post;
  return {
    status: r.status,
    postId: p?._id,
    postStatus: p?.status,
    platformPostUrl: p?.platforms?.[0]?.platformPostUrl,
    error: r.ok && r.status !== 207 ? undefined : (r.data?.error ?? r.data?.message ?? p?.platforms?.[0]?.error ?? r.text),
    warnings: r.data?.warnings,
  };
}

export interface ZPost {
  _id: string;
  status?: string;
  scheduledFor?: string;
  metadata?: Record<string, unknown>;
  platforms?: { platform?: string; status?: string; platformPostUrl?: string }[];
}

export async function listPosts(fromDate: string): Promise<ZPost[]> {
  const r = await call<{ posts?: ZPost[] } | ZPost[]>("GET", `/posts?fromDate=${fromDate}&limit=100`);
  if (!r.ok) throw new Error(`GET /posts ${r.status}: ${r.text}`);
  return (Array.isArray(r.data) ? r.data : r.data?.posts) ?? [];
}

/** POST /tools/validate/post — dry-run validation, publishes nothing. */
export async function validatePost(body: object): Promise<{ status: number; valid: boolean; errors: string[]; warnings: string[] }> {
  const r = await call<{ valid?: boolean; errors?: { platform?: string; error?: string }[]; warnings?: { platform?: string; warning?: string }[] }>(
    "POST",
    "/tools/validate/post",
    body,
  );
  const errors = (r.data?.errors ?? []).map((e) => `${e.platform ?? "?"}: ${e.error ?? JSON.stringify(e)}`);
  const warnings = (r.data?.warnings ?? []).map((w) => `${w.platform ?? "?"}: ${w.warning ?? JSON.stringify(w)}`);
  if (!r.ok) errors.push(`HTTP ${r.status}: ${r.text.slice(0, 300)}`);
  return { status: r.status, valid: r.ok && r.data?.valid !== false && errors.length === 0, errors, warnings };
}

export async function getAnalytics(params: Record<string, string>): Promise<ZResponse<unknown>> {
  return call("GET", `/analytics?${new URLSearchParams(params).toString()}`);
}

export async function getAccountInsights(params: Record<string, string>): Promise<ZResponse<unknown>> {
  return call("GET", `/analytics/instagram/account-insights?${new URLSearchParams(params).toString()}`);
}
