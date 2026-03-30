# Neural DSP Quad Cortex - Complete Technical Reference

## Product Overview

### Hardware Specifications

| Spec | Detail |
|------|--------|
| **Processor** | Dual Analog Devices ADSP-SC589 (Quad SHARC+ DSP cores + 2 ARM Cortex-A5 MCUs) |
| **DSP Performance** | 2 GHz of programmable DSP |
| **Display** | 7-inch multi-touch full-color capacitive touchscreen, chemically strengthened glass |
| **Footswitches** | 11 rotary footswitches (twist to adjust parameters, stomp to engage) |
| **Enclosure** | Anodized aluminum unibody, laser-engraved graphics |
| **Dimensions** | 11.4 x 7 x 2 in / 29 x 19 x 4.9 cm |
| **Weight** | 4.2 lbs / 1.9 kg |
| **Audio Converters** | Cirrus Logic codecs |
| **Sample Rate** | 48 kHz fixed, 24-bit |
| **Price (US, 2026)** | $1,799 MAP (raised from $1,699 due to tariff adjustments) |

### I/O

| Connection | Details |
|-----------|---------|
| **Inputs 1-2** | Combo XLR/TRS/TS with variable impedance, mic preamps, +48V phantom power |
| **Outputs 1-2** | Balanced XLR |
| **Outputs 3-4** | TRS (secondary outputs) |
| **Headphone** | 1/4" stereo headphone output |
| **FX Loop 1** | Send/Return TRS (can double as additional I/O) |
| **FX Loop 2** | Send/Return TRS (can double as additional I/O) |
| **Expression** | Dual expression pedal inputs (TRS) |
| **MIDI** | MIDI In, MIDI Out/Thru (5-pin DIN) |
| **USB** | USB Type-B 2.0 (audio interface, firmware updates, MIDI, Cortex Control) |
| **Wi-Fi** | Built-in for Cortex Cloud and mobile app connectivity |

### USB Audio Interface Mode

- 24-bit / 48 kHz fixed sample rate
- 16 USB audio channels (8 in / 8 out)
- 4 hardware inputs, 6 hardware outputs, plus 8 digital I/O via USB
- Ultra-low latency monitoring (sub-3ms internal processing; ~11.7ms USB round-trip)
- macOS: class-compliant (no driver needed)
- Windows: requires Neural DSP ASIO driver
- Record dry and processed signals simultaneously
- Compatible with all major DAWs

### Quad Cortex Mini (Announced January 2026)

- Same dual ADSP-SC589 processing architecture as the full-size QC
- Same audio quality and Neural Capture technology
- Dimensions: 22.8 x 11.8 x 6.5 cm
- Weight: 1.5 kg
- Runs the same CorOS firmware as the Quad Cortex
- Price: $1,399

---

## Firmware History (CorOS)

### Current Version: CorOS 4.0.0 (January 21, 2026)

Major additions in 4.0.0:
- Full support for Quad Cortex mini
- CorOS and Cortex Control now share unified version numbers
- Three new reverbs: Nordic Concert Hall, Studio Plate 70, Blossom
- Phase Doctor phase alignment utility
- Hold Timing Menu (500ms to 1s footswitch hold threshold)
- Gig View accessible via footswitches
- Boot-up tooltips

### Timeline of Major Firmware Releases

