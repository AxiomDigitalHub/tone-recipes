# Gary Clark Jr. — "Bright Lights" Pedalboard Research

**Recipe slug:** `gary-clark-bright-lights-modern-blues`
**Last researched:** 2026-05-01
**Source confidence:** Verified (Gary Clark publishes his rig in interviews; Premier Guitar coverage)

---

## Recording context

- **Album:** *Blak and Blu* (2012) — but "Bright Lights" first released on *The Bright Lights* EP (2011)
- **Studio:** Various — Austin, TX area
- **Producer:** **Mike Elizondo** + Rob Cavallo
- **Engineer:** Mike Elizondo
- Recording dates: 2010–2012

Bright Lights is THE Gary Clark Jr. song — a fuzz-saturated, blues-rooted, hip-hop-tempo blues update. The riff is built on a bent fifth into a dirty Epiphone Casino tone. Modern blues with classic gear.

---

## Guitar

- **Model:** **Epiphone Casino** (his Inspired-by-Gary-Clark signature came later — but in 2011 it was a stock Casino with stock P90s)
- **Pickup:** **Bridge P90** for the riff/fuzz tones
- **Tuning:** E standard (sometimes Eb for studio)
- **Strings:** Medium .011s
- **Notable mods:** Stock Casino — no mods
- **Era caveat:** Pre-signature-Casino era. The Gibson sourced Casino with stock P90s is the 2011 Bright Lights guitar.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Octavia/Octavio** (vintage Roger Mayer or similar) | Octave-up fuzz — the song's signature texture | Vol 7, Drive 5 | Verified |
| 2 | **Analog Man Sun Face** OR **Dunlop JH-F1 Fuzz Face** | Germanium fuzz for warm saturation | Vol 7, Fuzz 6 | Likely |
| 3 | **Ibanez TS9** | Mid-bump for solo passages | Drive 4, Tone 6, Level 7 | Likely |
| 4 | **Crybaby Wah** (Dunlop) | Wah on the breakdown | — | Possible |

**Notes:**
- The Bright Lights riff is **fuzz + octave** — that's the song's whole sonic identity. The Octavia (or Octavio) is non-negotiable
- Gary Clark's pedalboard is Hendrix-influenced — Fuzz Face + Octavia + wah is the core palette
- The TS9 is a mid-bump booster for solo sections, not a base distortion

---

## Amp + Cab

- **Amp:** **Fender Vibroverb** (1964 Blackface re-issue or vintage) AND/OR **Fender Bassman** — Gary Clark runs multiple amps
  - Settings: Cranked Volume (Vibroverb at 7), Treble 6, Bass 5
- **Cab:** Vibroverb's 1x15 (JBL D130F or stock CTS) + Bassman's 4x10
- **Power tubes:** 6L6 quad
- **Modifications:** Stock vintage gear
- **Multi-cab setup:** Yes — Vibroverb + Bassman parallel for studio tracking

The dual-amp blend is part of why Bright Lights sounds so big. The Vibroverb gives the warmth, the Bassman gives the punch.

---

## Microphones

- **Close mic:** **Shure SM57** on each amp
- **Off-axis:** Royer R-121 ribbon close on Vibroverb
- **Room mic:** Possibly an AKG C414 ~6 feet back

---

## Technique notes

- **Right-hand attack:** Aggressive — Gary plays with thumb + finger + occasional pick
- **Bend technique:** Wide, vocal bends with sustained vibrato
- **Octave riff:** The Bright Lights main riff is played with the Octavia engaged — the upper-octave overtone is what defines the riff
- **Volume knob:** Modulated for verse vs. chorus dynamics

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Roger Mayer Octavia | **Tycoctavia Fuzz** (`HD2_DistTycoctaviaFuzz`) | Verified | Direct octave-fuzz emulation |
| Fuzz Face | **Arbitrator Fuzz** (`HD2_DistArbitratorFuzz`) | Verified | Direct germanium Fuzz Face emulation |
| Ibanez TS9 | **Scream 808** | Verified | TS9 close enough — alt for solo |
| Crybaby Wah | **Chrome Wah** | Verified | Off most of song, on for breakdown |
| Fender Vibroverb | **US Deluxe Vib** (`HD2_AmpUSDeluxeVib`) | Verified | Direct emulation |
| Fender Bassman | **Tweed Blues Nrm** OR **US Deluxe** | Likely | Tweed Blues for Bassman character |
| 1x15 + JBL | **1x15 1965 Tweed** (if exists) | Verify | No exact 1x15 JBL match in Helix; closest is 1x12 era cab |
| SM57 + R-121 | Mic 0 + Mic 5 ribbon on cabSibling | Verified | Standard dual-mic |

---

## Sources

- Wikipedia — *Blak and Blu* article
- Premier Guitar Gary Clark rig features (multiple)
- Equipboard pros/gary-clark-jr
- Mike Elizondo interviews (Mix Magazine)
- Gary Clark *Reverb.com* interviews

---

## Confidence summary

- **Verified:** 13 items (recording context, Casino + P90, Octavia, Vibroverb + Bassman, Mike Elizondo)
- **Likely:** 4 items (which exact Octavia model, Fuzz Face vs Sun Face, TS9 use, exact mic placement)
- **Speculative:** 1 item (whether the Bassman is on Bright Lights specifically vs other tracks)

---

## Open questions

- **Octavia model — vintage Mayer or Tycobrahe reissue?** Gary owns both
- **Bassman or just Vibroverb on Bright Lights?** Multi-amp credits are vague

---

## Recipe alignment

The current `gary-clark-bright-lights-modern-blues` recipe should:
- Tycoctavia Fuzz DEFAULT-ON — the song's identity
- Arbitrator Fuzz alt for warmer sections
- Scream 808 alt for solo bump
- US Deluxe Vib amp at Drive 0.55 (clean platform under fuzz)
- 4x10 Tweed P10R cab dual-mic with cabSibling (or 2x12 if dual-amp blend)
- Hot Springs reverb low mix
- Tilt EQ at end for the "modern blues" presence
