/**
 * Harvest the Line 6 Helix factory preset library at
 * ~/Downloads/Helix Presets/*.hlx into structured JSON.
 *
 * Outputs three files in data/helix-corpus/:
 *
 *   models.json
 *     For every @model ID seen across the corpus, the param keys it
 *     uses and basic value-type info (numeric range, integer-ness,
 *     boolean, string). This is the ground-truth shape table the
 *     generator and QC agent both depend on.
 *
 *   presets.json
 *     Per-preset summary: filename, decoded title (best-effort),
 *     firmware metadata, block count per DSP, routing topology,
 *     and the ordered list of @model IDs in each path. Lets us
 *     answer "which factory preset uses block X" in one grep.
 *
 *   routing.json
 *     Frequency table of routing topologies (single-DSP vs split,
 *     output IDs, snapshot patterns).
 *
 *   filename-guesses.json
 *     Per-preset filename → best guess at the song / artist / amp /
 *     genre being referenced. Flagged with confidence + evidence.
 *
 * Usage: npx tsx scripts/harvest-helix-factory.ts
 *        npx tsx scripts/harvest-helix-factory.ts /custom/folder
 */
import fs from "fs";
import path from "path";

const FOLDER = process.argv[2] ?? path.join(
  process.env.HOME ?? "",
  "Downloads",
  "Helix Presets",
);
const OUT_DIR = path.join(process.cwd(), "data", "helix-corpus");
fs.mkdirSync(OUT_DIR, { recursive: true });

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

interface ParamSample {
  count: number;
  types: Set<string>; // "number", "boolean", "string", "integer"
  numericMin?: number;
  numericMax?: number;
  booleanSeen?: boolean;
  stringSamples?: Set<string>;
}

interface ModelSample {
  modelId: string;
  count: number; // how many factory presets contain this model
  blockTypes: Set<number>; // observed @type values
  hasStereo: number; // count of presets where @stereo is present
  hasTrails: number;
  hasBypassvolume: number;
  params: Record<string, ParamSample>;
  filenames: string[]; // up to 5 example filenames using this model
}

interface PresetSummary {
  filename: string;
  decoded: { title: string; bestGuess: string; evidence: string[] };
  buildSha: string;
  appversion: number;
  device: number;
  hasController: boolean;
  hasFootswitch: boolean;
  dsp0BlockCount: number;
  dsp1BlockCount: number;
  dsp0OutputAOutput: number | null;
  dsp1InputAInput: number | null;
  dsp1OutputAOutput: number | null;
  validSnapshots: number;
  dsp0Models: string[]; // ordered by @position
  dsp1Models: string[];
}

const models: Map<string, ModelSample> = new Map();
const presets: PresetSummary[] = [];
const routingTopologies: Map<string, number> = new Map();
const skippedFiles: { filename: string; reason: string }[] = [];

/** Update a ModelSample with one observation of a block. */
function observeBlock(filename: string, block: Record<string, Json>) {
  const modelId = block["@model"] as string;
  if (!modelId || typeof modelId !== "string") return;
  // Skip the DSP infrastructure pseudo-blocks
  if (modelId.startsWith("HD2_AppDSPFlow") || modelId.startsWith("@")) return;

  let m = models.get(modelId);
  if (!m) {
    m = {
      modelId,
      count: 0,
      blockTypes: new Set(),
      hasStereo: 0,
      hasTrails: 0,
      hasBypassvolume: 0,
      params: {},
      filenames: [],
    };
    models.set(modelId, m);
  }
  m.count++;
  if (m.filenames.length < 5 && !m.filenames.includes(filename)) {
    m.filenames.push(filename);
  }
  if (typeof block["@type"] === "number") m.blockTypes.add(block["@type"]);
  if ("@stereo" in block) m.hasStereo++;
  if ("@trails" in block) m.hasTrails++;
  if ("@bypassvolume" in block) m.hasBypassvolume++;

  for (const [key, value] of Object.entries(block)) {
    if (key.startsWith("@")) continue;
    let p = m.params[key];
    if (!p) {
      p = { count: 0, types: new Set() };
      m.params[key] = p;
    }
    p.count++;
    if (typeof value === "boolean") {
      p.types.add("boolean");
      p.booleanSeen = true;
    } else if (typeof value === "number") {
      p.types.add(Number.isInteger(value) ? "integer" : "number");
      p.numericMin = p.numericMin === undefined ? value : Math.min(p.numericMin, value);
      p.numericMax = p.numericMax === undefined ? value : Math.max(p.numericMax, value);
    } else if (typeof value === "string") {
      p.types.add("string");
      if (!p.stringSamples) p.stringSamples = new Set();
      if (p.stringSamples.size < 8) p.stringSamples.add(value);
    }
  }
}

