/**
 * Pure: FactSheet + Copy → SlideSpec[] and the caption. No I/O.
 *
 * Every string a slide shows is a TextItem. Data strings carry a factId; template
 * strings carry none and are still number-checked by gate.verifyRendered (Mara #4:
 * no hardcoded numbers in templates). Slide chrome (page index) is `structural`.
 */
import { lookupParam } from "@/lib/parameters/registry";
import { factById } from "../factsheet";
import type { ChainNode, Copy, Fact, FactBlock, FactSheet, KnobCell, SlideGroup, SlideSpec, TextItem } from "../types";

const FORMAT_KICKER: Record<FactSheet["format"], string> = {
  sunday_sound: "Sunday Sound",
  knob_card: "Knob Card",
  worship_rig: "Worship Rig",
  fix_it: "Fix-It",
  new_tone: "New Tone",
};

const t = (text: string, factId?: string): TextItem => (factId ? { text, factId } : { text });

function knobPos(f: Fact, category: string): number | undefined {
  if (typeof f.value !== "number" || !f.label) return undefined;
  const meta = lookupParam(f.label, category);
  if (!meta || meta.kind !== "knob" || !meta.rangeVerified) return undefined;
  if (f.value < meta.min || f.value > meta.max) return undefined;
  return (f.value - meta.min) / (meta.max - meta.min || 1);
}

function blockGroup(fs: FactSheet, b: FactBlock, opts: { offLabel?: string } = {}): SlideGroup {
  const facts = factById(fs);
  const cells: KnobCell[] = b.factIds.map((id) => {
    const f = facts.get(id)!;
    return { label: f.label ?? "", value: f.display, factId: id, pos: knobPos(f, b.category) };
  });
  const nameFact = fs.facts.find((f) => f.id.startsWith("bn") && f.blockId === b.blockId);
  return {
    title: t(b.name, nameFact?.id),
    subtitle: t(b.enabled ? b.category : `Off · ${opts.offLabel ?? "optional"}`),
    cells,
    off: !b.enabled,
  };
}

const CAT = {
  delay: /delay/i,
  reverb: /reverb/i,
  amp: /^(amp|preamp)/i,
  cab: /^cab/i,
  volume: /volume/i,
  comp: /comp/i,
  drive: /drive|distortion|boost|fuzz/i,
};

function noteFor(copy: Copy, blockIds: string[]): TextItem | undefined {
  const n = copy.block_notes?.find((x) => blockIds.includes(x.blockId));
  return n ? t(n.line) : undefined;
}

/** Sasha #4: ≤4 block slides — Delay · Reverb · Amp + Cab · Swells & lift. */
function sundayBlockSlides(fs: FactSheet, copy: Copy): Omit<SlideSpec, "index" | "total" | "footer" | "altText">[] {
  const pick = (re: RegExp, enabledOnly = true) => fs.blocks.filter((b) => re.test(b.category) && (!enabledOnly || b.enabled));
  const out: Omit<SlideSpec, "index" | "total" | "footer" | "altText">[] = [];
  const delay = pick(CAT.delay)[0];
  if (delay) out.push({ kind: "block", layout: "knobs", kicker: t("Delay"), title: t(delay.name), groups: [blockGroup(fs, delay)], ...withNote(copy, [delay.blockId]) });
  const reverb = pick(CAT.reverb)[0];
  if (reverb) out.push({ kind: "block", layout: "knobs", kicker: t("Reverb"), title: t(reverb.name), groups: [blockGroup(fs, reverb)], ...withNote(copy, [reverb.blockId]) });
  const amp = pick(CAT.amp)[0];
  const cab = pick(CAT.cab)[0];
  if (amp || cab) {
    const gs = [amp, cab].filter(Boolean) as FactBlock[];
    const nCells = gs.reduce((n, b) => n + b.factIds.length, 0);
    out.push({
      kind: "block",
      layout: nCells <= 12 ? "knobs" : "rows",
      kicker: t("Amp + Cab"),
      title: t(gs.map((b) => b.name).join(" + ")),
      groups: gs.map((b) => blockGroup(fs, b)),
      ...withNote(copy, gs.map((b) => b.blockId)),
    });
  }
  const swells = fs.blocks.filter((b) => CAT.volume.test(b.category) || CAT.comp.test(b.category) || CAT.drive.test(b.category));
  if (swells.length) {
    const gs = swells.slice(0, 8).map((b) => blockGroup(fs, b, { offLabel: "last chorus" }));
    out.push({ kind: "block", layout: "rows", kicker: t("Swells & lift"), title: t("Verse swells, chorus lift"), groups: gs, ...withNote(copy, swells.map((b) => b.blockId)) });
  }
  return out.slice(0, 4);
}

