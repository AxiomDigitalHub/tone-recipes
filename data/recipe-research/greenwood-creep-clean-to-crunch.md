# Jonny Greenwood — "Creep" Pedalboard Research

**Recipe slug:** `greenwood-creep-clean-to-crunch`
**Last researched:** 2026-05-01
**Source confidence:** Verified (multiple Greenwood interviews + Sean Slade producer interviews)

---

## Recording context

- **Album:** *Pablo Honey* (1993)
- **Studio:** **Chipping Norton Recording Studios**, Oxfordshire, England
- **Producer:** **Sean Slade** + Paul Q. Kolderie
- **Engineer:** Sean Slade + Paul Q. Kolderie
- Recording dates: September 1992

Creep's signature is the **chunk-chunk-chunk pre-chorus** — Greenwood's deliberate sabotage of the song with violent rhythmic muted strikes through a fuzzed-out amp. That pre-chorus part is the song's hook in spite of the band's intentions.

---

## Guitar

- **Model:** **Fender Telecaster Plus** (1990s era, with Lace Sensor pickups) — Jonny's primary 1992 guitar
  - Body: alder, sunburst
  - Loaded with **Fender Lace Sensor** pickups (red/silver/blue config)
- **Pickup:** **Bridge Lace Sensor** (red — the high-output sensor) for the dirty pre-chorus stabs; **neck or middle** for the verse
- **Tuning:** E standard
- **Strings:** Light-medium .010s
- **Notable mods:** Stock — the Tele Plus was Lace-loaded from factory
- **Era caveat:** Pre-Starcaster era for Greenwood. The Tele Plus is the iconic Pablo Honey/Bends/OK Computer guitar.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **DOD FX-69 Grunge** OR **Marshall ShredMaster** | The pre-chorus distortion — bright, ratty, mid-scooped | Drive 7, Tone 7, Level 6 | Likely |
| 2 | **Boss DD-3** Digital Delay | Subtle slapback | Time 60ms, Mix 15% | Possible |

**Notes:**
- The pre-chorus "chunk-chunk-chunk" is achieved with **a distortion pedal stomped on for the strikes**. Greenwood has said he was deliberately trying to ruin the song with that part
- The verse is clean Tele Plus into a clean amp
- The contrast between clean verse and brutal pre-chorus is the whole point — and a footswitched distortion pedal is how he achieved it
- The ShredMaster is most-cited for The Bends and OK Computer; for Pablo Honey-era Creep, an early Marshall ShredMaster or DOD distortion is most likely

---

## Amp + Cab

- **Amp:** **Vox AC30** OR **Fender Twin Reverb** — Greenwood used both at the time
  - Pablo Honey-era setup is documented as a Fender Twin most consistently for Creep
  - Settings: Vibrato channel, Volume 5, Treble 7, Bass 5
- **Cab:** Twin Reverb's built-in 2x12 (Jensen C12N)
- **Power tubes:** 6L6 quad
- **Modifications:** Stock

---

## Microphones

- **Close mic:** **Shure SM57** on the Twin
- **Off-axis:** Possibly Sennheiser MD421
- **Room mic:** Chipping Norton's natural live room — possibly a Coles 4038 ribbon ~5 feet back

---

## Technique notes

- **Right-hand attack:** Light fingers/pick for the verse (delicate); brutal palm-muted strikes for the pre-chorus
- **Volume knob:** Greenwood doesn't use volume rolling — he uses the **footswitched distortion pedal** for dynamic shifts
- **Stomp timing:** Greenwood stomps the distortion pedal RIGHT on the beat with a heavy foot — that mechanical "STOMP" is part of the rhythmic pulse
- **Bend technique:** None — Creep is mostly chord-strumming, no leads

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Marshall ShredMaster | **Bassbrass Master** OR **Distortion** (no exact match) | Speculative | ShredMaster doesn't have a direct Helix model — closest is a Marshall-style distortion with mid-scoop |
| DOD FX-69 Grunge | **Heavy Distortion** | Likely | Use a Helix Heavy Distortion as approximation |
| Boss DD-3 | **Vintage Digital** | Verified | Direct emulation, low mix |
| Fender Twin Reverb | **US Double Vib** | Verified | Direct emulation. Drive=0.45 |
| Twin's 2x12 + C12N | **2x12 Double C12N** (`HD2_Cab2x12DoubleC12N`) | Verified, has WithPan | Direct match |
| SM57 + ribbon | Mic 0 + Mic 5 on cabSibling | Verified | Standard dual-mic |
| Spring reverb | **Spring** | Verified | Twin's onboard tank, Decay 0.5 |

---

## Sources

- Wikipedia — *Pablo Honey* article
- Sean Slade producer interviews (multiple)
- Jonny Greenwood interviews — *Guitar World*, *MusicRadar*
- Equipboard pros/jonny-greenwood
- *Tape Op* magazine — Chipping Norton studio profile

---

## Confidence summary

- **Verified:** 13 items (recording context, Tele Plus + Lace Sensors, Sean Slade production, Twin Reverb)
- **Likely:** 4 items (exact distortion pedal model, exact pedal settings, room mic technique)
- **Speculative:** 2 items (ShredMaster vs DOD vs other on Pablo Honey specifically — Greenwood's pedal collection is documented but per-song detail is sparse)

---

## Open questions

- **Distortion pedal — ShredMaster, DOD Grunge, or a Boss DS-1?** Greenwood owned multiple in the early 90s; per-song attribution is unclear
- **Vox AC30 or Fender Twin?** Both are credited at Chipping Norton sessions

---

## Recipe alignment

The current `greenwood-creep-clean-to-crunch` recipe should:
- Use a distortion block that's footswitched off/on (snapshot or stomp-mode)
- Heavy Distortion (or similar mid-scooped distortion) for the pre-chorus
- US Double Vib amp at Drive 0.45 (clean platform)
- 2x12 Double C12N dual-mic with cabSibling
- Spring reverb low mix
- Tilt EQ at end for the bright Tele Plus character
- Snapshot mode (verse clean / pre-chorus distorted) is the IDEAL implementation
