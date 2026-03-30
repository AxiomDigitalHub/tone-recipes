# Line 6 Helix Ecosystem - Technical Reference

> Last updated: March 2026. Current firmware: 3.80 (November 19, 2024). Current HX Edit: 3.82 (December 3, 2024).

---

## Product Line

### Current Products

| Product | MSRP (USD) | DSP | Blocks | Footswitches | Expression | Snapshots | Form Factor |
|---------|-----------|-----|--------|--------------|------------|-----------|-------------|
| **Helix Floor** | ~$1,499 | Dual SHARC | 32 (16/path) | 12 + toe switch | Built-in + 2-3 ext | 8 | Floor unit |
| **Helix LT** | ~$999 | Dual SHARC | 32 (16/path) | 12 + toe switch | Built-in + 1-2 ext | 8 | Floor unit |
| **Helix Rack** | ~$1,499 | Dual SHARC | 32 (16/path) | Via Helix Control | Via Helix Control | 8 | 3U rack |
| **Helix Control** | ~$499 | N/A (controller) | N/A | 12 + toe switch | Built-in | N/A | Floor controller |
| **HX Stomp XL** | ~$749 | Single SHARC | 8 | 8 capacitive-touch | 1 ext (TRS, 2-ch) | 4 | Compact pedal |
| **HX Stomp** | ~$599 | Single SHARC | 8 | 3 | 2 ext | 3 | Ultra-compact pedal |
| **HX Effects** | ~$599 | Single SHARC | 9 | 8 + toe switch | 2 ext | 4 | Pedalboard format |
| **HX One** | ~$299 | Single | 1 effect | 2 (on/off + Flux) | 1 ext | 128 presets | Single pedal |
| **POD Go / Wireless** | ~$449/$549 | Single SHARC | 7 | 6 + toe switch | Built-in + 1 ext | 4 | Compact floor |
| **POD Express Guitar** | ~$199 | HX-derived | Limited | 3 | 1 ext | N/A | Ultra-compact |
| **POD Express Bass** | ~$199 | HX-derived | Limited | 3 | 1 ext | N/A | Ultra-compact |
| **POD Express Black** | ~$199 | HX-derived | Limited | 3 | 1 ext | N/A | Ultra-compact |

### Helix Stadium Series (Released 2025)

| Product | MSRP (USD) | Key Features |
|---------|-----------|--------------|
| **Helix Stadium Floor** | $1,799 | 8" touchscreen, Agoura modeling, 48 blocks, 4 stereo paths |
| **Helix Stadium XL Floor** | $2,199 | Same as Stadium + 12 footswitches, scribble strips, more I/O |
| **Expand D10** | $219 | Expansion I/O module (Nexus port) |
| **EX2** | $149 | Dual expression pedal controller |

The Stadium series introduces Agoura sub-component behavioral modeling, Proxy cloud-based cloning, a Hype control for mix-ready tones, Bluetooth/Wi-Fi, and 32GB microSD storage.

### Shared HX Modeling Engine

All products in the Helix/HX family (except POD Express, which uses HX-derived technology) share the same core **HX Modeling** engine and run the same amp models, cab models, and effects. The differences are in processing power (dual vs. single DSP), block count, I/O, and physical controls.

- **Dual DSP:** Helix Floor, Helix LT, Helix Rack
- **Single DSP:** HX Stomp, HX Stomp XL, HX Effects, HX One, POD Go
- **HX-derived:** POD Express (subset of models)
- **Next-gen Agoura + HX:** Helix Stadium series

---

## Firmware History

### Complete Release Timeline

| Version | Date | Key Additions |
|---------|------|---------------|
| **1.00** | September 2015 | Launch: 46 amps, 30 cabs, 79 effects |
| **1.06** | 2016 | Modeling improvements, bug fixes |
| **2.00** | July 6, 2016 | **Snapshots feature**, Line 6 2204 Mod, Fatality, Cali IV amps, Wringer Fuzz, Harmonic Tremolo, Vintage Digital Delay |
| **2.10** | November 22, 2016 | 3ch Matchstick amp, Teemah!, KWB, Bitcrusher, Deluxe Phaser, Simple Pitch, Dual Pitch, Autofilter |
| **2.20** | March 30, 2017 | **HX Edit** editor/librarian support |
| **2.30** | November 21, 2017 | Additional improvements |
| **2.50** | February 7, 2018 | Cali Texas Ch2 (Mesa Lonestar), Placater Dirty (Friedman BE-100), **77 Legacy effects** from M-series/DL4/DM4/FM4/MM4 |
| **2.60** | July 2, 2018 | HX Stomp support, new models |
| **2.70** | October 17, 2018 | Revv Generator amps, new effects |
| **2.80** | July 18, 2019 | **Major architecture update** (foundation for 3.x), Poly pitch effects groundwork |
| **2.90** | April 21, 2020 | New amps/cabs/effects, Output Meters, Gain Reduction Meters |
| **3.00** | November 22, 2020 | US Princess (Fender Princeton), 5 **Polyphonic pitch effects**, 16 new effects, preset spillover, user-saveable defaults |
| **3.10** | April 15, 2021 | Mandarin Rocker (Orange Rockerverb 100 MKIII), Ratatouille Dist (ProCo RAT), Euclidean Delay, **increased oversampling** on all amps/effects |
| **3.50** | November 3, 2022 | **All-new cab engine** (less DSP), 24 new cabs, 5 new amps (PV Vitriol, MOO)))N), 7 new effects, Dual IR block |
| **3.60** | April 25, 2023 | Grammatico GSG (Dumble-inspired), Line 6 Elmsley, 9 new cabs, Dark Dove Fuzz (EHX Russian Big Muff), Triple Rotary (Yamaha RA-200) |
| **3.70** | November 16, 2023 | 10 new amps (6 Catalyst originals: Clarity, Aristocrat, Carillon, Voltage, Kinetic, Oblivion), 9 new cabs, Prize Drive, Regal Bass DI, Feedbacker |
| **3.80** | November 19, 2024 | US Super Nrm/Vib (Fender Super Reverb), German Xtra Red/Blue (Bogner Ecstasy), EV Panama Blue/Red (EVH 5150III), Teardrop Bass Q wah |