| Version | Date | Key Additions |
|---------|------|---------------|
| **1.0.x** | Early 2021 | Launch firmware: 50+ amp models, 70+ effects, 1,000+ IRs, Neural Capture |
| **1.1.0** | July 2021 | Digital Flanger, Shimmer reverb, expression pedal auto-engage, 25% faster boot, reverb/delay CPU optimization |
| **1.2.x** | Late 2021 | Hybrid Mode (separate mode per footswitch row), Bundles (captures bundled with presets) |
| **1.3.x** | 2022 | Vox AC15 models (UK C15), additional amp models, USB audio improvements |
| **1.4.x** | 2022 | Continued model additions, Gig View refinements |
| **2.0.0** | 2023 | Device Versioning system, major UI improvements, updated amp/effect algorithms |
| **2.1.0** | 2023 | Cabsim in Capture creation screen, stereo cab models, IR Loader Lite (reduced CPU), redesigned Cabsim block, Gig View scene copy/swap/color |
| **2.2.0** | 2023 | Looper X with quantize, additional effects |
| **2.3.0** | Late 2023 | Cortex Control desktop editor support |
| **3.0.0** | July 31, 2024 | Plugin Compatibility (PCOM) - Archetype X plugins run on QC, launch with Archetype: Plini X and Archetype: Gojira X |
| **3.1.x** | Mid-2025 | ESS Codec support for new units, Live Tuner in Gig View, expanded LED brightness, Scene Editor navigation |
| **3.2.0** | 2025 | Archetype: Cory Wong X, Parallax X, Archetype: Nolly X ported to QC, Metronome with Scene/Looper integration |
| **3.3.0** | Nov 26, 2025 | Neural Capture V2 (cloud-processed, higher resolution), 669 new captures, 29 new virtual devices (inc. Dumbbell ODS), Mono Synth, real-time CPU usage display |
| **3.3.1** | Dec 2025 | Bug fixes, Neural Capture V2 refinements |
| **4.0.0** | Jan 21, 2026 | QC Mini support, 3 new reverbs, Phase Doctor utility, unified CorOS/Cortex Control versioning |

### Cortex Control Desktop App

- **Launched**: January 3, 2024 (open beta October 2023)
- **Platforms**: macOS and Windows (free)
- **Connection**: USB to Quad Cortex
- **Requires**: CorOS 2.3 or higher

Key features:
- Full preset/grid editing with mouse and keyboard shortcuts
- Instant sync with Quad Cortex state
- Bulk actions on presets, captures, and IRs
- Local backup creation and management
- Drag-and-drop IR management
- Neural Capture creation workflow
- Live Tuner (CMD/CTRL + click)
- CPU Monitor showing per-block usage
- Gig View editor for footswitch assignment visualization
- Device auditioning (preview blocks before committing)
- Plugin preset import via drag-and-drop
- MIDI program change display

---

## Amp Models

Neural DSP uses a naming convention with prefixes indicating the original manufacturer:
- **"Brit"** = Marshall
- **"CA"** = Mesa/Boogie (California)
- **"US"** = Fender (American)
- **"UK"** = Vox (British)
- **"Solo"** = Soldano

> **Models vs. Captures**: Models are algorithmic recreations of amplifier circuits built by Neural DSP's engineering team. They include interactive controls (gain, EQ, etc.) that behave like the real amp's knobs. Captures are machine-learning snapshots of a specific amp at specific settings -- they are static representations with limited tonal adjustment (gain, level, EQ overlay).

### Fender ("US")

| QC Model Name | Based On |
|--------------|----------|
| US DLX 64 Vintage | Fender Deluxe Reverb 1964 (Vintage channel) |
| US DLX 64 Vibrato | Fender Deluxe Reverb 1964 (Vibrato channel) |
| US DLX 58 | Fender Deluxe 5E2 (1958) |
| US PRN 65 | Fender Princeton 1965 |
| US HP Tweed TWN | Fender High-Power Tweed Twin |
| US BF Super RVB Normal | Fender Blackface Super Reverb (Normal channel) |
| US BF Super RVB Vibrato | Fender Blackface Super Reverb (Vibrato channel) |
| US Bassman | Fender Bassman |

### Marshall ("Brit")

| QC Model Name | Based On |
|--------------|----------|
| Brit TM45 Bright / Normal / Patch | Marshall JTM 45 |
| Brit Plexi 50 Bright / Normal / Patch | Marshall Lead 50 |
| Brit Plexi 100 Bright / Normal / Patch | Marshall Super Lead 100 (1959) |
| Brit Bass 50 Bright / Normal / Patch | Marshall Super Bass 50 |
| Brit Bass 100 Bright / Normal / Patch | Marshall Super Bass 100 |
| Brit 2203 | Marshall JCM800 2203 |
| Brit 2203 87 | Marshall JCM800 1987 variant |
| Brit 2204 | Marshall JCM800 2204 (50W) |
| Brit 900 Clean / Lead | Marshall JCM900 4100 |
| Brit UBL Lead / Rhythm | Marshall Silver Jubilee (JCM25/50) |
| Brit 800 PWR | Marshall power amp section |

### Mesa/Boogie ("CA")

