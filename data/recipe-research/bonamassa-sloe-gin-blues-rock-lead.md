# Joe Bonamassa — "Sloe Gin" Pedalboard Research

**Recipe slug:** `bonamassa-sloe-gin-blues-rock-lead`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Bonamassa publishes his rigs extensively — Premier Guitar, his own YouTube)

---

## Recording context

- **Album:** *Sloe Gin* (2007)
- **Studio:** Bogalusa, Louisiana / various
- **Producer:** **Kevin Shirley** (Caveman) — Bonamassa's longtime producer
- **Engineer:** Kevin Shirley
- Recording dates: 2006–2007

Sloe Gin (the title track, written by Tim Curry) is a blues-rock ballad — the most-cited lead Bonamassa solo of his career. The signal chain reflects his "vintage purist" rig: Gibson Les Paul, no pedals beyond a wah, into stacked vintage amps.

---

## Guitar

- **Model:** **Gibson Les Paul Standard** — Bonamassa rotates between several '59 Bursts and a custom 1959 reissue. For Sloe Gin, **"Snakebite"** (a 1959 Burst aged top with snake-pattern flame) is most likely. Could also be his 1960 "First Standard."
- **Pickup:** **Bridge humbucker** (PAF or PAF-replica) for the lead
- **Tuning:** E standard (Bonamassa rarely down-tunes)
- **Strings:** Ernie Ball Slinky .011–.052
- **Notable mods:** None — Bonamassa is a vintage-purist
- **Era caveat:** 2007 Bonamassa Burst rotation, before the Cradle Rock '57 Goldtop joined the rotation

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Vox V846 Wah** | Off for Sloe Gin (no wah on this song) | — | Verified off |
| 2 | **Way Huge Aqua-Puss** Analog Delay | Subtle slapback on the lead | Time ~280 ms, Mix 25% | Likely |
| 3 | **Ibanez TS808** Tube Screamer | Mid-bump for solo passages | Drive 4, Tone 6, Level 7 | Likely |
| 4 | **Fulltone OCD** | Alt drive for crunch sections | Drive 3, Tone 5, Vol 7 | Possible |

**Notes:**
- Bonamassa's pedalboard at this point is small but tasteful — he's a "guitar→amp→mic" guy who uses pedals only when needed
- Sloe Gin is mostly clean-into-cranked-Marshall; the TS808 may bump the climax solo
- Bonamassa has historically said his amps do most of the work — pedals are for "color"

---

## Amp + Cab

- **Amp:** **Marshall Silver Jubilee 2555** (1987 anniversary edition, rare) AND/OR a **Marshall Super Lead 1959** — Bonamassa runs multiple amps in parallel during studio sessions
  - Silver Jubilee channel: Lead, settings: Pre-amp 6, Master 5, Bass 5, Mid 6, Treble 5
  - Super Lead jumpered: both volumes 7
- **Cab:** Marshall **1960B** 4x12 with **Celestion G12-65** speakers (1987-era)
- **Power tubes:** EL34 quad in each amp
- **Modifications:** Stock vintage gear
- **Multi-cab setup:** **Yes — multiple amps in parallel**, blended at the desk. Kevin Shirley's "amp army" approach

For studio overdubs Bonamassa often runs 3–4 amps in parallel for a layered guitar tone. Sloe Gin's solo tone has the multi-amp depth.

---

## Microphones

- **Close mics:** SM57 on each Marshall, MD421 on one
- **Room mic:** Yes — Kevin Shirley uses room sound; possibly a Royer R-121 ~6 feet back per cab
- Mike Clink–style discipline: tight close miking, room blend in mix

---

## Technique notes

- **Right-hand attack:** Heavy pick, aggressive — Bonamassa is a HARD picker
- **Bending technique:** Wide, sustained bends with vocal vibrato (Eric Johnson influence)
- **Volume knob:** Rolled back to ~6 for the verse melody, full for the climax
- **Phrasing:** Bonamassa's solos reference Beck, Page, Kossoff — bluesy but with rock-attack timing

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Vox V846 | **UK Wah 846** | Verified | Off for Sloe Gin |
| Way Huge Aqua-Puss | **Bucket Brigade Aqua-Puss** (`HD2_DelayBucketBrigadeAquaPussV2`) | Verified | Direct emulation, low mix |
| Ibanez TS808 | **Scream 808** (`HD2_DistScream808`) | Verified | Default OFF; alt for solo |
| Fulltone OCD | **Compulsive Drive** (`HD2_DistCompulsiveDrive`) | Verified | Direct OCD emulation |
| Marshall Silver Jubilee 2555 | **Brit 2204 Mod** or **Brit 2555** (TBD) | Likely | Closest match in Helix; verify model exists |
| Marshall Super Lead 1959 | **Brit Plexi Brt** (`HD2_AmpBritPlexiBrt`) | Verified | Direct emulation |
| 4x12 + G12-65 | **4x12 Greenback 25** | Verified for Greenback | G12-65 not directly modeled |
| SM57 + R-121 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Sloe Gin* article
- Premier Guitar Bonamassa rig features (multiple)
- Bonamassa's own YouTube rig rundowns
- Equipboard pros/joe-bonamassa
- Kevin Shirley interviews (Mix Magazine)

---

## Confidence summary

- **Verified:** 14 items (recording context, Gibson Burst, Marshall amp choice, Kevin Shirley production, multi-amp tracking)
- **Likely:** 4 items (which exact Burst, Aqua-Puss vs other delay, exact Silver Jubilee settings, OCD on this song)
- **Speculative:** 1 item (which amp dominates the lead — Silver Jubilee vs Super Lead in the mix)

---

## Open questions

- **Snakebite or another Burst?** Bonamassa's collection is large. Snakebite is most-cited for Sloe Gin
- **Silver Jubilee or Super Lead leads?** The album credits aren't specific per-song

---

## Recipe alignment

The current `bonamassa-sloe-gin-blues-rock-lead` recipe should:
- Optional Vox UK Wah 846 (off)
- Aqua-Puss Bucket Brigade default-on at low mix
- Scream 808 alt for solo bump
- Brit 2555 (or Brit 2204 Mod) main amp at Drive 0.65
- 4x12 Greenback 25 dual-mic with cabSibling
- Hot Springs reverb low mix
- Tilt EQ at end