### HX Edit / Helix Native Versions

| Software | Current Version | Release Date | Price |
|----------|----------------|--------------|-------|
| **HX Edit** | 3.82 | December 3, 2024 | Free |
| **Helix Native** (plugin) | 3.82 | December 2024 | $399.99 MSRP ($99.99 for HX hardware owners) |

Helix Native supports AAX, AU, and VST3 on Mac and Windows. Registered Helix/HX hardware owners (except HX One) receive a substantial discount.

---

## Amp Models (Exhaustive List)

As of firmware 3.80, the Helix contains **111+ amplifier models** (each available as full Amp+Cab or Preamp-only blocks).

### Fender-Based ("US" / "Tweed" / "Fullerton")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| US Small Tweed | Fender Champ | Small single-ended |
| Tweed Blues Nrm | Fender Bassman (Normal) | 4x10 tweed classic |
| Tweed Blues Brt | Fender Bassman (Bright) | |
| Fullerton Nrm | Fender 5C3 Tweed Deluxe (Normal) | 1x12 |
| Fullerton Brt | Fender 5C3 Tweed Deluxe (Bright) | |
| Fullerton Jump | Fender 5C3 Tweed Deluxe (Jumped) | |
| US Deluxe Nrm | Fender Deluxe Reverb (Normal) | Blackface |
| US Deluxe Vib | Fender Deluxe Reverb (Vibrato) | |
| US Princess | Fender Princeton Reverb | Added in 3.0 |
| US Double Nrm | Fender Twin Reverb (Normal) | Blackface |
| US Double Vib | Fender Twin Reverb (Vibrato) | |
| US Super Nrm | Fender Super Reverb (Normal) | Added in 3.80 |
| US Super Vib | Fender Super Reverb (Vibrato) | Added in 3.80 |

### Vox-Based ("Essex")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Essex A15 | Vox AC-15 | |
| Essex A30 | Vox AC-30 Fawn | Top Boost and Normal ch |
| Essex A30 TB | Vox AC-30 (Top Boost) | |

### Marshall-Based ("Brit")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Brit J45 Nrm | Marshall JTM-45 (Normal) | First Marshall, Bassman-derived |
| Brit J45 Brt | Marshall JTM-45 (Bright) | |
| Brit Trem Nrm | Marshall JTM-50 Tremolo (Normal) | |
| Brit Trem Brt | Marshall JTM-50 Tremolo (Bright) | |
| Brit Trem Jump | Marshall JTM-50 Tremolo (Jumped) | |
| Brit Plexi Nrm | Marshall Super Lead 100 (Normal) | 1959 Plexi |
| Brit Plexi Brt | Marshall Super Lead 100 (Bright) | |
| Brit Plexi Jump | Marshall Super Lead 100 (Jumped) | |
| Brit P75 Nrm | Park 75 (Normal) | Marshall-manufactured |
| Brit P75 Brt | Park 75 (Bright) | |
| Brit 2204 | Marshall JCM-800 2204 | 50W master volume |
| Brit 2203 | Marshall JCM-800 2203 | Added in 3.70 |
| Brit Jub Rhyth | Marshall Silver Jubilee 2555 (Rhythm) | |
| Brit Jub Clip | Marshall Silver Jubilee 2555 (Rhythm Clip) | |
| Brit Jub Nrm | Marshall Silver Jubilee 2555 (Normal) | |

### Hiwatt-Based ("WhoWatt")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| WhoWatt 100 | Hiwatt DR-103 Brill | |

### Mesa/Boogie-Based ("Cali")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Cali Texas Ch1 | Mesa/Boogie Lonestar (Ch 1) | |
| Cali Texas Ch2 | Mesa/Boogie Lonestar (Ch 2) | Added in 2.50 |
| Cali 2C+ Nrm | Mesa/Boogie Mark IIC+ (Normal) | |
| Cali 2C+ Lead | Mesa/Boogie Mark IIC+ (Lead) | |
| Cali IV Rhyth 1 | Mesa/Boogie Mark IV (Rhythm 1) | |
| Cali IV Rhyth 2 | Mesa/Boogie Mark IV (Rhythm 2) | |
| Cali IV Lead | Mesa/Boogie Mark IV (Lead) | |
| Cali Rectifire | Mesa/Boogie Dual Rectifier | High-gain modern |

### Bogner-Based ("German")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| German Mahadeva | Bogner Shiva | Clean/crunch |
| German Ubersonic | Bogner Uberschall | High gain |
| German Xtra Blue | Bogner Ecstasy 101B (Blue Ch) | Added in 3.80 |
| German Xtra Red | Bogner Ecstasy 101B (Red Ch) | Added in 3.80 |

### Diezel-Based ("Das")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Das Benzin Mega | Diezel VH4 (Mega channel) | High gain |
| Das Benzin Lead | Diezel VH4 (Lead channel) | |

### Soldano-Based ("Solo")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Solo Lead Clean | Soldano SLO-100 (Clean) | |
| Solo Lead Crunch | Soldano SLO-100 (Crunch) | |
| Solo Lead OD | Soldano SLO-100 (Overdrive) | |

### Friedman-Based ("Placater")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Placater Clean | Friedman BE-100 (Clean) | |
| Placater Dirty | Friedman BE-100 (Dirty) | Added in 2.50 |

### EVH/Peavey-Based ("PV" / "EV Panama")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| PV Panama | Peavey 5150 | Original Eddie Van Halen sig |
| PV Vitriol Clean | Peavey Invective (Clean) | Added in 3.50 |
| PV Vitriol Lead | Peavey Invective (Lead) | Added in 3.50 |
| EV Panama Blue | EVH 5150III (Blue Ch) | Added in 3.80 |
| EV Panama Red | EVH 5150III (Red Ch) | Added in 3.80 |

### Revv-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Revv Gen Purple | Revv Generator 120 (Purple Ch) | |
| Revv Gen Red | Revv Generator 120 (Red Ch) | |

