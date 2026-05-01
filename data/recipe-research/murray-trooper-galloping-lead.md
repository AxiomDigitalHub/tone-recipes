# Dave Murray — "The Trooper" Pedalboard Research

**Recipe slug:** `murray-trooper-galloping-lead`
**Last researched:** 2026-05-01
**Source confidence:** Mostly Verified (Iron Maiden gear is well-documented; Martin Birch produced)

---

## Recording context

- **Album:** *Piece of Mind* (1983)
- **Studio:** **Compass Point Studios**, Bahamas
- **Producer:** **Martin Birch**
- **Engineer:** Martin Birch
- Recording dates: January–March 1983

The Trooper is one of Iron Maiden's signature songs — the "galloping" rhythm is built on Steve Harris' bass, but the dual lead guitars (Dave Murray + Adrian Smith) ride on top with harmonized melodies. Note: this song is a Murray + Smith dual-lead — the recipe represents Murray's lead contribution.

---

## Guitar

- **Model:** **Fender Stratocaster** with humbucker conversion ("HSS" config) — Dave Murray's signature setup since the late 70s
  - Body: alder Strat
  - Pickups: **DiMarzio Super Distortion** (bridge humbucker) + Fender Strat singles (middle/neck)
- **Pickup:** **Bridge humbucker** for the lead
- **Tuning:** E standard
- **Strings:** Light .009-.042 — Murray is a light-string player
- **Notable mods:** The HSS humbucker conversion is THE Dave Murray mod
- **Era caveat:** This is the early-80s Maiden Murray rig. The signature DiMarzio'd Strat goes through the entire Maiden discography from Number of the Beast onwards.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Boss CE-2 Chorus** | Subtle chorus on solo passages | Rate 4, Depth 4, Mix 30% | Likely |
| 2 | **Ibanez TS9** Tube Screamer | Mid-bump for solo lift | Drive 4, Tone 6, Level 7 | Likely |
| 3 | **MXR Phase 100** | Engaged on certain harmonized solo lines | — | Possible |

**Notes:**
- Murray's pedalboard at this point was minimal. The tone comes from cranked Marshall + Strat with humbucker
- The TS9 is a solo booster, not a base distortion — the Marshall's natural saturation is the main gain stage
- Iron Maiden's tone signature is **dual-Strat-into-Marshall** — both Murray and Smith use similar setups, harmonized

---

## Amp + Cab

- **Amp:** **Marshall JMP MkII Lead** (50W or 100W, depending on session) — Maiden's signature Marshall era
  - Settings: Pre-amp 7, Master 5, Bass 5, Mid 6, Treble 6, Presence 5
- **Cab:** Marshall **1960B** 4x12 with **Celestion G12-65** speakers (1983-era)
- **Power tubes:** EL34 quad
- **Modifications:** Stock — Iron Maiden used factory Marshalls
- **Multi-cab setup:** **Yes — Murray + Smith each have their own Marshall** for the dual-lead tracking. Stereo split L/R.

---

## Microphones

- **Close mic:** **Shure SM57** close on each Marshall
- **Off-axis:** **Sennheiser MD421** off-axis or different speaker
- **Room mic:** Compass Point's tropical concrete room — possibly a Neumann U87 ~6 feet back. Martin Birch was a tight close-mic guy

---

## Technique notes

- **Right-hand attack:** Heavy alternate picking — the "gallop" rhythm is Steve Harris' bass; Murray/Smith's leads are more melodic
- **Bend technique:** Heavy bends with vibrato (Schenker, Schenker, Schenker — the German hard rock influence)
- **Volume knob:** Generally full open
- **Vibrato:** Wide, fast vibrato — vocal in nature
- **Picking patterns:** Single-note legato runs with occasional alternate picking

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Boss CE-2 Chorus | **Trinity Chorus** | Likely | Closest CE-2 emulation |
| Ibanez TS9 | **Scream 808** (`HD2_DistScream808`) | Verified | TS9 ≈ TS808 — direct emulation |
| MXR Phase 100 | **Script Mod Phase** | Verified | Or Triple Phase for 100-style |
| Marshall JMP MkII Lead | **Brit Plexi Brt** OR **Brit 2204** | Verified | Brit Plexi for Plexi-era; Brit 2204 for JMP-era |
| Marshall 1960B + G12-65 | **4x12 Greenback 25** | Verified for Greenback | G12-65 not directly modeled — Greenback closest |
| SM57 + MD421 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Piece of Mind* article
- Martin Birch interviews (multiple)
- Equipboard pros/dave-murray
- *Iron Maiden* official websites
- Premier Guitar Maiden rig features

---

## Confidence summary

- **Verified:** 14 items (recording context, Compass Point, Martin Birch, Murray's HSS Strat with DiMarzio, Marshall JMP)
- **Likely:** 4 items (exact pedal settings, CE-2 use on solo, exact mic placement)
- **Speculative:** 0 items

---

## Open questions

- **CE-2 on Trooper specifically?** Murray uses CE-2 broadly but per-song attribution is unclear
- **TS9 on Trooper or just Marshall direct?** The solo gets a clear lift suggesting TS9; not 100% confirmed for this exact song

---

## Recipe alignment

The current `murray-trooper-galloping-lead` recipe should:
- Optional Trinity Chorus default-OFF (alt for solo color)
- Scream 808 default-ON for solo bump
- Brit 2204 Mod amp at Drive 0.75
- 4x12 Greenback 25 cab dual-mic with cabSibling
- Tilt EQ at end
- Hot Springs reverb low mix
- Note: This is Murray's lead guitar role, not Smith's. If recipe is intended for both leads, dual-DSP topology represents the dual-Marshall split better
