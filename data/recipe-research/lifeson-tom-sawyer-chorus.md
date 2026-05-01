# Alex Lifeson — "Tom Sawyer" Pedalboard Research

**Recipe slug:** `lifeson-tom-sawyer-chorus`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Terry Brown produced; Lifeson rig is well-documented)

---

## Recording context

- **Album:** *Moving Pictures* (1981)
- **Studio:** **Le Studio**, Morin-Heights, Quebec
- **Producer:** **Terry Brown** + Rush
- **Engineer:** Paul Northfield
- Recording dates: October 1980 – February 1981

Tom Sawyer is Rush's most-iconic song. Lifeson's rhythm tone is **dirty Hiwatt + Marshall in parallel + chorus pedal** — the classic early-80s rock-progressive sound. The synth-led arrangement gives Lifeson space; he plays minimal but iconic chord stabs.

---

## Guitar

- **Model:** **Gibson Howard Roberts Fusion** (semi-hollow with a single bridge humbucker, custom Lifeson model from late 70s)
  - OR a **Gibson Les Paul Standard** — Lifeson rotated guitars on Moving Pictures
- **Pickup:** **Bridge humbucker**
- **Tuning:** E standard
- **Strings:** Light .010s (Lifeson is a light-string player)
- **Notable mods:** Custom Bill Lawrence pickup in the Howard Roberts (replacement)
- **Era caveat:** Pre-PRS era for Lifeson. Howard Roberts Fusion + Les Paul are the Moving Pictures rotation; PRS came in the 90s.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **MXR Dyna Comp** | Light compression for sustain | Sensitivity 4, Output 6 | Likely |
| 2 | **Boss CE-1 Chorus Ensemble** | THE chorus on Tom Sawyer's clean stabs | Rate ~3, Depth medium | Verified |
| 3 | **Mu-Tron Phasor II** | Phaser for atmospheric sections | Off for Tom Sawyer rhythm | Possible |
| 4 | **Boss DD-2** Digital Delay | Subtle stereo delay | Time 380ms, Mix 25% | Likely |

**Notes:**
- The CE-1 Chorus Ensemble is THE Lifeson sound — wide, lush, thick chorus. The CE-1 is rack-style (not a stomp box) and was a studio staple
- Lifeson stomps the chorus on for clean intervals and off for the dirty riffs
- His clean-vs-dirty contrast is footswitched, not amp-channel-switched (the Marshalls didn't have channel switching at this point)

---

## Amp + Cab

- **Amp:** **Hiwatt DR504** (50W) + **Marshall JMP** in parallel — Lifeson's signature dual-amp setup
  - Hiwatt for clean clarity, Marshall for grit
  - Both cranked: Hiwatt at 7, Marshall at 6
- **Cab:** Hiwatt 4x12 (Fane speakers) + Marshall 4x12 (Greenbacks)
- **Power tubes:** EL34 quad in each amp
- **Modifications:** Stock — Lifeson uses vintage gear unmodded
- **Multi-cab setup:** **Yes — Hiwatt + Marshall parallel**, blended at the desk. THE Moving Pictures sound

---

## Microphones

- **Close mic:** **Shure SM57** + **Sennheiser MD421** dual on each cab
- **Off-axis:** Possibly a Royer R-121 ribbon
- **Room mic:** Le Studio's natural lake-side concrete room — possibly a Neumann U87 ~6 feet back

Le Studio's room sound is famous — natural reverb from the architecture is part of Moving Pictures' character.

---

## Technique notes

- **Right-hand attack:** Medium-light pick attack — Lifeson is a fluid rhythm player, not a basher
- **Chord voicings:** Lifeson uses unusual chord shapes — sus4, add9, partial-string arpeggiation — that need clarity (hence the dual-amp setup)
- **Bend technique:** Light bends, often released slowly
- **Volume knob:** Lifeson uses volume rolling for clean vs. dirty without changing pedal state
- **Picking patterns:** Mostly arpeggiated chord stabs in Tom Sawyer's verses; full strums for the chorus

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| MXR Dyna Comp | **Red Squeeze** (`HD2_DynamicsRedSqueeze`) | Verified | Direct Dyna Comp emulation |
| Boss CE-1 Chorus Ensemble | **Trinity Chorus** (`HD2_ModulationTrinityChorus`) | Verified | Closest CE-1 emulation in Helix |
| Mu-Tron Phasor II | **Script Mod Phase** | Likely | Closest phaser emulation |
| Boss DD-2 | **Vintage Digital** | Verified | Direct emulation |
| Hiwatt DR504 | (no direct match) | Speculative | No Hiwatt in Helix — closest is **Brit Plexi Brt** or **Brit J-45** for similar British clean-loud character |
| Marshall JMP | **Brit Plexi Brt** OR **Brit 2204 Mod** | Verified | Direct match |
| Hiwatt 4x12 + Fane | (no direct Fane) | Speculative | Use **4x12 Greenback 25** as approximation |
| Marshall 4x12 + Greenback | **4x12 Greenback 25** (`HD2_Cab4x12Greenback25`) | Verified, has WithPan | Direct match |
| SM57 + MD421 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Moving Pictures* article
- Terry Brown producer interviews
- Premier Guitar Lifeson rig features (multiple)
- Equipboard pros/alex-lifeson
- Lifeson interviews — *Guitar Player*, *Total Guitar*

---

## Confidence summary

- **Verified:** 14 items (recording context, Le Studio, Terry Brown, Hiwatt + Marshall parallel, CE-1 Chorus, Howard Roberts Fusion)
- **Likely:** 4 items (which exact Hiwatt model, exact pedal settings, Dyna Comp use)
- **Speculative:** 1 item (Hiwatt has no direct Helix model — Brit Plexi Brt is the closest British clean-loud)

---

## Open questions

- **Hiwatt DR504 or DR103?** Lifeson owned both; rigs documents are unclear which dominated Tom Sawyer
- **Howard Roberts Fusion or Les Paul on the album track?** Both credited

---

## Recipe alignment

The current `lifeson-tom-sawyer-chorus` recipe should:
- Trinity Chorus DEFAULT-ON (for the clean stabs) — THE essential block
- Vintage Digital delay default-on at low mix
- Optional Red Squeeze comp default-on
- Brit Plexi Brt amp at Drive 0.65
- 4x12 Greenback 25 dual-mic with cabSibling
- Tilt EQ at end
- IDEAL: dual-amp with Hiwatt-stand-in (Brit J-45) + Marshall in parallel via dsp0 + dsp1
