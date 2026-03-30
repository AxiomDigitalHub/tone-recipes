# Kemper Profiler - Technical Reference

## Product Line

### Models and Form Factors

The Kemper Profiler lineup consists of four primary form factors, all sharing the same core DSP engine and profiling technology:

| Model | Form Factor | Profiling | Effects Slots | Effects Loops | Power Amp Option |
|---|---|---|---|---|---|
| **Profiler Head ("Toaster")** | Desktop/head unit, iconic rounded lunchbox design | Yes | 8 (MK1) / 20 (MK2) | 1 | Yes (PowerHead) |
| **Profiler Rack** | 19-inch rack mount, 3U | Yes | 8 (MK1) / 20 (MK2) | 1 | Yes (PowerRack) |
| **Profiler Stage** | Floor unit with built-in footswitches | Yes | 8 (MK1) / 20 (MK2) | 2 | No |
| **Profiler Player** | Compact pedalboard unit, 3 footswitches | OS 14+ only | 4 (L1) / 8 (L3) / 16 (MK2 era) | 0 | No |

### MK 2 Series (2025)

The MK 2 generation brings an upgraded processing engine with ~20-second boot times, up to 20 simultaneous effect blocks (zero added latency), and 8-channel USB audio. The Player was declared "MK 2-ready from day one" and receives the same software updates.

### Pricing (MK 2 / 2025)

| Model | EUR | USD |
|---|---|---|
| Profiler Head MK 2 | 1,398 | 1,329 |
| Profiler Rack MK 2 | 1,398 | 1,329 |
| Profiler Stage MK 2 | 1,549 | 1,475 |
| Profiler PowerHead MK 2 | 1,798 | 1,699 |
| Profiler PowerRack MK 2 | 1,798 | 1,699 |
| Profiler Player | ~699 | ~699 |
| Profiler Remote MK 2 | ~469 | ~469 |

### Powered Versions

The PowerHead and PowerRack include a built-in Class-D power amplifier (designed by ICEpower, Denmark):
- 600W @ 8 Ohm
- 300W @ 16 Ohm

### Kemper Kabinet and Kone Speaker

**Kemper Kabinet:**
- 1x12 cabinet designed exclusively for the Profiler
- 200W RMS, 4 Ohm impedance
- Dimensions: 51 x 42 x 23 cm (20 x 16.5 x 9 in), 11.3 kg (24.9 lbs)

**Kemper Kone:**
- 12-inch full-range speaker co-developed with Celestion
- Frequency response: 50 Hz - 10 kHz
- Driven by the Profiler's DSP to achieve ultra-linear full-range response
- Narrowed radiation pattern mimics a traditional guitar speaker, unlike PA/FRFR speakers

**Speaker Imprint Mode:**
When Monitor CabOff is enabled, the Kone switches from full-range FRFR mode to Speaker Imprint mode, digitally recreating the frequency response of 19 classic guitar speakers from Celestion, JBL, Jensen, and others. Imprints were calibrated by mounting original speakers in the Kabinet side-by-side with the Kone, making them cabinet-independent. Imprints provide an "amp-in-the-room" feel rather than a mic'd cabinet simulation.

**Kone NEO:** A lighter-weight version of the Kone speaker for use in custom cabinets.

---

## How Profiling Works

### Core Technology

The Kemper Profiler was the first device to offer amp "profiling" when it launched in 2011. Unlike traditional modeling (which uses pre-programmed algorithms to simulate specific amps), profiling creates a digital snapshot of a real amplifier, cabinet, and microphone setup.

**The profiling process:**
1. A microphone is placed against the speaker cabinet (or a load box/DI is used)
2. The mic output feeds back into the Profiler's return input
3. The Profiler sends a series of test signals (white noise at various frequencies) through the target amp's input
4. The amp's response is captured via the microphone and analyzed
5. The Profiler builds a digital model matching the amp's frequency response, gain structure, and dynamic behavior

**What gets captured:** The amp's tone, gain characteristics, speaker/cabinet coloration, microphone placement characteristics, and (with Liquid Profiling) the behavior of tone controls.

### Profiling Technology 2.0 (OS 14.0)