/** Best-effort filename → song/amp/artist guess. */
function decodeFilename(filename: string): PresetSummary["decoded"] {
  const base = filename.replace(/\.hlx$/i, "");
  const evidence: string[] = [];

  // Strip BAS_, IR_, FX_, AMB_ prefixes etc. (they're category markers)
  const m = /^([A-Z]{2,4})[_ -](.*)$/.exec(base);
  let title = base;
  let category: string | null = null;
  if (m) {
    category = m[1];
    title = m[2];
    evidence.push(`category prefix: ${category}`);
  }

  // Common substring → song-or-artist heuristics
  const songPatterns: { pattern: RegExp; guess: string }[] = [
    { pattern: /\$\$\$.*nothin/i, guess: "Money for Nothing — Dire Straits" },
    { pattern: /money\s*for\s*nothin/i, guess: "Money for Nothing — Dire Straits" },
    { pattern: /comfortably\s*numb|gilmour/i, guess: "Pink Floyd / David Gilmour" },
    { pattern: /stairway/i, guess: "Stairway to Heaven — Led Zeppelin" },
    { pattern: /thunderstruck|back\s*in\s*black|hells\s*bells|highway\s*to\s*hell/i, guess: "AC/DC" },
    { pattern: /enter\s*sandman|fade\s*to\s*black|master\s*of\s*puppets/i, guess: "Metallica" },
    { pattern: /sweet\s*child|november\s*rain|welcome\s*to\s*the\s*jungle/i, guess: "Guns N' Roses / Slash" },
    { pattern: /eruption|panama|jump|hot\s*for\s*teacher/i, guess: "Van Halen / EVH" },
    { pattern: /walk\s*this\s*way|sweet\s*emotion/i, guess: "Aerosmith" },
    { pattern: /smells\s*like\s*teen|come\s*as\s*you\s*are/i, guess: "Nirvana" },
    { pattern: /wonderwall|don'?t\s*look\s*back/i, guess: "Oasis" },
    { pattern: /under\s*the\s*bridge|californication|otherside|scar\s*tissue/i, guess: "Red Hot Chili Peppers / Frusciante" },
    { pattern: /streets\s*have\s*no\s*name|where\s*the\s*streets|i\s*still\s*haven'?t/i, guess: "U2 / The Edge" },
    { pattern: /voodoo\s*child|purple\s*haze|little\s*wing|hey\s*joe/i, guess: "Jimi Hendrix" },
    { pattern: /pride\s*and\s*joy|texas\s*flood|crossfire/i, guess: "SRV" },
    { pattern: /thrill\s*is\s*gone|lucille/i, guess: "B.B. King" },
    { pattern: /walk[\s_-]*groove|dimebag/i, guess: "Pantera / Dimebag" },
    { pattern: /bohemian|killer\s*queen|brian\s*may/i, guess: "Queen / Brian May" },
    { pattern: /gravity|slow\s*dancing|john\s*mayer/i, guess: "John Mayer" },
    { pattern: /time\s*solo|breathe|wish\s*you\s*were|shine\s*on/i, guess: "Pink Floyd" },
    { pattern: /smoke\s*on\s*the\s*water|highway\s*star|deep\s*purple/i, guess: "Deep Purple" },
    { pattern: /paranoid|iron\s*man|war\s*pigs|black\s*sabbath/i, guess: "Black Sabbath" },
    { pattern: /la\s*grange|tush|zz\s*top|gibbons/i, guess: "ZZ Top / Billy Gibbons" },
    { pattern: /satch|surfing\s*with|always\s*with\s*me/i, guess: "Joe Satriani" },
    { pattern: /vai|for\s*the\s*love\s*of\s*god/i, guess: "Steve Vai" },
    { pattern: /malmsteen|black\s*star/i, guess: "Yngwie Malmsteen" },
    { pattern: /petrucci|dream\s*theater/i, guess: "Dream Theater / Petrucci" },
    { pattern: /periphery|misha\s*mansoor/i, guess: "Periphery / Misha Mansoor" },
    { pattern: /tool|maynard|adam\s*jones/i, guess: "Tool / Adam Jones" },
    { pattern: /muse|matt\s*bellamy|plug\s*in\s*baby/i, guess: "Muse / Matt Bellamy" },
    { pattern: /radiohead|johnny\s*greenwood|creep/i, guess: "Radiohead" },
  ];

  let bestGuess = "(unknown — probably amp-name preset or original tone)";
  for (const { pattern, guess } of songPatterns) {
    if (pattern.test(title)) {
      bestGuess = guess;
      evidence.push(`matched pattern: ${pattern.source}`);
      break;
    }
  }

  // Amp-name detection (factory presets often named after the amp model)
  const ampPatterns: { pattern: RegExp; guess: string }[] = [
    { pattern: /US Double|Twin Reverb/i, guess: "Fender Twin Reverb (US Double)" },
    { pattern: /US Deluxe/i, guess: "Fender Deluxe Reverb (US Deluxe)" },
    { pattern: /Tweed|Bassman/i, guess: "Fender Bassman/Tweed" },
    { pattern: /Princess|Champ/i, guess: "Fender Champ/Princess" },
    { pattern: /Brit Plexi|JTM45|Marshall/i, guess: "Marshall Plexi/JTM" },
    { pattern: /Brit 2204|JCM800|2203/i, guess: "Marshall JCM 2203/2204" },
    { pattern: /A30|AC30|Vox/i, guess: "Vox AC30 (A30)" },
    { pattern: /WhoWatt|Hiwatt/i, guess: "Hiwatt DR103 (WhoWatt)" },
    { pattern: /Cali Texas|Mark/i, guess: "Mesa Mark series (Cali Texas)" },
    { pattern: /Cali Rectif|Rectifier/i, guess: "Mesa Rectifier (Cali Rectifire)" },
    { pattern: /Cali IV/i, guess: "Mesa Mark IV (Cali IV)" },
    { pattern: /Derailed|Two[\s-]?Rock/i, guess: "Two Rock (Derailed Ingrid)" },
    { pattern: /PV Panama|5150|6505/i, guess: "Peavey 5150/6505 (PV Panama)" },
    { pattern: /Soup Pro|Supro/i, guess: "Supro (Soup Pro)" },
    { pattern: /Cartographer|Benson/i, guess: "Benson (Cartographer)" },
    { pattern: /Das Benzin|Diezel/i, guess: "Diezel (Das Benzin)" },
    { pattern: /Fullerton/i, guess: "Fender Fullerton" },
    { pattern: /SVT|SVB|Ampeg/i, guess: "Ampeg SVT" },
  ];

  if (bestGuess.startsWith("(unknown")) {
    for (const { pattern, guess } of ampPatterns) {
      if (pattern.test(title)) {
        bestGuess = guess;
        evidence.push(`amp-name match: ${pattern.source}`);
        break;
      }
    }
  }

  if (category) {
    const catName = {
      BAS: "Bass",
      DLY: "Delay",
      FX: "Effects",
      MOD: "Modulation",
      AMB: "Ambient",
      AC: "Acoustic",
      IR: "Impulse Response",
      PCH: "Pitch",
    }[category];
    if (catName) bestGuess = `${catName}: ${bestGuess.startsWith("(unknown") ? title : bestGuess}`;
  }

  return { title: title.trim(), bestGuess, evidence };
}

/** Walk a single .hlx file, harvest blocks + summary. */
function processFile(filepath: string) {
  const filename = path.basename(filepath);
  let raw: string;
  try { raw = fs.readFileSync(filepath, "utf-8"); }
  catch (e) { skippedFiles.push({ filename, reason: `read error: ${e}` }); return; }

  let data: any;
  try { data = JSON.parse(raw); }
  catch (e) { skippedFiles.push({ filename, reason: `JSON parse error` }); return; }

  const meta = data?.data?.meta ?? {};
  const tone = data?.data?.tone ?? {};
  const dsp0 = tone.dsp0 ?? {};
  const dsp1 = tone.dsp1 ?? {};

  // Walk blocks on each DSP, sorted by @position
  function blocksOf(dsp: Record<string, any>): { models: string[]; count: number } {
    const blockKeys = Object.keys(dsp).filter((k) => k.startsWith("block") || k.startsWith("cab"));
    const sorted = blockKeys
      .map((k) => ({ k, pos: typeof dsp[k]?.["@position"] === "number" ? dsp[k]["@position"] : 99 }))
      .sort((a, b) => a.pos - b.pos);
    const ids: string[] = [];
    for (const { k } of sorted) {
      const block = dsp[k];
      if (!block || typeof block !== "object") continue;
      observeBlock(filename, block);
      const m = block["@model"];
      if (typeof m === "string" && !m.startsWith("@") && !m.startsWith("HD2_AppDSPFlow")) {
        ids.push(m);
      }
    }
    return { models: ids, count: ids.length };
  }

  // Also walk infrastructure (split/join/inputs/outputs) to capture rare params,
  // but DON'T include them in the model registry (they pollute results).
  // (Done implicitly by observeBlock skipping HD2_AppDSPFlow*.)

  const dsp0Info = blocksOf(dsp0);
  const dsp1Info = blocksOf(dsp1);

  // Routing topology
  const dsp0Out = dsp0?.outputA?.["@output"] ?? null;
  const dsp1In = dsp1?.inputA?.["@input"] ?? null;
  const dsp1Out = dsp1?.outputA?.["@output"] ?? null;
  const topo = `dsp0Out=${dsp0Out}|dsp1In=${dsp1In}|dsp1Out=${dsp1Out}|dsp0=${dsp0Info.count}b|dsp1=${dsp1Info.count}b`;
  routingTopologies.set(topo, (routingTopologies.get(topo) ?? 0) + 1);

  // Snapshot validity count
  let validSnapshots = 0;
  for (let i = 0; i < 8; i++) {
    if (tone[`snapshot${i}`]?.["@valid"]) validSnapshots++;
  }

  presets.push({
    filename,
    decoded: decodeFilename(filename),
    buildSha: meta.build_sha ?? "",
    appversion: meta.appversion ?? 0,
    device: data?.data?.device ?? 0,
    hasController: "controller" in tone,
    hasFootswitch: "footswitch" in tone,
    dsp0BlockCount: dsp0Info.count,
    dsp1BlockCount: dsp1Info.count,
    dsp0OutputAOutput: dsp0Out,
    dsp1InputAInput: dsp1In,
    dsp1OutputAOutput: dsp1Out,
    validSnapshots,
    dsp0Models: dsp0Info.models,
    dsp1Models: dsp1Info.models,
  });
}

// --- Main ---
const files = fs.readdirSync(FOLDER).filter((f) => f.endsWith(".hlx"));
console.log(`\nFound ${files.length} .hlx files in ${FOLDER}\n`);

for (const f of files) {
  processFile(path.join(FOLDER, f));
}

console.log(`Parsed: ${presets.length}`);
console.log(`Skipped: ${skippedFiles.length}`);
console.log(`Unique models found: ${models.size}`);
console.log(`Unique routing topologies: ${routingTopologies.size}`);

// Serialize models
function serializeParam(p: ParamSample): Json {
  const o: Json = {
    count: p.count,
    types: Array.from(p.types),
  };
  if (p.numericMin !== undefined) (o as any).min = p.numericMin;
  if (p.numericMax !== undefined) (o as any).max = p.numericMax;
  if (p.stringSamples) (o as any).stringSamples = Array.from(p.stringSamples);
  return o;
}

const modelsJson: Record<string, Json> = {};
const sortedModels = Array.from(models.values()).sort((a, b) => b.count - a.count);
for (const m of sortedModels) {
  const params: Record<string, Json> = {};
  for (const [k, v] of Object.entries(m.params)) {
    params[k] = serializeParam(v);
  }
  modelsJson[m.modelId] = {
    count: m.count,
    blockTypes: Array.from(m.blockTypes),
    hasStereo: m.hasStereo,
    hasTrails: m.hasTrails,
    hasBypassvolume: m.hasBypassvolume,
    exampleFiles: m.filenames,
    params,
  };
}

fs.writeFileSync(
  path.join(OUT_DIR, "models.json"),
  JSON.stringify({ totalModels: models.size, totalPresets: presets.length, models: modelsJson }, null, 2),
);
fs.writeFileSync(
  path.join(OUT_DIR, "presets.json"),
  JSON.stringify({ totalPresets: presets.length, presets }, null, 2),
);
const routingJson = Object.fromEntries(
  Array.from(routingTopologies.entries()).sort((a, b) => b[1] - a[1]),
);
fs.writeFileSync(
  path.join(OUT_DIR, "routing.json"),
  JSON.stringify({ uniqueTopologies: routingTopologies.size, topologies: routingJson }, null, 2),
);

const filenameGuesses = presets.map((p) => ({
  filename: p.filename,
  title: p.decoded.title,
  guess: p.decoded.bestGuess,
  evidence: p.decoded.evidence,
  blocks: [...p.dsp0Models, ...p.dsp1Models],
}));
fs.writeFileSync(
  path.join(OUT_DIR, "filename-guesses.json"),
  JSON.stringify({ totalPresets: presets.length, presets: filenameGuesses }, null, 2),
);

console.log(`\nWrote:`);
console.log(`  ${path.join(OUT_DIR, "models.json")}`);
console.log(`  ${path.join(OUT_DIR, "presets.json")}`);
console.log(`  ${path.join(OUT_DIR, "routing.json")}`);
console.log(`  ${path.join(OUT_DIR, "filename-guesses.json")}`);

if (skippedFiles.length > 0) {
  console.log(`\nSkipped ${skippedFiles.length}:`);
  for (const s of skippedFiles.slice(0, 10)) console.log(`  ${s.filename}: ${s.reason}`);
}