### ENGL-Based ("ANGL")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| ANGL Meteor | ENGL Fireball 100 | |

### PRS-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Archetype Clean | PRS Archon (Clean) | |
| Archetype Lead | PRS Archon (Lead) | |

### Orange-Based ("Mandarin")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Mandarin 80 | Orange OR80 | |
| Mandarin Rocker | Orange Rockerverb 100 MKIII | Added in 3.10 |

### Matchless-Based ("Matchstick")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Matchstick Ch1 | Matchless DC30 (Ch 1) | |
| Matchstick Ch2 | Matchless DC30 (Ch 2) | |
| Matchstick Jump | Matchless DC30 (Jumped) | |

### Divided By 13-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Divided Duo | Divided By 13 JRT 9/15 | |

### Dr. Z-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Interstate Zed | Dr Z Route 66 | |

### Supro-Based ("Soup")

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Soup Pro | Supro S6616 | |

### Grammatico-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Grammatico Nrm | Grammatico LaGrange (Normal) | |
| Grammatico Brt | Grammatico LaGrange (Bright) | |
| Grammatico Jump | Grammatico LaGrange (Jumped) | |
| Grammatico GSG | Grammatico GSG100 (Dumble-inspired) | Added in 3.60 |

### Trainwreck-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Derailed Ingrid | Trainwreck Express | |

### Roland/Jazz Chorus-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Jazz Rivet 120 | Roland JC-120 Jazz Chorus | Clean solid-state |

### Silvertone-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Mail Order Twin | Silvertone 1484 | |

### Gibson/Epiphone-Based

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Voltage Queen | Gibson/Epiphone Electar | |

### Ampeg-Based (Bass)

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Ampeg B-15NF | Ampeg B-15NF Portaflex | Bass |
| Ampeg SVT Nrm | Ampeg SVT (Normal) | Bass |
| Ampeg SVT Brt | Ampeg SVT (Bright) | Bass |

### Aguilar-Based (Bass)

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Agua 51 | Aguilar DB751 | Bass, added in 2.60 |

### Sunn-Based (Bass)

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| Busy One | Sunn Coliseum 300 | Bass |
| Busy One Jump | Sunn Coliseum 300 (Jumped) | Bass |

### MOO)))N (Bass, Added 3.50)

| Helix Model Name | Based On | Notes |
|-------------------|----------|-------|
| MOO)))N Ch1 | Based on bass amp circuit | Bass |
| MOO)))N Ch2 | Based on bass amp circuit | Bass |
| MOO)))N Jump | Based on bass amp circuit | Bass |

### Line 6 Originals

| Helix Model Name | Description | Notes |
|-------------------|-------------|-------|
| Line 6 Litigator | Boutique mid-gain, Dumble-inspired starting point | |
| Line 6 Elektrik | High-gain design | |
| Line 6 Doom | Massive low-end, stoner/doom | |
| Line 6 Epic | Modern high-gain | |
| Line 6 2204 Mod | Modified Marshall 2204 | |
| Line 6 Fatality | Modified Mesa Rectifier | |
| Line 6 Badonk | Modern metal | |
| Line 6 Elmsley | Original design | Added in 3.60 |
| Line 6 Clarity | From Catalyst series | Added in 3.70 |
| Line 6 Aristocrat | From Catalyst series | Added in 3.70 |
| Line 6 Carillon | From Catalyst series | Added in 3.70 |
| Line 6 Voltage | From Catalyst series | Added in 3.70 |
| Line 6 Kinetic | From Catalyst series | Added in 3.70 |
| Line 6 Oblivion | From Catalyst series | Added in 3.70 |

> **Note:** Each Catalyst-derived amp includes a unique integrated boost circuit. All amp models are available as both full Amp+Cab blocks and Preamp-only blocks. Preamp blocks use less DSP.

---

## Cab Models & IRs

### Stock Cabinet Models (~56+ as of FW 3.80)

Each cab is available in **Single** and **Dual** configurations. Dual cabs use twice the DSP.

#### Guitar Cabs

| Helix Cab Name | Speaker Config | Captured From |
|----------------|---------------|---------------|
| 1x6x9 Soup Pro Ellipse | 1x6x9" | Supro S6616 |
| 1x8 Small Tweed | 1x8" | Fender Champ |
| 1x10 US Princess | 1x10" | Fender Princeton Reverb Eminence |
| 1x12 US Deluxe | 1x12" | Fender Deluxe Reverb Oxford |
| 1x12 Fullerton | 1x12" | Fender 5C3 Tweed Deluxe |
| 1x12 Grammatico | 1x12" | Grammatico LaGrange P12Q |
| 1x12 Field Coil | 1x12" | Gibson EH185 |
| 1x12 Celest 12H | 1x12" | Divided By 13 JRT 9/15 G12 H30 |
| 1x12 Blue Bell | 1x12" | Vox AC-15 Blue |
| 1x12 Lead 80 | 1x12" | Bogner Shiva CL80 |
| 1x12 Cali EXT | 1x12" | Mesa/Boogie Extension EVM12L |
| 1x12 Open Cast | 1x12" | Open back cabinet EVM12L |
| 1x12 Open Cream | 1x12" | Open back cabinet G12M-65 |
| 2x12 Blue Bell | 2x12" | Vox AC-30 Fawn Blue |
| 2x12 Silver Bell | 2x12" | Vox AC-30 Silver |
| 2x12 Double C12N | 2x12" | Fender Twin C12N |
| 2x12 Jazz Rivet | 2x12" | Roland JC-120 |
| 2x12 Mail C12Q | 2x12" | Silvertone 1484 |
| 2x12 Interstate | 2x12" | Dr Z Z Best V30 |
| 2x12 Mandarin 30 | 2x12" | Orange PPC212 V30 |
| 4x10 Tweed P10R | 4x10" | Fender Bassman P10R |
| 4x12 WhoWatt 100 | 4x12" | Hiwatt |
| 4x12 Greenback 25 | 4x12" | Marshall Basketweave G12 M25 |
| 4x12 Greenback 20 | 4x12" | Marshall with G12M Greenback 20W |
| 4x12 Blackback 30 | 4x12" | Park 75 with G12H-30 |
| 4x12 1960A T75 | 4x12" | Marshall 1960A T75 |
| 4x12 Brit V30 | 4x12" | Marshall with V30 |
| 4x12 Uber V30 | 4x12" | Bogner Ubercab V30 |
| 4x12 Uber T75 | 4x12" | Bogner Ubercab T75 |
| 4x12 Cali V30 | 4x12" | Mesa/Boogie 4x12 V30 |
| 4x12 XXL V30 | 4x12" | ENGL 4x12 V30 |
| 4x12 SoloLead EM | 4x12" | Soldano |
| 4x12 Cartog Guv | 4x12" | Lee Jackson modified w/ Eminence Governor | Added 3.80 |
| 4x12 Cartog C90 | 4x12" | Lee Jackson modified w/ Mesa C90 | Added 3.80 |

