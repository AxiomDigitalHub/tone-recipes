# Eric Clapton — "Layla" Lead Pedalboard Research

**Recipe slug:** `clapton-layla-lead`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Tom Dowd's production notes + Clapton's interviews about the Derek and the Dominos sessions)

---

## Recording context

- **Album:** *Layla and Other Assorted Love Songs* (1970, Derek and the Dominos)
- **Studio:** **Criteria Studios**, Miami, FL (Studio C)
- **Producer:** **Tom Dowd** + Derek and the Dominos
- **Engineer:** Tom Dowd + Howard Albert + Ron Albert
- Recording dates: August–September 1970

The Layla sessions are legendary — Eric Clapton + Duane Allman + Derek & the Dominos jammed together at Criteria, with Tom Dowd capturing dual-guitar takes. Layla itself features both guitarists trading lead lines; the iconic main riff is Clapton, with Duane Allman's slide work layered.

This recipe focuses on Clapton's lead — the cranked Champ tone that defines the song's harmonic urgency.

---

## Guitar

- **Model:** **"Brownie"** — 1956 Fender Stratocaster, sunburst-finished, refinished in brown
  - Body: alder
  - Pre-CBS pickups (1956-spec)
  - Clapton's primary 1970 lead guitar, before he switched to "Blackie" (1973+) for most of the Layla-related touring
- **Pickup:** **Bridge + middle in parallel** (position 4) for the warm, snarling lead tone — the iconic Clapton dual-pickup blend
- **Tuning:** E standard
- **Strings:** Ernie Ball Slinky .010–.046 (Clapton was a light-string player)
- **Notable mods:** None on Brownie — vintage 1956 Strat
- **Era caveat:** "Layla" is Brownie territory, NOT "Blackie" (which is 1973 onwards). Many tutorial sources confuse these.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | (none) | — | — | Verified |

**Layla's lead has no pedals.** Clapton ran his Strat → cranked Fender Champ direct. The amp was DIMED (every knob at 10) to push the small 5W Champ into power-amp saturation. This is THE classic "small-amp-cranked-loud" recipe — beloved by Tom Petty, Mike Campbell, and many others.

The tone you hear on the album is **guitar volume + amp gain + Tom Dowd's mic technique** — no pedals.

**Notes:**
- Clapton's "Cream"-era cranked Marshall + wah rig was REPLACED for Layla. He explicitly wanted a smaller, more articulate sound.
- The cranked Champ provides natural compression + saturation that mimics what a fuzz pedal would add — but the amp is doing it.
- Tom Dowd was the producer who pushed Clapton to use the small amp. The result defined a generation of recording technique.

---

## Amp + Cab

- **Amp:** **Fender Champ** (1958 tweed model, "5F1" circuit) — 5W, single-ended Class A
  - Channel: Single (Champs only have one channel)
  - Settings: Volume 10, Tone 6
  - The Champ is **dimed** — every knob at maximum. The resulting natural overdrive is the entire Layla lead tone.
- **Cab:** Champ's built-in **1x8 speaker** (Jensen 8" alnico, stock)
- **Power tubes:** **Single 6V6** in the power stage; 12AX7 in the preamp
- **Modifications:** Stock — Champs are not modified for this kind of recording
- **Multi-cab setup:** Single 1x8, mono'd

The 5W Champ at full volume = louder than expected (the 5W rating is conservative; cranked Champs sound much bigger than their wattage suggests). Tom Dowd's mic placement makes the small amp sound massive on the album.

---

## Microphones

- **Close mic:** **Shure SM57** — close, ~1" off the grille, on-axis to the cone center
- **Off-axis:** Sometimes a Beyer M160 ribbon close
- **Room mic:** Yes — Criteria Studios' tracking room had natural ambience. Tom Dowd added a room mic about 6 feet back (Neumann U87 or similar) for depth

The album's "huge" lead tone is partly Tom Dowd's mic + room blend technique. The actual amp is small; the recording makes it feel large.

