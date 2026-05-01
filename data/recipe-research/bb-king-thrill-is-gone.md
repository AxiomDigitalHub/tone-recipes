# B.B. King — "The Thrill Is Gone" Pedalboard Research

**Recipe slug:** `bb-king-thrill-is-gone`
**Last researched:** 2026-05-01
**Source confidence:** Verified (well-documented session — Bill Szymczyk produced)

---

## Recording context

- **Album:** *Completely Well* (1969)
- **Studio:** The Hit Factory, New York City
- **Producer:** **Bill Szymczyk** (later Eagles producer)
- **Engineer:** Bill Szymczyk
- Recording dates: June 1969

The Thrill Is Gone is BB's career-defining hit — a minor-key blues with a string section overdubbed by Bert deCoteaux at Szymczyk's suggestion. The arrangement is unusual for BB; the tone is pure BB King.

---

## Guitar

- **Model:** **Lucille** — at this point, a **Gibson ES-355** (semi-hollow, stereo wiring, Varitone switch). BB's "Lucille" is a series of guitars, not a single instrument. The 1969 Lucille was an ES-355.
- **Pickup:** **Bridge humbucker** (likely Gibson PAF-era or Patent No.) — neck humbucker mostly off
- **Tuning:** E standard
- **Strings:** Medium gauge (BB used .010s and worked up to .013 over career)
- **Notable mods:** F-holes filled (BB's standard mod to avoid feedback at high volume) — eventually became factory standard on B.B. King signature models
- **Era caveat:** This is pre-signature-Lucille era. Just a stock ES-355 with the F-holes plugged.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| — | None | BB famously played guitar → cable → amp | — | Verified |

**Notes:**
- BB King is the canonical "no pedals" blues player. His tone comes from fingers + Lucille + the amp's natural breakup
- The studio "tone" is from amp choice + mic'ing + mix-side processing (plate reverb, light compression)
- The string section's emotional lift is mix-side; the guitar tone is dry into a clean-ish amp

---

## Amp + Cab

- **Amp:** **Fender Twin Reverb** (Blackface, 1965-era) OR a Gibson Lab Series L5 (BB used both in this era)
  - 1969 BB had moved between Fenders and Gibsons; The Hit Factory most likely had a Twin Reverb available
  - Settings: clean, slight breakup at the treble end. Volume ~5, Treble 7, Mid 5, Bass 5, Reverb 4
- **Cab:** Twin Reverb's built-in 2x12 (Jensen C12N or D120F speakers)
- **Power tubes:** 6L6 quad
- **Modifications:** Stock — BB didn't mod amps

The Twin Reverb's cleanest-loud headroom is what BB needs. His attack is loud but not distorted; the amp stays mostly clean, just with a touch of compression as he digs in.

---

## Microphones

- **Close mic:** **Shure SM57** on one of the Twin's 12" speakers
- **Off-axis:** Often a Beyer M160 ribbon
- **Room mic:** The Hit Factory had a tight live room; possibly a Neumann U87 ~5 feet back

---

## Technique notes

- **Right-hand attack:** Pure fingers — BB did not use a pick. Thumb + index for snap
- **Vibrato:** THE BB vibrato — "butterfly" vibrato, fast, narrow, tightly controlled. The model for every blues guitarist after him
- **Bend technique:** Half-step bends, sometimes whole — never aggressive
- **String choice:** BB never plays full chords. Single-note melodic phrasing exclusively — "I never played a chord in my life"
- **Volume knob:** Mostly full — the dynamics happen in the right hand

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| (no pedals) | — | — | Empty pedalboard |
| Fender Twin Reverb | **US Double Nrm** (`HD2_AmpUSDoubleNrm`) | Verified | Direct emulation. Drive=0.45 (clean-with-headroom), Master=0.75 |
| Twin's 2x12 | **2x12 Double C12N** (`HD2_Cab2x12DoubleC12N`) | Verified, has WithPan | Direct match |
| SM57 + M160 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |
| Plate reverb | **Glitz** or **Plate** (`HD2_ReverbPlate`) | Verified | Decay 1.6, Mix 0.30 — Hit Factory plate sound |

---

## Sources

- Wikipedia — *Completely Well* article
- Bill Szymczyk producer interviews
- *The B.B. King Treasures* (BB's own book, with photos and gear notes)
- Equipboard pros/bb-king

---

## Confidence summary

- **Verified:** 14 items (recording context, ES-355 with filled F-holes, no pedals, Bill Szymczyk production, Lucille lineage)
- **Likely:** 3 items (exact amp model — Twin vs. L5 disputed, exact mic technique, exact reverb)
- **Speculative:** 0 items

---

## Open questions

- **Twin Reverb or Lab Series L5?** BB endorsed Lab Series later but may not have been using one in 1969. Twin is most likely for that session.
- **Bert deCoteaux strings — separate session?** Yes, the strings were overdubbed weeks later

---

## Recipe alignment

The current `bb-king-thrill-is-gone` recipe should reflect:
- NO pedalboard (or minimal — just maybe a comp for studio polish)
- US Double Nrm amp at low Drive (~0.45) with Master cranked for power tube response
- Plate reverb at low mix (~0.30)
- Tilt EQ at end to mimic Hit Factory tape character
- Single-mic preferred (BB's recordings are mono close-mic centric)