#### Bass Cabs

| Helix Cab Name | Speaker Config | Captured From |
|----------------|---------------|---------------|
| 1x12 Epifani UL | 1x12" | Epifani Ultralight |
| 1x15 Ampeg B-15 | 1x15" | Ampeg B-15 Portaflex |
| 4x10 Ampeg HLF | 4x10" | Ampeg SVT-410HLF |
| 6x10 Ampeg SVT | 6x10" | Ampeg SVT-610HLF |
| 8x10 Ampeg SVT | 8x10" | Ampeg SVT-810E |
| 4x10 Ampeg PR | 4x10" | Ampeg PR-410HLF |

> **Note:** Additional cabs were added in firmware 3.50 (24 new cabs with the new cab engine), 3.60 (9 cabs), 3.70 (9 cabs), and 3.80 (4 cabs). The list above is representative but not fully exhaustive for every cab variant.

### Microphone Models (16 Total)

| Helix Mic Name | Based On | Type |
|----------------|----------|------|
| 57 Dynamic | Shure SM57 | Dynamic |
| 409 Dynamic | Sennheiser MD 409 | Dynamic |
| 421 Dynamic | Sennheiser MD 421-U | Dynamic |
| 30 Dynamic | Heil Sound PR 30 | Dynamic |
| 20 Dynamic | Electro-Voice RE20 | Dynamic |
| 7 Dynamic | Shure SM7 / SM7B | Dynamic |
| 67 Cond | Neumann U 67 | Condenser |
| 87 Cond | Neumann U 87 | Condenser |
| 414 Cond | AKG C414 | Condenser |
| 84 Cond | Neumann KM 84 | Condenser |
| 47 Cond | Neumann U 47 | Condenser |
| 121 Ribbon | Royer R-121 | Ribbon |
| 160 Ribbon | Beyerdynamic M 160 | Ribbon |
| 4038 Ribbon | Coles 4038 | Ribbon |
| 112 Dynamic | AKG D112 | Dynamic (bass/kick) |
| 12 Dynamic | AKG D12 | Dynamic (bass/kick) |

#### Mic Parameters

- **Position:** Center to Cap Edge to Edge (lateral placement)
- **Distance:** 1.00" to 12.00" in 0.25" increments
- **Angle:** 0 degrees (on-axis) to 45 degrees (off-axis)
- **Low Cut / High Cut:** Adjustable filter frequencies
- **Level:** Overall cab output level

### Impulse Response (IR) Specifications

| Spec | Value |
|------|-------|
| **IR Slots** | 128 user IR slots |
| **Native Format** | 48kHz, 16-bit, mono, .WAV |
| **Supported Lengths** | 1,024 samples (~21ms) or 2,048 samples (~42ms) |
| **Auto-Conversion** | HX Edit converts any WAV to 16-bit, 48kHz mono; stereo files use left channel only |
| **Dual IR Block** | Available since FW 3.50 |
| **IR Blocks Per Path** | Up to 2 per path (1,024-sample) or 1 per path (2,048-sample) |
| **Total IR Blocks** | Up to 4 (1,024-sample) or 2 (2,048-sample) |

> **Tip:** Avoid pre-silence in IR files. The importer applies windowing at the end. Using the 1,024-sample option saves DSP but fades the IR at the halfway point.

---

## Effects (Exhaustive List)

As of firmware 3.80, the Helix contains **276+ effects**. Effects are available as HX (modern, high-fidelity) or Legacy (from M-series/DL4/DM4/FM4/MM4 era). Stereo versions of effects use approximately double the DSP of mono versions.

### Distortion / Overdrive

#### HX Models

| Helix Model Name | Based On | Type |
|-------------------|----------|------|
| Kinky Boost | Xotic EP Booster | Boost |
| Deranged Master | Dallas Rangemaster Treble Booster | Boost |
| Minotaur | Klon Centaur | Overdrive |
| Teemah! | Paul Cochrane Timmy | Overdrive |
| Scream 808 | Ibanez TS808 Tube Screamer | Overdrive |
| Hedgehog D9 | Maxon SD9 Sonic Distortion | Overdrive |
| Stupor OD | Boss SD-1 Super Overdrive | Overdrive |
| Compulsive Drv | Fulltone OCD | Overdrive |
| Valve Driver | Chandler Tube Driver | Overdrive |
| Top Secret OD | DOD OD-250 | Overdrive |
| Prize Drive | Nobel ODR-1 | Overdrive, added 3.70 |
| Vermin Dist | ProCo RAT | Distortion |
| Ratatouille Dist | 1984 ProCo RAT (LM308 chip) | Distortion, added 3.10 |
| KWB | Benadrian Kowloon Walled Bunny | Distortion |
| Clawthorn Drv | Wounded Paw Battering Ram | Distortion |
| Horizon Drive | Horizon Devices Precision Drive | Drive/gate |
| Obsidian 7000 | Darkglass Electronics B7K Ultra | Bass overdrive |
| Arbitrator Fuzz | Arbiter Fuzz Face | Fuzz |
| Triangle Fuzz | Electro-Harmonix Big Muff Pi (Triangle) | Fuzz |
| Industrial Fuzz | Z.Vex Fuzz Factory | Fuzz |
| Tycoctavia Fuzz | Tycobrahe Octavia | Fuzz |
| Wringer Fuzz | Garbage's modded Boss FZ-2 | Fuzz |
| Dark Dove Fuzz | Electro-Harmonix Russian Big Muff | Fuzz, added 3.60 |
| Bitcrusher | Line 6 Original | Bitcrusher |

