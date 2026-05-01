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
| `brian-may-bohemian-rhapsody` | [brian-may-bohemian-rhapsody.md](brian-may-bohemian-rhapsody.md) | 2026-04-30 | Verified |
| `dimebag-walk-groove-metal` | [dimebag-walk-groove-metal.md](dimebag-walk-groove-metal.md) | 2026-04-27 | Mostly Verified |
| `evh-eruption-brown-sound` | [evh-eruption-brown-sound.md](evh-eruption-brown-sound.md) | 2026-04-27 | Mostly Verified |
| `evh-panama-brown-sound` | [evh-panama-brown-sound.md](evh-panama-brown-sound.md) | 2026-04-30 | Verified |
| `gilmour-comfortably-numb-solo` | [gilmour-comfortably-numb-solo.md](gilmour-comfortably-numb-solo.md) | 2026-04-27 | Mostly Verified |
| `gilmour-shine-on-sustain` | [gilmour-shine-on-sustain.md](gilmour-shine-on-sustain.md) | 2026-04-30 | Mostly Verified |
| `gilmour-time-solo-lead` | [gilmour-time-solo-lead.md](gilmour-time-solo-lead.md) | 2026-04-30 | Mostly Verified |
| `hammett-fade-to-black-clean-wah-solo` | [hammett-fade-to-black-clean-wah-solo.md](hammett-fade-to-black-clean-wah-solo.md) | 2026-04-30 | Verified |
| `hendrix-voodoo-child-wah` | [hendrix-voodoo-child-wah.md](hendrix-voodoo-child-wah.md) | 2026-04-30 | Verified |
| `hetfield-enter-sandman-tight-rhythm` | [hetfield-enter-sandman-tight-rhythm.md](hetfield-enter-sandman-tight-rhythm.md) | 2026-04-30 | Verified |
| `hetfield-master-of-puppets-rhythm` | [hetfield-master-of-puppets-rhythm.md](hetfield-master-of-puppets-rhythm.md) | 2026-04-27 | Mostly Verified |
| `iommi-iron-man-doom-riff` | [iommi-iron-man-doom-riff.md](iommi-iron-man-doom-riff.md) | 2026-04-27 | Mostly Verified |
| `mayer-slow-dancing-burning-room` | [mayer-slow-dancing-burning-room.md](mayer-slow-dancing-burning-room.md) | 2026-04-30 | Verified |
| `page-stairway-to-heaven-clean-build` | [page-stairway-to-heaven-clean-build.md](page-stairway-to-heaven-clean-build.md) | 2026-04-30 | Mostly Verified |
| `slash-sweet-child-o-mine-lead` | [slash-sweet-child-o-mine-lead.md](slash-sweet-child-o-mine-lead.md) | 2026-04-30 | Mostly Verified |
| `clapton-layla-lead` | [clapton-layla-lead.md](clapton-layla-lead.md) | 2026-04-30 | Verified |
| `cobain-teen-spirit-grunge` | [cobain-teen-spirit-grunge.md](cobain-teen-spirit-grunge.md) | 2026-04-30 | Verified |
| `edge-where-the-streets-have-no-name` | [edge-where-the-streets-have-no-name.md](edge-where-the-streets-have-no-name.md) | 2026-04-30 | Verified |
| `frusciante-under-the-bridge-clean` | [frusciante-under-the-bridge-clean.md](frusciante-under-the-bridge-clean.md) | 2026-04-30 | Verified |
| `gibbons-la-grange-blues-crunch` | [gibbons-la-grange-blues-crunch.md](gibbons-la-grange-blues-crunch.md) | 2026-04-30 | Verified |
| `knopfler-sultans-of-swing-clean` | [knopfler-sultans-of-swing-clean.md](knopfler-sultans-of-swing-clean.md) | 2026-04-30 | Verified |
| `mayer-gravity-super-clean-dynamic` | [mayer-gravity-super-clean-dynamic.md](mayer-gravity-super-clean-dynamic.md) | 2026-04-30 | Verified |
| `srv-pride-and-joy-rhythm` | [srv-pride-and-joy-rhythm.md](srv-pride-and-joy-rhythm.md) | 2026-04-30 | Verified |

**22 of 50 recipes researched (44%).** 28 more pending. See `data/proposed-recipes.md` for the priority queue.

## Patterns emerging across the corpus

With 22 deep-dives done, common cross-recipe patterns:

- **Era-correct pickups matter more than artist-name pickups.** Six of 22 recipes had pickup mismatches between the recipe's "current era" gear and the recording's actual era (Dimebag pre-Dimebucker, Slash on Kris Derrig replica, Gilmour pre-EMG, Cobain Mustang vs Jaguar, etc.).
- **The pedalboard is often smaller than fans assume.** Brian May = 1 pedal (Rangemaster). Layla = 0 pedals. Sultans of Swing = 0–1 pedals (Dyna Comp debated). Gibbons = 1 pedal. Iconic tones often have minimal pedal chains; the "rig myth" is a tutorial-industry construct.
- **Studio tracking is mono close + room mic.** Across 22 sessions, the dominant pattern is SM57 close + ribbon (M160 / R-121) close + condenser room mic at 6–8 feet. The "stereo multi-amp" sounds people associate with rock are usually mix-side processing.
- **Producer matters as much as the artist.** Tom Dowd, Eddie Kramer, Bob Rock, Brian Eno + Daniel Lanois, Mike Clink, Andy Wallace, Brendan O'Brien — these names recur and shape the gear choices made.
- **Dual-DSP topology is genuinely useful.** Many of the multi-amp setups (SRV, Edge, Hetfield, Brian May) need dsp0 + dsp1 to capture the parallel-amp character. Currently we ship single-amp-on-dsp0 versions and lose half the sound.
