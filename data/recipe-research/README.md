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
| `page-whole-lotta-love-heavy-riff` | [page-whole-lotta-love-heavy-riff.md](page-whole-lotta-love-heavy-riff.md) | 2026-05-01 | Verified |
| `slash-welcome-to-jungle-aggressive-riff` | [slash-welcome-to-jungle-aggressive-riff.md](slash-welcome-to-jungle-aggressive-riff.md) | 2026-05-01 | Mostly Verified |
| `srv-little-wing-hendrix-tribute` | [srv-little-wing-hendrix-tribute.md](srv-little-wing-hendrix-tribute.md) | 2026-05-01 | Verified |
| `srv-pride-and-joy-rhythm` | [srv-pride-and-joy-rhythm.md](srv-pride-and-joy-rhythm.md) | 2026-04-30 | Verified |
| `srv-texas-flood-slow-blues-lead` | [srv-texas-flood-slow-blues-lead.md](srv-texas-flood-slow-blues-lead.md) | 2026-05-01 | Verified |
| `bb-king-thrill-is-gone` | [bb-king-thrill-is-gone.md](bb-king-thrill-is-gone.md) | 2026-05-01 | Verified |
| `bonamassa-sloe-gin-blues-rock-lead` | [bonamassa-sloe-gin-blues-rock-lead.md](bonamassa-sloe-gin-blues-rock-lead.md) | 2026-05-01 | Verified |
| `auerbach-lonely-boy-raw-garage` | [auerbach-lonely-boy-raw-garage.md](auerbach-lonely-boy-raw-garage.md) | 2026-05-01 | Mostly Verified |
| `gallagher-wonderwall-jangly-rhythm` | [gallagher-wonderwall-jangly-rhythm.md](gallagher-wonderwall-jangly-rhythm.md) | 2026-05-01 | Verified |
| `garcia-truckin-clean-sparkle` | [garcia-truckin-clean-sparkle.md](garcia-truckin-clean-sparkle.md) | 2026-05-01 | Verified |
| `gary-clark-bright-lights-modern-blues` | [gary-clark-bright-lights-modern-blues.md](gary-clark-bright-lights-modern-blues.md) | 2026-05-01 | Verified |
| `greenwood-creep-clean-to-crunch` | [greenwood-creep-clean-to-crunch.md](greenwood-creep-clean-to-crunch.md) | 2026-05-01 | Mostly Verified |
| `homme-no-one-knows-detuned-desert` | [homme-no-one-knows-detuned-desert.md](homme-no-one-knows-detuned-desert.md) | 2026-05-01 | Verified |
| `jack-white-seven-nation-army` | [jack-white-seven-nation-army.md](jack-white-seven-nation-army.md) | 2026-05-01 | Verified |
| `jones-schism-dark-heavy` | [jones-schism-dark-heavy.md](jones-schism-dark-heavy.md) | 2026-05-01 | Verified |
| `lifeson-tom-sawyer-chorus` | [lifeson-tom-sawyer-chorus.md](lifeson-tom-sawyer-chorus.md) | 2026-05-01 | Verified |
| `marr-how-soon-is-now-tremolo` | [marr-how-soon-is-now-tremolo.md](marr-how-soon-is-now-tremolo.md) | 2026-05-01 | Verified |
| `morello-killing-in-the-name` | [morello-killing-in-the-name.md](morello-killing-in-the-name.md) | 2026-05-01 | Verified |
| `murray-trooper-galloping-lead` | [murray-trooper-galloping-lead.md](murray-trooper-galloping-lead.md) | 2026-05-01 | Verified |
| `rhoads-crazy-train-lead` | [rhoads-crazy-train-lead.md](rhoads-crazy-train-lead.md) | 2026-05-01 | Verified |
| `richards-start-me-up-open-g` | [richards-start-me-up-open-g.md](richards-start-me-up-open-g.md) | 2026-05-01 | Verified |
| `santana-smooth-lead` | [santana-smooth-lead.md](santana-smooth-lead.md) | 2026-05-01 | Verified |
| `satriani-surfing-with-the-alien-lead` | [satriani-surfing-with-the-alien-lead.md](satriani-surfing-with-the-alien-lead.md) | 2026-05-01 | Verified |
| `townshend-wont-get-fooled-again` | [townshend-wont-get-fooled-again.md](townshend-wont-get-fooled-again.md) | 2026-05-01 | Verified |
| `turner-do-i-wanna-know-fuzzy-riff` | [turner-do-i-wanna-know-fuzzy-riff.md](turner-do-i-wanna-know-fuzzy-riff.md) | 2026-05-01 | Verified |
| `angus-young-back-in-black-rhythm` | [angus-young-back-in-black-rhythm.md](angus-young-back-in-black-rhythm.md) | 2026-05-01 | Verified |
| `angus-thunderstruck-tapping-intro` | [angus-thunderstruck-tapping-intro.md](angus-thunderstruck-tapping-intro.md) | 2026-05-01 | Verified |
| `bellamy-plug-in-baby-fuzz-whammy` | [bellamy-plug-in-baby-fuzz-whammy.md](bellamy-plug-in-baby-fuzz-whammy.md) | 2026-05-01 | Mostly Verified |

