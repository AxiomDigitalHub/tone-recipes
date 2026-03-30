# Fractal Audio Systems -- Technical Reference

## Product Line

### Current Products (All Mark II Turbo Variants)

| Product | Form Factor | Price (MSRP) | DSP Architecture | Grid Size |
|---|---|---|---|---|
| **Axe-FX III Mk II Turbo** | 3U Rack | $2,499 | 2x SHARC+ (TI) dual-core, +25% Turbo boost | 6 rows x 14 columns |
| **FM9 Mk II Turbo** | Floorboard (9 switches) | $1,799.99 | 2x dual-core Analog Devices DSPs (4 cores total) | 4 rows x 12 columns |
| **FM3 Mk II Turbo** | Compact Floorboard (3 switches) | $1,099.99 | SC587 "Griffin" 3-core (1 ARM + 2 SHARC+), +10% Turbo | 4 rows x 12 columns |

**Processing Power Hierarchy:**
- Axe-FX III has approximately 2x the power of the FM9
- FM9 has approximately 2x the power of the FM3
- All three share identical amp modeling algorithms -- a preset on the FM3 sounds the same as on the Axe-FX III; only the number of simultaneous blocks differs

**Mark II Turbo Improvements (across all models):**
- 10--25% additional DSP processing headroom
- Larger footswitch mini-displays with double-height characters
- Improved readability from standing position
- FM9/FM3: gapless preset switching

### Foot Controllers

| Controller | Price | Switches | Dimensions | Weight |
|---|---|---|---|---|
| **FC-12 Mark II** | $749.99 | 12 | 20.2" x 9.2" x 3.5" | 11 lbs |
| **FC-6 Mark II** | $549.99 | 6 | 11.2" x 9.2" x 3.5" | 6.7 lbs |

**FC Controller Features:**
- SSS (Solid State Switch) technology -- silent, no mechanical contacts
- 2x20 transflective main display
- Variable-color LED ring per switch (on/off/dim states)
- Larger mini-displays on Mark II (1.9" x 0.7", up from 1.4" x 0.5")
- Add up to 4 external pedals + 4 switches per FC unit
- Daisy-chain up to 4 FC units (Axe-FX III supports 4, FM9/FM3 support 2)
- FC firmware is built into the host processor -- no separate updates needed
- Rugged steel chassis
- Compatible with Axe-FX III, FM9, FM3 only (NOT compatible with Axe-FX II, AX8, FX8)

### Other Current Products

| Product | Description | Price |
|---|---|---|
| **AM4** | Compact amp modeler + multi-FX (newest product, Cygnus X-3) | -- |
| **VP4** | Virtual Pedalboard, effects-only (4 footswitches) | -- |
| **Cab-Lab 4** | IR mixer + tools software (now FREE) | Free |
| **ICONS** | Amp modeling VST/AU plugin with DynaCab HD | -- |

### Discontinued Models (Brief)

| Product | Years | Notes |
|---|---|---|
| **Axe-FX Standard** | 2006--2011 | Original rack unit, single DSP |
| **Axe-FX Ultra** | 2008--2011 | 2x processing power of Standard, Ultra-only effects |
| **Axe-FX II / II XL / II XL+** | 2011--2019 | Multiple revisions; final firmware "Ares 2.00" (Sept 2019); 256MB RAM vs 4GB on III |
| **FX8 / FX8 Mark II** | ~2015--2019 | Effects-only floor unit, no amp modeling, optimized for 4CM |
| **AX8** | ~2016--2019 | All-in-one floor unit (Axe-FX II engine), 222+ amp models, final FW 10.01 |
| **MFC-101 (Mk I/II/III)** | 2009--2018 | MIDI foot controller for Axe-FX II/Ultra/Standard; NOT natively compatible with Axe-FX III (MIDI-only fallback) |

---

## Firmware History

### Current Firmware Versions (as of March 2026)

| Product | Version | Release Date | Notes |
|---|---|---|---|
| **Axe-FX III** | 32.02 | March 6, 2026 | Improved preamp modeling, Drive block oversampling, reduced CPU in some blocks |
| **FM9** | 11.00 | January 19, 2026 | Synced with Axe-FX III FW 31.03 |
| **FM3** | 12.00 | January 19, 2026 | Synced with Axe-FX III FW 31.03 |
| **AM4** | 2.00 | March 20, 2026 | Synced with Axe-FX III FW 32.02 |
| **VP4** | 4.02 | March 20, 2026 | -- |

### Cliff Chase's Modeling Philosophy

Fractal Audio's founder and chief engineer Cliff Chase developed a **virtual circuit modeling** approach:

- Amps are not modeled as monolithic units -- individual **components** (tubes, transformers, capacitors, resistors) are modeled separately
- Each component has parameters, I/O, and an internal "motor" (engine)
- A set of linked components forms one amp model, mirroring the real circuit topology
- If a firmware update improves "tube X" (a component), ALL amp models using that tube type benefit automatically
- Firmware is coded in C/C++ and hand-coded assembly for DSP-critical functions
- Fractal uses custom assembly libraries rather than compiler-provided DSP libraries for measurable and audible improvements
- The "Chase Transform Technique" converts analog networks to equivalent digital filters with improved high-frequency accuracy
- "Chase Nonlinear Feedback" (CNFB) technique solves nonlinear ODEs for improved clipping and power supply sag behavior

### Major Firmware Milestones