| QC Model Name | Based On |
|--------------|----------|
| CA 1Star Clean 50W / 100W | Mesa Boogie Lone Star (Clean) |
| CA 1Star Drive 50W / 100W | Mesa Boogie Lone Star (Drive) |
| CA 1Star Clean Tweed 50W / 100W | Mesa Boogie Lone Star (Clean, Tweed voicing) |
| CA 1Star Drive Tweed 50W / 100W | Mesa Boogie Lone Star (Drive, Tweed voicing) |
| CA MkCC+ | Mesa Boogie Mark IIC+ |
| CA MkIIIRed | Mesa Boogie Mark III (Red Stripe) |
| CA Duo Ch3 Modern / Raw | Mesa Boogie Dual Rectifier (Ch3) |
| CA Tremo Blues / Clean | Mesa Boogie Tremoverb |
| CA John's Ch1 / Ch2 / Ch3 | Mesa Boogie JP-2C (John Petrucci) |
| CA 3Axe | Mesa Boogie Triaxis |
| CA M6Rifle | Mesa Boogie M6 Carbine (Bass) |
| CA 400+ Ch1 / Ch2 | Mesa Boogie Bass 400+ |
| CA PA-Sim290 | Mesa Boogie Stereo Simul-Class 2:Ninety (Power Amp) |
| CA Quad+290 | Mesa Boogie Quad Preamp + 2:Ninety |
| CA Studio+290 | Mesa Boogie Studio Preamp + 2:Ninety |

### Vox ("UK")

| QC Model Name | Based On |
|--------------|----------|
| UK C15 Normal / TopBoost / Boost | Vox AC15 |
| UK C30 Normal / TopBoost | Vox AC30 |

### Soldano ("Solo")

| QC Model Name | Based On |
|--------------|----------|
| Solo 100 Crunch Bright | Soldano SLO-100 (Crunch, Bright) |
| Solo 100 Crunch Normal | Soldano SLO-100 (Crunch, Normal) |
| Solo 100 Lead | Soldano SLO-100 (Lead) |

### Friedman ("Freeman")

| QC Model Name | Based On |
|--------------|----------|
| Freeman 100 Clean | Friedman HBE100 (Clean) |
| Freeman 100 Rhythm | Friedman HBE100 (Rhythm) |
| Freeman 100 Lead | Friedman HBE100 (Lead) |

### Bogner ("Bogna")

| QC Model Name | Based On |
|--------------|----------|
| Bogna Uber | Bogner Uberschall |
| Bogna Uber Clean | Bogner Uberschall Rev. Blue (Clean) |
| Bogna Uber Lead | Bogner Uberschall Rev. Blue (Lead) |
| XTC Blue | Bogner Ecstasy (Blue channel) |

### EVH ("EV")

| QC Model Name | Based On |
|--------------|----------|
| EV III Green | EVH 5150 III (Green channel) |
| EV101IIIS Blue 6L6 | EVH 5150 III S (Blue, 6L6) |
| EV101IIIS Red 6L6 | EVH 5150 III S (Red, 6L6) |
| EV101IIIS EL34 | EVH 5150 III S (EL34) |

### Peavey ("PV")

| QC Model Name | Based On |
|--------------|----------|
| PV-505 Lead | Peavey 6505 / 5150 (Lead) |
| PV-505 Rhythm | Peavey 6505 / 5150 (Rhythm) |

### Diezel ("D-Cell")

| QC Model Name | Based On |
|--------------|----------|
| D-Cell H4 Ch1 | Diezel VH4 (Channel 1) |
| D-Cell H4 Ch2 | Diezel VH4 (Channel 2) |
| D-Cell Herb | Diezel Herbert |

### ENGL ("NGL" / "ENG")

| QC Model Name | Based On |
|--------------|----------|
| NGL 530 Pre | ENGL 530 Preamp |
| NGL Energy | ENGL Powerball Mark I |
| NGL Rainbow | ENGL Ritchie Blackmore Signature 100 |
| ENG Feral 120 | ENGL Savage 120 |

### Orange ("OG")

| QC Model Name | Based On |
|--------------|----------|
| OG Crusherverb | Orange Rockerverb 100 |

### Dumble ("Dumbbell")

| QC Model Name | Based On |
|--------------|----------|
| Dumbbell ODS | Dumble Overdrive Special |

### Sunn ("Sonn")

| QC Model Name | Based On |
|--------------|----------|
| Sonn Mod T CH1 | Sunn Model T (Channel 1) |
| Sonn Mod T CH2 | Sunn Model T (Channel 2) |

