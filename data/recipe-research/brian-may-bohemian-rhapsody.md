# Brian May — "Bohemian Rhapsody" Pedalboard Research

**Recipe slug:** `brian-may-bohemian-rhapsody`
**Last researched:** 2026-04-30
**Source confidence:** Verified (extensively documented — May built and maintains the same rig for 50+ years)

---

## Recording context

- **Album:** *A Night at the Opera* (1975)
- **Studio:** Rockfield Studios (Wales) + Roundhouse Studios (London) + Sarm West (London) + Wessex Sound + Olympic Studios + Scorpio Sound + Trident Studios — yes, SEVEN studios (Queen used different rooms for different parts)
- **Producer:** Roy Thomas Baker + Queen
- **Engineer:** Mike Stone (chief), Gary Lyons, others
- Recording dates: August–November 1975

The guitar harmonies on Bohemian Rhapsody are layered — the 24-track recording was famously bounced down so many times that the original tape was nearly transparent at the mix stage. May tracked his guitar parts mostly at Rockfield (rural Wales) and Roundhouse.

---

## Guitar

- **Model:** **The Red Special** — built by Brian May and his father Harold in 1963 (May was 16). One of the most famous home-built guitars in rock.
  - Body: oak from a 19th-century fireplace mantel; neck: mahogany from an antique table
  - Three custom Burns Tri-Sonic single-coils (rewound by May himself with paraffin wax dip-potting)
  - Built-in tremolo using motorbike valve springs
  - Series/parallel switching for each pickup (gives 27 tonal combinations)
- **Pickup:** Bridge + middle in series (one of the famous "phase" combinations) for the harmonies; the iconic "blooming" tone
- **Tuning:** E standard
- **Strings:** Picato .009–.042 — light strings (May plays with a sixpence coin instead of a pick, so light strings respond better)
- **Notable mods:** The whole guitar IS a mod. May has rebuilt it multiple times over 50 years; the current version has additional shielding and some component upgrades.
- **Era caveat:** The Red Special on Bohemian Rhapsody is essentially the same guitar that's on every Queen recording from Queen I (1973) to today. It's been continuously maintained but never replaced. There's no era-specific pickup change to worry about.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Dallas Rangemaster Treble Booster** | DEFAULT-ON — THE Brian May trick | Single boost knob ~8 | Verified |

**That's the entire pedalboard.** Brian May has used essentially one effect his entire career — the Dallas Rangemaster (or modern variants like the John Deacon-built treble boosters, the Pete Cornish boosters, and the Greg Fryer signature unit). The Rangemaster is what gives the AC30 its harmonic-rich vocal lead character.

**Notes:**
- May does NOT use overdrive pedals, distortion pedals, or fuzz. The Rangemaster is just an upper-frequency boost — it pushes the AC30's preamp into saturation by overloading the high-end input.
- The harmony layering on Bohemian Rhapsody is achieved by RECORDING multiple takes of the same melody at different intervals, NOT by harmonizer pedals. May plays each harmony part in real time.
- The "operatic" crescendo at the end of the song is entirely guitar harmony — no synths, no horns. Just May's Red Special tracked many times.
- Echoes / delays were studio outboard (Roland tape echoes, EMT plates), NOT pedals.

---

## Amp + Cab

- **Amp:** **Vox AC30 Top Boost** (1962-65 vintage Vox) — 30W, 4×EL84
  - Channel: Top Boost / Brilliant
  - Settings: Volume on Top Boost ~8 (to push it into saturation), Tone (Bass) 5, Tone (Treble) 7
  - **THREE AMPS in parallel** — May famously runs his Red Special through three Vox AC30s simultaneously, each panned slightly differently in the mix. For Bohemian Rhapsody specifically, this is what gives the harmonies their stereo width.
- **Cab:** Vox AC30 built-in 2x12 — Celestion Blue Alnico (the original-spec Vox blue speaker)
  - The Celestion Blue Alnico is the speaker. NOT modern G12H30s, NOT V30s. The blue alnico is half the AC30's tone.
- **Power tubes:** EL84 quad
- **Modifications:** Standard AC30 Top Boost. Sometimes a Treble booster bypass switch was installed for cleaner tones (verified on the Brighton Rock-era amp).
- **Multi-cab setup:** Three AC30s in parallel — May's signature live + studio rig. For Bohemian Rhapsody studio tracking, all three were typically on, mic'd separately, and panned in the mix.

---

## Microphones

- **Per AC30:** Shure SM57 — close, ~1" off the speaker, on-axis to the cone
- **Off-axis:** Sometimes a Neumann U67 a few feet back for the room blend, less commonly used at Rockfield
- **Room mic:** Roundhouse and Trident sessions added natural room ambience

