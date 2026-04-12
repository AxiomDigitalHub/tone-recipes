/**
 * Generate AI hero images for blog posts using the moodboard system.
 *
 * Usage: npx tsx scripts/generate-blog-images.ts [--dry-run] [--slug=some-post]
 *
 * How it works:
 * 1. Scans content/blog/*.mdx for posts missing a local hero image
 * 2. Reads `author_slug` from frontmatter → looks up the author's
 *    assigned moodboard in moodboards.json
 * 3. Fills the moodboard's prompt_template with a subject derived
 *    from the post title (or from SUBJECT_OVERRIDES if one exists)
 * 4. Calls Replicate (Flux 2 Pro by default, Nano Banana Pro for
 *    editorial_white) to generate the image
 * 5. Saves to public/images/blog/<slug>.jpg and updates frontmatter
 *
 * Cost: ~$0.055/image (Flux 2 Pro). A full run of 50 missing images
 * costs ~$2.75. Budget accordingly.
 *
 * Environment:
 *   REPLICATE_API_TOKEN — required
 *   FK_MODEL — optional override (e.g. google/nano-banana-pro)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

/* -------------------------------------------------------------------------- */
/*  Config                                                                     */
/* -------------------------------------------------------------------------- */

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
const DEFAULT_MODEL = process.env.FK_MODEL ?? "black-forest-labs/flux-2-pro";
const EDITORIAL_WHITE_MODEL = "google/nano-banana-pro"; // Flux trips safety on white bg

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const IMAGE_DIR = path.join(process.cwd(), "public", "images", "blog");
const MOODBOARDS_PATH = path.join(process.cwd(), "scripts", "moodboards.json");

if (!API_TOKEN) {
  console.error("❌ REPLICATE_API_TOKEN not set. Export it or add to .env.local");
  process.exit(1);
}

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

// Reverse map: author_slug → first moodboard key that lists them
const AUTHOR_TO_MOOD: Record<string, string> = {};
for (const [moodKey, mood] of Object.entries(moodboards)) {
  if (moodKey.startsWith("_") || !mood.authors) continue;
  for (const author of mood.authors) {
    if (!AUTHOR_TO_MOOD[author]) AUTHOR_TO_MOOD[author] = moodKey;
  }
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
};

/**
 * Derive a subject string from the post title when no override exists.
 * Strips common suffixes and prepends "a composition illustrating".
 */
function subjectFromTitle(title: string): string {
  const cleaned = title
    .replace(/\s*[-—:]\s*.+$/, "") // drop subtitle after dash/colon
    .replace(/\s*\(.*?\)\s*/g, "") // drop parentheticals
    .trim();
  return `a composition illustrating "${cleaned}"`;
}

/* -------------------------------------------------------------------------- */
/*  Replicate API helpers                                                      */
/* -------------------------------------------------------------------------- */

async function generateImage(
  prompt: string,
  model: string
): Promise<string> {
  // Build the payload — schema differs between Flux and Nano Banana
  const input: Record<string, unknown> = model.startsWith("black-forest-labs/flux")
    ? { prompt, aspect_ratio: "16:9", output_format: "jpg", safety_tolerance: 2 }
    : { prompt, aspect_ratio: "16:9", resolution: "2K", output_format: "jpg", allow_fallback_model: true };

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
/*  Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const singleSlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  // Ensure output directory exists
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  console.log(`Found ${files.length} blog posts`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

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

    // Look up moodboard from author_slug
    const authorSlug: string = data.author_slug ?? "";
    const moodKey = AUTHOR_TO_MOOD[authorSlug] ?? "nocturnal_studio";
    const mood = moodboards[moodKey];

    if (!mood?.prompt_template) {
      console.warn(`  ⚠ No prompt_template for mood "${moodKey}" — skipping ${slug}`);
      errors++;
      continue;
    }

    // Build the subject
    const subject = SUBJECT_OVERRIDES[slug] ?? subjectFromTitle(data.title ?? slug);

    // Fill the template
    const prompt = mood.prompt_template.replace(/SUBJECT_PLACEHOLDER/g, subject);

    // Pick the model (editorial_white → Nano Banana, everything else → Flux 2 Pro)
    const model = moodKey === "editorial_white" ? EDITORIAL_WHITE_MODEL : DEFAULT_MODEL;

    console.log(`[gen] ${slug}`);
    console.log(`  Author: ${authorSlug || "(none)"} → mood: ${moodKey}`);
    console.log(`  Model: ${model}`);
    console.log(`  Subject: ${subject.substring(0, 60)}...`);

    if (dryRun) {
      console.log(`  [dry-run] Would generate image`);
      generated++;
      continue;
    }

    try {
      const imageUrl = await generateImage(prompt, model);
      await downloadImage(imageUrl, imagePath);
      const size = (fs.statSync(imagePath).size / 1024).toFixed(0);
      console.log(`  ✓ Saved: ${imagePath} (${size}KB)`);

      // Update frontmatter to point to local image
      data.image = `/images/blog/${slug}.jpg`;
      data.image_alt = subject.split(",")[0];
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
  console.log(`Estimated cost: ~$${(generated * 0.055).toFixed(2)}`);
}

main().catch(console.error);