Released in beta with OS 14.0, Profiling 2.0 represents the most significant capture upgrade:
- Over 100,000 individual frequency points analyzed per profile
- Extended impulse responses capture amplifier-speaker interaction dynamics
- **Authentic Gain Detection:** True amp gain is measured and mapped to the Gain control
- **Cabinet Resonance:** Real speaker/cabinet resonance captured with adjustable Resonance Frequency and Resonance Intensity parameters
- **Smart DI Profiling:** Profiles made without a cabinet are automatically labeled as DI Profiles
- **Ground Lift On Board:** Eliminates need for external isolator boxes during profiling
- Level-calibrated hardware ensures profiles respond identically to the original amp on any Profiler model

### Liquid Profiling (OS 10.0, 2023)

Liquid Profiling addresses the historical limitation that a standard profile's tone controls don't behave like the original amp's EQ. It works by:
1. Kemper digitally models the tone stack circuits of real amplifiers from their schematics
2. Users assign the correct tone stack model to a profile
3. The profile's EQ controls then respond authentically, as if turning the knobs on the real amp

**Key details:**
- Launched with ~40+ amp channel tone stack models (called "Kemper Component Models")
- Covers all major amp families: Fender, Marshall, Vox, Mesa, EVH, and more
- Tone stack models can only be created by Kemper (not user-generated)
- Cross-matching is possible (e.g., applying a Vox tone stack to a Marshall profile)
- Most tone stacks fall into 3 basic categories (Fender/Marshall/Vox), so close matches exist even for unlisted amps
- The full list is visible in the Profiler's Amplifier > Amp Model dropdown in Rig Manager

### Comparison: Kemper vs Neural Captures vs TONEX

| Feature | Kemper Profiling | Neural DSP (Quad Cortex) | IK Multimedia TONEX |
|---|---|---|---|
| **Technology** | Proprietary test-signal analysis | Neural network-based capture | Neural network-based capture |
| **Capture time** | Several minutes | 4-5 minutes | 10-60+ minutes (precision-dependent) |
| **Tone stack modeling** | Yes (Liquid Profiling) | No (static capture) | No (static capture) |
| **Dynamic behavior** | Profiling 2.0 captures dynamics | Neural networks model dynamics | Neural networks model dynamics |
| **Ecosystem** | 20,000+ free profiles on Rig Exchange | Cortex Cloud captures | ToneNET community |
| **Software option** | No (hardware only) | No (hardware only) | Yes (TONEX software from ~99 EUR) |
| **Free alternative** | N/A | Neural Amp Modeler (NAM, free) | N/A |

In blind tests, all three technologies produce results that are extremely close in a mix. Kemper's advantage is Liquid Profiling's interactive tone controls; neural capture approaches tend to be more accurate at replicating the exact static tone of a specific amp setting.

---

## Firmware / OS History

### Major Milestones

| Version | Year | Key Features |
|---|---|---|
| **OS 1.0** | 2012 | Original release with Kemper Profiler Head |
| **OS 3.0** | 2014 | Separate amp and cab profiling; Morphing feature introduced |
| **OS 4.0** | 2015 | Pure Cabinet technology; seamless rig switching |
| **OS 5.0** | 2016 | Major delay effects overhaul (Two-Tap, Serial, pitch delays) |
| **OS 5.5** | 2017 | S/PDIF multi-rate support (44.1-96 kHz); UI2MIDI; Celestion IRs |
| **OS 5.7** | 2017 | Five new reverb algorithms (Spring, Natural, Easy, Echo, Cirrus) |
| **OS 7.5** | 2020 | Kemper Kabinet/Kone support with 19 Speaker Imprints; Rig Manager 3.0 |
| **OS 8.0** | 2020 | New overdrive system (Kemper Drive, Full OC); inspired by TS, Klon, KOT, Bluesbreaker, OCD, etc. |
| **OS 8.1** | 2021 | Kemper Fuzz effect |
| **OS 8.2** | 2021 | Fuzz Drive System (Fuzz Face, Octavia, germanium/silicon); 340 factory FX presets |
| **OS 8.5** | 2021 | Rig Editor for iPadOS |
| **OS 8.6** | 2021 | Double Tracker effect; Super Stereo |
| **OS 8.7** | 2022 | Wireless Rig Manager control via iOS app |
| **OS 9.0** | 2023 | USB audio interface mode with reamping; Rig Marketplace (20+ vendor stores) |
| **OS 10.0** | 2023 | Liquid Profiling (tone stack modeling); ~40+ amp models |
| **OS 12.0** | 2024 | Tremolo, Slicer, and Auto-Panning effects |
| **OS 12.1** | 2025 | Player update: full drive stomps, Morphing, stereo output, output EQs |
| **OS 13.0** | 2025 | MK 2 Series support; stability and performance improvements |
| **OS 14.0** | 2025-2026 (beta) | Profiling Technology 2.0 (100K+ frequency points); Player gains profiling capability |

