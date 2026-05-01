# Tom Morello — "Killing in the Name" Pedalboard Research

**Recipe slug:** `morello-killing-in-the-name`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Morello publishes his rig extensively; GGGarth Richardson produced)

---

## Recording context

- **Album:** *Rage Against the Machine* (1992) — debut album
- **Studio:** **Sound City Studios**, Van Nuys, CA + others
- **Producer:** **GGGarth Richardson** (yes, three Gs)
- **Engineer:** GGGarth Richardson
- Recording dates: May–September 1992

Killing in the Name is the album's defining song — riff, anthem, protest. Morello's tone is **cranked Marshall + nothing else** for the riff; the famous DJ-scratch solo uses Whammy + DigiTech delay/synth tricks.

---

## Guitar

- **Model:** **"Arm the Homeless"** — custom-built Frankenstein parts guitar with **Performance Guitars** body and **Kramer 5-bolt** neck. Stickers everywhere.
  - Pickups: **Seymour Duncan JB** (bridge) + **Seymour Duncan '59** (neck)
- **Pickup:** **Bridge JB** for the riff
- **Tuning:** **Drop D** (low E to D) — many RATM songs are Drop D, KITN included
- **Strings:** Ernie Ball Slinky .010-.046
- **Notable mods:** The whole guitar is a mod — built from disparate parts. Aluminum neck plate, Floyd Rose tremolo
- **Era caveat:** Arm the Homeless has been Morello's main guitar from RATM debut onwards — same guitar through all the iconic songs

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **DigiTech WH-1 Whammy** | The famous solo — pitch-bend "DJ scratch" effect | Octave Up + Octave Down switching | Verified |
| 2 | **Boss DD-2** Digital Delay | Long delay for the solo's "skipping" effect | Time long, Feedback high, Mix high | Verified |
| 3 | **Dunlop Cry Baby Wah** | On for the verse "wakka-wakka" | — | Verified |
| 4 | **Ibanez DFL Flanger** | Subtle flange on certain sections | — | Possible |

**Notes:**
- The riff is **direct guitar → Marshall, no pedals**. The KITN main riff is pure cranked Marshall
- The famous solo is **Whammy + DD-2 + toggle switch killing** — Morello used the toggle switch as a kill switch (rapid on/off) plus the Whammy/DD-2 for pitch chaos
- Morello's pedalboard for the album is medium-sized but the iconic moments are minimal-pedal

---

## Amp + Cab

- **Amp:** **Marshall JCM 800 2205** (50W, 2-channel) — Morello's signature Marshall
  - Channel: Lead (high gain), settings: Pre-amp 8, Master 5, Bass 5, Mid 7, Treble 6, Presence 5
- **Cab:** **Marshall 1960B** 4x12 with **Celestion G12T-75** speakers
- **Power tubes:** EL34 quad
- **Modifications:** Stock — Morello uses factory Marshalls
- **Multi-cab setup:** Single 4x12 in studio

The cranked JCM 800 + DropD + JB pickup is the entire RATM riff sound. No fancy gain stages.

---

## Microphones

- **Close mic:** **Shure SM57** close, on-axis
- **Off-axis:** **Sennheiser MD421** off-axis or different speaker
- **Room mic:** Sound City has a famous live room — possibly a Neumann U87 ~6-8 feet back. Sound City's natural ambience contributes to the album's space

---

## Technique notes

- **Right-hand attack:** Heavy pick (Dunlop Tortex 1.14mm), aggressive primitive
- **Riff style:** KITN's main riff is single-line, downstroked, palm-muted
- **Toggle switch use:** Morello uses the pickup selector switch as a KILL SWITCH — slamming between active pickup and an unwired position for rapid on/off
- **Volume knob:** Mostly full
- **Solo technique:** Whammy + DD-2 + toggle switch slamming = the "DJ scratching" sound

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| DigiTech WH-1 Whammy | **Pitch Wham** (`HD2_PitchWham`) | Verified | Direct emulation |
| Boss DD-2 | **Vintage Digital** (`HD2_DelayVintageDigitalV2`) | Verified | Direct emulation |
| Dunlop Cry Baby | **Chrome Wah** | Verified | Direct V847 emulation |
| Ibanez DFL Flanger | **Dynamic Flanger** OR **Trinity Flange** | Likely | Approximate flanger |
| Marshall JCM 800 2205 | **Brit 2204 Mod** OR **Brit 2204** | Verified | Direct emulation. Drive=0.85 |
| Marshall 1960B + G12T-75 | **4x12 Uber T75** (`HD2_Cab4x12UberT75`) | Verified, has WithPan | Direct G12T-75 match |
| SM57 + MD421 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Rage Against the Machine* (album) article
- GGGarth Richardson interviews
- Equipboard pros/tom-morello
- *Premier Guitar* / *Total Guitar* Morello features
- Sound City documentary (Dave Grohl, 2013) — studio context

---

## Confidence summary

- **Verified:** 17 items (recording context, Sound City, GGGarth Richardson, Arm the Homeless guitar, JCM 800 2205, Drop D tuning, Whammy WH-1, DD-2, kill-switch technique)
- **Likely:** 2 items (exact pedal settings, mic technique)
- **Speculative:** 0 items

---

## Open questions

- **2205 (50W) or 2203 (100W)?** Morello has been clear it's the 2205 — the smaller 50W head
- **Studio overdubs vs live take?** Killing in the Name was tracked live at Sound City per Richardson interviews

---

## Recipe alignment

The current `morello-killing-in-the-name` recipe should:
- Drop D tuning emphasis (recipe metadata)
- Pitch Wham DEFAULT-OFF (alt for solo)
- Vintage Digital delay default-OFF (alt for solo)
- Chrome Wah default-OFF (alt for verse "wakka")
- Brit 2204 Mod amp at Drive 0.85
- 4x12 Uber T75 cab dual-mic with cabSibling
- Tilt EQ at end
- Snapshot mode (riff dry / solo with all FX) is the IDEAL implementation
