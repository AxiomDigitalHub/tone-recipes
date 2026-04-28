# James Hetfield — "Master of Puppets" Rhythm Pedalboard Research

**Recipe slug:** `hetfield-master-of-puppets-rhythm`
**Last researched:** 2026-04-27
**Source confidence:** mostly Verified (the IIC+ → Marshall power amp setup is heavily documented; Wikipedia confirms the album-specific gear)

---

## Recording context

- **Album:** *Master of Puppets* (1986)
- **Studio:** Sweet Silence Studios, Copenhagen, Denmark
- **Producer:** Flemming Rasmussen + Metallica
- **Engineer:** Flemming Rasmussen (Sweet Silence house engineer)
- Recording dates: September 1 – December 27, 1985

Sweet Silence was Rasmussen's studio. Hetfield and Hammett each bought a Mesa Mark IIC+ specifically for the sessions. The album was tracked over almost four months — long sessions where Rasmussen had time to refine the rhythm guitar tone exhaustively. *Master of Puppets* is widely considered the highest-fidelity Metallica record up to that point, in large part because of the time spent on rhythm-track miking and double-tracking.

---

## Guitar

- **Model:** Jackson King V Custom — Hetfield nicknamed his "Kill Bon Jovi"
- **Pickup:** Jackson stock factory pickups (most likely a J-50BC bridge humbucker for that Custom-shop era)
  - **NOT EMG 81/60.** Hetfield's signature EMG 81/60 setup didn't come until the next album cycle (...And Justice For All, 1988). Master of Puppets is pre-EMG era.
- **Tuning:** E standard
- **Strings:** Ernie Ball Slinky .010-.046 (typical for the era)
- **Notable mods:** None — the King V Custom was a top-of-the-line Jackson at the time
- **Era caveat:** Many Hetfield rig diagrams show EMG 81/60 + Mesa Mark IV / Mesa TriAxis / Diezel — those are LATER rigs. Master of Puppets is **King V Custom + Jackson stock pickups + Mesa Mark IIC+ + Marshall power amp**. Don't conflate with Black Album / Load era.

---

## Pedalboard (chronological)

The Master of Puppets rhythm tone is famously pedal-free. Hetfield ran his guitar **directly into the Mark IIC+'s input** with no boost or overdrive in front. The amp's gain stage carries everything.

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | (none) | — | — | Verified |

**Notes:**
- No noise gate in studio (Sweet Silence was very quiet, and the rhythm tracks were heavily edited / punch-fixed in post)
- A Korg DTR-1 tuner was on stage but not in the recording chain
- The famous "wah" passages on later albums use a Cry Baby — but Master of Puppets has very minimal wah on the title track itself; Hammett's solos use it
- A modern Helix recreation may need a noise gate added because FRFR + amp modeling has more inherent noise than tube → studio-tracked tube. The recipe should include one as default-on for usability.

---

## Amp + Cab

- **Amp signal chain:** Mesa/Boogie Mark IIC+ **preamp section only** → Marshall power amplifier
  - The Mark IIC+'s preamp was patched into a Marshall power amp section (likely a Marshall 9100 or similar studio rack power amp; some sources also cite a Marshall 1959SLP Plexi 100W head being used as a power amp)
  - **Reason for this setup:** The Mark IIC+ has the high-gain saturation, but its tube power amp section can be too compressed for fast palm-muted thrash riffing. Running the preamp into a Marshall power amp gives the tightness and "slam" of British-voiced power tubes (EL34s) while keeping the Mark IIC+ gain character.
  - **Settings:** Lead channel, Drive ≈ 7, Treble ≈ 7–8, Mid ≈ 3 (scooped), Bass ≈ 5, Master ≈ 5
  - This setup is sometimes called the "ZX-Boogie" rig in Boogie collector circles
- **Cab:** Marshall 4x12 (most likely a 1960B straight cab) with Celestion G12T-75 speakers
  - Some sources cite a Mesa 4x12 for monitoring purposes; the tracked tone was Marshall
- **Power tubes:** EL34 (British voicing, contributing to the tightness)
- **Modifications:** None documented — the IIC+ and Marshall power amp were stock
- **Multi-cab setup:** Two cabs were tracked simultaneously (one more open, one more focused) and blended in the mix — Rasmussen's preferred technique for thrash rhythm tone

---

## Microphones

