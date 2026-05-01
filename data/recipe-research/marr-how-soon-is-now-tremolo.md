# Johnny Marr — "How Soon Is Now?" Pedalboard Research

**Recipe slug:** `marr-how-soon-is-now-tremolo`
**Last researched:** 2026-05-01
**Source confidence:** Verified (John Porter produced; Marr documented the rig in his book *Set the Boy Free*)

---

## Recording context

- **Album:** *Hatful of Hollow* (1984) compilation; recorded for the *William, It Was Really Nothing* sessions
- **Studio:** **Jam Studios**, London + **Park Gates Studios**, Hastings
- **Producer:** **John Porter**
- **Engineer:** John Porter
- Recording dates: July 1984

How Soon Is Now? is famous for ITS TREMOLO — a deep, hypnotic Fender Twin onboard tremolo, processed through complex signal chains. The tremolo is the song. Marr layered FOUR tracks of tremolo'd Telecaster to get the swirling, phasing depth.

---

## Guitar

- **Model:** **Fender Telecaster** — standard issue Tele (1980s era), the Smiths-era workhorse
- **Pickup:** **Bridge** for the rhythmic chime
- **Tuning:** **Open D6** — Marr tuned to D-A-D-F♯-A-D for this song specifically
  - Some sources say capo on 2nd fret as alternate
- **Strings:** Light .010s
- **Notable mods:** None — stock Tele
- **Era caveat:** Pre-Marr-signature-Jaguar era. Tele was the Smiths-era guitar.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | (none — tremolo is the AMP's onboard tremolo) | The Twin Reverb's vibrato circuit drives the trem | — | Verified |
| 2 | **MXR Phase 90** | Engaged on some passes | — | Possible |
| 3 | **Slide** (glass) | Slide overdubs on later passes | — | Possible |

**Notes:**
- The signature deep tremolo is the **Fender Twin Reverb's onboard vibrato** at maximum speed/depth
- John Porter PUSHED the tremolo to extreme settings — depth nearly maxed, speed at a fast moderate
- The "phasing" character is the result of FOUR overdubbed Tele tracks of tremolo, each slightly out of sync — creating chorus/phasing artifacts at the layer interfaces
- This is mostly an arrangement/multi-track technique, not pedal-driven

---

## Amp + Cab

- **Amp:** **Fender Twin Reverb** (1965 Blackface or Silverface) — Marr's primary Smiths studio amp
  - Channel: Vibrato (the tremolo channel), settings: Volume 5, Treble 7, Bass 5, Speed FAST, Intensity DEEP
- **Cab:** Twin's built-in 2x12 (Jensen C12N speakers)
- **Power tubes:** 6L6 quad
- **Modifications:** Stock

The Twin Reverb's bias-modulation tremolo (vibrato channel) creates a harder-edged, deeper trem than the optical tremolos in lower-tier Fenders. This tremolo character is key to the song.

---

## Microphones

- **Close mic:** **Shure SM57** close
- **Off-axis:** Possibly Sennheiser MD421
- **Room mic:** Jam Studios had a moderate room — possibly a Neumann U87 ~5 feet back

The "swirling" character of the recording is partly natural acoustic interaction between four overdubbed Tele takes, captured with similar mic placement each time.

---

## Technique notes

- **Right-hand attack:** Steady eighth-note pulse on muted strings — the rhythmic engine of the song
- **Open tuning:** D6 lets Marr play single-string melodies that ring against open strings, creating the harp-like hammer-on/pull-off patterns
- **Bend technique:** None — the song is rhythmic, not melodic
- **Volume knob:** Generally full
- **Layering technique:** Four tracks of tremolo guitar, each take slightly different in timing — the layered tremolos beat against each other to create the swirling effect

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Fender Twin onboard tremolo | **Bias Tremolo** (`HD2_ModulationBiasTremolo`) | Verified | Direct emulation of Fender bias-mod tremolo. Speed FAST, Depth ~0.85 |
| MXR Phase 90 | **Script Mod Phase** | Verified | Off most of song |
| Fender Twin Reverb | **US Double Vib** | Verified | Direct emulation. Drive=0.45 (clean) |
| Twin's 2x12 + C12N | **2x12 Double C12N** (`HD2_Cab2x12DoubleC12N`) | Verified, has WithPan | Direct match |
| SM57 + MD421 | Mic 0 + Mic 5 on cabSibling | Verified | Standard dual-mic |
| Spring reverb | **Spring** | Verified | Twin's onboard tank, low mix |

---

## Sources

- Wikipedia — *How Soon Is Now?* article
- Johnny Marr — *Set the Boy Free* (autobiography, 2016)
- John Porter producer interviews
- Equipboard pros/johnny-marr
- Premier Guitar Marr rig features

---

## Confidence summary

- **Verified:** 16 items (recording context, John Porter, Twin Reverb tremolo, Open D6 tuning, four-track overdubbing technique, Tele bridge pickup)
- **Likely:** 2 items (exact tremolo settings, exact mic technique)
- **Speculative:** 0 items

---

## Open questions

- **Capo or open D6 tuning?** Marr's autobiography clarifies open D6
- **Phase 90 or pure tremolo?** Marr has confirmed pure tremolo + multi-track layering for the swirling effect

---

## Recipe alignment

The current `marr-how-soon-is-now-tremolo` recipe should:
- Bias Tremolo DEFAULT-ON at FAST speed, deep depth — THE essential block
- US Double Vib amp at Drive 0.45 (clean)
- 2x12 Double C12N cab dual-mic with cabSibling
- Spring reverb low mix
- Tilt EQ at end for slight HF presence
- Open D6 tuning emphasis (recipe metadata — D-A-D-F♯-A-D)
- IDEAL: Multi-tap delay or phaser additional block to simulate the four-overdub-layered character
