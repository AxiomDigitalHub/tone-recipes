/**
 * The five pillars: the SEO spine of Learn.
 *
 * Every guide links up to exactly one pillar page (its breadcrumb), and
 * every pillar page links down to all of its guides. Pillars live at
 * /guides/<slug>. Five of the eight original pillar URLs are kept; the
 * other three 301 in next.config.ts:
 *   /guides/pedal-settings-guides       → /guides/amp-settings-and-tone
 *   /guides/bedroom-and-home-recording  → /guides/tone-troubleshooting
 *   /guides/artist-tone-recipes         → /browse (artist tones live under Tones)
 *
 * The target reader is a worship guitarist on Helix or HX Stomp
 * (docs/TARGET_SEGMENT_AND_SEO_STRATEGY.md), so that pillar comes first.
 *
 * Membership: a guide named in a pillar's `sections` belongs to that
 * pillar. Every other guide is assigned by `pillarFor` from its category,
 * title and tags. Artist tone posts get no pillar.
 */
import { classify, type TopicArt } from "@/lib/gear/thumbs";

export interface PillarSection {
  title: string;
  /** Blog post slugs, in reading order. A slug that no longer exists is skipped. */
  slugs: string[];
}

export interface Pillar {
  slug: string;
  /** Page H1 and tile title. */
  title: string;
  /** One line for the Learn tile. */
  blurb: string;
  /** <title> for the SERP. */
  seoTitle: string;
  /** Meta description. */
  description: string;
  /** Lead paragraph under the H1. */
  lede: string;
  /** Body paragraphs under the lead. */
  intro: string[];
  sections: PillarSection[];
  art: TopicArt;
  /** One optional call to action, shown after the curated sections. */
  cta?: { title: string; body: string; href: string; label: string };
}