function withNote(copy: Copy, ids: string[]): { lines: TextItem[] } {
  const n = noteFor(copy, ids);
  return { lines: n ? [n] : [] };
}

function tableSlides(fs: FactSheet, max: number): Omit<SlideSpec, "index" | "total" | "footer" | "altText">[] {
  const facts = factById(fs);
  // Prose columns ("Notes", "Why") stay in the fact sheet but off the card.
  const PROSE_COL = /^(notes?|why|description|comments?|what it costs you)$/i;
  return fs.tables.slice(0, max).map((tb) => {
    const keep = tb.header.map((id, i) => i === 0 || !PROSE_COL.test(facts.get(id)!.display));
    return {
    kind: "table" as const,
    kicker: t(/helix|hx/i.test(tb.heading ? facts.get(tb.heading)!.display : "") ? "On Helix" : "Settings"),
    title: tb.heading ? t(facts.get(tb.heading)!.display, tb.heading) : t("Settings"),
    lines: [],
    table: {
      header: tb.header.filter((_, i) => keep[i]).map((id) => t(facts.get(id)!.display, id)),
      rows: tb.rows.slice(0, 8).map((r) => ({ cells: r.filter((_, i) => keep[i]).map((id) => t(facts.get(id)!.display, id)) })),
      notes: tb.noteFactIds.slice(0, 2).map((id) => t(facts.get(id)!.display, id)),
    },
    };
  });
}

function coverSlide(fs: FactSheet, copy: Copy): Omit<SlideSpec, "index" | "total" | "footer" | "altText"> {
  const facts = factById(fs);
  const factLine = copy.slide1_fact_ids.map((id) => facts.get(id)).filter(Boolean) as Fact[];
  // Chip = "Label value" for settings ("Time 549 ms"), bare display otherwise ("Key of Ab").
  const lines: TextItem[] = factLine.map((f) => t(f.kind === "setting" && f.label ? `${f.label} ${f.display}` : f.display, f.id));
  const subtitle: TextItem[] = [];
  if (fs.display.song) {
    const songFact = fs.facts.find((f) => f.kind === "display" && f.label === "song");
    subtitle.push(t(fs.display.song, songFact?.id));
    const bandFact = fs.facts.find((f) => f.kind === "display" && f.label === "band");
    if (fs.display.band) subtitle.push(t(fs.display.band, bandFact?.id));
  }
  return {
    kind: "cover",
    kicker: t(FORMAT_KICKER[fs.format]),
    title: t(copy.slide1_headline),
    lines: [...lines, ...subtitle.map((s) => ({ ...s, text: s.text }))],
  };
}

function ruleSlide(fs: FactSheet): Omit<SlideSpec, "index" | "total" | "footer" | "altText"> | null {
  const facts = factById(fs);
  const tk = fs.takeawayFactIds.map((id) => facts.get(id)!).find((f) => f.numbers.length > 0) ?? facts.get(fs.takeawayFactIds[0]);
  if (!tk) return null;
  return { kind: "rule", kicker: t(fs.format === "fix_it" ? "The cause" : "The rule"), title: t(tk.display, tk.id), lines: [] };
}

export function otherPlatformsLine(fs: FactSheet): string {
  // Sasha #5 / Mara #4: derived from data, never a hardcoded count.
  return fs.display.otherPlatforms.length ? `Also written for ${fs.display.otherPlatforms.join(", ")}.` : "";
}

function closeSlide(fs: FactSheet): Omit<SlideSpec, "index" | "total" | "footer" | "altText"> {
  const lines: TextItem[] = [];
  if (fs.attribution.line) lines.push(t(fs.attribution.line));
  const other = otherPlatformsLine(fs);
  if (other) lines.push(t(other));
  lines.push(t("Full settings: link in profile."));
  lines.push(t(fs.disclosure));
  return { kind: "close", kicker: t(fs.format === "sunday_sound" ? "Pass it on" : "Save it"), title: t(fs.cta), lines };
}

// ── New Tone: the song + its chain, laid out like the recipe page ───────────

type Part = Omit<SlideSpec, "index" | "total" | "footer" | "altText">;

function displayFact(fs: FactSheet, label: string): Fact | undefined {
  return fs.facts.find((f) => f.kind === "display" && f.label === label);
}

function chainNodes(fs: FactSheet): ChainNode[] {
  const facts = factById(fs);
  return fs.blocks.map((b) => {
    const nameFact = fs.facts.find((f) => f.id.startsWith("bn") && f.blockId === b.blockId);
    const og = b.originalGearFactId ? facts.get(b.originalGearFactId) : undefined;
    return {
      kind: t(b.tile?.kind ?? b.category),
      name: t(b.name, nameFact?.id),
      gear: og ? t(og.display, og.id) : undefined,
      color: b.tile?.color,
      iconSvg: b.tile?.iconSvg ?? "",
      off: !b.enabled,
    };
  });
}

