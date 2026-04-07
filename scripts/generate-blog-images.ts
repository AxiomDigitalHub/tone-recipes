/**
 * Generate AI hero images for blog posts using Replicate (Flux 1.1 Pro).
 *
 * Usage: npx tsx scripts/generate-blog-images.ts
 *
 * Generates a unique image for each blog post that doesn't already have
 * a local image in public/images/blog/. Saves as WebP, updates frontmatter.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const IMAGE_DIR = path.join(process.cwd(), "public", "images", "blog");

if (!API_TOKEN) {
  console.error("REPLICATE_API_TOKEN not set");
  process.exit(1);
}

// Post-specific image prompts based on content
const POST_PROMPTS: Record<string, string> = {
  // Settings guides
  "tube-screamer-settings-guide": "Close-up product photograph of a green Ibanez Tube Screamer overdrive pedal on a dark wooden surface, warm amber lighting, shallow depth of field, knobs visible",
  "big-muff-settings-guide": "Close-up product photograph of a Big Muff Pi fuzz pedal with its distinctive enclosure, dramatic side lighting, dark background",
  "boss-ds1-settings-guide": "Close-up of an orange Boss DS-1 distortion pedal on a pedalboard, patch cables connected, stage lighting",
  "klon-centaur-settings-guide": "Close-up of a gold Klon Centaur overdrive pedal, pristine condition, studio product photography, warm lighting",
  "rat-pedal-settings-guide": "Close-up of a ProCo RAT distortion pedal, gritty texture, dramatic low-key lighting, dark background",
  "jcm800-settings-guide": "Marshall JCM800 amplifier head close-up showing the front panel controls and logo, warm tube glow visible, dark studio environment",

  // Platform/modeler posts
  "helix-vs-quad-cortex-vs-kemper": "Three guitar modeler units arranged on a dark surface, professional studio lighting, top-down angle, cables and footswitches visible",
  "helix-vs-quad-cortex": "Two guitar multi-effects processors side by side on a pedalboard, stage lighting with blue and amber tones",
  "best-helix-amp-models-blues": "Blues guitarist's hands on a Stratocaster neck with a multi-effects pedalboard glowing below, warm amber stage lighting",
  "best-katana-settings-tube-amp": "Boss Katana guitar amplifier in a bedroom studio setting, guitar leaning against it, warm cozy lighting",
  "quad-cortex-preset-from-scratch": "Touchscreen guitar modeler showing a signal chain layout, fingers about to tap, modern studio desk",
  "quad-cortex-captures-vs-models": "Guitar modeler unit with touchscreen display next to a real tube amplifier, split lighting showing digital vs analog",
  "best-modeler-under-500": "Collection of affordable guitar modelers and multi-effects pedals arranged on a wooden table, budget-friendly gear, bright studio lighting",
  "line-6-helix-family-compared": "Multiple Line 6 Helix products arranged largest to smallest on a dark surface, product lineup photograph",
  "best-frfr-speakers-for-modelers": "FRFR powered speaker on a stage next to a guitar modeler pedalboard, concert venue setting, dramatic stage lighting",
  "frfr-vs-guitar-cab-for-modelers": "Split image concept: FRFR flat response speaker on one side and traditional guitar cabinet on the other, studio setting",

  // Signal chain / theory
  "signal-chain-order-guide": "Guitar effects pedals arranged in a signal chain line on a pedalboard, cables connecting them in order, overhead angle, studio lighting",
  "effects-loop-explained": "Back panel of a guitar amplifier showing effects loop send and return jacks with cables connected, close-up detail shot",
  "4-wire-method-explained": "Guitar amplifier connected to a multi-effects processor with four cables running between them, studio setting, clear cable routing visible",
  "beginner-signal-chains": "Simple guitar pedalboard with just three pedals (overdrive, delay, reverb) on a clean pedalboard, beginner-friendly setup, bright lighting",
  "overdrive-vs-distortion-vs-fuzz": "Three guitar drive pedals side by side showing different gain types, from clean overdrive to heavy fuzz, moody lighting",
  "impulse-response-ir-guide": "Guitar speaker cabinet with a microphone positioned in front of it, recording studio setting, professional mic placement",
  "guitar-eq-guide": "Close-up of an equalizer section on a guitar amplifier or mixing console, frequency knobs and sliders visible, warm studio lighting",

  // Artist tones
  "david-gilmour-pink-floyd-tone": "Vintage Fender Stratocaster in black with rosewood fretboard, next to effects pedals including a Big Muff and delay, atmospheric lighting",
  "hendrix-fuzz-tone-recipe": "Vintage Stratocaster with a Fuzz Face pedal and wah pedal on a dark stage, psychedelic colored lighting",
  "john-mayer-clean-tone-settings": "Clean Fender Stratocaster and a Fender amplifier in a warm studio setting, soft natural lighting, acoustic room treatment visible",
  "metallica-rhythm-tone-settings": "Heavy metal guitar rig with a dark ESP/Gibson style guitar and high-gain amplifier stack, aggressive red and black lighting",
  "srv-tone-on-helix": "Vintage Stratocaster with heavy string gauge, Texas blues vibe, worn frets, Tube Screamer pedal nearby, warm amber tones",
  "the-edge-delay-settings": "Guitar pedalboard focused on multiple delay pedals with dotted eighth note settings, ethereal blue lighting, atmospheric",
  "worship-guitar-tone-helix": "Worship guitarist's pedalboard with ambient effects (reverb, delay, shimmer), church stage setting, soft purple and white lighting",
  "modern-worship-guitar-tone-helix": "Modern church stage with ambient guitar rig, haze and soft colored lighting, pedalboard with expression pedal",
  "worship-pedalboard-guide": "Complete worship guitar pedalboard laid out with labeled sections (dynamics, drive, modulation, delay, reverb), clean organized setup",
  "acdc-rhythm-tone-recipe": "Gibson SG guitar leaning against a Marshall amplifier stack, rock and roll stage setting, powerful lighting",
  "radiohead-creep-tone-recipe": "Fender Telecaster with a distortion pedal on a minimalist pedalboard, moody alternative rock lighting",
  "shoegaze-wall-of-sound-recipe": "Massive pedalboard covered in reverb and fuzz pedals, dreamy ethereal lighting with haze, shoegaze atmosphere",

  // Quick fixes / workflow
  "fix-thin-modeler-tone": "Guitar modeler screen showing EQ settings being adjusted, close-up of the display with fingers tweaking parameters",
  "why-modeler-tone-sounds-fizzy": "Close-up of high-frequency EQ knob being turned down on a guitar amplifier, warm vs harsh tone concept",
  "how-to-dial-in-modeler-tone": "Guitarist sitting with a modeler and headphones, dialing in settings on the unit, focused bedroom studio setting",
  "solo-patch-volume-drop-fix": "Guitar pedalboard with a volume boost pedal highlighted/glowing, live stage setting, spotlight effect",
  "why-delay-sounds-muddy": "Delay pedal with wet and dry signal concept, clean vs muddy visualization, studio setting",
  "how-to-remove-60-cycle-hum": "Electric guitar pickups close-up showing single coil vs humbucker, technical detail shot, studio lighting",
  "gain-staging-drop-tunings": "Heavy gauge guitar strings on a down-tuned guitar, close-up of the bridge and thick strings, dark metal aesthetic",

  // Gear guides
  "complete-guide-guitar-amp-types": "Four different guitar amplifier types arranged together: tube combo, solid state head, modeling unit, and hybrid amp, studio showcase",
  "pickup-position-guide": "Close-up of guitar pickup selector switch between neck and bridge positions, showing the pickups below, detailed macro shot",
  "modeler-vs-tube-amp-shootout": "Guitar modeler facing off against a vintage tube amplifier, dramatic split lighting, versus comparison concept",
  "what-is-a-tone-recipe": "Beautiful recipe card layout concept for guitar tone settings, like a cooking recipe but for guitar, clean design, warm lighting",
  "500-dollar-gigging-rig": "Complete budget gigging guitar rig on a stage: affordable guitar, small modeler, cables, all under stage lights",
  "500-rig-challenge-two-approaches": "Two different guitar rigs side by side showing different budget approaches, comparison setup on a stage",
  "20-minute-practice-session": "Guitar practice setup at home: guitar on a stand, small amp, timer showing 20 minutes, cozy room lighting",

  // New posts
  "andy-timmons-lead-tone-recipe": "Gibson Les Paul with a clean tube amp setup, expressive lead guitar tone concept, warm vintage studio lighting",
  "nashville-session-clean-tele-compressor": "Fender Telecaster in butterscotch blonde with a compressor pedal, Nashville recording studio setting, warm professional lighting",
};

// Default prompt for posts not in the map
const DEFAULT_PROMPT = "Professional photograph of a guitar pedalboard with various effects pedals in a recording studio, warm amber lighting, shallow depth of field, dark wood surface";

async function generateImage(prompt: string): Promise<string> {
  const fullPrompt = `${prompt}, photorealistic, professional photography, 16:9 aspect ratio, high quality`;

  // Start prediction
  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "black-forest-labs/flux-1.1-pro",
      input: { prompt: fullPrompt, aspect_ratio: "16:9" },
    }),
  });

  const prediction = await res.json();
  const predictionId = prediction.id;
  console.log(`  Started prediction ${predictionId}`);

  // Poll for completion
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const check = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    const status = await check.json();
    if (status.status === "succeeded") {
      return status.output;
    }
    if (status.status === "failed") {
      throw new Error(`Prediction failed: ${status.error}`);
    }
  }
  throw new Error("Prediction timed out");
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
}

async function main() {
  // Get all blog posts
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  console.log(`Found ${files.length} blog posts`);

  let generated = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const imagePath = path.join(IMAGE_DIR, `${slug}.webp`);

    // Skip if image already exists
    if (fs.existsSync(imagePath)) {
      console.log(`[skip] ${slug} — image exists`);
      skipped++;
      continue;
    }

    const prompt = POST_PROMPTS[slug] ?? DEFAULT_PROMPT;
    console.log(`[gen] ${slug}`);
    console.log(`  Prompt: ${prompt.substring(0, 80)}...`);

    try {
      const imageUrl = await generateImage(prompt);
      await downloadImage(imageUrl, imagePath);
      console.log(`  Saved: ${imagePath}`);

      // Update frontmatter
      const mdxPath = path.join(BLOG_DIR, file);
      const raw = fs.readFileSync(mdxPath, "utf-8");
      const { data, content } = matter(raw);
      data.image = `/images/blog/${slug}.webp`;
      data.image_alt = prompt.split(",")[0]; // First clause as alt text
      const updated = matter.stringify(content, data);
      fs.writeFileSync(mdxPath, updated);
      console.log(`  Updated frontmatter`);

      generated++;
    } catch (err) {
      console.error(`  ERROR: ${err}`);
    }
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}`);
}

main().catch(console.error);
