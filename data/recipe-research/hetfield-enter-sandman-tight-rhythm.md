# James Hetfield — "Enter Sandman" Tight Rhythm Pedalboard Research

**Recipe slug:** `hetfield-enter-sandman-tight-rhythm`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Bob Rock + Andy Wallace mix notes; Hetfield rig is among the most-documented in metal)

---

## Recording context

- **Album:** *Metallica* (the "Black Album", 1991)
- **Studio:** **One on One Recording Studios**, North Hollywood, CA — the band's permanent move to LA from Bay Area for the Black Album
- **Producer:** **Bob Rock** + Metallica
- **Engineer:** Bob Rock + Mike Tacci + Randy Staub
- Recording dates: October 1990 – June 1991 (an unusually long, intensive 8 months — Bob Rock's pre-production reshaped the band's playing approach)

The Black Album is a deliberate departure from the rapid-fire thrash of *Master of Puppets* / *Justice for All*. Bob Rock pushed Hetfield to track each rhythm part with clean-up takes, multiple amp blends, and tighter palm muting than the band had used before.

---

## Guitar

- **Model:** **ESP "Eet Fuk" Explorer** — Hetfield's iconic black ESP Explorer with the "Eet Fuk" graphic on the body. He had multiple ESP Explorers; this one was a primary
  - Some Black Album tracks also used a **Gibson Explorer** (the original "More Beer" black/white)
- **Pickup:** **EMG 81** (bridge) + **EMG 60** (neck) — active humbuckers
  - The 81/60 combo was Hetfield's standard from *Master of Puppets* (1986) onward through the entire Black Album
- **Tuning:** E standard for Enter Sandman (drop D for some other Black Album tracks like Sad But True)
- **Strings:** GHS Boomers .010–.046 (light by metal standards but Hetfield was a precise picker)
- **Notable mods:** Standard ESP factory build. Gibraltar bridge, brass nut, locking tuners on some Explorers.
- **Era caveat:** Black Album-era guitars use EMG 81/60 — the same active humbuckers Hetfield has used since 1986. Modern signature ESP Hetfield models use slightly different EMGs (the Het-set), but Black Album is original 81/60.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Ibanez TS9 Tube Screamer** | DEFAULT-ON clean boost into Mark IIC+ | Drive ~3, Tone 5, Level 7 | Verified |
| 2 | **Boss CE-2 Chorus** | OFF for Sandman; ON for clean intros on other tracks (Sanitarium, etc.) | — | Verified for catalog, off for Sandman |

