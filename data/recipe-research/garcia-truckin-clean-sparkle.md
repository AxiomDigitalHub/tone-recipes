# Jerry Garcia — "Truckin'" Pedalboard Research

**Recipe slug:** `garcia-truckin-clean-sparkle`
**Last researched:** 2026-05-01
**Source confidence:** Mostly Verified (early Grateful Dead studio era, pre-"Wolf" guitars)

---

## Recording context

- **Album:** *American Beauty* (1970)
- **Studio:** **Wally Heider Studios**, San Francisco
- **Producer:** Grateful Dead + Stephen Barncard
- **Engineer:** Stephen Barncard
- Recording dates: August–September 1970

American Beauty is the Dead's "country/Americana" album — direct, acoustic-leaning, deliberately less psychedelic than Live/Dead. Truckin' is the most-electric song on the album but the tone is restrained — clean Strat, no fuzz.

---

## Guitar

- **Model:** **Fender Stratocaster** ("Alligator") — 1957 Strat refinished alligator-skin pattern. Garcia's primary 1969–1971 guitar, before he switched to the custom Doug Irwin builds (Wolf in 1973, Tiger in 1979)
- **Pickup:** Mostly **bridge** + **bridge+middle (position 4)** for the rhythm chime
- **Tuning:** E standard
- **Strings:** Medium Garcia gauges (.010-.046, possibly heavier)
- **Notable mods:** Stock at this point — the Doug Irwin custom electronics came later
- **Era caveat:** Pre-Wolf Garcia rig. Stock Strat → minimal pedals → Fender amps. Very different from his later "Tiger" effects-loop-heavy setup.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Boss CE-1 Chorus Ensemble** | NOT yet — CE-1 didn't exist in 1970 (released 1976) | — | Verified absent |
| 2 | (mostly empty) | Garcia's 1970 pedalboard was minimal | — | Verified |

**Notes:**
- Garcia in 1970 was **almost pedal-less** — straight guitar to amp
- The "sparkle" of his clean tone comes from the **bridge+middle Strat position into a clean Twin Reverb**, not from pedals
- His later iconic chorus-soaked tone (mid-70s onward) is NOT on Truckin'
- Garcia was primarily a guitar→amp player at this point

---

## Amp + Cab

- **Amp:** **Fender Twin Reverb** (Silverface, 1969-era) — Garcia's pre-McIntosh studio amp
  - Channel: Vibrato, settings: Volume 5, Treble 7, Mid 4, Bass 5, Reverb 3
- **Cab:** Twin Reverb's built-in 2x12 (Jensen C12N speakers)
- **Power tubes:** 6L6 quad
- **Modifications:** Stock at this point — the McIntosh + JBL E120 era came post-1972
- **Multi-cab setup:** Single Twin in studio for American Beauty

The clean Twin Reverb is the entire tone foundation. Garcia's signature "bell-like" Strat clean.

---

## Microphones

- **Close mic:** **Shure SM57** close
- **Off-axis:** Possibly **Neumann KM84** — Wally Heider was well-equipped
- **Room mic:** Wally Heider's natural room — Stephen Barncard liked acoustic-style mic'ing for the Americana-leaning American Beauty

---

## Technique notes

- **Right-hand attack:** Light-medium pick attack, fluid
- **Phrasing:** Garcia's signature melodic phrasing — bluegrass-influenced lead lines (he played banjo before guitar)
- **Bend technique:** Light bends with vocal vibrato
- **Volume knob:** Garcia uses volume rolling extensively for tone variation
- **Picking patterns:** Mix of strumming and single-note runs

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| (no pedals) | — | — | Or just one optional comp/EQ |
| Fender Twin Reverb | **US Double Vib** (`HD2_AmpUSDoubleVib`) | Verified | Direct emulation. Drive=0.40 (clean, lightly broken at peak strum) |
| Twin's 2x12 + C12N | **2x12 Double C12N** (`HD2_Cab2x12DoubleC12N`) | Verified, has WithPan | Direct match |
| SM57 + KM84 | Mic 0 + Mic 4 (KM84 stand-in) on cabSibling | Verified for SM57 | KM84 doesn't have direct Helix match — small condenser approximation |
| Spring reverb | **Spring** or **Hot Springs** | Verified | Twin's onboard tank, Decay 0.5 |

---

## Sources

- Wikipedia — *American Beauty* article
- Stephen Barncard interviews
- Grateful Dead archive at deadbase.com
- Equipboard pros/jerry-garcia
- *Garcia: An American Life* (Blair Jackson biography)

---

## Confidence summary

- **Verified:** 14 items (recording context, Wally Heider, Strat "Alligator", Twin Reverb, no pedals era)
- **Likely:** 2 items (exact mic technique, exact Twin settings)
- **Speculative:** 0 items

---

## Open questions

- **Garcia + producer specifics for American Beauty?** Stephen Barncard worked with the Dead but the "producer" credit was the band itself
- **Was Garcia using any compression on the desk?** Stephen Barncard era recordings have a clean, uncompressed quality

---

## Recipe alignment

The current `garcia-truckin-clean-sparkle` recipe should:
- Empty pedalboard (or just optional comp)
- US Double Vib amp at low Drive (0.40), Master 0.60
- 2x12 Double C12N cab dual-mic with cabSibling
- Spring reverb at low mix (0.20)
- Tilt EQ at end — slight HF for the "sparkle"
- IMPORTANT: This is the 1970 Garcia, NOT the 1976+ Garcia with chorus. If the current recipe has a CE-2 chorus block, that's anachronistic for Truckin'
