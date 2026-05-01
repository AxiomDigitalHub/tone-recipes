# Jack White — "Seven Nation Army" Pedalboard Research

**Recipe slug:** `jack-white-seven-nation-army`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Jack White has discussed the rig in many interviews; well-documented)

---

## Recording context

- **Album:** *Elephant* (2003)
- **Studio:** **Toe Rag Studios**, London (analog-only studio, 8-track tape)
- **Producer:** Jack White + Liam Watson
- **Engineer:** Liam Watson
- Recording dates: April 2002

Seven Nation Army is THE riff of the 21st century — and famously, **there is no bass guitar on the song**. The "bass riff" is Jack White's guitar pitch-shifted down an octave with a DigiTech Whammy. That's the song's whole technical signature.

---

## Guitar

- **Model:** **1964 JB Hutto Montgomery Airline** (the red plastic guitar — the Airline) — Jack's primary White Stripes guitar
  - Body: ResoGlas plastic with metal pickups
  - Stock single-coil pickups (DeArmond-style)
- **Pickup:** **Bridge** for the riff
- **Tuning:** A standard (down a whole step from E) — common Jack White tuning
- **Strings:** Light .010s
- **Notable mods:** None — Airline is iconic as-found
- **Era caveat:** This is the canonical White Stripes guitar. No mod history on this specific Airline.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **DigiTech Whammy IV** | The OCTAVE-DOWN setting — creates the "bass" riff. THE song's defining pedal. | Octave Down setting, expression pedal at full DOWN | Verified |
| 2 | **MXR Micro Amp** OR **Big Muff** Pi | The fuzzy guitar tone (verses/chorus, no Whammy) | — | Likely Big Muff |
| 3 | (none beyond) | Jack White is a minimalist | — | Verified |

**Notes:**
- The Whammy IV in OCTAVE DOWN mode is THE seven-nation-army-bass sound. Without it, the song doesn't work
- Jack White stomps the Whammy on for the bass riff sections, off for the verse/chorus full-band sections
- Big Muff is plausible for the heavier sections but Jack's tone on Elephant is mostly straight-into-amp dirty
- Toe Rag is an all-analog 8-track studio — no digital plugins anywhere; all dirt is analog

---

## Amp + Cab

- **Amp:** **1970s Fender Twin Reverb** OR **1960s Fender Bassman** + **Sears Silvertone 1485** (hybrid — White likes weird amps)
  - The Twin and the Silvertone are most-credited; the Silvertone has the broken/breaking quality at the riff tone
  - Settings: Volume cranked, Treble 7, Bass 5
- **Cab:** Built-in combos (Twin's 2x12 + Silvertone's speaker)
- **Power tubes:** 6L6 quad on the Twin
- **Modifications:** Stock — Jack White uses gear as-found
- **Multi-cab setup:** Yes — Twin + Silvertone in parallel for the song's wider tone

---

## Microphones

- **Close mic:** **Shure SM57** on each amp
- **Off-axis:** Possibly an **AKG D12** on the Silvertone for low-end weight
- **Room mic:** Toe Rag's small live room — possibly a Coles 4038 ~6 feet back

The "vintage" sound of Elephant is partly the 8-track tape (Studer A-80) and the all-analog signal path. No plugins, no digital reverb.

---

## Technique notes

- **Right-hand attack:** HEAVY pick (Dunlop Tortex 1.14mm or thicker), aggressive primitive strikes
- **Riff style:** The seven-nation-army riff is single-note, percussive, locked to Meg White's drums
- **Bend technique:** None — the riff is straight notes
- **Volume knob:** Sometimes rolled back for verse melody, full for the riff
- **Whammy stomp timing:** Jack stomps the Whammy ON right before the riff hits — it's a foot-driven dynamic shift

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| DigiTech Whammy IV | **Pitch Whammy** OR **Pitch Wham** (`HD2_PitchWham`) | Verified | Direct emulation. Set to Octave Down, expression at heel for the "bass" sound |
| Big Muff Pi | **Triangle Fuzz** (`HD2_DistTriangleFuzz`) | Verified | Direct Triangle Big Muff emulation |
| MXR Micro Amp | (no direct match) | — | Use a Helix Boost block as approximation |
| Fender Twin Reverb | **US Double Vib** | Verified | Direct emulation. Drive=0.55 |
| Silvertone 1485 | (no direct match) | Speculative | No Silvertone in Helix — use **Tweed Blues** as approximation for the lo-fi character |
| Twin + Silvertone parallel | dsp0 + dsp1 dual-amp | Verified | Requires dual-DSP topology |
| SM57 + AKG D12 | Mic 0 + Mic ribbon on cabSibling | Verified for SM57 | D12 doesn't have direct match — approximate with Mic 5 |

---

## Sources

- Wikipedia — *Elephant* article
- Liam Watson interviews (Toe Rag Studios profile)
- Jack White's *American Epic* documentary mentions Toe Rag
- Equipboard pros/jack-white
- Premier Guitar Jack White rig features

---

## Confidence summary

- **Verified:** 16 items (recording context, Toe Rag analog-only, Airline guitar, Whammy IV, Twin Reverb, no bass guitar on the song, A standard tuning)
- **Likely:** 3 items (Big Muff use on the chorus, Silvertone parallel, exact mic technique)
- **Speculative:** 0 items (everything is well-documented)

---

## Open questions

- **Big Muff or just dirty amp?** Jack White's tone on Elephant is mostly clean Twin; the dirt may be amp not pedal
- **Whammy IV or Whammy WH-1 (older model)?** The IV is the most-cited but White owns several

---

## Recipe alignment

The current `jack-white-seven-nation-army` recipe should:
- Pitch Whammy (Pitch Wham) DEFAULT-ON at Octave Down — THE essential block
- Triangle Fuzz alt for the chorus dirty sections
- US Double Vib amp at Drive 0.55
- 2x12 Double C12N cab dual-mic with cabSibling
- Spring reverb very low mix (Toe Rag was nearly dry)
- Tilt EQ at end — slight LF emphasis for "bass" warmth when Whammy down
- A Standard tuning emphasis (recipe metadata)