All OS updates are free for all Profiler hardware.

### Rig Manager Software

| Platform | Latest Version (as of early 2026) |
|---|---|
| macOS / Windows | 3.9.14 |
| iOS | 1.9.16 |
| Android | 1.9.32 |

Rig Manager serves as both a librarian and editor. It provides access to the Rig Exchange (20,000+ free profiles), the Rig Marketplace (commercial vendors), drag-and-drop Performance assembly, and full remote editing of all parameters. The Stage has built-in WiFi; other models connect via the rear network port or USB.

---

## Effects (Exhaustive)

### Signal Chain Architecture

**MK 1 (8 slots):**
- Pre-stack (Stomps): A, B, C, D (all mono, before the amp/cab)
- Post-stack (Effects): X, MOD, DLY, REV (stereo capable, after the amp/cab)

**MK 2 (20 blocks):**
- 7 new dedicated "pedalboard essential" slots: second Noise Gate (Palm Ninja), Compressor, Pure Booster, WahWah, Vintage Chorus, Air Chorus, Double Tracker
- Plus the original 8 flexible slots, Spectral Noise Gate, Transpose, and Volume Pedal
- Total: 20 simultaneous audio effect blocks with zero added latency

### Overdrive and Distortion

| Effect Name | Real-World Reference | Introduced |
|---|---|---|
| Green Scream | Ibanez TS-808 / Maxon OD808 | Original |
| Plus DS | MXR Distortion+ | Original |
| One DS | Boss DS-1 | Original |
| Muffin | Electro-Harmonix Big Muff | Original |
| Mouse | ProCo Rat | Original |
| Fuzz | Dunlop Fuzz Face | Original |
| Metal DS | Boss Metal Zone MT-2 | Original |
| **Kemper Drive** | Multi-drive: TS, Klon Centaur, Analogman King of Tone, Marshall Bluesbreaker MK1, Timmy, Boss OD-1, Boss SD-1, Horizon Precision Drive | OS 8.0 |
| Full OC | Fulltone OCD | OS 8.0 |
| **Kemper Fuzz** | Fuzz Face (germanium + silicon), Tycobrahe Octavia, Rocket Octavia | OS 8.1/8.2 |

The Kemper Drive is a single algorithm that morphs between all the classic overdrive voicings via its parameters. Ships with 20+ presets.

**Boost types:** Pure Booster, Treble Booster, Lead Booster (increase signal level without clipping).

### Wah Effects

| Effect | Description |
|---|---|
| Wah Wah | Standard bandpass filter wah |
| Wah Low Pass | Low-pass filter sweep |
| Wah High Pass | High-pass filter sweep |
| Wah Vowel | Talkbox-style formant filter |
| Wah Phaser | Manual phaser sweep via pedal |
| Wah Flanger | Manual flanger sweep via pedal |
| Wah Rate Reducer | Bit-crush/sample-rate reduction sweep |
| Wah Ring Modulator | Ring mod frequency sweep |
| Wah Frequency Shifter | Frequency shift sweep |
| Wah Formant Shifter | Formant shifting of single notes |

All wah effects support Touch Wah (dynamics-controlled) and auto-off functionality.

### Compressor

- **Compressor:** Faithful recreation of a vintage stomp compressor with unique "Squash" parameter controlling compression sponginess

### Noise Gate

- **Noise Gate 2:1** - gentle ratio
- **Noise Gate 4:1** - aggressive ratio
- **Spectral Noise Gate** (MK 2 dedicated slot)
- **Palm Ninja** (MK 2 dedicated second noise gate)

