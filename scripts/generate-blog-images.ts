/**
 * Generate AI hero images for blog posts using the moodboard system.
 *
 * Usage: npx tsx scripts/generate-blog-images.ts [--dry-run] [--slug=some-post] [--provider=replicate]
 *
 * How it works:
 * 1. Scans content/blog/*.mdx for posts missing a local hero image
 * 2. Reads `author_slug` from frontmatter → looks up the author's
 *    assigned moodboard in moodboards.json
 * 3. Fills the moodboard's prompt_template with a subject derived
 *    from the post title (or from SUBJECT_OVERRIDES if one exists)
 * 4. Calls Replicate to generate the image. Default model is OpenAI's
 *    gpt-image-1 hosted on Replicate (billed via Replicate credits, which
 *    sidesteps the OpenAI direct-API billing hard limit). Flux 2 Pro and
 *    Nano Banana Pro are still available via --model=. The legacy direct
 *    OpenAI API path is available via --provider=openai.
 * 5. Saves to public/images/blog/<slug>.jpg and updates frontmatter
 *
 * Cost (approx, varies with quality):
 *   Replicate openai/gpt-image-1 (default, medium quality): ~$0.04/image
 *   Replicate Flux 2 Pro (--model=black-forest-labs/flux-2-pro): ~$0.055/image
 *   OpenAI gpt-image-2 direct (--provider=openai): ~$0.04/image (needs OpenAI billing)
 *
 * Environment:
 *   REPLICATE_API_TOKEN — required (default provider)
 *   OPENAI_API_KEY      — required only for --provider=openai
 *   FK_MODEL            — optional Replicate model override (or use --model=)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Load .env.local so the script works without pre-exporting vars in the shell
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (!process.env[key]) process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Config                                                                     */
/* -------------------------------------------------------------------------- */

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_MODEL = process.env.FK_MODEL ?? "openai/gpt-image-1";
const OPENAI_IMAGE_MODEL = "gpt-image-2";
const OPENAI_IMAGE_SIZE = "1536x1024"; // 16:9 landscape

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const IMAGE_DIR = path.join(process.cwd(), "public", "images", "blog");
const MOODBOARDS_PATH = path.join(process.cwd(), "scripts", "moodboards.json");

// Provider is validated at runtime in main() once we know which flag was passed

/* -------------------------------------------------------------------------- */
/*  Load moodboards + build author→mood map                                    */
/* -------------------------------------------------------------------------- */

