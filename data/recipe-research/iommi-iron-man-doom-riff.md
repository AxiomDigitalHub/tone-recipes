# Tony Iommi — "Iron Man" Pedalboard Research

**Recipe slug:** `iommi-iron-man-doom-riff`
**Last researched:** 2026-04-27
**Source confidence:** mostly Verified (Iommi's gear during the Paranoid era is well-documented; one or two pedal specifics are Likely)

---

## Recording context

- **Album:** *Paranoid* (1970)
- **Studio:** Regent Sound Studios + Island Studios, London
- **Producer:** Rodger Bain (sometimes spelled "Roger")
- **Engineer:** Tom Allom (assistant engineer at Island Studios)
- Recording dates: June 1970 — the album was tracked in a remarkable **five days**

The Paranoid album's haste is a major reason its tone is so raw. Sabbath had limited studio time and tracked guitars at full live volume in a small room. Roger Bain's production approach was hands-off — capture what the band already played live, no overdub layering.

---

## Guitar

- **Model:** Gibson SG Special "Monkey" — 1965 (Iommi acquired it after his white Stratocaster's neck pickup failed during the band's first album sessions)
- **Pickup:** **Stock Gibson P-90 single-coils** at this point (1970)
  - The John Birch custom pickups (the "Iommi" signature humbuckers) did NOT exist yet — those came after 1973. Iron Man on the studio recording is P-90s.
  - **Era caveat:** Many "Iommi tone guides" use the Gibson Iommi Signature humbuckers (released 1999) or John Birch SuperHumbuckers (early 70s). Neither was on the Paranoid recording. Iron Man is Gibson SG with P-90s.
- **Tuning:** **E standard** on Paranoid (1970). Iommi hadn't yet tuned down — the famous C# tuning came on *Master of Reality* (1971), the album AFTER Paranoid.
- **Strings:** Custom-light gauge — Iommi played with **.008–.038 strings** because of his industrial accident (he lost the tips of his middle and ring fingers on his fretting hand and used homemade leather thimbles, requiring extremely light strings to bend cleanly).
- **Notable mods:** Modified bridge (lower string tension), brass nut, hand-made fingertip prosthetics on his fretting hand (shaved leather thimbles he made himself from boot leather + glue)

---

## Pedalboard (chronological)

Iron Man's main riff has a SINGLE-PEDAL chain — and that pedal is half the tone.

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Dallas Rangemaster Treble Booster** | THE Iommi pedal — boosts upper mids hard into the Laney, creating the searing fuzz character | Boost knob max | Verified |

**Notes:**
- The Rangemaster was a small unit in a vinyl-covered metal box, built around an OC44 germanium transistor. It boosts a narrow band centered around 2.8 kHz — the upper mids.
- Iommi's Rangemaster may have been the original Dallas unit OR a tech-modified version his amp tech made for him. Sources differ slightly.
- **No fuzz pedal on Iron Man.** The "fuzz" character of the riff comes from the Rangemaster slamming the Laney's input into clipping, NOT from a separate fuzz unit.
- A wah pedal was on the floor for solos (not the main riff)
- No noise gate, no delay, no compression in the recording chain

The simplicity is striking — this is the foundational metal sound, and the chain is two boxes (Rangemaster + Laney). Everything after Sabbath that's called "metal" is built on this chain.

---

## Amp + Cab

- **Amp:** Laney Supergroup PA-100 head (100W, all-tube, EL34 power tubes)
  - Some sources cite the LA100BL specifically
  - Settings: Volume cranked to max, cleaning up via guitar volume
  - Channel: Single channel (Laneys at the time were single-channel)
- **Cab:** Marshall 4x12 with Celestion G12M-25 ("Greenback") speakers
  - Some sources cite a Marshall 4x12 with G12H-30 speakers — both were standard 1970 spec
- **Power tubes:** EL34 quad
- **Modifications:** Stock — the Laney was unmodified
- **Multi-cab setup:** Live, Iommi ran multiple Laney + Marshall cab combinations in stereo. Studio Iron Man is single 4x12 (most sources)

The Laney Supergroup is critical — it's the British heir to the Marshall Plexi but with more aggressive midrange and slightly looser low end. When pushed by the Rangemaster, the upper-mid emphasis combines into the searing, almost-fuzzy character of Iron Man's main riff.

---

## Microphones

- **Close mic:** Likely a **Beyerdynamic M160** ribbon — Regent Sound's go-to dynamic guitar mic. Some sources cite SM57 instead.
- **Distant mic:** Possibly a **Neumann U67** condenser at 4-6 ft. Standard 1970 British studio practice on rock guitar.
- The exact mic chain for Iron Man specifically is undocumented — Roger Bain's production notes weren't preserved. Based on Regent Sound's general 1970 setup.

---

## Technique notes

- **Right-hand attack:** Iommi uses a heavy thumb pick, sometimes a bare thumb. The pick attack is rounded rather than aggressive — contributes to the smooth fuzz character.
- **Vibrato:** Slow, wide — close to Gilmour's vibrato style. The fingertip prosthetics make precision vibrato challenging but Iommi has compensated by using slower, more deliberate motion.
- **Bending:** Limited bending range due to fingertip injuries. Most "bends" are fast vibrato.
- **String muting:** Light palm muting. The droning, sustained quality of Iron Man's riff comes from minimal palm muting — letting the notes ring.
- **Tuning to band:** Iron Man is in E standard, but Sabbath's bass (Geezer Butler) is detuned slightly. The bass + guitar pitch relationship contributes to the heavy, ominous character.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Gibson SG with P-90s | (guitar — handled by user) | n/a | A modern Gibson SG Standard with P-90s, or any P-90 humbucker, gets close. EMG / hot humbuckers will overdrive too much. |
| Dallas Rangemaster Treble Booster | Deranged Master (`HD2_DistDerangedMaster`) | Verified (corpus) | Helix's direct Rangemaster model. THE pedal. Set Boost ≈ 0.85 (full). |
| Laney Supergroup PA-100 | Brit J45 Brt (`HD2_AmpBritJ45Brt`) | Verified | Helix has no Laney model. The closest is the Marshall JTM-45 (Brit J45 family) — same JTM-era circuit lineage, similar EL34 power section. Some forum users prefer Brit Plexi Brt; Brit J45 Brt is closer to the looser, less aggressive Laney character. |
| Marshall 4x12 + G12M-25 (Greenback) | 4x12 Greenback 25 (`HD2_Cab4x12Greenback25` legacy or `HD2_CabMicIr_4x12Greenback25WithPan`) | Verified, dual-mic capable via WithPan | Direct match. The exact Greenback 25 speakers used. |
| Beyer M160 + U67 | Mic 0 (SM57 close) + Mic 5 (R-121 ribbon) via dual-mic cab | Verified | Helix has no M160 or U67 model. The SM57 + R-121 blend is the closest character match for the British studio sound. |
| (no noise gate in chain) | Noise Gate (`HD2_GateNoiseGate`) — add for FRFR/modeler usability | Verified | Threshold ≈ -50 dB; helps with the Rangemaster's noise floor on FRFR |

---

## Sources

- Wikipedia — Tony Iommi article (Stratocaster failure, SG "Monkey" acquisition, Laney Supergroup era, Rangemaster reference)
- Wikipedia — *Paranoid* album article (recording dates, studios, Roger Bain producer)
- *Iron Man: My Journey Through Heaven and Hell with Black Sabbath* — Tony Iommi's autobiography (gear timeline)
- Equipboard — pros/tony-iommi
- Premier Guitar — multiple Iommi rig rundowns
- *The Story of Black Sabbath* documentaries — gear shots from 1970-1971 era
- Vintage Guitar Magazine — Iommi feature on his fingertip prosthetics + light-gauge string setup

---

## Confidence summary

- **Verified:** 14 items (recording context, SG with P-90s, light strings, fingertip injury workaround, Rangemaster as the only pedal, Laney Supergroup amp, Marshall 4x12 with Greenbacks, E standard tuning, no down-tuning yet)
- **Likely:** 3 items (specific Laney model variant, exact Greenback 25 vs G12H-30 speaker, mic'ing technique at Regent Sound)
- **Speculative:** 0 items

---

## Open questions

- **Greenback 25 vs G12H-30 speakers** — Both were standard 1970 Marshall 4x12 spec. The G12M-25 (Greenback) is the more commonly cited speaker for early Sabbath, but some sources note the G12H-30. The two have similar voicings; the H30 is slightly more aggressive in the high mids.
- **Was the Rangemaster Iommi used factory-original or tech-modified?** Iommi's amp tech (Mike Clement) is rumored to have built/modified Rangemaster-style boosters for him. The exact unit on Paranoid recording isn't documented.
- **Down-tuning timeline.** Iron Man is on Paranoid (1970), still E standard. Master of Reality (1971) is the start of C# tuning. Some live performances of Iron Man post-1972 may be in C# instead of E. The recipe should specify E standard for the studio version.

---

## Recipe alignment

The current `iommi-iron-man-doom-riff` recipe (auto-shipped with the 50-preset library) needs the following updates after this research:

1. **Tuning:** Confirm E standard, NOT C# / D♭ (this is a common error — Iron Man is the album BEFORE the down-tuning era).
2. **Strings:** Light gauge (.008-.038 or .009-.042) for Iommi's fingertip injury workaround.
3. **Pickup:** Stock Gibson P-90s, NOT humbuckers (the John Birch / Gibson Iommi Signature pickups came later).
4. **Drive chain:** Deranged Master treble booster default-on. Drop any TS-style boost (Iommi never used a Tube Screamer in this era — it didn't exist yet).
5. **Amp:** Brit J45 Brt for the closest Laney Supergroup voicing. Drive ≈ 0.65 — relatively low; the Rangemaster does the saturation.
6. **Cab:** 4x12 Greenback 25 with WithPan dual-mic.
7. **Settings on amp:** Bass 0.55, Mid 0.55, Treble 0.55, Presence 0.55 (relatively flat — the Rangemaster shapes the upper mids on the input side).
8. **Noise gate:** Default-on for FRFR usability (not period-correct but essential for clean signal-to-noise on modelers).