| Version | Name | Date | Key Additions |
|---|---|---|---|
| 1.00 | -- | 2018 | Axe-FX III launch firmware |
| 5.00 | Ares | 2019 | Major amp modeling improvements, new models |
| 9.00--12.00 | Ares (continued) | 2019--2020 | FAS Crunch, FAS Class-A, FAS Brootalz, FAS Modern II, many new amp models |
| **16.00** | **Cygnus** | April 2021 | Complete overhaul of amp modeling algorithms; new power amp bias algorithm; amps feel tighter, more vocal, more dynamic; greater variation between models; removed Dynamic Presence/Depth |
| 17.00 | Cygnus (cont.) | 2021 | FAS Modern III, additional amp models |
| **21.00** | **Cygnus X-2** | 2022 | Improved output transformer B-H curve modeling, speaker impedance effects on transformer response, improved power tube modeling, improved cathode follower, improved triode algorithm |
| 25.00+ | Cygnus X-2 (cont.) | 2023 | FullRes IR technology, DynaCab improvements |
| **28.00+** | **Cygnus X-3** | 2024 | Latest amp modeling generation, available on all current products |
| 31.00 | -- | 2025 | Continued refinements, new reverb models (Tube Spring, Studio Spring) |
| 32.00--32.02 | -- | 2026 | Drive block oversampling, improved preamp modeling, aliasing fixes |

### Editor Software

| Software | Platform | Purpose |
|---|---|---|
| **Axe-Edit III** (v1.14.30) | Mac / Windows | Full preset editor for Axe-FX III, drag-and-drop Quick Build mode |
| **FM9-Edit** (v6.00+) | Mac / Windows | Full preset editor for FM9 |
| **FM3-Edit** | Mac / Windows | Full preset editor for FM3 |
| **Fractal-Bot** | Mac / Windows | Firmware updater, backup/restore utility (also integrated into editors) |

---

## Amp Models (Exhaustive)

Fractal Audio has the largest amp model library in the industry with **280+ amp models** (Axe-FX III). All models use the Cygnus X-3 virtual circuit modeling engine. Most amp blocks offer **4 channels** (A/B/C/D) for instant switching between completely different amp configurations.

### Fender-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| 5F1 Tweed | Fender Champ (5F1 narrow-panel) | Slightly different circuit from stock 5F1, has cathode bypass caps for more gain |
| 5F1 Tweed (EC) | Fender Champ (Eric Clapton mod) | Modified version |
| 5F8 Tweed | Fender Twin (5F8, 1959) | Based on Keith Urban's "#1" high-powered Tweed Twin |
| 59 Bassguy | Fender Tweed Bassman (5F6-A, 1959) | The amp that inspired Marshall; warm, early breakup |
| 59 Bassguy Nrml | Fender Tweed Bassman Normal channel | -- |
| 59 Bassguy Brt | Fender Tweed Bassman Bright channel | -- |
| 65 Bassguy | Fender Blackface Bassman (AB165) | Dirtier/nastier than Tweed version |
| 65 Bassguy Nrml | Fender Blackface Bassman Normal ch | -- |
| Dweezil's Bassguy | Fender Bassman (Dweezil Zappa's) | -- |
| Band-Commander | Fender Bandmaster | -- |
| Deluxe 6G3 | Fender Brownface Deluxe (6G3) | Bright channel |
| Deluxe Tweed | Fender Tweed Deluxe (5E3) | -- |
| Deluxe Verb | Fender Deluxe Reverb (Blackface) | -- |
| Double Verb | Fender Twin Reverb | -- |
| Jr Blues | Fender Blues Junior | -- |
| Princetone | Fender Princeton Reverb | -- |
| Super Verb | Fender Super Reverb (Blackface) | -- |
| Tremolo Lux | Fender Tremolux | -- |
| Vibra-King | Fender Vibro-King | -- |
| Vibrato Lux | Fender Vibrolux | -- |
| Vibrato Verb | Fender Vibroverb | -- |
| 6G4 Super | Fender Brownface Super (6G4) | -- |
| 6G12 Concert | Fender Brownface Concert (6G12) | -- |
| Fuzz Tweed | Fender Tweed (cranked/fuzzy) | -- |

### Marshall-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| 1959SLP | Marshall Super Lead Plexi 1959 (100W) | -- |
| 1959SLP Jumped | Marshall 1959 reissue (jumped inputs) | Both channels linked |
| 1987X | Marshall 1987X Plexi reissue (50W) | -- |
| 1987X Jumped | Marshall 1987X (jumped inputs) | -- |
| Plexi 50W | Marshall Plexi 50W variants | Multiple channel options |
| Plexi 100W | Marshall Plexi 100W variants | -- |
| Brit 800 | Marshall JCM800 2203 | -- |
| Brit 800 #34 | Marshall JCM800 (modified, #34) | -- |
| Brit AFS100 | Marshall AFD100 (Slash signature) | -- |
| Brit JM45 | Marshall JTM-45 | -- |
| Brit JVM OD1 | Marshall JVM410H (OD1 channel) | -- |
| Brit JVM OD2 | Marshall JVM410H (OD2 channel) | -- |
| Brit Pre | Marshall JMP-1 preamp | -- |
| Brit Silver | Marshall Silver Jubilee (2555) | -- |
| JMPRE-1 | Marshall JMP-1 preamp | -- |
| JS410 | Marshall JVM410HJS (Joe Satriani) | -- |
| Whole Lotta | Marshall Super Lead (Jimmy Page style) | -- |

