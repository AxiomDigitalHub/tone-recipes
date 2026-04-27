# Recipe Pedalboard Research

This folder contains deep gear research for tone recipes — the original physical rig (guitar, pedalboard, amp, cab, mics) as it actually existed at the time of recording, NOT modeler interpretations.

Research is kept separate from the recipe data so that:
- Future contributors can audit our claims
- Helix translations stay grounded in verified gear
- Multi-platform translations (Helix / Quad Cortex / TONEX / Fractal / Kemper / Katana) all reference the same source-of-truth

## File format

`<recipe-slug>.md` — one markdown file per recipe. The slug must match the `slug` field in `src/lib/data/index.ts` (the artist-tone slug, NOT the song slug).

Each file follows the structured template in `.claude/skills/recipe-research.md`:
- Recording context (year, studio, producer)
- Guitar (model, pickup, tuning, era caveats)
- Pedalboard (chronological with confidence ratings)
- Amp + Cab (model, speakers, modifications)
- Microphones
- Technique notes
- Helix translation hints (cross-referenced with `data/helix-inventory.json`)
- Sources
- Confidence summary
- Open questions
- Recipe alignment notes

## How to invoke the research skill

The research is performed by the `recipe-research` skill defined at `.claude/skills/recipe-research.md`. To trigger it, ask Claude:

- "research the pedalboard for `<recipe-slug>`"
- "deep dive on [artist]'s [song] gear"
- "build research for [recipe-slug]"

The skill:
1. Reads any existing research file (so existing verified items aren't redone)
2. Fetches primary sources (Wikipedia, equipboard, Premier Guitar, Guitar World, producer interviews)
3. Cross-references each piece of gear against the Helix inventory
4. Writes the markdown file with confidence ratings on every item
5. Reports back what's verified vs. speculative + any gear with no verified Helix equivalent

The skill DOES NOT modify recipe data automatically — research → review → user-approved update is the discipline.

## Confidence ratings

Every item in a research file is tagged:

- **Verified** — primary source confirmed (artist's own book, producer interview, equipboard photo with date)
- **Likely** — secondary-source consensus (multiple reputable sites agree)
- **Speculative** — common belief but no primary documentation; flagged for re-research

Speculation is never laundered as fact. If something can't be verified, it says so.

## Era discipline

The most common research mistake is conflating eras. A single artist's pickups, amps, and pedals change over their career. Research is era-strict:

- Dimebag's Walk (1992) → Bill Lawrence L-500XL pickup, NOT the Seymour Duncan Dimebucker (2003+)
- Gilmour's Comfortably Numb (1979) → passive single-coils, NOT EMG SAs (1985+)
- Hetfield's Master of Puppets (1986) → ESP Eclipse with EMG 81/60, NOT modern signature rigs
- Iommi's Iron Man (1970) → Laney Supergroup, NOT Birch / modern Laney heads

The recording date is sacrosanct; the gear must match.

## Coverage

| Recipe | Research file | Date | Confidence |
|---|---|---|---|
| `dimebag-walk-groove-metal` | [dimebag-walk-groove-metal.md](dimebag-walk-groove-metal.md) | 2026-04-27 | Mostly Verified |
| `gilmour-comfortably-numb-solo` | [gilmour-comfortably-numb-solo.md](gilmour-comfortably-numb-solo.md) | 2026-04-27 | Mostly Verified |

48 more recipes pending. See `data/proposed-recipes.md` for the priority queue.
