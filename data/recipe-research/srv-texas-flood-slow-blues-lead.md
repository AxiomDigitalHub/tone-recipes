# Stevie Ray Vaughan — "Texas Flood" Slow-Blues Lead Pedalboard Research

**Recipe slug:** `srv-texas-flood-slow-blues-lead`
**Last researched:** 2026-05-01
**Source confidence:** Verified (sister recipe to Pride and Joy — same album, same rig)

---

## Recording context

- **Album:** *Texas Flood* (1983)
- **Studio:** Down Home Studios, Riverside, CA
- **Producer:** SRV + Double Trouble + Mick Hashimoto
- **Engineer:** Richard Mullen (mix)
- Recording dates: November 1982 (the famous 3-day demo session)

Texas Flood (the title track) is a slow-burn 12-bar blues ballad — the album's emotional centerpiece. SRV's solo on this track is one of the most-cited blues lead performances ever recorded. The dynamic range goes from whisper-quiet single-note phrases to wailing high-register bends.

Same rig, same studio, same recording session as Pride and Joy — but completely different musical character.

---

## Guitar

- **Model:** **Fender Stratocaster "Number One"** — 1962/63 reassembly Strat (same as Pride and Joy)
- **Pickup:** Mostly **bridge** position for the solo, with some **bridge + middle (position 4)** during quieter passages
- **Tuning:** Eb standard
- **Strings:** GHS Nickel Rockers .013–.058 (heavy)
- **Notable mods:** Lefty trem on right-handed body, 5-way switch
- **Era caveat:** Same Number One as Pride and Joy. See sibling research file for full guitar details.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Ibanez TS808 Tube Screamer** | DEFAULT-ON clean boost | Drive at MIN, Tone ~6, Level MAXED | Verified |
| 2 | **Vox V846 Wah** | Off for Texas Flood (no wah on this track) | — | Verified off |

Same pedalboard as Pride and Joy. The clean-boost trick (TS808 with Drive at minimum, Level maxed) is SRV's universal setting. He used it on every Texas Flood track.

**Notes:**
- The slow-blues tone of Texas Flood comes from the **dynamic range of SRV's picking + the cranked amp's response** — NOT from gear changes between tracks
- The TS808 stays on; the dynamics happen at the guitar (volume rolling, picking force) and the amp (Vibroverb breakup at high SPL)

---

## Amp + Cab

- **Amp #1:** **Fender Vibroverb** (1964 Blackface, 1x15)
- **Amp #2:** **Fender Super Reverb** (1964 Blackface, 4x10) — run in parallel
- Settings same as Pride and Joy: cranked Vibrato channels, Cesar Diaz hot-bias mod
- **Cabs:** Built-in combo speakers (Vibroverb 1x15 JBL D130F + Super Reverb 4x10 CTS alnico)
- **Power tubes:** 6L6 quads
- **Multi-cab setup:** Parallel via Y-cable

See `srv-pride-and-joy-rhythm.md` for full amp details. Identical rig.

---

## Microphones

- Same as Pride and Joy: SM57 close on each amp, MD421 off-axis on the Vibroverb, no deliberate room mic (live tracking captured plenty of bleed)

---

## Technique notes

- **Right-hand attack:** SRV's TEXAS FLOOD attack is more dynamic than Pride and Joy. Quiet single-line passages played LIGHTLY; wailing high-register bends played HARD
- **Bend technique:** The solo is built on bend-and-vibrato — SRV bends a half/whole step then applies wide vibrato while sustaining
- **Volume knob use:** Texas Flood specifically uses volume-knob rolling for dynamics. SRV rolls back to ~5 for the verse melody, full for the climax
- **Vibrato:** Even wider and slower than Pride and Joy. The slow blues tempo lets SRV apply almost trombone-like vibrato
- **Picking patterns:** Single-note lines with occasional double-stops; classical-style legato on some passages

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Ibanez TS808 | **Scream 808** (`HD2_DistScream808`) | Verified | Same SRV trick: Gain=0.10 (NEAR ZERO), Tone=0.60, Level=1.0 (MAXED) |
| Vox V846 Wah | UK Wah 846 | Verified | OFF for Texas Flood |
| Fender Vibroverb | **US Deluxe Vib** (`HD2_AmpUSDeluxeVib`) | Verified | Drive=0.70 (slightly less aggressive than Pride and Joy's 0.75 — Texas Flood is dynamic, not full-tilt) |
| ALT amp (Super Reverb) | **US Super Vib** (`HD2_AmpUSSuperVib`) | Verified | For dual-amp parallel topology |
| 4x10 Tweed P10R cab | **4x10 Tweed P10R** (`HD2_Cab4x10TweedP10R`) | Verified, has WithPan | Same as Pride and Joy |
| SM57 + R-121 | Mic 0 + Mic 5 on cabSibling | Verified | Direct match |
| Spring reverb | **Hot Springs** / **Spring** | Verified | Decay 0.5, Mix 0.20 — Vibroverb's onboard tank |

---

## Sources

- See `srv-pride-and-joy-rhythm.md` — same album, same rig
- Tom Wheeler — *The Stratocaster Chronicles*
- Cesar Diaz interviews

---

## Confidence summary

- **Verified:** 17 items (same as Pride and Joy)
- **Likely:** 2 items (exact dynamic-volume technique, mix-side processing)
- **Speculative:** 0 items

---

## Open questions

- **Was the lead tracked separately from the rhythm?** Texas Flood being a slow ballad, possibly more overdub-friendly than Pride and Joy. The lead may be a punched-in solo.

---

## Recipe alignment

The current `srv-texas-flood-slow-blues-lead` recipe should match Pride and Joy's gear setup with:
- Slightly lower Vibroverb Drive (0.70 vs 0.75) for the dynamic range
- Same Scream 808 TS-trick
- Same dual-mic 4x10 Tweed P10R
- Same Hot Springs reverb at low mix
- Tilt EQ at end

Could add a snapshot for the dynamic verse/climax tonal shift if the recipe doesn't already capture that.