#### Legacy Models (from M-series/stompbox era)

| Helix Model Name | Based On | Type |
|-------------------|----------|------|
| Screamer | Ibanez Tube Screamer | Overdrive |
| Overdrive | DOD OD-250 | Overdrive |
| Classic Dist | ProCo RAT | Distortion |
| Heavy Dist | Boss Metal Zone MT-2 | Distortion |
| Colordrive | Colorsound Overdriver | Overdrive |
| Buzz Saw | Maestro FZ-1 Fuzz-Tone | Fuzz |
| Facial Fuzz | Arbiter Fuzz Face | Fuzz |
| Fuzz Pi | Electro-Harmonix Big Muff Pi | Fuzz |
| Jet Fuzz | Roland Jet Phaser | Fuzz/Phase |
| L6 Drive | Line 6 Original | Drive |
| L6 Distortion | Line 6 Original | Distortion |
| Sub Oct Fuzz | PAiA Roctave Divider | Octave Fuzz |
| Octave Fuzz | Tycobrahe Octavia | Octave Fuzz |

### Dynamics / Compressors

#### HX Models

| Helix Model Name | Based On |
|-------------------|----------|
| Deluxe Comp | Ampeg Opto Comp |
| Red Comp | MXR Dyna Comp |
| Blue Comp | Boss CS-1 Compression Sustainer (treble off) |
| Blue Comp Treb | Boss CS-1 Compression Sustainer (treble on) |
| LA Studio Comp | Teletronix LA-2A |
| 3-Band Comp | Line 6 Original (multiband) |
| Kinky Comp | Xotic SP Compressor |

#### Legacy Models

| Helix Model Name | Based On |
|-------------------|----------|
| Tube Comp | Teletronix LA-2A |
| Red Comp | MXR Dyna Comp |
| Blue Comp | Boss CS-1 |
| Vetta Comp | Line 6 Vetta II |
| Vetta Juice | Line 6 Vetta II |
| Boost Comp | MXR Micro Amp |

### EQ

| Helix Model Name | Based On / Type |
|-------------------|----------------|
| 10 Band Graphic | MXR 10-Band Graphic EQ |
| Cali Q Graphic | Mesa/Boogie Mark IV Graphic EQ |
| Parametric | Line 6 Original (parametric) |
| Low/High Shelf | Line 6 Original |
| Tilt | Line 6 Original |
| Low Cut / High Cut | Line 6 Original |
| Simple EQ | Line 6 Original |
| Horizon Gate | Horizon Precision Drive (gate circuit only) |

### Modulation

#### HX Models

| Helix Model Name | Based On | Sub-Type |
|-------------------|----------|----------|
| Optical Trem | Fender optical tremolo circuit | Tremolo |
| 60s Bias Trem | Vox AC-15 Tremolo | Tremolo |
| Bleat Chop Trem | Lightfoot Labs Goatkeeper | Tremolo |
| Harmonic Trem | Line 6 Original (based on brownface Fender) | Tremolo |
| Script Mod Phase | MXR Phase 90 (Script logo) | Phaser |
| Ubiquitous Vibe | Shin-ei Uni-Vibe | Vibe |
| Deluxe Phaser | Line 6 Original (expanded phaser) | Phaser |
| Pebble Phaser | Electro-Harmonix Small Stone | Phaser |
| Courtesan Flange | A/DA Flanger | Flanger |
| Harmonic Flanger | MXR Flanger | Flanger |
| Dynamix Flanger | Line 6 Original (dynamic flanger) | Flanger |
| Chorus CE-1 | Boss CE-1 Chorus Ensemble | Chorus |
| 70s Chorus | Boss CE-1 (vibrato mode) | Chorus |
| PlastiChorus | Modded Arion SCH-Z | Chorus |
| Dimension | Roland Dimension D | Chorus |
| Tri Stereo Chorus | Dytronics Tri-Stereo Chorus CS-5 | Chorus |
| Rotary 122 | Leslie 122 | Rotary |
| Rotary 145 | Leslie 145 | Rotary |
| Fender Vibratone | Fender Vibratone (Leslie) | Rotary |
| Triple Rotary | Yamaha RA-200 | Rotary, added 3.60 |
| Dual Phaser | Mu-Tron Bi-Phase | Phaser |
| Retro Reel | Line 6 Original (tape warble) | Tape, added 3.10 |
| Poly Sustain | Line 6 Original (polyphonic sustainer) | Sustain |
| Tremolo/Autopan | Line 6 Original | Tremolo |

#### Legacy Modulation

| Helix Model Name | Based On |
|-------------------|----------|
| Analog Chorus | Boss CE-1 |
| Analog Flanger | MXR Flanger |
| Jet Flanger | A/DA Flanger |
| AC Flanger | MXR Flanger |
| 80A Flanger | A/DA Flanger |
| Frequency Shifter | Bode Frequency Shifter |
| Ring Modulator | Line 6 Original |
| Rotary Drum | Leslie 145 |
| Rotary Drum + Horn | Leslie 122 |
| Opto Trem | Fender optical tremolo |
| Bias Trem | Vox AC-15 tremolo |
| Pattern Trem | Line 6 Original |
| Panner | Line 6 Original |
| Script Phase | MXR Phase 90 |
| Dual Phaser | Mu-Tron Bi-Phase |
| Barberpole Phaser | Line 6 Original |
| U-Vibe | Shin-ei Uni-Vibe |
| Pitch Vibrato | Boss VB-2 |
| Dimension | Roland Dimension D |

### Delay

#### HX Models