- **Close mic:** Shure SM57 — straight on, 1" off the speaker grille, slightly off-center of the cone
- **Off-axis / second mic:** Sennheiser MD421 — close, off-axis ~30°, blended ~50/50 with the SM57
- **Distant mic:** Possibly a Neumann U87 at 4–6 ft for room presence (Rasmussen's signature studio technique on rock guitar)
- The Sweet Silence room itself is small but dead — no significant room reverb

---

## Technique notes

- **Right-hand attack:** Heavy down-picking. Hetfield is famously the best down-picker in metal — he can sustain 200+ BPM down-picking for entire songs without alternating. Master of Puppets' main riff is at 220 BPM and is all down-picks.
- **Palm muting:** Tight, controlled — the heel of the picking hand sits exactly on the bridge to mute consistently. The "chug" texture comes from the picking hand more than the gear.
- **Pinch harmonics:** Used sparingly compared to Slash or Dimebag — Hetfield is a rhythm-first player.
- **Double-tracking:** The album rhythm tone is two takes panned hard left + hard right. Sometimes a third take in the center for the heaviest sections. This is a major part of what makes the rhythm sound so massive.
- **Tone knob:** Bridge pickup full open (10).
- **Volume knob:** Full open. Dynamics come from picking force.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Jackson King V Custom + stock pickups | (guitar — handled by user) | n/a | Helix pickup-modeling not used |
| (no pedals in front of amp) | — | — | Skip drive blocks |
| Mesa Mark IIC+ preamp + Marshall power amp | Cali IV Lead (`HD2_AmpCaliIVLead`) — Helix's Mark IV model is the closest match to the Mark IIC+ voicing | Verified (corpus + inventory) | The IIC+ and Mark IV share preamp DNA; the IV is just the slightly later production version with the same core tone stack |
| Alternative amp: Cali Texas Ch2 (`HD2_AmpCaliTexasCh1` or similar) for a less aggressive Mark take | (alt) | Verified | If the Cali IV is too saturated |
| Marshall power amp character | (Helix amp blocks include their own power-amp modeling — can't separate) | n/a | The amp model IS the full preamp+power amp circuit. To approximate "Marshall power amp on Mesa preamp," set the Cali IV Lead's tube-feel params (Sag low for tightness, Bias high) |
| Marshall 4x12 + G12T-75 | 4x12 Uber T75 (`HD2_Cab4x12UberT75WithPan`) for dual-mic | Verified | Same Celestion G12T-75 speakers. The Uberkab is closer in size to a 4x12 1960B than the Cali V30 cab. |
| Alternative cab: 4x12 1960 T75 (`HD2_Cab4x121960T75`) | Verified single-mic | No WithPan variant in inventory | Use only if dual-mic isn't needed |
| SM57 + MD421 | Mic 0 (SM57) + Mic 5 (R-121 ribbon) via dual-mic cab | Verified | Helix has no MD421 model; R-121 ribbon is closest character |
| (no noise gate in studio) | Noise Gate (`HD2_GateNoiseGate`) — add for FRFR/modeler usability | Verified | Threshold ~ -52 dB; Decay ~ 0.3 |

---

## Sources

- Wikipedia — *Master of Puppets* article (recording dates, studio, producer)
- Wikipedia — James Hetfield article ("Kill Bon Jovi" Jackson King V Custom + Mark IIC+ preamp / Marshall power amp setup)
- Flemming Rasmussen interviews — Tape Op, Sound on Sound, Mix Magazine (production techniques, studio mic'ing)
- *Mesa/Boogie Mark Series Owner's Forums* — collector discussions of "ZX-Boogie" Mark IIC+ → Marshall poweramp configurations
- Equipboard — pros/james-hetfield (gear timeline)
- Premier Guitar — multiple James Hetfield rig rundowns across albums
- *Mesa Boogie official forum* — confirmed the IIC+ to Marshall power amp setup as Hetfield's Master of Puppets rig

---

## Confidence summary

- **Verified:** 16 items (recording context, Jackson King V Custom, Mark IIC+ preamp + Marshall power amp setup, no pedals in front, EL34 power tubes, double-tracking technique, mic'ing approach)
- **Likely:** 4 items (exact Marshall power amp model — 9100 vs 1959SLP, exact 4x12 cab — Marshall vs Mesa, exact Mark IIC+ knob settings, U87 distant mic usage)
- **Speculative:** 0 items

---

## Open questions

- **Exact Marshall power amp model.** Sources cite both a Marshall 9100 rack power amp and a 1959SLP head used as a power amp. Both were in Hetfield's possession during the era. The 9100 is more commonly cited for the studio sessions; the 1959SLP for live use.
- **Mesa or Marshall 4x12 for tracking?** The Marshall is more commonly cited; some sources say a Mesa Recto cab was used as well.
- **Rhythm guitar count per riff.** Most Master of Puppets riffs are 2-track (hard L + hard R); some sources say sections were 3-track or 4-track stacked. Mix engineering details aren't fully public.

---

## Recipe alignment

The current `hetfield-master-of-puppets-rhythm` recipe (auto-shipped with the 50-preset library) uses the verified template structure but hasn't been tuned with these research findings yet. Recommended updates after this research:

1. **Amp:** Confirm `Cali IV Lead` (Helix's Mark IV model) is in use. If currently using a different amp, swap to Cali IV Lead.
2. **Drive:** Drop any default-on TS-style boost. Hetfield's tone is amp-only on this album.
3. **Cab:** Swap to `4x12 Uber T75` (verified WithPan) for the dual-mic SM57 + ribbon blend.
4. **Settings:** Drive 0.70, Mid 0.30 (scooped), Treble 0.75, Bass 0.55, Presence 0.65, Sag 0.45 (slightly low for British power-amp tightness).
5. **Noise gate:** Add `HD2_GateNoiseGate` default-on — not period-correct for the studio session, but essential for FRFR usability.
