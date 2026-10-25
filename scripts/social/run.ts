/**
 * Fader & Knob social v2 CLI. Spec: docs/social-strategy/council/03-prompt-engineer-spec.md
 *
 *   npx tsx scripts/social/run.ts plan --week [--start YYYY-MM-DD] [--replan] [--pin tue=<slug>,mon=<slug>]
 *   npx tsx scripts/social/run.ts gate --week [--start …] | --slot <slotId> [--copy-file <draft.json>]
 *   npx tsx scripts/social/run.ts render --week [--render-only]
 *   npx tsx scripts/social/run.ts publish --week [--dry-run] [--validate [--validate-media <url>]] [--live]
 *   npx tsx scripts/social/run.ts metrics | digest | status | reconcile
 *
 * SAFE BY DEFAULT: nothing is written to Zernio without --live, and --live still
 * refuses unless config.profileReady is true. --validate calls Zernio's
 * POST /v1/tools/validate/post (publishes nothing) and GET /v1/accounts.
 * --render-only renders from an existing copy.json even if the gate failed, and
 * makes no Zernio calls (fonts still load from Google Fonts).
 */
import fs from "fs";
import path from "path";
import { buildInventory } from "./inventory";
import { buildFactSheet } from "./factsheet";
import { runGate, verifyRendered } from "./gate";
import { append, fkKey, latestByKey, readLedger } from "./ledger";
import { pullMetrics } from "./metrics";
import { buildDigest } from "./digest";
import { loadEnvLocal, loadConfig, loadSlotOverrides, readJson, SOCIAL_DIR, slotDir, STATE_DIR, weekDir, writeJson } from "./paths";
import { loadSlot, publishSlot, reconcile, slotDirs } from "./publish";
import { composeCaption, composePin, composeSlides } from "./render/compose";
import { CAROUSEL, contactSheet, launch, PIN, renderSpecs } from "./render/render";
import { addDays, mondayOnOrAfter, planWeek } from "./scheduler";
import type { Copy, Critic, FactSheet, GateReport, SlotPlan } from "./types";

loadEnvLocal();

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (n: string) => argv.includes(`--${n}`);
const opt = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

