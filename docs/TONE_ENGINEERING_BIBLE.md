# Fader & Knob — Tone Engineering Bible

> The complete knowledgebase for creating, optimizing, and translating guitar tones
> across all major modeler platforms. Built from analysis of 300+ real presets,
> professional Worship Tutorials patches, Line 6 factory presets, and iterative
> testing with real Helix hardware.
>
> **Last updated:** April 2026
> **Sources:** 250+ Helix factory/community presets, 49 Worship Tutorials patches,
> Robbie Alderman's custom presets, faderandknob.com recipe database (50 recipes)

---

## Table of Contents

1. [Universal Tone Principles](#1-universal-tone-principles)
2. [Signal Chain Architecture](#2-signal-chain-architecture)
3. [Helix Family Platform Guide](#3-helix-family-platform-guide)
4. [Quad Cortex Platform Guide](#4-quad-cortex-platform-guide)
5. [Kemper Platform Guide](#5-kemper-platform-guide)
6. [Fractal Audio Platform Guide](#6-fractal-audio-platform-guide)
7. [Boss Katana Platform Guide](#7-boss-katana-platform-guide)
8. [TONEX Platform Guide](#8-tonex-platform-guide)
9. [Amp Model Reference](#9-amp-model-reference)
10. [Effect Block Reference](#10-effect-block-reference)
11. [Genre-Specific Tone Templates](#11-genre-specific-tone-templates)
12. [HLX File Format Specification](#12-hlx-file-format-specification)
13. [Common Mistakes & Fixes](#13-common-mistakes--fixes)

---

## 1. Universal Tone Principles

### The Tone Stack (What Makes a Guitar Tone)

```
Player Touch → Guitar + Pickups → Effects → Amp → Speaker Cabinet → Microphone → Room
     10%            15%              15%     30%        20%              5%          5%
```

The amp and cab account for 50% of the tone. Everything else is seasoning.

### The Three Rules

1. **Less gain than you think.** Studio recordings use far less gain than bedroom players expect. A Marshall Plexi at 5/10 drive sounds like a wall of distortion in a mix. At 8/10 it sounds like mud.

2. **The cab is half the tone.** Changing the cab/mic has more impact than changing the amp model. A bright amp through a dark cab sounds dark. A dark amp through a bright cab sounds bright.

3. **Compression is invisible but essential.** Every professional recording has compression on the guitar. It evens out dynamics, adds sustain, and makes the tone sit in a mix. Without it, tones sound amateur even with perfect amp settings.

### Frequency Ranges That Matter

| Range | What It Does | Too Much | Too Little |
|-------|-------------|----------|------------|
| 80-200 Hz | Weight, thump | Muddy, boomy | Thin, weak |
| 200-500 Hz | Body, warmth | Boxy, honky | Cold, hollow |
| 500-1kHz | Midrange presence | Nasal, harsh | Lost in mix |
| 1-4 kHz | Pick attack, clarity | Ice-pick, painful | Buried, dull |
| 4-8 kHz | Air, sparkle | Fizzy, scratchy | Dark, muffled |
| 8-16 kHz | Sizzle, shimmer | Noise floor | Lifeless |

### The Mix Context Rule

A tone that sounds great solo will sound terrible in a band. Tones need:
- **Less bass** than you think (bass guitar owns 80-200 Hz)
- **More mids** than you think (mids cut through drums and vocals)
- **Less gain** than you think (clarity > saturation in a mix)
- **Less reverb** than you think (reverb pushes you to the back of the mix)

---

## 2. Signal Chain Architecture

### Standard Order

```
Compressor → Drive(s) → Amp → Cab/IR → Modulation → Delay → Reverb
```

### Professional Preset Structure (learned from Worship Tutorials)

Every professional preset includes:

1. **Compressor** (always on) — transparent dynamics control
2. **2-3 Drive pedals** (all OFF by default) — user stomps on the one they need
3. **Amp** — the core tone
4. **Cab/IR** — the speaker character
5. **Modulation** (optional, often OFF) — chorus, phaser, tremolo
6. **Delay** — rhythmic repeats or ambient wash
7. **Reverb** — space and depth

### Why Multiple Drives OFF by Default?

Professional guitarists don't change presets for different song sections — they stomp on different drives:
- **Light OD** (Klon/Minotaur): verse boost, adds sustain without changing character
- **Medium Drive** (TS808/Scream 808): chorus push, thickens the mids
- **Heavy Gain** (Heir Apparent/Dhyana): solo boost, full saturation

Having all three available in one preset means one preset covers an entire setlist.

---

## 3. Helix Family Platform Guide

### Device IDs

| Device | ID | DSP Blocks | Paths |
|--------|-----|-----------|-------|
| Helix Floor | 2162689 | 32 | 4 |
| Helix LT | 2162692 | 32 | 4 |
| HX Stomp | 2162694 | 8 | 2 |
| HX Stomp XL | 2162696 | 8 | 2 |

### Verified Model IDs (from 300+ real presets)

#### Amps (most used → least used)

| Helix Name | Model ID | Real Amp | Type |
|-----------|----------|----------|------|
| Jazz Rivet 120 | HD2_AmpJazzRivet120 | Roland JC-120 | 3 |
| US Double Nrm | HD2_AmpUSDoubleNrm | Fender Twin | 3 |
| Revv Gen Red | HD2_AmpRevvGenRed | Revv Generator | 1 |
| Brit Plexi Brt | HD2_AmpBritPlexiBrt | Marshall Plexi | 1 |
| Cali Rectifire | HD2_AmpCaliRectifire | Mesa Rectifier | 3 |
| A30 Fawn Brt | HD2_AmpA30FawnBrt | Vox AC30 TB | 3 |
| US Deluxe Nrm | HD2_AmpUSDeluxeNrm | Fender Deluxe | 3 |
| US Deluxe Vib | HD2_AmpUSDeluxeVib | Fender Deluxe | 1 |
| US Princess | HD2_AmpUSPrincess | Fender Princeton | 1 |
| Brit 2204 | HD2_AmpBrit2204 | Marshall JCM800 | 3 |
| Brit 2203 | HD2_AmpBrit2203 | Marshall JCM800 | 1 |
| WhoWatt 100 | HD2_AmpWhoWatt100 | Hiwatt DR103 | 3 |
| Archetype Clean | HD2_AmpArchetypeClean | Line 6 Original | 1 |
| Essex A30 | HD2_AmpEssexA30 | Vox AC30 | 1 |
| Line 6 Litigator | HD2_AmpLine6Litigator | Line 6 Original | 1 |
| Derailed Ingrid | HD2_AmpDerailedIngrid | Dumble/Two Rock | 3 |
| Mail Order Twin | HD2_AmpMailOrderTwin | Fender Twin | 1 |
| PV Panama | HD2_AmpPVPanama | EVH 5150 | 1 |
| Soup Pro | HD2_AmpSoupPro | Supro Thunderbolt | 1 |
| Tweed Blues Brt | HD2_AmpTweedBluesBrt | Fender Bassman | 1 |
| Tweed Blues Nrm | HD2_AmpTweedBluesNrm | Fender Bassman | 3 |
| Cali Texas Ch1 | HD2_AmpCaliTexasCh1 | Mesa Lone Star | 1 |
| Cali IV Lead | HD2_AmpCaliIVLead | Mesa Mark IV | 1 |
| Das Benzin Mega | HD2_AmpDasBenzinMega | Diezel VH4 | 1 |
| Cartographer | HD2_AmpCartographer | Ben Adrian custom | 1 |
| Line 6 Clarity | HD2_AmpLine6Clarity | Line 6 Original | 1 |
| Fullerton Nrm | HD2_AmpFullertonNrm | Fender Fullerton | 1 |

**Note on @type:** Amps appear as both type 1 and type 3 in real presets. Both work. Use type 1 for consistency.

#### Cabs — Dual Format (HD2_CabMicIr_)

| Helix Name | Model ID | Real Cab |
|-----------|----------|----------|
| 1x10 US Princess | HD2_CabMicIr_1x10USPrincessWithPan | Fender Princeton |
| 1x12 US Deluxe | HD2_CabMicIr_1x12USDeluxeWithPan | Fender Deluxe |
| 1x12 Open Cream | HD2_CabMicIr_1x12OpenCreamWithPan | Cream open-back |
| 1x12 Open Cast | HD2_CabMicIr_1x12OpenCastWithPan | Open-back cast |
| 1x12 Cali EXT | HD2_CabMicIr_1x12CaliEXTWithPan | Mesa 1x12 |
| 1x12 Grammatico | HD2_CabMicIr_1x12GrammaticoWithPan | Grammatico |
| 2x12 Blue Bell | HD2_CabMicIr_2x12BlueBellWithPan | Vox Blue Bell |
| 2x12 Double C12N | HD2_CabMicIr_2x12DoubleC12NWithPan | Fender Twin |
| 2x12 Silver Bell | HD2_CabMicIr_2x12SilverBellWithPan | Silver Bell |
| 2x12 Mail C12Q | HD2_CabMicIr_2x12MailC12QWithPan | Fender C12Q |
| 2x15 Brute | HD2_CabMicIr_2x15BruteWithPan | Ampeg SVT |
| 4x10 Tweed P10R | HD2_CabMicIr_4x10TweedP10RWithPan | Fender Bassman |
| 4x12 Greenback 25 | HD2_CabMicIr_4x12Greenback25WithPan | Celestion G12M |
| 4x12 Cali V30 | HD2_CabMicIr_4x12CaliV30WithPan | Mesa V30 |
| 4x12 Uber V30 | HD2_CabMicIr_4x12UberV30WithPan | Bogner V30 |
| 4x12 1960A T75 | HD2_CabMicIr_4x121960AT75WithPan | Marshall 1960A |
| 8x10 SVT AV | HD2_CabMicIr_8x10SVTAVWithPan | Ampeg 8x10 |

#### Drives/Stomps

| Helix Name | Model ID | Real Pedal |
|-----------|----------|-----------|
| Scream 808 | HD2_DistScream808 | Ibanez TS808 |
| Minotaur | HD2_DistMinotaur | Klon Centaur |
| Teemah | HD2_DistTeemah | Timmy |
| Kinky Boost | HD2_DistKinkyBoost | Xotic EP Booster |
| Arbitrator Fuzz | HD2_DistArbitratorFuzz | Arbiter Fuzz Face |
| Triangle Fuzz | HD2_DistTriangleFuzz | EHX Big Muff (triangle) |
| Ram's Head | HD2_DistRamsHead | EHX Big Muff (Ram's Head) |
| Deez One Vintage | HD2_DistDeezOneVintage | Boss DS-1 |
| Vermin Dist | HD2_DistVerminDist | ProCo RAT |
| Compulsive Drive | HD2_DistCompulsiveDrive | Fulltone OCD |
| Horizon Drive | HD2_DistHorizonDrive | Horizon Precision |
| Heir Apparent | HD2_DistHeirApparent | Analogman Prince of Tone |
| Prize Drive | HD2_DistPrizeDrive | Wampler Pantheon |
| Dhyana Drive | HD2_DistDhyanaDrive | Hermida Zendrive |
| Stupor OD | HD2_DistStuporOD | MXR Distortion+ |
| Deranged Master | HD2_DistDerangedMaster | Maestro/Gibson booster |

#### Compressors

| Helix Name | Model ID | Real Pedal |
|-----------|----------|-----------|
| Deluxe Comp | HD2_CompressorDeluxeComp | Universal Audio 1176 |
| LA Studio Comp | HD2_CompressorLAStudioComp | Teletronix LA-2A |
| Red Squeeze | HD2_CompressorRedSqueeze | MXR Dyna Comp |
| Kinky Comp | HD2_CompressorKinkyComp | Xotic SP Comp |
| Rochester Comp | HD2_CompressorRochesterComp | Keeley Compressor |

#### Delays

| Helix Name | Model ID | Real Pedal |
|-----------|----------|-----------|
| Simple Delay | HD2_DelaySimpleDelay | Clean digital delay |
| Transistor Tape | HD2_DelayTransistorTape | Maestro Echoplex |
| Adriatic Delay | HD2_DelayAdriaticDelay | Boss DM-2 |
| Elephant Man | HD2_DelayElephantMan | Electro-Harmonix DMM |
| Vintage Digital V2 | HD2_DelayVintageDigitalV2 | Roland SDE-3000 |
| Cosmos Echo | HD2_DelayCosmosEcho | Roland RE-201 |
| Ducked Delay | HD2_DelayDuckedDelay | TC Electronic Flashback |
| Ping Pong | HD2_DelayPingPong | Stereo ping-pong |

#### Reverbs

| Helix Name | Model ID | Real Reverb |
|-----------|----------|------------|
| Plate | HD2_ReverbPlate | EMT 140 Plate |
| Hall | HD2_ReverbHall | Lexicon Hall |
| Room | HD2_ReverbRoom | Small room verb |
| Chamber | HD2_ReverbChamber | Live chamber |
| Glitz | HD2_ReverbGlitz | Strymon BigSky shimmer |
| Searchlights | HD2_ReverbSearchlights | Modulated reverb |
| Plateaux | HD2_ReverbPlateaux | Eventide Blackhole |
| 63 Spring | HD2_Reverb63Spring | Fender Spring |
| Octo | HD2_ReverbOcto | Eventide H3000 |
| Ganymede | HD2_ReverbGanymede | Deep space verb |
| Dyn Ambience | VIC_ReverbDynAmbience | Dynamic ambience |
| Dyn Room | VIC_ReverbDynRoom | Dynamic room |
| Rotating | VIC_ReverbRotating | Rotary reverb |

#### Other

| Category | Name | Model ID |
|----------|------|----------|
| Wah | Teardrop 310 | HD2_WahTeardrop310 |
| Wah | Chrome | HD2_WahChrome |
| Wah | Fassel | HD2_WahFassel |
| Chorus | 70s Chorus | HD2_Chorus70sChorus |
| Chorus | PlastiChorus | HD2_ChorusPlastiChorus |
| Chorus | Trinity Chorus | HD2_ChorusTrinityChorus |
| Phaser | Script Mod Phase | HD2_PhaserScriptModPhase |
| Tremolo | Optical Trem | HD2_TremoloOpticalTrem |
| Pitch | Pitch Wham | HD2_PitchPitchWham |
| EQ | Parametric | HD2_EQParametric |
| EQ | 10-Band Graphic | HD2_EQGraphic10Band |
| EQ | Cali Q | HD2_CaliQ |
| Volume | Vol/Pan | HD2_VolPanVol |

### Professional Preset Settings (Worship Tutorials Standard)

#### Compressor (Deluxe Comp)
```
Threshold: -36    (dB — not normalized)
Ratio: 2          (integer — gentle compression)
Knee: 6           (integer — soft knee)
Attack: 0.06      (fast but not instant — lets pick transient through)
Release: 0.91     (slow release — smooth sustain)
Mix: 0.74         (parallel compression — keeps dynamics)
Level: 0          (unity gain)
```

#### Amp Block
Always include these internal parameters alongside Drive/Bass/Mid/Treble:
```
Bias: 0.5         (tube bias point)
BiasX: 0.5        (crossover distortion)
Master: 1.0       (power amp section — always full)
ChVol: 0.35-0.90  (actual volume control)
Ripple: 0.5       (power supply ripple)
Sag: 0.5          (power amp sag/compression)
Hum: 0.5          (60-cycle hum amount)
```

Drive guidelines:
- Clean: 0.30-0.45
- Edge of breakup: 0.45-0.55
- Crunch: 0.55-0.70
- High gain: 0.70-0.85
- Extreme: 0.85-0.95

#### Cab Block (Dual Format)
```
Mic: 5            (ribbon mic — warmer, more polished than SM57)
Distance: 1.0     (inches from cone)
Position: 0.49    (near center — balanced frequency response)
Angle: 0          (straight on)
LowCut: 19.9      (Hz — let everything through)
HighCut: 16000    (Hz — let everything through)
Level: 0          (unity)
Pan: 0.5          (center)
Delay: 0          (no phase offset)
```

#### Reverb (Plate)
```
Mix: 0.23         (subtle — not washy)
Decay: 0.43       (medium tail)
Predelay: 0.07    (keeps pick attack clear)
LowCut: 125       (Hz — CRITICAL: removes mud from reverb tail)
HighCut: 6500     (Hz — CRITICAL: removes fizz from reverb tail)
Level: 0          (unity)
```

#### Delay (Simple Delay)
```
Time: 0.25-0.60   (depends on tempo)
Feedback: 0.30-0.55
Mix: 0.25-0.35
TempoSync1: 0     (0=off, set to 1 for synced delays)
```

---

## 4. Quad Cortex Platform Guide

### Naming Conventions
- Amps: Use exact QC model names (e.g., "Brit 2203" for JCM800)
- Effects: QC uses "Green 808" for TS808, "Crying Wah" for Cry Baby
- The QC prefix system: "Brit" = Marshall, "US" = Fender, no prefix = exact name

### Neural Captures vs Models
- **Captures**: AI-cloned snapshots of real amps — static, no tweakable tone stack
- **Models**: Traditional amp modeling — fully tweakable
- Captures sound more "real" but less flexible
- For recipes, always specify models (users can swap in captures)

### Key Differences from Helix
- 4 parallel signal paths (vs Helix's 2)
- Touchscreen UI (easier to navigate)
- Neural Capture feature (unique to QC)
- Cortex Cloud for community presets
- Uses `block_name` directly — no internal model IDs needed for the data

---

## 5. Kemper Platform Guide

### Profiling vs Modeling
- Kemper **profiles** are snapshots of real amps at specific settings
- Unlike modeling, profiles don't have a tone stack — the EQ was baked in at capture
- Liquid Profiling (OS 10+) adds a virtual tone stack on top of the profile
- Profiling 2.0 (OS 14) dramatically improves high-gain capture accuracy

### Rig Exchange
- Community library of 50,000+ profiles
- Search by amp name, style, or creator
- Each profile includes the cab — no separate cab block needed
- Users should search for profiles matching the original amp

### Key Settings
- Gain: works differently than other modelers — it's relative to the profile's inherent gain
- Pure Cabinet: simulates mic proximity effect — use for FRFR monitoring
- Rig volume vs Monitor volume vs Master volume — three independent controls

---

## 6. Fractal Audio Platform Guide

### Model Names (Axe-FX / FM9 / FM3)
- Marshall Plexi → "Plexi 100W High"
- Marshall JCM800 → "Brit 800"
- Fender Deluxe → "Deluxe Verb"
- Fender Twin → "Double Verb"
- Fender Champ → "5F1 Tweed"
- Vox AC30 → "AC-30 TB"
- Mesa Rectifier → "USA IIC+"
- Dumble → "Two-Stone J35"

### Common Copy-Paste Errors
When writing Fractal translations, NEVER reference Helix model names in the notes:
- ❌ "The Brit Plexi Brt is Helix's Plexi model"
- ✅ "Fractal's Plexi 100W High is the Marshall Plexi model"

### Key Differences from Helix
- Deeper parameter access (speaker impedance, negative feedback, bias excursion)
- Scene/channel system for preset organization
- More accurate amp modeling at the expense of CPU
- Smaller community preset library than Helix or QC

---

## 7. Boss Katana Platform Guide

### Amp Types
5 visible amp types with 22 hidden variations accessible via Tone Studio:
- Clean (3 variations)
- Crunch (3 variations)
- Lead (3 variations)
- Brown (3 variations)
- Acoustic (1 variation)

### Key Settings
- Power Control: allows cranked-amp tone at bedroom volume
- Gain: 0-100 on Tone Studio, mapped to 0-10 on the amp knob
- Effect slots: Booster, Mod, FX, Delay, Reverb — fixed order, one each

### Limitations
- Single amp type per preset (no amp switching)
- Fixed effect slot order
- No parallel paths
- Limited to 15 presets on the amp (more via Tone Studio)

---

## 8. TONEX Platform Guide

### Tone Models vs Traditional Modeling
- TONEX uses AI/ML to capture amp+pedal behavior as "Tone Models"
- Not traditional circuit modeling — closer to Kemper profiling but using neural networks
- ToneNET: community library of shared Tone Models (largest AI amp model library)

### Key Differences
- The TONEX Pedal has built-in effects (comp, drive, mod, delay, reverb) but limited
- TONEX software (plugin) has NO built-in effects — Tone Models only
- For recipes: specify ToneNET search terms, not specific model names
- Users need external effects for most signal chains

---

## 9. Amp Model Reference

### Amp-to-Platform Translation Table

| Real Amp | Helix | Quad Cortex | Fractal | Kemper | Katana |
|---------|-------|------------|---------|--------|--------|
| Marshall Plexi 1959 | Brit Plexi Brt | 1959 SLP | Plexi 100W High | Profile: "Plexi" | Brown |
| Marshall JCM800 2203 | Brit 2204 | JCM800 | Brit 800 | Profile: "JCM800" | Lead |
| Fender Twin Reverb | US Double Nrm | Twin Reverb | Double Verb | Profile: "Twin" | Clean |
| Fender Deluxe Reverb | US Deluxe Vib | Deluxe Reverb | Deluxe Verb | Profile: "Deluxe" | Crunch (low gain) |
| Vox AC30 Top Boost | Essex A30 / A30 Fawn Brt | AC30 TB | AC-30 TB | Profile: "AC30" | Crunch |
| Mesa Boogie Rectifier | Cali Rectifire | Recto | USA IIC+ | Profile: "Rectifier" | Lead |
| Mesa Mark IIC+ | Cali IV Lead | Mark IIC+ | USA IIC++ Lead | Profile: "Mark IIC+" | Lead |
| Dumble ODS | Derailed Ingrid | Two Rock | Two-Stone J35 | Profile: "Dumble" | Clean (high gain) |
| Fender Bassman | Tweed Blues Nrm | Bassman | 59 Bassguy | Profile: "Bassman" | Crunch |
| Hiwatt DR103 | WhoWatt 100 | Hiwatt | Hipower 100 | Profile: "Hiwatt" | Clean |
| Supro Thunderbolt | Soup Pro | Supro | Super Verb | Profile: "Supro" | Crunch (low gain) |
| EVH 5150 | PV Panama | 5150 | USA Lead+ | Profile: "5150" | Brown |
| Diezel VH4 | Das Benzin Mega | VH4 | Das Metal | Profile: "Diezel" | Lead |

---

## 10. Effect Block Reference

### Drive Pedal Translation Table

| Real Pedal | Helix | Quad Cortex | Fractal |
|-----------|-------|------------|---------|
| Ibanez TS808 | Scream 808 | Green 808 | TS808 |
| Klon Centaur | Minotaur | Klon | Klon |
| Boss DS-1 | Deez One Vintage | DS-1 | DS1 Distortion |
| ProCo RAT | Vermin Dist | RAT | RAT |
| EHX Big Muff | Ram's Head | Big Muff | Big Muff |
| MXR Dist+ | Stupor OD | MXR D+ | Distortion+ |
| Dallas Fuzz Face | Arbitrator Fuzz | Fuzz Face | Fuzz Face |
| Dunlop Cry Baby | Teardrop 310 | Crying Wah | Cry Baby |
| EHX Small Clone | PlastiChorus | Small Clone | Analog Chorus |
| MXR Phase 90 | Script Mod Phase | Phase 90 | Phase 90 |

---

## 11. Genre-Specific Tone Templates

### Blues (SRV, BB King, Mayer)

```
Comp: Deluxe Comp (Threshold: -36, Ratio: 2, Mix: 0.74)
Drive: Scream 808 (Drive: 0.30, Tone: 0.55, Level: 0.70) — OFF, engage for boost
Amp: US Deluxe Vib (Drive: 0.45, Bass: 0.55, Mid: 0.60, Treble: 0.65)
Cab: 1x12 US Deluxe (Mic: 5, Position: 0.49)
Delay: Simple Delay (Time: 350ms, Mix: 0.20, Feedback: 0.25)
Reverb: Plate (Mix: 0.23, Decay: 0.43, LowCut: 125, HighCut: 6500)
```

### Classic Rock (Page, Hendrix, Angus)

```
Comp: Deluxe Comp (Threshold: -36, Ratio: 2, Mix: 0.74)
Drive: Arbitrator Fuzz (Fuzz: 0.70, Vol: 0.65) — OFF for clean sections
Amp: Brit Plexi Brt (Drive: 0.65, Bass: 0.50, Mid: 0.65, Treble: 0.70)
Cab: 4x12 Greenback 25 (Mic: 5, Position: 0.49)
Delay: Transistor Tape (Time: 300ms, Mix: 0.15, Feedback: 0.20)
Reverb: Plate (Mix: 0.20, Decay: 0.35, LowCut: 125, HighCut: 6500)
```

### Modern Worship (Hillsong, Bethel, Elevation)

```
Comp: Deluxe Comp (Threshold: -36, Ratio: 2, Mix: 0.74)
Drive 1: Prize Drive (Drive: 0.16, Level: 0.75) — light shimmer
Drive 2: Heir Apparent (Gain: 0.35, Level: 0.90) — lead boost
Amp: Line 6 Clarity (Drive: 0.95, Bass: 0.60, Treble: 0.69, ChVol: 0.35)
Cab: 1x12 Open Cream (Mic: 5, Position: 0.49)
Chorus: Ampeg Liquifier (Rate: 0.31, Mix: 0.71) — OFF
Delay: Vintage Digital V2 (Time: dotted 1/8, Mix: 0.34, Feedback: 0.55)
Reverb: Plate (Mix: 0.23, Decay: 0.43, LowCut: 125, HighCut: 6500)
```

### Metal (Metallica, Dimebag, Morello)

```
Comp: Deluxe Comp (Threshold: -36, Ratio: 3, Mix: 0.70)
Drive: Horizon Drive (Drive: 0.40, Level: 0.80) — tight boost
Amp: Cali Rectifire (Drive: 0.75, Bass: 0.45, Mid: 0.60, Treble: 0.70)
Cab: 4x12 Uber V30 (Mic: 5, Position: 0.49)
EQ: Parametric (cut 200Hz, boost 2kHz) — optional tightening
Delay: Simple Delay (Time: 250ms, Mix: 0.10, Feedback: 0.15)
Reverb: Room (Mix: 0.15, Decay: 0.25, LowCut: 150, HighCut: 5000)
```

### Ambient/Shoegaze (Radiohead, My Bloody Valentine)

```
Comp: Deluxe Comp (Threshold: -36, Ratio: 2, Mix: 0.74)
Drive: Ram's Head (Sustain: 0.80, Tone: 0.40, Vol: 0.60) — wall of fuzz
Amp: Essex A30 (Drive: 0.55, Bass: 0.50, Mid: 0.55, Treble: 0.60)
Cab: 2x12 Blue Bell (Mic: 5, Position: 0.49)
Chorus: PlastiChorus (Rate: 0.40, Mix: 0.60)
Delay 1: Adriatic Delay (Time: dotted 1/8, Mix: 0.40, Feedback: 0.60)
Delay 2: Cosmos Echo (Time: 1/4, Mix: 0.30, Feedback: 0.45)
Reverb: Plateaux (Mix: 0.50, Decay: 0.70, LowCut: 100, HighCut: 8000)
```

---

## 12. HLX File Format Specification

### Root Structure
```json
{
  "data": {
    "meta": { "name", "application", "build_sha", "modifieddate", "appversion" },
    "device": 2162692,
    "tone": {
      "variax": { ... },
      "dtdual": { ... }, "dt0": { ... }, "dt1": { ... },
      "powercabdual": { ... }, "powercab0": { ... }, "powercab1": { ... },
      "global": { "@model", "@topology0", "@tempo", "@current_snapshot", ... },
      "snapshot0" through "snapshot7": { "@name", "@valid", "@tempo", "blocks", ... },
      "dsp0": { "inputA", "inputB", "outputA", "outputB", "split", "join", "block0"... },
      "dsp1": { ... }
    }
  },
  "meta": { "original": 0, "pbn": 0, "premium": 0 },
  "schema": "L6Preset",
  "version": 6
}
```

### Block Fields
```json
{
  "@model": "HD2_AmpUSDeluxeVib",     // MUST be exact verified model ID
  "@position": 0,                      // 0-7 on the signal path
  "@enabled": true,                    // active or bypassed
  "@path": 0,                          // 0=path A, 1=path B
  "@type": 1,                          // 0=stomp, 1=amp, 4=cab, 5=IR, 7=time
  "@stereo": false,                    // mono or stereo processing
  "@no_snapshot_bypass": false,        // snapshot bypass behavior
  "@bypassvolume": 1,                  // (amps only) volume when bypassed
  "@trails": false,                    // (delays/reverbs) tail behavior on bypass
  "Drive": 0.45,                       // parameters are FLAT FLOATS, not objects
  "Bass": 0.55
}
```

### Critical Rules
1. **Params are flat floats** — `"Drive": 0.45` NOT `"Drive": { "@value": 0.45 }`
2. **Some params are real units** — `Threshold: -36` (dB), `Ratio: 2` (integer), `MidFreq: 600` (Hz)
3. **Snapshots must NOT have `controllers: {}`** — omit the key entirely
4. **Split and Join blocks are required** — even on simple single-path presets
5. **DT and Powercab sections are required** — even if not using those devices
6. **Root-level `meta`** is separate from `data.meta` — both are required

### Cab Types
- Type 2: Legacy single-mic cab (e.g., `HD2_Cab4x12Greenback25`)
- Type 4: Dual-mic cab (e.g., `HD2_CabMicIr_4x12Greenback25WithPan`)
- Type 5: Impulse Response (`HD2_ImpulseResponse1024` or `HD2_ImpulseResponse1024Dual`)

Always use Type 4 (dual) for new presets — they're the modern standard.

---

## 13. Common Mistakes & Fixes

### Preset Generation Mistakes

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Guessing model IDs | HX Edit rejects unrecognized IDs | Only use verified IDs from real presets |
| `{ "@value": 0.5 }` param format | Helix uses flat floats | `"Drive": 0.5` directly |
| Missing split/join blocks | Required even on simple chains | Always include in dsp0 and dsp1 |
| `controllers: {}` in snapshots | Causes empty block rendering | Omit controllers key entirely |
| Missing DT/Powercab sections | Required by the schema | Include default DT and Powercab blocks |
| Cab type 2 instead of 4 | Legacy format, less flexible | Use HD2_CabMicIr_ with type 4 |
| No compressor | Sounds amateur, uneven dynamics | Deluxe Comp on every preset |
| Missing amp internals | Tone lacks depth and feel | Add Bias, Sag, Ripple, Master |
| Mic=0 (SM57) on cab | Harsh, clinical | Mic=5 (ribbon) for polished tone |
| No reverb LowCut/HighCut | Muddy, fizzy reverb tail | LowCut=125, HighCut=6500 |
| Drive too high | Muddy, undefined | Dial back 20-30% from initial instinct |

### Recipe Data Mistakes

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Fractal notes referencing Helix names | Confuses users on wrong platform | Always use the platform's own model names |
| Wrong amp for the artist | Destroys tone accuracy | Cross-reference against original gear |
| Missing cab block | Direct amp = buzzsaw tone | Every amp needs a matching cab |
| Cab after delay/reverb | Reverb through a speaker = weird | Cab always immediately after amp |
| Wrong guitar in description | Misleads users | Verify against actual recording credits |

---

## Appendix: Data Sources

### Preset Libraries Analyzed
- **Helix Factory Presets**: 250+ presets including "$$$ For Nothin'", "Cliffs of Grover", "Sultans", "Smoke on the H2O", etc.
- **Worship Tutorials**: 49 professional presets — CLARITY, MARS 74x, Greatsell17, Revv D25, Revelation Song, I Thank God, Rest On Us, AC30 Pitch
- **Robbie Alderman Custom**: "Alderman EG", "test" preset (Fullerton Nrm + dual cab + delays)
- **Fader & Knob Recipes**: 50 tone recipes covering 38 artists across 6 platforms

### Real Hardware Tested
- Helix LT (device ID 2162692) — primary test unit
- HX Edit v3.80 (appversion 58851328) — preset import/export validation

### Version History
- v1: Initial model map with guessed IDs (38 wrong)
- v2: Added missing blocks, fixed format structure
- v3: Matched real HX Edit blank preset exactly
- v4: Dual cab format (HD2_CabMicIr_) from test preset
- v5: All 38 IDs verified against 300+ real presets
- v6: Worship Tutorials quality standards applied to all 50 recipes
- v7: Snapshot controllers fix (empty blocks bug)