| Helix Model Name | Based On |
|-------------------|----------|
| Simple Delay | Line 6 Original (clean digital) |
| Mod/Cho Echo | Line 6 Original (modulated delay) |
| Dual Delay | Line 6 Original |
| Multitap 4 | Line 6 Original |
| Multitap 6 | Line 6 Original |
| Adriatic Delay | Modified Boss DM-2 (analog) |
| Adriatic Swell | Boss DM-2 (with swell) |
| Elephant Man | Electro-Harmonix Deluxe Memory Man |
| Cosmos Echo | Binson EchoRec |
| Transistor Tape | Maestro EP-3 Echoplex |
| Vintage Digital | Line 6 Original (80s rack digital) |
| Euclidean Delay | Line 6 Original (Euclidean rhythm patterns) | Added 3.10 |
| Poly Delay | Line 6 Original (polyphonic pitch-shifted delay) |
| Reverse Delay | Line 6 Original |
| Harmony Delay | Line 6 Original (pitch-shifted harmonies) |
| Bucket Brigade | Line 6 Original (BBD-style) |
| Ping Pong | Line 6 Original (stereo bounce) |
| Sweep Echo | Line 6 Original (filter sweep delay) |
| Dynamic Delay | TC Electronic 2290-inspired |
| Glitch Delay | Line 6 Original |

#### Legacy Delay

| Helix Model Name | Based On |
|-------------------|----------|
| Ping Pong | Line 6 Original |
| Dynamic Delay | TC Electronic 2290 |
| Stereo Delay | Line 6 Original |
| Digital Delay | Line 6 Original |
| Digital Delay w/Mod | Line 6 Original |
| Reverse | Line 6 Original |
| Lo Res | Line 6 Original |
| Tube Echo | Maestro EP-1 Echoplex |
| Tape Echo | Maestro EP-3 Echoplex |
| Sweep Echo | Line 6 Original |
| Echo Platter | Binson EchoRec |
| Analog Echo | Boss DM-2 |
| Analog w/Mod | Electro-Harmonix Deluxe Memory Man |
| Auto-Volume Echo | Line 6 Original |
| Multi-Head | Roland RE-101 Space Echo |

### Reverb

#### HX Models

| Helix Model Name | Based On / Type |
|-------------------|----------------|
| '63 Spring | Fender 6G15 tube spring reverb unit |
| Spring | Line 6 Original (spring emulation) |
| Plate | Line 6 Original (studio plate reverb) |
| Room | Line 6 Original |
| Chamber | Line 6 Original |
| Hall | Line 6 Original |
| Glitz | Strymon Big Sky-inspired (Bloom) |
| Ganymede | Boss RV-6-inspired (modulated) |
| Searchlights | Strymon Big Sky-inspired (Cloud) |
| Plateaux | Strymon Big Sky-inspired (Shimmer) |
| Double Tank | Strymon Big Sky-inspired (Plate Mod) |
| Dynamic Hall | Line 6 Original (ducking hall) | Added 3.10 |
| Hot Springs | Line 6 Original (spring variant) | Added 3.10 |
| Shimmer | Line 6 Original (octave shimmer) |
| Particle Verb | Line 6 Original (granular reverb) |
| Poly Sustain | Line 6 Original |

#### Legacy Reverb

| Helix Model Name | Based On |
|-------------------|----------|
| 63 Spring | Fender spring reverb |
| Spring | Line 6 Original |
| Plate | Line 6 Original |
| Room | Line 6 Original |
| Chamber | Line 6 Original |
| Hall | Line 6 Original |
| Echo | Line 6 Original |
| Tile | Line 6 Original |
| Cave | Line 6 Original |
| Ducking | Line 6 Original |
| Octo | Line 6 Original |

### Pitch / Synth

| Helix Model Name | Based On / Type |
|-------------------|----------------|
| Simple Pitch | Line 6 Original (pitch shift) |
| Dual Pitch | Line 6 Original (dual pitch shift) |
| Poly Pitch | Line 6 Original (polyphonic shift) | Added 3.0 |
| Poly Wham | Digitech Whammy-inspired (polyphonic) | Added 3.0 |
| Poly Capo | Line 6 Original (polyphonic capo) | Added 3.0 |
| Poly Sustain | Line 6 Original | Added 3.0 |
| 12 String | Line 6 Original (12-string emulation) | Added 3.0 |
| Twin Harmony | Line 6 Original (intelligent harmony) |
| Pitch Wham | Digitech Whammy |
| 3 Note Generator | Line 6 Original |
| 4 OSC Generator | Line 6 Original (synth oscillator) |
| 3 OSC Synth | Line 6 Original |
| Feedbacker | Line 6 Original (artificial feedback) | Added 3.70 |
| Synth Strings | Line 6 Original (string synth) |
| Synth Lead | Line 6 Original |
| Synth Pad | Line 6 Original |
| Poly Synth | Line 6 Original |
| Attack Synth | Electro-Harmonix Micro Synth-inspired |

#### Legacy Pitch/Synth

| Helix Model Name | Based On |
|-------------------|----------|
| Pitch Glide | Digitech Whammy |
| Smart Harmony | Line 6 Original |
| Bass Octaver | Boss OC-2 Octaver |
| Synth O Matic | Line 6 Original |
| Synth String | Elka Synthex |
| Growler | Line 6 Original |
| Attack Synth | EHX Micro Synth |
| Octi Synth | Line 6 Original |

### Wah

| Helix Model Name | Based On |
|-------------------|----------|
| UK Wah 846 | Vox V846 |
| Teardrop 310 | Dunlop Cry Baby (Fasel 310) |
| Fassel | Dunlop Cry Baby Super |
| Weeper | Arbiter Cry Baby |
| Chrome | Vox V847 |
| Chrome Custom | Modded Vox V847 |
| Throaty | RMC Real McCoy 1 |
| Vetta Wah | Line 6 Vetta II Original |
| Colorful | Colorsound Wah |
| Conductor | Maestro Boomer |
| Teardrop Bass Q | Dunlop 105Q Bass Wah | Added 3.80 |

### Filter

| Helix Model Name | Based On |
|-------------------|----------|
| Mutant Filter | Mu-Tron III |
| Mystery Filter | Korg A3 |
| Autofilter | Line 6 Original |
| Asheville Pattrn | Moog Moogerfooger MF-105M MuRF |
| Obi Wah | Oberheim Voltage Controlled S&H |
| Seeker | Z.Vex Seek Wah |
| V Tron | Mu-Tron III variant |
| Q Filter | Line 6 Original |
| Voice Box | Line 6 Original (talk box emulation) |