### Equalizer

| Effect | Description |
|---|---|
| Graphic Equalizer | 8-band octave EQ (80 Hz - 10 kHz), +/- 12 dB per band |
| Studio Equalizer | Full 4-band parametric EQ (professional mixing style) |
| Metal Equalizer | EQ voiced for high-gain tones |
| Stereo Widener | Stereo image enhancement |
| Phase Widener | Phase-based stereo widening |
| Delay Widener | Delay-based stereo widening |

### Chorus and Modulation

| Effect | Description / Reference |
|---|---|
| Vintage Chorus | Bucket-brigade chorus of the 1970s (Boss CE-1 / CE-2 era) |
| Hyper Chorus | Crystal-clear 1980s multi-chorus (Tri-Chorus style) |
| Air Chorus | Subtle, transparent chorus |
| Micro Pitch | Micro pitch detune effect (Eventide-style) |
| Vibrato | Pitch vibrato |

### Phaser and Flanger

| Effect | Description / Reference |
|---|---|
| Phaser | Up to 12 stages, unique "Spread" parameter |
| Vibe Phaser | Univibe-style LFO waveform with full Kemper phaser features |
| Phaser Oneway | Phaser with one-directional sweep |
| Flanger | Warm bucket-brigade emulation |
| Flanger Oneway | Flanger with one-directional sweep |

### Tremolo, Slicer, and Auto-Panning (OS 12.0)

| Effect | Description |
|---|---|
| Tremolo (3 types) | Three vintage tremolo voicings |
| Slicer (2 types) | Rhythmic amplitude gating |
| Auto Panner (2 types) | Stereo auto-panning derived from slicer patterns |

When placed in stereo-capable slots (X, MOD, DLY, REV), Tremolo becomes a stereo Auto Panner.

### Rotary Speaker

- Faithful Leslie speaker recreation with separate bass drum and tweeter horn speeds
- Combined with a profile of a real Leslie, described as "indistinguishable from the original"

### Pitch Effects

| Effect | Description |
|---|---|
| Transpose | Global pitch transposition |
| Pedal Pitch | Expression pedal-controlled pitch bend |
| Pedal Vinyl Stop | Pitch dives continuously to zero via expression pedal |
| Chromatic Pitch | Chromatic pitch shifting (chords supported) |
| Harmonic Pitch | Intelligent harmony in key, with custom user scales |
| Analog Octaver | Classic octave-down effect |
| Formant Shift | Maintains natural timbre at large pitch intervals |

### Acoustic Simulator

- Converts electric guitar tone toward acoustic character

### Delay Effects

**Core Delay Types:**

| Effect | Description |
|---|---|
| Single Delay | Basic mono delay |
| Dual Delay | Two independent delay lines (stereo) |
| Two Tap Delay | Two delays functioning in tandem |
| Serial Two Tap Delay | Two delays in series (output of first feeds second) |
| Rhythm Delay | Pattern-based rhythmic delays |
| Quad Delay | Four delay lines |

**Pitch Shifter Delays:**

| Effect | Description |
|---|---|
| Crystal Delay | Shimmer delay with pitch-shifted repeats |
| Loop Pitch Delay | Looping delay with pitch manipulation |
| Frequency Shifter Delay | Frequency-shifted repeats |
| Dual Chromatic Delay | Two chromatic pitch-shifted delay lines |
| Dual Harmonic Delay | Two harmony pitch-shifted delay lines |
| Dual Crystal Delay | Two shimmer delay lines |
| Dual Loop Pitch Delay | Two looping pitch delay lines |
| Melody Delay | Creates melodic patterns from repeats |
| Quad Chromatic Delay | Four chromatic pitch-shifted delay lines |
| Quad Harmonic Delay | Four harmony pitch-shifted delay lines |

**Key Delay Parameters (available across all delay types):**
- **Reverse Mix:** Blend between forward and reverse delay (full right = pure reverse delay)
- **Swell:** Auto-swell at delay input for pad-like textures
- **Smear:** Adds reverb that intensifies with each feedback repetition
- **Cross Feedback:** Delay lines feed into each other (Dual/Quad types)
- **Hi Cut / Lo Cut:** Tape-style tone shaping
- **Flutter Intensity / Shape:** Tape wow and flutter
- **Grit:** Tape saturation
- **Hold:** Infinite loop (feedback locked at 100%)
- **Infinity:** Feedback range extended to 100-200%
- **Ducking:** Available as a parameter, not a separate delay type

