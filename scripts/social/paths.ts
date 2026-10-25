import fs from "fs";
import path from "path";
import type { Config, Format } from "./types";

export const ROOT = process.cwd();
export const SOCIAL_DIR = path.join(ROOT, "scripts", "social");
/** SOCIAL_STATE_DIR redirects all runtime state (ledger, weeks, digests) — for demos/tests that must not touch the live ledger. */
export const STATE_DIR = process.env.SOCIAL_STATE_DIR ? path.resolve(process.env.SOCIAL_STATE_DIR) : path.join(ROOT, "docs", "social-queue", "v2");
export const LEDGER_FILE = path.join(STATE_DIR, "ledger.jsonl");
export const METRICS_FILE = path.join(STATE_DIR, "metrics.jsonl");
export const OVERRIDES_FILE = path.join(STATE_DIR, "slot-overrides.json");
export const DIGEST_DIR = path.join(STATE_DIR, "digests");
export const BLOG_DIR = path.join(ROOT, "content", "blog");
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://faderandknob.com").replace(/\/$/, "");

export function weekDir(weekStart: string): string {
  return path.join(STATE_DIR, "weeks", weekStart);
}
export function slotDir(weekStart: string, slotId: string): string {
  return path.join(weekDir(weekStart), slotId);
}

export function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}
export function writeJson(file: string, data: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

export function loadConfig(): Config {
  return readJson<Config>(path.join(SOCIAL_DIR, "config.json"));
}

/** Week-4+ reallocation output (digest writes it; never edits committed config). */
export function loadSlotOverrides(): Record<string, Format> {
  try {
    return readJson<{ slots: Record<string, Format> }>(OVERRIDES_FILE).slots ?? {};
  } catch {
    return {};
  }
}

/** Minimal .env.local loader (same approach as scripts/generate-social-clip.ts). */
export function loadEnvLocal(): void {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (!m) continue;
    const val = m[2].replace(/^["']|["']$/g, "");
    if (val && !process.env[m[1]]) process.env[m[1]] = val;
  }
}
