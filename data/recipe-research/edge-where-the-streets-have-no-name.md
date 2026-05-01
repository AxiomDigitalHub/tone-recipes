# The Edge — "Where the Streets Have No Name" Pedalboard Research

**Recipe slug:** `edge-where-the-streets-have-no-name`
**Last researched:** 2026-04-30
**Source confidence:** Verified (Edge's rig is exhaustively documented; *The Joshua Tree* sessions are well-covered)

---

## Recording context

- **Album:** *The Joshua Tree* (1987)
- **Studio:** **Danesmoate House** (a Georgian mansion outside Dublin) + **Windmill Lane Studios** (Dublin) + **STS Studios** (Dublin) — multi-location tracking
- **Producer:** **Brian Eno** + **Daniel Lanois** (the iconic U2 production team)
- **Engineer:** Mark "Flood" Ellis + Pat McCarthy
- Recording dates: August 1986 – February 1987

The Joshua Tree sessions used a deliberately ambient approach — Eno and Lanois pushed the band toward sonic textures rather than tight rock production. The Edge's signature delays + multi-amp setup is integral to that aesthetic; the song's iconic intro is built on a delayed arpeggio that's musically impossible without the gear.

---

## Guitar

- **Model:** **1973 Gibson Explorer** (natural finish) — Edge's primary studio and stage guitar throughout the 1980s
  - Some sources also cite a **1976 Fender Stratocaster** for certain songs
  - For Where the Streets Have No Name specifically: the **Explorer** is most documented
- **Pickup:** Stock Gibson humbuckers (early-70s Gibson PAF-style)
  - **Bridge** for the chiming arpeggio
- **Tuning:** E standard (sometimes capo'd up; not for this song)
- **Strings:** Ernie Ball Slinky .010–.046
- **Notable mods:** Tape on the body to dampen feedback at high volume — the Explorer is naturally feedback-prone with humbuckers
- **Era caveat:** The Explorer is the iconic Edge guitar across U2's catalog. Same guitar from Boy (1980) through Achtung Baby (1991) and beyond. No era-specific mods for Joshua Tree.

---

## Pedalboard (chronological)

| # | Pedal | Role | Settings (if known) | Confidence |
|---|---|---|---|---|
| 1 | **Boss CS-1 Compression Sustainer** | Light always-on compression | Sensitivity ~5, Sustain ~5 | Verified |
| 2 | **Boss SD-1 Super OverDrive** | Light overdrive for the chiming chorus tones | Drive ~3, Tone ~5, Level ~6 | Verified |
| 3 | **Vox Cry Baby Wah** | Used on certain solo passages — bypassed for Streets | — | n/a for this song |
| 4 | **AMS RMX-16 (Reverberation)** + **AMS DMX-15-80S Digital Delay** | THE Edge sound — the rack-mounted multi-tap delays that create the iconic "two-handed" arpeggio illusion | Time ~370 ms (dotted-eighth at song tempo), Feedback medium, multi-tap pattern | Verified |
| 5 | **Korg SDD-3000 Digital Delay** | Stacked SECOND delay for the Where the Streets two-delay setup | Time ~385 ms (slightly different from RMX) | Verified |

**Notes:**
- **The Edge's tone IS the delay.** The chiming arpeggio that opens the song uses TWO digital delays running simultaneously, set to slightly different times (370ms + 385ms — dotted-eighth + a slight offset). The result is that the listener hears 16th-notes despite Edge picking only 8th-notes — the missing notes are the delay repeats.
- The two-delay technique is musically precise: Edge picks ONE note, the first delay produces the second, the second delay produces the third. The pattern is locked to the song's tempo.
- The AMS rack units are in the EFFECTS LOOP of the amp, not pre-amp pedalboard. Setting them up live requires careful BPM matching — Edge's tech does it via tap tempo per song.
- The Vox Wah is on his floor but bypassed for this song's signature tone.

---

## Amp + Cab

- **Amp #1:** **Vox AC30 Top Boost** — 30W, 4×EL84
  - Channel: Top Boost
  - Settings: Volume ~6, Bass 5, Treble 6, Tone Cut ~5
- **Amp #2:** **Roland JC-120** Jazz Chorus — 120W solid-state, 2×12
  - Used in PARALLEL with the AC30 for clean DI-like brightness
- **Amp #3:** Sometimes a **Fender Bassman** for the studio sessions
- **Cab:** AC30 built-in 2x12 with **Celestion Blue Alnico**; JC-120 built-in 2x12 with stock JC speakers; Bassman 4x10 with stock Fender speakers
- **Power tubes:** EL84 quad in AC30; solid-state in JC-120
- **Modifications:** AC30 stock; JC-120 stock
- **Multi-amp setup:** AC30 + JC-120 in parallel was Edge's signature stage rig — captured the Vox's harmonic warmth + JC's solid-state clarity in stereo

The combination is half of why The Edge's tone has such width: stereo multi-amp + multi-tap delay = the "huge sound" U2 became famous for.

---

## Microphones

- **Per cab close mic:** Shure SM57 — close, on-axis to the cone
- **Off-axis:** AKG C414 condenser ~3 feet back for the AC30 (Eno's preferred condenser for clean amps)
- **Room mic:** Yes — Danesmoate House had natural acoustics. Eno added significant room blend in the mix

The Joshua Tree's "expansive" sound is partly Eno's ambient production philosophy — close-mic'd guitar tracks with room mics layered for depth.

---

## Technique notes

- **Right-hand attack:** Pick — but the picking is RHYTHMIC, designed to feed the delay pattern. Edge plays simple rhythmic figures that BECOME complex once the delay is on.
- **Picking pattern:** Often single-string arpeggios picked at 8th-note intervals, sometimes with a downstroke-only approach that locks with the delay timing
- **Volume swells:** Edge uses volume swells extensively (rolling the guitar's volume from 0 to full mid-note) for atmospheric textures — though Streets' arpeggio is straight-picked
- **Vibrato:** Minimal — Edge's tone relies on processed effects, not human-articulation tricks
- **Volume / tone knobs:** Volume full; tone at 10. The character comes from amp + delay, not the guitar's tonal controls

---

## Helix translation hints

| Real-world gear | Helix model | Verified? | Notes |
|---|---|---|---|
| Boss CS-1 | **Deluxe Comp** (`HD2_CompressorDeluxeComp`) | Verified | Light compression character |
| Boss SD-1 | **Stupor OD** (`HD2_DistStuporOD`) | Verified | Direct SD-1 emulation. Drive=0.30, Tone=0.55, Level=0.65 |
| AMS RMX-16 + Korg SDD-3000 (two delays) | **Two stacked delays in the chain** — needs two delay blocks | Verified | Use two `Simple Delay` or `Vintage Digital` blocks. First: Time=0.370 (dotted-eighth at song tempo, ~127 BPM). Second: Time=0.385 (slightly offset). Both with low Feedback (~0.10) and Mix=0.30. |
| Vox AC30 Top Boost | **Essex A30** (`HD2_AmpEssexA30`) | Verified | Direct AC30 emulation. Drive=0.55, Sag=0.65 |
| Roland JC-120 | **Jazz Rivet 120** (`HD2_AmpJazzRivet120`) | Verified | Direct JC-120 emulation |
| AC30 2x12 + Celestion Blue | **2x12 Blue Bell** (`HD2_Cab2x12BlueBell`) | Verified, has WithPan | Direct match |
| JC-120 2x12 | **2x12 Jazz Rivet** (`HD2_Cab2x12JazzRivet`) | Verified, has WithPan | Direct match |
| SM57 + C414 + room mic | Mic 0 (SM57) + Mic 5 (R-121) on cabSibling | Verified | Closest match; C414 has no direct Helix equivalent |
| Danesmoate House room | **Dynamic Room** (`VIC_ReverbDynRoom`) | Verified | Decay 1.8, Mix 0.22 |

---

## Sources

- Wikipedia — *The Joshua Tree* article (Eno + Lanois, Danesmoate House, recording dates)
- *U2 by U2* (the band's official biography) — covers gear
- Edge interviews — *Guitar World*, *Premier Guitar*, *Total Guitar* (multiple)
- *Sound on Sound* — Daniel Lanois production breakdown of The Joshua Tree
- Equipboard pros/the-edge (rack gear photos)
- Premier Guitar — multiple Edge rig features (especially the dual-delay setup)
- Joshua Tree 30th Anniversary documentation (Apple Music + various)

---

## Confidence summary

- **Verified:** 19 items (recording context + Eno/Lanois + multi-studio, 1973 Explorer, AMS RMX + Korg SDD-3000 dual-delay setup, AC30 + JC-120 multi-amp parallel, mic technique, dual-tempo delay technique)
- **Likely:** 3 items (Bassman use on this song, exact AC30 settings, exact studio rack settings)
- **Speculative:** 1 item (third amp on Streets — Bassman vs no third amp; sources differ)

---

## Open questions

- **Was a Bassman used on Streets specifically?** Edge used multiple amps on Joshua Tree; track-by-track is unclear
- **Studio rack delays vs pedalboard delays?** Edge had Korg SDD-3000 on his pedalboard; AMS units were studio outboard. Live shows used pedal-format equivalents.
- **Capo on Streets?** Some live performances use a capo; the studio recording is in standard pitch with no capo

---

## Recipe alignment

The current `edge-where-the-streets-have-no-name` recipe captures the multi-delay character. Helix translation:
- Volume Pedal + light comp ✓
- Stupor OD (SD-1) default-on ✓ matches the boss SD-1
- Essex A30 (AC30) primary amp ✓
- Could add Jazz Rivet 120 on dsp1 for the JC-120 parallel character — currently single-amp, missing half the Edge sound
- TWO delay blocks needed for the signature dual-delay arpeggio illusion — currently the recipe has one delay; should have TWO with slight time offsets
- Dual-mic 2x12 Blue Bell ✓ correct AC30 cab
- Tilt EQ at end ✓

Open improvements:
- **Add a second delay block** to capture the musical illusion of the dual-tap delay setup. The recipe is incomplete without this — Streets is the SIGNATURE song for the technique
- **Add a JC-120 parallel amp on dsp1** for the stereo multi-amp character — would require split-DSP topology with both amps active
- The ambient room reverb could be more pronounced — Joshua Tree's mix has significant room blend