### Reverb Effects

| Effect | Introduced | Description |
|---|---|---|
| Legacy Reverb | Original | Backward-compatible reverb |
| Space | Original | Small room reflections, mono-to-stereo conversion |
| Natural Reverb | OS 5.7 | Realistic room/hall reverb |
| Easy Reverb | OS 5.7 | Simplified reverb with fewer parameters |
| Spring Reverb | OS 5.7 | Based on the 1963 Fender reverb tank; "Dripstone" parameter |
| Echo Reverb | OS 5.7 | Natural Reverb with feedback-enabled predelay for rhythmic repeats |
| Cirrus Reverb | OS 5.7 | Long ethereal tails with slow onset; no predelay |
| Ionosphere Reverb | Later | Vast, otherworldly ambient spaces |
| Formant Reverb | Later | Vocal-like resonant characteristics |

### Double Tracker (OS 8.6)

- Creates realistic double-tracked guitar sound
- **Super Stereo** mode included

### Other Utility Effects

- **Volume Pedal** (dedicated block on MK 2)
- **Headphone Space** (spatial enhancement for headphone monitoring)

---

## Amp Profiles

### Factory/Stock Profiles

The Profiler ships with 300+ pre-installed profiles spanning vintage classics, modern high-gain, and boutique amps for guitar and bass. An additional 1,400+ factory rigs are available through Rig Manager downloads. Factory rigs use creative alternative names rather than original brand names for legal reasons (e.g., no "Marshall" or "Fender" labels).

Profiles are organized via:
- **Tags:** Amp model, cabinet type, gain level, genre, author
- **Folders:** User-created folders for favorites
- **Search/Filter:** Full-text search in Rig Manager with tag-based filtering

### Rig Exchange (Free Community Profiles)

The Rig Exchange is Kemper's official cloud platform with 20,000+ free user-uploaded profiles. Features include tag-based search, amp/cabinet filtering, gain-level filtering, and one-click auditioning through Rig Manager.

### Rig Marketplace (Commercial)

Introduced with OS 9.0, the Rig Marketplace integrates 20+ commercial vendors directly into Rig Manager for in-app purchasing.

### Major Commercial Profile Makers

| Vendor | Specialty | Notes |
|---|---|---|
| **MBritt (Michael Britt)** | Vintage and rare amps; live/gigging optimized | Most recommended name in the Kemper community. Free 50-profile pack in Rig Manager. Profiles tailored for volume; rolls off harsh highs |
| **Tone Junkie** | Focused packs per amp model or style | Large catalog; generous free teasers. Also sells FX presets and Liquid Profile packs |
| **Top Jimi** | High/medium/low gain packs per amp (Mesa, ENGL, Friedman, etc.) | Free 18-profile pack in Rig Manager |
| **Choptones** | All digital formats; affordable; offers DI profiles | Pairs well with third-party IRs |
| **SinMix** | High-gain/metal specialist | One of the earliest third-party high-gain profilers |
| **The Amp Factory** | Wide range of genres and price points | 4 free packs in Rig Manager |
| **Guidorist** | Boutique amp profiles | Well-regarded in the community |
| **Live Ready Sound** | Live performance-optimized | Popular with gigging musicians |
| **RigBusters** | Various amps | Provided free Liquid Profiling launch content |
| **MattFig** | Various amps | Community favorite |
| **Bert Meulendijk** | Various amps | Active community contributor |

---

## Signal Flow

### Complete Signal Path

```
Guitar Input
  |
  v
Input Noise Gate
  |
  v
[Stomp A] -> [Stomp B] -> [Stomp C] -> [Stomp D]   (pre-stack, all mono)
  |
  v
AMP BLOCK (amplifier profile + Liquid Profiling tone stack)
  |
  v
CABINET BLOCK (mic'd cab simulation or Kemper Kone imprint)
  |
  v
[Effect X] -> [Effect MOD] -> [Effect DLY] -> [Effect REV]   (post-stack, stereo capable)
  |
  v
Output Section (Main, Monitor, Direct, Headphone, S/PDIF, USB)
```