### Morgan ("Captain")

| QC Model Name | Based On |
|--------------|----------|
| Captain 50 | Morgan SW50 |

### Matchless ("Matchmore")

| QC Model Name | Based On |
|--------------|----------|
| Matchmore D30 Ch1 / Ch2 | Matchless DC30 |
| Matchmore Jefe | Matchless Chieftain |

### Roland ("Rols")

| QC Model Name | Based On |
|--------------|----------|
| Rols Jazz CH120 | Roland Jazz Chorus JC-120 |

### Other Guitar Amps

| QC Model Name | Based On |
|--------------|----------|
| Corn Vixen | Cornford Hellcat |
| Cravin X100 | Carvin X100B Series IV |
| DC Heavy Crusader | Dean Costello Audio Heavy Metal Warfare |
| Dovre 50 | Dover Amplification DA-50 |
| Drywood Purple Horror | Driftwood Amplifiers Purple Nightmare |
| Fryed Pit Bull 50 | Fryette Pittbull Fifty/CL |
| Nailer Battle 38 | Naylor Duel 38 |
| RV Amp G120 | Revv Generator 120 MK3 |

### Bass Amps

| QC Model Name | Based On |
|--------------|----------|
| CA 400+ Ch1 / Ch2 | Mesa Boogie Bass 400+ |
| CA M6Rifle | Mesa Boogie M6 Carbine |
| Amped VT | Ampeg SVT |
| Darkglass 900 | Darkglass Microtubes 900 |

### Power Amp Models

| QC Model Name | Based On |
|--------------|----------|
| 6L6 PWR | Generic 6L6 power amp |
| CA PA-Sim290 | Mesa 2:Ninety |
| Brit 800 PWR | Marshall-style power amp |

> **Note**: The full list exceeds 90 amp models as of CorOS 4.0. Neural DSP continues adding models with each firmware update. For the definitive current list, see the official device list at neuraldsp.com/device-list.

---

## Neural Captures

### How Neural Capture Technology Works

Neural Capture uses machine learning (neural network) to analyze and replicate the sonic behavior of physical gear. Neural DSP describes it as "biomimetic AI" that perceives sound similarly to human perception.

**The Capture Process:**

1. **Physical Setup**: Connect the Quad Cortex's dedicated Capture Output to the input of the target device (amp, pedal, etc.). If capturing with a cabinet, mic up the cab and connect the mic to one of the QC's inputs.

2. **Signal Analysis**: The QC sends a series of calibrated test tones through the target device and records the output. This takes approximately 1-2 minutes.

3. **Training**: The neural network algorithm analyzes the input/output relationship and builds a digital model. Training takes approximately 5-10 minutes on-device (V1) or is processed via Cortex Cloud (V2).

4. **Verification**: A/B comparison allows instant switching between the live reference signal and the captured model for accuracy checking.

5. **Metadata**: Gain level is automatically calculated (1-10 scale, clean to saturated). Users tag capture type and preferred instrument.

### Neural Capture V1 vs V2

| Feature | V1 (On-Device) | V2 (Cloud-Processed) |
|---------|----------------|---------------------|
| Processing | Runs locally on QC/Nano Cortex | Processed via Cortex Cloud servers |
| Speed | ~5-10 min training | Requires upload; cloud processing time |
| Offline Use | Yes, fully offline | No, requires internet |
| Resolution | Standard | Higher resolution algorithm |
| Dynamic Accuracy | Good for most amps, cabs, ODs | Superior for touch-sensitive gear (fuzz, compressor, dynamic tube amps) |
| Captures Subtle Behaviors | Basic dynamics | Volume-knob cleanup, amp sag/bloom, fast transients, blend controls |
| Daily Limit | Unlimited | Up to 40 V2 captures per day |
| Introduced | CorOS 1.0 (2021) | CorOS 3.3.0 (November 2025) |

### Capture Types

| Type | What It Captures | Use Case |
|------|-----------------|----------|
| **Amp Only (DI)** | Amplifier without speaker/mic | Pair with cab sims or IRs on the grid |
| **Amp + Cab** | Full amp with cabinet and microphone | Plug-and-play, no additional cab block needed |
| **Stomp / Pedal** | Individual pedal at specific settings | Capture your favorite OD/fuzz/comp settings |
| **Full Rig** | Entire signal chain (pedals + amp + cab + mic) | Complete tone snapshot |

