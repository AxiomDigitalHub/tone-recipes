# Josh Homme — "No One Knows" Pedalboard Research

**Recipe slug:** `homme-no-one-knows-detuned-desert`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Eric Valentine produced; multiple Homme rig features)

---

## Recording context

- **Album:** *Songs for the Deaf* (2002)
- **Studio:** Cello Studios, Hollywood, CA + various
- **Producer:** **Josh Homme** + **Adam Kasper** + Eric Valentine (mixing)
- **Engineer:** Adam Kasper
- Recording dates: October 2001 – April 2002

No One Knows is QOTSA's biggest hit — Dave Grohl drumming, Mark Lanegan vocals, Homme's signature detuned riff. The "desert rock" tone is the result of low-tuning + maple-fretboard guitars + cranked Ampeg/Fender amps with no mid-scoop.

---

## Guitar

- **Model:** **Maton BB1200** (an Australian-made hollowbody, Homme's primary QOTSA guitar)
  - Body: chambered hollowbody with f-holes
  - Pickups: Maton-branded humbuckers (P90-flavored)
- **Pickup:** **Bridge humbucker** for the riff
- **Tuning:** **C Standard** (down 2 whole steps from E) — the "desert" detuning is fundamental
- **Strings:** Heavy gauges to compensate for low tuning — likely .012-.054 or heavier
- **Notable mods:** None — Homme plays the Maton stock
- **Era caveat:** This is THE Maton BB1200 era for Homme — he's used the same guitar (with backups) from 2000 onwards

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Boss SD-1** Super Overdrive | Mid-bump push into amp | Drive 4, Tone 7, Level 7 | Likely |
| 2 | **Boss DM-2** Analog Delay | Subtle echo on solos | Time 250ms, Feedback low, Mix 15% | Possible |
| 3 | **MXR Carbon Copy** OR **MXR Phase 90** | Various effects on different tracks | — | Possible per song |

**Notes:**
- Homme's pedalboard is medium-sized and centered on **Boss pedals + MXR**
- The riff tone for No One Knows is mostly **Maton + Ampeg = clean fuzzy** — the Ampeg's natural breakup at high volume is the saturation
- The SD-1 may bump it slightly; the rest of the pedals are for ear candy
- Homme has said he likes "stupid" gear — Boss pedals, vintage Ampegs, simple signal chains

---

## Amp + Cab

- **Amp:** **Ampeg VT-40** (4x10 combo) — Homme's signature amp. Old solid-state Ampeg from the late '60s
  - Plus a **Fender Bassman** (head + 2x12 cab) sometimes paralleled
  - Settings: Volume cranked (7), Bass 6, Mid 7, Treble 6
- **Cab:** Ampeg VT-40's built-in 4x10 + Bassman 2x12
- **Power tubes:** Ampeg VT-40 is solid-state; Bassman is 6L6
- **Modifications:** Stock vintage gear
- **Multi-cab setup:** Ampeg + Bassman parallel for studio tracking

The Ampeg VT-40 is a weird, bright, slightly-broken amp — its character is part of the QOTSA sound. The mid-forward EQ + the C Standard tuning = the "desert rock" frequency stack.

---

## Microphones

- **Close mic:** **Shure SM57** on each amp
- **Off-axis:** Possibly Royer R-121 ribbon
- **Room mic:** Cello Studios has a moderate room — possibly a Neumann U67 ~5 feet back

---

## Technique notes

- **Right-hand attack:** Heavy pick (Dunlop Tortex 1.0mm), aggressive
- **Riff style:** The No One Knows riff is built on the open low C (after detuning) — a big, percussive attack on the low string
- **Bend technique:** Wide bends, sometimes on the 6th string in C tuning (very loose, easy to bend)
- **Volume knob:** Generally full open
- **Picking patterns:** Heavy alternate picking, no muting in the riff

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Boss SD-1 | **Compulsive Drive** OR **Scream 808** | Verified | SD-1 is similar to TS — Scream 808 is closest |
| Boss DM-2 | **Bucket Brigade** | Verified | Direct emulation, low mix |
| MXR Carbon Copy | **Cosmos Echo** OR **Bucket Brigade** | Verified | Carbon Copy is a Bucket Brigade analog delay |
| Ampeg VT-40 | (no direct match) | Speculative | Closest is **Solo Lead** (`HD2_AmpSoloLead`) for solid-state character; or use a clean Fender + parametric EQ |
| Fender Bassman | **Tweed Blues Nrm** | Verified | Direct Bassman emulation |
| 4x10 + 2x12 | **4x10 Tweed P10R** + **2x12 Match H30** | Verified, both have WithPan | Approximate dual-cab |
| SM57 + R-121 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Songs for the Deaf* article
- Premier Guitar Homme rig features (multiple)
- Equipboard pros/josh-homme
- *Guitar World* QOTSA features
- Adam Kasper interviews

---

## Confidence summary

- **Verified:** 14 items (recording context, Maton BB1200, C Standard tuning, Ampeg VT-40, Adam Kasper)
- **Likely:** 3 items (exact pedalboard config for No One Knows specifically, Bassman parallel use, mic technique)
- **Speculative:** 1 item (which exact Ampeg model — VT-40 most-cited but Homme has used VT-22 and others)

---

## Open questions

- **Ampeg VT-40 or VT-22?** Both are documented in his rig at different times
- **Bassman as parallel or alternate?** Some sources say single-amp tracking on No One Knows

---

## Recipe alignment

The current `homme-no-one-knows-detuned-desert` recipe should:
- C Standard tuning emphasis (recipe metadata, NOT in the helix block — but note it)
- Optional Scream 808 or Compulsive Drive default-on at low Drive
- Solo Lead amp (or Tweed Blues alternate) at moderate Drive 0.65
- 4x10 Tweed P10R cab dual-mic with cabSibling
- Tilt EQ at end — slight HF cut for the "desert" warmth
- Hot Springs reverb very low mix (Homme's tones are dry)
