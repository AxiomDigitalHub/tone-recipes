/**
 * Batch-apply <SaveThisTone /> CTA to tone-recipe blog posts that don't
 * have one yet. Per the 2026-04 content-authority audit, every tone-recipe
 * post should end with a SaveThisTone CTA linking to a specific recipe (or
 * /browse for broader posts).
 *
 * Mapping is hand-curated — see the POST_MAPPINGS array below. For posts
 * where a single recipe match exists, link it. For posts that are broader
 * ("taxonomy" posts, workflow posts, quick fixes), use freeform with /browse.
 * For worship posts, link the Worship Set Pack directly.
 *
 * Run:
 *
 *   npx tsx scripts/apply-save-this-tone.ts          # dry-run report only
 *   npx tsx scripts/apply-save-this-tone.ts --apply  # actually write
 *
 * The script appends the CTA at the end of the file. If you need a specific
 * placement within the post, edit it by hand instead.
 */

import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const APPLY = process.argv.includes("--apply");

/** Each entry maps a post slug → the CTA to append. */
type CTA =
  | { kind: "recipe"; slug: string }
  | {
      kind: "freeform";
      title?: string;
      description?: string;
      href: string;
      ctaLabel?: string;
    };

const POST_MAPPINGS: Record<string, CTA> = {
  // Direct artist → recipe mappings
  "acdc-rhythm-tone-recipe": {
    kind: "recipe",
    slug: "angus-young-back-in-black-rhythm",
  },
  "bb-king-classic-blues-lead-tone": {
    kind: "recipe",
    slug: "bb-king-thrill-is-gone",
  },
  "jack-white-lo-fi-garage-tone": {
    kind: "recipe",
    slug: "jack-white-seven-nation-army",
  },
  "john-mayer-clean-tone-settings": {
    kind: "recipe",
    slug: "mayer-gravity-super-clean-dynamic",
  },
  "marshall-shredmaster-vs-rat-creep-tone": {
    kind: "recipe",
    slug: "greenwood-creep-clean-to-crunch",
  },
  "metallica-rhythm-tone-settings": {
    kind: "recipe",
    slug: "hetfield-master-of-puppets-rhythm",
  },
  "prs-silver-sky-vs-fender-strat-mayer-tone": {
    kind: "recipe",
    slug: "mayer-gravity-super-clean-dynamic",
  },
  "radiohead-creep-tone-recipe": {
    kind: "recipe",
    slug: "greenwood-creep-clean-to-crunch",
  },
  "srv-tone-on-helix": {
    kind: "recipe",
    slug: "srv-pride-and-joy-rhythm",
  },
  "tom-morello-rage-tone-recipe": {
    kind: "recipe",
    slug: "morello-killing-in-the-name",
  },

  // Worship posts → Set Pack
  "modern-worship-guitar-tone-helix": {
    kind: "freeform",
    title: "Download the Worship Set Pack",
    description:
      "One Helix preset, 8 snapshots, 30 worship songs mapped to snapshots. Free with sign-up.",
    href: "/set-packs/worship",
    ctaLabel: "Open Worship Set Pack",
  },
  "worship-guitar-tone-helix": {
    kind: "freeform",
    title: "Download the Worship Set Pack",
    description:
      "One Helix preset with all the tones in this post covered across 8 snapshots. Plus a 30-song setlist mapper.",
    href: "/set-packs/worship",
    ctaLabel: "Open Worship Set Pack",
  },

  // Artists without a direct recipe — link to browse with context
  "andy-timmons-budget-tone": {
    kind: "freeform",
    title: "Starter presets for Mayer / Timmons–style clean lead",
    description:
      "We don't have a dedicated Andy Timmons recipe yet, but the Mayer Gravity and SRV Texas Flood recipes share the Strat-into-cranked-amp DNA. Load either as a starting point.",
    href: "/browse",
    ctaLabel: "Browse lead-tone presets",
  },
  "andy-timmons-lead-tone-recipe": {
    kind: "freeform",
    title: "Starter presets for singing lead tone",
    description:
      "Strat bridge pickup + cranked amp + light delay. Load Mayer's Slow Dancing recipe or SRV's Texas Flood as a starter.",
    href: "/browse",
    ctaLabel: "Browse lead-tone presets",
  },
  "cure-robert-smith-chorus-tone": {
    kind: "freeform",
    title: "Jangly + chorus-drenched clean tone starters",
    description:
      "No dedicated Robert Smith recipe yet. Marr's 'How Soon Is Now' or Gallagher's 'Wonderwall' share the modulation-heavy clean territory.",
    href: "/browse",
    ctaLabel: "Browse clean-tone presets",
  },
  "khruangbin-clean-funk-tone": {
    kind: "freeform",
    title: "Clean-funk tone starters",
    description:
      "Khruangbin's neck-pickup-into-Fender-clean-with-spring-reverb territory. Knopfler's Sultans of Swing or Mayer's Gravity are the closest starters.",
    href: "/browse",
    ctaLabel: "Browse clean presets",
  },
  "khruangbin-hx-stomp-tone": {
    kind: "freeform",
    title: "Starter clean-funk presets for HX Stomp",
    description:
      "Spring reverb + clean Fender + light compression. Load Knopfler's Sultans of Swing recipe as a starter and back off the high end.",
    href: "/browse?platform=helix",
    ctaLabel: "Browse Helix presets",
  },
  "misha-mansoor-periphery-djent-tone": {
    kind: "freeform",
    title: "Djent + extended-range starters",
    description:
      "We don't have a Periphery recipe yet, but the Hetfield Master of Puppets and Dimebag Walk recipes both cover tight scooped-mids rhythm territory. Load either and tune for your tuning.",
    href: "/browse?tag=high-gain",
    ctaLabel: "Browse high-gain presets",
  },
  "my-bloody-valentine-loveless-tone": {
    kind: "freeform",
    title: "Shoegaze / wall-of-sound starters",
    description:
      "The Loveless tone is layered production, not a single preset. Start with a fuzz-heavy recipe (Greenwood's Creep, Turner's Do I Wanna Know) and layer from there.",
    href: "/browse?tag=fuzz",
    ctaLabel: "Browse fuzz presets",
  },
  "nashville-session-clean-tele-compressor": {
    kind: "freeform",
    title: "Chicken-pickin and clean-Tele starters",
    description:
      "The Nashville clean-Tele sound isn't locked to a single recipe. Start with Knopfler's Sultans of Swing for the compressed-clean platform and adjust for country attack.",
    href: "/browse?tag=clean",
    ctaLabel: "Browse clean-tone presets",
  },
  "neo-shoegaze-tone": {
    kind: "freeform",
    title: "Modern shoegaze starters",
    description:
      "Big Muff + chorus + long reverb territory. Turner's Do I Wanna Know and Bellamy's Plug In Baby are the closest starting platforms.",
    href: "/browse?tag=fuzz",
    ctaLabel: "Browse fuzz presets",
  },
  "nothing-band-guitar-tone": {
    kind: "freeform",
    title: "Shoegaze + drop-tuned starters",
    description:
      "Nothing's tone sits between shoegaze and drop-tuned alt-rock. Load a drop-tuned fuzz recipe (Homme's No One Knows) and layer with chorus and reverb.",
    href: "/browse?tag=fuzz",
    ctaLabel: "Browse fuzz presets",
  },
  "nothing-the-great-dismal": {
    kind: "freeform",
    title: "Drop-tuned shoegaze starters",
    description:
      "The Great Dismal sits on heavy drop-tuned fuzz foundations. Load a heavy fuzz recipe as a platform and push the reverb decay.",
    href: "/browse?tag=fuzz",
    ctaLabel: "Browse fuzz presets",
  },
  "shoegaze-wall-of-sound-recipe": {
    kind: "freeform",
    title: "Wall-of-sound starters",
    description:
      "Shoegaze tone is built from fuzz + modulation + reverb stacked deep. Greenwood's Creep or Turner's Do I Wanna Know are the closest single-preset starting points.",
    href: "/browse?tag=fuzz",
    ctaLabel: "Browse fuzz presets",
  },

  // Quick-fix / workflow / theory posts → /browse
  "compressor-killing-your-tone": {
    kind: "freeform",
    title: "Dial a recipe with comp done right",
    description:
      "Every recipe in our library includes compressor settings with notes on attack, release, and placement. Browse to compare approaches.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
  "does-cable-length-affect-tone": {
    kind: "freeform",
    title: "Start a recipe, tweak for your cable",
    description:
      "Pick a recipe and adjust the treble and presence to compensate for cable-capacitance-driven darkening — or don't, depending on the tone you want.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
  "fender-deluxe-reverb-vs-tonemaster": {
    kind: "freeform",
    title: "Deluxe Reverb-based presets",
    description:
      "SRV's Pride and Joy and Mayer's Gravity both sit on Deluxe-adjacent amp platforms. Load either to hear the Deluxe character in context.",
    href: "/browse?tag=clean",
    ctaLabel: "Browse clean-amp presets",
  },
  "fix-thin-modeler-tone": {
    kind: "freeform",
    title: "Presets with full-spectrum modeler settings",
    description:
      "Every recipe in the library is dialed for a full-spectrum modeler tone — IR choice, gain staging, EQ all tuned. Browse to compare.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
  "guitar-tone-in-ear-monitors": {
    kind: "freeform",
    title: "Presets that translate well to in-ears",
    description:
      "Clean and mid-gain presets translate best to IEM monitoring. High-gain recipes need post-EQ compensation — every recipe has the settings you need.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
  "how-to-dial-in-modeler-tone": {
    kind: "freeform",
    title: "Start with a real recipe",
    description:
      "Rather than building from a blank patch, load a recipe close to your target tone and tweak from there. Faster to a finished preset.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
  "pick-thickness-tone-test": {
    kind: "freeform",
    title: "Dial in the rest of the chain",
    description:
      "Pick thickness is one variable among many. Start with a recipe that matches your target and tweak the rest.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
  "tonex-tone-models-guide": {
    kind: "freeform",
    title: "Browse recipes with TONEX translations",
    description:
      "Every recipe in our library has TONEX-compatible settings translations alongside Helix, Quad Cortex, and more.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
  "what-is-a-tone-recipe": {
    kind: "freeform",
    title: "Browse the tone recipe library",
    description:
      "Start with the iconic tones. Each recipe has signal chain, exact settings, and downloadable presets for Helix and Katana.",
    href: "/browse",
    ctaLabel: "Browse all recipes",
  },
  "why-modeler-tone-sounds-fizzy": {
    kind: "freeform",
    title: "Presets with fizz-free modeler settings",
    description:
      "Every recipe has gain-staging, IR choice, and high-cut settings tuned so fizz doesn't enter the signal chain in the first place.",
    href: "/browse",
    ctaLabel: "Browse presets",
  },
};

function buildCTA(cta: CTA): string {
  if (cta.kind === "recipe") {
    return `\n\n<SaveThisTone recipeSlug="${cta.slug}" />\n`;
  }
  const parts: string[] = [];
  if (cta.title) parts.push(`  title="${cta.title.replace(/"/g, "&quot;")}"`);
  if (cta.description)
    parts.push(`  description="${cta.description.replace(/"/g, "&quot;")}"`);
  parts.push(`  href="${cta.href}"`);
  if (cta.ctaLabel)
    parts.push(`  ctaLabel="${cta.ctaLabel.replace(/"/g, "&quot;")}"`);
  return `\n\n<SaveThisTone\n${parts.join("\n")}\n/>\n`;
}

function main() {
  let applied = 0;
  let skipped = 0;
  let missing = 0;

  for (const [slug, cta] of Object.entries(POST_MAPPINGS)) {
    const file = path.join(BLOG_DIR, slug + ".mdx");
    if (!fs.existsSync(file)) {
      console.log(`  ✗ ${slug} — file not found, skipped`);
      missing++;
      continue;
    }
    const raw = fs.readFileSync(file, "utf-8");
    if (raw.includes("<SaveThisTone")) {
      skipped++;
      continue;
    }
    const block = buildCTA(cta);
    if (APPLY) {
      fs.writeFileSync(file, raw.trimEnd() + block);
      console.log(`  ✓ ${slug} — CTA appended`);
    } else {
      console.log(`  → ${slug} — would append ${cta.kind} CTA`);
    }
    applied++;
  }

  console.log();
  console.log(
    APPLY
      ? `Applied: ${applied}. Skipped (already has CTA): ${skipped}. Missing files: ${missing}.`
      : `Dry run. Would apply: ${applied}. Already has CTA: ${skipped}. Missing: ${missing}. Re-run with --apply to write.`,
  );
}

main();
