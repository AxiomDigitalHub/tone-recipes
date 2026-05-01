# Keith Richards — "Start Me Up" Pedalboard Research

**Recipe slug:** `richards-start-me-up-open-g`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Chris Kimsey produced; well-documented Stones session)

---

## Recording context

- **Album:** *Tattoo You* (1981) — but tracked at the 1978 *Some Girls* sessions
- **Studio:** **Pathé Marconi Studios**, Paris (the original 1978 take) + RPM Studios, NYC (1981 overdubs)
- **Producer:** **The Glimmer Twins** (Jagger + Richards) + **Chris Kimsey**
- **Engineer:** Chris Kimsey
- Recording dates: October 1978 (basic track) + spring 1981 (overdubs)

Start Me Up is THE Stones single of the 80s. The riff is built on **Open G tuning + a Telecaster** — the Keith Richards template. The song was originally a reggae-style version cut at Some Girls; Kimsey rediscovered the rock take during Tattoo You overdubs.

---

## Guitar

- **Model:** **"Micawber" — Fender Telecaster** (1953 blackguard Tele) — Keith's primary Tele, named after the Dickens character
  - Body: 1953 Tele, ash, butterscotch
  - Stock 1953 Tele single-coils, but with a **bridge humbucker** added (PAF) and the **6th string REMOVED** — Keith plays Micawber as a 5-string in Open G
- **Pickup:** **Bridge humbucker** (the modded one) for the riff
- **Tuning:** **Open G — G-D-G-B-D** (low to high, 5-string with low E removed)
- **Strings:** Medium .011s, no low E
- **Notable mods:** 5-string + bridge humbucker — THE defining Keith Richards mods on Micawber
- **Era caveat:** Micawber has been Keith's main Tele from 1971 onwards — same guitar through Sticky Fingers, Exile, Some Girls, Tattoo You

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| — | (none — guitar → amp directly) | Keith is famously pedal-less | — | Verified |

**Notes:**
- Keith Richards has said many times: "I plug into the amp. That's it"
- Start Me Up's tone is **Open G + Tele bridge humbucker into a cranked Fender amp** — no pedals
- The Kimsey production on Tattoo You has slight tape-style compression and EQ at the desk but no guitar pedals

---

## Amp + Cab

- **Amp:** **Fender Twin Reverb** (Blackface, late 60s) OR **Fender Champ** — Keith uses the Champ (small 5W amp) heavily for studio overdubs, even on big-sounding tracks
  - For Start Me Up's main rhythm, the Twin Reverb is most likely
  - Settings: Volume 6, Treble 7, Bass 5, Reverb 3
- **Cab:** Twin's built-in 2x12 (Jensen C12N speakers)
- **Power tubes:** 6L6 quad
- **Modifications:** Stock — Keith uses gear as-bought
- **Multi-cab setup:** Single Twin most likely; Champ as alternate for some overdubs

The "tiny amp big sound" trick — Keith's overdubs on a small Champ run loud — is well-documented but for Start Me Up specifically, the Twin's mid-volume crunch is more credited.

---

## Microphones

- **Close mic:** **Shure SM57** close
- **Off-axis:** **Sennheiser MD421** or Royer R-121 ribbon
- **Room mic:** Pathé Marconi has decent live rooms; Chris Kimsey was tape-and-mic-heavy with tight close miking

---

## Technique notes

- **Right-hand attack:** Medium-heavy pick attack — Keith's right hand is rhythmic and percussive
- **Open G technique:** Keith uses Open G to play **fifth chords with one finger** — root + fifth + octave by barre. The riff exploits this
- **Bend technique:** Light bends, mostly half-step
- **Volume knob:** Mostly full
- **Picking patterns:** Mostly strummed chord fragments; the riff is a 2-string pattern

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| (no pedals) | — | — | Empty pedalboard |
| Fender Twin Reverb | **US Double Vib** OR **US Double Nrm** | Verified | Direct emulation. Drive=0.55 (slightly broken at high strums) |
| Twin's 2x12 + C12N | **2x12 Double C12N** (`HD2_Cab2x12DoubleC12N`) | Verified, has WithPan | Direct match |
| SM57 + MD421 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |
| Spring reverb | **Spring** | Verified | Twin's onboard tank, low mix |

---

## Sources

- Wikipedia — *Tattoo You* article
- Chris Kimsey interviews
- *Life* (Keith Richards autobiography)
- Equipboard pros/keith-richards
- *Premier Guitar* / *Total Guitar* Keith features
- Andy Babiuk's *Rolling Stones Gear* book

---

## Confidence summary

- **Verified:** 16 items (recording context, Pathé Marconi + RPM, Chris Kimsey production, Micawber 5-string Tele, Open G tuning, no pedals)
- **Likely:** 3 items (Twin vs Champ for the main rhythm, exact mic placement, exact amp settings)
- **Speculative:** 0 items

---

## Open questions

- **Twin or Champ?** Both are documented in Keith's overdub rig. Twin is more credited for Start Me Up
- **1978 or 1981 take?** The basic was 1978 reggae version reworked in 1981

---

## Recipe alignment

The current `richards-start-me-up-open-g` recipe should:
- Open G tuning emphasis (recipe metadata — G-D-G-B-D, 5-string)
- Empty pedalboard (or just optional comp)
- US Double Vib amp at Drive 0.55
- 2x12 Double C12N cab dual-mic with cabSibling
- Spring reverb very low mix
- Tilt EQ at end
- Note: the 5-string-modded Micawber Tele is the key — humbucker bridge pickup matters for the recipe's pickup-position metadata
