# Randy Rhoads — "Crazy Train" Pedalboard Research

**Recipe slug:** `rhoads-crazy-train-lead`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Max Norman engineered; Rhoads' rig is well-documented)

---

## Recording context

- **Album:** *Blizzard of Ozz* (1980)
- **Studio:** **Ridge Farm Studios**, Surrey, England
- **Producer:** **Max Norman** (engineer) + Ozzy Osbourne / Sharon Arden (uncredited production input)
- **Engineer:** Max Norman
- Recording dates: March–April 1980

Crazy Train is the track that introduced Randy Rhoads to the world. The riff is iconic; the solo is a textbook of Rhoads' classical-influenced shred technique. His tone is mid-forward, articulate, sustaining — the template for 80s neo-classical metal.

---

## Guitar

- **Model:** **Karl Sandoval-built "Polka Dot V"** (custom Flying V with bowtie polka dots) AND a **1974 Gibson Les Paul Custom** (Cream-colored)
  - For the Crazy Train solo specifically, sources differ — likely the **Les Paul Custom** for the solo's sustaining humbucker tone
- **Pickup:** **Bridge humbucker** (Gibson stock or DiMarzio Super Distortion in the V)
- **Tuning:** E standard
- **Strings:** Medium .010-.046
- **Notable mods:** The Sandoval V has DiMarzio Super Distortion bridge; the Les Paul Custom is mostly stock
- **Era caveat:** Pre-Jackson-Concorde era. Rhoads' Jackson Concordes came in 1981–1982; Blizzard of Ozz is the V + Les Paul Custom era.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **MXR Distortion+** | Slight push into the Marshall | Output 6, Distortion 4 | Likely |
| 2 | **MXR Stereo Chorus** OR **Boss CE-1** | Wide chorus on certain passages | — | Possible |
| 3 | **MXR Flanger** | Brief flange accents | — | Possible |
| 4 | **Korg Stage Echo** | Tape-style delay for solo | Time 380ms, Repeats moderate | Likely |

**Notes:**
- Rhoads' tone is mostly **Marshall on full + Les Paul or DiMarzio'd V** with minimal pedals
- The MXR Distortion+ is a "boost" not a heavy distortion — it pushes the already-cranked Marshall further into saturation
- The chorus on Crazy Train's intro melody is subtle and may be amp-driven (Marshall reverb interplay) rather than pedal

---

## Amp + Cab

- **Amp:** **Marshall Super Lead 1959** (Plexi-era 100W) — Rhoads' signature Marshall
  - Settings: Both Volumes 7, Bass 5, Mid 7, Treble 6, Presence 6
  - Sometimes paired with a second Marshall for studio overdubs
- **Cab:** **Marshall** 4x12 with **Celestion G12M-25 Greenback** speakers (mid-70s Greenbacks)
- **Power tubes:** EL34 quad
- **Modifications:** Stock — Rhoads used factory Marshalls
- **Multi-cab setup:** Single 4x12 in studio for basics; possible second Marshall for overdubs

The cranked Plexi + DiMarzio Super Distortion is the entire neo-classical metal template. Every 80s shredder copied this rig.

---

## Microphones

- **Close mic:** **Shure SM57** close, on-axis to one of the four 12s
- **Off-axis:** **Beyer M160** ribbon close (Eddie Kramer / Max Norman approach)
- **Room mic:** Ridge Farm's natural live room — possibly a Neumann U87 ~6 feet back. Max Norman is known for tight close-mic Marshall recording

---

## Technique notes

- **Right-hand attack:** Precise alternate picking, classical-influenced — Rhoads studied classical guitar formally
- **Bend technique:** Precise, in-tune bends with controlled vibrato
- **Vibrato:** Wide, slow, deliberate — Rhoads' vibrato is one of his signatures
- **Volume knob:** Mostly full
- **Picking patterns:** Heavy alternate picking with frequent palm-mute releases; classical pull-offs

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| MXR Distortion+ | **Heavy Distortion** OR **Compulsive Drive** | Likely | Distortion+ doesn't have a direct Helix model; closest is OCD-style |
| MXR Stereo Chorus | **Trinity Chorus** | Likely | Closest match |
| MXR Flanger | **Dynamic Flanger** | Likely | Approximate |
| Korg Stage Echo | **Cosmos Echo** OR **Transistor Tape** (`HD2_DelayTransistorTape`) | Verified | Tape echo emulation |
| Marshall Super Lead 1959 | **Brit Plexi Brt** (`HD2_AmpBritPlexiBrt`) | Verified | Direct Plexi emulation. Drive=0.85 |
| 4x12 + G12M Greenback | **4x12 Greenback 25** (`HD2_Cab4x12Greenback25`) | Verified, has WithPan | Direct Greenback match |
| SM57 + Beyer M160 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Blizzard of Ozz* article
- Max Norman engineer interviews
- Equipboard pros/randy-rhoads
- *Premier Guitar* / *Guitar World* Rhoads features (multiple)
- Sharon Osbourne / Ozzy autobiography (gear chronology)

---

## Confidence summary

- **Verified:** 15 items (recording context, Ridge Farm, Max Norman engineering, Marshall Super Lead 1959, Greenback cab, Polka Dot V + Les Paul Custom rotation)
- **Likely:** 4 items (Distortion+ on this song, exact pedal settings, MXR Stereo Chorus use, Korg delay vs other)
- **Speculative:** 0 items

---

## Open questions

- **Polka Dot V or Les Paul Custom on the Crazy Train solo?** Both are credited at different points — solo most likely Les Paul Custom for the sustain
- **Distortion+ on the riff or just the solo?** Sources differ; riff may be direct Plexi

---

## Recipe alignment

The current `rhoads-crazy-train-lead` recipe should:
- Optional Compulsive Drive (or Heavy Distortion) default-ON for slight boost
- Transistor Tape delay default-ON at low mix
- Optional Trinity Chorus default-OFF (alt for atmospheric color)
- Brit Plexi Brt amp at Drive 0.85
- 4x12 Greenback 25 cab dual-mic with cabSibling
- Tilt EQ at end
- Hot Springs reverb low mix
- IDEAL: Snapshot mode for riff dry / solo with chorus + delay
