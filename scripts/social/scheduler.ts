import fs from "fs";
import path from "path";
import { matchesUnwrapped } from "./inventory";
import { latestByKey, usedRows } from "./ledger";
import type { Attribution, Config, Format, HookStyle, InventoryItem, LedgerRow, SlotPlan } from "./types";

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri"] as const;
const ATTR_RANK: Record<Attribution, number> = { documented: 0, pool: 1, tribute: 2, unset: 3 };
/** Settings guides are the best discovery format (17 users/page); physics/theory ranks last. */
const CATEGORY_RANK: Record<string, number> = { recipe: 0, "tone-recipes": 0, "settings-guides": 0, "quick-fixes": 1, "modeler-masterclass": 1, workflow: 2, "signal-chain": 3 };

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Monday on/after `date` (or `date` itself if Monday). */
export function mondayOnOrAfter(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  const dow = d.getUTCDay(); // 0 Sun..6 Sat
  const delta = dow === 1 ? 0 : (8 - dow) % 7;
  return addDays(date, delta);
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);
}

function nextHookStyle(format: Format, ledger: LedgerRow[], planned: SlotPlan[]): HookStyle {
  const same = [
    ...usedRows(ledger).filter((r) => r.format === format).sort((a, b) => a.at.localeCompare(b.at)).map((r) => r.hookStyle),
    ...planned.filter((p) => p.format === format).map((p) => p.hookStyle),
  ];
  const last = same[same.length - 1];
  return last === "H1" ? "H2" : "H1";
}

/** Slugs the legacy v1 autoposter already pushed (docs/social-queue/promoted.log), with dates. */
export function legacyPromoted(file = path.join(process.cwd(), "docs", "social-queue", "promoted.log")): { slug: string; date: string }[] {
  try {
    return fs
      .readFileSync(file, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        const [slug, at] = l.split("\t");
        return { slug: slug.trim(), date: (at ?? "").slice(0, 10) };
      });
  } catch {
    return [];
  }
}

export function pickItem(
  format: Format,
  date: string,
  inv: InventoryItem[],
  ledger: LedgerRow[],
  planned: SlotPlan[],
  cfg: Config,
  filter?: string,
): InventoryItem | null {
  const used = usedRows(ledger);
  const blockedEntities = new Set([
    ...used.filter((r) => daysBetween(r.date, date) < cfg.cooldownDays.entity).map((r) => r.entityKey),
    ...planned.map((p) => p.item?.entityKey).filter(Boolean),
    // v1 hero-image posts count too: don't re-promote the same post inside the cooldown.
    ...legacyPromoted()
      .filter((l) => daysBetween(l.date, date) < cfg.cooldownDays.entity)
      .map((l) => inv.find((i) => i.slug === l.slug)?.entityKey ?? `post:${l.slug}`),
  ] as string[]);
  const usedSourceFormat = new Set(used.map((r) => `${r.sourceSlug}|${r.format}`));
  const worshipFirst = format === "sunday_sound" || format === "worship_rig";
  const pool = inv
    .filter((i) => !i.excluded && i.formats.includes(format))
    .filter((i) => !blockedEntities.has(i.entityKey))
    .filter((i) => !usedSourceFormat.has(`${i.slug}|${format}`))
    .filter((i) => (filter === "unwrapped" ? matchesUnwrapped(i, cfg) : true))
    .sort(
      (a, b) =>
        // New Tone = "as they come out": newest release wins, whatever its attribution grade.
        (format === "new_tone" ? b.date.localeCompare(a.date) : 0) ||
        (worshipFirst ? Number(b.worship) - Number(a.worship) : 0) ||
        // recipes before blog for Sunday Sound: structured chain beats prose tables
        (format === "sunday_sound" ? Number(b.sourceKind === "recipe") - Number(a.sourceKind === "recipe") : 0) ||
        ATTR_RANK[a.attribution] - ATTR_RANK[b.attribution] ||
        (CATEGORY_RANK[a.category] ?? 4) - (CATEGORY_RANK[b.category] ?? 4) ||
        b.date.localeCompare(a.date) ||
        a.slug.localeCompare(b.slug),
    );
  return pool[0] ?? null;
}

export function planWeek(
  weekStart: string,
  inv: InventoryItem[],
  ledger: LedgerRow[],
  cfg: Config,
  overrides: Record<string, Format> = {},
  /** Manual picks: weekday → source slug (e.g. --pin tue=hislop-goodness-of-god). Must be eligible for the slot's format. */
  pins: Record<string, string> = {},
): SlotPlan[] {
  const plans: SlotPlan[] = [];
  WEEKDAYS.forEach((wd, i) => {
    const date = addDays(weekStart, i);
    const seasonal = cfg.seasonal.find((s) => s.day === wd && date >= s.from && date <= s.to);
    const requested: Format = overrides[wd] ?? seasonal?.format ?? cfg.slots[wd];
    let format: Format = requested;
    let fallbackReason: string | undefined;
    // Mara must-fix #2: empty Fix-It allowlist → Wednesday falls back to knob_card, never skipped.
    if (format === "fix_it" && cfg.fixItAllowlist.length === 0) {
      format = "knob_card";
      fallbackReason = "fix_it_allowlist_empty";
    }
    const pinned = pins[wd] ? inv.find((x) => x.slug === pins[wd] && !x.excluded && x.formats.includes(format)) : undefined;
    if (pins[wd] && !pinned) throw new Error(`--pin ${wd}=${pins[wd]}: not an eligible ${format} source (excluded or wrong format)`);
    let item = pinned ?? pickItem(format, date, inv, ledger, plans, cfg, seasonal?.filter);
    if (!item && seasonal?.filter) item = pickItem(format, date, inv, ledger, plans, cfg); // seasonal pool dry → normal
    if (!item && format === "fix_it") {
      format = "knob_card";
      fallbackReason = "fix_it_allowlist_exhausted";
      item = pickItem(format, date, inv, ledger, plans, cfg);
    }
    const slotId = `${date}-${format}`;
    plans.push({
      slotId,
      date,
      weekday: wd,
      format,
      requestedFormat: requested,
      fallbackReason,
      item,
      skipped: item ? undefined : "inventory_exhausted",
      hookStyle: nextHookStyle(format, ledger, plans),
      scheduledFor: `${date}T${cfg.postTime}:00`,
    });
  });
  return plans;
}

/** Remaining distinct entities per format (digest runway line). */
export function runway(inv: InventoryItem[], ledger: LedgerRow[], format: Format): number {
  const used = new Set([...latestByKey(ledger).values()].filter((r) => r.format === format).map((r) => r.entityKey));
  return new Set(inv.filter((i) => !i.excluded && i.formats.includes(format) && !used.has(i.entityKey)).map((i) => i.entityKey)).size;
}