### Capture Controls

Once placed on the grid, a capture block provides:
- Gain
- Bass / Mid / Treble (overlay EQ)
- Level / Volume
- Bypass toggle

These are overlay controls, not the same as turning knobs on the original amp -- the capture itself is a fixed snapshot of the amp at its captured settings.

### Cortex Cloud Sharing

- Upload captures to Cortex Cloud for the community
- Browse and download thousands of user-created captures
- Captures include metadata: type, gain rating, instrument, tags
- Accessible from the QC touchscreen (via Wi-Fi), Cortex Control, or mobile app

---

## Effects (Built-In)

### Overdrive / Distortion / Fuzz / Boost

| QC Effect Name | Based On |
|---------------|----------|
| Green 808 | Ibanez TS808 Tube Screamer |
| Myth Drive | Klon Centaur |
| Obsessive Drive | Fulltone OCD |
| Chief OD1 | Boss OD-1 / SD-1 |
| Chief DS1 | Boss DS-1 |
| Chief BD2 | Boss BD-2 Blues Driver |
| Chief MT | Boss MT-2 Metal Zone |
| Rodent Drive | ProCo Rat |
| Brit Blues | Marshall BluesBreaker |
| Brit Governor | Marshall Guv'nor |
| Freeman BOD | Friedman BE-OD |
| Exotic | Xotic BB Preamp |
| Exotic Z Boost | Xotic RC Booster |
| Facial Fuzz | Dunlop Fuzz Face |
| Fuzz Pi | Electro-Harmonix Big Muff Pi |
| Soviet Fuzz | EHX Russian Big Muff |
| MK3 Silicon Fuzz | JHS Bender 1973 |
| OD250 | DOD Overdrive Preamp 250 |
| Rage Booster | Dallas Rangemaster Treble Booster |
| Red Drive | Keeley Red Dirt |
| No-Bell OD1 | Nobels ODR-1 |
| Vemural Ray | Vemuram Jan Ray |
| Thunderpaw | Mr. Black Thunderclaw |

#### Bass Overdrive

| QC Effect Name | Based On |
|---------------|----------|
| BDDI | Tech 21 SansAmp Bass Driver DI |
| Exotic Bass Z Boost | Xotic RC Bass Booster |
| Microtubes B3K | Darkglass Microtubes B3K |
| Microtubes VMT | Darkglass Vintage Microtubes |

### Delay

| QC Effect Name | Description / Based On |
|---------------|----------------------|
| Analog Delay | Analog-voiced delay (BBD style) |
| Digital Delay | Clean digital delay |
| Tape Delay | Tape echo emulation |
| Simple Delay | Basic clean delay |
| Slapback Delay | Short slapback echo |
| Dual Delay | Two independent delay lines |
| Dual Reverse Delay | Two reverse delay lines |
| Reverse Delay | Reversed playback delay |
| Sample Ping Pong Delay | Stereo ping-pong delay |
| Multi Tap Delay | Multi-tap rhythmic delay |

### Reverb

| QC Effect Name | Description / Based On |
|---------------|----------------------|
| Plate | Classic plate reverb |
| Plate Lush | Lush/thick plate reverb |
| Plate Tight | Tight/short plate reverb |
| Studio Plate 70 | Vintage 1970s studio plate (added CorOS 4.0) |
| Room | Room ambience reverb |
| Ambience | Short ambient reverb |
| Hall | Concert hall reverb |
| Nordic Concert Hall | Large open hall reverb (added CorOS 4.0) |
| Cave | Deep cavernous reverb |
| Mind Hall | Ethereal/experimental hall |
| Modulated | Modulated reverb |
| Shimmer | Pitch-shifted reverb |
| Blossom | Swelling bloom reverb (added CorOS 4.0) |
| Spring (M) | Mono spring reverb |
| Spring (ST) | Stereo spring reverb |

### Modulation

| QC Effect Name | Based On |
|---------------|----------|
| Vintage Chorus | Boss CE-1 / CE-2 style |
| Dual Chorus | Stereo dual-voice chorus |
| Chief DC2W (M/ST) | Boss DC-2W Dimension C |
| Digital Flanger | Digital flanger |
| Flangerish | Analog-voiced flanger |
| Phaser | Phase shifter |
| MX Phase 95 | MXR Phase 95 |
| NuVibes | Uni-Vibe style |
| Rotary | Leslie rotary speaker |
| Tremolo | Amplitude tremolo |
| Vibrato | Pitch vibrato |

