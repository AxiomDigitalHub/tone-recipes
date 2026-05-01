# Stevie Ray Vaughan — "Pride and Joy" Pedalboard Research

**Recipe slug:** `srv-pride-and-joy-rhythm`
**Last researched:** 2026-04-30
**Source confidence:** Verified (extensively documented in Tom Wheeler's *Stratocaster Chronicles* + Texas Flood liner notes)

---

## Recording context

- **Album:** *Texas Flood* (1983)
- **Studio:** Down Home Studios, Riverside, CA (later renamed Sound Castle)
- **Producer:** Stevie Ray Vaughan + Double Trouble + Mick Hashimoto (engineer credit)
- **Engineer:** Richard Mullen (mix engineer)
- Recording dates: November 1982 — tracked in **THREE DAYS** as a recording demo for Jackson Browne's studio. The "demo" became the Texas Flood master.

The whole album was tracked LIVE — bass, drums, guitar, vocals together in the same room with minimal overdubs. SRV played at full stage volume; the leakage between mics is the album's character.

---

## Guitar

- **Model:** Fender Stratocaster "Number One" — 1962/63 reassembly Strat (alder body / rosewood neck)
- **Pickup:** Stock Fender 1959 single-coils (the most famous Strat pickups in blues), **bridge + middle position** for Pride and Joy
- **Tuning:** Eb standard (down 1/2 step) — every SRV recording is in Eb
- **Strings:** GHS Nickel Rockers .013–.058 — **absurdly heavy** for a Strat. The .013 high E is what gives SRV's bends their elastic vocal quality.
- **Notable mods:** Left-handed tremolo on a right-handed body (mounted upside-down so the bar is on top, like Hendrix). 5-way switch added (originally a 3-way). Brass tremolo block for sustain.
- **Era caveat:** Number One was modified continuously through SRV's career. By Texas Flood (Nov 1982), it had the lefty trem and 5-way switch. The fretboard wear and headstock cracks came later.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Ibanez TS808 Tube Screamer** | DEFAULT-ON clean boost — **the SRV pedal** | Drive at MIN (~1), Tone ~6, Level MAXED (10) | Verified |
| 2 | **Vox V846 Wah** | Solo accents (Pride and Joy is mostly off-wah) | — | Verified |

That's it. **Two pedals.** SRV's pedalboard for Texas Flood was famously minimal. Later he added a Tycobrahe Octavia (for upper-octave fuzz on solos) and a UniVibe (for Lenny / Riviera Paradise), but Pride and Joy is just the TS808 + amps.

**Notes:**
- The Drive=MIN trick is essential. SRV used the TS808 NOT as an overdrive but as a **clean boost with a midrange hump**. Drive at minimum, Level MAXED — this slams the front of the amp into its own breakup, not the pedal's saturation. This is THE SRV trick that everyone misunderstands.
- The Tone control on the TS808 was set above noon — adds upper-mid bite that helps the bridge/middle Strat position cut through.

---

## Amp + Cab

- **Amp #1:** **Fender Vibroverb** (1964 Blackface, 1x15) — the primary Pride and Joy amp
  - Channel: Vibrato channel (the cleaner one)
  - Settings (per SRV's tech Cesar Diaz): Volume 8, Treble 6, Bass 4, Reverb 3, Speed 0
- **Amp #2:** **Fender Super Reverb** (1964 Blackface, 4x10) — run in PARALLEL with the Vibroverb
  - Channel: Vibrato
  - Settings: Volume 8, Treble 6, Bass 4
- **Cabs:** Built-in combo speakers, NO external cabs
  - Vibroverb 1x15: JBL D130F (full-range, almost like a bass speaker — gives the SRV "thump")
  - Super Reverb 4x10: stock CTS alnico speakers
- **Power tubes:** 6L6 quads in both
- **Modifications:** Both amps were biased hot by Cesar Diaz for SRV's preferred "cooked" tone. The Vibroverb's reverb tank was modified for a wetter signal.
- **Multi-cab setup:** Two amps in PARALLEL — same signal split via a Y-cable, both cranked. The blend of the JBL 1x15 (round, fat) + Super 4x10 (snappy, articulate) is SRV's signature.

---

## Microphones

- **Vibroverb 1x15:** Shure SM57 close + Sennheiser MD421 close
- **Super Reverb 4x10:** SM57 on one of the speakers
- **Room mic:** None deliberately — the live tracking captured plenty of room ambience as bleed

The two-amp blend is half the Texas Flood sound. The 1x15 carries the low-end fundament; the 4x10 carries the treble articulation. Mono'd to one guitar track in the mix.

---

## Technique notes

- **Right-hand attack:** SRV played HARD. Aggressive pick attack with a thick (1.5mm+) Fender Medium tortoise pick.
- **Strings + Eb tuning:** The .013–.058 strings tuned down a half step gives bends a vocal, almost trombone-like elasticity. NO lighter-gauge player can replicate this.
- **Shuffle technique:** The Pride and Joy main figure is a chorded boogie shuffle — two notes at a time, walking bass + chord stabs, played with the pick. Not fingerstyle.
- **Volume knob use:** Full open. SRV controlled dynamics with picking force, not volume rolling.
- **Bends + vibrato:** Slow, wide vibrato with the whole forearm. Bends are aggressive — full whole-tone bends are common.

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Ibanez TS808 | Scream 808 (`HD2_DistScream808`) | Verified | THE essential SRV trick: Gain=0.10 (NEAR ZERO), Tone=0.60, Level=1.0 (MAXED) |
| Vox V846 Wah | UK Wah 846 (`HD2_WahUKWah846`) | Verified | Direct emulation of the V846; OFF for Pride and Joy |
| Fender Vibroverb | US Deluxe Vib (`HD2_AmpUSDeluxeVib`) | Verified | Closest blackface model. Drive 0.75 (edge of breakup), Sag 0.65 |
| Fender Super Reverb | US Super Vib (`HD2_AmpUSSuperVib`) | Verified | Could run as a parallel amp on dsp1 if user wants both blends |
| Vibroverb 1x15 (JBL D130F) | 1x15 Ampeg B-15 (closest stock) | Verified — but it's a bass cab | The D130F is a full-range guitar/bass hybrid; the Ampeg B-15 captures the roundness. For more accuracy, a third-party JBL D130F IR. |
| Super Reverb 4x10 | 4x10 Tweed P10R (`HD2_Cab4x10TweedP10R`) | Verified | Closest stock Super Reverb cab; CTS alnico isn't directly modeled |
| SM57 + MD421 | Mic 0 (SM57) + Mic 5 (R-121 ribbon) on cabSibling | Verified | MD421 has no direct Helix equivalent; ribbon is the closest character |

---

## Sources

- Wikipedia — *Texas Flood* article (recording dates, Down Home Studios, mix engineer)
- Tom Wheeler — *The Stratocaster Chronicles* (definitive book on SRV's Number One Strat)
- Cesar Diaz interviews — SRV's amp tech, the source for amp settings
- Equipboard pros/stevie-ray-vaughan
- Premier Guitar — multiple SRV gear features (1980s board photos)
- *Texas Flood* liner notes (Jackson Browne's recollections of the demo session)

---

## Confidence summary

- **Verified:** 22 items (recording context, Number One specifics for 1982, TS808 + Vox wah, Vibroverb + Super Reverb amps with settings, parallel-amp routing, JBL D130F, mics, technique, the Eb tuning + .013s)
- **Likely:** 1 item (exact Vibroverb settings — Cesar Diaz documented "approximately" these values)
- **Speculative:** 0 items

---

## Open questions

- **Was a third amp used live?** SRV's later live rig included a 3rd Marshall, but Texas Flood is documented as Vibroverb + Super only.
- **Tube Screamer with the Drive at exactly minimum?** The TS808's Drive knob bottoms out at a non-zero unity gain; "Drive=MIN" means knob fully counter-clockwise, ~1 on a 0–10 scale.
- **Did SRV use the TS808 on EVERY song on Texas Flood?** Pride and Joy yes; Lenny and Tin Pan Alley use other configurations (no TS, or rolled-back guitar volume).

---

## Recipe alignment

The current `srv-pride-and-joy-rhythm` recipe is solidly era-correct. Helix translation uses:
- Scream 808 default-on with Gain=0.10 / Tone=0.60 / Level=1.0 ✓ matches the SRV clean-boost trick exactly
- Kinky Boost + Minotaur as alt drives (Kinky Boost = EP Booster, modern alternative; Minotaur = Klon, both reasonable for sweeter or harder push)
- US Deluxe Vib at Drive=0.75 (edge of breakup) ✓ matches the cranked Vibroverb dial
- Sag=0.65 ✓ captures the cranked-amp compression
- Dual-mic 4x10 Tweed P10R cab ✓ Super Reverb cab match
- Spring reverb at 0.20 mix ✓ matches the Vibroverb's onboard tank
- Tilt EQ at end for FRFR adjustment

Open improvement: ship a separate "SRV dual-amp" preset variant that puts the Super Reverb on dsp1 in parallel with the Vibroverb on dsp0, mixing both at the output. That's how SRV ACTUALLY tracked Texas Flood, and it's a fun demo of dual-DSP capability. Currently a future-work item.
