import { getRecipeBySlug, getSongBySlug, getArtistBySlug } from "@/lib/data";
import { getBandName } from "@/lib/song-band";
import { lookupParam } from "@/lib/parameters/registry";
import { getAllWriters } from "@/lib/writers";
import { parseBlog, isSettingsTable, type Table } from "./blog-parse";
import { helixTiles } from "./render/site-chain";
import { formatTuning, guitarModelName } from "@/lib/guitar-specs";
import { usedRows } from "./ledger";
import { SITE } from "./paths";
import { numberTokens, SOURCE_BPM_RE, SOURCE_KEY_RE } from "./tokens";
import type { Config, Fact, FactBlock, FactGuitar, FactSheet, FactTable, Format, LedgerRow, SlotPlan } from "./types";

export const CTA: Record<Format, string> = {
  sunday_sound: "Send this to whoever runs your Sunday rig.",
  knob_card: "Save this for your next rehearsal.",
  worship_rig: "Save this for your next rehearsal.",
  fix_it: "Save this for the next time it happens.",
  new_tone: "Save this for when you build it.",
};
export const DISCLOSURE = "Settings researched and written by AI. Corrections are published on the site.";

const PLATFORM_LABEL: Record<string, string> = {
  helix: "Helix",
  quad_cortex: "Quad Cortex",
  katana: "Katana",
  kemper: "Kemper",
  fractal: "Fractal",
  tonex: "TONEX",
  pedalboard: "pedalboard",
};

/** Params that are recipe-internal noise on a card. They stay in the fact sheet, off the slide. */
const HIDDEN_PARAMS = new Set(["Bias", "BiasX", "Hum", "Ripple", "Pan", "Delay", "Angle", "Resonance"]);

/** Must-fix (Sasha, Knob Card): trailing "(see below)" etc. is stripped from the value and kept as a note fact. */
const TRAILING_PAREN = /\s*\(([^()]*)\)\s*$/;

export function isHiddenParam(label: string, value: unknown): boolean {
  if (HIDDEN_PARAMS.has(label)) return true;
  if (label === "Level" && value === 0) return true;
  if (label === "Mic" && typeof value === "number") return true; // a model index, not a setting
  return false;
}

/** Display a setting: raw value, never rounded; unit only when the value sits inside the registry range. */
export function formatSetting(label: string, category: string, value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "On" : "Off";
  if (typeof value === "string") return value;
  const meta = lookupParam(label, category);
  const inRange = meta && meta.kind !== "text" && value >= meta.min && value <= meta.max;
  if (!meta?.unit || !inRange) return String(value);
  return meta.unit.startsWith(":") ? `${value}${meta.unit}` : `${value} ${meta.unit}`;
}

class FactBuilder {
  facts: Fact[] = [];
  private n: Record<string, number> = {};
  add(prefix: string, f: Omit<Fact, "id" | "numbers">): string {
    this.n[prefix] = (this.n[prefix] ?? 0) + 1;
    const id = `${prefix}${String(this.n[prefix]).padStart(2, "0")}`;
    this.facts.push({ ...f, id, numbers: numberTokens(f.display).map((t) => t.norm) });
    return id;
  }
  /** Key/BPM extraction from source prose (Sasha #1). */
  prose(text: string, sourcePath: string) {
    for (const m of text.matchAll(SOURCE_KEY_RE)) {
      if (!this.facts.some((f) => f.kind === "key" && f.value === m[1]))
        this.add("k", { kind: "key", display: `Key of ${m[1]}`, value: m[1], sourcePath });
    }
    for (const m of text.matchAll(SOURCE_BPM_RE)) {
      if (!this.facts.some((f) => f.kind === "bpm" && f.value === Number(m[1])))
        this.add("bpm", { kind: "bpm", display: `${m[1]} BPM`, value: Number(m[1]), sourcePath });
    }
  }
}

function personaNames(): string[] {
  try {
    return getAllWriters().map((w) => w.name);
  } catch {
    return [];
  }
}

function attributionLine(conf: string, album: string | null, year: number | null): string | null {
  void year;
  const rec = album ?? "The album";
  if (conf === "documented") return null;
  if (conf === "pool") return `${rec} credits electric guitar to a pool of players, not per song. Rebuilt from the recording.`;
  if (conf === "tribute") return "No player credit is documented for this part. Rebuilt from the recording.";
  return "Rebuilt from the recordings, not a player-confirmed rig.";
}

function hashtagFrom(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pickHashtags(cfg: Config, format: Format, extra: string[]): string[] {
  const generic = new Set(["guitar", "tone", "settings", "helix", "amp", "amps", "modeler", "modelers"]);
  const tags = [...cfg.hashtagPools[format]];
  for (const e of extra.map(hashtagFrom)) {
    if (tags.length >= 5) break;
    if (e && e.length >= 4 && e.length <= 30 && !generic.has(e) && !tags.includes(e)) tags.push(e);
  }
  return tags.slice(0, 5);
}

function recentHistory(ledger: LedgerRow[]) {
  const rows = usedRows(ledger).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 10);
  return {
    recentHooks: rows.map((r) => r.hook).filter(Boolean) as string[],
    recentLine1s: rows.map((r) => r.captionLine1).filter(Boolean) as string[],
  };
}

