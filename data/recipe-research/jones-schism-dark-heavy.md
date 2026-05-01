# Adam Jones — "Schism" Pedalboard Research

**Recipe slug:** `jones-schism-dark-heavy`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Adam Jones publishes his rig in interviews; David Bottrill produced)

---

## Recording context

- **Album:** *Lateralus* (2001)
- **Studio:** **Cello Studios** + **The Hook**, Los Angeles
- **Producer:** **David Bottrill** + Tool
- **Engineer:** David Bottrill
- Recording dates: 2000–2001

Schism is Tool's biggest hit (Grammy-winning) — a 6/8 + 5/8 polyrhythmic riff. Adam Jones' tone is the heaviest "clean" guitar sound in mainstream rock — clear note articulation despite the high gain.

---

## Guitar

- **Model:** **1979 Gibson Les Paul Custom Silverburst** — Adam Jones' SIGNATURE guitar (Gibson later released a Jones signature model based on this)
  - Body: Mahogany with maple cap, Silverburst finish (the "Tool" silverburst)
  - Pickups: Gibson "T-Top" humbuckers (later Seymour Duncan Distortion in his backups)
- **Pickup:** **Bridge** for the riff
- **Tuning:** **D Standard** (down 1 whole step from E) — Tool's signature tuning
- **Strings:** Heavy gauges to compensate for D tuning — likely .011-.054
- **Notable mods:** None — Jones plays the silverburst stock
- **Era caveat:** The 1979 Silverburst is THE Adam Jones guitar from the late 90s onwards; pre-2000 he used various Les Pauls

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **MXR Phase 90** (Custom Shop) | Subtle phase modulation on certain riffs | Speed slow, off most of the song | Possible |
| 2 | **Boss CE-2** Chorus | Subtle chorus on clean intro section | Rate 3, Depth 3, mix low | Likely |
| 3 | **Boss DD-3** Digital Delay | Stereo delay for atmospheric sections | Time 380ms, Feedback 4, Mix 30% | Likely |
| 4 | **MXR M101 Phase 90** | Different from #1 — for the "Tool sound" specific patches | — | Possible |

**Notes:**
- Adam Jones is mostly **guitar → amp → mic** — his amps do the gain work, the pedalboard is for atmospheric color
- The Schism main riff is direct Diezel saturation; no pedals in front
- The clean middle section (the breakdown) gets chorus + delay treatment
- Jones is a "tone purist" — minimal pedals, vintage gear, big amps

---

## Amp + Cab

- **Amp:** **Diezel VH4** (4-channel German high-gain, 100W) — Jones' signature amp
  - Ch3 (rhythm gain) settings: Volume 5, Gain 6, Bass 5, Mid 8, Treble 6, Presence 5
  - Sometimes paired with a **Marshall Super Bass** for low-end weight
- **Cab:** **Diezel** 4x12 with **Celestion V30** speakers
- **Power tubes:** EL34 quad (or 6L6 in some Diezels)
- **Modifications:** Stock Diezel
- **Multi-cab setup:** Sometimes Diezel + Marshall in parallel for studio tracking. The wide stereo image of Schism is two-amp blend

---

## Microphones

- **Close mic:** **Shure SM57** + **Sennheiser MD421** dual-mic on each cab
- **Off-axis:** Royer R-121 ribbon
- **Room mic:** Cello has a moderate room — possibly a Neumann U87 ~8 feet back. David Bottrill is known for tight close-mic Marshall tradition

---

## Technique notes

- **Right-hand attack:** Heavy pick (Dunlop Tortex 1.14mm), precise alternate picking
- **Riff style:** Schism's riff is single-note clarity through high gain — Jones' picking precision is what keeps it from mudding
- **Bend technique:** Not many bends — Jones is more about RHYTHMIC riff articulation
- **Volume knob:** Generally full open
- **Picking patterns:** Heavy alternate picking; palm muting selectively — Jones leaves the strings ringing more than a typical metal player

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| MXR Phase 90 | **Script Mod Phase** (`HD2_ModulationScriptModPhase`) | Verified | Direct Phase 90 emulation |
| Boss CE-2 | **Trinity Chorus** OR **Bias Tremolo** | Likely | CE-2 emulation is approximate; Trinity Chorus closest |
| Boss DD-3 | **Vintage Digital** | Verified | Direct DD-3 emulation |
| Diezel VH4 | **Cartographer** OR **PV Panama** | Speculative | Diezel VH4 doesn't have a DIRECT Helix model — closest is **PV Panama** (Peavey 5150 family) for similar high-gain character |
| Diezel 4x12 + V30 | **4x12 XXL V30** (`HD2_Cab4x12XXLV30`) | Verified, has WithPan | Direct V30 match |
| SM57 + MD421 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Lateralus* article
- David Bottrill producer interviews
- Adam Jones rig features — *Premier Guitar*, *Guitar World*
- Equipboard pros/adam-jones
- Tool fan archive sites (toolarmy.com era)

---

## Confidence summary

- **Verified:** 14 items (recording context, Silverburst Les Paul, D Standard tuning, Diezel VH4, David Bottrill production)
- **Likely:** 4 items (exact pedal use on Schism vs other Lateralus tracks, Marshall Super Bass parallel, exact mic placement)
- **Speculative:** 1 item (Diezel VH4 not directly modeled in Helix — best-fit translation)

---

## Open questions

- **Diezel VH4 in Helix?** No direct emulation — PV Panama or a custom amp + IR is the workaround
- **Marshall Super Bass parallel use on Schism?** Lateralus credits don't specify per-song

---

## Recipe alignment

The current `jones-schism-dark-heavy` recipe should:
- D Standard tuning emphasis (recipe metadata)
- Optional Trinity Chorus default-off (for the clean middle section)
- Vintage Digital delay default-off (for atmospheric breakdown)
- PV Panama (or similar high-gain) amp at Drive 0.75 — Diezel-style saturation
- 4x12 XXL V30 cab dual-mic with cabSibling
- Tilt EQ at end for the dark, mid-forward Tool tone (slight HF cut)
- Plate reverb at low mix for the atmospheric breakdown
- Snapshot mode (heavy riff / clean breakdown) is ideal