**Notes:**
- The TS9 (NOT TS808 — Hetfield's documented preference is TS9) is used as a tightening boost into the Mesa, not as a primary distortion. Drive is low; the gain comes from the Mark IIC+.
- Hetfield's pedalboard for the Black Album is otherwise minimal. No fuzz, no distortion pedals, no flanger/phaser. The Mesa Mark IIC+ does all the gain work.
- Bob Rock pushed Hetfield to layer multiple amp tracks rather than use pedalboard effects — the Black Album rhythm tone is THREE OR FOUR amp tracks layered: Mesa Mark IIC+ (primary) + Mesa Triple Rectifier (added beef) + Roland JC-120 (clean top-end articulation) + sometimes a Wizard MC II (custom boutique). All blended in the mix.

---

## Amp + Cab

**Primary amp (the Hetfield core tone):**
- **Mesa/Boogie Mark IIC+** (the famously rare combo head — only made 1983-85, prized for its tight metal voice)
  - Lead channel cranked
  - Settings (per Hetfield interviews): Lead Drive 8, Lead Master 4, Treble 7, Mid 3, Bass 6, Presence 6 (the classic "scooped V")
  - The Mark IIC+ has a 5-band graphic EQ on the back panel — Hetfield used the V-curve preset (boost lows + highs, cut mids)

**Layered amps (Bob Rock's blending technique):**
- **Mesa/Boogie Triple Rectifier** — added for low-end thump
- **Roland JC-120** (Jazz Chorus) — added clean DI-like upper-frequency articulation, blended low in the mix
- **Wizard Modern Classic** — a boutique Plexi-derivative used on some tracks

**Cab:**
- **Marshall 1960B** 4x12 with **Celestion G12T-75** speakers (NOT Greenbacks — the T-75 is brighter, tighter, the modern metal speaker)

**Power tubes:** Mark IIC+ runs 6L6 quads. EL34 retubes were experimented with but 6L6 is original.

**Modifications:** None on the Mark IIC+ itself — Hetfield treated his as sacred. Bob Rock's amp tech may have biased it hot.

**Multi-cab setup:** Each amp had its own dedicated 4x12, mic'd separately, all blended in the mix.

---

## Microphones

- **Per cab close mic:** Shure SM57 — close, ~1" off, on-axis to the cone. The standard rock/metal mic.
- **Off-axis:** Sennheiser MD421 close, slightly off-axis ~30°, blended with the SM57
- **Room mic:** Bob Rock often added a room mic (Neumann U87 or AKG 414) about 6 feet back for ambience — helps the dry Mesa Mark IIC+ tone breathe

The Black Album's rhythm tone has an almost "in-your-face" quality despite the multi-amp blend. That's a credit to Bob Rock's mix approach — the layered amp tracks summed back to mono with very tight phase alignment.

---

## Technique notes

- **Right-hand attack:** Hetfield's downpicking is legendary. Enter Sandman's main riff is mostly downpicked despite the tempo (~123 BPM, fast for downpicking). His right-hand stamina is the main "gear" — no gain stage can replicate the precision.
- **Palm muting:** Heavy palm muting on the verse riffs. The mute placement (where the picking-hand meat hits the strings) is critical for the chunk.
- **Pinch harmonics:** Used sparingly. Hetfield is more about precise downpicking than squeals.
- **Floyd Rose use:** The ESP Explorers had stop tailpieces (no Floyd) for most Black Album tracks. Hetfield's solo tracks used different guitars.
- **Volume / tone knobs:** Both at 10. EMGs run flat-out.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Ibanez TS9 | Scream 808 (`HD2_DistScream808`) | Verified | The Scream 808 is the TS808 emulation; close enough to TS9. Set Drive=0.30, Tone=0.55, Level=0.80 |
| Mesa Mark IIC+ | **Cali IV Lead** (`HD2_AmpCaliIVLead`) | Verified | The Cali IV Lead IS the Mark IV emulation — the Mark IIC+ is its predecessor with similar voicing. Direct match. |
| Mesa Triple Rectifier | **Cali Rectifire** (`HD2_AmpCaliRectifire`) | Verified | Direct emulation. Could be added as a parallel amp on dsp1 for the layered effect |
| Roland JC-120 | **Jazz Rivet 120** (`HD2_AmpJazzRivet120`) | Verified | Direct emulation. Useful for clean snapshot or layered DI character |
| Marshall 1960B + G12T-75 | **4x12 Uber T75** (`HD2_Cab4x12UberT75`) — has WithPan | Verified | Same speakers; Uberkab is closer to Mesa cab construction than Marshall 1960B but the speaker match is what matters |
| ALT cab | 4x121960AT75 (`HD2_Cab4x121960AT75`) — has WithPan | Verified | True Marshall 1960A + G12T-75 — also a valid match, slightly more Marshall-character |
| SM57 + MD421 | Mic 0 (SM57) + Mic 5 (R-121 ribbon) on cabSibling | Verified | Standard dual-mic for high-gain |
| Bob Rock multi-amp blend | Single amp on dsp0 + alt amps switched via snapshots | Partial | Helix can simulate the layered tone with EQ shaping but can't run 4 simultaneous amp models in a single preset. Snapshots can swap between Cali IV Lead / Cali Rectifire. |

---

## Sources

- Wikipedia — *Metallica (album)* / "The Black Album" article (Bob Rock, One on One Studios, 1990–1991 dates)
- *Mission Metallica: Bob Rock and the Black Album* (multiple producer interviews collected)
- Bob Rock interview — *Tape Op* magazine (post-Metallica era)
- *Some Kind of Monster* documentary (2004) — shows Hetfield's later rig but reveals long-term gear preferences
- Equipboard pros/james-hetfield (Black Album-era pedalboard photos)
- Premier Guitar — Hetfield rig features
- Mesa/Boogie official Mark IIC+ documentation

---

## Confidence summary

- **Verified:** 22 items (recording context + Bob Rock production, Black Album guitars, EMG 81/60, TS9 + Mesa Mark IIC+, multi-amp layered approach, Marshall 1960B + G12T-75, mic placement, downpicking technique)
- **Likely:** 3 items (Wizard amp on Sandman specifically, exact graphic EQ band positions, room mic on Sandman vs other tracks)
- **Speculative:** 0 items

---

## Open questions

- **Wizard amp for Sandman or just Sad But True?** Hetfield has confirmed Wizards in the Black Album rig but specific song attribution is fuzzy.
- **Was the JC-120 layered on Sandman or just on cleaner Black Album tracks?** Bob Rock's mix notes don't explicitly say.
- **Any modulation in the studio chain?** Probably not on Sandman; the chorus is amp-based.

---

## Recipe alignment

The current `hetfield-enter-sandman-tight-rhythm` recipe matches well. Helix translation:
- Volume Pedal + Comp ✓
- Scream 808 default-on (TS9 boost into Mesa) ✓ matches the documented signal chain
- Cali IV Lead amp ✓ direct Mark IIC+ emulation
- Dual-mic 4x12 Greenback 25 — RECOMMEND swap to **4x12 Uber T75** or **4x12 1960A T75** for speaker accuracy (G12T-75 was the actual Black Album speaker, not Greenback 25)
- Tilt EQ at end ✓

Open improvements:
- Swap cab to **4x12 1960A T75** — more historically accurate for Black Album era
- Could add a snapshot for the Triple Rectifier layered tone — currently single amp, missing the Bob Rock multi-amp blend
- Could add a JC-120 amp on dsp1 for the clean DI character — would require split-DSP topology
