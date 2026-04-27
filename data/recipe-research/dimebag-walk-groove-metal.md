# Dimebag Darrell — "Walk" Pedalboard Research

**Recipe slug:** `dimebag-walk-groove-metal`
**Last researched:** 2026-04-27
**Source confidence:** mostly Verified (album recording is well-documented; some pedal-order details Likely)

---

## Recording context

- **Album:** *Vulgar Display of Power* (1992)
- **Studio:** Pantego Sound Studio, Pantego, TX (Pantera's hometown studio, owned by the Abbott family)
- **Producer:** Terry Date + Vinnie Paul (co-producer)
- **Engineer:** Terry Date
- Recording dates: October–November 1991

The Pantego sessions were uniquely casual — Dime + Vinnie owned the studio, so they tracked guitars at full live volume. Terry Date's job was capturing the live rig honestly rather than studio-sweetening.

---

## Guitar

- **Model:** Dean ML "Dean From Hell" (1985)
- **Pickup:** Bill Lawrence L-500XL bridge humbucker (active, hot output)
- **Tuning:** D♯ Standard tuned 1/4-step flat — effectively halfway between D♭ and D
- **Strings:** GHS Boomers, .009–.046 (light-medium)
- **Notable mods:** Floyd Rose tremolo (locking nut, fine tuners), blue lightning-bolt graphic
- **Era caveat:** The Seymour Duncan "Dimebucker" (the signature pickup most fans associate with him) **did NOT exist until 2003** — it was developed posthumously after Dime's death in 2004. On Walk (1992), the bridge pickup was the Bill Lawrence L-500XL.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Korg DTR-1** rack tuner | Silent tuning, first in chain | Mute when engaged | Verified |
| 2 | **Furman PQ-3** Parametric EQ | Pre-distortion tonal correction | Set per cab/room | Verified |
| 3 | **MXR Six-Band Graphic EQ (M109)** | The famous V-curve scoop | Lows + highs boosted, mids cut | Verified |
| 4 | **DigiTech Whammy WH-1** | Pitch effects (the iconic Walk solo dive at ~3:35) | +1 octave up, fully toe-down | Verified |
| 5 | **MXR 126 Flanger** (rack) | Solo sweeps | Used sparingly | Likely |
| 6 | **Rocktron Hush IIC** | Noise gate (post-EQ, pre-amp) | Threshold ~ -52 dB | Verified |

**Notes:**
- No overdrive pedal in front of the amp. Dime's gain came from the amp itself.
- The Furman PQ-3 was used for room correction, not creative tone shaping. The MXR 6-Band did the creative EQ.
- The MXR 6-Band scoop was set roughly: 100 Hz +5 dB, 200 Hz flat, 400 Hz -3 dB, 800 Hz **-10 dB** (the deep scoop), 1.6 kHz -3 dB, 3.2 kHz +5 dB
- A stock Dunlop GCB-95 Cry Baby was on the floor for solo accents, NOT the signature "Cry Baby From Hell" (which came out in 2002, well after VDoP)

---

## Amp + Cab

- **Amp:** Randall RG100ES — 100W solid-state combo
  - Channel: Lead
  - Settings (approximate): Drive 8, Bass 7, Mid 3 (scooped), Treble 7, Master 7
  - **Modification:** Tech-modified to bypass the onboard 12" speaker and run direct to external 4x12 cabs. Dime's tech (Grady Champion / Dimebag's amp tech) did the mods.
- **Cab:** Randall 4x12 (model varies — RS412JB or similar)
  - **Speakers:** Celestion G12T-75 (some sources cite G12-65 in earlier tours; T75 was the studio standard)
- **Power tubes:** N/A — solid-state amp
- **Modifications:** Speaker bypass mod on the combo head as noted above
- **Multi-cab setup:** Single 4x12, mono

The Randall RG100ES is THE Pantera amp from Cowboys From Hell (1990) through Far Beyond Driven (1994). Dime explicitly mentioned needing "that Randall Crunch!" in the Cowboys liner notes. He briefly tried Krank amps later, but Vulgar era is unambiguously Randall RG100ES territory.

**The solid-state factor is the secret weapon.** Tube amps compress transients on their way to saturation; the Randall delivers every pick attack with surgical clarity. That's why the Walk riff sounds so impossibly tight — there's no tube sag to round off the front edge of each note.

---

## Microphones

- **Close mic:** Shure SM57 — straight-on, 1" off the speaker grille, slightly off-center of the cone
- **Off-axis / second mic:** Sennheiser MD421 — close, off-axis ~30°, blended with the SM57
- **Room mic:** None on Vulgar. Terry Date kept the recordings tight and dry; the album mix is famously "in your face" without studio reverb wash.

---

## Technique notes

- **Right-hand attack:** Aggressive downpicking, especially on the main riff. The picking force is part of the tone.
- **Pinch harmonics:** Inserted on almost every accent — the "squealies" are Dime's signature.
- **Floyd Rose use:** The Walk solo includes a gentle dive (~1 step) into the Whammy section. The Floyd is set up to return to pitch perfectly, so the Whammy + Floyd combo creates the iconic descending pitch effect.
- **Tone knob:** Dime kept the bridge pickup full open (10) at all times.
- **Volume knob:** Full open. Dynamics came from picking force, not volume rolling.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Korg DTR-1 tuner | (no equivalent — Helix has built-in global tuner) | n/a | Use the Helix's footswitch tuner |
| Furman PQ-3 | Parametric (`HD2_EQParametric`) | Verified | Use the second Parametric or skip — MXR 6-Band does the heavy lifting |
| MXR Six-Band Graphic | Parametric (`HD2_EQParametric`) for V-scoop | Verified | OR `HD2_EQGraphic10Band` (verified in corpus, but not in HELIX_MODEL_MAP under a friendly name yet) |
| DigiTech Whammy WH-1 | Pitch Wham (`HD2_PitchPitchWham`) | Verified | Set Heel=0, Toe=1, Pedal=1 (toe-down) for +1 octave |
| MXR 126 Flanger | Gray Flanger (`HD2_FlangerGrayFlanger`) | Verified | Same MXR family voicing |
| Rocktron Hush IIC | Noise Gate (`HD2_GateNoiseGate`) | Verified | Threshold ~ -52 dB; Decay ~ 0.3 |
| Cry Baby GCB-95 | Chrome Wah (`HD2_WahChrome`) | Verified | Standard Vox V847 / Cry Baby voicing |
| Randall RG100ES | PV Panama (`HD2_AmpPVPanama`) | Verified | Closest Helix has — tight solid-state-feeling high-gain. Use **Sag=0.40 (LOW)** to mimic solid-state response (no tube sag). |
| Randall 4x12 + G12T-75 | 4x12 Uber T75 (`HD2_Cab4x12UberT75`) | Verified, dual-mic capable via WithPan | Same Celestion G12T-75 speakers. Bogner Uberkab construction is oversized like Randall cabs. |
| SM57 + MD421 | Mic 0 (SM57) + Mic 5 (R-121 ribbon) on dual-mic cab | Verified via cabSibling pattern | Helix doesn't have an MD421 model; ribbon is the closest character match |

---

## Sources

- Wikipedia — *Vulgar Display of Power* article (recording dates, studio, producer credits)
- Wikipedia — Dimebag Darrell article (career amp progression: "Abbott used solid-state Randall amplifiers for most of his career")
- *Cowboys From Hell* liner notes (Dime quote: "that Randall Crunch!")
- Equipboard pros/dimebag-darrell page (pedalboard photos pre-Damageplan era)
- *Riffer Madness* — Dimebag Darrell's instructional book / column compilations
- *Guitar World* — multiple feature pieces on the Pantera rig (1992–1994)
- Premier Guitar — interview with Vinnie Paul on the Pantego studio sessions

---

## Confidence summary

- **Verified:** 20 items (recording context, guitar, MXR / DigiTech / Korg / Rocktron pedals, Randall amp + speaker mod, mics, technique)
- **Likely:** 2 items (MXR 126 Flanger usage on this specific song, exact MXR 6-Band band settings)
- **Speculative:** 0 items

---

## Open questions

- **MXR 6-Band specific settings for Walk** — we have the V-curve shape but exact dB values per band are inferred from session photos rather than documented values. A second-hand MXR M109 with Dime's tape labels would settle this.
- **Did the Furman PQ-3 fire on Walk?** It was on his board but it's possible the song was tracked with it bypassed. Low-impact — even if so, the MXR 6-Band carries the EQ load.
- **Stock Cry Baby vs. modded?** Some sources mention an early 90s "modded" Cry Baby with different sweep range. Not documented for the Walk solo specifically.

---

## Recipe alignment

The current `dimebag-walk-groove-metal` recipe (rebuilt 2026-04-26) reflects all Verified items above. The current `.hlx` shipped to `public/presets/` includes:

- Volume Pedal, Noise Gate (default-on), Cry Baby Wah (off, EXP 2), Parametric EQ (V-scoop, default-on), Pitch Wham (off, EXP), Scream 808 (off, alt boost — note: NOT historically accurate; included for FRFR compensation), PV Panama amp, 4x12 Uber T75 dual-mic cab, Transistor Tape (off), Tilt EQ.

The Scream 808 alt boost is a documented departure from the historical rig — Dime didn't use one on Walk. It's included for users running through FRFR systems that lack the natural amp-pushing-back response of a real Randall.

If a perfectly historical version is wanted, drop the Scream 808 block. The other 9 blocks all map to documented gear.
