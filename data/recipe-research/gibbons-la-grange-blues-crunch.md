# Billy Gibbons — "La Grange" Pedalboard Research

**Recipe slug:** `gibbons-la-grange-blues-crunch`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Billy Gibbons is publicly active about gear; *Tres Hombres*-era rig is well-documented despite the album being from 1973)

---

## Recording context

- **Album:** *Tres Hombres* (1973)
- **Studio:** **Robin Hood Studios** (Tyler, TX) — a smaller regional studio
- **Producer:** Bill Ham (band manager + producer)
- **Engineer:** Robin Brians
- Recording dates: April–May 1973

*Tres Hombres* is the album that broke ZZ Top nationally — La Grange is the lead single. The recording approach was Texas-pragmatic: track the band live with minimal overdubs, mic the cabs straight, mix it tight.

The "houseband" feel of La Grange is partly a credit to the live tracking — Gibbons played the rhythm + lead in the same take, alongside Dusty Hill (bass) and Frank Beard (drums) playing in the same room.

---

## Guitar

- **Model:** **"Pearly Gates"** — 1959 Gibson Les Paul Standard
  - One of the most-famous Les Pauls in rock. Gibbons named it after a friend's car (a Pearly Gates Cadillac)
  - Body: Honduran mahogany, AAA flame maple top
  - Stock 1959-spec PAF humbuckers — these are the holy-grail pickups for blues-rock
- **Pickup:** **Bridge** PAF for the main riff and solo (the warm, woody Les Paul-into-Marshall sound)
- **Tuning:** E standard
- **Strings:** **Dunlop Reverend Willy Strings** — extremely light .007–.038 (Gibbons is a famously light-string player)
  - The light strings allow Gibbons' fingerpicking technique + 16ths to feel "loose" — heavier strings would change the feel
- **Notable mods:** None on Pearly Gates — vintage 1959 Burst, completely stock. Gibbons has been meticulous about preserving it.
- **Era caveat:** Pearly Gates from 1973 onwards has been THE Gibbons Les Paul. He's used many other Gibsons over his career (Explorers, Vs, custom builds), but for *Tres Hombres* it's Pearly Gates throughout.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Dallas Rangemaster Treble Booster** | DEFAULT-ON — THE Gibbons trick (treble booster slamming a cranked Plexi) | Boost ~8 | Verified |

**That's the entire pedalboard.** Like Brian May, Gibbons' tone secret is one effect — a treble booster pushing the Marshall into harmonic-rich saturation. The Rangemaster does NOT add gain in the conventional sense; it boosts upper frequencies into the Plexi's input, causing the amp's preamp to clip more easily on the high-frequency content. This creates the singing, harmonic-rich character of Gibbons' lead lines.

**Notes:**
- The Rangemaster for *Tres Hombres* era is documented as the original Dallas Rangemaster (1965-69 vintage) or a clone. Gibbons has owned multiple over the years.
- No fuzz, no overdrive, no boost pedals — gain is from the Marshall.
- The light strings (.007 high E) + Rangemaster + cranked Plexi combo is the harmonic-squeal recipe. Pinch harmonics ring forever with this rig.
- Some sources cite a **Vox Cry Baby Wah** on Gibbons' floor for solo accents; less certain on La Grange specifically.

---

## Amp + Cab

- **Amp:** **Marshall Super Lead 1959** — 100W head, 4×EL34
  - Channel: Hi-Treble, jumpered to the Bright channel input
  - Settings: Volume 8, Bass 5, Mid 7, Treble 6, Presence 6
- **Cab:** Marshall **1960B** 4x12
  - **Speakers:** Celestion **G12M-25 Greenback** (1973-spec)
  - The G12M-25 is THE blues-rock cab speaker. Brighter than the modern reissue Greenback; warmer than Vintage 30s.
- **Power tubes:** EL34 quad
- **Modifications:** Stock — Gibbons preferred his Marshalls factory-spec
- **Multi-cab setup:** Single 4x12 in the studio at Robin Hood. Live shows used multiple cabs for stage volume.

---

## Microphones