### Mesa/Boogie-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Recto 1 / Recto 2 | Mesa Dual/Triple Rectifier | Multiple variants |
| Texas Star | Mesa Lone Star | -- |
| Triple Crest | Mesa Triple Crown | -- |
| USA Bass 400 | Mesa Bass 400 | Bass amp model |
| USA JP IIC+ | Mesa Mark IIC+ (John Petrucci) | -- |
| USA Metro Blues | Mesa Blue Angel/Maverick | -- |
| USA MK IIC+ | Mesa Mark IIC+ | -- |
| USA MK IV | Mesa Mark IV | Lead and rhythm channels |
| USA MK V | Mesa Mark V | -- |
| USA Pre | Mesa TriAxis preamp | Multiple channels (Green/Yellow) |
| USA Lead / Lead+ / Lead Brt | Mesa Lead channel variants | -- |
| USA Rhythm | Mesa Rhythm channel | -- |

### EVH / Peavey 5150-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| PVH 6160 Block | EVH 5150 "Block Letter" / Peavey 6505 | Original 5150 |
| PVH 6160+ | EVH 5150 II / Peavey 6505+ | -- |
| 5153 Green | EVH 5150-III 100W (Clean ch) | -- |
| 5153 Blue | EVH 5150-III 100W (Crunch ch) | Also 50W Blue variant |
| 5153 Red | EVH 5150-III 100W (Lead ch) | Bright switch enabled |
| 5153 Stealth | EVH 5150-III Stealth | -- |
| FAS 6160 | FAS version of 5150 (less fizzy) | Bouncier feel than original |

### Vox-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| AC-30 TB | Vox AC30 Top Boost | Brilliant channel with tone stack |
| AC-30 (other variants) | Vox AC30 (Normal, etc.) | Normal channel: no tone stack |
| A-Class 15 | Vox AC15 | Class A, EL84 |
| Citrus A30 | Vox AC30-style (Orange variant) | -- |

### Bogner-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Euro Red | Bogner Ecstasy 20th Anniversary (Red ch) | -- |
| Euro Blue | Bogner Ecstasy (Blue channel) | -- |
| Euro Uber | Bogner Uberschall | -- |
| Shiver | Bogner Shiva 20th Anniversary | -- |

### Friedman-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Friedman BE | Friedman Brown Eye (BE-100) | -- |
| Friedman HBE | Friedman Hairy Brown Eye | Higher gain version |
| Dirty Shirley | Friedman Dirty Shirley | Feedback from speaker jack (unusual design) |
| Friedman Small Box | Friedman Small Box | -- |

### Diezel-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Das Metall | Diezel VH4 | -- |
| Dizzy V4 (Blue/Red) | Diezel VH4 (ch 2/ch 3) | -- |
| Herbie | Diezel Herbert | 180W, KT66/KT77, Ch2 & Ch3 modeled |

### Dumble-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| ODS-100 Clean | Dumble Overdrive Special (Clean) | -- |
| ODS-100 HRM | Dumble ODS with HRM circuit | -- |
| ODS-100 Lead | Dumble ODS (Lead/OD) | -- |
| Bludojai | Bludotone Ojai (Dumble clone) | Same schematic as the "Tan" boutique amp (Robben Ford) |

### Soldano-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Solo 100 Lead | Soldano SLO-100 (Lead channel) | -- |
| Solo 100 Rhythm | Soldano SLO-100 (Rhythm channel) | -- |
| Solo 88 Rhythm | Soldano X88 preamp | -- |
| Solo 99 Clean/Lead | Soldano X99 preamp | -- |

### ENGL-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Angel Severe | ENGL Savage 120 | Unique presence network |
| Energyball | ENGL Powerball | 100W, 6L6, aggressive high-gain |

### Cameron-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Cameron Ch 1 / Ch 2 | Cameron CCV-100 | -- |
| Atomica High / Low | Cameron Atomica | Modified JCM800 with Jose-style zener clipper |

### Carol-Ann-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Carol-Ann OD2 | Carol-Ann OD-2 | -- |
| Carol-Ann Triptik | Carol-Ann Triptik | Multiple channels |

### Matchless-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Matchbox D-30 | Matchless DC-30 | Class A, 30W, EL84 |
| Matchbox Chieftain | Matchless Chieftain | -- |

### Trainwreck-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Wrecker Express | Trainwreck Express | Similar to Plexi, EL34 or 6V6 |
| Wrecker Rocket | Trainwreck Rocket | -- |
| Wrecker Liverpool | Trainwreck Liverpool | -- |

### Komet-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Comet 60 | Komet 60 | Ken Fischer design, 50-60W, EL34 |
| Comet Concourse | Komet Concorde | Rock-oriented, EL34, 50/60W |

### Morgan-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| AC-20 | Morgan AC20 Deluxe | Vox-inspired, no tone stack on normal channel |

### Hiwatt-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Hipower | Hiwatt DR103 | Cliff's own 1974 Harry Joyce/Hylight era unit |

### Orange-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Citrus RV50 | Orange Rockerverb 50 | -- |
| Citrus A30 | Orange AD30 | -- |

### Splawn-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Spawn Rod (OD-1/OD-2) | Splawn Quickrod | Hot-rodded Marshall style, multiple gears |
| Spawn Nitrous | Splawn Nitro | High-gain metal |