export const PILLARS: Pillar[] = [
  {
    slug: "worship-guitar",
    title: "Worship guitar on Helix",
    blurb: "Sunday sets on Helix and HX Stomp: snapshots, ambient tones, in-ears.",
    seoTitle: "Worship guitar on Helix and HX Stomp",
    description:
      "Worship guitar tone on Line 6 Helix and HX Stomp: the core amp, drive, delay and reverb chain, artist tones, snapshots for a full set, and in-ear mixes.",
    lede: "How to build a Sunday set on a Helix or HX Stomp, from the core tone to the in-ear mix.",
    intro: [
      "Most modern worship guitar comes from a short list of parts: a Vox-style amp model, a transparent boost, a dotted-eighth delay locked to tempo, a plate reverb, and a shimmer for pads. The guides here show where each part sits in a Helix preset and how to set it.",
      "Start with the core tone, then pick the artist guide closest to your team's setlist. The live rig guides cover choosing between HX Stomp and Helix LT, and getting the guitar to sit in an in-ear mix.",
    ],
    sections: [
      { title: "The core tone", slugs: ["worship-guitar-tone-helix"] },
      {
        title: "Artist tones",
        slugs: [
          "hillsong-guitar-tone-helix",
          "elevation-worship-guitar-tone-helix",
          "bethel-music-guitar-tone-helix",
          "phil-wickham-guitar-tone-helix",
          "lincoln-brewster-tone-helix",
        ],
      },
      {
        title: "Live rig and in-ears",
        slugs: ["hx-stomp-vs-helix-lt-worship", "worship-pedalboard-guide", "iem-mix-guitar-compression"],
      },
    ],
    art: { pattern: "ripple", color: "teal", frame: "close", gearHeight: 150, gear: [{ kind: "delay", disp: "375", vals: [6, 4, 3] }] },
    cta: {
      title: "The Worship Set Pack",
      body: "One Helix preset with 8 snapshots, and 30 worship songs mapped to them.",
      href: "/set-packs/worship",
      label: "See the Set Pack",
    },
  },
  {
    slug: "modeler-mastery",
    title: "Helix and modeler setup",
    blurb: "Presets, snapshots, IRs and DSP on Helix, HX Stomp and Katana.",
    seoTitle: "Helix and modeler setup: presets, IRs and DSP",
    description:
      "How to set up a Helix, HX Stomp or Boss Katana: building presets, level matching, cab and IR choices, FRFR speakers and getting the same tone live.",
    lede: "Build presets that sound right at home and still work on stage.",
    intro: [
      "A modeler gives you every amp and effect at once, which is why most presets fall apart: too many blocks, levels that jump between snapshots, and a cab choice made on headphones. These guides go through preset building in order, then the cab, IR and speaker decisions that change the result most.",
      "Most of the detail is for Line 6 Helix and HX Stomp, with Boss Katana second. The buying comparisons cover Quad Cortex, Kemper and TONEX as well.",
    ],
    sections: [
      {
        title: "Building presets",
        slugs: [
          "how-to-dial-in-modeler-tone",
          "why-your-modeler-preset-wont-fit-what-to-cut-first",
          "level-match-modeler-presets",
          "modeler-preset-sounds-different-live",
          "modeler-eq-guide",
        ],
      },
      {
        title: "Cabs, IRs and speakers",
        slugs: [
          "impulse-response-ir-guide",
          "helix-ir-shootout",
          "helix-cab-ir-pairings",
          "two-cabs-instead-of-two-amps-dual-cab-block",
          "best-frfr-speakers-for-modelers",
          "frfr-vs-guitar-cab-for-modelers",
        ],
      },
      {
        title: "Helix and Katana picks",
        slugs: [
          "best-helix-amp-models-blues",
          "10-helix-amp-models-underrated",
          "best-katana-settings-tube-amp",
          "boss-katana-hidden-settings",
        ],
      },
      {
        title: "Choosing a modeler",
        slugs: [
          "line-6-helix-family-compared",
          "helix-vs-quad-cortex",
          "helix-vs-quad-cortex-vs-kemper",
          "kemper-profiles-vs-helix-models",
          "best-modeler-under-500",
          "modeler-vs-tube-amp-shootout",
        ],
      },
    ],
    art: { pattern: "path", color: "blue", layout: "stagger", gearHeight: 96, gear: [{ kind: "vol" }, { kind: "comp" }, { kind: "drive" }, { kind: "amp" }, { kind: "delay" }, { kind: "reverb" }] },
  },
  {
    slug: "amp-settings-and-tone",
    title: "Amps, drive and pedals",
    blurb: "Settings for the classic amps, overdrives, fuzzes and compressors.",
    seoTitle: "Amp and pedal settings: classic amps, drives and fuzz",
    description:
      "Settings guides for the classic amps and pedals: Deluxe Reverb, AC30, JCM800, 5150, Klon, Tube Screamer, Big Muff, RAT and compressors, with the reason for each knob.",
    lede: "Where to set each knob on the classic amps and pedals, and why.",
    intro: [
      "Every modeler block copies a real circuit, so the real amp's behaviour is the fastest way to understand the model. The amp guides explain what each control does on that circuit: why the AC30 Cut knob works backwards, or why a JCM800 sounds different with the gain low and the master high.",
      "The pedal guides do the same for overdrive, distortion, fuzz and compression, with starting settings for each one.",
    ],
    sections: [
      {
        title: "Clean and crunch amps",
        slugs: [
          "fender-deluxe-reverb-settings",
          "fender-deluxe-reverb-vs-tonemaster",
          "vox-ac30-settings-guide",
          "vox-ac30-cut-knob-explained",
          "roland-jc-120-settings-guide",
        ],
      },
      {
        title: "Marshall and high gain",
        slugs: ["jcm800-settings-guide", "peavey-5150-settings-guide", "power-tube-saturation-explained", "amp-gain-volume-master-controls"],
      },
      {
        title: "Overdrive and boost",
        slugs: [
          "klon-centaur-settings-guide",
          "tube-screamer-settings-guide",
          "blues-driver-bd2-settings-guide",
          "bd2-vs-bd2w-waza-craft",
          "tumnus-deluxe-vs-klon-ktr",
        ],
      },
      {
        title: "Distortion and fuzz",
        slugs: ["boss-ds1-settings-guide", "rat-pedal-settings-guide", "big-muff-settings-guide", "big-muff-vs-fuzz-face", "germanium-vs-silicon-fuzz"],
      },
      {
        title: "Compression",
        slugs: ["compressor-pedal-settings-guide", "chicken-pickin-compressor-settings"],
      },
      {
        title: "Amp types and attenuators",
        slugs: ["complete-guide-guitar-amp-types", "reactive-vs-resistive-attenuators", "tube-amp-attenuator-limits-lower-wattage"],
      },
    ],
    art: { pattern: "tolex", gearHeight: 190, gear: [{ kind: "head", color: "#D9CDB4", cloth: "#6B5B45", vals: [6, 4, 7, 6, 5, 4] }] },
  },
  {
    slug: "signal-chain-fundamentals",
    title: "Signal chain and effects",
    blurb: "Block order, buffers, routing, delay and reverb.",
    seoTitle: "Signal chain order, buffers, delay and reverb",
    description:
      "Guitar signal chain guides: pedal and block order, gain staging, impedance and buffers, the 4-cable method, and how to set delay, reverb and modulation.",
    lede: "What goes where in the chain, and how to set the effects that come after the amp.",
    intro: [
      "Order changes the sound because each block reacts to what it is fed. A fuzz in front of a buffer behaves differently from a fuzz after one, and a delay before distortion smears where a delay after it stays clear. These guides explain the rules, and when breaking them is worth it.",
      "The second half covers time-based effects: delay note values and tap tempo, reverb stacking, and where modulation belongs.",
    ],
    sections: [
      {
        title: "Order and gain staging",
        slugs: ["signal-chain-order-guide", "beginner-signal-chains", "gain-staging-drop-tunings", "tube-screamer-before-high-gain-amp"],
      },
      {
        title: "Impedance and buffers",
        slugs: ["impedance-buffers-fuzz", "buffer-myth-buffered-bypass", "buffer-vs-true-bypass-looper", "does-cable-length-affect-tone"],
      },
      {
        title: "Routing",
        slugs: [
          "4-wire-method-explained",
          "looper-delay-reverb-signal-chain",
          "volume-pedal-dynamics-control",
          "eq-pedal-placement",
          "summing-two-signals-into-one-amp-input",
        ],
      },
      {
        title: "Delay and reverb",
        slugs: [
          "delay-pedal-settings-guide",
          "the-edge-delay-settings",
          "delay-max-time-per-model-slow-tempo",
          "delay-drifts-from-tap-light-long-repeats",
          "stacking-reverbs-guide",
        ],
      },
    ],
    art: { pattern: "wave", color: "amber", layout: "scatter", gearHeight: 158, gear: [{ kind: "mod", vals: [4, 6] }, { kind: "delay2", vals: [7, 4, 6] }, { kind: "reverb", vals: [6, 5] }] },
  },
  {
    slug: "tone-troubleshooting",
    title: "Fix your tone",
    blurb: "Hum, hiss, fizz, mud, volume drops and quiet practice rigs.",
    seoTitle: "Fix your guitar tone: hum, fizz, mud and volume drops",
    description:
      "Troubleshooting guides for guitar tone: 60-cycle hum, pedal hiss, fizzy high gain, thin modeler tone, muddy delay, solo volume drops, and quiet rigs for home.",
    lede: "Find the symptom, then the cause, then the fix.",
    intro: [
      "Most tone problems have a short list of causes. Hum is usually the pickups or a ground loop. Fizz is usually the cab block or the high cut. A solo that disappears live is usually a level problem that headphones hid. Each guide starts from what you hear and works back.",
      "The last section is for playing at home: bedroom volume, headphones and FRFR speakers, where the same preset can sound thin for reasons that are not the preset's fault.",
    ],
    sections: [
      { title: "Noise and hum", slugs: ["how-to-remove-60-cycle-hum", "how-to-stop-pedal-hiss", "cavity-shielding-test"] },
      {
        title: "Fizzy, thin or muddy",
        slugs: ["why-modeler-tone-sounds-fizzy", "fix-fizzy-high-gain", "fix-thin-modeler-tone", "why-delay-sounds-muddy"],
      },
      { title: "Levels", slugs: ["solo-patch-volume-drop-fix"] },
      { title: "Quiet and home rigs", slugs: ["peavey-5150-bedroom-volume", "20-minute-practice-session"] },
    ],
    art: { pattern: "cloth", frame: "corner", layout: "row", gearHeight: 150, gear: [{ kind: "cab" }, { kind: "mic" }] },
  },
];

