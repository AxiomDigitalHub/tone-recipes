/** Guitar tone definitions used in blog post glossary sections */
export interface Definition {
  term: string;
  definition: string;
}

const DEFINITIONS: Record<string, Definition> = {
  "signal-chain": {
    term: "Signal Chain",
    definition:
      "The path your guitar signal travels from pickup to speaker. Every pedal, amp, and effect in the chain processes the signal in sequence.",
  },
  "overdrive": {
    term: "Overdrive",
    definition:
      "A mild form of distortion that simulates a tube amp being pushed past its clean headroom. Adds warmth, sustain, and harmonic richness.",
  },
  "distortion": {
    term: "Distortion",
    definition:
      "A more aggressive form of clipping than overdrive. Hard-clips the signal for a heavier, more saturated tone with more sustain and compression.",
  },
  "fuzz": {
    term: "Fuzz",
    definition:
      "The most extreme form of clipping. Square-wave distortion that creates a thick, buzzy, synth-like tone. Classic examples: Fuzz Face, Big Muff.",
  },
  "effects-loop": {
    term: "Effects Loop",
    definition:
      "An insert point between an amp's preamp and power amp stages. Allows time-based and modulation effects to process the signal after distortion for cleaner results.",
  },
  "modeler": {
    term: "Modeler",
    definition:
      "A digital device that simulates the sound of real amps, pedals, and cabinets using DSP. Examples: Line 6 Helix, Neural DSP Quad Cortex, Fractal Axe-FX.",
  },
  "cab-sim": {
    term: "Cabinet Simulation (Cab Sim)",
    definition:
      "Digital emulation of a guitar speaker cabinet and microphone. Shapes the raw amp signal into what you'd hear from a mic'd cab in a studio.",
  },
  "impulse-response": {
    term: "Impulse Response (IR)",
    definition:
      "A digital snapshot of a speaker cabinet's acoustic characteristics. Loaded into a modeler to accurately reproduce the cabinet's frequency response.",
  },
  "gain-staging": {
    term: "Gain Staging",
    definition:
      "The practice of managing signal levels between each stage of the chain to avoid unwanted noise or clipping while maintaining optimal tone.",
  },
  "headroom": {
    term: "Headroom",
    definition:
      "The amount of clean volume an amp or pedal can produce before it starts to distort. More headroom means a louder clean tone before breakup.",
  },
  "breakup": {
    term: "Breakup",
    definition:
      "The point where an amp transitions from clean to distorted as it's pushed harder. 'Edge of breakup' means just barely starting to crunch.",
  },
  "tone-stack": {
    term: "Tone Stack",
    definition:
      "The EQ circuit in an amplifier (bass, mid, treble controls). Different amp designs place the tone stack at different points in the circuit, affecting how EQ interacts with gain.",
  },
  "preamp": {
    term: "Preamp",
    definition:
      "The first amplification stage in a guitar amp. Shapes the tone and adds gain/distortion before the signal reaches the power amp.",
  },
  "power-amp": {
    term: "Power Amp",
    definition:
      "The final amplification stage that drives the speaker. Adds its own coloration, compression, and saturation at high volumes (power amp distortion).",
  },
  "compression": {
    term: "Compression",
    definition:
      "Reduces the dynamic range of a signal — making loud parts quieter and quiet parts louder. Adds sustain, consistency, and 'squish' to the tone.",
  },
  "wah": {
    term: "Wah Pedal",
    definition:
      "A foot-controlled bandpass filter that sweeps through frequencies, creating the vocal 'wah' sound. Placed early in the chain for the most expressive response.",
  },
  "chorus": {
    term: "Chorus",
    definition:
      "A modulation effect that duplicates the signal with a slight pitch shift and time delay, creating a thicker, shimmering sound. Used by Andy Summers, Kurt Cobain, and John Frusciante.",
  },
  "delay": {
    term: "Delay",
    definition:
      "Repeats the input signal after a set time interval. Types include digital (clean repeats), tape (warm, degrading repeats), and analog (dark, lo-fi repeats).",
  },
  "reverb": {
    term: "Reverb",
    definition:
      "Simulates the natural reflections of sound in a physical space. Types: spring (surfy), plate (smooth), hall (spacious), room (subtle and natural).",
  },
  "capture": {
    term: "Capture / Profile",
    definition:
      "A digital snapshot of real analog gear (amp, pedal, or full rig) created by running test signals through it. Used by Quad Cortex (Captures) and Kemper (Profiles).",
  },
  "platform-translation": {
    term: "Platform Translation",
    definition:
      "The process of mapping a tone recipe's gear and settings to the equivalent blocks available on a specific modeler. E.g., a Fender Deluxe becomes 'US Deluxe Nrm' on Helix.",
  },
};

/**
 * Get definitions relevant to a blog post based on its tags and category.
 * Returns a curated set of 4-8 definitions most relevant to the content.
 */
export function getDefinitionsForPost(
  tags: string[],
  category: string
): Definition[] {
  const relevanceMap: Record<string, string[]> = {
    "signal-chain": [
      "signal-chain", "effects-loop", "gain-staging", "preamp",
      "power-amp", "headroom", "tone-stack",
    ],
    "platform-guide": [
      "modeler", "cab-sim", "impulse-response", "capture",
      "platform-translation", "effects-loop",
    ],
    "artist-tone": [
      "signal-chain", "overdrive", "fuzz", "breakup",
      "gain-staging", "platform-translation",
    ],
    gear: [
      "overdrive", "distortion", "fuzz", "compression",
      "modeler", "cab-sim", "headroom",
    ],
    effects: [
      "overdrive", "distortion", "fuzz", "chorus",
      "delay", "reverb", "wah", "compression",
    ],
    workflow: [
      "signal-chain", "gain-staging", "modeler",
      "platform-translation", "tone-stack", "breakup",
    ],
  };

  // Tag-to-definition mappings
  const tagMap: Record<string, string[]> = {
    "signal-chain": ["signal-chain", "effects-loop", "gain-staging"],
    "effects-order": ["signal-chain", "effects-loop"],
    "overdrive": ["overdrive", "gain-staging", "headroom"],
    "distortion": ["distortion", "fuzz", "overdrive"],
    "delay": ["delay", "effects-loop"],
    "reverb": ["reverb", "effects-loop"],
    "modeler": ["modeler", "cab-sim", "impulse-response"],
    "helix": ["modeler", "platform-translation", "cab-sim"],
    "quad-cortex": ["modeler", "capture", "platform-translation"],
    "compression": ["compression", "gain-staging"],
    "beginner": ["signal-chain", "overdrive", "distortion", "delay", "reverb"],
    "getting-started": ["signal-chain", "modeler", "platform-translation"],
  };

  const keys = new Set<string>();

  // Add from category
  const catKeys = relevanceMap[category];
  if (catKeys) catKeys.forEach((k) => keys.add(k));

  // Add from tags
  for (const tag of tags) {
    const tagKeys = tagMap[tag];
    if (tagKeys) tagKeys.forEach((k) => keys.add(k));
  }

  // Deduplicate and limit to 8
  const result: Definition[] = [];
  for (const key of keys) {
    if (DEFINITIONS[key] && result.length < 8) {
      result.push(DEFINITIONS[key]);
    }
  }

  return result;
}
