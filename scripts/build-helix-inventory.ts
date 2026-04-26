/**
 * Build the master Helix module inventory by fusing:
 *
 *   1. Line 6's official model list (helixName ↔ realWorldGear mapping)
 *   2. The factory preset corpus at data/helix-corpus/models.json
 *      (modelId ↔ verified param shapes ↔ usage frequency)
 *
 * The fused result is written to data/helix-inventory.json — a single
 * source of truth the agent / generator / QC system can all reference
 * when deciding "what real-world gear maps to what Helix block, what
 * model ID does it use, and what params does that model accept."
 *
 * Inventory shape per entry:
 *
 *   {
 *     helixName: "Triangle Fuzz",               // shown in HX Edit UI
 *     category: "distortion",                    // top-level grouping
 *     modelId: "HD2_DistTriangleFuzz",           // ID used in .hlx
 *     realWorldGear: "Electro-Harmonix Big Muff Pi",
 *     manufacturer: "Electro-Harmonix",
 *     verified: true,                            // appeared in factory corpus
 *     corpusCount: 4,                            // # factory presets using it
 *     observedTypes: [0],                        // observed @type values
 *     params: { Sustain: { type: "number", min: 0, max: 1 }, ... }
 *   }
 *
 * Usage: npx tsx scripts/build-helix-inventory.ts
 */
import fs from "fs";
import path from "path";

const CORPUS_PATH = path.join(process.cwd(), "data", "helix-corpus", "models.json");
const OUT_PATH = path.join(process.cwd(), "data", "helix-inventory.json");