const BY_SLUG = new Map(PILLARS.map((p) => [p.slug, p]));
export const getPillar = (slug: string): Pillar | undefined => BY_SLUG.get(slug);

/** Guide slug → pillar slug, for guides named in a pillar's sections. First mention wins. */
const CURATED = new Map<string, string>();
for (const p of PILLARS) for (const s of p.sections) for (const slug of s.slugs) if (!CURATED.has(slug)) CURATED.set(slug, p.slug);

interface PostLike {
  slug: string;
  title: string;
  category: string;
  tags?: string[];
}

const WORSHIP = /worship|church|sunday|\biem\b|in[- ]ear|hillsong|bethel|elevation|setlist/;
const FIX =
  /\bwhy (does|is|do|your|my)\b|\bfix|troubleshoot|muddy|fizz|harsh|thin\b|\bhum\b|hiss|buzz|noise|crackl|cuts? out|volume drop|too loud|too quiet|bedroom|headphone|home record|quiet/;
const MODELER =
  /helix|hx stomp|hx effects|pod go|quad cortex|\bqc\b|tonex|fractal|axe[- ]fx|\bfm[39]\b|kemper|katana|modell?er|snapshot|preset|\bdsp\b|\bfrfr\b|capture|profil|impulse response|\birs?\b|firmware|global eq/;

