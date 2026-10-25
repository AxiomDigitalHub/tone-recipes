import fs from "fs";
import path from "path";
import { toneRecipes, getSongBySlug } from "@/lib/data";
import { BLOG_DIR, SOCIAL_DIR, readJson } from "./paths";
import { parseBlog, isSettingsTable, PERSONA_TESTING_RE } from "./blog-parse";
import { numberTokens } from "./tokens";
import type { Attribution, Config, Format, InventoryItem } from "./types";

const WORSHIP_GENRE = /worship|ccm|christian/i;
const AI_META = /(^|-)ai(-|$)|axl/i;
const MIN_NUMERIC_FACTS = 6;

function entityMap(): Record<string, string> {
  try {
    return readJson<Record<string, string>>(path.join(SOCIAL_DIR, "entity-map.json"));
  } catch {
    return {};
  }
}

function recipeItems(): InventoryItem[] {
  const out: InventoryItem[] = [];
  for (const r of toneRecipes) {
    const song = getSongBySlug(r.song_slug);
    const worship = (song?.genres ?? []).some((g) => WORSHIP_GENRE.test(g)) || r.tags.some((t) => WORSHIP_GENRE.test(t));
    if (!r.platform_translations.helix?.chain_blocks?.length) continue;
    // Every recipe can be a New Tone (song + chain, like its page); worship ones also feed Sunday Sound.
    // Shared entityKey means the cooldown stops a song running as both inside 56 days.
    out.push({
      sourceKind: "recipe",
      slug: r.slug,
      path: `/recipe/${r.slug}`,
      entityKey: `song:${r.song_slug}`,
      formats: worship ? ["sunday_sound", "new_tone"] : ["new_tone"],
      worship,
      attribution: (r.attribution_confidence ?? "unset") as Attribution,
      // created_at first: New Tone posts tones in release order, and an edit isn't a release.
      date: r.created_at ?? r.updated_at ?? "",
      title: r.title,
      category: "recipe",
    });
  }
  return out;
}

function blogItems(cfg: Config): InventoryItem[] {
  const map = entityMap();
  const out: InventoryItem[] = [];
  for (const f of fs.readdirSync(BLOG_DIR).filter((x) => x.endsWith(".mdx"))) {
    const slug = f.replace(/\.mdx$/, "");
    let p;
    try {
      p = parseBlog(slug);
    } catch {
      continue;
    }
    const fm = p.frontmatter;
    if (fm.draft === true) continue;
    const category = String(fm.category ?? "");
    const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];
    const title = String(fm.title ?? slug);
    const worship = tags.some((t) => /worship/i.test(t)) || /worship/i.test(title);
    const helix = /helix|hx stomp/i.test(p.body);
    const settingsTables = p.tables.filter(isSettingsTable);
    const hasSettings = settingsTables.length > 0 || p.grids.length > 0;
    const numericFacts =
      settingsTables.reduce((n, t) => n + t.rows.flat().reduce((m, c) => m + numberTokens(c).length, 0), 0) +
      p.grids.reduce((n, g) => n + g.knobs.length, 0) +
      p.takeaways.reduce((n, t) => n + numberTokens(t).length, 0);

    const formats: Format[] = [];
    if (category === "tone-recipes" && worship && hasSettings) formats.push("sunday_sound");
    // gear-lab physics never leads a worship slot (Mara: no speaker-physics first touch)
    else if (worship && hasSettings && category !== "gear-lab") formats.push("worship_rig");
    if ((category === "settings-guides" || category === "modeler-masterclass") && hasSettings && helix) formats.push("knob_card");
    if (cfg.fixItAllowlist.includes(slug)) formats.push("fix_it");

    let excluded: string | undefined;
    if (PERSONA_TESTING_RE.test(p.body)) excluded = "persona_testing_claim";
    else if (AI_META.test(slug)) excluded = "ai_meta";
    else if (numericFacts < MIN_NUMERIC_FACTS) excluded = `numeric_facts<${MIN_NUMERIC_FACTS}`;

    if (!formats.length) continue;
    out.push({
      sourceKind: "blog",
      slug,
      path: `/blog/${slug}`,
      entityKey: map[slug] ?? `post:${slug}`,
      formats,
      worship,
      attribution: "unset",
      date: String(fm.updated ?? fm.date ?? ""),
      title,
      category,
      excluded,
    });
  }
  return out;
}

export function buildInventory(cfg: Config): InventoryItem[] {
  return [...recipeItems(), ...blogItems(cfg)];
}

export function matchesUnwrapped(item: InventoryItem, cfg: Config): boolean {
  const t = `${item.title} ${item.slug.replace(/-/g, " ")}`.toLowerCase();
  return cfg.unwrappedGear.some((g) => t.includes(g.toLowerCase()));
}
