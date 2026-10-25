import crypto from "crypto";
import fs from "fs";
import path from "path";
import { LEDGER_FILE } from "./paths";
import type { Format, LedgerRow, LedgerState, SocialPlatform } from "./types";

/**
 * Append-only ledger: docs/social-queue/v2/ledger.jsonl. Last row per fkKey wins.
 *
 * fkKey is content-derived and doubles as Zernio's Idempotency-Key, so a
 * retry can never become a second post (the Oct 2026 triple-retry incident).
 */
export function fkKey(platform: SocialPlatform, slotId: string, entityKey: string, format: Format): string {
  return crypto
    .createHash("sha256")
    .update(`fk:v2:${platform}:${slotId}:${entityKey}:${format}`)
    .digest("hex")
    .slice(0, 40);
}

export function readLedger(file = LEDGER_FILE): LedgerRow[] {
  try {
    return fs
      .readFileSync(file, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as LedgerRow);
  } catch {
    return [];
  }
}

export function append(row: Omit<LedgerRow, "at">, file = LEDGER_FILE): LedgerRow {
  const full: LedgerRow = { ...row, at: new Date().toISOString() };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(full) + "\n");
  return full;
}

/** Latest row per fkKey. */
export function latestByKey(rows: LedgerRow[]): Map<string, LedgerRow> {
  const m = new Map<string, LedgerRow>();
  for (const r of rows) m.set(r.fkKey, r);
  return m;
}

export function latest(key: string, rows = readLedger()): LedgerRow | undefined {
  return latestByKey(rows).get(key);
}

/** States that mean "this went (or may have gone) to a network". */
export const SENT_STATES: LedgerState[] = ["publishing", "scheduled", "pending_approval", "published", "unknown"];
/** States from which publish may proceed. */
export const PRE_SEND_STATES: LedgerState[] = ["planned", "gated", "rendered"];

/** Rows that count as "used" for cooldown/no-repeat purposes. */
export function usedRows(rows: LedgerRow[]): LedgerRow[] {
  return [...latestByKey(rows).values()].filter((r) => SENT_STATES.includes(r.state));
}