/**
 * The pillar a guide belongs to, or null for artist tone posts (those
 * link to Tones instead).
 */
export function pillarFor(post: PostLike): Pillar | null {
  const curated = CURATED.get(post.slug);
  if (curated) return BY_SLUG.get(curated)!;

  const title = post.title.toLowerCase();
  const tags = (post.tags ?? []).join(" ").toLowerCase().replace(/-/g, " ");
  const slug = post.slug.replace(/-/g, " ");

  if (WORSHIP.test(title) || WORSHIP.test(slug) || /worship/.test(tags)) return BY_SLUG.get("worship-guitar")!;
  if (post.category === "artist-tone" || post.category === "tone-recipes") return null;
  if (post.category === "quick-fixes" || FIX.test(title)) return BY_SLUG.get("tone-troubleshooting")!;
  if (post.category === "modeler-masterclass" || post.category === "platform-guide" || MODELER.test(title)) {
    return BY_SLUG.get("modeler-mastery")!;
  }

  const { topic } = classify(post);
  if (topic === "drive" || topic === "amps") return BY_SLUG.get("amp-settings-and-tone")!;
  if (topic === "time" || topic === "chain") return BY_SLUG.get("signal-chain-fundamentals")!;
  if (topic === "cabs") return BY_SLUG.get(MODELER.test(tags) ? "modeler-mastery" : "amp-settings-and-tone")!;

  if (post.category === "signal-chain" || post.category === "effects" || post.category === "workflow") {
    return BY_SLUG.get("signal-chain-fundamentals")!;
  }
  if (MODELER.test(tags)) return BY_SLUG.get("modeler-mastery")!;
  return BY_SLUG.get("amp-settings-and-tone")!;
}
