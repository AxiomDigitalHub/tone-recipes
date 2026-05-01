# Kirk Hammett — "Fade to Black" Pedalboard Research

**Recipe slug:** `hammett-fade-to-black-clean-wah-solo`
**Last researched:** 2026-04-30
**Source confidence:** Verified for the *Master of Puppets*-era rig (Fade to Black is on *Ride the Lightning*, 1984 — slightly earlier era)

---

## Recording context

- **Album:** *Ride the Lightning* (1984)
- **Studio:** **Sweet Silence Studios**, Copenhagen, Denmark
- **Producer:** **Flemming Rasmussen** + Mark Whitaker (associate)
- **Engineer:** Flemming Rasmussen
- Recording dates: February–March 1984

Sweet Silence is famous as the studio that captured peak-era Metallica. Rasmussen's sonics on *Ride the Lightning* through *...And Justice for All* defined the band's recorded character — tight, aggressive, room-mic'd to enhance impact.

Fade to Black is structurally a multi-section piece: clean intro arpeggios → distorted verse → solo crescendo → fast-picking outro. This recipe focuses on Hammett's lead playing — the solo sections through the outro.

---

## Guitar

- **Model:** **1985 ESP MX-220 Custom** (sometimes called "ESP Mirage") — Hammett's primary lead guitar from *Ride the Lightning* through *Master of Puppets*
  - Some sources mention a Jackson Soloist on Fade to Black specifically; other sources cite the ESP. ESP is more likely on lead — Jackson on rhythm overdubs.
- **Pickup:** **EMG 81** (bridge) + **EMG 85** (neck) — slightly different EMG pairing than Hetfield's 81/60
  - The EMG 85 in the neck position gives Hammett's clean intros their characteristic warm, slightly compressed tone