function songCover(fs: FactSheet, copy: Copy): Part {
  const facts = factById(fs);
  const song = displayFact(fs, "song");
  const band = displayFact(fs, "band");
  const album = displayFact(fs, "album");
  const year = displayFact(fs, "year");
  const lines: TextItem[] = [];
  if (band) lines.push(t(band.display, band.id));
  if (album) lines.push(year ? { text: `${album.display} · ${year.display}`, factId: album.id } : t(album.display, album.id));
  // The copywriter's picked facts print as chips ("Mid 7"), same as every other cover.
  for (const id of copy.slide1_fact_ids) {
    const f = facts.get(id);
    if (f) lines.push(t(f.kind === "setting" && f.label ? `${f.label} ${f.display}` : f.display, f.id));
  }
  return {
    kind: "song",
    kicker: t(FORMAT_KICKER.new_tone),
    eyebrow: (fs.eyebrowFactIds ?? []).map((id) => t(facts.get(id)!.display, id)),
    title: song ? t(song.display, song.id) : t(fs.display.title),
    // The hook is the only LLM line on the cover; the gate number-checks it like any caption line.
    lines: [...lines, t(copy.slide1_headline)],
    chain: { meta: [], nodes: chainNodes(fs) },
  };
}

function signalPathSlide(fs: FactSheet): Part {
  const facts = factById(fs);
  const count = (fs.eyebrowFactIds ?? []).map((id) => facts.get(id)!).find((f) => f.label === "blockCount");
  const g = fs.guitar;
  return {
    kind: "chain",
    kicker: t("Signal path"),
    title: t("Input to output"),
    // Non-documented songs carry the credit caveat right where the rig is named.
    lines: fs.attribution.line ? [t(fs.attribution.line)] : [],
    chain: {
      meta: [t("Input → output"), ...(count ? [t(count.display, count.id)] : []), t(`${fs.display.platformLabel} settings`)],
      guitar: g
        ? {
            name: t(facts.get(g.nameFactId)!.display, g.nameFactId),
            iconSvg: g.iconSvg,
            specs: g.specs.map((x) => ({ label: t(x.label), value: t(facts.get(x.factId)!.display, x.factId) })),
          }
        : undefined,
      nodes: chainNodes(fs),
    },
  };
}

/** "Every knob, broken out": two block cards per slide (three when the chain is long). */
function knobSlides(fs: FactSheet, copy: Copy, maxSlides: number): Part[] {
  const facts = factById(fs);
  const per = fs.blocks.length > maxSlides * 2 ? 3 : 2;
  const out: Part[] = [];
  for (let i = 0; i < fs.blocks.length && out.length < maxSlides; i += per) {
    const bs = fs.blocks.slice(i, i + per);
    const groups = bs.map((b) => {
      const g = blockGroup(fs, b, { offLabel: "optional" });
      const og = b.originalGearFactId ? facts.get(b.originalGearFactId) : undefined;
      return { ...g, subtitle: og ? { text: `← ${og.display}`, factId: og.id } : g.subtitle, iconSvg: b.tile?.iconSvg, tag: t(b.enabled ? b.category : "Off · optional") };
    });
    const cells = bs.reduce((n, b) => n + b.factIds.length, 0);
    out.push({
      kind: "block",
      // Two cards of knob tiles fit up to 8 tiles; past that the chips layout keeps it on one slide.
      layout: per === 2 && cells <= 8 ? "knobs" : "rows",
      kicker: t("Per-block settings"),
      title: t("Every knob, broken out"),
      groups,
      ...withNote(copy, bs.map((b) => b.blockId)),
    });
  }
  return out;
}