### Volume / Pan

| Helix Model Name | Type |
|-------------------|------|
| Volume Pedal | Standard volume |
| Gain | Level adjustment |
| Pan | Stereo panning |

### Looper

| Helix Model Name | Specs |
|-------------------|-------|
| 1 Switch Looper | Simple loop record/play |
| 6 Switch Looper | Full-featured looper (Helix Floor/LT/Rack) |
| Shuffling Looper | Line 6 Original (glitch looper) |

### Send/Return (FX Loop)

| Block Type | Purpose |
|------------|---------|
| FX Loop | Insert external pedals into signal chain |
| Send | Route signal to external gear |
| Return | Receive signal from external gear |

---

## Signal Flow & DSP

### Path Architecture

| Feature | Helix Floor/LT/Rack | HX Stomp / Stomp XL | HX Effects | POD Go |
|---------|---------------------|---------------------|------------|--------|
| **DSP Chips** | 2x SHARC | 1x SHARC | 1x SHARC | 1x SHARC |
| **Paths** | 2 (each split into A/B) | 1 (A/B parallel) | 1 (A/B parallel) | 1 |
| **Max Blocks** | 32 total (8 per sub-path) | 8 | 9 | 7 |
| **Max Amps** | 4 (2 per path) | 2 | 0 (effects only) | 1 |
| **Max Cabs** | 4 (2 per path) | 2 | 0 | 1 |
| **Presets** | 1,024 (8 setlists x 128) | 512 | 512 | 256 |
| **Snapshots** | 8 per preset | 3 (Stomp) / 4 (XL) | 4 | 4 |

### Routing Options

- **Series:** Single path, blocks in sequence (up to 8 blocks on Helix, 6 on HX Stomp)
- **Parallel (Split):** Signal splits into A and B sub-paths, processed independently, then merged
- **Super Serial:** Path 1B used as extension of Path 1A for a longer serial chain
- **Dual Path:** Path 1 and Path 2 with independent inputs/outputs (Helix Floor/LT/Rack only)
- **4 Parallel Paths:** Up to 4 independent signal flows with separate I/O (Helix Floor/LT/Rack)
- **Path 1 into Path 2:** Route output of Path 1 into input of Path 2 for additional DSP headroom

### DSP Usage Notes

- Amp+Cab blocks use the most DSP
- Preamp-only blocks use significantly less DSP than full Amp blocks
- Dual Cabs use 2x the DSP of Single Cabs
- Stereo effects use ~2x DSP vs mono
- Pitch effects (especially Poly) are DSP-intensive
- 1,024-sample IRs use less DSP than 2,048-sample
- Since FW 3.50, the new cab engine uses significantly less DSP than older cabs
- Latency: <2ms roundtrip (analog in to analog out)

### Snapshots

Snapshots allow instant switching of parameter values within a single preset without audible gaps or latency. Each snapshot stores:

- Block bypass states (on/off)
- Parameter values for any assigned controls
- Command Center instant commands
- Tempo
- **Trails:** Delay, reverb, and looper tails continue naturally across snapshot changes

### Footswitch Modes

- **Stomp Mode:** Each footswitch toggles a block or combination of blocks
- **Preset Mode:** Footswitches select presets
- **Snapshot Mode:** Footswitches select snapshots
- **Pedal Edit Mode:** Assign parameters to expression pedals
- **Per-Preset Mode:** Each preset can have custom footswitch assignments

---

## Connectivity

### Helix Floor I/O (Most Comprehensive)

| Connection | Details |
|-----------|---------|
| **Guitar In** | 1/4" TS, variable impedance (auto or manual 10k-1M ohm) |
| **Aux In** | 1/4" TRS stereo |
| **Mic In** | XLR with 48V phantom power |
| **Main L/R Out** | 1/4" TRS balanced or XLR |
| **Send 1-4** | 1/4" TS (4 FX loop sends) |
| **Return 1-4** | 1/4" TS (4 FX loop returns) |
| **Headphone** | 1/4" TRS stereo |
| **S/PDIF** | Coaxial in/out |
| **AES/EBU** | XLR digital out |
| **L6 LINK** | AES/EBU for linking to Line 6 amps (StageSource, Powercab) |
| **Variax (VDI)** | RJ-45 for digital Variax connection |
| **USB** | Type B, 8-in/8-out audio interface, 24-bit/96kHz |
| **MIDI** | 5-pin DIN In and Out/Thru |
| **EXP 1/2/3** | 1/4" TRS for external expression pedals |
| **CV Out** | Control voltage output |
| **Ext Amp 1/2** | 1/4" TS for amp channel switching |

### USB Audio Interface Capabilities

| Product | USB Audio Channels | Sample Rates |
|---------|-------------------|--------------|
| Helix Floor/LT/Rack | 8-in / 8-out | 24-bit, up to 96kHz |
| HX Stomp / Stomp XL | Multi-channel | 24-bit, up to 96kHz |
| HX Effects | Edit/firmware only (not audio) | N/A |
| POD Go | 4-in / 4-out | 24-bit, up to 96kHz |
| POD Express | 4-in / 4-out | 24-bit, 48kHz |
| Helix Stadium | 8-channel | 24-bit (specs TBC) |

### 4-Cable Method

The Helix supports the 4-Cable Method for integrating with a traditional guitar amp:

1. **Guitar** -> Helix Guitar In
2. **Helix Send 1** -> Amp Input (pre-amp effects in front of amp)
3. **Amp FX Send** -> Helix Return 1 (amp preamp feeds back to Helix)
4. **Helix Main Out** -> Amp FX Return (post-amp effects in the loop)

This allows placing Helix effects both before and after the amp's preamp section.

### Variax Integration (Helix Floor / Rack only)

- Power, digital audio, and control via single VDI (RJ-45) cable
- Per-preset and per-snapshot Variax model/tuning recall
- Variax knob controllers in Command Center
- Toggle between two Variax models with a footswitch
- Control Helix parameters from Variax guitar knobs

