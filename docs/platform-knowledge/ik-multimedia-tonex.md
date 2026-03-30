# IK Multimedia TONEX - Technical Reference

## Product Line

### Hardware Products

| Product | Price (MSRP) | Presets | Included Software |
|---------|-------------|---------|-------------------|
| **TONEX Pedal** | $429.99 | 150 slots (50 banks x 3) | AmpliTube 5 + TONEX MAX |
| **TONEX Pedal Bass Edition** | $429.99 | 150 slots | TONEX Signature Bass Collection + AmpliTube 5, SVX 1 & 2 |
| **TONEX ONE** | $199.99 | 20 slots | AmpliTube 5 SE + TONEX SE |
| **TONEX ONE Bass Edition** | $199.99 | 20 slots | TONEX Signature Bass Collection + AmpliTube 5, SVX 1 & 2 |
| **TONEX ONE Brown Sound** | $249.99 | 20 slots | Brown Sound 78/79 collection + TONEX SE |
| **TONEX Capture** | $249.99 | N/A (capture box) | AmpliTube 5 SE + TONEX SE |
| **TONEX Cab** (FRFR) | $799.99 | N/A | AmpliTube 5 SE + TONEX SE |

### Software Tiers

| Tier | Tone Models | Amps | Pedals | Price | Own Modeling |
|------|-------------|------|--------|-------|-------------|
| **TONEX CS** (Free) | 20 | 10 | 5 | Free | No |
| **TONEX SE** | 200 | 20 | 10 | ~$49.99 | Yes |
| **TONEX** (Standard) | 400 | 40 | 20 | ~$149.99 | Yes |
| **TONEX MAX** | 1,000+ | 100 | 50 | ~$249.99 | Yes |

All paid tiers include the Modeler for creating your own Tone Models and access to ToneNET for browsing/downloading user-created models. Plugin formats supported: VST, VST3, AU, AAX. Works standalone or inside a DAW.

### AmpliTube 5 Integration

TONEX Tone Models function as native gear inside AmpliTube 5. Key integration features:

- **Drag-and-drop** Tone Models into the AmpliTube signal chain (amp, cab, or pedal slot)
- Tone Models behave like any other AmpliTube amp/cab/pedal and can be combined with existing AmpliTube gear
- **TONEX view** in AmpliTube 5 X provides dedicated browsing with filters by Type, Instrument, Character, Favorite, and Skin
- **Amp/cab separation**: AI modeling can separate amp and cab from a single capture, allowing independent cab swapping in the AmpliTube signal chain
- AmpliTube 5's signal chain supports up to 57 simultaneous models, series/parallel routing, and blended DI signal
- ToneNET presets liked online automatically sync to AmpliTube 5

### TONEX Capture Hardware

TONEX Capture is a dedicated reamping and tone-capture interface box with two separate signal paths:

**Signal Path 1 (To Amp):** Receives signal from your audio interface's line output and feeds it to your amp with up to 24 dB of attenuation. Galvanic isolation and ground lift eliminate hum and noise.

**Signal Path 2 (From Amp):** Totally passive circuit takes a copy of the amp's output without coloring the tone or affecting the amp's load. An output switch selects between LINE OUT (preamp out) and POWER OUT (speaker out) connections.

**Three capture modes:**
1. **Direct Capture** (no mic) - Takes the amp's direct output for silent/anywhere recording
2. **Mic'd Cabinet Capture** - Captures the full rig including cabinet via microphones
3. **Pedal Capture** - Routes recordings through pedals for analog color

LED indicators show power status (green), LINE INPUT clipping (red), and FROM AMP clipping (orange). Compatible with any reamp box and audio interface combination, including load boxes like the UAD OX.

---

## How Tone Modeling Works

### AI Machine Modeling Technology

IK Multimedia's proprietary "AI Machine Modeling" (AIMM) technology uses deep neural networks to create "Tone Models" -- hyper-realistic digital clones of real amps, cabs, and drive pedals.

### The Capture Process