interface Moodboard {
  prompt_template: string;
  authors: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const moodboards: Record<string, Moodboard> = JSON.parse(
  fs.readFileSync(MOODBOARDS_PATH, "utf-8")
);

/**
 * Reverse map: author_slug → EVERY moodboard that lists them.
 *
 * This used to keep only the first match, which had two costs. Four of the
 * nine boards — cathedral_ambient, editorial_white, tech_bench, brand_pop —
 * listed only authors already claimed by an earlier board, so they never
 * generated a single image. And each author got one look for all 40 of
 * their posts, which is why the library reads as five variations on "dark
 * room, warm rim light, haze".
 *
 * Every board that lists an author is now a candidate, and the choice is
 * made per post below.
 */
const AUTHOR_TO_MOODS: Record<string, string[]> = {};
for (const [moodKey, mood] of Object.entries(moodboards)) {
  if (moodKey.startsWith("_") || !mood.authors) continue;
  for (const author of mood.authors) {
    (AUTHOR_TO_MOODS[author] ??= []).push(moodKey);
  }
}

/**
 * Pick one of an author's moodboards from the post slug.
 *
 * Deterministic on purpose: regenerating a post must land on the same board
 * it had before, or every re-run silently restyles the archive. Sorting the
 * candidates first keeps the choice stable against key order in
 * moodboards.json.
 */
function moodForPost(authorSlug: string, slug: string): string | undefined {
  const moods = AUTHOR_TO_MOODS[authorSlug];
  if (!moods?.length) return undefined;
  const sorted = [...moods].sort();
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return sorted[h % sorted.length];
}

/* -------------------------------------------------------------------------- */
/*  Subject overrides — short noun phrases for posts where the auto-derived    */
/*  subject from the title wouldn't produce a good image.                      */
/* -------------------------------------------------------------------------- */

const SUBJECT_OVERRIDES: Record<string, string> = {
  "tube-screamer-settings-guide": "a green Ibanez Tube Screamer overdrive pedal with its knobs visible",
  "big-muff-settings-guide": "a Big Muff Pi fuzz pedal with its distinctive enclosure",
  "boss-ds1-settings-guide": "an orange Boss DS-1 distortion pedal on a pedalboard with patch cables",
  "klon-centaur-settings-guide": "a gold Klon Centaur overdrive pedal in pristine condition",
  "rat-pedal-settings-guide": "a ProCo RAT distortion pedal with gritty texture",
  "jcm800-settings-guide": "a Marshall JCM800 amplifier head showing the front panel controls and logo",
  "helix-vs-quad-cortex-vs-kemper": "three guitar modeler units arranged on a dark surface",
  "helix-vs-quad-cortex": "two guitar multi-effects processors side by side on a pedalboard",
  "david-gilmour-pink-floyd-tone": "a vintage black Fender Stratocaster next to a Big Muff and delay pedal",
  "hendrix-fuzz-tone-recipe": "a vintage Stratocaster with a Fuzz Face and wah pedal on a dark stage",
  "john-mayer-clean-tone-settings": "a clean Fender Stratocaster and Fender amplifier in a warm studio",
  "metallica-rhythm-tone-settings": "a dark ESP guitar and high-gain amplifier stack with aggressive lighting",
  "srv-tone-on-helix": "a vintage Stratocaster with heavy string gauge and a Tube Screamer pedal",
  "the-edge-delay-settings": "a guitar pedalboard with multiple delay pedals in ethereal blue lighting",
  "worship-guitar-tone-helix": "a worship guitarist's pedalboard with ambient effects on a church stage",
  "acdc-rhythm-tone-recipe": "a Gibson SG leaning against a Marshall amplifier stack",
  "shoegaze-wall-of-sound-recipe": "a massive pedalboard covered in reverb and fuzz pedals with haze",
  "signal-chain-order-guide": "guitar effects pedals arranged in a signal chain on a pedalboard",
  "overdrive-vs-distortion-vs-fuzz": "three guitar drive pedals side by side showing different gain types",
  "complete-guide-guitar-amp-types": "four different guitar amplifier types arranged together in a studio",
  "solid-state-amps-2026": "a Roland JC-120 Jazz Chorus combo amplifier and Boss Katana combo, two solid-state amps side by side on a clean white surface",
  "what-a-beautiful-name-guitar-tone-helix": "a hollowbody electric guitar running into a Line 6 Helix on a church stage, warm amber light and ambient haze",
  "september-volunteer-worship-guitarist-starter": "a butterscotch Telecaster leaning against a small combo amp on a quiet church stage, one cable, soft morning light through a window",
  "alnico-blue-vs-greenback-ac30-worship": "two Celestion guitar speakers inside an open Vox AC30 cabinet, one blue alnico speaker and one green-magnet Greenback, warm workshop light",
  // Auto-derived subject from this title trips the provider's sensitivity
  // filter (the "Axl" token reads as a real person). Describe the scene instead.
  "ask-axl-ai-guitar-tone-assistant": "a laptop on a desk beside a floor modeler and an electric guitar, the screen showing a chat window with a signal chain diagram of amp and pedal blocks, warm desk lamp light",
};

/**
 * Derive a subject string from the post title when no override exists.
 * Strips common suffixes and prepends "a composition illustrating".
 */
/**
 * Concrete photographable subjects per tag, most specific first.
 *
 * The old derivation handed the model the headline verbatim —
 * `a composition illustrating "Best FRFR Speakers for Modelers"` — and let
 * it free-associate from marketing copy. That is why the FRFR roundup got a
 * tweed guitar cab as its hero, contradicting its own argument in the most
 * visible slot on the page, and why "Metallica Rhythm Tone Settings" got a
 * Telecaster into a tweed combo.
 *
 * A diffusion model renders nouns, not claims. Order matters: the first tag
 * a post carries that appears here wins, so put physical objects above
 * abstractions.
 */
const TAG_SUBJECTS: Array<[RegExp, string]> = [
  [/^frfr$/, "a black powered FRFR wedge monitor on a stage floor beside a floor modeler"],
  [/^hx-stomp$/, "a Line 6 HX Stomp compact modeler on a small pedalboard, patch cables attached"],
  [/^helix$/, "a Line 6 Helix floor modeler with its scribble strips lit and an expression pedal"],
  [/^quad-cortex$/, "a Neural DSP Quad Cortex modeler, its touchscreen lit, on a dark pedalboard"],
  [/^(tonex|kemper|fractal|axe-fx)$/, "a rackmount amp modeler with its front-panel display lit"],
  [/^katana$/, "a Boss Katana combo amplifier with its control panel facing the camera"],
  [/^(tube-amp|amp-settings|amps?)$/, "a tube amplifier head on a 4x12 cabinet, control panel lit"],
  [/^(overdrive|drive|fuzz|distortion)$/, "an overdrive pedal on a pedalboard, knobs and footswitch in focus"],
  [/^(delay|echo)$/, "a delay pedal on a pedalboard with patch cables running out of frame"],
  [/^(reverb|ambient|shimmer)$/, "a reverb pedal on a pedalboard, its indicator LED lit"],
  [/^(compressor|comp)$/, "a compressor pedal on a pedalboard beside a guitar cable"],
  [/^(eq|equali[sz]er)$/, "a graphic EQ pedal with its faders set in a curve"],
  [/^(cab|cabinet|speakers?|ir|impulse-response)$/, "a 4x12 guitar cabinet with a dynamic microphone on a stand in front of the grille"],
  [/^(mic|microphone|recording)$/, "a dynamic microphone on a boom stand aimed at a guitar speaker cabinet"],
  [/^(pedalboard|board)$/, "a fully wired pedalboard photographed from above"],
  [/^(strat|stratocaster)$/, "a Fender Stratocaster leaning against an amplifier"],
  [/^(les-paul|lp)$/, "a Gibson Les Paul leaning against an amplifier"],
  [/^(telecaster|tele)$/, "a Fender Telecaster leaning against an amplifier"],
  [/^(pickups?|humbucker|single-coil|p90)$/, "a close view of electric guitar pickups under the strings"],
  [/^(nut|tuners?|floyd-rose|tremolo|setup)$/, "a guitar headstock and nut on a workbench beside luthier tools"],
  [/^worship$/, "a guitar rig set up on a church stage before a service"],
  [/^(modeler|modelers|patch|preset)$/, "a floor modeler on a pedalboard with its display lit"],
  [/^(signal-chain|routing|gain-staging)$/, "a pedalboard photographed from above with patch cables tracing the signal path"],
];

/** Fallback per category when no tag resolves — still a noun, never a claim. */
const CATEGORY_SUBJECTS: Record<string, string> = {
  "gear-lab": "a piece of guitar gear on a technician's workbench",
  "settings-guides": "an amplifier control panel photographed straight on, knobs in focus",
  "signal-chain": "a pedalboard photographed from above with patch cables tracing the signal path",
  "tone-recipes": "an electric guitar and amplifier set up in a recording room",
  "technique": "an electric guitar being played, hands in frame",
  "recording": "a guitar cabinet with a microphone in front of it in a treated room",
};

/**
 * Build a photographable subject from the post's own structured data.
 *
 * Priority: hand-written override → tag match → category → a neutral
 * gear still life. The title is deliberately never used.
 */
function subjectForPost(
  slug: string,
  tags: string[],
  category: string,
): string {
  if (SUBJECT_OVERRIDES[slug]) return SUBJECT_OVERRIDES[slug];
  for (const tag of tags) {
    const norm = tag.toLowerCase().trim();
    for (const [re, subject] of TAG_SUBJECTS) {
      if (re.test(norm)) return subject;
    }
  }
  return (
    CATEGORY_SUBJECTS[category] ??
    "an electric guitar, amplifier and pedalboard arranged as a still life"
  );
}

/* -------------------------------------------------------------------------- */
/*  Replicate API helpers                                                      */
/* -------------------------------------------------------------------------- */

async function generateImage(
  prompt: string,
  model: string
): Promise<string> {
  // Build the payload — input schema differs per model family
  let input: Record<string, unknown>;
  if (model.includes("gpt-image")) {
    // OpenAI gpt-image-1 on Replicate: only 1:1 / 3:2 / 2:3 ratios.
    // 3:2 => 1536x1024, the closest landscape (matches the old direct-OpenAI size).
    input = {
      prompt,
      aspect_ratio: "3:2",
      quality: "medium",
      output_format: "jpeg",
      number_of_images: 1,
    };
  } else if (model.startsWith("black-forest-labs/flux")) {
    input = { prompt, aspect_ratio: "16:9", output_format: "jpg", safety_tolerance: 2 };
  } else {
    input = { prompt, aspect_ratio: "16:9", resolution: "2K", output_format: "jpg", allow_fallback_model: true };
  }

  // Start prediction with retry-on-throttle
  let predictionId = "";
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(
      `https://api.replicate.com/v1/models/${model}/predictions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      }
    );

    const body = await res.json();

    if (body.id) {
      predictionId = body.id;
      break;
    }

    // Throttled — wait and retry
    const retryAfter = body.retry_after ?? 10;
    console.log(`  ...throttled, waiting ${retryAfter}s (attempt ${attempt + 1}/8)`);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
  }

  if (!predictionId) {
    throw new Error("Failed to start prediction after 8 attempts");
  }

  console.log(`  Prediction ${predictionId} started`);

  // Poll for completion
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const check = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    const status = await check.json();

    if (status.status === "succeeded") {
      const output = status.output;
      if (Array.isArray(output)) return output[0];
      if (typeof output === "string") return output;
      throw new Error("Unexpected output format");
    }
    if (status.status === "failed") {
      throw new Error(`Prediction failed: ${status.error}`);
    }
  }
  throw new Error("Prediction timed out after 3 minutes");
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
}

/* -------------------------------------------------------------------------- */
/*  OpenAI gpt-image-2 generator                                              */
/* -------------------------------------------------------------------------- */

interface OpenAIImageUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

async function generateImageOpenAI(
  prompt: string,
  filepath: string
): Promise<{ usage: OpenAIImageUsage }> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_IMAGE_MODEL,
      prompt,
      size: OPENAI_IMAGE_SIZE,
      quality: "medium",
      output_format: "jpeg",
      n: 1,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`OpenAI API error ${res.status}: ${JSON.stringify(err)}`);
  }

  const body = await res.json();
  const b64 = body.data?.[0]?.b64_json;
  if (!b64) throw new Error("No b64_json in OpenAI response");

  fs.writeFileSync(filepath, Buffer.from(b64, "base64"));

  const usage: OpenAIImageUsage = body.usage ?? {
    input_tokens: 0,
    output_tokens: 0,
    total_tokens: 0,
  };
  return { usage };
}

function openAICost(usage: OpenAIImageUsage): number {
  // $5/M text input tokens + $30/M image output tokens
  return (usage.input_tokens * 5 + usage.output_tokens * 30) / 1_000_000;
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const singleSlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const provider = (args.find((a) => a.startsWith("--provider="))?.split("=")[1] ?? "replicate") as "replicate" | "openai";
  const moodOverride = args.find((a) => a.startsWith("--mood="))?.split("=")[1];
  const modelOverride = args.find((a) => a.startsWith("--model="))?.split("=")[1];

  // Validate credentials for chosen provider
  if (provider === "openai") {
    if (!OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not set. Add it to .env.local");
      process.exit(1);
    }
    console.log(`Provider: OpenAI ${OPENAI_IMAGE_MODEL} (${OPENAI_IMAGE_SIZE}, medium quality)`);
  } else {
    if (!API_TOKEN) {
      console.error("❌ REPLICATE_API_TOKEN not set. Add it to .env.local");
      process.exit(1);
    }
    console.log(`Provider: Replicate (${modelOverride ?? DEFAULT_MODEL})`);
  }

  // Ensure output directory exists
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  console.log(`Found ${files.length} blog posts`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;
  let totalOpenAICost = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");

    // Single-slug mode
    if (singleSlug && slug !== singleSlug) continue;

    // Skip if .jpg already exists
    const imagePath = path.join(IMAGE_DIR, `${slug}.jpg`);
    if (fs.existsSync(imagePath) && !singleSlug) {
      skipped++;
      continue;
    }

    // Read frontmatter
    const mdxPath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(mdxPath, "utf-8");
    const { data, content } = matter(raw);

    // Look up moodboard from author_slug (--mood flag overrides)
    const authorSlug: string = data.author_slug ?? "";
    const moodKey =
      moodOverride ?? moodForPost(authorSlug, slug) ?? "nocturnal_studio";
    const mood = moodboards[moodKey];

    if (!mood?.prompt_template) {
      console.warn(`  ⚠ No prompt_template for mood "${moodKey}" — skipping ${slug}`);
      errors++;
      continue;
    }

    // Build the subject
    const subject = subjectForPost(
      slug,
      Array.isArray(data.tags) ? (data.tags as string[]) : [],
      String(data.category ?? ""),
    );

    // Fill the template
    const prompt = mood.prompt_template.replace(/SUBJECT_PLACEHOLDER/g, subject);

    // Pick the Replicate model (only used when provider=replicate)
    const model = modelOverride ?? DEFAULT_MODEL;

    console.log(`[gen] ${slug}`);
    console.log(`  Author: ${authorSlug || "(none)"} → mood: ${moodKey}${moodOverride ? " (override)" : ""}`);
    if (provider === "replicate") console.log(`  Model: ${model}`);
    console.log(`  Subject: ${subject.substring(0, 60)}...`);

    if (dryRun) {
      console.log(`  [dry-run] Would generate image`);
      generated++;
      continue;
    }

    try {
      if (provider === "openai") {
        const { usage } = await generateImageOpenAI(prompt, imagePath);
        const size = (fs.statSync(imagePath).size / 1024).toFixed(0);
        const cost = openAICost(usage);
        console.log(`  ✓ Saved: ${imagePath} (${size}KB)`);
        console.log(`  Usage: ${usage.input_tokens} in / ${usage.output_tokens} out — $${cost.toFixed(4)}`);
        totalOpenAICost += cost;
      } else {
        const imageUrl = await generateImage(prompt, model);
        await downloadImage(imageUrl, imagePath);
        const size = (fs.statSync(imagePath).size / 1024).toFixed(0);
        console.log(`  ✓ Saved: ${imagePath} (${size}KB)`);
      }

      // Update frontmatter to point to local image. Never clobber a
      // hand-written image_alt — only fill it when missing/too short, since
      // the auto value (a truncated subject fragment) is worse than a real
      // descriptive alt and would regress accessibility + OpenGraph.
      data.image = `/images/blog/${slug}.jpg`;
      if (!data.image_alt || String(data.image_alt).trim().length < 20) {
        data.image_alt = subject.split(",")[0];
      }
      const updated = matter.stringify(content, data);
      fs.writeFileSync(mdxPath, updated);

      generated++;
    } catch (err) {
      console.error(`  ✗ ERROR: ${err}`);
      errors++;
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done! Generated: ${generated}, Skipped: ${skipped}, Errors: ${errors}`);
  if (provider === "openai") {
    console.log(`Actual cost (OpenAI): $${totalOpenAICost.toFixed(4)}`);
  } else {
    const activeModel = modelOverride ?? DEFAULT_MODEL;
    const perImage = activeModel.includes("gpt-image") ? 0.04 : 0.055;
    console.log(`Estimated cost (Replicate ${activeModel}): ~$${(generated * perImage).toFixed(2)}`);
  }
}

main().catch(console.error);