### Compressor / Dynamics

| QC Effect Name | Based On |
|---------------|----------|
| Chief CS3 | Boss CS-3 Compression Sustainer |
| Jewel | Diamond Compressor |
| Legendary 87 (M/ST) | Universal Audio 1176 |
| Solid State Comp (M/ST) | FET-style compressor |
| Opto Comp (M/ST) | Optical compressor (LA-2A style) |
| VCA Comp (M/ST) | VCA-style compressor |
| Noise Gate | Input noise gate |

### Pitch

| QC Effect Name | Description |
|---------------|-------------|
| Poly Octavor | Polyphonic octave generator |
| Wham | Whammy-style pitch shift |
| Minivoicer | Intelligent harmonizer / pitch shifter |
| Mono Synth | Guitar-to-synth (from Archetype: Rabea X, free, added CorOS 3.3) |

### EQ

| QC Effect Name | Description |
|---------------|-------------|
| Graphic-9 | 9-band graphic EQ |
| Parametric-3 | 3-band parametric EQ |
| Parametric-8 | 8-band parametric EQ |
| Global EQ | System-wide EQ (not a grid block) |

### Filter / Wah

| QC Effect Name | Based On |
|---------------|----------|
| Crying Wah | Dunlop Cry Baby GCB-95 |
| Auto Wah | Envelope-controlled wah |
| Talk Box | Talk box emulation |

### Utility

| QC Effect Name | Description |
|---------------|-------------|
| FX Loop (Mono/Stereo) | External effects loop send/return |
| IR Loader (Mono/Stereo/Lite) | Load third-party impulse responses |
| Looper X | Performance looper (up to 4:44 record time, quantize, anywhere on grid) |
| Metronome | Built-in metronome with Scene/Looper sync (added CorOS 3.2) |
| Phase Doctor | Phase alignment for multi-amp/stereo rigs (added CorOS 4.0) |
| Splitter | Signal splitter for parallel routing |
| Mixer | Path mixer with volume/pan per lane |
| Volume Pedal | Expression-assignable volume |
| Freeze | Audio freeze / sustain effect |

> **Note**: The effects library exceeds 100 effects as of CorOS 4.0 and continues growing. For the definitive list, see neuraldsp.com/device-list.

---

## Cab / IR Section

### Stock Cabinet Models

The QC ships with 35+ stock cabinet simulations. Each cab model includes selectable microphone type, mic position, and mic distance. Examples include:

#### Guitar Cabinets

| QC Cab Name | Based On |
|------------|----------|
| 412 Brit 35A GB55Hz 75 | Marshall 1935A w/ Celestion G12M25 Greenback |
| 412 Brit 60A GB75Hz 89 | Marshall 1960A w/ Celestion G12M25 |
| 412 Brit 60B V30 95 | Marshall 1960B w/ Celestion Vintage 30 |
| 412 Brit TV GB75Hz 69 | Marshall 1960TV w/ Celestion G12M25 |
| 412 CA Stand OS A V30 01 | Mesa Standard Oversized Angled w/ Celestion V30 |
| 412 CA Trad A V30 92 | Mesa Traditional Angled w/ Celestion V30 |
| 412 CA Trad S H30 15 | Mesa Traditional Straight w/ Celestion G12H30 |
| 212 CA Recto V30 98 | Mesa Rectifier 2x12 w/ Celestion V30 |
| 412 Range PPC V30 02 | Orange PPC412 w/ Celestion V30 |
| 412 NGL Pro V30 | ENGL Pro w/ Celestion V30 |
| 412 D-Cell FL V30 | Diezel Front-Loaded w/ Celestion V30 |
| 212 Rols Jazz 87 | Roland JC-120 speakers |
| 212 Zilla FB V30 | Zilla Fatboy 2x12 w/ V30 |
| 212 Zilla Open Aln | Zilla Open 2x12 w/ Celestion Alnico Gold |

#### Bass Cabinets

| QC Cab Name | Based On |
|------------|----------|
| 810 Amped VT Aln 70s | Ampeg SVT 810 w/ custom Eminence drivers |
| 410 Darkglass | Darkglass D410C w/ custom Eminence drivers |