// --- Line 6 official model list (transcribed from line6.com/helix-models/) ---
// Format: [helixName, realWorldGear, manufacturer]. manufacturer left "" for
// Line 6 originals.
const OFFICIAL_LIST: Record<string, [string, string, string][]> = {
  amp_guitar: [
    ["WhoWatt 100", "Hiwatt DR-103", "Hiwatt"],
    ["Soup Pro", "Supro S6616", "Supro"],
    ["Stone Age 185", "Gibson EH-185", "Gibson"],
    ["Voltage Queen", "Victoria Vintage Queen", "Victoria"],
    ["Tweed Blues Nrm", "Fender Bassman (normal channel)", "Fender"],
    ["Tweed Blues Brt", "Fender Bassman (bright channel)", "Fender"],
    ["Fullerton Nrm", "Fender 5C3 Tweed Deluxe (normal channel)", "Fender"],
    ["Fullerton Brt", "Fender 5C3 Tweed Deluxe (bright channel)", "Fender"],
    ["Fullerton Jump", "Fender 5C3 Tweed Deluxe (jumped)", "Fender"],
    ["GrammaticoLG Nrm", "Grammatico LaGrange (normal)", "Grammatico"],
    ["GrammaticoLG Brt", "Grammatico LaGrange (bright)", "Grammatico"],
    ["GrammaticoLG Jump", "Grammatico LaGrange (jumped)", "Grammatico"],
    ["US Small Tweed", "Fender Champ", "Fender"],
    ["US Princess", "Fender Princeton Reverb", "Fender"],
    ["US Super Nrm", "Fender Super Reverb (normal)", "Fender"],
    ["US Super Vib", "Fender Super Reverb (vibrato)", "Fender"],
    ["US Deluxe Nrm", "Fender Deluxe Reverb (normal)", "Fender"],
    ["US Deluxe Vib", "Fender Deluxe Reverb (vibrato)", "Fender"],
    ["US Double Nrm", "Fender Twin Reverb (normal)", "Fender"],
    ["US Double Vib", "Fender Twin Reverb (vibrato)", "Fender"],
    ["Mail Order Twin", "Silvertone 1484", "Silvertone"],
    ["Divided Duo", "÷13 JRT 9/15", "÷13"],
    ["Interstate Zed", "Dr Z Route 66", "Dr Z"],
    ["Derailed Ingrid", "Trainwreck Circuits Express", "Trainwreck"],
    ["Grammatico GSG", "Grammatico GSG100", "Grammatico"],
    ["Jazz Rivet 120", "Roland JC-120 Jazz Chorus", "Roland"],
    ["Essex A15", "Vox AC-15", "Vox"],
    ["Essex A30", "Vox AC-30 Top Boost", "Vox"],
    ["A30 Fawn Nrm", "Vox AC-30 Fawn (normal)", "Vox"],
    ["A30 Fawn Brt", "Vox AC-30 Fawn (bright)", "Vox"],
    ["Matchstick Ch1", "Matchless DC30 (Ch 1)", "Matchless"],
    ["Matchstick Ch2", "Matchless DC30 (Ch 2)", "Matchless"],
    ["Matchstick Jump", "Matchless DC30 (jumped)", "Matchless"],
    ["Mandarin 80", "Orange OR80", "Orange"],
    ["Mandarin Rocker", "Orange Rockerverb 100 MKIII", "Orange"],
    ["Moo)))n Nrm", "Sunn Model T (normal)", "Sunn"],
    ["Moo)))n Brt", "Sunn Model T (bright)", "Sunn"],
    ["Moo)))n Jump", "Sunn Model T (jumped)", "Sunn"],
    ["Brit J45 Nrm", "Marshall JTM-45 (normal)", "Marshall"],
    ["Brit J45 Brt", "Marshall JTM-45 (bright)", "Marshall"],
    ["Brit Trem Nrm", "Marshall JTM-50 (normal)", "Marshall"],
    ["Brit Trem Brt", "Marshall JTM-50 (bright)", "Marshall"],
    ["Brit Trem Jump", "Marshall JTM-50 (jumped)", "Marshall"],
    ["Brit Plexi Nrm", "Marshall Super Lead 100 (normal)", "Marshall"],
    ["Brit Plexi Brt", "Marshall Super Lead 100 (bright)", "Marshall"],
    ["Brit Plexi Jump", "Marshall Super Lead 100 (jumped)", "Marshall"],
    ["Brit P75 Nrm", "Park 75 (normal)", "Park"],
    ["Brit P75 Brt", "Park 75 (bright)", "Park"],
    ["Brit 2203", "Marshall JCM-800 100W", "Marshall"],
    ["Brit 2204", "Marshall JCM-800 50W", "Marshall"],
    ["Placater Clean", "Friedman BE-100 (clean)", "Friedman"],
    ["Placater Dirty", "Friedman BE-100 (BE/HBE)", "Friedman"],
    ["Cartographer", "Ben Adrian Cartographer", "Ben Adrian"],
    ["German Xtra Blue", "Bogner Ecstasy 101B Blue", "Bogner"],
    ["German Xtra Red", "Bogner Ecstasy 101B Red", "Bogner"],
    ["German Mahadeva", "Bogner Shiva", "Bogner"],
    ["German Ubersonic", "Bogner Überschall", "Bogner"],
    ["Cali Texas Ch1", "Mesa Lone Star (clean)", "Mesa Boogie"],
    ["Cali Texas Ch2", "Mesa Lone Star (drive)", "Mesa Boogie"],
    ["Cali IV Rhythm 1", "Mesa Mark IV (Ch I)", "Mesa Boogie"],
    ["Cali IV Rhythm 2", "Mesa Mark IV (Ch II)", "Mesa Boogie"],
    ["Cali IV Lead", "Mesa Mark IV (lead)", "Mesa Boogie"],
    ["Cali Rectifire", "Mesa Dual Rectifier", "Mesa Boogie"],
    ["Archetype Clean", "PRS Archon (clean)", "PRS"],
    ["Archetype Lead", "PRS Archon (lead)", "PRS"],
    ["ANGL Meteor", "ENGL Fireball 100", "ENGL"],
    ["Solo Lead Clean", "Soldano SLO-100 (clean)", "Soldano"],
    ["Solo Lead Crunch", "Soldano SLO-100 (crunch)", "Soldano"],
    ["Solo Lead OD", "Soldano SLO-100 (overdrive)", "Soldano"],
    ["EV Panama Blue", "EVH 5150III 100 [6L6] Blue", "EVH"],
    ["EV Panama Red", "EVH 5150III 100 [6L6] Red", "EVH"],
    ["PV Panama", "Peavey 5150", "Peavey"],
    ["PV Vitriol Clean", "Peavey Invective (clean)", "Peavey"],
    ["PV VitriolCrunch", "Peavey Invective (crunch)", "Peavey"],
    ["PV Vitriol Lead", "Peavey Invective (lead)", "Peavey"],
    ["Revv Gen Purple", "Revv Generator 120 (purple/gain)", "Revv"],
    ["Revv Gen Red", "Revv Generator 120 (red/high gain)", "Revv"],
    ["Das Benzin Mega", "Diezel VH4 (mega)", "Diezel"],
    ["Das Benzin Lead", "Diezel VH4 (lead)", "Diezel"],
    ["Line 6 Clarity", "Line 6 Original", ""],
    ["Line 6 Aristocrat", "Line 6 Original", ""],
    ["Line 6 Carillon", "Line 6 Original", ""],
    ["Line 6 Voltage", "Line 6 Original", ""],
    ["Line 6 Kinetic", "Line 6 Original", ""],
    ["Line 6 Oblivion", "Line 6 Original", ""],
    ["Line 6 Ventoux", "Line 6 Original", ""],
    ["Line 6 Elmsley", "Line 6 Original", ""],
    ["Line 6 Elektrik", "Line 6 Original", ""],
    ["Line 6 Doom", "Line 6 Original", ""],
    ["Line 6 Epic", "Line 6 Original", ""],
    ["Line 6 2204 Mod", "Line 6 Original", ""],
    ["Line 6 Fatality", "Line 6 Original", ""],
    ["Line 6 Litigator", "Line 6 Original", ""],
    ["Line 6 Badonk", "Line 6 Original", ""],
  ],
  amp_bass: [
    ["Ampeg B-15NF", "Ampeg B-15NF Portaflex", "Ampeg"],
    ["Ampeg SVT Nrm", "Ampeg SVT (normal)", "Ampeg"],
    ["Ampeg SVT Brt", "Ampeg SVT (bright)", "Ampeg"],
    ["Ampeg SVT-4 PRO", "Ampeg SVT-4 PRO", "Ampeg"],
    ["US Dripman Nrm", "Fender Bassman (Silver Panel)", "Fender"],
    ["Woody Blue", "Acoustic 360", "Acoustic"],
    ["Agua Sledge", "Aguilar Tone Hammer", "Aguilar"],
    ["Agua 51", "Aguilar DB51", "Aguilar"],
    ["Mandarin 200", "Orange AD200 MkIII", "Orange"],
    ["Cali Bass", "Mesa M9 Carbine", "Mesa Boogie"],
    ["Cali 400 Ch1", "Mesa Bass 400+ (Ch 1)", "Mesa Boogie"],
    ["Cali 400 Ch2", "Mesa Bass 400+ (Ch 2)", "Mesa Boogie"],
    ["G Cougar 800", "Gallien-Krueger GK 800RB", "Gallien-Krueger"],
    ["Del Sol 300", "Sunn Coliseum 300", "Sunn"],
    ["Busy One Ch1", "Pearce BC-1 (Ch 1)", "Pearce"],
    ["Busy One Ch2", "Pearce BC-1 (Ch 2)", "Pearce"],
    ["Busy One Jump", "Pearce BC-1 (jumped)", "Pearce"],
    ["Studio Tube Pre", "Requisite Y7", "Requisite"],
  ],
  cab: [
    ["Soup Pro Ellipse", "Supro 1x6x9 S6616", "Supro"],
    ["1x8 Small Tweed", "Fender Champ 1x8", "Fender"],
    ["1x10 US Princess", "Fender Princeton Reverb 1x10", "Fender"],
    ["1x12 Fullerton", "Fender 5C3 Tweed Deluxe 1x12", "Fender"],
    ["1x12 Grammatico", "Grammatico LaGrange 1x12", "Grammatico"],
    ["1x12 US Deluxe", "Fender Deluxe Oxford 1x12", "Fender"],
    ["1x12 Open Cast", "Custom open-back EVM12L 1x12", "Custom"],
    ["1x12 Open Cream", "Custom open-back G12M-65 1x12", "Custom"],
    ["1x12 Cali EXT", "Mesa 1x12 Extension", "Mesa Boogie"],
    ["1x12 Cali IV", "Mesa Mark IV combo 1x12", "Mesa Boogie"],
    ["1x12 Blue Bell", "Vox AC-15 Blue Alnico 1x12", "Vox"],
    ["2x12 Blue Bell", "Vox AC-30 Fawn Blue 2x12", "Vox"],
    ["2x12 Silver Bell", "Vox AC-30TB Silver Alnico 2x12", "Vox"],
    ["2x12 Match H30", "Matchless DC-30 G12H-30 2x12", "Matchless"],
    ["2x12 Match G25", "Matchless DC-30 G12M-25 2x12", "Matchless"],
    ["2x12 Double C12N", "Fender Twin C12N 2x12", "Fender"],
    ["2x12 Interstate", "Dr Z Z Best V30 2x12", "Dr Z"],
    ["2x12 Jazz Rivet", "Roland JC-120 2x12", "Roland"],
    ["2x12 Mail C12Q", "Silvertone 1484 2x12", "Silvertone"],
    ["2x12 Mandarin 30", "Orange PPC212 V30 2x12", "Orange"],
    ["4x10 Tweed P10R", "Fender Bassman P10R 4x10", "Fender"],
    ["4x10 US Super", "Fender Super Reverb 4x10", "Fender"],
    ["4x12 WhoWatt 100", "Hiwatt AP Fane 4x12", "Hiwatt"],
    ["4x12 Greenback 25", "Marshall Basketweave G12M-25 4x12", "Marshall"],
    ["4x12 Greenback 30", "Marshall Basketweave G12H-30 4x12", "Marshall"],
    ["4x12 Greenback 20", "Marshall Basketweave G12M-20 4x12", "Marshall"],
    ["4x12 1960 T75", "Marshall 1960 AT75 4x12", "Marshall"],
    ["4x12 Blackback 30", "Park 75 G12 H30 4x12", "Park"],
    ["4x12 Brit V30", "Marshall 1960AV V30 4x12", "Marshall"],
    ["4x12 Cali V30", "Mesa 4FB V30 4x12", "Mesa Boogie"],
    ["4x12 Mandarin EM", "Orange Eminence 4x12", "Orange"],
    ["4x12 MOO)))N T75", "Sunn Cab w/G75T 4x12", "Sunn"],
    ["4x12 Cartog Guv", "Lee Jackson 4x12 Eminence Governor", "Lee Jackson"],
    ["4x12 Cartog C90", "Lee Jackson 4x12 Mesa C90", "Lee Jackson"],
    ["4x12 Uber T75", "Bogner Uberkab T75 4x12", "Bogner"],
    ["4x12 Uber V30", "Bogner Uberkab V30 4x12", "Bogner"],
    ["4x12 XXL V30", "ENGL XXL V30 4x12", "ENGL"],
    ["4x12 SoloLead EM", "Soldano SLO 4x12", "Soldano"],
    ["1x12 Epicenter", "Epifani Ultralight 1x12", "Epifani"],
    ["1x15 Ampeg B-15", "Ampeg B-15 1x15", "Ampeg"],
    ["2x15 Brute", "Mesa 2x15 EV", "Mesa Boogie"],
    ["2x15 Dripman", "Fender Bassman JBL D130 2x15", "Fender"],
    ["4x10 Garden", "Eden D410XLT 4x10", "Eden"],
    ["4x10 Ampeg Pro", "Ampeg PR-410HLF 4x10", "Ampeg"],
    ["6x10 Cali Power", "Mesa Power House 6x10", "Mesa Boogie"],
    ["8x10 SVT AV", "Ampeg SVT 810AV 8x10", "Ampeg"],
  ],
  distortion: [
    ["Kinky Boost", "Xotic EP Booster", "Xotic"],
    ["Deranged Master", "Dallas Rangemaster", "Dallas"],
    ["Minotaur", "Klon Centaur", "Klon"],
    ["Teemah!", "Paul Cochrane Timmy", "Paul Cochrane"],
    ["Heir Apparent", "Analogman Prince of Tone", "Analogman"],
    ["Tone Sovereign", "Analogman King of Tone", "Analogman"],
    ["Alpaca Rogue", "Way Huge Red Llama (modded)", "Way Huge"],
    ["Compulsive Drive", "Fulltone OCD", "Fulltone"],
    ["Dhyana Drive", "Hermida Zendrive", "Hermida"],
    ["Horizon Drive", "Horizon Precision Drive", "Horizon"],
    ["Valve Driver", "Chandler Tube Driver", "Chandler"],
    ["Top Secret OD", "DOD OD-250", "DOD"],
    ["Prize Drive", "Nobels ODR-1", "Nobels"],
    ["Scream 808", "Ibanez TS808 Tube Screamer", "Ibanez"],
    ["Pillars OD", "EQD Plumes", "Earthquaker Devices"],
    ["Hedgehog D9", "MAXON SD9", "MAXON"],
    ["Stupor OD", "Boss SD-1", "Boss"],
    ["Deez One Vintage", "Boss DS-1 (Japan)", "Boss"],
    ["Deez One Mod", "Boss DS-1 (Keeley mod)", "Boss"],
    ["Ratatouille Dist", "Pro Co RAT", "Pro Co"],
    ["Vermin Dist", "Pro Co RAT", "Pro Co"],
    ["Vital Dist", "EQD Life (distortion)", "Earthquaker Devices"],
    ["Vital Boost", "EQD Life (boost)", "Earthquaker Devices"],
    ["KWB", "Benadrian Kowloon Walled Bunny", "Benadrian"],
    ["Legendary Drive", "Carvin VLD1 Legacy (hi gain)", "Carvin"],
    ["Swedish Chainsaw", "Boss HM-2 (Japan)", "Boss"],
    ["Arbitrator Fuzz", "Arbiter FuzzFace", "Arbiter"],
    ["Pocket Fuzz", "Jordan Boss Tone Fuzz", "Jordan"],
    ["Bighorn Fuzz", "EHX '73 Ram's Head Big Muff", "Electro-Harmonix"],
    ["Triangle Fuzz", "EHX Big Muff Pi (Triangle era)", "Electro-Harmonix"],
    ["Dark Dove Fuzz", "EHX Russian Big Muff", "Electro-Harmonix"],
    ["Ballistic Fuzz", "Euthymia ICBM Fuzz", "Euthymia"],
    ["Industrial Fuzz", "Z.Vex Fuzz Factory", "Z.Vex"],
    ["Tycoctavia Fuzz", "Tycobrahe Octavia", "Tycobrahe"],
    ["Wringer Fuzz", "Modded Boss FZ-2", "Boss"],
    ["Thrifter Fuzz", "Line 6 Original", ""],
    ["Xenomorph Fuzz", "Subdecay Harmonic Antagonizer", "Subdecay"],
    ["Megaphone", "Megaphone", ""],
    ["Bitcrusher", "Line 6 Original", ""],
    ["Ampeg Scrambler", "Ampeg Scrambler Bass OD", "Ampeg"],
    ["ZeroAmp Bass DI", "Tech 21 SansAmp Bass Driver V1", "Tech 21"],
    ["Regal Bass DI", "Noble Preamp Bass DI", "Noble"],
    ["Obsidian 7000", "Darkglass Microtubes B7K Ultra", "Darkglass"],
    ["Clawthorn Drive", "Wounded Paw Battering Ram", "Wounded Paw"],
  ],
  eq: [
    ["Simple EQ", "Line 6 Original", ""],
    ["Low and High Cut", "Line 6 Original", ""],
    ["Low/High Shelf", "Line 6 Original", ""],
    ["Parametric", "Line 6 Original", ""],
    ["Tilt", "Line 6 Original", ""],
    ["10 Band Graphic", "MXR 10-Band Graphic EQ", "MXR"],
    ["Cali Q Graphic", "Mesa Mark IV Graphic EQ", "Mesa Boogie"],
    ["Acoustic Sim", "Line 6 Original", ""],
  ],
  dynamics: [
    ["Deluxe Comp", "Line 6 Original", ""],
    ["Red Squeeze", "MXR Dyna Comp", "MXR"],
    ["Kinky Comp", "Xotic SP Compressor", "Xotic"],
    ["Ampeg Opto Comp", "Ampeg Octo Comp", "Ampeg"],
    ["Rochester Comp", "Ashly CLX-52 (Sheehan signature)", "Ashly"],
    ["LA Studio Comp", "Teletronix LA-2A", "Teletronix"],
    ["3-Band Comp", "Line 6 Original", ""],
    ["Noise Gate", "Line 6 Original", ""],
    ["Hard Gate", "Line 6 Original", ""],
    ["Horizon Gate", "Horizon Precision Drive (gate)", "Horizon"],
    ["Autoswell", "Line 6 Original", ""],
    ["Feedbacker", "Line 6 Original", ""],
  ],
  reverb: [
    ["Dynamic Hall", "Line 6 Original", ""],
    ["Dynamic Plate", "Line 6 Original", ""],
    ["Dynamic Room", "Line 6 Original", ""],
    ["Dynamic Ambience", "Line 6 Original", ""],
    ["Dynamic Bloom", "Line 6 Original", ""],
    ["Shimmer", "Line 6 Original", ""],
    ["Hot Springs", "Line 6 Original", ""],
    ["Nonlinear", "Line 6 Original", ""],
    ["Glitz", "Line 6 Original", ""],
    ["Ganymede", "Line 6 Original", ""],
    ["Searchlights", "Line 6 Original", ""],
    ["Plateaux", "Line 6 Original", ""],
    ["Double Tank", "Line 6 Original", ""],
    ["Plate", "Line 6 Original (legacy plate)", ""],
    ["Room", "Line 6 Original (legacy room)", ""],
    ["Hall", "Line 6 Original (legacy hall)", ""],
    ["Spring", "Line 6 Original (legacy spring)", ""],
  ],
  modulation: [
    ["Optical Trem", "Fender Optical Tremolo", "Fender"],
    ["60s Bias Trem", "Vox AC-15 Tremolo", "Vox"],
    ["Tremolo/Autopan", "Boss PN-2", "Boss"],
    ["Harmonic Tremolo", "Line 6 Original", ""],
    ["Bleat Chop Trem", "Lightfoot Labs Goatkeeper", "Lightfoot Labs"],
    ["Script Mod Phase", "MXR Phase 90", "MXR"],
    ["Pebble Phaser", "EHX Small Stone", "Electro-Harmonix"],
    ["Ubiquitous Vibe", "Shin-ei Uni-Vibe", "Shin-ei"],
    ["FlexoVibe", "Line 6 Original", ""],
    ["Deluxe Phaser", "Line 6 Original", ""],
    ["Gray Flanger", "MXR 117 Flanger", "MXR"],
    ["Harmonic Flanger", "A/DA Flanger", "A/DA"],
    ["Courtesan Flange", "EHX Deluxe EM", "Electro-Harmonix"],
    ["Dynamix Flanger", "Line 6 Original", ""],
    ["Chorus", "Line 6 Original", ""],
    ["70s Chorus", "Boss CE-1", "Boss"],
    ["PlastiChorus", "Modded Arion SCH-Z", "Arion"],
    ["Ampeg Liquifier", "Ampeg Liquifier Chorus", "Ampeg"],
    ["Trinity Chorus", "Dytronics Tri-Stereo Chorus", "Dytronics"],
    ["4-Voice Chorus", "Line 6 Original", ""],
    ["Bubble Vibrato", "Boss VB-2 Vibrato", "Boss"],
    ["Vibe Rotary", "Fender Vibratone", "Fender"],
    ["122 Rotary", "Leslie 122", "Leslie"],
    ["145 Rotary", "Leslie 145", "Leslie"],
    ["Triple Rotary", "Yamaha RA-200", "Yamaha"],
    ["Retro Reel", "Line 6 Original", ""],
    ["Double Take", "Line 6 Original", ""],
    ["Poly Detune", "Line 6 Original", ""],
    ["AM Ring Mod", "Line 6 Original", ""],
    ["Pitch Ring Mod", "Line 6 Original", ""],
  ],
  delay: [
    ["Simple Delay", "Line 6 Original", ""],
    ["Mod/Chorus Echo", "Line 6 Original", ""],
    ["Dual Delay", "Line 6 Original", ""],
    ["Multitap 4", "Line 6 Original", ""],
    ["Multitap 6", "Line 6 Original", ""],
    ["Ping Pong", "Line 6 Original", ""],
    ["Sweep Echo", "Line 6 Original", ""],
    ["Ducked Delay", "TC Electronic 2290", "TC Electronic"],
    ["Reverse Delay", "Line 6 Original", ""],
    ["Vintage Digital", "Line 6 Original", ""],
    ["Vintage Swell", "Line 6 Original", ""],
    ["Pitch Echo", "Line 6 Original", ""],
    ["Transistor Tape", "Maestro Echoplex EP-3", "Maestro"],
    ["Cosmos Echo", "Roland RE-201 Space Echo", "Roland"],
    ["Harmony Delay", "Line 6 Original", ""],
    ["Bucket Brigade", "Boss DM-2", "Boss"],
    ["Adriatic Delay", "Boss DM-2 w/ Adrian Mod", "Boss"],
    ["Adriatic Swell", "Line 6 Original", ""],
    ["Elephant Man", "EHX Deluxe Memory Man", "Electro-Harmonix"],
    ["Multi Pass", "Line 6 Original", ""],
    ["Heliosphere", "Line 6 Original", ""],
    ["Poly Sustain", "Line 6 Original", ""],
    ["Glitch Delay", "Line 6 Original", ""],
    ["Euclidean Delay", "Line 6 Original", ""],
    ["ADT", "Line 6 Original (auto double tracker)", ""],
    ["Crisscross", "Line 6 Original", ""],
    ["Tesselator", "Line 6 Original", ""],
    ["Ratchet", "Line 6 Original", ""],
  ],
  pitch_synth: [
    ["Pitch Wham", "Digitech Whammy", "Digitech"],
    ["Twin Harmony", "Eventide H3000", "Eventide"],
    ["Simple Pitch", "Line 6 Original", ""],
    ["Dual Pitch", "Line 6 Original", ""],
    ["Boctaver", "Boss OC-2 Octaver", "Boss"],
    ["3 Note Generator", "Line 6 Original", ""],
    ["4 OSC Generator", "Line 6 Original", ""],
    ["3 OSC Synth", "Line 6 Original", ""],
    ["Poly Pitch", "Line 6 Original", ""],
    ["Poly Wham", "Line 6 Original", ""],
    ["Poly Capo", "Line 6 Original", ""],
    ["12 String", "Line 6 Original", ""],
  ],
  filter: [
    ["Mutant Filter", "Musitronics Mu-Tron III", "Musitronics"],
    ["Mystery Filter", "Korg A3", "Korg"],
    ["Autofilter", "Line 6 Original", ""],
    ["Asheville Pattrn", "Moog MF-105M MuRF", "Moog"],
  ],
  wah: [
    ["UK Wah 846", "Vox V846", "Vox"],
    ["Teardrop 310", "Dunlop Cry Baby Fasel 310", "Dunlop"],
    ["Fassel", "Dunlop Cry Baby Super", "Dunlop"],
    ["Weeper", "Arbiter Cry Baby", "Arbiter"],
    ["Chrome", "Vox V847", "Vox"],
    ["Chrome Custom", "Modded Vox V847", "Vox"],
    ["Throaty", "RMC Real McCoy 1", "RMC"],
    ["Vetta Wah", "Line 6 Original", ""],
    ["Colorful", "Colorsound Wah-fuzz", "Colorsound"],
    ["Conductor", "Maestro Boomerang", "Maestro"],
    ["Teardrop Bass Q", "Line 6 Original", ""],
  ],
  volume_pan: [
    ["Volume Pedal", "Line 6 Original", ""],
    ["Gain", "Line 6 Original", ""],
    ["Pan", "Line 6 Original", ""],
    ["Stereo Width", "Line 6 Original", ""],
    ["Stereo Imager", "Line 6 Original", ""],
  ],
  looper: [
    ["6 Switch Looper", "Line 6 Original", ""],
    ["1 Switch Looper", "Line 6 Original", ""],
    ["Shuffling Looper", "Line 6 Original", ""],
  ],
};

