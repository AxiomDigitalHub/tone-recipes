import { describe, it, expect } from "vitest";
import { numberTokens, keyMentions } from "../scripts/social/tokens";
import {
  checkBanned,
  checkNovelty,
  checkNumbers,
  jaccard,
  runGate,
  verifyRendered,
} from "../scripts/social/gate";
import { composeCaption, composeSlides } from "../scripts/social/render/compose";
import type { Copy, Critic, Fact, FactSheet, SlideSpec } from "../scripts/social/types";

function fact(id: string, kind: Fact["kind"], display: string, extra: Partial<Fact> = {}): Fact {
  return { id, kind, display, numbers: numberTokens(display).map((t) => t.norm), sourcePath: `test.${id}`, ...extra };
}

/** Synthetic Sunday Sound sheet — no dependency on the live catalog. */
function sheet(over: Partial<FactSheet> = {}): FactSheet {
  return {
    schema: "fk.factsheet.v1",
    slotId: "2026-11-03-sunday_sound",
    format: "sunday_sound",
    hookStyle: "H1",
    source: { kind: "recipe", slug: "test-recipe", url: "https://faderandknob.com/recipe/test-recipe", path: "/recipe/test-recipe" },
    entityKey: "song:test",
    display: { title: "T", song: "Goodness of God", band: "Bethel Music", album: "Victory (Live)", year: 2019, platformLabel: "Helix", otherPlatforms: ["Quad Cortex", "Katana"] },
    attribution: { confidence: "pool", line: "Victory (Live) credits electric guitar to a pool of players, not per song. Rebuilt from the recording.", bannedNames: ["David Hislop", "Hislop"] },
    facts: [
      fact("d01", "display", "Goodness of God", { label: "song" }),
      fact("d02", "display", "Bethel Music", { label: "band" }),
      fact("d04", "display", "2019", { label: "year" }),
      fact("k01", "key", "Key of Ab", { value: "Ab" }),
      fact("bpm01", "bpm", "82 BPM", { value: 82 }),
      fact("bn01", "text", "Deluxe Comp", { blockId: "b01" }),
      fact("f01", "setting", "-32 dB", { label: "Threshold", blockId: "b01", value: -32 }),
      fact("f02", "setting", "4:1", { label: "Ratio", blockId: "b01", value: 4 }),
      fact("bn02", "text", "Adriatic Delay", { blockId: "b02" }),
      fact("f03", "setting", "549 ms", { label: "Time", blockId: "b02", value: 549 }),
      fact("f04", "setting", "5500 Hz", { label: "HighCut", blockId: "b02", value: 5500 }),
    ],
    blocks: [
      { blockId: "b01", name: "Deluxe Comp", category: "Compressor", enabled: true, factIds: ["f01", "f02"], notes: "" },
      { blockId: "b02", name: "Adriatic Delay", category: "Delay", enabled: true, factIds: ["f03", "f04"], notes: "" },
    ],
    tables: [],
    takeawayFactIds: [],
    recentHooks: ["Your Deluxe model sounds thin and flat tonight"],
    recentLine1s: ["Swell in with the volume pedal and let the reverb carry the verse."],
    hashtags: ["worshipguitar", "line6helix"],
    cta: "Send this to whoever runs your Sunday rig.",
    disclosure: "Settings researched and written by AI. Corrections are published on the site.",
    ...over,
  };
}

function copy(over: Partial<Copy> = {}): Copy {
  return {
    schema: "fk.copy.v1",
    slotId: "2026-11-03-sunday_sound",
    hook_style: "H1",
    slide1_headline: "Your Goodness of God swells sound choppy? Start with the volume pedal.",
    slide1_fact_ids: ["f03", "bpm01", "k01"],
    caption_line1: "Let the delay and the reverb carry the verses.",
    caption_body: "The 549 ms delay is a dotted eighth at 82 BPM. The comp at −32 dB keeps each swell even.",
    cited_facts: [
      { fact_id: "f03", text: "549 ms" },
      { fact_id: "bpm01", text: "82 BPM" },
      { fact_id: "f01", text: "−32 dB" },
    ],
    ...over,
  };
}

const critic = (over: Partial<Critic> = {}): Critic => ({
  schema: "fk.critic.v1",
  slotId: "2026-11-03-sunday_sound",
  independent: true,
  C1_stranger: 1,
  C2_question: "Q4",
  C3_specific: 1,
  C4_hook_style_match: 1,
  C5_honest: 1,
  reasons: [],
  ...over,
});

describe("tokenizer", () => {
  it("treats the Unicode minus as a sign (Sasha #2)", () => {
    expect(numberTokens("Threshold −32 dB")[0].norm).toBe("-32db");
    expect(numberTokens("-32")[0].num).toBe("-32");
  });
  it("does not turn a range into a negative number", () => {
    expect(numberTokens("About 3-4").map((t) => t.num)).toEqual(["3", "4"]);
    expect(numberTokens("About 3–4").map((t) => t.num)).toEqual(["3", "4"]);
  });
  it("normalizes thousands and units without eating words", () => {
    expect(numberTokens("5,500 Hz")[0].norm).toBe("5500hz");
    expect(numberTokens("5 knobs")[0].norm).toBe("5");
    expect(numberTokens("6.8k resistor")[0].norm).toBe("6.8k");
  });
});

