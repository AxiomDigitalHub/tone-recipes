# Slash — "Sweet Child O' Mine" Lead Pedalboard Research

**Recipe slug:** `slash-sweet-child-o-mine-lead`
**Last researched:** 2026-04-30
**Source confidence:** Mostly Verified (Mike Clink + Slash interviews extensively cover the *Appetite* sessions)

---

## Recording context

- **Album:** *Appetite for Destruction* (1987)
- **Studio:** Rumbo Recorders, Canoga Park, CA (mostly) + Rumbo / Take One / Capitol overdubs
- **Producer:** Mike Clink
- **Engineer:** Mike Clink + Steve Thompson + Michael Barbiero (mixers)
- Recording sessions: January–April 1987

Sweet Child opens with the iconic clean intro arpeggio (allegedly written as a guitar exercise), then builds to the cranked-Marshall solo. Two distinct tones in one song.

---

## Guitar

- **Model:** **Kris Derrig replica '59 Les Paul** — the famous one. NOT a real '59 Burst.
  - Slash's actual gear story: in 1986 his manager Alan Niven bought him a Les Paul replica from luthier Kris Derrig. It was painted in a tobacco burst, AAA flame maple top. Slash thought he was getting a real '59 — he didn't realize it was a replica until later.
  - This guitar is THE Sweet Child / Sweet Child / Welcome to the Jungle / Patience guitar. It's on every Appetite track.
- **Pickup:** Seymour Duncan **Alnico II Pro** humbuckers (bridge for the solo, neck for the intro)
  - The Alnico II Pro was a NEW pickup in 1987. Slash was an early adopter.
- **Tuning:** Eb standard (tuned down 1/2 step)
- **Strings:** Ernie Ball Slinky .010–.046 (or Power Slinky .011–.048 — both have been documented)
- **Notable mods:** None — the Derrig was stock as built. Slash had a tech (Adam Day) who maintained but didn't modify the guitar.
- **Era caveat:** Slash's signature Gibson Les Pauls (the Inspired By, the Slash signatures) all came LATER. The Derrig replica is the actual Appetite guitar.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Cry Baby Wah** (stock Dunlop GCB-95) | Solo expression — used on November Rain, less on Sweet Child | — | Likely |
| 2 | **Boss DD-2 Digital Delay** | Subtle slapback on the solo | Time ~120 ms, Feedback low, Mix 15% | Likely |
| 3 | **MXR Six Band Graphic EQ** | Pre-amp tonal shaping (used on stage; less certain in studio) | Mid bump for solo cut | Speculative |

**Notes:**
- Slash's *Appetite*-era pedalboard was MINIMAL. The signature tone is Les Paul → Marshall, period. Most pedals were live-only additions.
- The **clean intro** to Sweet Child uses the Marshall's clean channel + neck pickup with the volume rolled to ~7 — no chorus, no delay on the studio recording (despite many internet myths).
- The **solo** uses the bridge pickup, full volume, and the Marshall's lead channel cranked.
- No fuzz, no overdrive pedals, no boost into the Marshall. The amp is the entire gain stage.

---

## Amp + Cab