**50 of 50 recipes researched (100%).** Full coverage achieved. New recipes added to `src/lib/data/index.ts` should ship with a matching research file.

## Patterns emerging across the corpus

With 50 deep-dives done, common cross-recipe patterns:

- **Era-correct pickups matter more than artist-name pickups.** Six+ of 50 recipes had pickup mismatches between the recipe's "current era" gear and the recording's actual era (Dimebag pre-Dimebucker, Slash on Kris Derrig replica, Gilmour pre-EMG, Cobain Mustang vs Jaguar, Satriani pre-Ibanez-JS Kramer, Garcia pre-Wolf, etc.).
- **The pedalboard is often smaller than fans assume.** Brian May = 1 pedal. Layla = 0 pedals. Sultans of Swing = 0–1. Gibbons = 1. BB King = 0. Keith Richards = 0. Townshend = 0. Angus Young = 0. Iconic tones often have minimal pedal chains; the "rig myth" is a tutorial-industry construct. ~30% of researched recipes are guitar→amp pure.
- **Studio tracking is mono close + room mic.** Across 50 sessions, the dominant pattern is SM57 close + ribbon (M160 / R-121) close + condenser room mic at 6–8 feet. The Glyn Johns stereo room technique (Townshend) and Mike Clink tight close-mic (Slash) are the two production poles. "Stereo multi-amp" sounds are usually mix-side processing.
- **Producer matters as much as the artist.** Tom Dowd, Eddie Kramer, Bob Rock, Brian Eno + Daniel Lanois, Mike Clink, Andy Wallace, Brendan O'Brien, Mutt Lange, John Leckie, Bruce Fairbairn, Glyn Johns, Mike Fraser, GGGarth Richardson, Kevin Shirley, Danger Mouse, Eric Valentine — these names recur and shape gear choices.
- **Dual-DSP topology is genuinely useful.** Many multi-amp setups (SRV, Edge, Hetfield, Brian May, Lifeson Hiwatt+Marshall, Bellamy Diezel+Marshall, Gary Clark Vibroverb+Bassman) need dsp0 + dsp1 to capture parallel-amp character. Single-amp versions miss the layered tone.
- **Tuning conventions cluster.** Eb standard (SRV, Slash, Hendrix), E standard (most), Drop D (Morello), C standard (Homme), D standard (Adam Jones), A standard (Jack White), Open G (Richards 5-string), Open D6 (Marr). Tuning is a recipe-level metadata field that recipes often miss.
- **Helix-inventory gaps to call out.** Hiwatt has no direct model. Diezel VH4 has no direct model. Z.Vex Fuzz Factory has no direct model. Sola Sound Tone Bender MkII has no direct model. Ampeg VT-40 has no direct model. AC30's Alnico Blue speaker has no direct match. Recipes for these artists need approximation notes in their helix translation hints.
- **The "no pedals on the riff, pedals on the solo" pattern is universal.** Slash, Morello, Rhoads, Satriani, Bonamassa, Mayer all do this. Snapshot mode (riff dry / solo with FX) is the IDEAL recipe topology for these.
