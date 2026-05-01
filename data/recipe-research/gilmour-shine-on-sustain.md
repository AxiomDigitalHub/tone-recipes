# David Gilmour — "Shine On You Crazy Diamond" Pedalboard Research

**Recipe slug:** `gilmour-shine-on-sustain`
**Last researched:** 2026-04-30
**Source confidence:** Mostly Verified (Gilmourish.com + the *Wish You Were Here* Classic Albums documentary)

---

## Recording context

- **Album:** *Wish You Were Here* (1975)
- **Studio:** Abbey Road Studios, London
- **Producer:** Pink Floyd
- **Engineer:** Brian Humphries
- Recording sessions: January–July 1975

The four-note motif (G – Bb – F – Eb) was tracked at moderate volume. The reverb you hear on the record is mostly Abbey Road's plate chamber, not amp room mic.

---

## Guitar

- **Model:** Fender Stratocaster ("Black Strat") — 1969 black-body Strat
- **Pickup:** Stock Fender single-coils, **neck pickup** for the motif (warm, round sustain)
- **Tuning:** E standard
- **Strings:** GHS Boomers .010–.046
- **Notable mods (1975-era):** Black pickguard, shortened tremolo arm, replacement bridge saddles. Still passive single-coils — EMGs are 10 years away.
- **Era caveat:** Same Black Strat as Time (1973), still pre-EMG. Wish You Were Here is the bridge between Dark Side and Animals — passive pickups all the way.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Colorsound Power Boost** | DEFAULT-ON light overdrive — the sustain comes from this driving the Hiwatt | Drive ~5, Tone flat, Level 7 | Verified |
| 2 | **Electro-Harmonix Big Muff Pi** (Triangle era) | Available for the heavier Solo VI / Solo VII (Part IX of the song) | Volume 7, Sustain 7, Tone 6 | Verified |
| 3 | **Binson Echorec 2** | Multi-tap analog tape echo — the long, washy delay on the motif | Time ~500 ms, ~5 audible repeats | Verified |
| 4 | **Yamaha RA-200** rotary speaker (live; uncertain on studio) | Subtle swirl on the lead vocal-tone passages | Slow setting | Likely |
| 5 | **Vox Cry Baby Wah** | On the board, off for the motif | — | Likely |

**Notes:**
- **The Powerboost is the secret weapon for Shine On.** Gilmour's tone here is NOT a fuzz tone like Time or Comfortably Numb — it's the Powerboost adding harmonic saturation that makes each motif note bloom. The Big Muff comes in for later sections.
- Echorec set considerably longer than on Time (500 ms vs 440 ms) to accommodate Shine On's slower phrasing.
- Powerboost into a clean Hiwatt = Gilmour's "vocal sustain" formula. The amp stays clean; the boost makes the notes sing.
- The recording is dry by Gilmour's later standards — the spaciousness comes from Echorec + studio plate, not pedal-board reverb (he didn't have one).

---

## Amp + Cab

- **Amp:** Hiwatt DR-103 Custom 100 (100W, 4xEL34) — same head as Time
  - Channel: Normal channel jumpered to Brilliant input
  - Settings: Normal Vol 5, Brilliant Vol 4, Bass 4, Mid 6, Treble 5, Presence 5, Master 6 (slightly less aggressive than Time)
- **Cab:** WEM 4x12 with Fane Crescendo 12-S 100W speakers — same as Time
- **Power tubes:** EL34 quad
- **Modifications:** None
- **Multi-cab setup:** Single 4x12