On MK 2 units, the 7 additional dedicated blocks (Palm Ninja, Compressor, Pure Booster, WahWah, Vintage Chorus, Air Chorus, Double Tracker) are integrated at fixed points in the chain.

### Parallel Path

The Profiler offers a parallel signal path via the **Direct Mix** control on the amplifier block, which blends clean (unprocessed) guitar signal with the amp-processed signal. The parallel path splits through Stomp A/B and merges at the output. The routing is relatively fixed compared to some competitors.

Delay and Reverb modules can be configured anywhere on a serial-to-parallel continuum using a crossfader control.

### Hardware Effects Loop

- Can be inserted in any Stomp slot (A-D) or in X/MOD slots
- Only one loop instance can be active at a time (first in chain wins)
- X and MOD slots support Stereo Loop returns
- Head/Rack: 1 effects loop
- Stage: 2 effects loops
- Player: No effects loop

### Performance Mode vs Browser Mode

**Browser Mode:**
- Full library access to all stored rigs
- Rigs load one at a time from storage
- Small signal gap when switching rigs
- Best for: auditioning profiles, building rigs, studio use

**Performance Mode:**
- Organizes rigs into Performances of up to 5 Rigs (slots) each
- All 5 rigs pre-loaded into RAM for instant switching
- Seamless transitions with proper spillover
- Bank up/down navigation between Performances
- Best for: live performance

Rigs in Performance Mode are copies; editing a rig in Browse Mode does not change its Performance Mode copy, and vice versa.

### Morph Feature

Morph allows seamless, continuous transitions between two states of any rig by simultaneously adjusting multiple parameters:
- Controlled via expression pedal (Morph Pedal), footswitch press, or MIDI
- Can morph: Gain, Rig Volume, any effect parameter (mix, rate, depth, etc.), effect on/off states
- Example uses: clean-to-lead transitions, adding delay/reverb for solos, wah control, pitch bending
- Each parameter has independent Morph Rise and Morph base/morph target values

### Spillover Behavior

Delay and reverb tails continue naturally when switching rigs (spillover), with these requirements:
- Delay must be in the DLY module; Reverb must be in the REV module
- "Rig Spillover Off" must not be enabled in the Rig menu
- Works reliably in Performance Mode; Browser Mode may have small gaps
- Spillover may not function when switching from a morphed state
- High CPU load can occasionally prevent spillover

### Lock Function

The Lock feature keeps specific modules or settings persistent across all rig changes within a mode:
- Lock is global within its mode (Performance Mode lock applies to all Performances)
- Any effect module (A, B, C, D, X, MOD, DLY, REV) or the amp/cab section can be locked
- Useful for: maintaining consistent delay/reverb across rigs, keeping a compressor always on, preserving input settings
- Caution: Lock state in one mode can cause unexpected behavior when switching modes

---

## Unique Features

### Pure Cabinet

Pure Cabinet is a global DSP algorithm that reduces the harshness associated with close-microphone cabinet simulations. It smooths out artifacts like comb filtering and proximity effect without changing the fundamental tone character. It operates as a single algorithm affecting all signals uniformly -- it cannot adapt to specific mic positions. Available in full-range mode on the Kone; has no effect in Speaker Imprint mode.

### Liquid Profiling

See the detailed section under "How Profiling Works" above. In summary: combines a captured profile with a digitally modeled tone stack circuit so that EQ knobs behave like the original amp's controls. Approximately 40+ amp models available, with more added over time.

### Kemper Kone Speaker Imprints

19 classic guitar speaker models digitally recreated through the Kone's DSP-driven response. Adjustable via:
- **Sweetening:** Fine-tunes the speaker character
- **Directivity:** Controls the off-axis frequency roll-off behavior
- Imprints switch per-rig, so different rigs can use different speaker emulations
- Music from the Aux Input always plays in full-range mode regardless of imprint setting

### Lock Function

Covered in Signal Flow section above. Allows any section of the signal chain to persist when switching rigs.

### Looper