describe("D1 number fidelity", () => {
  it("passes when every number is a cited fact, including −32 vs -32 dB", () => {
    expect(checkNumbers(sheet(), copy()).pass).toBe(true);
  });
  it("rejects an invented number", () => {
    const r = checkNumbers(sheet(), copy({ caption_body: "Set feedback to 40 and the delay to 549 ms." }));
    expect(r.pass).toBe(false);
    expect(r.detail).toContain('"40"');
  });
  it("rejects −33 when the fact is -32", () => {
    expect(checkNumbers(sheet(), copy({ caption_body: "The comp at −33 dB." })).pass).toBe(false);
  });
  it("rejects a real number that was not cited", () => {
    const c = copy({ caption_body: "The high cut sits at 5500 Hz." });
    expect(checkNumbers(sheet(), c).pass).toBe(false);
  });
  it("rejects a unit swap (549 Hz is not 549 ms)", () => {
    expect(checkNumbers(sheet(), copy({ caption_body: "549 Hz delay." })).pass).toBe(false);
  });
  it("rejects a missing fact id", () => {
    expect(checkNumbers(sheet(), copy({ cited_facts: [{ fact_id: "zz9", text: "1" }] })).pass).toBe(false);
  });
});

describe("D1 musical keys (Sasha #1)", () => {
  it("parses keys case-sensitively so 'in a room' is not a key", () => {
    expect(keyMentions("play it in a small room")).toEqual([]);
    expect(keyMentions("it's in Ab tonight, key of F#m later")).toEqual(["Ab", "F#m"]);
  });
  it("accepts a cited key fact", () => {
    const c = copy({ caption_line1: "It sits in Ab, so the open strings ring.", cited_facts: [...copy().cited_facts, { fact_id: "k01", text: "Key of Ab" }] });
    expect(checkNumbers(sheet(), c).pass).toBe(true);
  });
  it("rejects a wrong key", () => {
    const c = copy({ caption_line1: "It sits in G, so capo up.", cited_facts: [...copy().cited_facts, { fact_id: "k01", text: "Key of Ab" }] });
    const r = checkNumbers(sheet(), c);
    expect(r.pass).toBe(false);
    expect(r.detail).toContain('key "G"');
  });
  it("rejects the right key when it was not cited", () => {
    expect(checkNumbers(sheet(), copy({ caption_line1: "Key of Ab, open strings ring." })).pass).toBe(false);
  });
});

describe("D2 banned patterns", () => {
  it("passes clean copy", () => {
    expect(checkBanned(sheet(), copy()).pass).toBe(true);
  });
  it.each([
    ["Here's what makes it work", "here"],
    ["A lush wash for Sunday", "lush"],
    ["This will unlock your sound", "unlock"],
    ["Whether you're new or not", "whether"],
    ["I tested this on Sunday", "tested"],
  ])("rejects %s", (body) => {
    expect(checkBanned(sheet(), copy({ caption_body: body })).pass).toBe(false);
  });
  it("applies the escalator list to the headline only", () => {
    expect(checkBanned(sheet(), copy({ slide1_headline: "The best preset for Goodness of God" })).pass).toBe(false);
    expect(checkBanned(sheet(), copy({ caption_body: "Every block is listed in order." })).pass).toBe(true);
  });
  it("rejects a banned player name on pool attribution", () => {
    const r = checkBanned(sheet(), copy({ caption_line1: "Hislop runs the swells like this." }));
    expect(r.pass).toBe(false);
    expect(r.detail).toContain("Hislop");
  });
});

describe("D4 novelty", () => {
  it("rejects a hook that opens like a recent one", () => {
    expect(checkNovelty(sheet(), copy({ slide1_headline: "Your Deluxe model sounds thin and boxy?" })).pass).toBe(false);
  });
  it("rejects a near-duplicate caption line", () => {
    expect(jaccard("Swell in with the volume pedal and let the reverb carry the verse.", "Swell in with the volume pedal and let the reverb carry it.")).toBeGreaterThanOrEqual(0.5);
    expect(checkNovelty(sheet(), copy({ caption_line1: "Swell in with the volume pedal and let the reverb carry it." })).pass).toBe(false);
  });
  it("passes fresh copy", () => {
    expect(checkNovelty(sheet(), copy()).pass).toBe(true);
  });
});