interface CorpusModel {
  count: number;
  blockTypes: number[];
  hasStereo: number;
  hasTrails: number;
  hasBypassvolume: number;
  exampleFiles: string[];
  params: Record<string, {
    count: number;
    types: string[];
    min?: number;
    max?: number;
    stringSamples?: string[];
  }>;
}

interface CorpusJson {
  totalModels: number;
  totalPresets: number;
  models: Record<string, CorpusModel>;
}

interface InventoryEntry {
  helixName: string;
  category: string;
  modelId: string | null;
  realWorldGear: string;
  manufacturer: string;
  verified: boolean;
  corpusCount: number;
  observedTypes: number[];
  params: Record<string, {
    type: string;
    min?: number;
    max?: number;
    booleanLikely: boolean;
  }>;
  exampleFiles: string[];
}

/**
 * Convert a Helix display name to its likely model ID by stripping
 * spaces and special chars and prepending the appropriate prefix.
 * Used for cross-referencing only — when the corpus has the actual
 * ID, we use that.
 */
function nameToCandidateModelId(helixName: string, category: string): string[] {
  const normalized = helixName.replace(/[!\s\-)]/g, "").replace(/Moo\(\(\(n/g, "Moon");
  const prefixes: Record<string, string[]> = {
    amp_guitar: ["HD2_Amp"],
    amp_bass: ["HD2_Amp"],
    cab: ["HD2_Cab", "HD2_CabMicIr_"],
    distortion: ["HD2_Dist"],
    eq: ["HD2_EQ"],
    dynamics: ["HD2_Compressor", "HD2_Gate"],
    reverb: ["HD2_Reverb", "VIC_Reverb", "VIC_"],
    modulation: ["HD2_Chorus", "HD2_Phaser", "HD2_Flanger", "HD2_Tremolo", "HD2_RotaryVibe"],
    delay: ["HD2_Delay", "VIC_Delay"],
    pitch_synth: ["HD2_Pitch", "HD2_Synth"],
    filter: ["HD2_Filter"],
    wah: ["HD2_Wah"],
    volume_pan: ["HD2_VolPan", "HD2_VolPanVol", "HD2_VolPanGain", "HD2_VolPanPan"],
    looper: ["HD2_Looper"],
  };
  return (prefixes[category] ?? ["HD2_"]).map((p) => p + normalized);
}

/**
 * Find the actual model ID in the corpus that best matches a Helix
 * display name. Tries direct candidate matches, then fuzzy substring
 * matching.
 */
function findCorpusModel(
  helixName: string,
  category: string,
  corpusModelIds: string[],
): string | null {
  const candidates = nameToCandidateModelId(helixName, category);
  for (const c of candidates) {
    if (corpusModelIds.includes(c)) return c;
  }
  // Substring match — strip non-alphanumerics from both sides
  const stripped = helixName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  if (stripped.length < 4) return null;
  for (const id of corpusModelIds) {
    if (id.toLowerCase().includes(stripped)) return id;
  }
  return null;
}

// --- Main ---
const corpus: CorpusJson = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf-8"));
const corpusModelIds = Object.keys(corpus.models);

const inventory: InventoryEntry[] = [];
const matchedModelIds = new Set<string>();

for (const [category, items] of Object.entries(OFFICIAL_LIST)) {
  for (const [helixName, realWorldGear, manufacturer] of items) {
    const modelId = findCorpusModel(helixName, category, corpusModelIds);
    if (modelId) matchedModelIds.add(modelId);
    const corpusEntry = modelId ? corpus.models[modelId] : undefined;

    const params: InventoryEntry["params"] = {};
    if (corpusEntry) {
      for (const [pname, pinfo] of Object.entries(corpusEntry.params)) {
        const types = pinfo.types;
        const booleanLikely = types.includes("boolean") || (types.length === 1 && types[0] === "integer" && pinfo.min === 0 && pinfo.max === 1);
        params[pname] = {
          type: types.includes("boolean") ? "boolean" : types.includes("string") ? "string" : types.includes("integer") ? "integer" : "number",
          min: pinfo.min,
          max: pinfo.max,
          booleanLikely,
        };
      }
    }

    inventory.push({
      helixName,
      category,
      modelId,
      realWorldGear,
      manufacturer,
      verified: !!corpusEntry,
      corpusCount: corpusEntry?.count ?? 0,
      observedTypes: corpusEntry?.blockTypes ?? [],
      params,
      exampleFiles: corpusEntry?.exampleFiles ?? [],
    });
  }
}

// Add any corpus models that didn't match anything in the official list
// (likely later-firmware additions or models we transcribed differently)
const unmatchedCorpus = corpusModelIds.filter((id) => !matchedModelIds.has(id));
for (const modelId of unmatchedCorpus) {
  const corpusEntry = corpus.models[modelId];
  // Best-effort category from prefix
  let category = "unknown";
  if (modelId.startsWith("HD2_Amp") || modelId.startsWith("VIC_Amp")) category = "amp_guitar";
  else if (modelId.startsWith("HD2_Cab") || modelId.includes("CabMicIr")) category = "cab";
  else if (modelId.startsWith("HD2_Dist")) category = "distortion";
  else if (modelId.startsWith("HD2_Compressor") || modelId.startsWith("HD2_Gate")) category = "dynamics";
  else if (modelId.startsWith("HD2_EQ")) category = "eq";
  else if (modelId.startsWith("HD2_Reverb") || modelId.startsWith("VIC_Reverb") || modelId.includes("Reverb") || modelId === "VIC_DynPlate") category = "reverb";
  else if (modelId.startsWith("HD2_Delay") || modelId.startsWith("VIC_Delay")) category = "delay";
  else if (modelId.startsWith("HD2_Chorus") || modelId.startsWith("HD2_Phaser") || modelId.startsWith("HD2_Flanger") || modelId.startsWith("HD2_Tremolo") || modelId.startsWith("HD2_RotaryVibe")) category = "modulation";
  else if (modelId.startsWith("HD2_Pitch")) category = "pitch_synth";
  else if (modelId.startsWith("HD2_Wah")) category = "wah";
  else if (modelId.startsWith("HD2_VolPan")) category = "volume_pan";
  else if (modelId.includes("Looper")) category = "looper";
  else if (modelId.includes("Filter")) category = "filter";

  // Derive likely Helix display name from the suffix
  const suffix = modelId.replace(/^HD2_(Amp|Cab|CabMicIr_|Dist|Compressor|Gate|EQ|Reverb|Delay|Chorus|Phaser|Flanger|Tremolo|RotaryVibe|Pitch|Wah|VolPan|)/, "")
                          .replace(/^VIC_/, "");
  const guessedName = suffix.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");

  const params: InventoryEntry["params"] = {};
  for (const [pname, pinfo] of Object.entries(corpusEntry.params)) {
    const types = pinfo.types;
    const booleanLikely = types.includes("boolean") || (types.length === 1 && types[0] === "integer" && pinfo.min === 0 && pinfo.max === 1);
    params[pname] = {
      type: types.includes("boolean") ? "boolean" : types.includes("string") ? "string" : types.includes("integer") ? "integer" : "number",
      min: pinfo.min,
      max: pinfo.max,
      booleanLikely,
    };
  }

  inventory.push({
    helixName: guessedName + " (corpus-only)",
    category,
    modelId,
    realWorldGear: "(unknown — verify via Line 6 model list)",
    manufacturer: "",
    verified: true,
    corpusCount: corpusEntry.count,
    observedTypes: corpusEntry.blockTypes,
    params,
    exampleFiles: corpusEntry.exampleFiles,
  });
}

// Sort: verified first (by usage count desc), then unverified (alpha)
inventory.sort((a, b) => {
  if (a.verified !== b.verified) return a.verified ? -1 : 1;
  if (a.verified) return b.corpusCount - a.corpusCount;
  return a.helixName.localeCompare(b.helixName);
});

// Stats
const stats = {
  totalEntries: inventory.length,
  verifiedFromCorpus: inventory.filter((e) => e.verified).length,
  fromOfficialListOnly: inventory.filter((e) => !e.verified && !e.helixName.includes("corpus-only")).length,
  byCategory: {} as Record<string, number>,
};
for (const e of inventory) {
  stats.byCategory[e.category] = (stats.byCategory[e.category] ?? 0) + 1;
}

const output = {
  generatedAt: new Date().toISOString(),
  source: {
    officialList: "https://line6.com/helix-models/ (transcribed 2026-04-26)",
    corpus: "data/helix-corpus/models.json (256 factory presets harvested 2026-04-26)",
  },
  stats,
  inventory,
};

fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
console.log(`\nWrote ${OUT_PATH}`);
console.log(`Total entries: ${stats.totalEntries}`);
console.log(`  Verified from corpus: ${stats.verifiedFromCorpus}`);
console.log(`  From official list only: ${stats.fromOfficialListOnly}`);
console.log(`\nBy category:`);
for (const [cat, n] of Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat.padEnd(18)} ${n}`);
}