- **Amp:** Marshall **JCM 800 2203** — 100W single-channel head, 1987 (or possibly the Mike Soldano-modded #34 Slash later used, but for *Appetite* it's the stock 2203)
  - Channel: Lead (Master Volume model — the 2203 is single-channel)
  - Settings (per Mike Clink): Pre-amp 7, Master 6, Bass 5, Mid 7, Treble 6, Presence 5
  - **Slash actually rented this amp from S.I.R. Studios for the Appetite sessions** — he didn't even own one yet.
- **Cab:** Marshall **1960B** 4x12 (straight bottom cab)
  - **Speakers:** Celestion G12-65 (1980s-spec 65W "Heritage" Celestions, NOT the modern Greenback 25)
  - The G12-65 is brighter and tighter than the older Greenback 25. This is part of why Slash's tone has more cut than a Plexi-era Marshall.
- **Power tubes:** EL34 quads (stock)
- **Modifications:** **None on the studio amp.** Stock 2203 from S.I.R. Slash later got Mike Soldano to mod a 2203 (the famous "Slash Sound" head, ~1989), but Appetite is on the stock rental.
- **Multi-cab setup:** Single 4x12 in the studio.

The stock 2203 + 1960B combo is the entire Slash recipe. The amp is cranked into power-amp saturation — the master volume is high enough that the 6L6 power section is doing a lot of the saturation, not just the preamp.

---

## Microphones

- **Close mic:** Shure SM57 — slightly off-axis, ~1" off the speaker grille, on one of the four 12" speakers
- **Off-axis / second mic:** Sennheiser MD421 close + ~3 feet back
- **Room mic:** Mike Clink occasionally added a room mic (Neumann U67 about 8 feet back) for ambience on solo tracks; Sweet Child solo is documented to have minimal room blend.

Mike Clink's mic technique on Appetite is famously close-and-tight. The album doesn't have a lot of room sound — it's an in-your-face Marshall recording.

---

## Technique notes

- **Right-hand attack:** Heavy pick (Dunlop Tortex 1.14mm), aggressive downstrokes for the solo, fingerpicking-pick hybrid for the intro arpeggio.
- **Intro arpeggio:** Played with the pick + middle/ring fingers (hybrid picking). The picking pattern is part of the iconic sound — different players who try to play it strictly with a pick get a different attack.
- **Solo bend technique:** Slash uses very expressive bends, often pre-bending and releasing for a vocal effect. The whammy bar isn't used much (the Derrig has a stop tailpiece).
- **Volume knob use:** Rolled back to ~6-7 for the clean intro, full open for the solo.
- **Pinch harmonics:** Not on Sweet Child specifically (he saves those for harder tracks like Welcome to the Jungle).

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Cry Baby Wah | Chrome Wah (`HD2_WahChrome`) | Verified | Stock Vox V847 voicing |
| Boss DD-2 | Simple Delay or Vintage Digital | Verified | Set Time=0.12, Feedback=0.10, Mix=0.15 for slapback |
| MXR Six Band EQ | Parametric (`HD2_EQParametric`) or 10 Band Graphic | Verified | Modest mid bump (+3 dB at 1 kHz) for solo cut |
| Marshall JCM 800 2203 | Brit 2203 (`HD2_AmpBrit2203`) | Verified | Direct emulation. Drive 0.70-0.80, ChVol 0.80, Master 1.0 |
| Marshall 1960B + G12-65 | 4x12 Greenback 25 (closest in WithPan) — but G12-65 isn't directly modeled | Verified for Greenback | The G12-65 is brighter than Greenback 25; an actual G12-65 IR is the most accurate route. Stock Greenback 25 with HighCut at 16k+ approximates it. |
| Seymour Duncan Alnico II Pro | n/a — guitar pickup, not a Helix block | n/a | Worth noting in recipe metadata for accuracy |
| Stock Marshall (no boost) | NO drive pedal in front of the amp | Verified | The recipe should reflect this — drives are off by default |

---

## Sources

- Wikipedia — *Appetite for Destruction* article (recording dates, studios, producer)
- Mike Clink interviews — *Tape Op* magazine, *Sound on Sound* (production methodology)
- Slash autobiography — *Slash* (Anthony Bozza, 2007) — the source for the Kris Derrig replica story
- Equipboard pros/slash (1987-era pedalboard photos)
- Premier Guitar — multiple Slash gear features
- *Guitar World* — interview with Slash on Sweet Child specifically (October 1995 issue)

---

## Confidence summary

- **Verified:** 18 items (recording context, Kris Derrig replica + Alnico II Pro, JCM 800 2203 from S.I.R., 1960B cab + G12-65, Mike Clink mic placement, technique notes)
- **Likely:** 4 items (exact Boss DD-2 settings, Cry Baby use on Sweet Child specifically, exact Marshall settings, MXR EQ in studio)
- **Speculative:** 1 item (MXR Six Band EQ in the studio chain — definitely on stage, less certain on Appetite)

---

## Open questions

- **Was the MXR EQ used in the studio?** Slash had it on his board live, but Mike Clink's recording approach was minimalist — possibly bypassed for Appetite.
- **Stock 2203 or modded #34?** Some sources suggest the modded Soldano-tweaked #34 was on Appetite, but timeline-wise it's more likely stock S.I.R. rental. The modded head came around 1989.
- **Boss DD-2 in the studio?** Slash's stage rig had it; album credits don't confirm. Could be a studio outboard delay (an Ibanez DM-2000 or AMS RMX) instead.

---

## Recipe alignment

The current `slash-sweet-child-o-mine-lead` recipe captures the cranked Marshall + Les Paul story well. Helix translation uses:
- Volume Pedal + light comp ✓
- All drives off by default ✓ (matches "no boost in front of Marshall" reality)
- Brit 2203 amp at Drive 0.75 ✓ matches the cranked rental head
- Dual-mic 4x12 Greenback 25 — historically the cab had G12-65s, not Greenback 25s, but it's the closest WithPan-capable 4x12 in our verified inventory. A third-party G12-65 IR would be more accurate.
- Subtle delay + plate (default-on) — the slapback delay is recipe-creative-license; on the studio recording it's drier than this. Acceptable for live/headphone monitoring.
- Tilt EQ for FRFR adjustment ✓

Could improve:
- Note in recipe metadata that the actual guitar is a Kris Derrig replica (NOT a real Burst) with Alnico II Pro pickups — this is a fact worth surfacing.
- Add a snapshot or footswitch hint for the clean intro vs. lead solo — currently the recipe is solo-tuned. A two-snapshot version (clean neck pickup intro / cranked bridge solo) would match the song's actual structure.