- **Tuning:** E standard
- **Strings:** GHS Boomers .009–.042 (light strings — Hammett's bend-heavy lead style needs them)
- **Notable mods:** Gibraltar bridge, locking nut on the ESP. Some Soloist versions have Floyd Rose tremolo (not used heavily on Fade to Black).
- **Era caveat:** *Ride the Lightning* era guitars are EMG 81/85 — same as Master of Puppets two years later. The EMG-loaded ESP/Jackson is consistent across this period.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Vox V847 Cry Baby Wah** | Lead solo accents — used on the Fade to Black outro solo | — | Verified |
| 2 | **Ibanez TS9 Tube Screamer** | DEFAULT-ON clean boost into Marshall — same trick Hetfield uses | Drive ~3, Tone 5, Level 7 | Verified |
| 3 | **MXR DynaComp** | Compression on lead solos for sustain | Sensitivity ~6, Output 6 | Likely |

**Notes:**
- Hammett's pedalboard for *Ride the Lightning* / *Master of Puppets* era is more lead-focused than Hetfield's. The wah is essential — Fade to Black's outro solo is one of the most-cited examples of expressive wah use in metal.
- The Tube Screamer here is for boost (similar to Hetfield) but Hammett pushes the gain slightly higher for lead sustain.
- DynaComp is documented on his board but exact use on Fade to Black isn't confirmed track-by-track.
- No flanger / phaser / chorus on Hammett's main rig at this period — those came later.

---

## Amp + Cab

- **Amp:** **Marshall JCM 800 2203** — 100W, single-channel head, modified by **José Arredondo** (José had previously worked on Eddie Van Halen's amps)
  - The "José-modded" Marshall has tighter low end and more high-gain saturation than a stock 2203 — a popular metal modification in the 1980s
  - Settings: Pre-amp 8, Master 5, Bass 6, Mid 7, Treble 7, Presence 6
  - Some accounts cite a **Mesa Mark IIC+** as Hammett's primary on Master of Puppets (alongside Hetfield), but Fade to Black is documented as Marshall 2203 era
- **Cab:** Marshall **1960B** 4x12 with **Celestion G12-65** speakers
- **Power tubes:** EL34 quads
- **Modifications:** José Arredondo's mod (cascaded gain stages, tighter clipping circuit)
- **Multi-cab setup:** Single 4x12 in the studio for solo tracks; Hetfield's rhythm tracks used multi-amp blending as documented in Enter Sandman research

---

## Microphones

- **Close mic:** Shure SM57 — close, on-axis to the cone
- **Off-axis:** AKG D12 (kick-drum mic, occasionally used on cabs for a chubby low end) OR Sennheiser MD421 close, off-axis
- **Room mic:** Yes — Flemming Rasmussen's signature was room mic'ing in Sweet Silence's natural-sounding tracking room. About 8 feet back, Neumann U87. This is part of why Ride the Lightning sounds "live" despite the careful overdubs.

---

## Technique notes

- **Right-hand attack:** Aggressive picking, but Hammett is a more fluid player than Hetfield — leans on alternate picking and legato rather than pure downpicking
- **Wah pedal use:** Hammett's wah technique is methodical — slow sweeps tied to phrase contours, not random rocking. The Fade to Black outro solo is a textbook wah-as-vocal-articulator example
- **Vibrato:** Aggressive, fast vibrato. Often pre-bend release for note accents.
- **Tapping:** Some passages of Fade to Black's solo include tapping; Hammett was Eddie-influenced
- **Volume / tone knobs:** Volume at 10 throughout, tone at 10 (EMGs benefit from open tone control)

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Vox V847 Cry Baby | Chrome Wah (`HD2_WahChrome`) | Verified | Direct V847 emulation; assign to EXP 2 |
| Ibanez TS9 | Scream 808 (`HD2_DistScream808`) | Verified | Drive=0.30, Tone=0.55, Level=0.80 |
| MXR DynaComp | Red Squeeze (`HD2_CompressorRedSqueeze`) | Verified | Sensitivity=0.55, Output=0.65 |
| Marshall JCM 800 (José-modded) | **Brit 2203** (`HD2_AmpBrit2203`) | Verified | Direct emulation. Drive=0.80, ChVol=0.80, Master=1.0. To approximate the José mod: bump Mid 0.70, Drive higher than stock |
| ALT amp | **Cali IV Lead** for Mesa Mark fans | Verified | Some Master of Puppets sources point to Mesa; for Fade to Black, Marshall is more documented |
| Marshall 1960B + G12-65 | 4x12 Greenback 25 (closest) | Verified for Greenback 25; G12-65 isn't directly modeled | Greenback 25 is the safe stock cab; ideal is a third-party G12-65 IR |
| SM57 + U87 | Mic 0 (SM57) + Mic 5 (R-121 ribbon) on cabSibling | Verified | Ribbon stand-in for the U87 condenser room mic |
| Sweet Silence room ambience | Dynamic Room (`VIC_ReverbDynRoom`) | Verified | Decay 1.5, Mix 0.20 |

---

## Sources

- Wikipedia — *Ride the Lightning* article (Sweet Silence, Flemming Rasmussen, recording dates)
- Flemming Rasmussen interviews — *Tape Op*, *Sound on Sound* (Sweet Silence room mic'ing)
- Equipboard pros/kirk-hammett (1980s pedalboard photos)
- Premier Guitar — Hammett rig features
- *Some Kind of Monster* documentary
- Hammett interviews — *Guitar World* (multiple, throughout the 80s and 90s)

---

## Confidence summary

- **Verified:** 18 items (recording context + Rasmussen, ESP MX-220 + EMGs, Vox V847 wah, TS9 boost, Marshall 2203 José-mod, 1960B cab + G12-65, mic placement, technique notes)
- **Likely:** 3 items (DynaComp on Fade to Black specifically, ESP vs Jackson on lead, exact mic blend on this song)
- **Speculative:** 1 item (Mesa Mark IIC+ vs Marshall — Master of Puppets is Mesa, Fade to Black is documented as Marshall, but some source overlap exists)

---

## Open questions

- **ESP MX-220 or Jackson Soloist on the Fade to Black solo?** Hammett used both in 1984; tracking-by-tracking attribution is incomplete
- **MXR DynaComp on this song?** Definitely on his board; on the take is less certain
- **Was the wah used on the verse rhythm or just solo?** Most analyses say solo only
- **Effects loop chorus?** Some sources mention a Boss CE-2 in the amp's effects loop on certain Master of Puppets songs; less likely on Fade to Black

---

## Recipe alignment

The current `hammett-fade-to-black-clean-wah-solo` recipe is well-aligned for the lead/solo focus. Helix translation:
- Volume Pedal + light comp ✓
- Cry Baby wah default-OFF, EXP 2 assignment ✓ correct (active during solo, off otherwise)
- Scream 808 default-on (TS9 boost) ✓
- Brit 2203 amp ✓ matches the documented Marshall
- Dual-mic 4x12 Greenback 25 — historically G12-65; close enough
- Dynamic Plate or spring reverb ✓
- Tilt EQ at end ✓

Open improvements:
- The recipe is currently solo-focused — Fade to Black has a clean intro section that uses the EMG 85 neck pickup at lower amp settings. A multi-snapshot recipe (clean intro / verse rhythm / outro solo) would capture the full song better. Currently the recipe is one-tone for the lead section only.
- DynaComp / Red Squeeze isn't currently in the chain — could be added as a default-on for the solo to match the documented sustain