1. **Signal injection**: A specially prepared audio file of real guitar/bass signals (not synthetic test tones) is sent from TONEX through the target gear
2. **Recording**: The processed (wet) signal is recorded back alongside the original DI (dry) signal
3. **Neural network training**: TONEX's deep learning network compares the DI and wet signals to compute an exact algorithmic model of the gear's behavior
4. **Result**: A "Tone Model" file that reproduces the gear's gain structure, EQ response, harmonic distortion characteristics, and dynamic feel

### How It Differs from Traditional Modeling and Profiling

| Approach | How It Works | Flexibility |
|----------|-------------|-------------|
| **Circuit Modeling** (AmpliTube) | Simulates the behavior of every component in the circuit | Full knob control, reacts like real gear |
| **Profiling** (Kemper) | Sends test tones through gear and builds a static profile | Snapshot of one setting, limited adjustability |
| **AI Machine Modeling** (TONEX) | Neural network trained on real guitar signals to clone the gear | Snapshot with input gain control; amp/cab separation possible |

Key distinction: TONEX Tone Models are snapshots of a specific amp/pedal at specific settings. Unlike circuit-modeled amps (AmpliTube, Helix, Axe-FX), you cannot freely turn the digital "knobs" and get the same range of response as the real gear. The gain control adjusts input saturation but does not replicate the amp's full gain range.

### Accuracy and Training

- Three quality/accuracy levels are selectable during training
- Training time ranges from approximately 5 minutes to 2 hours depending on quality setting, hardware, and complexity
- NVIDIA GPU with Maxwell architecture or later recommended on Windows for faster training
- Apple Silicon Macs achieve training in as little as 2 minutes with version 1.10's updated engine
- Tone Models are phase-perfect with ultra-low latency
- The technology can capture entire rigs including harmonically complex fuzz, overdrive, or distortion pedals in front of an amp
- Amp and cabinet captured together can be virtually separated to allow cab swapping

### What Cannot Be Captured

- Time-based effects (delay, reverb, chorus, flanger, phaser, tremolo)
- Compression effects
- Some vintage fuzzes and overdrives with internal parallel paths
- Only gain-based/distortion-type pedals can be captured as Tone Models

---

## Firmware / Software History

### Software Versions

| Version | Date | Key Changes |
|---------|------|-------------|
| **1.7.4** | Early 2024 | Tone Model folder management, preset rename on hover, TONEX ONE Global Setup panel, 35% latency improvement for pedal standalone mode |
| **1.8 (TONEX FX)** | November 2024 | Major free update: 8 new effects (2 delays, chorus, flanger, tremolo, phaser, rotary, spring reverb), 2 configurable pre/post FX blocks, advanced noise gate with pre/post option, TONEX Live Editor |
| **1.9.0 (Editor Update)** | March 2025 | Real-time editing between software and pedal (changes reflect immediately), direct access to hardware memory, streamlined preset auditioning |
| **1.9.1** | 2025 | 115 additional free Tone Models for MAX, 20 for SE/Standard; Factory Presets v2 folder; new AmpliTube 5 X TONEX view with search filters |
| **1.9.3** | Mid 2025 | TONEX ONE Brown Sound LE support, Pedal firmware 1.6.15, ONE firmware 1.3.15, reliability improvements |
| **1.10 (TONEX Modeler)** | 2025 | New standalone capture/training app, batch processing, up to 87% faster training on modern GPUs/Apple Silicon, improved high-gain accuracy (tighter lows, richer harmonics), automatic training stop |

### Pedal Firmware

The TONEX Pedal firmware is updated through the TONEX Editor desktop application. Release notes appear in the IK Product Manager. The November 2024 TONEX FX firmware update was the most significant, adding 8 effects and transforming the pedal from primarily an amp modeler into a more complete multi-effects solution.

A Factory Content v2 update provided 150 new gig-ready presets featuring 115 new Tone Models created with the advanced training engine.

### AmpliTube 5 X Update

Released alongside TONEX 1.8, AmpliTube 5 X added a dedicated TONEX view for easier Tone Model navigation with filtering by Type, Instrument, Character, Favorite, and Skin, plus an "Open TONEX App" button for quick access to editing and ToneNET downloads.

---

## Built-in Amp Models / Tone Models

### What Comes with Each Tier

**TONEX CS (Free):** 20 Tone Models, 10 amps, 5 pedals