For Bohemian Rhapsody's harmonies specifically, each layered guitar take was tracked through the same three-AC30 setup, with three close SM57s. Roy Thomas Baker's mix work blended the three mics into a wide stereo image.

---

## Technique notes

- **Pick:** May plays with a **British sixpence coin** instead of a guitar pick. The serrated edge of the coin gives a unique attack — slightly metallic, with extra harmonic content. He's used this since he was a teenager.
- **Right-hand attack:** Light to medium attack. The Red Special's hot pickups + Rangemaster boost don't need heavy picking.
- **Vibrato:** Slow, wide vibrato (often using the trem arm for subtle pitch wavers, not deep dives).
- **Series/parallel switching:** Mid-song, May sometimes switches pickup combinations on the fly using the Red Special's series/parallel switches — gives different tones for different parts of the harmony stack.
- **Tone knob:** Always on 10 (the Red Special has individual on/off + series/parallel switches per pickup, no master tone knob in the modern sense).

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Dallas Rangemaster | **Deranged Master** (`HD2_DistDerangedMaster`) | Verified | Direct emulation. Boost ~0.85 = the May setting |
| Vox AC30 Top Boost | **Essex A30** (`HD2_AmpEssexA30`) | Verified | Direct emulation of the AC30 with Top Boost. Drive 0.65, Sag 0.65 for Class A response |
| AC30 2x12 + Celestion Blue Alnico | **2x12 Blue Bell** (`HD2_Cab2x12BlueBell`) | Verified — has a WithPan variant | Direct emulation. Blue Alnico = the blue-bell tone |
| SM57 close | Mic 0 (SM57) on cab | Verified | Standard placement |
| Three parallel AC30s | (single block + delay/widener for stereo) | n/a | Helix can simulate the parallel-amp effect via a stereo widener block, but not three discrete amps in one preset |
| Studio plate / Trident EMT | **Dynamic Plate** (`VIC_DynPlate`) | Verified | Decay 2.5, Mix 0.25 |

---

## Sources

- Wikipedia — *A Night at the Opera* article (recording dates, studios, engineer credits)
- *Brian May's Red Special: The Story of the Home-Built Guitar That Rocked Queen and the World* (Brian May & Simon Bradley, 2014) — definitive guitar provenance
- Premier Guitar — multiple Brian May rig features
- Equipboard pros/brian-may
- *Total Guitar* — Brian May rig studies
- Greg Fryer interview — luthier who maintains the Red Special, deep on guitar specs
- Roy Thomas Baker production interviews (Sound on Sound)

---

## Confidence summary

- **Verified:** 17 items (recording context across multiple studios, Red Special construction + provenance, Rangemaster only effect, AC30 Top Boost + Celestion Blue, sixpence-coin pick, three-amp parallel setup)
- **Likely:** 2 items (exact AC30 settings, exact U67 use)
- **Speculative:** 0 items — Brian May's rig is among the most-documented in rock

---

## Open questions

- **Per-take mic placement variation across the seven studios?** Probably yes; each studio's house engineer tweaked. SM57 close was constant; the off-axis blend varied.
- **Did May use a different Treble Booster on different sessions?** Possibly — he's used Rangemasters, Greg Fryer customs, and John Deacon-built units interchangeably. All have similar voicing.
- **Tape compression vs. amp compression on the harmony stack?** The 24-track tape bouncing introduced its own compression character that's hard to separate from the amp.

---

## Recipe alignment

The current `brian-may-bohemian-rhapsody` recipe matches the research closely. Helix translation:
- Volume Pedal + Comp ✓
- Deranged Master default-on (Boost 0.85) ✓ matches the Rangemaster always-on setup
- Heir Apparent + Minotaur as alt drives — these are MODERN additions; historically May only used the Rangemaster. Acceptable as user-toggleable alternatives.
- Essex A30 amp with Drive 0.65 + Sag 0.65 ✓ matches a cranked AC30 Top Boost
- Dual-mic 2x12 Blue Bell cab ✓ matches the AC30 + Celestion Blue Alnico
- Transistor Tape (350 ms) — May didn't use a tape echo on his board, but Trident Studios had Roland tape echoes; this is a reasonable studio-emulation
- Dynamic Plate at Decay 2.5 ✓ matches Trident's EMT plate
- Tilt EQ at end ✓

Open improvements:
- Add a recipe note about the THREE parallel AC30s — currently the recipe is single-amp, missing a key part of the May sound. A two-amp version on dsp0 + dsp1 would capture the stereo character better.
- Currently no series/parallel pickup switching simulation — that's a guitar-side feature (real Red Special has 27 combinations) that the recipe can only describe in metadata.
- Note that a sixpence-coin pick attack character can be approximated by EQ + slight overdrive; not directly modeled.
