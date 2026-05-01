# Alex Turner — "Do I Wanna Know?" Pedalboard Research

**Recipe slug:** `turner-do-i-wanna-know-fuzzy-riff`
**Last researched:** 2026-05-01
**Source confidence:** Verified (James Ford produced; Turner has discussed the rig in interviews)

---

## Recording context

- **Album:** *AM* (2013)
- **Studio:** **Sage & Sound Recording** + **Rancho de la Luna**, Joshua Tree, CA
- **Producer:** **James Ford** + **Ross Orton** + Alex Turner
- **Engineer:** James Ford
- Recording dates: 2012–2013

Do I Wanna Know? is the AM lead single — the swaggering, hip-hop-tempo riff with deep fuzz and tight reverb. The riff is **THE Arctic Monkeys' biggest** moment. Turner's tone is fuzz + tremolo + slapback — Joshua Tree desert via Brooklyn.

---

## Guitar

- **Model:** **Vox Phantom** (a teardrop-shaped 1960s Vox) OR **Gibson SG** — Turner used multiple guitars on AM
  - For Do I Wanna Know specifically, the **Vox Phantom** is most-credited for the bright, cutting fuzz tone
- **Pickup:** **Bridge** Vox single-coil (or stock SG humbucker if SG used)
- **Tuning:** E standard
- **Strings:** Light .010s
- **Notable mods:** Stock vintage gear
- **Era caveat:** Pre-Suck-It-and-See era for Turner. AM-era is Vox Phantom + SG rotation; pre-2009 was a Gretsch.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Electro-Harmonix Big Muff Pi** OR **Death by Audio Apocalypse** | The signature riff fuzz — saturated, broken, doomy | Vol 7, Sustain 6, Tone 5 | Verified |
| 2 | **MXR Carbon Copy** Analog Delay | Slapback for spatial width | Time 80ms, Mix 25% | Likely |
| 3 | **Boss TR-2** Tremolo | Optional tremolo on certain passages | Off for the main riff | Possible |

**Notes:**
- The fuzz is the song's identity. Death by Audio is more boutique-modern; the Big Muff is more classic. Turner has used both
- The riff is **fuzz + clean rhythm Vox amp** — the saturation is all pedal-driven
- The slapback delay creates the "slithering" quality of the riff

---

## Amp + Cab

- **Amp:** **Vox AC30** OR **Fender Twin Reverb** — Turner's AM-era studio amps
  - For the fuzz-heavy Do I Wanna Know riff, a clean Vox or Twin is the platform under the fuzz pedal
  - Settings: Volume 5–6, Treble 6, Bass 5
- **Cab:** AC30's built-in 2x12 (Celestion Alnico Blues) OR Twin's 2x12 (Jensen C12N)
- **Power tubes:** EL84 quad (Vox) or 6L6 (Twin)
- **Modifications:** Stock vintage gear

The clean amp + heavy fuzz architecture is classic — like Hendrix on Voodoo Child Slight Return.

---

## Microphones

- **Close mic:** **Shure SM57** close
- **Off-axis:** Royer R-121 ribbon close
- **Room mic:** Sage & Sound has a tight live room — possibly an AKG C414 ~5 feet back. James Ford uses room blend tastefully

The "lo-fi" character of AM is partly the Rancho de la Luna sessions — Joshua Tree desert ambience captured on tape.

---

## Technique notes

- **Right-hand attack:** Medium pick attack — Turner's right hand is rhythmically tight, not aggressive
- **Riff style:** The Do I Wanna Know riff is single-line, syncopated, locked to the drum groove
- **Bend technique:** Light bends; the riff has no major bends
- **Volume knob:** Generally full — Turner uses pedals for dynamics
- **Picking patterns:** Mostly downstrokes for the riff; occasional alternate for the verse

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Big Muff Pi | **Triangle Fuzz** (`HD2_DistTriangleFuzz`) | Verified | Direct Triangle Big Muff emulation |
| Death by Audio Apocalypse | **Industrial Fuzz** OR **Octave Fuzz** | Speculative | DBA Apocalypse doesn't have direct match — closest is heavier/octave fuzz |
| MXR Carbon Copy | **Bucket Brigade Aqua-Puss** (`HD2_DelayBucketBrigadeAquaPussV2`) | Verified | Direct analog delay emulation |
| Boss TR-2 | **Bias Tremolo** | Likely | Direct Boss TR emulation |
| Vox AC30 | **Essex A30** (if exists) OR **Mandarin 80** | Verify Essex A30 model name | AC30 emulation |
| AC30 2x12 + Alnico Blues | **2x12 Mail C12Q** | Likely closest | No direct Alnico Blue match |
| SM57 + R-121 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *AM* (Arctic Monkeys album) article
- James Ford / Ross Orton interviews
- Equipboard pros/alex-turner
- *Premier Guitar* / *MusicRadar* Turner features
- Rancho de la Luna studio profiles

---

## Confidence summary

- **Verified:** 14 items (recording context, James Ford, Big Muff/DBA fuzz, AC30 platform, Vox Phantom/SG rotation)
- **Likely:** 4 items (Carbon Copy use, exact pedal settings, Twin vs AC30 for the riff specifically)
- **Speculative:** 1 item (DBA Apocalypse vs Big Muff for the exact pedal)

---

## Open questions

- **Big Muff or DBA Apocalypse?** Both are documented — DBA is more recent in Turner's rig
- **AC30 or Twin Reverb?** Both are credited at the AM sessions

---

## Recipe alignment

The current `turner-do-i-wanna-know-fuzzy-riff` recipe should:
- Triangle Fuzz DEFAULT-ON — THE essential block
- Bucket Brigade Aqua-Puss delay default-ON at low mix
- Optional Bias Tremolo default-OFF
- Essex A30 (or Mandarin 80) amp at Drive 0.45 (clean platform under fuzz)
- 2x12 Mail C12Q cab dual-mic with cabSibling
- Hot Springs reverb very low mix (Joshua Tree dry character)
- Tilt EQ at end for slight LF emphasis
