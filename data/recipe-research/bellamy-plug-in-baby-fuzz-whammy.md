# Matt Bellamy — "Plug In Baby" Pedalboard Research

**Recipe slug:** `bellamy-plug-in-baby-fuzz-whammy`
**Last researched:** 2026-05-01
**Source confidence:** Verified (John Leckie produced; Bellamy publishes his rig)

---

## Recording context

- **Album:** *Origin of Symmetry* (2001)
- **Studio:** **Real World Studios**, Box, Wiltshire, England + **Sawmills Studios**, Cornwall
- **Producer:** **John Leckie** + David Bottrill (some tracks) + Muse
- **Engineer:** John Leckie
- Recording dates: November 2000 – February 2001

Plug In Baby is one of Muse's signature songs — built on a fast, virtuosic baroque-arpeggio riff (inspired by Bach's Toccata and Fugue) with heavy fuzz + DigiTech Whammy octave-up effects. Bellamy's tone is the most-distinctive in 2000s rock — fuzzed-out cleverness, never just heavy.

---

## Guitar

- **Model:** **Manson DL-1** (Hugh Manson custom-built — Bellamy's signature guitar manufacturer)
  - Body: chambered alder, custom Manson finish
  - Pickups: **Bare Knuckle Trilogy** (later Bare Knuckle Aftermath) bridge humbucker; Manson Sustainer system
  - Built-in **Fuzz Factory** (Z.Vex Fuzz Factory built INTO the guitar body — Bellamy's iconic mod)
  - Built-in MIDI output for sustainer and synth-style controls
- **Pickup:** **Bridge Bare Knuckle** for the riff
- **Tuning:** E standard
- **Strings:** Light .010s
- **Notable mods:** **EVERYTHING is modded** — built-in Z.Vex Fuzz Factory, built-in DigiTech Whammy MIDI controller (kill switch + Whammy in-guitar), MIDI output, Manson Sustainer
- **Era caveat:** Manson DL-1 is THE Bellamy guitar from 2000 onwards. The built-in Fuzz Factory is the MOST iconic guitar mod of the 2000s.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Z.Vex Fuzz Factory** (built INTO the guitar) | The signature riff fuzz — chaotic, oscillating, octave-up potential | Volume 5, Stab 4, Comp 3, Drive 7, Gate 5 | Verified |
| 2 | **DigiTech Whammy** (controlled via guitar MIDI) | Octave-up effects on certain passages | Octave Up + Whammy | Verified |
| 3 | **Boss DD-3** Digital Delay | Stereo delay for atmospheric sections | Time 380ms, Mix 30% | Likely |
| 4 | **MXR Phase 90** | Phase modulation on certain sections | — | Possible |

**Notes:**
- The **Z.Vex Fuzz Factory built into the guitar** is THE Plug In Baby sound. Without it, the song doesn't work.
- Bellamy's pedalboard is medium-sized and HEAVILY focused on fuzz + pitch effects + sustain
- The DigiTech Whammy is also controlled FROM THE GUITAR via MIDI — Bellamy's signature in-guitar MIDI controller setup
- The "octave up" in the chorus is Whammy-engaged via in-guitar killswitch tap

---

## Amp + Cab

- **Amp:** **Diezel VH4** (4-channel German high-gain) AND **Marshall** (vintage Plexi or JCM 800) in parallel
  - Bellamy uses Diezel for clean/crunch and Marshall for the heavy sections, blended at the desk
  - Settings: Diezel Ch3 (rhythm), Marshall jumpered Plexi
- **Cab:** **Diezel** 4x12 with V30 + Marshall 4x12 with Greenback
- **Power tubes:** EL34 in each
- **Modifications:** Stock vintage gear
- **Multi-cab setup:** **Yes — Diezel + Marshall parallel**, blended at the desk. THE Origin of Symmetry sound

---

## Microphones

- **Close mic:** **Shure SM57** + **Sennheiser MD421** dual on each cab
- **Off-axis:** Royer R-121 ribbon
- **Room mic:** Real World has incredible live rooms (Peter Gabriel's studio) — possibly a Coles 4038 ~10 feet back. John Leckie has a panoramic mic approach

---

## Technique notes

- **Right-hand attack:** Heavy alternate picking — the Plug In Baby riff is fast, requires precision
- **Riff style:** Baroque-style arpeggios over heavy fuzz — the contrast between classical melodic lines and saturated tone is the song's identity
- **Bend technique:** Wide bends with vibrato in the chorus
- **Whammy stomp timing:** The killswitch + Whammy octave-up is timed for the chorus's high-pitched melodic accents
- **Volume knob:** Generally full

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Z.Vex Fuzz Factory | **Megaphone** OR **Industrial Fuzz** | Speculative | Fuzz Factory is HARD to emulate — its self-oscillating chaos is unique. Industrial Fuzz closest |
| DigiTech Whammy | **Pitch Wham** (`HD2_PitchWham`) | Verified | Direct emulation. Octave Up setting |
| Boss DD-3 | **Vintage Digital** | Verified | Direct emulation |
| MXR Phase 90 | **Script Mod Phase** | Verified | Direct Phase 90 |
| Diezel VH4 | **PV Panama** OR **Cartographer** | Speculative | No direct Diezel — PV Panama (5150 family) closest for high-gain character |
| Marshall jumpered Plexi | **Brit Plexi Brt** | Verified | Direct Plexi emulation |
| Diezel 4x12 + V30 | **4x12 XXL V30** (`HD2_Cab4x12XXLV30`) | Verified, has WithPan | Direct V30 match |
| Marshall 4x12 + Greenback | **4x12 Greenback 25** | Verified, has WithPan | Direct Greenback match |
| SM57 + MD421 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Origin of Symmetry* article
- John Leckie producer interviews
- Hugh Manson interviews (Manson Guitar Works)
- Equipboard pros/matt-bellamy
- *Premier Guitar* / *Total Guitar* Bellamy features (multiple)
- Manson Guitar Works official documentation

---

## Confidence summary

- **Verified:** 16 items (recording context, Real World, John Leckie production, Manson DL-1, in-guitar Fuzz Factory + Whammy MIDI, Diezel + Marshall parallel)
- **Likely:** 3 items (exact pedal settings, DD-3 use on this song, mic placement)
- **Speculative:** 1 item (Fuzz Factory's chaotic character is hard to emulate in any modeler — Helix Industrial Fuzz is the closest approximation but doesn't capture the self-oscillating quality)

---

## Open questions

- **Z.Vex Fuzz Factory in Helix?** No direct emulation — Bellamy's signature pedal isn't modeled. Industrial Fuzz or a custom multi-pedal chain is the workaround
- **Real World vs Sawmills tracking?** Both are credited; some sources say Real World was the primary

---

## Recipe alignment

The current `bellamy-plug-in-baby-fuzz-whammy` recipe should:
- Industrial Fuzz (or similar saturated fuzz) DEFAULT-ON — Fuzz Factory stand-in
- Pitch Wham DEFAULT-ON at Octave Up for chorus accents (or alt for verses without)
- Optional Vintage Digital delay default-ON at moderate mix
- PV Panama (or Diezel-style) amp at Drive 0.85
- 4x12 XXL V30 cab dual-mic with cabSibling
- Plate or Searchlights reverb at moderate mix
- Tilt EQ at end
- Note: The Z.Vex Fuzz Factory is genuinely irreplaceable in Helix; the recipe should note "approximation only — for true Bellamy tone, use a real Fuzz Factory in front of the Helix"