- **Close mic:** **Shure SM57** — close, on-axis, ~1" off the speaker
- **Off-axis:** Sometimes a Royer R-121 ribbon (anachronistic for 1973 — Royer didn't exist; Beyer M160 is more accurate for the period)
- **Room mic:** Yes — Robin Hood Studios had a workable tracking room. Engineer Robin Brians added a room mic for ambience

The mic setup at Robin Hood was relatively standard rock — close + room. The album mix is dry by post-mix standards but has natural room ambience.

---

## Technique notes

- **Right-hand attack:** Gibbons plays with **fingers + a thumb pick** sometimes, but mostly with a Tortex pick. Hybrid technique.
- **Palm muting:** Some on the rhythm verse; opens up for the choruses
- **Pinch harmonics:** Gibbons is one of the masters — the wide vibrato + pinch harmonic combination creates his signature "growl"
- **Bending:** Wide, slow, vocal bends. Gibbons' notes "talk" — they bend up to pitch, vibrato, then resolve down
- **Volume knob:** Full open. Tone knob is at 10. Light strings + Pearly Gates + Rangemaster does all the work

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Dallas Rangemaster | **Deranged Master** (`HD2_DistDerangedMaster`) | Verified | Direct emulation. Boost=0.85 = the Gibbons setting |
| (no other pedals) | n/a | n/a | Recipe should reflect this — drives off by default except Rangemaster |
| Marshall Super Lead 1959 (Plexi) | **Brit Plexi Brt** (`HD2_AmpBritPlexiBrt`) | Verified | Direct emulation. Drive=0.75 (cranked but not maxed), Mid=0.70 (above noon for Plexi honk) |
| Marshall 1960B + G12M-25 | **4x12 Greenback 25** (`HD2_Cab4x12Greenback25`) — has WithPan | Verified, dual-mic capable | Direct match. Position 0.30 (slightly off-cone) for the cone-edge bite that brings out pinch harmonics |
| SM57 + Beyer M160 | Mic 0 (SM57) + Mic 5 (R-121 ribbon) on cabSibling | Verified | Ribbon stand-in for the period-correct M160 |
| Robin Hood room | **Dynamic Room** (`VIC_ReverbDynRoom`) | Verified | Decay 1.5, Mix 0.20, or use Hot Springs for the slap-back ambience |

---

## Sources

- Wikipedia — *Tres Hombres* article (Robin Hood Studios, recording context, Bill Ham producer)
- *Rock + Roll Gearhead* (Billy F Gibbons book, 2005) — Gibbons' own gear book, definitive source
- Gibbons interviews — *Guitar World*, *Premier Guitar* (multiple decades)
- Equipboard pros/billy-gibbons (Pearly Gates documentation, Rangemaster photos)
- *Tres Hombres* liner notes (band/producer credits)

---

## Confidence summary

- **Verified:** 17 items (recording context + Robin Hood Studios, Pearly Gates Les Paul, Dallas Rangemaster default-on, Marshall Super Lead 1959 + 1960B + G12M-25, Reverend Willy light strings, mic technique)
- **Likely:** 3 items (exact Marshall settings, exact Rangemaster vintage, Cry Baby on the floor for La Grange)
- **Speculative:** 0 items

---

## Open questions

- **Was the Rangemaster the Dallas original or a clone?** Probably the original. By 1973, Gibbons had been using one for years.
- **Cry Baby on La Grange specifically?** Possibly for the solo accents, but most analyses say no wah is heard on the album take.
- **Multi-cab studio setup?** Single 4x12 is documented; some accounts mention 2 cabs in series — unclear.

---

## Recipe alignment

The current `gibbons-la-grange-blues-crunch` recipe is a strong match. Helix translation:
- Volume Pedal + light comp ✓
- Deranged Master (Rangemaster) default-on ✓ correct
- Kinky Boost + Minotaur as alt drives — modern alternatives, off by default; reasonable as user-toggleable options
- Brit Plexi Brt amp at Drive 0.75 ✓ matches the cranked 1959 Plexi
- Dual-mic 4x12 Greenback 25 ✓ matches actual 1960B + G12M-25
- Hot Springs reverb at low mix ✓ matches the Robin Hood room blend
- Tilt EQ at end ✓

The recipe captures the "Rangemaster + cranked Plexi" formula faithfully. Pinch-harmonic technique (most of the LaGrange tone) is up to the player — gear can't replicate that.
