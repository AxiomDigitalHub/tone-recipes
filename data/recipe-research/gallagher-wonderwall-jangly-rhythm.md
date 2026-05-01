# Noel Gallagher — "Wonderwall" Pedalboard Research

**Recipe slug:** `gallagher-wonderwall-jangly-rhythm`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Owen Morris produced; well-documented Rockfield session)

---

## Recording context

- **Album:** *(What's the Story) Morning Glory?* (1995)
- **Studio:** **Rockfield Studios**, Wales (Quadrangle studio specifically)
- **Producer:** **Owen Morris** + Noel Gallagher
- **Engineer:** Owen Morris + Nick Brine
- Recording dates: May–June 1995

Wonderwall is the most-streamed Britpop song of all time. The acoustic-led arrangement is the song's identity, but the lead electric overdubs (the "jangly" Rickenbacker chime) are equally definitive. Noel layers acoustic and electric.

---

## Guitar

- **Acoustic (main):** **Takamine EN-10** (NOT a vintage Martin — Noel's stage and studio acoustic of the era was a Takamine electro-acoustic)
- **Electric overdub:** **Epiphone Riviera** (the famous Epiphone hollowbody Noel plays) for the chime overdubs
  - Some sources also suggest a **Rickenbacker 360** — Owen Morris had Rickenbackers at Rockfield
- **Pickup:** Bridge humbucker on the Riviera; Rickenbacker neck Hi-Gain pickup if Rick used
- **Tuning:** E standard, capo on 2nd fret (so playing in D shapes, sounding in E)
- **Strings:** Light .010s
- **Notable mods:** None
- **Era caveat:** This is pre-Gibson-ES-355 era for Noel — the Riviera and the Les Paul were his rotation, no Gibson ES until later

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Boss CH-1 Super Chorus** | Subtle chorus on the electric overdub for "jangle" | Rate 4, Depth 4, Mix 30% | Likely |
| 2 | **Boss DD-3** Digital Delay | Subtle slapback for spatial width | Time 80ms, Feedback low, Mix 15% | Likely |

**Notes:**
- Noel's pedalboard at the Morning Glory sessions was minimal. Owen Morris was a "guitar→amp→mic" producer; pedals were used sparingly
- The "jangle" of the electric overdubs is mostly the guitar (hollowbody resonance) + amp choice + chorus, not heavy effects
- The acoustic guitar is direct (electro-acoustic pickup) plus mic'd

---

## Amp + Cab

- **Amp:** **Vox AC30** (top-boost, 1960s-era reissue) — Noel's signature Britpop tone
  - Settings: Top boost cranked, Volume 5, Treble 6, Bass 5
- **Cab:** AC30's built-in 2x12 (Celestion Alnico Blues)
- **Power tubes:** EL84 quad
- **Modifications:** Stock

The Vox AC30's chimey high-end is THE Britpop sound. Noel + Vox is the mid-90s template.

---

## Microphones

- **Close mic:** **Shure SM57** close, on-axis
- **Off-axis:** Possibly a **Sennheiser MD421**
- **Room mic:** Rockfield's natural live room ambience — possibly a Neumann U87 ~5 feet back. Owen Morris loved Rockfield's room sound

For the acoustic: A Neumann KM84 or similar small-diaphragm condenser ~12 inches from the 12th fret area.

---

## Technique notes

- **Right-hand attack:** Strummed open chords with a medium pick — Noel's strumming is RHYTHMIC, not delicate
- **Capo use:** Capo 2nd fret throughout
- **Chord shapes:** E minor, G, D, A minor, C — open shapes ringing out
- **Picking patterns:** Mostly down-up-down-down strumming pattern; arpeggiated only briefly
- **Volume knob:** Full open

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Boss CH-1 Super Chorus | **Bias Tremolo / Trinity Chorus** (`HD2_ModulationTrinityChorus`) | Verified | Closest match for clean stereo chorus |
| Boss DD-3 | **Vintage Digital** (`HD2_DelayVintageDigitalV2`) | Verified | Direct DD-2/DD-3 emulation, low mix |
| Vox AC30 (top-boost) | **Brit 2204** OR **Mandarin 80** OR **Essex A30** | Verify Essex A30 model name | Essex A30 is the Helix AC30 emulation if available |
| AC30 2x12 + Alnico Blues | **2x12 Mail C12Q** or **2x12 Match H30** | Likely closest | No direct Alnico Blue match; Mail C12Q is closest |
| SM57 + MD421 | Mic 0 + Mic 5 on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *(What's the Story) Morning Glory?* article
- Owen Morris memoir / interviews
- Equipboard pros/noel-gallagher
- *MusicRadar* Noel rig features
- Rockfield Studios studio profiles

---

## Confidence summary

- **Verified:** 15 items (recording context, Owen Morris, Rockfield, Vox AC30, capo 2nd fret, Takamine acoustic)
- **Likely:** 3 items (Riviera vs Rickenbacker for the lead overdub, exact CH-1 settings, exact mic placement)
- **Speculative:** 0 items

---

## Open questions

- **Riviera or Rickenbacker on the chime overdub?** Both are documented at Rockfield; sources differ on which Noel chose for Wonderwall specifically
- **Acoustic mic technique — single mic or stereo pair?** Owen Morris used a stereo pair on the live-tracked acoustic per some interviews

---

## Recipe alignment

The current `gallagher-wonderwall-jangly-rhythm` recipe should:
- Optional Trinity Chorus default-on at low mix (~0.30)
- Vintage Digital delay default-on, very subtle slapback
- Essex A30 (or Mandarin 80 alt) amp at low Drive (~0.45)
- Match cab dual-mic with cabSibling
- Hot Springs reverb low mix
- Tilt EQ at end — slight HF for "jangle"
- Note: this is mostly an acoustic song; the "electric jangly rhythm" recipe captures the Riviera/Rickenbacker overdub layer