**TONEX SE:** 200 Tone Models, 20 amps, 10 pedals

**TONEX Standard:** 400 Tone Models, 40 amps, 20 pedals

**TONEX MAX:** 1,000+ Tone Models (1,115+ after v1.9.1 update), 100 amps, 50 pedals

### Pre-Made Tone Model Categories

Tone Models are classified by character type:
- **Clean** - Crystal-clear, headroom-rich amp tones
- **Drive** - Crunch and overdrive territory
- **Hi-Gain** - High-gain and metal tones

### Notable Real-Amp References in the Premium Library

**Fender:** '57 Custom Deluxe, 1953 Bassman (5B6), Super Reverb, Twin Reverb, Hot Rod Deluxe, Pro Junior

**Marshall:** JMP 100W, Super Lead MKII, JCM 800, JCM 900, JVM410HJS, TSL100

**Vox:** AC30 Top Boost 1964 (with 2x12 Alnico Blue cabs)

**Mesa/Boogie:** Triple Rectifier, Mark V, Dual Rectifier, Mark IV A (various channel/mode captures: Classic Rhythm, Vintage Red, Heavy Rhythm, etc.)

**Other Notable Amps:** Peavey 5150 Block Letter, Soldano SLO-100, Two-Rock TS-1 V2 100W, Friedman BE-100 Deluxe, Dumble Overdrive Special, Diezel VH4, Dr. Z Maz 18

**Pedal Tone Models:** Various distortion, overdrive, fuzz, boost, and EQ effects captured from real pedals across all tiers.

IK publishes a full list of all Premium Tone Models as a PDF on their website. The list is regularly updated as new models are added.

---

## Effects

### Built-in Effects on the TONEX Pedal (Post-FX Update)

The TONEX Pedal now includes 15 effects across 7 configurable effect blocks:

| Category | Effects | Notes |
|----------|---------|-------|
| **Reverb** (6 types) | Spring 1, Spring 2, Spring 3, Room, Plate, Spring (new) | Stereo; algorithms derived from IK's X-SPACE reverb pedal |
| **Delay** (2 types) | 2 delay algorithms | Tap-tempo enabled |
| **Modulation** (5 types) | Chorus, Flanger, Tremolo, Phaser, Rotary | All tap-tempo enabled |
| **Compressor** | Analog-modeled compressor | Adjustable threshold, gain, attack; pre/post position |
| **EQ** | Analog-modeled equalizer | Low-frequency shelf + mid-frequency bell |
| **Noise Gate** | Advanced noise gate | Pre/post option; ultra-tight gating for modern styles |

### Effect Routing

- Each effect block can be placed **pre** or **post** Tone Model
- Two dedicated FX blocks are configurable independently
- All time-based effects support tap-tempo via the pedal's footswitch

### Real Pedal References

- **Reverbs**: Based on algorithms from the IK Multimedia X-SPACE reverb pedal (part of the X-GEAR product line)
- **Compressor and EQ**: Analog-modeled DSP effects (not AI-captured; built into the processing engine)
- The modulation and delay effects were added in the November 2024 TONEX FX update; specific real-world circuit references for these have not been publicly detailed by IK

### TONEX ONE Effects

The TONEX ONE received the same TONEX FX update and shares the same effect types. Its 20 preset slots each support the full effects chain.

### Important Distinction

The built-in DSP effects (reverb, delay, modulation, compression, EQ, gate) are traditional digital signal processing -- NOT AI-captured Tone Models. They complement the Tone Model engine by covering effect types that cannot be captured (time-based, phase-based, dynamics).

---

## ToneNET

### Overview

ToneNET is IK Multimedia's free community platform for sharing and discovering tones. It serves both AmpliTube 5 presets and TONEX Tone Models.

### Access Methods

1. **In-app**: Direct access from within TONEX software or AmpliTube 5 (including the free Custom Shop edition)
2. **Web browser**: Browse, search, and select at tone.net -- liked models automatically sync to your software on next launch
3. **Mobile**: Via the AmpliTube TONEX iOS app

### Features