function tableToFacts(fb: FactBuilder, t: Table, tIdx: number, srcBase: string): FactTable {
  const tableId = `tb${tIdx + 1}`;
  const noteFactIds: string[] = [];
  const heading = t.heading ? fb.add("h", { kind: "text", display: t.heading, sourcePath: `${srcBase}[${tIdx}].heading` }) : null;
  const header = t.header.map((h, c) => fb.add("h", { kind: "text", display: h, sourcePath: `${srcBase}[${tIdx}].header[${c}]` }));
  const rows = t.rows.map((r, ri) =>
    r.map((cell, ci) => {
      const sp = `${srcBase}[${tIdx}].rows[${ri}][${ci}]`;
      let display = cell;
      const m = ci > 0 ? cell.match(TRAILING_PAREN) : null;
      if (m && cell.replace(TRAILING_PAREN, "").trim()) {
        display = cell.replace(TRAILING_PAREN, "").trim();
        if (!/^see (below|above)$/i.test(m[1].trim()))
          noteFactIds.push(fb.add("n", { kind: "text", display: `${r[0]} (${t.header[ci]}): ${m[1].trim()}`, sourcePath: sp }));
      }
      return fb.add("c", { kind: ci === 0 ? "text" : "setting", display, label: r[0], sourcePath: sp });
    }),
  );
  return { tableId, heading: heading, header, rows, noteFactIds };
}

