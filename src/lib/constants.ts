export const PLATFORMS = [
  { id: "physical", label: "Physical", color: "#a1a1aa" },
  { id: "helix", label: "Helix", color: "#cc0000" },
  { id: "quad_cortex", label: "Quad Cortex", color: "#00b4d8" },
  { id: "tonex", label: "TONEX", color: "#ff6b00" },
  { id: "fractal", label: "Fractal", color: "#10b981" },
  { id: "kemper", label: "Kemper", color: "#8b5cf6" },
  { id: "katana", label: "Boss Katana", color: "#e11d48" },
] as const;

export const GENRES = [
  "blues",
  "blues-rock",
  "texas-blues",
  "classic-rock",
  "hard-rock",
  "metal",
  "progressive-rock",
  "alternative",
  "grunge",
  "punk",
  "funk-rock",
  "country",
  "psychedelic",
  "shoegaze",
  "post-rock",
] as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

export const CHAIN_CATEGORIES = [
  "guitar",
  "effect",
  "preamp",
  "wet_effect",
  "power_amp",
  "cabinet",
  "microphone",
] as const;