- **Social feed**: Continuously updated feed of latest preset postings
- **User profiles**: Upload audio demos, add music links, interact with other users
- **Like system**: "Liking" a Tone Model online makes it available for instant download in your TONEX software
- **Following/followers**: Follow other users and manage your fanbase
- **Comments**: Leave feedback on others' presets
- **Search and filter**: Browse by name, artist/band, song/album, user, rating, type, character
- **VIP area**: Curated content from featured artists and brands

### Content Scale

Over 20,000 user-created Tone Models available for browsing and download. IK and the community continuously post new models.

### Premium vs Free Content

**Free content:**
- All user-uploaded Tone Models are free to download
- Browsing, searching, and interacting with the community is free
- Requires an IK Multimedia account

**Premium / Tone Partner Collections:**
- Curated collections created by professional tone creators and endorsed artists
- Captured to exact specifications with preferred settings, mics, outboard gear, and cabinets
- Purchasable within TONEX software or on ToneNET via browser
- Examples: Brown Sound collections, artist signature collections, brand-specific collections released monthly

**Gear trial:** If an AmpliTube preset uses gear you don't own, that gear can be activated and tested free for three days through the Custom Shop.

---

## Signal Flow (Pedal)

### Signal Chain Structure

```
INPUT -> [Noise Gate] -> [Pre FX Blocks] -> TONE MODEL -> [Post FX Blocks] -> [EQ] -> OUTPUT
                                                |
                                          (Amp + Cab or
                                           Amp only or
                                           Stomp only)
```

The full signal flow includes:
1. **Input Gain** - Adjusts saturation into the Tone Model
2. **Noise Gate** - Configurable pre or post position
3. **Up to 7 FX blocks** - Each individually assignable to pre or post Tone Model position
4. **Tone Model** - The AI-modeled amp/cab/stomp
5. **EQ section** - Low-frequency shelf + mid-frequency bell
6. **Compressor** - Configurable pre or post position
7. **Reverb** - Stereo output stage

### Routing Options

**Output modes:**
- **Stereo**: Left and right outputs carry the stereo-processed signal (stereo reverb/effects create independent L/R content)
- **Mono**: Use only the left output for single-amp setups

**USB routing:**
- **Stereo mode**: Stereo processed signal to USB OUT 1 and 2
- **Dual mode**: Processed signal to USB OUT 1, dry DI signal to USB OUT 2 (useful for reamping)

**Audio interface capability:** 24-bit/96 kHz USB audio interface for recording directly into a DAW.

### MIDI Control

**Connections:** Standard 5-pin DIN MIDI In/Out + USB MIDI