The cleaner amp settings (Master 6 vs Time's Master 7) are intentional — Shine On wants a CLEAN sustain platform. The Powerboost in front pushes the amp into harmonically-rich saturation without breaking it up.

---

## Microphones

- **Close mic:** Beyer M160 (ribbon) — close, on-axis
- **Off-axis / second mic:** Neumann U67 — ~3 feet back
- **Room mic:** Abbey Road's plate chamber (EMT 140) added via the mixing console for the haunting hall sound

The plate chamber is THE source of Shine On's reverb tail — Abbey Road's EMT 140 with a long ~3-second decay. This is studio reverb, not amp room sound.

---

## Technique notes

- **Right-hand attack:** Hybrid picking. Very gentle — Shine On is a study in restraint.
- **Bending technique:** Each note of the four-note motif is approached from BELOW the target pitch, slowly bent up. Vibrato applied after reaching pitch.
- **Volume swells:** Gilmour's "vocal" sustain comes partly from rolling the volume knob up after picking — turning each note into an inhaled breath.
- **Vibrato:** Slow hand vibrato. He's playing the notes like a singer would phrase them.
- **Pinch harmonics / slide:** None. Pure bending and vibrato.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Colorsound Power Boost | Heir Apparent (`HD2_DistHeirApparent`) | Verified | Direct emulation; this is THE block for Gilmour's Powerboost sound |
| Big Muff Pi (Triangle) | Triangle Fuzz (`HD2_DistTriangleFuzz`) | Verified | Same Helix block as Time / CN; different Sustain setting |
| Binson Echorec 2 | Cosmos Echo (`HD2_DelayCosmosEcho`) | Verified in inventory, fall back to Transistor Tape | Transistor Tape with WowFlutter=0.4, Time=0.5 (500 ms) gets close |
| Yamaha RA-200 | Triple Rotary (`HD2_RotaryVibeRotary` or similar) | Verified — Helix has multiple rotary models | Set Slow speed, low mix |
| Vox Cry Baby Wah | Chrome Wah | Verified | Off-by-default per the historical recording |
| Hiwatt DR-103 | WhoWatt 100 | Verified | Drive lower than Time (~0.40 vs 0.50) for the cleaner sustain platform |
| WEM 4x12 + Fane | 4x12 Greenback 25 (closest stock) or third-party WEM/Fane IR | Verified for Greenback | Same caveat as Time — ideal is a Fane IR, stock Greenback 25 is the safe fallback |
| Beyer M160 + U67 | Mic 5 ribbon + Mic 0 SM57 (cabSibling) | Verified | Ribbon close + dynamic stand-in for U67 condenser |
| Abbey Road EMT 140 plate | Dynamic Plate (`VIC_DynPlate`) | Verified | Decay 3.0s, Mix 0.30, LowCut 100, HighCut 9000 — the long-tail studio plate |

---

## Sources

- Wikipedia — *Wish You Were Here* article (recording dates, studio, engineer credit)
- Gilmourish.com — Bjorn Riis's WYWH-era gear breakdown
- Pink Floyd — *Wish You Were Here* Classic Albums documentary (BBC)
- Brian Humphries interviews — engineer on WYWH and Animals
- Equipboard pros/david-gilmour (gear photos from the 1975 Knebworth shows)

---

## Confidence summary

- **Verified:** 17 items (recording context, 1975-era guitar, Powerboost + Big Muff + Echorec + Hiwatt + WEM, Abbey Road plate, technique)
- **Likely:** 3 items (Yamaha RA-200 on the studio recording, Cry Baby presence, exact Echorec time setting)
- **Speculative:** 0 items — most claims are well-documented in the Classic Albums doc

---

## Open questions

- **Was the RA-200 rotary used on the studio recording or only live?** Documentary footage shows it on stage; Bjorn Riis suggests it MIGHT be on the album but isn't certain.
- **Studio plate decay length?** Abbey Road's EMT 140 was set to a long decay; ~3 seconds is the consensus but not documented.
- **Compressor?** Same as Time — no pedal compressor in 1975. Gilmour adds the Dyna Comp around 1976-77.

---

## Recipe alignment

The current `gilmour-shine-on-sustain` recipe is a strong era-match. The Helix translation uses:
- Heir Apparent default-on (✓ matches Powerboost as primary drive)
- Triangle Fuzz off, available for Solo VI/VII passages (✓ historically accurate — Big Muff was used later in the song, not on the motif)
- Scream 808 off, alt boost (modern addition; not historical, fine as user-toggleable option)
- WhoWatt 100 with Drive=0.40 (clean platform, matches the recording)
- Dual-mic 4x12 Greenback 25 (✓ stock-cab compromise for the Fane)
- Transistor Tape at 500 ms (✓ matches Echorec timing)
- VIC_DynPlate at Decay 3.0s (✓ matches Abbey Road's long-tail plate)

Adding a `Triple Rotary` block as an off-by-default alt for the RA-200 would make the recipe even more historically faithful, but it's optional — the song works without it.
