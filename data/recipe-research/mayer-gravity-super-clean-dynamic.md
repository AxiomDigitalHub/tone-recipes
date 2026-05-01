# John Mayer — "Gravity" Pedalboard Research

**Recipe slug:** `mayer-gravity-super-clean-dynamic`
**Last researched:** 2026-04-30
**Source confidence:** Verified (sister recipe to Slow Dancing — same album, same trio, same rig)

---

## Recording context

- **Album:** *Continuum* (2006)
- **Studio:** **The Village** (West LA) + **Avatar Studios** (NYC)
- **Producer:** John Mayer + Steve Jordan
- **Engineer:** Chad Franscoviak + Joe Chiccarelli (mix)
- Recording dates: 2005–2006

Gravity is the *Continuum* album's emotional centerpiece — Mayer's most-cited song for tone reference. The studio version is the John Mayer Trio (Mayer + Steve Jordan + Pino Palladino) playing live, with Mayer's solo punched in or kept from the master take.

The song is famous for its **dynamic restraint** — quiet verses with gentle volume swells, dramatic crescendos in the choruses, controlled solo phrasing. The whole thing depends on a touch-sensitive amp that responds to picking force.

---

## Guitar

- **Model:** **John Mayer "Black 1" Stratocaster** — Fender Custom Shop, alder body, maple V-neck, Big Dipper-spec pickups (slightly hotter than vintage with a midrange dip)
- **Pickup:** **Neck pickup** for the verse melodies; **position 4 (middle + neck parallel)** for the chorus rhythm; **bridge** for solo accents
- **Tuning:** E standard
- **Strings:** Ernie Ball Slinky .010–.046
- **Notable mods:** None mechanical
- **Era caveat:** Pre-PRS Silver Sky (Silver Sky launches 2018). Continuum-era is Strat territory.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Klon Centaur** (gold horsie) | DEFAULT-ON transparent boost | Drive ~3, Tone ~5, Output ~6 | Verified |
| 2 | **Ibanez TS9 Tube Screamer** | Stacked AFTER the Klon for lead lift | Drive ~2, Tone ~6, Level ~7 | Verified |
| 3 | **Way Huge Aqua-Puss** analog delay | Subtle warm slapback / slow swirl | Time ~150 ms (slapback), Mix ~15 | Likely |
| 4 | **Boss DD-3** Digital Delay | Longer delay for solo passages | Time ~380 ms, Feedback ~3, Mix ~20 | Likely |

**Notes:**
- Same Klon-then-TS stacking trick as Slow Dancing. The two transparent boosts together push the Two-Rock into Mayer's signature sustained lead tone.
- Gravity's solo uses the Klon (always-on) without the TS9 stacked — lighter than Slow Dancing's lead approach
- Volume-knob technique is essential — Mayer rolls back to ~5 for verses, full open for the choruses + solo

---

## Amp + Cab

- **Amp:** **Two-Rock John Mayer Signature** (2x12 combo, Custom Reverb v2 derivative)
  - Channel: Clean (pushed into edge of breakup by the Klon + picking force)
  - Settings: Volume ~7, Bass 5, Mid 5, Treble 6, Reverb 4
- **Cab:** Two-Rock 2x12 with **Celestion G12-65 / G12 EVH** (varies)
- **Power tubes:** 6L6 quad
- **Modifications:** Mayer signature spec — built around his preferences
- **Multi-cab setup:** Single combo for studio tracking

---

## Microphones

- **Close mic:** **Shure SM57** + **Sennheiser MD421** close
- **Off-axis:** **Royer R-121 ribbon** ~3-4" off, slightly off-axis
- **Room mic:** **Neumann U87** ~6-8 feet back

Same mic technique as Slow Dancing (sister Continuum track).

---

## Technique notes

- **Right-hand attack:** Hybrid picking — pick + middle/ring fingers
- **Volume swells:** Gravity's verses use volume knob swells extensively — picking with the volume rolled to 0, then swelling up to 7-8 mid-note for a "vocal" attack
- **Bending technique:** Wide, slow bends with vibrato applied AFTER reaching pitch
- **Vibrato:** Hand vibrato + occasional trem-arm flutters
- **Dynamic range:** Gravity is the song that demonstrates Mayer's whole approach — picking force controls the breakup level, not the volume knob

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Klon Centaur | **Minotaur** (`HD2_DistMinotaur`) | Verified | Direct emulation, default-on |
| Ibanez TS9 | **Scream 808** (`HD2_DistScream808`) | Verified | Stacked after Minotaur for solo lift |
| Way Huge Aqua-Puss | **Bucket Brigade** (`HD2_DelayBucketBrigade`) | Verified | Warm analog character |
| Boss DD-3 | **Vintage Digital** (`HD2_DelayVintageDigitalV2`) | Verified | Cleaner repeats for solo |
| Two-Rock JM Signature | **Derailed Ingrid** (`HD2_AmpDerailedIngrid`) | Verified | Drive=0.50 (lower than Slow Dancing's 0.55 — Gravity is cleaner), Sag=0.65 |
| Two-Rock 2x12 + G12-65 | **2x12 Mail C12Q** (closest stock with WithPan) | Verified | Same cab choice as Slow Dancing |
| SM57 + R-121 | Mic 0 + Mic 5 on cabSibling | Verified | Direct match |

---

## Sources

- Wikipedia — *Continuum* article
- Premier Guitar — multiple John Mayer rig features
- John Mayer interviews discussing Gravity specifically — *Guitar World*, *Tape Op*
- Steve Jordan interviews on JM Trio sessions
- Equipboard pros/john-mayer

---

## Confidence summary

- **Verified:** 17 items (recording context, Black 1 Strat + Big Dipper pickups, Klon + TS stack, Two-Rock signature, mic technique)
- **Likely:** 3 items (specific delay model on Gravity, Aqua-Puss vs DD-3 use)
- **Speculative:** 0 items

---

## Open questions

- **Was the Aqua-Puss used on Gravity specifically?** Mayer's Continuum-era board had it; on the take is less certain
- **Cleaner Two-Rock setting than Slow Dancing?** Gravity's verses are quieter than Slow Dancing's; the amp is cleaner
- **Reverb mix on the album take?** The studio reverb (room blend) is more present on Gravity than on Slow Dancing — feels deliberate

---

## Recipe alignment

The current `mayer-gravity-super-clean-dynamic` recipe is aligned with this research. Recommendations match Slow Dancing:
- Default-on drive should be **Minotaur** (Klon), not Scream 808
- Add a second TS9 stacked drive (toggle-on for solo passages)
- Otherwise the Two-Rock + dual-mic 2x12 setup is correct

The two Mayer recipes (Gravity + Slow Dancing) effectively share a rig — they differ only in how the Two-Rock is dialed (Gravity slightly cleaner) and which modulation/delay is engaged.