**Program Changes:**
- Presets 1-127 (00A through 63B): Standard MIDI Program Change message
- Presets 128+: Send MIDI Bank Change (CC#000) before Program Change
- Powers up in MIDI Patch Bank 0 by default

**Control Changes:**
- Every parameter is assignable to a MIDI CC
- Non-linear parameter ranges are equally divided across 128 CC steps
- MIDI channel configurable from 1-16

**MIDI Routing Modes:**
- **THRU**: MIDI input signals passed directly to MIDI outputs (both DIN and USB)
- **MERGE**: MIDI input signals merged with TONEX-generated MIDI and sent to outputs

**External control jack:** Supports single footswitch, dual footswitch, or expression pedal.

### Stereo Capabilities

- Mono input only (single 1/4" input jack)
- Stereo output via two 1/4" output jacks
- Stereo imaging is generated by the reverb and effects processing
- Headphone output mirrors the main stereo output

### Hardware Specifications

| Spec | Value |
|------|-------|
| Processing | 24-bit / 192 kHz |
| USB Audio | 24-bit / 96 kHz |
| Frequency Response | 5 Hz - 24 kHz |
| Dynamic Range | Up to 123 dB |
| Preset Storage | 150 presets (50 banks x 3) |
| Tone Model Storage | Up to 300 |
| Dimensions | 176 x 142 x 55 mm |
| Weight | 906 g |
| Power | 9V DC center negative, 320 mA |
| USB | Type B (pedal) / Type C (ONE) |
| Footswitches | 3 (bank up/down + preset select) |

---

## TONEX vs Competitors

### Comparison Matrix

| Feature | TONEX Pedal | Line 6 Helix / HX Stomp | Neural DSP Quad Cortex | Kemper Profiler |
|---------|------------|-------------------------|----------------------|-----------------|
| **Price** | $430 | $600-$1,700 | $1,400-$1,700 | $1,800+ |
| **Approach** | AI Machine Modeling | Circuit Modeling | Capture + Modeling | Profiling |
| **Built-in Effects** | 15 (basic) | 200+ (comprehensive) | 70+ (comprehensive) | 100+ (comprehensive) |
| **Amp Capture** | Yes | Coming (Proxy) | Yes | Yes (Profiling) |
| **Touchscreen** | No (3 knobs + 3 switches) | No (HX) / No | Yes | No |
| **Presets On-Board** | 150 | 128 (Stomp) / 1,024 (Floor) | 256 | Thousands |
| **Effects Loop** | No | Yes | Yes | Yes |
| **Expression Pedal** | External jack | Built-in (Floor) | Built-in | External |
| **Stereo I/O** | Mono in / Stereo out | Full stereo | Full stereo | Full stereo |
| **USB Audio Interface** | Yes (96 kHz) | Yes | Yes | No |
| **Community Sharing** | ToneNET (20K+ models) | CustomTone / Marketplace | Cortex Cloud | Rig Exchange |
| **Plugin Integration** | AmpliTube 5 + TONEX | Helix Native ($99+) | Cortex Plugins | Kemper Rig Manager |

### Key Differentiators (TONEX Strengths)

1. **Price-to-tone ratio**: At $430 (pedal) or $200 (ONE), offers capture-quality amp tones at a fraction of competitor pricing
2. **Capture quality**: Users consistently rate TONEX captures as comparable to or better than Quad Cortex captures for amp/cab accuracy
3. **Software ecosystem**: Seamless integration with AmpliTube 5 provides a complete studio solution; Tone Models work as native AmpliTube gear
4. **ToneNET community**: 20,000+ free user-created Tone Models, continuously growing
5. **Create your own models**: TONEX Capture + software lets you model any real amp/cab/drive pedal
6. **Ultra-compact option**: TONEX ONE at $200 is the most affordable quality amp modeler on the market
7. **DAW plugin**: TONEX works as VST/AU/AAX plugin; competitors charge separately for their plugin versions or don't offer one

### Limitations Compared to Helix / Quad Cortex

1. **Not an all-in-one solution**: Limited built-in effects; you will likely need external pedals for modulation, delay, and more complex effects chains (partially addressed by the TONEX FX update but still far fewer effects than competitors)
2. **No effects loop**: Cannot insert external effects between the pre-amp and power-amp stages of a Tone Model
3. **Mono input only**: Cannot process stereo input signals
4. **Snapshot-based tone**: Tone Models are snapshots at specific settings; cannot freely sweep amp controls like gain, treble, bass with the same realism as circuit-modeled amps (Helix, Fractal)
5. **Limited on-board controls**: 3 knobs and 3 footswitches vs. the extensive controls on Helix Floor or Quad Cortex
6. **Computer required for deep editing**: Swapping presets beyond on-board storage, creating captures, and detailed editing all require a connected computer
7. **No amp modeling engine**: Only captures/profiles; no ability to load a "Marshall JCM800 model" and tweak every parameter like Helix or Fractal offer
8. **USB-B connector on the pedal**: Older connector standard (TONEX ONE uses USB-C)
9. **No balanced outputs**: Professional live rigs may need a DI box for long cable runs to FOH
10. **Software UI**: The editing software has been criticized for clunky workflow compared to Helix Edit or the Quad Cortex touchscreen

### Best Use Cases for TONEX

- **Studio recording**: Load Tone Models as plugins in your DAW for tracking and mixing
- **Backup/small gig rig**: TONEX ONE as an ultra-portable emergency or small-venue solution
- **Pedalboard integration**: TONEX Pedal or ONE as the amp-in-a-box on a traditional pedalboard with separate stomp effects
- **Amp preservation**: Capture your own vintage or irreplaceable amps as Tone Models for reliable digital recreation
- **Budget-conscious players**: Professional-quality amp tones at the lowest price point in the capture/profiler category
