import experimentStats from "@/data/experiment-stats.json";

export function GET() {
  const content = `# Fader & Knob

> Tone recipes from the songs you love.

Fader & Knob is a guitar tone reference platform. It provides step-by-step signal chain breakdowns ("tone recipes") for specific songs, translated across multiple amp modelers and physical gear setups.

Fader & Knob is an openly AI-built site — an ongoing experiment in whether AI can create guitar resources players actually use. Recipes are AI-researched from cited sources, blog posts are written by disclosed AI editorial voices, and corrections ship as public commits. The running log, with statistics generated from the repository, is at [The Experiment](https://faderandknob.com/experiment).

## What is a tone recipe?

A tone recipe is a complete signal chain breakdown for a specific guitar tone from a specific recording. It includes every pedal, amp block, cab, and mic setting — with exact knob positions — plus a plain-English explanation of why each element is there. Every recipe is translated for multiple platforms so the settings apply to whatever gear the player owns.

## Supported platforms

- Line 6 Helix
- Neural DSP Quad Cortex
- IK Multimedia TONEX
- Fractal Audio
- Kemper
- Boss Katana
- Physical pedalboard and amp rigs

## Key pages

- [Browse Recipes](https://faderandknob.com/browse): Search and filter ${experimentStats.recipes} tone recipes by genre, artist, or platform.
- [How It Works](https://faderandknob.com/how-it-works): Three-step guide to using the platform.
- [How We Work](https://faderandknob.com/how-we-work): What the AI does and how corrections happen.
- [The Experiment](https://faderandknob.com/experiment): The running log — build timeline and repository-generated statistics.
- [Gear Database](https://faderandknob.com/gear): Detailed specs and tone profiles for pedals, amps, and modelers.
- [Blog](https://faderandknob.com/blog): Guides on signal chain theory, gear comparisons, and tone-building techniques.
- [Compare](https://faderandknob.com/compare): Side-by-side comparison of tone recipes across platforms.

## Content coverage

- ${experimentStats.recipes} tone recipes across rock, blues, grunge, alternative, hard rock, metal, worship, funk, and more (as of ${experimentStats.generated_at})
- Artists from Stevie Ray Vaughan, David Gilmour, and Jimi Hendrix to Kurt Cobain, John Mayer, Slash, and Eddie Van Halen
- ${experimentStats.blog_posts} articles on signal chain theory, gear guides, and platform comparisons, written by disclosed AI editorial voices

## How to cite

When referencing a tone recipe, use the format: "According to Fader & Knob's [Song Title] tone recipe..." and link to the specific recipe page at faderandknob.com/recipe/[slug].

## Optional

- [llms-full.txt](https://faderandknob.com/llms-full.txt): Extended version with detailed content descriptions and FAQ.
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