### Virtual Microphone Models

Each cab sim allows selection of up to 2 microphones with adjustable position and distance:

| QC Mic Name | Based On |
|------------|----------|
| Dynamic 57 | Shure SM57 |
| Dynamic 421 | Sennheiser MD421 |
| Ribbon 160 | Beyerdynamic M160 |
| Ribbon 10 | Royer R-10 |
| Condensor 414 | AKG C414 |
| Condensor 184 | Neumann KM184 |

Mic controls per cab:
- **Position**: Drag-to-position on virtual speaker cone (center to edge)
- **Distance**: Near to far mic placement
- **Blend**: Mix between Mic 1 and Mic 2
- **LPF / HPF**: Per-cab high and low pass filters

### IR Loading

- **IR Loader Block**: Available in Mono, Stereo, and Lite (reduced CPU) variants
- **Dual IR Loader**: Load and blend two IRs simultaneously with independent pan
- **Format**: WAV files, automatically resized to 1024 samples (~21ms) upon upload
- **Upload Methods**: Via Cortex Control drag-and-drop, Cortex Cloud, or USB
- **Capacity**: 1,024+ IR slots (stock IRs included, user IRs addable)
- **Stock IRs**: 1,000+ factory impulse responses

---

## Signal Flow & Routing

### The Grid

The Grid is the central workspace for building presets:

- **4 rows** x **8 columns** = **32 block slots per preset**
- Each row represents a potential signal path
- Blocks are placed by dragging from the device browser onto the grid
- Signal flows left to right
- CPU usage displayed in real-time per block (CorOS 3.3+)

### Parallel Signal Paths

- Rows 1-2 can form a parallel pair; Rows 3-4 can form another parallel pair
- Dragging a block vertically between paired rows automatically creates a Splitter/Mixer
- **Splitter types**: Y-split (identical signal), A/B split, crossover
- **Mixer block**: Auto-inserted where parallel paths reconverge, with volume and pan per path
- Supports up to 4 independent signal paths simultaneously
- Paths can have completely independent chains (different amps, effects, etc.)
- Useful for: dual amp rigs, wet/dry/wet, parallel effects, bass bi-amping

### Routing Configurations

Common configurations supported:
- **Basic**: Guitar in, processed stereo or mono out
- **FRFR/Direct**: Direct to powered speakers or PA
- **FRFR + FOH**: Monitor out + front-of-house feed (separate outputs)
- **4-Cable Method (4CM)**: Use QC with a real amp's preamp and power amp sections via FX loops
- **Power Amp + Cab**: QC as preamp into a real power amp and speaker cab
- **Dual Instrument**: Two guitars or guitar + bass on separate paths using both inputs
- **Re-amping**: Record DI via USB, re-amp through QC processing

### Input/Output Flexibility

- Any input can be routed to any row
- FX Loop Send/Return can serve as additional I/O (up to 4 instruments in, multiple outs)
- Output routing is per-row configurable (e.g., Row 1-2 to XLR out, Row 3-4 to headphones)

### Presets, Scenes & Setlists

| Feature | Specification |
|---------|--------------|
| **Presets per setlist** | 256 (32 banks x 8 presets) |
| **User setlists** | 12 + 1 factory setlist |
| **Total user preset slots** | 3,072 |
| **Scenes per preset** | 8 (A through H) |
| **MIDI messages per preset** | Up to 12 on preset load |

**Scenes**: Change parameter values and bypass states of any block within a preset without audio dropout. Each scene stores a complete snapshot of all block states/settings. Scene changes are gapless (no audio interruption), unlike preset changes which may have a brief gap.

**Setlists**: Organize presets by band, project, gig, genre, etc.

### Performance Modes

| Mode | Function |
|------|----------|
| **Preset Mode** | Footswitches recall different presets |
| **Scene Mode** | Footswitches recall scenes A-H within current preset |
| **Stomp Mode** | Footswitches toggle individual blocks on/off |
| **Hybrid Mode** | Top row of footswitches uses one mode, bottom row uses another |

### Expression Pedal Routing

- 2 expression pedal inputs (EXP 1 and EXP 2)
- Assignable to any adjustable parameter on any block
- One expression pedal can control multiple parameters simultaneously
- Auto-engage: expression pedal bypasses assigned effect until moved
- Calibration stored globally (persists across presets and power cycles)
- Common assignments: wah, volume, pitch shift amount, delay mix, reverb level