describe("D1b rendered text (Mara #4)", () => {
  it("passes the composed slides and caption", () => {
    const fsx = sheet();
    const c = copy();
    expect(verifyRendered(fsx, composeSlides(fsx, c), composeCaption(fsx, c)).pass).toBe(true);
  });
  it("catches a hardcoded number in template text", () => {
    const fsx = sheet();
    const c = copy();
    const slides = composeSlides(fsx, c);
    const bad: SlideSpec[] = [...slides];
    bad[bad.length - 1] = { ...bad[bad.length - 1], lines: [...bad[bad.length - 1].lines, { text: "Full settings for Helix and 6 other rigs." }] };
    const r = verifyRendered(fsx, bad, composeCaption(fsx, c));
    expect(r.pass).toBe(false);
    expect(r.detail).toContain('"6"');
  });
  it("derives the platform line from otherPlatforms (no count)", () => {
    const cap = composeCaption(sheet(), copy());
    expect(cap).toContain("Also written for Quad Cortex, Katana.");
    expect(composeCaption(sheet({ display: { ...sheet().display, otherPlatforms: [] } }), copy())).not.toContain("Also written for");
  });
});

describe("runGate", () => {
  it("passes good copy with an independent critic", () => {
    const r = runGate(sheet(), copy(), critic(), [], { fixItAllowlist: [] });
    expect(r.blocking.filter((c) => !c.pass)).toEqual([]);
    expect(r.pass).toBe(true);
    expect(r.forceApproval).toBe(false);
  });
  it("C2 = none blocks (Sasha #3)", () => {
    expect(runGate(sheet(), copy(), critic({ C2_question: "none" }), [], { fixItAllowlist: [] }).pass).toBe(false);
  });
  it("a non-independent critic forces approval (Mara #3)", () => {
    const r = runGate(sheet(), copy(), critic({ independent: false }), [], { fixItAllowlist: [] });
    expect(r.pass).toBe(true);
    expect(r.forceApproval).toBe(true);
  });
  it("missing critic fails D0", () => {
    expect(runGate(sheet(), copy(), null, [], { fixItAllowlist: [] }).pass).toBe(false);
  });
  it("rejects the bad demo copy (invented number, wrong key, banned phrase)", () => {
    const bad = copy({
      slide1_headline: "Here's what makes Goodness of God sound so lush on a preset",
      caption_line1: "David Hislop plays it in G with the delay feedback at 40.",
      caption_body: "Set the 549 ms delay and push the reverb mix to 55 for that wash.",
      cited_facts: [{ fact_id: "f03", text: "549 ms" }],
    });
    const r = runGate(sheet(), bad, critic(), [], { fixItAllowlist: [] });
    const failed = r.blocking.filter((c) => !c.pass).map((c) => c.id);
    expect(r.pass).toBe(false);
    expect(failed).toEqual(expect.arrayContaining(["D1", "D2"]));
  });
});

describe("new_tone (song + chain)", () => {
  const svg = '<svg viewBox="0 0 32 32"><path d="M4 22 L10 22"/></svg>';
  function toneSheet(og: string, over: Partial<FactSheet> = {}): FactSheet {
    const base = sheet();
    return sheet({
      slotId: "2026-11-05-new_tone",
      format: "new_tone",
      cta: "Save this for when you build it.",
      facts: [
        ...base.facts,
        fact("d06", "display", "2 blocks", { label: "blockCount" }),
        fact("og01", "text", og, { blockId: "b01" }),
        fact("og02", "text", "Strymon Timeline", { blockId: "b02" }),
        fact("f05", "setting", "1", { label: "125Hz", blockId: "b02", value: 1 }),
      ],
      blocks: [
        { ...base.blocks[0], originalGearFactId: "og01", tile: { kind: "Comp", color: "teal", iconSvg: svg } },
        { ...base.blocks[1], factIds: ["f03", "f04", "f05"], originalGearFactId: "og02", tile: { kind: "Delay", color: "green", iconSvg: svg } },
      ],
      eyebrowFactIds: ["d04", "d06"],
      ...over,
    });
  }
  const c = () => copy({ slotId: "2026-11-05-new_tone", slide1_fact_ids: ["f03"] });

  it("composes cover, signal path, knob cards and close", () => {
    const slides = composeSlides(toneSheet("Walrus Audio Deep Six"), c());
    expect(slides.map((s) => s.kind)).toEqual(["song", "chain", "block", "close"]);
    expect(slides[1].chain!.nodes.map((n) => n.gear?.text)).toEqual(["Walrus Audio Deep Six", "Strymon Timeline"]);
  });

  it("licenses data labels like 125Hz and data-derived chain text", () => {
    const fs = toneSheet("Walrus Audio Deep Six");
    expect(verifyRendered(fs, composeSlides(fs, c()), composeCaption(fs, c())).pass).toBe(true);
  });

  it("blocks an undocumented player named in real-gear data", () => {
    const fs = toneSheet("Hislop's pedalboard comp");
    const r = runGate(fs, c(), null, [], { fixItAllowlist: [] });
    const d6 = r.blocking.find((x) => x.id === "D6")!;
    expect(d6.pass).toBe(false);
    expect(d6.detail).toMatch(/Hislop/);
  });

  it("still catches an invented number in chain template text", () => {
    const fs = toneSheet("Walrus Audio Deep Six");
    const slides = composeSlides(fs, c());
    slides[1].chain!.meta.push({ text: "Line 6 Helix" });
    expect(verifyRendered(fs, slides, composeCaption(fs, c())).detail).toMatch(/unlicensed "6"/);
  });
});