function altFor(s: Omit<SlideSpec, "altText">): string {
  const head = `Slide ${s.index} of ${s.total}.`;
  const sentence = (x: string) => x.trim().replace(/[.!?]+$/, "") + ".";
  if ((s.kind === "song" || s.kind === "chain") && s.chain) {
    const chain = s.chain.nodes.map((n) => `${n.name.text}${n.gear ? ` (${n.gear.text})` : ""}${n.off ? ", off by default" : ""}`).join(", then ");
    const head2 = s.kind === "song" ? [s.title.text, ...s.lines.map((l) => l.text)].map(sentence).join(" ") : [...(s.chain.guitar ? [`Guitar: ${s.chain.guitar.name.text}`] : []), ...s.lines.map((l) => l.text)].map(sentence).join(" ");
    return `${head} ${head2} Signal path on Helix: ${chain}.`.slice(0, 1000);
  }
  if (s.kind === "cover" || s.kind === "rule" || s.kind === "close") return [head, s.title.text, ...s.lines.map((l) => l.text)].map(sentence).join(" ").slice(0, 1000);
  if (s.groups) {
    const g = s.groups.map((gr) => `${gr.title.text}${gr.off ? " (off by default)" : ""}: ${gr.cells.map((c) => `${c.label} ${c.value}`).join(", ")}`).join(". ");
    return `${head} ${s.kicker?.text ?? ""} settings on Helix. ${g}.`.slice(0, 1000);
  }
  if (s.table) {
    const rows = s.table.rows.map((r) => r.cells.map((c) => c.text).join(", ")).join("; ");
    return `${head} ${s.title.text}. ${s.table.header.map((h) => h.text).join(", ")}: ${rows}.`.slice(0, 1000);
  }
  return `${head} ${s.title.text}`;
}

function finish(fs: FactSheet, parts: Omit<SlideSpec, "index" | "total" | "footer" | "altText">[]): SlideSpec[] {
  const total = parts.length;
  return parts.map((p, i) => {
    const s = {
      ...p,
      index: i + 1,
      total,
      footer: [{ text: "Fader & Knob" }, { text: `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, structural: true }],
    } as Omit<SlideSpec, "altText">;
    return { ...s, altText: altFor(s) };
  });
}

export function composeSlides(fs: FactSheet, copy: Copy): SlideSpec[] {
  if (fs.format === "new_tone") {
    // cover + signal path + up to 4 knob slides + close = the 7-slide cap
    return finish(fs, [songCover(fs, copy), signalPathSlide(fs), ...knobSlides(fs, copy, 4), closeSlide(fs)]);
  }
  const parts: Omit<SlideSpec, "index" | "total" | "footer" | "altText">[] = [coverSlide(fs, copy)];
  if (fs.format === "sunday_sound" && fs.source.kind === "recipe") {
    parts.push(...sundayBlockSlides(fs, copy));
  } else {
    const rule = ruleSlide(fs);
    if (rule) parts.push(rule);
    parts.push(...tableSlides(fs, fs.format === "fix_it" ? 1 : 2));
  }
  parts.push(closeSlide(fs));
  return finish(fs, parts.slice(0, 7));
}

/** 2:3 Pinterest card: headline, fact line, condensed settings, URL. */
export function composePin(fs: FactSheet, copy: Copy): SlideSpec {
  if (fs.format === "new_tone") {
    // Pin = the song header over the full signal path (names + real gear).
    const cover = songCover(fs, copy);
    const path = signalPathSlide(fs);
    const s: Omit<SlideSpec, "altText"> = {
      ...cover,
      kind: "pin",
      index: 1,
      total: 1,
      chain: { meta: [], nodes: path.chain!.nodes },
      footer: [{ text: "Fader & Knob" }, { text: "faderandknob.com" }],
    };
    return { ...s, altText: altFor({ ...s, kind: "song" }).replace(/^Slide 1 of 1\. /, "") };
  }
  const cover = coverSlide(fs, copy);
  let groups: SlideGroup[] | undefined;
  let table: SlideSpec["table"];
  if (fs.format === "sunday_sound" && fs.source.kind === "recipe") {
    groups = sundayBlockSlides(fs, copy)
      .flatMap((s) => s.groups ?? [])
      .filter((g) => !g.off)
      .slice(0, 4);
  } else {
    table = tableSlides(fs, 1)[0]?.table;
  }
  const s: Omit<SlideSpec, "altText"> = {
    kind: "pin",
    index: 1,
    total: 1,
    layout: "rows",
    kicker: cover.kicker,
    title: cover.title,
    lines: cover.lines,
    groups,
    table,
    footer: [{ text: "Fader & Knob" }, { text: "faderandknob.com" }],
  };
  return { ...s, altText: altFor({ ...s, kind: groups ? "block" : "table" }).replace(/^Slide 1 of 1\. /, "") };
}

export function composeCaption(fs: FactSheet, copy: Copy): string {
  const parts = [copy.caption_line1.trim(), copy.caption_body.trim()];
  const tail: string[] = [];
  if (fs.attribution.line) tail.push(fs.attribution.line);
  tail.push(fs.cta);
  const other = otherPlatformsLine(fs);
  tail.push(`${other ? other + " " : ""}Full settings: link in profile.`);
  tail.push(fs.disclosure);
  return [...parts, tail.join("\n"), fs.hashtags.slice(0, 5).map((h) => `#${h}`).join(" ")].join("\n\n");
}