### Command Center

The Command Center turns any Helix into a master controller for your rig:

- **MIDI CC:** Send continuous controller messages
- **MIDI PC (Bank/Program):** Change presets on external gear
- **MIDI Note:** Trigger MIDI notes
- **MIDI MMC:** MIDI Machine Control (transport)
- **CV/Expression Out:** Control voltage for analog gear
- **Ext Amp:** Channel switching via relay (1/4" TS)
- **Instant Commands:** Up to 6 automatic commands per preset load
- All commands stored per preset, with snapshot recall support
- MIDI transmitted via both 5-pin DIN and USB simultaneously

### Expression Pedal Assignments

- EXP 1 and EXP 2 toggled via built-in toe switch
- EXP 3 via external connection
- Any parameter from any block can be assigned to any expression pedal
- Min/max range fully adjustable per assignment
- Multiple parameters can be controlled from a single expression pedal

---

## Community & Ecosystem

### CustomTone

- **URL:** [line6.com/customtone](https://line6.com/customtone/browse/helix/)
- Free community-uploaded preset library
- 10,000+ Helix presets available
- Requires registered Line 6 product

### Line 6 Marketplace

- **URL:** [line6.com/marketplace](https://line6.com/marketplace/)
- Premium presets and IRs from curated third-party vendors
- Partners include: Celestion, 3 Sigma Audio, OwnHammer, Live Ready Sound, Worship Tutorials, Jason Sadites, Fremen, and others
- Compatible with all Helix/HX products and Helix Native

### Helix Native Plugin

- **URL:** [line6.com/helix/helixnative](https://line6.com/helix/helixnative.html)
- Full Helix amp/cab/effects engine as a DAW plugin
- AAX, AU, VST3 (Mac and Windows)
- Same 111+ amps, 276+ effects, cab models, and IR loading
- Perfect preset compatibility with hardware units
- MSRP: $399.99 (discounted to ~$99.99 for registered Helix/HX hardware owners)
- Free for buyers of new Helix hardware units (part of Recording Bundle with Cubase Elements)

### Third-Party IR Makers

| Company | Specialty | Notes |
|---------|-----------|-------|
| **OwnHammer** | Premium IRs since 2010 | Extensive cab library, featured on Billboard #1 records |
| **ML Sound Lab** | Rock/metal IRs, MIKKO software | Best known for 4x12 metal cabs, MIKKO mixer plugin |
| **York Audio** | Wide variety of cabs | Popular for clean/ambient tones, diverse cab selection |
| **Celestion** | Official speaker IRs | Direct from the speaker manufacturer |
| **3 Sigma Audio** | Boutique cab captures | Available on Line 6 Marketplace |
| **Live Ready Sound** | Worship/ambient IRs | Specialized for worship guitarists |
| **Ownhammer** | Studio-grade captures | Multiple mic position options |

### Third-Party Preset Makers

| Creator | Focus |
|---------|-------|
| **Jason Sadites** | Free and premium presets, YouTube tutorials |
| **Fremen** | Comprehensive preset packs (amp-centric) |
| **Worship Tutorials** | Church/worship tone presets |
| **ChopTones** | Genre-specific preset packs |
| **LivePlayRock** | Performance-ready presets |

### Community Resources

- **Line 6 Community Forums:** [line6.com/support](https://line6.com/support/) - Active user forums
- **Helix Help:** [helixhelp.com](https://helixhelp.com/) - Comprehensive model database, guides, tips
- **Fluid Solo:** [fluidsolo.com](https://www.fluidsolo.com/) - Model browser, patch exchange
- **Line 6 Fandom Wiki:** [line6.fandom.com](https://line6.fandom.com/wiki/Helix_Amp_Models) - Community-maintained model reference
- **The Gear Page / TGF Helix Thread:** Long-running discussion threads
- **Facebook Groups:** Line 6 Helix Family User Group (large active community)
- **Reddit:** r/Line6Helix

### Software Ecosystem

| Software | Purpose | Price |
|----------|---------|-------|
| **HX Edit** | Editor, librarian, IR manager, firmware updater | Free |
| **Helix Native** | DAW plugin (AAX/AU/VST3) | $399.99 ($99.99 w/ hardware) |
| **POD Go Edit** | Editor for POD Go | Free |
| **HX One Librarian** | Preset manager for HX One | Free |
| **Line 6 Updater** | Legacy firmware update tool | Free |

---

## Naming Convention Quick Reference

Understanding Helix model names:

| Prefix/Pattern | Real Manufacturer |
|---------------|-------------------|
| US / Tweed / Fullerton | Fender |
| Essex | Vox |
| Brit | Marshall / Park |
| WhoWatt | Hiwatt |
| Cali | Mesa/Boogie |
| German | Bogner |
| Das | Diezel |
| Solo | Soldano |
| Placater | Friedman |
| PV / EV Panama | Peavey / EVH |
| ANGL | ENGL |
| Mandarin | Orange |
| Matchstick | Matchless |
| Soup | Supro |
| Line 6 | Original designs |

Channel suffixes: **Nrm** = Normal, **Brt** = Bright, **Jump** = Jumped (both channels linked)

---

## Sources

- [Line 6 Official Helix Models](https://line6.com/helix-models/)
- [Line 6 History of Helix Updates](https://line6.com/helix-timeline/)
- [Line 6 Firmware Release Notes](https://line6.com/support/page/kb/effects-controllers/helix/)
- [Helix Help](https://helixhelp.com/models)
- [DShowMusic Helix Amp Models](https://dshowmusic.com/line-6-helix-amp-models/)
- [DShowMusic Helix Effect Models](https://dshowmusic.com/line-6-helix-effect-models/)
- [Fluid Solo Model Browser](https://www.fluidsolo.com/patchexchange/view-models/Amplifiers,a)
- [Line 6 Fandom Wiki](https://line6.fandom.com/wiki/Helix_Amp_Models)
- [Line 6 Helix Stadium](https://line6.com/helix-stadium/)