export function buildFactSheet(plan: SlotPlan, ledger: LedgerRow[], cfg: Config): FactSheet {
  if (!plan.item) throw new Error(`slot ${plan.slotId} has no item`);
  const item = plan.item;
  const fb = new FactBuilder();
  const blocks: FactBlock[] = [];
  const tables: FactTable[] = [];
  const takeawayFactIds: string[] = [];
  const banned = new Set(personaNames());
  let display: FactSheet["display"];
  let confidence = item.attribution;
  let extraTags: string[] = [];
  let guitar: FactGuitar | undefined;
  let eyebrowFactIds: string[] | undefined;

  if (item.sourceKind === "recipe") {
    const r = getRecipeBySlug(item.slug);
    if (!r) throw new Error(`recipe ${item.slug} not found`);
    const song = getSongBySlug(r.song_slug) ?? null;
    const artist = song ? getArtistBySlug(song.artist_slug) : undefined;
    const band = song ? getBandName(song, artist) : null;
    confidence = (r.attribution_confidence ?? "unset") as typeof confidence;
    if (confidence !== "documented" && artist) {
      banned.add(artist.name);
      const last = artist.name.split(" ").pop();
      if (last && last.length > 3) banned.add(last);
    }
    display = {
      title: r.title,
      song: song?.title ?? null,
      band: band ?? null,
      album: song?.album ?? null,
      year: song?.year ?? null,
      platformLabel: "Helix",
      otherPlatforms: Object.keys(r.platform_translations)
        .filter((p) => p !== "helix")
        .map((p) => PLATFORM_LABEL[p] ?? p),
    };
    for (const [k, v] of Object.entries({ song: display.song, band: display.band, album: display.album, year: display.year })) {
      if (v !== null && v !== undefined) fb.add("d", { kind: "display", display: String(v), label: k, sourcePath: `song.${k === "band" ? "slug(band)" : k}` });
    }
    const chainBlocks = r.platform_translations.helix!.chain_blocks;
    // new_tone mirrors the recipe page: eyebrow, guitar card, chain tiles, "← real gear" per block.
    const site = plan.format === "new_tone" ? helixTiles(r) : null;
    if (site) {
      eyebrowFactIds = [];
      const yearFact = fb.facts.find((f) => f.kind === "display" && f.label === "year");
      if (yearFact) eyebrowFactIds.push(yearFact.id);
      const genre = song?.genres?.[0];
      if (genre) eyebrowFactIds.push(fb.add("d", { kind: "display", display: genre, label: "genre", sourcePath: "song.genres[0]" }));
      eyebrowFactIds.push(fb.add("d", { kind: "display", display: `${chainBlocks.length} blocks`, label: "blockCount", sourcePath: "recipe.platform_translations.helix.chain_blocks.length" }));
      const g = r.guitar_specs;
      if (g?.model_name) {
        const specs: FactGuitar["specs"] = [];
        const spec = (label: string, v: string | undefined, sp: string) => {
          if (v) specs.push({ label, factId: fb.add("g", { kind: "text", display: v, label, sourcePath: `recipe.guitar_specs.${sp}` }) });
        };
        spec("Pickups", g.pickup_config, "pickup_config");
        spec("Position", g.pickup_position, "pickup_position");
        spec("Tuning", g.tuning ? formatTuning(g) : undefined, "tuning");
        // "(likely his 1956, 'Floyd')" is provenance prose: it names a player's own guitar, so it stays off the card.
        const model = guitarModelName(g);
        guitar = { nameFactId: fb.add("g", { kind: "text", display: model, label: "guitar", sourcePath: "recipe.guitar_specs.model_name" }), iconSvg: site.guitarIconSvg, specs };
      }
    }
    fb.prose(r.description, "recipe.description");
    fb.prose(String(r.tone_context ?? ""), "recipe.tone_context");
    chainBlocks.forEach((b, bi) => {
      fb.prose(b.notes ?? "", `recipe.platform_translations.helix.chain_blocks[${bi}].notes`);
      const blockId = `b${String(bi + 1).padStart(2, "0")}`;
      fb.add("bn", { kind: "text", display: b.block_name, blockId, sourcePath: `recipe.platform_translations.helix.chain_blocks[${bi}].block_name` });
      const factIds: string[] = [];
      for (const [label, value] of Object.entries(b.settings)) {
        const id = fb.add("f", {
          kind: "setting",
          label,
          blockId,
          value,
          display: formatSetting(label, b.block_category, value),
          sourcePath: `recipe.platform_translations.helix.chain_blocks[${bi}].settings.${label}`,
        });
        if (!isHiddenParam(label, value)) factIds.push(id);
      }
      const originalGearFactId =
        site && b.original_gear
          ? fb.add("og", { kind: "text", display: b.original_gear, blockId, sourcePath: `recipe.platform_translations.helix.chain_blocks[${bi}].original_gear` })
          : undefined;
      blocks.push({
        blockId,
        name: b.block_name,
        category: b.block_category,
        enabled: b.enabled !== false,
        factIds,
        notes: b.notes ?? "",
        ...(site ? { originalGearFactId, tile: site.tiles[bi] } : {}),
      });
    });
    extraTags = [display.song ?? "", display.band ?? ""];
  } else {
    const p = parseBlog(item.slug);
    const fm = p.frontmatter;
    display = {
      title: String(fm.title ?? item.slug),
      song: null,
      band: null,
      album: null,
      year: null,
      platformLabel: /hx stomp/i.test(p.body) && !/helix(?! stomp)/i.test(p.body) ? "HX Stomp" : "Helix",
      otherPlatforms: [],
    };
    fb.add("d", { kind: "display", display: display.title, label: "title", sourcePath: "blog.frontmatter.title" });
    fb.prose(String(fm.description ?? ""), "blog.frontmatter.description");
    p.takeaways.forEach((t, i) => {
      fb.prose(t, `blog.frontmatter.takeaways[${i}]`);
      takeawayFactIds.push(fb.add("tk", { kind: "text", display: t, sourcePath: `blog.frontmatter.takeaways[${i}]` }));
    });
    // Tables: Helix/HX headings first, then document order; max 3 (grids count as tables).
    const settings = p.tables.map((t, i) => ({ t, i })).filter(({ t }) => isSettingsTable(t));
    const numericCells = (x: Table) => x.rows.flat().slice(0).filter((c, k) => k % x.header.length !== 0 && /\d/.test(c)).length;
    settings.sort(
      (a, b) =>
        Number(/helix|hx/i.test(b.t.heading ?? "")) - Number(/helix|hx/i.test(a.t.heading ?? "")) ||
        numericCells(b.t) - numericCells(a.t) ||
        a.i - b.i,
    );
    for (const { t, i } of settings.slice(0, 3)) tables.push(tableToFacts(fb, t, i, "blog.tables"));
    p.grids.slice(0, Math.max(0, 3 - tables.length)).forEach((g, gi) => {
      const t: Table = { heading: g.subtitle ? `${g.title} · ${g.subtitle}` : g.title, header: ["Control", "Setting"], rows: g.knobs.map((k) => [k.name, k.display ?? k.value]) };
      tables.push(tableToFacts(fb, t, gi, "blog.grids"));
    });
    const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];
    extraTags = tags;
    if (plan.format === "sunday_sound" || plan.format === "worship_rig") confidence = "unset";
  }

  const worshipFormat = plan.format === "sunday_sound" || plan.format === "worship_rig";
  const line = worshipFormat || item.sourceKind === "recipe" ? attributionLine(confidence, display.album, display.year) : null;

  return {
    schema: "fk.factsheet.v1",
    slotId: plan.slotId,
    format: plan.format,
    hookStyle: plan.hookStyle,
    source: { kind: item.sourceKind, slug: item.slug, url: `${SITE}${item.path}`, path: item.path },
    entityKey: item.entityKey,
    display,
    attribution: { confidence, line, bannedNames: [...banned].filter(Boolean) },
    facts: fb.facts,
    blocks,
    ...(guitar ? { guitar } : {}),
    ...(eyebrowFactIds ? { eyebrowFactIds } : {}),
    tables,
    takeawayFactIds,
    ...recentHistory(ledger),
    hashtags: pickHashtags(cfg, plan.format, extraTags),
    cta: CTA[plan.format],
    disclosure: DISCLOSURE,
  };
}

export function factById(fs: FactSheet): Map<string, Fact> {
  return new Map(fs.facts.map((f) => [f.id, f]));
}
