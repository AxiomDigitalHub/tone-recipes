import { PLATFORMS } from "@/lib/constants";
import { toneRecipes, gearItems } from "@/lib/data";
import { getAllPosts, type BlogPost } from "@/lib/blog";
import type { ToneRecipe, GearItem, Platform } from "@/types/recipe";

// ---------------------------------------------------------------------------
// Platform metadata (manufacturers, taglines)
// ---------------------------------------------------------------------------

export interface PlatformMeta {
  id: string;
  label: string;
  color: string;
  manufacturer: string;
  tagline: string;
}

const PLATFORM_META: Record<string, { manufacturer: string; tagline: string }> = {
  helix: {
    manufacturer: "Line 6",
    tagline: "The amp-modeler that rewrote the rulebook on live guitar tone.",
  },
  quad_cortex: {
    manufacturer: "Neural DSP",
    tagline: "Neural captures meet powerful modeling in a pedalboard-sized powerhouse.",
  },
  tonex: {
    manufacturer: "IK Multimedia",
    tagline: "AI-powered Tone Models that capture the soul of real amps and pedals.",
  },
  kemper: {
    manufacturer: "Kemper",
    tagline: "The original profiling amp. One box, every amp you have ever played.",
  },
  fractal: {
    manufacturer: "Fractal Audio",
    tagline: "Studio-grade amp modeling with surgical precision and endless routing.",
  },
  katana: {
    manufacturer: "Boss",
    tagline: "Affordable, gig-ready modeling with a hidden depth that rewards digging in.",
  },
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Get the full platform info (constants + meta) by slug/id. */
export function getPlatformInfo(slug: string): PlatformMeta | undefined {
  const base = PLATFORMS.find((p) => p.id === slug);
  if (!base || base.id === "pedalboard") return undefined;
  const meta = PLATFORM_META[slug];
  if (!meta) return undefined;
  return { ...base, ...meta };
}

/** Return all modeler platforms (excludes "pedalboard"). */
export function getAllPlatforms(): PlatformMeta[] {
  return PLATFORMS.filter((p) => p.id !== "pedalboard")
    .map((p) => {
      const meta = PLATFORM_META[p.id];
      if (!meta) return null;
      return { ...p, ...meta };
    })
    .filter(Boolean) as PlatformMeta[];
}

/** Get every recipe that has a translation for a given platform. */
export function getRecipesForPlatform(platformId: string): ToneRecipe[] {
  return toneRecipes.filter(
    (r) => r.platform_translations[platformId as Platform]
  );
}

/** Get gear items that have a modeler equivalent for a given platform. */
export function getGearWithEquivalent(
  platformId: string
): Array<{ gear: GearItem; equivalentName: string }> {
  return gearItems
    .filter((g) => g.modeler_equivalents?.[platformId])
    .map((g) => ({
      gear: g,
      equivalentName: g.modeler_equivalents![platformId],
    }));
}

// ---------------------------------------------------------------------------
// Artist helpers
// ---------------------------------------------------------------------------

/** Get blog posts related to an artist (title or tags mention them). */
export function getBlogPostsForArtist(artistSlug: string): BlogPost[] {
  // Build search terms from slug: "david-gilmour" → ["david gilmour", "gilmour", "david-gilmour"]
  const terms = [
    artistSlug.replace(/-/g, " "),
    artistSlug,
  ];
  // Also add last name as a search term
  const parts = artistSlug.split("-");
  if (parts.length > 1) {
    terms.push(parts[parts.length - 1]); // last name
  }

  const posts = getAllPosts();
  return posts.filter((post) => {
    const haystack = `${post.title} ${post.tags.join(" ")} ${post.description ?? ""}`.toLowerCase();
    return terms.some((t) => haystack.includes(t.toLowerCase()));
  });
}


/** Get blog posts related to a platform (title or tags mention it). */
export function getBlogPostsForPlatform(platformId: string): BlogPost[] {

  const terms = [platformId.replace("_", " ")];

  // Add common aliases
  const aliases: Record<string, string[]> = {
    helix: ["helix", "line 6"],
    quad_cortex: ["quad cortex", "neural dsp", "qc"],
    tonex: ["tonex", "ik multimedia"],
    kemper: ["kemper"],
    fractal: ["fractal", "axe-fx", "axe fx"],
    katana: ["katana", "boss katana"],
  };
  if (aliases[platformId]) terms.push(...aliases[platformId]);

  const posts = getAllPosts();
  return posts.filter((post) => {
    const haystack = `${post.title} ${post.tags.join(" ")}`.toLowerCase();
    return terms.some((t) => haystack.includes(t.toLowerCase()));
  });
}

// ---------------------------------------------------------------------------
// Platform-specific tips
// ---------------------------------------------------------------------------

interface PlatformTip {
  title: string;
  tip: string;
}

const PLATFORM_TIPS: Record<string, PlatformTip[]> = {
  helix: [
    {
      title: "Snapshots for instant tone switching",
      tip: "Assign different amp, effect, and mix settings to each snapshot so you can jump between rhythm, lead, and clean tones without audible gaps or preset-loading delays.",
    },
    {
      title: "Scream 808 drive sweet spot",
      tip: "The Scream 808 model reacts best with Drive between 3 and 4. Keep the Level high and Tone around noon for a classic tube-screamer push that tightens up any amp model.",
    },
    {
      title: "Use the impedance circuit",
      tip: "Helix models the input impedance of the first block in your chain. A wah or fuzz first will feel different than a buffer. Experiment with the global impedance setting to nail the feel of vintage stompboxes.",
    },
    {
      title: "Parallel paths for wet/dry",
      tip: "Split your signal into Path A (dry amp) and Path B (modulation and delay) to keep your core tone punchy while adding lush ambient effects on a separate path.",
    },
  ],
  quad_cortex: [
    {
      title: "Neural captures preserve feel",
      tip: "Neural captures don't just model the frequency response — they capture the dynamic feel and touch sensitivity of the original amp. Use captures for amps and combine them with QC's built-in effects.",
    },
    {
      title: "Parallel paths for wet/dry blending",
      tip: "Use the four parallel rows to set up wet/dry/wet rigs. Route your dry amp tone through one row and time-based effects through another for studio-quality separation.",
    },
    {
      title: "Cloud sharing for tone discovery",
      tip: "The Cortex Cloud has thousands of user-shared captures and presets. Search for the specific amp or artist tone you want and use it as a starting point for your own recipe.",
    },
    {
      title: "Expression pedal for dynamic control",
      tip: "Assign multiple parameters to a single expression pedal. Sweep from clean to high-gain by mapping drive, volume, and EQ simultaneously for smooth real-time transitions.",
    },
  ],
  tonex: [
    {
      title: "Tone Models capture the full response",
      tip: "TONEX Tone Models capture the amp, cab, and room interaction as a complete unit. When you load a Tone Model, you're getting the entire recorded signal path — not just an amp simulation.",
    },
    {
      title: "Shape models with the built-in EQ",
      tip: "Use TONEX's built-in 3-band EQ after the Tone Model to adapt captures to your guitar and monitoring setup. A small mid boost can make a bedroom capture cut through a live mix.",
    },
    {
      title: "Create your own captures",
      tip: "Use TONEX Capture to profile your own amp at different gain stages. Create a clean, crunch, and high-gain capture of the same amp for a complete channel-switching rig.",
    },
    {
      title: "Stack Tone Models with stompboxes",
      tip: "TONEX pedal has a built-in stomp section. Use a virtual overdrive in front of a clean Tone Model capture to push it into breakup, just like you would with real gear.",
    },
  ],
  kemper: [
    {
      title: "Lock your EQ across profiles",
      tip: "Use the Lock function on the EQ section to keep your preferred tonal shaping consistent as you switch between different amp profiles. This ensures every profile sits in the mix the same way.",
    },
    {
      title: "Pure Cabinet mode",
      tip: "Pure Cabinet mode smooths out the harsh artifacts that can come from re-amping through captured cabinet IRs. Turn it on for a more natural, amp-in-the-room feel.",
    },
    {
      title: "Morph for seamless transitions",
      tip: "Kemper's Morph feature lets you crossfade between two complete sets of parameters with a single footswitch or expression pedal. Set up rhythm and lead variations within one rig.",
    },
    {
      title: "Rig Exchange for community profiles",
      tip: "The Rig Exchange has tens of thousands of free profiles shared by other Kemper users. Sort by amp type to find the exact model you're looking for, then tweak to taste.",
    },
  ],
  fractal: [
    {
      title: "Amp Matching for reference tones",
      tip: "Use the Amp Match feature to analyze a reference recording and automatically adjust an amp model's EQ and gain structure to match. Great for dialing in specific album tones.",
    },
    {
      title: "Scene controllers for 8 tones per preset",
      tip: "Each preset supports 8 scenes, each with different block bypass states, channel selections, and parameter values. Build an entire setlist of tones in a single preset.",
    },
    {
      title: "Speaker impedance curves matter",
      tip: "Fractal models the speaker impedance interaction with the power amp. Experiment with different virtual speaker types — the impedance curve affects feel as much as the cab IR.",
    },
    {
      title: "Use the Precision Drive model",
      tip: "The Precision Drive is Fractal's take on a tight overdrive that works incredibly well in front of high-gain amp models. Set the Tight control to 7-8 for modern metal rhythm tones.",
    },
  ],
  katana: [
    {
      title: "Power Control for cranked tones at any volume",
      tip: "The Power Control knob lets you drive the power amp section into saturation at lower volumes. Set it to 0.5W for bedroom recording tones that still have real power-tube compression.",
    },
    {
      title: "Tone Studio unlocks hidden models",
      tip: "Boss Tone Studio software gives you access to additional amp types, effects, and deep editing parameters that aren't available from the front panel alone. It's a free download that doubles your amp's capabilities.",
    },
    {
      title: "Chain your effects strategically",
      tip: "The Katana's three effects slots (Booster, Mod, Delay/Reverb) each have dozens of options in Tone Studio. Place your booster before the amp for gain stacking, or after for a clean volume lift.",
    },
    {
      title: "Use the line out for direct recording",
      tip: "The Katana's line/headphone out includes cabinet simulation. Use it for direct recording into your DAW — the cab sim is surprisingly good and saves you from needing a separate IR loader.",
    },
  ],
};

export function getPlatformTips(platformId: string): PlatformTip[] {
  return PLATFORM_TIPS[platformId] ?? [];
}