### Cornford-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Corncob M50 | Cornford MK50H II | EL34 or 6L6, solid-state rectifier |

### Blankenship-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Blanknshp Leeds | Blankenship Leeds | Boutique 18W Marshall; modeled from Dweezil Zappa's amp |

### PRS-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Archon Clean/Lead | PRS Archon | 6 large filter caps on B+ supply |

### Suhr-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Badger 18 | Suhr Badger 18 | -- |
| Badger 30 | Suhr Badger 30 | Excellent cleans and edge-of-breakup |

### Dr. Z-Based Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Mr. Z 38 SR | Dr. Z MAZ 38 SR | -- |
| Z Route 66 | Dr. Z Route 66 | -- |

### Other Boutique / Miscellaneous Models

| Fractal Model Name | Based On | Notes |
|---|---|---|
| Dee Cee 30 | Custom Audio Amplifiers (Suhr) OD-30 | -- |
| Fox ODS | Fuchs ODS | Dumble-style |
| Hot Kitty | Bad Cat Hot Cat | -- |
| Nuclear Tone | -- | -- |
| Ruby Rocket | -- | -- |
| Two-Stone J35 | Two-Rock Jet 35 | -- |
| Tiny Terror | Orange Tiny Terror | -- |
| Tucana / Tucana II | Fryette/VHT Pittbull | -- |
| Champlifier | -- | -- |
| Supremo Trem | Supro Tremolo | -- |

### FAS Original Models (Fractal Audio Custom Designs)

These are original amp designs created by Cliff Chase, not based on any specific real-world amp:

| Fractal Model Name | Description | Notes |
|---|---|---|
| FAS Brootalz | Accidental hybrid: SLO-100 front end + Savage back end | Aggressive high-gain |
| FAS Brown | "Brown sound" inspired | Eddie Van Halen territory |
| FAS Buttery | Smooth lead tone | -- |
| FAS Class-A | Blackface preamp + cathode-biased 6L6 PA, no NFB | Happy accident from Carr Rambler modeling |
| FAS Clean | Clean platform | -- |
| FAS Crunch | Sweet spot between Plexi, 800, and modded 800 | -- |
| FAS Express | -- | -- |
| FAS Hot Rod | -- | -- |
| FAS Lead 1 | Lead-oriented high gain | -- |
| FAS Lead 2 | Lead-oriented high gain (variant) | -- |
| FAS Modern | Modern high-gain | One of most popular models |
| FAS Modern II | Tighter FAS Modern + 5150-style bass boost | Added FW 10 |
| FAS Modern III | Recto-like with tighter bass, cathode-biased PA | Added FW 17 |
| FAS Rhythm | Blend of British and USA crunch | -- |
| FAS Skull Crusher | Extreme high-gain | -- |
| FAS Stealth Blue | -- | -- |
| FAS Wreck | Original Wrecker 1 from Axe-FX Standard/Ultra | -- |