---

## Ecosystem

### Cortex Cloud

- **Platform**: Web (cloud.neuraldsp.com), QC touchscreen (via Wi-Fi), Cortex Control, mobile app
- **Content**: User-shared presets, Neural Captures, and IRs
- **Features**: Browse, search, download, upload, rate, favorite
- **Neural Capture V2**: Cloud-processed captures uploaded/downloaded via Cortex Cloud
- **Backup**: Cloud backup of device settings
- **Account**: Free Neural DSP account required

### Plugin Compatibility (PCOM)

Starting with CorOS 3.0, Neural DSP's desktop plugins (Archetype X series) can run directly on the Quad Cortex. This is not a simple preset import -- the actual plugin DSP algorithms run on the QC hardware.

**Currently Compatible Plugins:**
- Archetype: Plini X
- Archetype: Gojira X
- Archetype: Cory Wong X
- Archetype: Nolly X
- Parallax X (bass)
- Fortin Nameless Suite X

**Coming in Future CorOS Updates:**
- Archetype: Tim Henson X
- Archetype: Rabea X
- Archetype: Petrucci X

**Key PCOM Details:**
- Requires separate plugin purchase (not included with QC)
- Uses existing iLok license -- does not consume an additional activation
- Up to 3 Quad Cortex units per plugin license
- Plugin devices can be mixed with native QC devices on the same grid
- Plugin presets imported via Cortex Control drag-and-drop
- "X" suffix denotes QC-compatible plugin versions
- Older (non-X) plugins required complete rebuilds due to different architecture

### Neural DSP Desktop Plugins (Archetype Series)

Neural DSP's plugin lineup (these are standalone/VST/AU/AAX plugins for desktop DAWs):

| Plugin | Artist / Focus |
|--------|---------------|
| Archetype: Plini | Progressive lead tones |
| Archetype: Gojira | Modern heavy/progressive metal |
| Archetype: Nolly | Modern metal production |
| Archetype: Cory Wong | Funk, clean, dynamic tones |
| Archetype: Tim Henson | Progressive, ambient, modern |
| Archetype: Rabea | Versatile rock/metal |
| Archetype: Petrucci | Progressive metal |
| Archetype: Abasi | Modern progressive |
| Archetype: Tom Morello | Alternative rock |
| Archetype: Soldano | Classic high-gain |
| Fortin Nameless Suite | Extreme metal |
| Fortin NTS Suite | Tight modern metal |
| Fortin Cali Suite | California-voiced metal |
| Parallax | Dedicated bass amp/effects suite |
| Darkglass Ultra | Bass overdrive/amp suite |

Only plugins with the "X" designation are compatible with the Quad Cortex hardware.

### Third-Party Content

- **Captures**: Third-party companies (e.g., Amalgam Captures, STL Tones, Worship Tutorials) sell premium Neural Capture packs on their own sites
- **IRs**: Any WAV impulse response works (e.g., from OwnHammer, ML Sound Lab, Celestion, York Audio, etc.)
- **Presets**: Shared via Cortex Cloud or distributed as files by content creators
- **No third-party plugin support**: Only Neural DSP's own plugins run on the QC -- there is no open plugin format or third-party plugin loading

---

## Quick Reference

| Category | Count (approx., as of CorOS 4.0) |
|----------|----------------------------------|
| Amp Models | 90+ |
| Effects | 100+ |
| Stock IRs | 1,000+ |
| Factory Captures | 2,000+ |
| Preset Slots | 3,072 |
| Scenes per Preset | 8 |
| Grid Blocks | 32 (4x8) |
| Expression Inputs | 2 |
| USB Audio Channels | 8 in / 8 out |
| Looper Record Time | 4 min 44 sec |

### Key Resources

- Official Device List: neuraldsp.com/device-list
- User Manual (CorOS 4.0): neuraldsp.com/manual/quad-cortex
- Cortex Cloud: cloud.neuraldsp.com
- Cortex Control Download: neuraldsp.com/cortex-control
- Community Wiki: quadcortex.wiki
- Community Device List: cortex-device-list.vercel.app
- Firmware Updates: neuraldsp.com/quad-cortex-updates