function todayIn(tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function mondayOnOrBefore(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  const dow = d.getUTCDay();
  return addDays(date, -((dow + 6) % 7));
}

function fillTemplate(name: string, vars: Record<string, string>): string {
  let t = fs.readFileSync(path.join(SOCIAL_DIR, "prompts", name), "utf-8");
  for (const [k, v] of Object.entries(vars)) t = t.replaceAll(`{{${k}}}`, v);
  return t;
}

function weekStartArg(cfg = loadConfig()): string {
  const s = opt("start");
  if (s) return mondayOnOrBefore(s);
  // Planning on a Monday plans THIS week; any other day plans next Monday.
  return mondayOnOrAfter(todayIn(cfg.timezone));
}

function targetSlotDirs(): string[] {
  const slot = opt("slot");
  if (slot) return [slotDir(mondayOnOrBefore(slot.slice(0, 10)), slot)];
  return slotDirs(weekDir(weekStartArg()));
}

const rel = (p: string) => path.relative(process.cwd(), p);

async function cmdPlan() {
  const cfg = loadConfig();
  const weekStart = weekStartArg(cfg);
  const wdir = weekDir(weekStart);
  const planFile = path.join(wdir, "plan.json");
  const ledger = readLedger();
  if (fs.existsSync(planFile) && !flag("replan")) {
    console.log(`plan exists for week ${weekStart} (${rel(planFile)}); pass --replan to rebuild unsent slots.`);
    return;
  }
  const sentKeys = new Set([...latestByKey(ledger).values()].filter((r) => ["publishing", "scheduled", "pending_approval", "published", "unknown"].includes(r.state)).map((r) => r.slotId));
  const inv = buildInventory(cfg);
  const pins = Object.fromEntries((opt("pin") ?? "").split(",").filter(Boolean).map((kv) => kv.split("=") as [string, string]));
  const plans = planWeek(weekStart, inv, ledger, cfg, loadSlotOverrides(), pins);
  writeJson(planFile, plans);
  console.log(`\n=== Plan for week of ${weekStart} (${inv.filter((i) => !i.excluded).length} eligible items) ===`);
  for (const p of plans) {
    if (sentKeys.has(p.slotId)) {
      console.log(`  ${p.slotId}: already sent — untouched`);
      continue;
    }
    const line = `${p.weekday} ${p.date} ${p.format.padEnd(12)} ${p.hookStyle} ${p.item ? `${p.item.sourceKind}:${p.item.slug}` : `SKIPPED (${p.skipped})`}${p.fallbackReason ? `  [fallback from ${p.requestedFormat}: ${p.fallbackReason}]` : ""}`;
    console.log("  " + line);
    if (!p.item) continue;
    const dir = slotDir(weekStart, p.slotId);
    const fsheet = buildFactSheet(p, ledger, cfg);
    writeJson(path.join(dir, "factsheet.json"), fsheet);
    writeJson(path.join(dir, "slot.json"), p);
    const vars = {
      factsheetPath: rel(path.join(dir, "factsheet.json")),
      copyPath: rel(path.join(dir, "copy.json")),
      criticPath: rel(path.join(dir, "critic.json")),
      slotId: p.slotId,
      format: p.format,
      hookStyle: p.hookStyle,
    };
    fs.writeFileSync(path.join(dir, "copy-request.md"), fillTemplate("copy.md", vars));
    fs.writeFileSync(path.join(dir, "critic-request.md"), fillTemplate("critic.md", vars));
    append({ fkKey: fkKey("instagram", p.slotId, p.item.entityKey, p.format), slotId: p.slotId, date: p.date, platform: "instagram", format: p.format, entityKey: p.item.entityKey, sourceSlug: p.item.slug, hookStyle: p.hookStyle, state: "planned" });
  }
  console.log(`\nNext: write copy.json per slot (see copy-request.md), critic.json via a fresh subagent (critic-request.md), then \`run.ts gate --week --start ${weekStart}\`.\n`);
}

function readOpt<T>(file: string): T | null {
  try {
    return readJson<T>(file);
  } catch {
    return null;
  }
}

async function cmdGate(): Promise<number> {
  const cfg = loadConfig();
  let fails = 0;
  for (const dir of targetSlotDirs()) {
    const fsheet = readOpt<FactSheet>(path.join(dir, "factsheet.json"));
    if (!fsheet) continue;
    // --copy-file <path>: gate an alternative draft without touching gate.json or the ledger (used for tests/demos).
    const altCopy = opt("copy-file");
    const copy = readOpt<Copy>(altCopy ? path.resolve(altCopy) : path.join(dir, "copy.json"));
    const critic = readOpt<Critic>(path.join(dir, "critic.json"));
    const slot = readOpt<SlotPlan>(path.join(dir, "slot.json"));
    if (!copy) {
      console.log(`  ✗ ${fsheet.slotId}: copy.json missing`);
      fails++;
      continue;
    }
    const report = runGate(fsheet, copy, critic, readLedger(), { fixItAllowlist: cfg.fixItAllowlist, excluded: slot?.item?.excluded });
    if (altCopy) {
      writeJson(path.resolve(altCopy).replace(/\.json$/, ".gate.json"), report);
      console.log(`  ${report.pass ? "✓" : "✗"} ${fsheet.slotId} (alt copy ${altCopy})`);
      for (const c of report.blocking.filter((x) => !x.pass)) console.log(`      ${c.id}: ${c.detail ?? "fail"}`);
      if (!report.pass) fails++;
      continue;
    }
    writeJson(path.join(dir, "gate.json"), report);
    append({ fkKey: fkKey("instagram", fsheet.slotId, fsheet.entityKey, fsheet.format), slotId: fsheet.slotId, date: fsheet.slotId.slice(0, 10), platform: "instagram", format: fsheet.format, entityKey: fsheet.entityKey, sourceSlug: fsheet.source.slug, hookStyle: fsheet.hookStyle, hook: copy.slide1_headline, captionLine1: copy.caption_line1, state: report.pass ? "gated" : "gate_failed", detail: report.pass ? undefined : report.blocking.filter((c) => !c.pass).map((c) => c.id).join(",") });
    console.log(`  ${report.pass ? "✓" : "✗"} ${fsheet.slotId}${report.forceApproval ? "  [approval forced: critic not independent]" : ""}`);
    for (const c of report.blocking.filter((x) => !x.pass)) console.log(`      ${c.id}: ${c.detail ?? "fail"}`);
    for (const c of report.advisory.filter((x) => !x.pass)) console.log(`      (advisory) ${c.id}`);
    if (!report.pass) fails++;
  }
  return fails;
}

async function cmdRender() {
  const renderOnly = flag("render-only");
  const dirs = targetSlotDirs();
  const browser = await launch();
  const sheetRows: string[][] = [];
  try {
    for (const dir of dirs) {
      const fsheet = readOpt<FactSheet>(path.join(dir, "factsheet.json"));
      // --copy-file <path>: gate an alternative draft without touching gate.json or the ledger (used for tests/demos).
    const altCopy = opt("copy-file");
    const copy = readOpt<Copy>(altCopy ? path.resolve(altCopy) : path.join(dir, "copy.json"));
      const gate = readOpt<GateReport>(path.join(dir, "gate.json"));
      if (!fsheet || !copy) continue;
      if (!renderOnly && !gate?.pass) {
        console.log(`  – ${fsheet.slotId}: gate not passed, not rendering (use --render-only to preview)`);
        continue;
      }
      const slides = composeSlides(fsheet, copy);
      const pin = composePin(fsheet, copy);
      const caption = composeCaption(fsheet, copy);
      const d1b = verifyRendered(fsheet, [...slides, pin], caption);
      if (!d1b.pass) {
        console.log(`  ✗ ${fsheet.slotId}: D1b ${d1b.detail}`);
        if (!renderOnly) continue;
      }
      const outDir = path.join(dir, "slides");
      const files = await renderSpecs(browser, slides, outDir, CAROUSEL, (s) => String(s.index).padStart(2, "0"));
      const [pinFile] = await renderSpecs(browser, [pin], dir, PIN, () => "pin");
      writeJson(path.join(dir, "rendered.json"), { slides, pin, caption, slideFiles: files.map((f) => f.jpg), pinFile: pinFile.jpg, pngs: [...files.map((f) => f.png), pinFile.png] });
      fs.writeFileSync(path.join(dir, "caption.txt"), caption + "\n");
      sheetRows.push([...files.map((f) => f.png), pinFile.png]);
      console.log(`  ✓ ${fsheet.slotId}: ${files.length} slides + pin → ${rel(outDir)}`);
    }
  } finally {
    await browser.close();
  }
  if (sheetRows.length) {
    const cs = await contactSheet(sheetRows, path.join(path.dirname(dirs[0]), "contact-sheet.jpg"));
    console.log(`  contact sheet → ${rel(cs)}`);
  }
}

async function cmdPublish() {
  const cfg = loadConfig();
  const live = flag("live") && !flag("dry-run");
  const validate = flag("validate");
  if ((live || validate) && !process.env.ZERNIO_API_KEY) throw new Error("ZERNIO_API_KEY not set");
  console.log(`\n=== publish (${live ? "LIVE" : "DRY-RUN"}${validate ? " + validate" : ""}) profileReady=${cfg.profileReady} approvalMode=${cfg.approvalMode} ===`);
  if (live) {
    const notes = await reconcile(addDays(todayIn(cfg.timezone), -14)).catch((e) => [`reconcile failed: ${e}`]);
    notes.forEach((n) => console.log("  reconcile: " + n));
  }
  for (const dir of targetSlotDirs()) {
    if (!fs.existsSync(path.join(dir, "rendered.json"))) continue;
    const a = loadSlot(dir);
    const slot = readOpt<SlotPlan>(path.join(dir, "slot.json"));
    const out = await publishSlot(a, cfg, slot?.scheduledFor ?? `${a.fs.slotId.slice(0, 10)}T${cfg.postTime}:00`, { live, validate, validateMediaUrl: opt("validate-media") });
    for (const o of out) console.log(`  ${a.fs.slotId} ${o.platform}: ${o.action}${o.state ? ` [${o.state}]` : ""} — ${o.detail ?? ""}${o.bodyFile ? `\n      body → ${rel(o.bodyFile)}` : ""}`);
  }
}

async function cmdStatus() {
  const rows = [...latestByKey(readLedger()).values()].sort((a, b) => a.slotId.localeCompare(b.slotId));
  for (const r of rows.slice(-30)) console.log(`  ${r.slotId.padEnd(28)} ${r.platform.padEnd(10)} ${r.state.padEnd(16)} ${r.detail ?? ""}`);
  if (!rows.length) console.log("  ledger empty");
}

async function main() {
  switch (cmd) {
    case "plan":
      return cmdPlan();
    case "gate": {
      const fails = await cmdGate();
      if (fails) process.exitCode = 1;
      return;
    }
    case "render":
      return cmdRender();
    case "publish":
      return cmdPublish();
    case "metrics": {
      if (!process.env.ZERNIO_API_KEY) throw new Error("ZERNIO_API_KEY not set");
      const r = await pullMetrics();
      console.log(`  metrics: ${r.rows.length} post rows${r.note ? ` (${r.note})` : ""}`);
      return;
    }
    case "reconcile": {
      const cfg = loadConfig();
      (await reconcile(addDays(todayIn(cfg.timezone), -14))).forEach((n) => console.log("  " + n));
      return;
    }
    case "digest": {
      const cfg = loadConfig();
      const d = await buildDigest(opt("date") ?? todayIn(cfg.timezone));
      console.log(d.text);
      console.log(`→ ${rel(d.file)}`);
      return;
    }
    case "status":
      return cmdStatus();
    default:
      console.log(fs.readFileSync(__filename, "utf-8").split("*/")[0]);
      console.log(`state dir: ${rel(STATE_DIR)}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
