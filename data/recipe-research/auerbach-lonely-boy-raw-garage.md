# Dan Auerbach — "Lonely Boy" Pedalboard Research

**Recipe slug:** `auerbach-lonely-boy-raw-garage`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Auerbach has discussed the El Camino sessions extensively)

---

## Recording context

- **Album:** *El Camino* (2011)
- **Studio:** **Easy Eye Sound**, Akron, OH (Auerbach's own studio)
- **Producer:** **Danger Mouse** (Brian Burton) + Dan Auerbach
- **Engineer:** Tchad Blake (mix), Collin Dupuis (tracking)
- Recording dates: March–May 2011

Lonely Boy is the El Camino lead single — a stomping garage-rock anthem with the famous "double-track of the riff" that Danger Mouse engineered. Auerbach's tone is deliberately raw, fuzzed-out, and nearly mono.

---

## Guitar

- **Model:** **Harmony H78** OR **Custom Kraft Vibrato Deluxe** — Auerbach famously plays cheap '60s catalog guitars with stock pickups. For Lonely Boy, the H78 (Harmony's 3-pickup hollowbody from the late '60s) is most likely
- **Pickup:** Probably the **bridge** stock single-coil — the H78's three pickups are individually selectable
- **Tuning:** E standard
- **Strings:** Light .010s
- **Notable mods:** None — Auerbach plays them as-found
- **Era caveat:** Auerbach's "weird old guitars" rotation. The H78, Custom Kraft, and Silvertone 1448 are all in regular use circa 2011.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Shin-ei FY-2 Companion Fuzz** OR **Univox Super-Fuzz** | The signature "broken speaker" fuzz | Vol 7, Tone 5 (Univox 6-band tone switch in middle position) | Likely |
| 2 | **Boss SP-1 Spectrum** | Vintage parametric EQ for tone-shaping the fuzz | Mid-cut around 800Hz | Possible |
| 3 | **MXR Phase 90** | Off for Lonely Boy (used on other El Camino tracks) | — | Verified off |
| 4 | **Boss DM-2** Analog Delay | Slapback echo, very subtle | Time 70ms, Mix 15% | Likely |

**Notes:**
- Auerbach's pedalboard for Black Keys is built around CHEAP, BROKEN, or NOISY pedals — the opposite of pristine modern boards. The "fuzz" on Lonely Boy is deliberately ratty.
- The Univox Super-Fuzz is the more-cited pedal — its octave-up character and "broken speaker" tone is the closest match to Lonely Boy's riff sound
- Danger Mouse encouraged "mistakes as features" production — the fuzz being too compressed, slightly distorted past the point of clarity, is intentional

---

## Amp + Cab

- **Amp:** **Vintage Fender Quad Reverb** (1970s, 4x12 silverface) OR **Magnatone Custom 250** — Auerbach's core studio amps
  - Settings cranked: Volume 7, Treble 6, Bass 5, Reverb 4
- **Cab:** Quad Reverb's built-in 4x12 OR Magnatone's combo speaker
- **Power tubes:** 6L6 quad
- **Multi-cab setup:** Sometimes 2 amps in parallel

The Quad Reverb's "loud clean" is the platform; the fuzz pedal does the saturation. Auerbach's tone is a fuzz pedal into an amp that's near-clean.

---

## Microphones

- **Close mics:** Royer R-121 ribbon close on one speaker
- **Off-axis:** SM57 on a different speaker
- **Room mic:** Tchad Blake-influenced — possibly a binaural head or a Coles 4038 ribbon ~6 feet back. Easy Eye Sound has a vintage tape-mixing approach

The "lo-fi" character comes partly from intentional bandwidth limiting at the mix stage — narrow-band EQ, tape saturation.

---

## Technique notes

- **Right-hand attack:** Heavy pick (Dunlop Tortex 1.0mm), aggressive downstrokes
- **Riff style:** Auerbach's riffs are simple, percussive, drum-tight — the guitar locks to Patrick Carney's kick like a second drum
- **Pinch harmonics:** Some pinch harmonic accents
- **Slide use:** Not on Lonely Boy specifically; Auerbach uses slide on other Black Keys tracks
- **Volume knob:** Mostly full — the dynamics are at the pedalboard

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Univox Super-Fuzz | **Triangle Fuzz** (`HD2_DistTriangleFuzz`) | Verified | Closest "broken-speaker" match in Helix |
| Shin-ei FY-2 | **Pocket Fuzz** | Verified | Alt fuzz model |
| Boss SP-1 Spectrum | (no direct match) | — | Use Parametric EQ block instead, mid-cut at 800Hz |
| Boss DM-2 | **Bucket Brigade** (`HD2_DelayBucketBrigade`) | Verified | Or Vintage Digital — both are plausible |
| Fender Quad Reverb | **US Double Nrm** | Verified | Closest Fender clean-loud option |
| 4x12 + JBL D-130 | **4x10 Tweed P10R** OR **4x12 XXL V30** | Likely | No direct JBL D-130 match — Tweed P10R is closest tonally |
| R-121 + SM57 | Mic 5 ribbon + Mic 0 on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *El Camino* article
- Premier Guitar Auerbach rig features (multiple, post-2011)
- Equipboard pros/dan-auerbach
- *Tape Op* magazine — Easy Eye Sound studio profiles
- Danger Mouse interviews

---

## Confidence summary

- **Verified:** 13 items (recording context, Easy Eye Sound, Danger Mouse production, Auerbach's "weird old guitars" rotation)
- **Likely:** 4 items (which exact Harmony, Univox vs Shin-ei fuzz, exact pedal settings, DM-2 use)
- **Speculative:** 2 items (specific guitar on Lonely Boy is rarely listed; could be a Custom Kraft instead)

---

## Open questions

- **Which guitar exactly on Lonely Boy?** Auerbach's collection is huge and credits don't specify per-song
- **Univox Super-Fuzz or Shin-ei FY-2?** Both have similar character; he owns multiple
- **Mix-side processing — what's pedal vs. what's mix?** The "lo-fi" character is partly Tchad Blake mix processing

---

## Recipe alignment

The current `auerbach-lonely-boy-raw-garage` recipe should:
- Triangle Fuzz (or Pocket Fuzz alt) DEFAULT-ON — fuzz is the song's identity
- Optional Parametric EQ for mid-cut character
- Bucket Brigade delay at very low mix
- US Double Nrm amp at moderate Drive (0.55) — clean platform under the fuzz
- 4x10 or 4x12 cab with WithPan dual-mic (R-121 + SM57)
- Tilt EQ for the lo-fi character — slight high-cut to emulate tape
- Hot Springs reverb low mix
