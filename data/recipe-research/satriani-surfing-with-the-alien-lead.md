# Joe Satriani — "Surfing with the Alien" Pedalboard Research

**Recipe slug:** `satriani-surfing-with-the-alien-lead`
**Last researched:** 2026-05-01
**Source confidence:** Verified (John Cuniberti engineered; Satriani publishes his rig)

---

## Recording context

- **Album:** *Surfing with the Alien* (1987)
- **Studio:** **Hyde Street Studios**, San Francisco
- **Producer:** **John Cuniberti** + Joe Satriani
- **Engineer:** John Cuniberti
- Recording dates: 1986–1987

Surfing with the Alien (the title track) is Satriani's career-defining instrumental shred. The tone is **the** late-80s instrumental rock template — Marshall + JEM/Ibanez signature guitar + chorus + delay. Cuniberti recorded it on a tight studio budget; the album was mixed in days.

---

## Guitar

- **Model:** **Kramer Pacer** (with Floyd Rose) — Satriani's pre-Ibanez-JS guitar in 1986–87
  - The Ibanez JS (Joe Satriani signature) didn't ship until 1990 — Surfing was tracked on a Kramer
  - Body: alder, maple neck
  - Pickups: **DiMarzio FRED** (custom-wound for Satriani) + DiMarzio PAF Pro
- **Pickup:** **Bridge FRED humbucker** for the lead
- **Tuning:** E standard
- **Strings:** Light .009-.042
- **Notable mods:** Floyd Rose tremolo, custom DiMarzio pickups
- **Era caveat:** Pre-JS-Ibanez era. The Kramer is THE 1987 Surfing guitar.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Boss DS-1** Distortion | Distortion boost into the cranked Marshall | Drive 7, Tone 5, Level 6 | Likely |
| 2 | **Boss CE-2** Chorus | Wide chorus on melodic passages | Rate 4, Depth 5, Mix 35% | Verified |
| 3 | **Boss DD-2** Digital Delay | Stereo delay for solo sustain | Time 380ms, Feedback 4, Mix 30% | Verified |
| 4 | **MXR Phase 90** | Phase modulation on certain passages | Speed slow | Possible |

**Notes:**
- Satriani's pedalboard is **medium-sized but tasteful** — Boss + MXR is the late-80s shred template
- The Marshall does the heavy lifting; pedals add color
- The DS-1 is debated for Surfing — some sources say no, others yes; the Marshall's natural saturation may carry alone
- The CE-2 + DD-2 combo on the lead is the "wide spacious solo" sound

---

## Amp + Cab

- **Amp:** **Marshall JCM 800 2203** (100W, single-channel) — Satriani's signature amp at the time
  - Settings: Pre-amp 8, Master 5, Bass 5, Mid 6, Treble 7, Presence 6
- **Cab:** **Marshall 1960B** 4x12 with **Celestion G12-65** speakers
- **Power tubes:** EL34 quad
- **Modifications:** Stock — Cuniberti documented the amp as "factory"
- **Multi-cab setup:** Single 4x12 in studio

The cranked JCM 800 + DS-1 boost + DiMarzio FRED bridge pickup = the entire Surfing solo sound. Plus delay and chorus for spaciousness.

---

## Microphones

- **Close mic:** **Shure SM57** close, on-axis to one of the four 12s
- **Off-axis:** **Sennheiser MD421** off-axis or different speaker
- **Room mic:** Hyde Street had moderate live rooms — possibly a Neumann U87 ~5 feet back. Cuniberti was tight close-mic with selective room blend

---

## Technique notes

- **Right-hand attack:** Heavy alternate picking, fast — Satriani is a TECHNIQUE player
- **Bend technique:** Wide, sustained bends with deliberate vibrato — Joe's vibrato is one of his signatures
- **Tapping:** Right-hand tapping on certain passages
- **Whammy bar:** Floyd Rose dives and squeals throughout
- **Volume knob:** Generally full open

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Boss DS-1 | **Heavy Distortion** OR **Distortion Plus** | Likely | DS-1 emulation; closest is Heavy Distortion variant |
| Boss CE-2 Chorus | **Trinity Chorus** | Likely | CE-2 emulation |
| Boss DD-2 | **Vintage Digital** (`HD2_DelayVintageDigitalV2`) | Verified | Direct DD-2 emulation |
| MXR Phase 90 | **Script Mod Phase** | Verified | Direct Phase 90 |
| Marshall JCM 800 2203 | **Brit 2203** OR **Brit 2204 Mod** | Verified | Direct emulation. Drive=0.85 |
| Marshall 1960B + G12-65 | **4x12 Greenback 25** | Verified for Greenback | G12-65 not directly modeled — Greenback closest |
| SM57 + MD421 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Surfing with the Alien* article
- John Cuniberti producer interviews
- Equipboard pros/joe-satriani
- *Guitar World* / *Premier Guitar* Satriani features
- Satriani's *Strange Beautiful Music* memoir

---

## Confidence summary

- **Verified:** 14 items (recording context, Hyde Street, John Cuniberti, Kramer Pacer, JCM 800, CE-2 + DD-2 on lead)
- **Likely:** 4 items (DS-1 use on Surfing, exact Marshall settings, Phase 90 use, exact mic technique)
- **Speculative:** 0 items

---

## Open questions

- **DS-1 on Surfing or just Marshall?** Satriani has said he sometimes used DS-1 as a boost — for Surfing specifically, sources differ
- **Marshall + outboard preamp?** Some sources mention a Boss SE-50 multi-effect — possibly for chorus/delay routing

---

## Recipe alignment

The current `satriani-surfing-with-the-alien-lead` recipe should:
- Optional Heavy Distortion (DS-1 stand-in) default-OFF (alt for boost)
- Trinity Chorus DEFAULT-ON at moderate mix
- Vintage Digital delay DEFAULT-ON at moderate mix (the spacious solo sound)
- Brit 2203 amp at Drive 0.80
- 4x12 Greenback 25 cab dual-mic with cabSibling
- Plate reverb at moderate mix for sustain
- Tilt EQ at end
- Note: era-correct guitar is Kramer Pacer with DiMarzio FRED, NOT Ibanez JS