> **Note:** The full amp model list exceeds 280 entries and grows with each firmware update. The definitive source is the [Fractal Audio Wiki Amp Models List](https://wiki.fractalaudio.com/wiki/index.php?title=Amp_models_list). Community member Yek's guide provides extensive detail on each model's history and best settings.

---

## Cab Models & IRs

### Stock Cabinet Library

- **2,237+ factory IRs** in UltraRes format across two Factory banks (1,024 each)
- **Legacy bank** containing all 189 stock cabs from the Axe-FX II
- **10 FullRes IRs** included on Axe-FX III Mark II and Turbo models
- Cabinets captured with professional microphones: Shure SM57, Shure SM7, Royer R121, Sennheiser MD421, Sennheiser E906, Beyerdynamic M160, Audio-Technica AT4047, SE Electronics RNR1, Shure KSM313

### IR Formats & Resolutions

| Format | Length | Samples | Use Case |
|---|---|---|---|
| **Normal** | ~20ms | 1,024 | Standard cab simulation, lowest CPU |
| **High-Res** | ~40ms | 2,048 | More room information captured |
| **UltraRes** | ~170ms | Compressed to 2,048 file | Always minimum phase, excellent fidelity |
| **FullRes** | Up to 1.37 seconds | Extended | Room/ambience capture, far exceeds typical IR length |

### DynaCab Technology

DynaCab transforms IR selection into a visual, intuitive process:
- Select a virtual speaker cab and microphone
- Adjust mic position and distance in real-time with visual feedback
- Behind the scenes, the appropriate IR is loaded seamlessly
- DynaCab IRs are full 2,048 samples with fine spatial resolution
- All DynaCab IRs are time-aligned regardless of distance setting (no phase issues when mixing)
- Available on Axe-FX III, FM9, FM3, and AM4

**DynaCab HD (ICONS plugin only):**
- Higher temporal and spatial resolution
- 360-degree placement at variable distances
- 11 microphone models (vs 4 on hardware)
- Uses significantly more memory

### IR Loading & Management

- Import standard .wav IRs via Manage Cabs tool in editor software
- Drag-and-drop wav files into editor Browser pane for automatic conversion
- Options for minimum phase conversion and auto-trim
- Can create UltraRes or non-UltraRes cabs from imported files
- Cab-Lab 4 (free) provides 4-channel IR mixing, EQ, alignment tools

### Microphone Models (Built-in Simulation)

Classic mic simulations available in the Cab block:
- Shure SM57
- Royer R-121 (ribbon)
- Sennheiser E609
- Neumann U87
- Neumann U67
- Electro-Voice RE16
- AKG D112
- Additional models per firmware updates

### Mic Placement Codes (IR Naming Convention)

| Code | Meaning |
|---|---|
| CN | Center Cone |
| CE | Cap Edge |
| CNE | Cone Edge |
| CNT | Center Dust Cap |
| OA | Off-Axis |

Proximity effect parameter simulates moving the mic closer/farther from the speaker.

---

## Effects (Exhaustive List)

The Axe-FX III features one of the deepest effects inventories of any guitar processor. Below is a complete block-by-block breakdown.

### Block Inventory Summary (Axe-FX III)

| Block Type | # of Types | # of Blocks Available |
|---|---|---|
| Amp | 280+ models | 2 blocks, 4 channels each |
| Cab | 2,237+ IRs | 4 blocks, 4 channels each |
| Chorus | 14 types | 2 blocks, 4 channels each |
| Compressor | 6+ types | 2 blocks, 4 channels each |
| Delay | 18 types | 2 blocks, 4 channels each |
| Drive | 37+ types | 2 blocks, 4 channels each |
| Filter | 12 types | 4 blocks, 4 channels each |
| Flanger | 8 types | 2 blocks, 4 channels each |
| Graphic EQ | -- | 4 blocks, 4 channels each |
| Looper | 1 | 1 block |
| Megatap Delay | -- | 1 block, 4 channels |
| Multitap Delay | 5 types | 1 block, 4 channels |
| Parametric EQ | -- | 4 blocks, 4 channels each |
| Phaser | 8 types | 2 blocks, 4 channels each |
| Pitch | 12 types | 2 blocks, 4 channels each |
| Plex Delay | 3 types | 2 blocks, 4 channels each |
| Resonator | -- | 1 block, 4 channels |
| Reverb | 44 types | 2 blocks, 4 channels each |
| Ring Modulator | -- | 1 block, 4 channels |
| Rotary | -- | 1 block, 4 channels |
| Send / Return | -- | 4 blocks |
| Synth | -- | 1 block, 4 channels |
| Ten-Tap Delay | 2 types | 1 block, 4 channels |
| Tone Match | -- | 1 block |
| Tremolo / Panner | -- | 2 blocks, 4 channels each |
| Vocoder | -- | 1 block, 4 channels |
| Volume / Pan | -- | 4 blocks |
| Wah | -- | 2 blocks, 4 channels each |
| RTA | -- | 1 block |
| Enhancer | -- | 1 block, 4 channels |
| Formant | -- | 1 block, 4 channels |
| Gate / Expander | -- | 2 blocks, 4 channels each |
| Multiplexer | -- | 2 blocks |
| Mixer | -- | -- |

### Drive Block Types (37+ models)

**Overdrive:**

| Fractal Drive Name | Based On |
|---|---|
| T808 OD | Ibanez TS808 Tube Screamer |
| T808 Mod | Ibanez TS808 (modified) |
| TS9DX | Ibanez TS9DX Turbo Tube Screamer |
| Valve Screamer VS9 | Ibanez TS9 |
| Blues OD | Boss BD-2 Blues Driver |
| Super OD | Boss SD-1 Super Overdrive |
| Full OD | Fulltone Fulldrive |
| Compulsion Distortion | Fulltone OCD (v1), MOSFET-based |
| Klone Chiron | Klon Centaur |
| Tone of Kings | Analogman King of Tone |
| Sunrise Splendor | -- |
| Shimmer Drive | -- |
| Hoodoo Drive | -- |
| Jam Ray | -- |
| Tube Drive | -- |
| Timothy | Paul Cochrane Timmy |
| Eternal Love | -- |
| 77 Custom OD | -- |
| Zen Master | Hermida Zendrive |
| Esoteric ACB | Xotic AC Booster |
| BB Pre (AT) | Xotic BB Preamp (Andy Timmons) |
| OD-One Overdrive | -- |
| Nobelium OVD-1 | Nobels ODR-1 |
| Heartpedal 11 | -- |
| Horizon Precision Drive | Horizon Devices Precision Drive |
| Guardian Photon Speed | -- |
| Gauss Drive | -- |
| Angry Chuck | -- |

**Distortion:**

| Fractal Drive Name | Based On |
|---|---|
| Rat Distortion | ProCo RAT |
| Fat Rat | ProCo RAT (fat/bass mod) |
| DS1 Distortion | Boss DS-1 |
| DS1 Distortion Mod | Boss DS-1 (modified) |
| Plus Distortion | MXR Distortion+ |
| M-Zone Distortion | Boss Metal Zone MT-2 |
| Shred Distortion | -- |
| MOSFET Distortion | -- |
| MCMLXXXI Drv | -- |
| OD 250 | DOD OD-250 |
| Paradigm Shifter | -- |
| Suhr Riot | Suhr Riot |
| SDD Preamp | Roland SDD-320 Dimension D preamp |
| Box o'Crunch | -- |

**Fuzz:**

| Fractal Drive Name | Based On |
|---|---|
| Face Fuzz | Dallas Arbiter Fuzz Face (germanium) |
| Bender Fuzz | Tone Bender |
| Master Fuzz | Maestro Fuzztone FZ-1 (the "Satisfaction" fuzz) |
| Super Fuzz | Univox Super Fuzz |
| PI Fuzz | Electro-Harmonix Big Muff Pi |
| Hard Fuzz | 60s-style hard-clipping fuzz |
| Octavia Distortion | Roger Mayer Octavia |
| Griddle Cake | -- |

**Boost:**

| Fractal Drive Name | Based On |
|---|---|
| FAS Boost | Fractal clean boost |
| FAS LED-Drive | Fractal LED clipping design |
| Sonic Drive | -- |

> **Fuzz Impedance Note:** The Auto-Z input impedance feature helps fuzz models react more authentically to guitar pickups, compensating for the buffered input inherent to digital architecture.

### Delay Block Types (18 types)

- **Digital Mono / Stereo** -- Standard clean digital delay
- **Analog Mono / Stereo** -- BBD-style analog emulation
- **Tape Mono / Stereo** -- Tape echo with wow/flutter and degradation
- **Reverse** -- Reversed delay trails
- **Dual Delay** -- Two independent delay lines (also usable as chorus)
- **Ping Pong** -- Alternating L/R delays
- **Sweep** -- Modulated delay with sweep
- **Pattern** -- Rhythmic delay patterns
- **Diffused** -- Smeared trails approaching reverb quality
- **Vintage Digital** -- Emulates early digital rack delays (SPX90, 2290, PCM780, H3000 territory)
- **Ducking** -- Volume-sensitive delay that reduces when playing
- Plus additional types per firmware

### Multitap Delay Types (5+ types)

| Type | Based On |
|---|---|
| 1210 | TC Electronic 1210 Spatial Expander/Stereo Chorus Flanger |
| A.H. Clean/Lead/Swell (Long/Short) | Allan Holdsworth's use of Yamaha UD Stomp |
| Aerosol | Lexicon MPX 1 chorus preset |
| Aurora Delay | Keeley HALO Andy Timmons delay pedal |
| Quad Chorus | Multi-voice chorus via delay |

### Plex Delay Types (3 types)

Up to 8 delay lines in a feedback arrangement for ethereal "shimmer" and ambient textures.

### Reverb Block Types (44 types)

**Categories:**
- **Room** -- Various room sizes and shapes
- **Hall** -- Concert halls and large spaces
- **Chamber** -- Studio chamber reverbs
- **Plate** -- Plate reverb emulations
- **Spring** -- Spring reverb emulations
- **Ambient** -- Atmospheric/ethereal reverbs
- **Echo** -- Reverb + delay combination (saves a block)

**Notable Named Types:**

| Type | Description/Inspiration |
|---|---|
| London Plate | Based on EMT 140 plate reverb |
| Sun Plate | Sun Studio-style plate |
| North Church / South Church | Possibly Bricasti-inspired |
| Rec Studio A / C | Abbey Road studio room reverbs |
| Tube Spring | Based on 6G15 Tube Reverb with authentic tone control |
| Studio Spring | Hypothetical spring reverb with 6 long parallel springs |
| British Spring | Traditional spring tank (all springs in parallel) |
| Nimbostratus | Ambient reverb |
| Stratocumulus | Ambient reverb |
| Cirrocumulus | Cloud-like ambient |
| Pegasus | Shimmer reverb |
| Pleiades | Space/ambient |
| Echo Plate / Echo Hall / Echo Room | Reverb + pre-delay echo combination |
| Various "Umbulus" types | Possibly Strymon BigSky-inspired |

**Spring Reverb Algorithm:** Based on a digital waveguide with scattering nodes, accurately recreating the "drip" and flutter of classic spring tanks. Tank Type parameter selects spring configuration.

### Chorus Block Types (14 types)

| Type | Description |
|---|---|
| Analog Mono | BBD algorithm, mono |
| Analog Stereo | BBD algorithm, stereo |
| Digital Mono | Clean digital chorus, mono |
| Digital Stereo | Clean digital chorus, stereo |
| Japan CE-2 | Boss CE-2 Chorus Ensemble |
| Dimension | Roland Dimension D-style |
| Dimension 2 | Roland Dimension D variant |
| Tape Chorus | Uses tape delay algorithm |
| Tape Flanger | Tape-based flanger in chorus block |
| Tri-Chorus | Three-voice chorus |
| Plus additional types | -- |

### Flanger Block Types (8 types)

- Classic flanger
- Through-zero flanger (TZF)
- BBD-based types
- Can function as chorus in some configurations

### Phaser Block Types (8 types)

- Script / Block (MXR Phase 90 variants)
- Bi-phase
- Vibe (Uni-Vibe style)
- Additional variants

### Pitch Block Types (12 types)

| Type | Description |
|---|---|
| Detune | Chorus-like detuning (up to 2 voices) |
| Fixed Harmony | Constant interval shift (2 voices) |
| Intelligent Harmony | Key/scale-aware shifting (2 voices) |
| Classic Whammy | Digitech Whammy-style pedal shifting |
| Advanced Whammy | Custom range within +/- 2 octaves |
| Octave Divider | Analog-style octave down |
| Crystals | Exotic crystal shifting with reverse option |
| Arpeggiator | 32-step sequencer for arpeggios |
| Custom Shifter | User-defined scales |
| Auto Pitch | Pitch correction (T-Pain/Cher effect) |
| Virtual Capo | Transpose entire guitar tuning |

### Wah Block Types

| Type | Based On |
|---|---|
| Cry Baby | Dunlop Cry Baby |
| Clyde McCoy | Vox Clyde McCoy |
| Colorsound | Sola Colorsound |
| Morley | Morley Wah/Volume |
| Tycobrahe | Tycobrahe Parapedal |
| Vox V845 | Vox V845 |
| Vox V846-HW | Vox V846 Handwired (SRV) |
| Shaft | "Shaft" movie wah |
| FAS | Fractal custom wah |

### Compressor Block Types (6+ types)

| Type | Based On |
|---|---|
| Dynami-Comp | MXR Dyna Comp (M-102), with OTA saturation |
| Dynami-Comp Lite | Low-CPU version of Dynami-Comp |
| JFET Pedal | JFET shunt pedal compressors |
| JFET (Studio) | Urei 1176-style rackmount |
| JFET (Studio) 2 | 1176-style with dynamic time constants (~5x faster) |
| VCA (Feedback) | SSL Bus Compressor style, extremely fast attack |
| Optical | Optical compressor |
| Tube | Altec Lansing 436C style |
| Compander | Compressor + expander with transient control |

### Tremolo / Panner Types

| Type | Based On |
|---|---|
| Optical Trem 1 | Optical pedal tremolo |
| Optical Trem 2 | More "throb" variant |
| Neon Trem | Blackface-era optical tremolo |
| Bias Trem | Bias-modulated tube tremolo |
| Auto-Pan | Stereo panning |

### Additional Effect Blocks

- **Rotary:** Leslie-style rotary speaker with separate drum/rotor speed, depth, and real-time rate control
- **Ring Modulator:** Pitch-tracking option, extremely flexible
- **Vocoder:** Digital recreation of analog vocoder with freeze function and HP mix for intelligibility
- **Synth:** 3-voice monophonic guitar synth with pitch tracking
- **Resonator:** Resonant filter/body modeling
- **Formant:** Vowel/formant filtering
- **Enhancer:** Stereo enhancement/widening
- **Gate / Expander:** Noise gate with adjustable threshold, attack, release
- **RTA (Real-Time Analyzer):** Visual spectrum analysis block
- **Filter:** 12 types ranging from subtle EQ to extreme synth-style filters
- **Graphic EQ / Parametric EQ:** Full-featured equalization blocks

---

## Signal Flow & Architecture

### Routing Grid

- **Axe-FX III:** 6 rows x 14 columns
- **FM9 / FM3:** 4 rows x 12 columns
- Signal flows left to right through the grid
- Blocks can be placed in series (single row) or parallel (multiple rows)
- Input and Output blocks can be placed anywhere on the grid
- Send/Return blocks enable signal routing from any point to any other point, including feedback loops and chain extension beyond grid size
- Mixer block controls level and balance of each row at output

### Scenes (8 per preset)

- Each preset has **8 scenes**
- Scenes store the **bypass state** and **channel selection** for each block
- The routing (grid layout) is the same across all scenes
- Scene switching is **instant and gapless** -- no audio dropout
- Enables using a single preset for an entire song, set, or show
- Preset switching requires buffer clearing and brief mute; scene switching does not

### Channels (4 per block)

- Most effect blocks have **4 channels (A/B/C/D)**
- Each channel is a complete independent set of parameter values (a "mini-preset")
- Switching between channels is **instantaneous and seamless**
- Example: Amp block Channel A = Deluxe Verb, Channel B = Plexi, Channel C = Recto, Channel D = FAS Modern
- Channel selection is stored per scene
- CPU usage may change when switching channels (depends on parameter values)

### Global Blocks

- Reuse effect blocks with preferred settings across multiple presets
- When a Global Block is updated, all presets using it reflect the change
- Not supported on all blocks (Output and Mixer blocks excluded)
- Useful for maintaining consistent settings across your preset library

### CPU Allocation

- CPU usage depends on: number of blocks, effect settings, controller usage, global settings
- **Bypassing a block does NOT reduce CPU usage** -- the block must be removed entirely
- Changing channels may affect CPU usage
- Tips to reduce CPU: minimize shunt blocks, merge parallel paths when possible, disable Global EQs, disable gapless switching
- Audio is the highest-priority thread in the real-time operating system
- Displayed CPU percentage represents audio thread usage only

### Presets

- **Axe-FX III / FM9:** 512 preset slots
- **FM3:** 512 preset slots
- Presets contain the entire grid layout, block settings, scene configurations, and controller assignments

---

## Advanced Features

### Amp Matching (Live)

- Captures the tonal characteristics of a real physical amplifier
- Feed the same signal into the Axe-FX and the real amp simultaneously
- The Tone Match block analyzes differences and creates an EQ curve
- Uses an existing modeled amp with similar topology as starting point
- Result can be saved as an UltraRes Tone Match
- Matches the **linear response** (EQ characteristics), not the nonlinear behavior (distortion character)

### Tone Matching (Offline)

- Match the tone of a recording (CD, MP3, YouTube, etc.)
- Analyze a reference signal against your local preset
- Creates an EQ correction curve in UltraRes
- Useful for recreating recorded tones from albums

### Speaker Impedance Modeling

- Speaker Page parameters shape the virtual speaker impedance curve
- Determines resonance behavior in the virtual power amp
- Amp/speaker interaction causes frequency-dependent power amp response changes
- Negative Feedback parameter flattens the impedance curve effect
- Loadbox impedance curves (LB-2, Oxbow, Double Notes) available for accurate comparison with real amps through load boxes
- Cliff Chase: "The biggest source of inaccuracy in our modeling is the fact that the speaker impedance is unknown"
- Speaker Drive algorithm models frequency-dependent distortion of guitar loudspeakers
- Speaker Thump models dynamic, nonlinear speaker behavior

### Virtual Capo / Pitch Shifting

- Full pitch shifting suite in the Pitch block
- Virtual Capo for whole-guitar transposition
- Whammy-style pitch bend (Classic and Advanced modes)
- Intelligent harmony with key/scale awareness
- Crystals effect for ambient/ethereal textures
- Octave divider for analog-style octave-down
- Improved pitch detection for better tracking fidelity

### Looper

- **Stereo** recording at full resolution
- **5+ minutes** of recording time (Axe-FX III)
- **2 minutes** on FM9
- Overdub and undo capabilities
- Useful as a practice tool and for auditioning amp/cab combinations

### Modifiers & Controllers

- Extensive modifier system connects expression pedals, switches, LFOs, envelope followers, sequencers, and other sources to virtually any parameter
- Real-time control of amp gain, effect mix, wah position, volume, and hundreds of other parameters
- Auto-engage features for wah and other expression-controlled effects

---

## Connectivity & Ecosystem

### I/O Options (Axe-FX III)

**Analog:**
- 1x Instrument Input (front panel, with Auto-Z impedance)
- 3x Stereo Line Inputs (rear)
- 4x Stereo Outputs (rear, with Humbuster technology)
- XLR and 1/4" output options

**Digital:**
- S/PDIF In/Out
- AES/EBU In/Out

**Control:**
- MIDI In / Out / Thru
- 2x Expression pedal inputs (on unit itself)
- FASLINK II port for FC controllers

### USB Audio Interface

- **8x8 USB audio** (8 in, 8 out) at up to 48kHz
- Dedicated 16-core 500MHz microcontroller handles USB traffic
- Audiophile-grade signal path and converters
- Record multiple tracks simultaneously: processed audio, DI signal, wet/dry
- Monitor backing tracks and audition reamps in real-time
- USB audio source can be placed on the grid as a dedicated block
- **Mac:** Class-compliant, no driver required (macOS 10.7.4+)
- **Windows:** Requires Fractal Audio USB driver (v6.14 as of March 2026)

### FM9 I/O

- Instrument In
- 2x Stereo Inputs
- 3x Stereo Outputs (with Humbuster)
- S/PDIF Digital I/O
- MIDI In/Out
- 3x Expression pedal inputs
- 8x8 USB audio
- 9 onboard footswitches with mini-displays

### FM3 I/O

- Instrument In
- Stereo Input
- 2x Stereo Outputs (with Humbuster)
- USB audio
- MIDI
- Expression pedal input
- 3 onboard footswitches

### Fractal-Bot (Firmware Updater)

- Dedicated utility for firmware installation and backup/restore
- Also integrated into Axe-Edit / FM9-Edit / FM3-Edit (Tools menu)
- Built-in backup firmware allows recovery from failed updates
- Notifies when new firmware is available
- Windows requires Fractal USB driver; Mac is plug-and-play

### Axe-Change (Preset Sharing)

- Official cloud-based preset and cab sharing platform
- Upload and download presets from the community
- Browse by amp model, genre, artist, or effect type
- Free to use
- URL: axechange.fractalaudio.com

### Humbuster Technology

- Fractal's proprietary output technology
- Eliminates ground loop hum without a DI box or ground lift
- Uses TRS cables with a patented summing technique
- Available on all current Fractal Audio outputs

### Community & Forum

- **Fractal Audio Forum** (forum.fractalaudio.com): Active community with direct participation from Cliff Chase
- Cliff regularly posts Tech Notes explaining modeling decisions and technical details
- **Fractal Audio Wiki** (wiki.fractalaudio.com): Community-maintained documentation covering every feature, model, and parameter
- Third-party preset creators (Fremen, Worship Tutorials, Leon Todd, etc.)
- Active YouTube community with tone demos and tutorials

---

## Quick Reference: Product Comparison

| Feature | Axe-FX III Mk II Turbo | FM9 Mk II Turbo | FM3 Mk II Turbo |
|---|---|---|---|
| **Price** | $2,499 | $1,799.99 | $1,099.99 |
| **Form Factor** | 3U Rack | Floor (9 switches) | Compact Floor (3 switches) |
| **DSP** | 2x SHARC+ (TI), +25% Turbo | 4x AD cores, +10% Turbo | 3-core Griffin, +10% Turbo |
| **Grid** | 6x14 | 4x12 | 4x12 |
| **Presets** | 512 | 512 | 512 |
| **Scenes** | 8 | 8 | 8 |
| **Channels/Block** | 4 | 4 | 4 |
| **Amp Models** | 280+ | 280+ | 280+ |
| **Factory IRs** | 2,237+ | 2,237+ | 2,237+ |
| **USB Audio** | 8x8 | 8x8 | -- |
| **Stereo Outputs** | 4 | 3 | 2 |
| **Stereo Inputs** | 3 | 2 | 1 |
| **FC Support** | Up to 4 | Up to 2 | Up to 2 |
| **Gapless Switching** | Yes | Yes | Yes |
| **Sound Quality** | Identical | Identical | Identical |

---

*Last updated: March 2026. Firmware and model counts change with updates. Consult the [Fractal Audio Wiki](https://wiki.fractalaudio.com) and [Fractal Audio Forum](https://forum.fractalaudio.com) for the latest information.*