- Full looper with record, overdub, undo, reverse, and half-speed functions
- MK 1: 30-second maximum loop time (60 seconds at half speed)
- MK 2: 2-minute maximum loop time
- Controlled via Profiler Remote footswitches or Stage's built-in switches

### Rig Marketplace

In-app marketplace within Rig Manager (OS 9.0+) with 20+ integrated commercial vendors.

### USB Audio Interface Mode (OS 9.0+)

The Profiler functions as a class-compliant USB audio interface:
- MK 1: 4 channels USB audio at 44.1 kHz
- MK 2: 8 channels USB audio
- Supports reamping workflows directly in a DAW
- Compatible with macOS, Windows, and iOS

---

## Connectivity

### Audio Inputs

| Connection | Type | Notes |
|---|---|---|
| Guitar Input | 1/4" TS unbalanced | Front panel |
| Alternative Input | 1/4" TS | For line-level sources or second instrument |
| Return Input | 1/4" TS | Effects loop return; also used during profiling |
| S/PDIF Input | RCA coaxial | 44.1 / 48 / 88.2 / 96 kHz, 24-bit; master or slave mode |

### Audio Outputs

| Connection | Type | Notes |
|---|---|---|
| Main Output L/R | 1/4" TS unbalanced OR XLR balanced | Full stereo, cab-simulated signal; intended for PA/recording |
| Monitor Output | 1/4" TS | Can disable cab simulation for use with guitar cabs; independent EQ |
| Direct Output / Send | 1/4" TS | Configurable: DI output (for reamping), effects loop send, or profiling send |
| Headphone Output | 1/4" TRS stereo | Front panel; includes Headphone Space spatial enhancement |
| Speaker Output | Speakon / 1/4" | PowerHead/PowerRack only; 600W @ 8 Ohm, 300W @ 16 Ohm |
| S/PDIF Output | RCA coaxial | 44.1 / 48 / 88.2 / 96 kHz, 24-bit |

### Digital and Data

| Connection | Type | Notes |
|---|---|---|
| USB Type B | USB 2.0 | Rig Manager connection, USB audio interface, USB MIDI |
| USB Type A | USB 2.0 | USB memory sticks for backup and OS updates |
| S/PDIF In/Out | RCA coaxial | Digital audio I/O, master/slave clock modes |
| Ethernet (Remote) | Neutrik etherCON | Connects to Profiler Remote; up to 100m via powered hub |
| WiFi | Built-in (Stage only) | Wireless Rig Manager connection |
| Network Port | RJ45 (Head/Rack) | Wired Rig Manager connection via router |

### MIDI

| Connection | Notes |
|---|---|
| MIDI In (5-pin DIN) | Receive program changes, control changes, MIDI clock |
| MIDI Out/Thru (5-pin DIN) | Send program changes to external gear |
| USB MIDI | Mirrors MIDI In/Out functionality (except Send MIDI Clock) |

MIDI capabilities include: program change for rig/performance switching, control change for effect parameters and switching, MIDI clock receive for tempo-synced effects (delay, tremolo, etc.), and SysEx for advanced control.

### Pedal and Switch Inputs

| Model | Inputs |
|---|---|
| Head / Rack | 4x 1/4" TRS Pedal jacks + 2x 1/4" TRS Switch/Pedal jacks |
| Stage | Built-in footswitches + pedal/switch jacks |
| Player | 1x 1/4" TRS (single/dual switch or one expression pedal) |

Expression pedal impedance: 10 kOhm minimum, 100 kOhm maximum.

### Kemper Profiler Remote

- Connects via single etherCON Ethernet cable (7m cable included; no separate power supply needed)
- 8 footswitches: 5 for rig selection + 4 for stomp effect toggles (some shared)
- Dedicated Tuner, Tap Tempo, and Looper control buttons
- 4x 1/4" jacks for expression pedals or external switches
- Multi-color LED indicators per switch
- Large illuminated display readable from a distance
- Brushed aluminum construction for touring durability
- Compatible with both MK 1 and MK 2 Profiler units

### Power

| Model | Voltage | Max Current |
|---|---|---|
| Stage | 100-230V AC | 0.5A |
| Head / Rack | 90-275V AC | 0.5A |
| PowerHead / PowerRack | 100-125V or 190-245V AC | 10A |