---

## Technique notes

- **Right-hand attack:** **Aggressive**, picking with a Fender Medium tortoise pick. Clapton hits the strings HARD on Layla — the bend-heavy main riff requires it.
- **Bend technique:** Wide, vocal bends. Clapton's "woman tone" is achieved by rolling the tone knob back and using the neck pickup; for Layla's bridge-pickup lead, the tone is fully open.
- **Vibrato:** Slow hand vibrato applied AFTER reaching pitch
- **Volume knob:** Rolled back to ~7-8 for verse rhythm passages, full open for lead
- **Tone knob:** Full open (10) for the lead — the bridge/middle position is bright enough that rolling back the tone removes the cut

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| (no pedals) | n/a | n/a | Recipe should reflect this — drives off by default |
| Fender Champ (dimed) | **US Small Tweed** (`HD2_AmpTweedBluesBrt`) | Verified | The Tweed Blues Brt model is the closest Champ-family. Drive=0.95 (DIMED), ChVol=0.85, Master=1.0, Sag=0.70 high (small amp compression) |
| Champ 1x8 | **1x8 Small Tweed** (`HD2_Cab1x8SmallTweed`) | Verified | Direct emulation; legacy single-mic only (no WithPan variant) |
| SM57 + Beyer M160 + room | Mic 0 (SM57) + Mic 5 (R-121 ribbon) on cabSibling — but sibling falls back to single-mic for the 1x8 | Verified | Single-mic legacy is fine for a 1x8 combo; room reverb adds the depth |
| Criteria Studios room | **Dynamic Plate** (`VIC_DynPlate`) | Verified | Decay 1.8, Mix 0.20 (Criteria had a famous EMT plate) |

---

## Sources

- Wikipedia — *Layla and Other Assorted Love Songs* article (Tom Dowd, Criteria Studios, recording dates)
- Tom Dowd interviews — *Sound on Sound*, *Tape Op*
- *Tom Dowd: The Language of Music* documentary (2003) — covers his production approach
- Clapton autobiography (2007) — covers the Layla sessions
- Equipboard pros/eric-clapton (Brownie Strat documentation)
- Premier Guitar — multiple Clapton rig features

---

## Confidence summary

- **Verified:** 16 items (recording context + Tom Dowd + Criteria, Brownie Strat + position 4 pickup, dimed Champ, no pedals on the lead, mic technique with room blend)
- **Likely:** 3 items (exact mic positions, exact Champ settings vs Tom Dowd's mic compensation, room-mic decision per take)
- **Speculative:** 0 items

---

## Open questions

- **Was Duane Allman's tone the same Champ?** Sources say yes — both guitarists used cranked small amps for Layla's tracking
- **The "woman tone" passages on the album?** That's a different track (Bell Bottom Blues uses neck-pickup + tone-rolled "woman tone"); Layla's lead is bridge/middle position
- **Multi-amp blending?** Some sources suggest Clapton's Champ was paired with a Fender Twin for low-end fundament — others say it was just the Champ. The album mix sounds like a single small-amp source.

---

## Recipe alignment

The current `clapton-layla-lead` recipe captures the dimed Champ tone well. Helix translation:
- Volume Pedal + light comp ✓
- All overdrives off ✓ matches the "no pedals" Layla approach
- Scream 808 + Minotaur as alt boosts — modern alternatives (acceptable as user-toggleable for FRFR systems that don't push back)
- US Small Tweed at Drive=0.95 ✓ matches the dimed Champ
- Sag=0.70 ✓ captures the small-amp compression
- Dual-mic 1x8 Small Tweed ✓ correct cab (cabSibling falls back to single-mic — fine for a small combo)
- Dynamic Plate at low mix ✓ matches Criteria's plate ambience
- Tilt EQ at end ✓

The recipe is a strong era-match. The "tone is in the hands" caveat applies — Clapton's pick attack + bend technique is half the Layla character.
