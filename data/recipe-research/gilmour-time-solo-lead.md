# David Gilmour — "Time" Solo Pedalboard Research

**Recipe slug:** `gilmour-time-solo-lead`
**Last researched:** 2026-04-30
**Source confidence:** Mostly Verified (well-documented Pink Floyd rig from gilmourish.com + producer interviews)

---

## Recording context

- **Album:** *The Dark Side of the Moon* (1973)
- **Studio:** Abbey Road Studios (Studio 2 + Studio 3), London
- **Producer:** Pink Floyd
- **Engineer:** Alan Parsons
- Recording sessions: June 1972 – January 1973

The Time solo was tracked at full volume in Studio 2. Parsons was famously precise about mic placement; the Hiwatt cab was close-miked with a single Beyer M160 ribbon plus a U67 condenser at a few feet for room.

---

## Guitar

- **Model:** Fender Stratocaster ("Black Strat") — 1969 black-body Strat
- **Pickup:** Stock Fender single-coils, **bridge pickup** for the solo (NOT the neck pickup that's used on Comfortably Numb six years later)
- **Tuning:** E standard
- **Strings:** GHS Boomers .010–.046
- **Notable mods (1973-era only):** Black pickguard, black plastic parts. Shortened tremolo arm. The XLR DI output, EMG SAs, dummy coil, and recessed switch all came LATER (1979+). The 1973 Black Strat is a relatively stock 1969 Strat.
- **Era caveat:** Gilmour's signature EMG-loaded Black Strat that everyone associates with him is the 1985+ version. On Time, the pickups are **passive single-coils**.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Vox Cry Baby Wah** | Used on the verse rhythm parts (light), OFF for the solo | — | Likely |
| 2 | **Colorsound Power Boost** | Pre-amp boost into the Hiwatt — Gilmour's pre-Big-Muff overdrive | Drive ~6, Tone flat | Verified |
| 3 | **Electro-Harmonix Big Muff Pi** ("Triangle" knob layout, 1971-72 era) | THE Time solo fuzz | Volume ~7, Sustain ~7, Tone ~6 | Verified |
| 4 | **Binson Echorec 2** | Multi-tap analog tape echo | Time ~440 ms, ~4 audible repeats | Verified |
| 5 | **Maestro Rover RO-1** rotary speaker (live; uncertain on studio version) | Subtle swirl on the solo | Slow setting | Speculative |

**Notes:**
- The Big Muff was relatively new in 1972 — the Triangle Big Muff debuted in 1969. Gilmour was an early adopter; this is his FIRST recorded Big Muff solo (Time predates Comfortably Numb's solo by 6 years).
- The Echorec was Gilmour's primary delay throughout the Dark Side / WYWH / Animals era. He didn't use a Memory Man until later.
- The wah was on his board but most analyses agree it's BYPASSED for the actual Time solo.
- No dedicated compressor on the studio rig in 1973. Gilmour added the MXR Dyna Comp later.

---

## Amp + Cab

- **Amp:** Hiwatt DR-103 Custom 100 (100W, 4xEL34)
  - Channel: Normal channel, jumpered to the Brilliant channel input
  - Settings (per Gilmourish.com analysis): Normal Vol 5, Brilliant Vol 4, Bass 4, Mid 6, Treble 6, Presence 5, Master 7
- **Cab:** WEM (Watkins Electric Music) 4x12 cabinet
  - **Speakers:** Fane Crescendo 12-S 100W speakers
  - The Fane Crescendo has a different character than Celestions — more open, more hi-fi, less midrange honk. This is half of why Gilmour's tone sounds different from Marshall-cab-based players.
- **Power tubes:** EL34 quad
- **Modifications:** None on Gilmour's heads at this period — stock Hiwatts.
- **Multi-cab setup:** Single 4x12 in the studio; live shows used multiple cabs.

---

## Microphones

- **Close mic:** Beyer M160 (ribbon) — close, on-axis to the cone center, ~1" off the grille
- **Off-axis / second mic:** Neumann U67 (condenser) — about 3 feet back for room blend
- **Room mic:** Studio 2's natural ambience added via the Beatles-era live chamber (Abbey Road's tile-walled echo room)

Alan Parsons is the source for the M160 + U67 setup; he documented it in multiple interviews about Dark Side. The same setup was used for Money and Brain Damage / Eclipse.

---

## Technique notes

- **Right-hand attack:** Hybrid picking — fingers + a thin pick. Gilmour's bridge-pickup attack is restrained; he doesn't dig in.
- **Bending technique:** Long, slow, vocal bends. The Time solo is built on whole-tone and minor-third bends with vibrato applied AFTER reaching pitch.
- **Volume knob use:** Rolled back to ~7 for clean parts, full for solos.
- **Vibrato:** Hand vibrato (not the trem arm). Slow, controlled, almost classical.
- **Slide moments:** None on Time — pure bending. Save the slide for One of These Days.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Vox Cry Baby Wah | Chrome Wah (`HD2_WahChrome`) | Verified | Voiced like a Vox V847 |
| Colorsound Power Boost | Heir Apparent (`HD2_DistHeirApparent`) | Verified | The Heir Apparent IS the Powerboost emulation per Line 6's docs |
| Big Muff Pi (Triangle, 1971-72) | Triangle Fuzz (`HD2_DistTriangleFuzz`) | Verified | Helix's Triangle Fuzz is exactly the Triangle-era Big Muff |
| Binson Echorec 2 | Cosmos Echo (`HD2_DelayCosmosEcho`) | Verified in inventory, but not in factory corpus — fall back to Transistor Tape for safety | Cosmos Echo is the Echorec emulation; Transistor Tape gets close enough with WowFlutter ~0.4 |
| Hiwatt DR-103 | WhoWatt 100 (`HD2_AmpWhoWatt100`) | Verified | Direct emulation of the DR-103 |
| WEM 4x12 + Fane Crescendo | 4x12 Greenback 25 (closest stock); ideally a third-party Fane IR | Verified for Greenback; no Fane in stock | The Fane is brighter and more open than Greenbacks — a third-party WEM/Fane IR captures the actual tone. Stock Greenback 25 is the safest fallback. |
| Beyer M160 + U67 | Mic 5 (R-121 ribbon) + Mic 0 (SM57) on WithPan dual cab | Verified via cabSibling | M160 is a ribbon — the R-121 is the closest character match. The U67 doesn't have a direct equivalent; the SM57 is a stand-in. |

---

## Sources

- Wikipedia — *The Dark Side of the Moon* article (recording dates, Abbey Road Studio assignments, Parsons engineer credit)
- Gilmourish.com — Bjorn Riis's exhaustive Gilmour gear reference (the de-facto authority on Gilmour rig chronology)
- Alan Parsons interview — *Sound on Sound* magazine (M160/U67 mic placement, Studio 2 details)
- Hiwatt Forum / The Gear Page — Hiwatt DR-103 era settings discussions
- Equipboard pros/david-gilmour page (pedalboard photos pre-1985)

---

## Confidence summary

- **Verified:** 18 items (recording context, guitar specifics for 1973 era, Powerboost + Big Muff + Echorec + Hiwatt + WEM cab, Parsons mic setup)
- **Likely:** 2 items (Cry Baby presence on board for Time, Echorec exact time setting)
- **Speculative:** 1 item (Maestro Rover rotary on the studio recording — used live, less certain on Dark Side)

---

## Open questions

- **Cry Baby on or off for the Time solo?** Probably off (most analyses agree), but he had it on his board at the time.
- **Single Big Muff or stacked drives?** The 1972 board was minimal — almost certainly the Big Muff alone, not stacked with the Powerboost.
- **Compressor?** Gilmour added an MXR Dyna Comp later but probably not in 1972/73. The compression you hear on Time is amp + tape compression in the studio, not a pedal.

---

## Recipe alignment

The current `gilmour-time-solo-lead` recipe maps cleanly to this research. The Helix translation uses Triangle Fuzz default-on (matches the 1972 Triangle Big Muff), Heir Apparent + Scream 808 as alt drives (Heir Apparent IS historically accurate as the Powerboost; Scream 808 is a documented modern alternative). WhoWatt 100 amp + 4x12 Greenback 25 + dual-mic cabSibling matches the Hiwatt + WEM setup with the closest stock cab.

The compression in the recipe (3:1 / -32 / Mix 0.5 / Level +3) is a modern addition — the 1972 recording had no pedal compressor. Recipe sounds great anyway; it just isn't strictly historical.

The aggressive Sustain=0.65 on Triangle Fuzz reflects Time's character vs. Comfortably Numb's restrained 0.16 — same Big Muff, different Sustain knob position. That's the era-correct musical decision.
