# HLX Preset Format: Definitive Exemplar Analysis

> Compiled from analysis of 305 .hlx preset files (256 from Helix Presets, 49 from Worship Tutorials).
> This is the authoritative reference for generating valid, production-quality HLX preset files.

---

## Table of Contents

1. [Top-Level File Structure](#section-0-top-level-file-structure)
2. [Block Type Field Rules](#section-1-block-type-field-rules)
3. [Parameter Patterns by Block Type](#section-2-parameter-patterns-by-block-type)
4. [Infrastructure Spec](#section-3-infrastructure-spec)
5. [Snapshot Spec](#section-4-snapshot-spec)
6. [Top 20 Signal Chain Patterns](#section-5-top-20-signal-chain-patterns)
7. [Settings Sweet Spots](#section-6-settings-sweet-spots)
8. [Complete Model Registry](#section-7-complete-model-registry)

---

## Section 0: Top-Level File Structure

Every .hlx file is a JSON document with this exact top-level structure:

```json
{
  "data": {
    "meta": {
      "name": "Preset Name",
      "application": "HX Edit",
      "build_sha": "",
      "modifieddate": 1775437198,
      "appversion": 58785792
    },
    "device": 2162692,
    "tone": { ... },
    "device_version": 58720256
  },
  "meta": {
    "original": 0,
    "pbn": 0,
    "premium": 0
  },
  "schema": "L6Preset",
  "version": 6
}
```

### Required Fields

| Field | Type | Value | Notes |
|-------|------|-------|-------|
| `schema` | string | `"L6Preset"` | Always this exact value |
| `version` | integer | `6` | Current format version |
| `data.device` | integer | `2162692` | Helix Floor/LT device ID |
| `data.device_version` | integer | `58720256` | Firmware version (3.80) |
| `data.meta.application` | string | `"HX Edit"` | Editor application |
| `data.meta.appversion` | integer | `58785792` | Application version |
| `data.meta.name` | string | varies | Preset display name |
| `data.meta.modifieddate` | integer | varies | Unix timestamp |
| `data.meta.build_sha` | string | `""` or hash | Build hash, often empty |
| `data.meta.original` | integer | `0` | Always 0 for user presets |
| `data.meta.pbn` | integer | `0` | Always 0 |
| `data.meta.premium` | integer | `0` | Always 0 for standard |

### Tone Object Structure

The `data.tone` object contains ALL preset data:

```
tone/
  global          - Global settings (topology, tempo, cursor)
  variax          - Variax guitar settings
  dtdual          - DT25/50 dual settings
  dt0, dt1        - DT amp channel settings
  powercabdual    - PowerCab dual settings
  powercab0, powercab1 - PowerCab channel settings
  dsp0            - DSP path 1 (always present)
  dsp1            - DSP path 2 (always present, may be empty)
  snapshot0-7     - 8 snapshot definitions
  controller      - Controller assignments (min/max/controller#)
  footswitch      - Footswitch assignments (labels, colors, indices)
  irUuidTable     - IR UUID mapping table (128 entries: "000"-"127")
```

---

## Section 1: Block Type Field Rules

### @type Values

| @type | Category | Description |
|-------|----------|-------------|
| 0 | Volume/Pan/Wah/Drive/EQ/Comp/Pitch/FX Send/Looper/Gate | Catchall for non-amp effects |
| 1 | Amp | Full amp models with tube simulation params |
| 2 | Distortion/Drive (legacy) | Rarely used in modern presets |
| 3 | Amp+Cab combo | Amp models that include integrated cab |
| 4 | Cab/IR | Cabinet and impulse response blocks |
| 5 | Delay (legacy) | Rarely seen; modern delays use @type=7 |
| 7 | Delay/Reverb | Time-based effects (delays AND reverbs) |

### CRITICAL: @type=0 is the catchall

Most effect blocks use @type=0 regardless of their actual function. This includes:
- Volume pedals (HD2_VolPanVol)
- Wah pedals (HD2_WahChrome, HD2_WahThroaty, HD2_WahUKWah846)
- Distortion/drives (HD2_DistHorizonDrive, HD2_DistTeemah, HD2_DistDerangedMaster, HD2_DistPillars)
- EQ blocks (HD2_EQParametric, HD2_EQLowCutHighCut)
- Compressors (HD2_CompressorDeluxeComp)
- Modulation (HD2_PhaserScriptModPhase, HD2_ChorusTrinityChorus, HD2_Tremolo60sBiasTrem)
- Pitch (HD2_PitchSimplePitch)
- Gate (HD2_GateHardGate)

### @type=0 (General Effects) Field Rules

| Field | Presence | Notes |
|-------|----------|-------|
| `@model` | ALWAYS | String - model identifier |
| `@type` | ALWAYS | Integer = 0 |
| `@position` | ALWAYS | Integer 0-7 (slot position on signal chain) |
| `@path` | ALWAYS | Integer 0 or 1 (path A=0, path B=1) |
| `@stereo` | ALWAYS | Boolean - mono or stereo processing |
| `@enabled` | ALWAYS | Boolean - block on/off state |
| `@no_snapshot_bypass` | ALWAYS | Boolean - usually false |
| `@trails` | NEVER | Not used for @type=0 blocks |
| `@bypassvolume` | NEVER | Not used for @type=0 blocks |
| `@cab` | NEVER | Not used for @type=0 blocks |

### @type=1 (Amp) Field Rules

| Field | Presence | Notes |
|-------|----------|-------|
| `@model` | ALWAYS | String - amp model identifier |
| `@type` | ALWAYS | Integer = 1 |
| `@position` | ALWAYS | Integer 0-7 |
| `@path` | ALWAYS | Integer 0 or 1 |
| `@enabled` | ALWAYS | Boolean |
| `@no_snapshot_bypass` | ALWAYS | Boolean - usually false |
| `@bypassvolume` | ALWAYS | Float = 1.0 (volume when amp bypassed) |
| `@stereo` | NEVER | Amps are never stereo at block level |
| `@trails` | NEVER | Not applicable to amps |
| `@cab` | NEVER | Standalone amps do not reference cabs |

### @type=3 (Amp+Cab Combo) Field Rules

| Field | Presence | Notes |
|-------|----------|-------|
| `@model` | ALWAYS | String - amp model identifier |
| `@type` | ALWAYS | Integer = 3 |
| `@position` | ALWAYS | Integer 0-7 |
| `@path` | ALWAYS | Integer 0 or 1 |
| `@enabled` | ALWAYS | Boolean |
| `@no_snapshot_bypass` | ALWAYS | Boolean |
| `@bypassvolume` | ALWAYS | Float = 1.0 |
| `@cab` | ALWAYS | String like "cab0" - references a cab definition in the DSP |
| `@stereo` | NEVER | Not present on type=3 |
| `@trails` | NEVER | Not applicable |

**Example (HD2_AmpLine6Clarity as type=3):**
```json
{
  "@model": "HD2_AmpLine6Clarity",
  "@type": 3,
  "@position": 3,
  "@path": 0,
  "@enabled": true,
  "@no_snapshot_bypass": false,
  "@bypassvolume": 1,
  "@cab": "cab0",
  "Drive": 0.38,
  "Bass": 0.72,
  "Mid": 0.38,
  "Treble": 0.35,
  "Presence": 0.09,
  "ChVol": 0.60,
  "Sag": 0.5,
  "Boost": 0,
  "HumSwitch": false
}
```

### @type=4 (Cab/IR) Field Rules

| Field | Presence | Notes |
|-------|----------|-------|
| `@model` | ALWAYS | String - cab model identifier |
| `@type` | ALWAYS | Integer = 4 |
| `@position` | ALWAYS | Integer 0-7 |
| `@path` | ALWAYS | Integer 0 or 1 |
| `@enabled` | ALWAYS | Boolean |
| `@no_snapshot_bypass` | ALWAYS | Boolean |
| `@cab` | ALWAYS | String like "cab0" - references cab definition for dual-cab |
| `@stereo` | NEVER | Not present |
| `@trails` | NEVER | Not applicable |
| `@bypassvolume` | NEVER | Not applicable |

### @type=7 (Delay/Reverb) Field Rules

| Field | Presence | Notes |
|-------|----------|-------|
| `@model` | ALWAYS | String - delay/reverb model |
| `@type` | ALWAYS | Integer = 7 |
| `@position` | ALWAYS | Integer 0-7 |
| `@path` | ALWAYS | Integer 0 or 1 |
| `@stereo` | ALWAYS | Boolean - usually true for reverbs |
| `@enabled` | ALWAYS | Boolean |
| `@no_snapshot_bypass` | ALWAYS | Boolean |
| `@trails` | ALWAYS | Boolean - spillover when switching snapshots |
| `@bypassvolume` | NEVER | Not used |
| `@cab` | NEVER | Not used |

---

## Section 2: Parameter Patterns by Block Type

### @type=0 Common Parameters (Volume/Wah/Drive/Comp/EQ/Mod)

**Volume Pedal (HD2_VolPanVol):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Pedal | float | 0.0-1.0 | 1.0 |
| VolumeTaper | bool | - | false (linear), true (audio) |

**Wah Pedals (HD2_WahChrome, HD2_WahThroaty, HD2_WahUKWah846):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Pedal | float | 0.0-1.0 | 0.0 (toe up) |
| FcLow | int | 100-1000 | 310-470 |
| FcHigh | int | 1000-3000 | 1735-2415 |
| Mix | float | 0.0-1.0 | 1.0 |
| Level | float | -120 to 20 | 0 |

**Distortion (HD2_DistHorizonDrive):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Drive | float | 0.0-1.0 | 0.0 (clean boost) |
| Bright | float | 0.0-1.0 | 0.29-0.50 |
| Level | float | 0.0-1.0 | 0.53-1.0 |
| Attack | int | 0-5 | 2-3 |
| Gate | float | 0.0-1.0 | 0.30-1.0 |
| Gate_Range | bool | - | false/true |

**Distortion (HD2_DistTeemah):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Gain | float | 0.0-1.0 | 0.41 |
| Bass | float | 0.0-1.0 | 0.59 |
| Treble | float | 0.0-1.0 | 0.67 |
| Level | float | 0.0-1.0 | 0.5 |
| Clipping | int | 0-2 | 0 |

**Distortion (HD2_DistPillars):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Gain | float | 0.0-1.0 | 0.28 |
| Tone | float | 0.0-1.0 | 0.27 |
| Level | float | 0.0-1.0 | 0.28 |
| Mode | int | 0-2 | 0 |

**EQ Parametric (HD2_EQParametric):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| LowFreq | int | 20-2000 | 110 |
| LowGain | float | -12 to 12 | -1.0 |
| LowQ | float | 0.1-10 | 1.0 |
| MidFreq | int | 200-8000 | 4000 |
| MidGain | float | -12 to 12 | -1.5 |
| MidQ | float | 0.1-10 | 2.7 |
| HighFreq | int | 2000-20000 | 6300 |
| HighGain | float | -12 to 12 | -1.9 |
| HighQ | float | 0.1-10 | 2.6 |
| LowCut | float | 19.9-2000 | 19.9 |
| HighCut | float | 2000-20100 | 20100 |
| Level | float | -12 to 12 | 0.8 |

**EQ Low/High Cut (HD2_EQLowCutHighCut):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| LowCut | float | 19.9-2000 | 140 |
| HighCut | float | 2000-20100 | 20100 |
| Level | float | -12 to 12 | 0 |

**Compressor (HD2_CompressorDeluxeComp):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Threshold | float | -60 to 0 | -39 |
| Ratio | int | 1-20 | 2 |
| Attack | float | 0.001-0.5 | 0.039 |
| Release | float | 0.01-1.0 | 0.284 |
| Knee | int | 1-30 | 6 |
| Mix | float | 0.0-1.0 | 0.75 |
| Level | float | -20 to 20 | 7 |

**Gate (HD2_GateHardGate):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| OpenThreshold | float | -90 to 0 | -40 |
| CloseThreshold | float | -90 to 0 | -40 |
| Decay | float | 0.0-5.0 | 0.01 |
| HoldTime | float | 0.0-5.0 | 0.01 |
| Level | float | -120 to 20 | 0 |

**Chorus (HD2_ChorusTrinityChorus):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Left | float | 0.0-1.0 | 0.46 |
| Center | float | 0.0-1.0 | 0.26 |
| Right | float | 0.0-1.0 | 0.47 |
| Rate | float | 0.0-1.0 | 0.33 |
| Mix | float | 0.0-1.0 | 0.5 |
| Level | float | -120 to 20 | -2.5 |
| Mode | bool | - | true |
| Manual | bool | - | true |
| Preset | bool | - | true |
| TempoSync1 | bool | - | true |
| SyncSelect1 | int | 0-15 | 1 |
| LeftBoost | bool | - | false |
| CenterBoost | bool | - | false |
| RightBoost | bool | - | false |

**Tremolo (HD2_Tremolo60sBiasTrem):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Intensity | float | 0.0-1.0 | 0.61 |
| Speed | float | 0.0-1.0 | 0.33 |
| Level | float | -120 to 20 | 3.5 |
| Mode | bool | - | false |
| Spread | float | 0.0-1.0 | 0 |
| TempoSync1 | bool | - | true |
| SyncSelect1 | int | 0-15 | 10 |

**Phaser (HD2_PhaserScriptModPhase):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Rate | float | 0.0-1.0 | 0.19 |
| Mix | float | 0.0-1.0 | 0.60 |
| Level | float | -120 to 20 | 2.5 |
| Spread | float | 0.0-1.0 | 0 |
| TempoSync1 | bool | - | true |
| SyncSelect1 | int | 0-15 | 1 |

**Pitch (HD2_PitchSimplePitch):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Interval1 | int | -24 to 24 | -12 |
| Cents1 | int | -50 to 50 | 0 |
| LevelVoice1 | float | 0.0-1.0 | 1.0 |
| Time1 | float | 0.0-1.0 | 0 |
| Mix | float | 0.0-1.0 | 0.43 |
| Level | float | -120 to 20 | 0 |
| PanDry | float | 0.0-1.0 | 0.5 |
| PanVoice1 | float | 0.0-1.0 | 0.45 |

### @type=1 / @type=3 (Amp) Common Parameters

All amp models share these core parameters:

| Parameter | Type | Range | Typical | Notes |
|-----------|------|-------|---------|-------|
| Drive | float | 0.0-1.0 | 0.38-0.65 | Input gain |
| Bass | float | 0.0-1.0 | 0.28-0.68 | Low EQ |
| Mid | float | 0.0-1.0 | 0.38-0.56 | Mid EQ |
| Treble | float | 0.0-1.0 | 0.35-0.78 | High EQ |
| Presence | float | 0.0-1.0 | 0.0-0.50 | High-frequency presence |
| Master | float | 0.0-1.0 | 0.30-1.0 | Power amp volume |
| ChVol | float | 0.0-1.0 | 0.57-0.83 | Channel volume (final output) |
| Sag | float | 0.0-1.0 | 0.5 | Power supply sag |
| Hum | float | 0.0-1.0 | 0.0-0.5 | 60-cycle hum amount |
| Ripple | float | 0.0-1.0 | 0.5-0.67 | Power supply ripple |
| Bias | float | 0.0-1.0 | 0.1-1.0 | Tube bias setting |
| BiasX | float | 0.0-1.0 | 0.5 | Tube bias crossover |
| Depth | float | 0.0-1.0 | 0.46-0.55 | Power amp depth (NOT on all models) |
| BrightSW | bool | - | true/false | Bright switch (NOT on all models) |
| Cut | float | 0.0-1.0 | 0.61 | Cut control (Vox-type amps only) |
| Boost | float | 0.0-1.0 | 0-0.4 | Boost control (specific models) |
| HumSwitch | bool | - | false | Hum on/off (specific models) |

### @type=4 (Cab/IR) Parameters

| Parameter | Type | Range | Typical | Notes |
|-----------|------|-------|---------|-------|
| Position | float | 0.0-1.0 | 0.17-0.29 | Mic position |
| Distance | float | 1-5 | 1-3 | Mic distance |
| Angle | int | 0-45 | 0 or 45 | Mic angle |
| Mic | int | 0-16 | 0 (57 Dyn), 3 (421 Dyn), 5 (67 Cond), 9 (160 Ribbon), 10 (4038 Ribbon) | Mic model index |
| LowCut | float | 19.9-2000 | 19.9-90 | Low cut frequency |
| HighCut | float | 2000-20100 | 5000-12000 | High cut frequency |
| Level | float | -20 to 20 | 0 | Output level |
| Delay | float | 0.0-0.001 | 0 | Time alignment delay |
| Pan | float | 0.0-1.0 | 0.5 | Stereo position |

### @type=7 (Reverb) Parameters

**Dynamic Ambience (VIC_ReverbDynAmbience) -- MOST COMMON REVERB:**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Mix | float | 0.0-1.0 | 0.26-0.32 |
| Decay (via PreDelay) | float | 0.001-1.0 | 0.005 |
| Diffusion | float | 0.0-1.0 | 0.5 |
| LowCut | int | 19-2000 | 100 |
| HighCut | int | 2000-20100 | 10000 |
| RoomSize | int | 0-1 | 0 (small) or 1 (large) |
| Damping | int | 500-20000 | 5000 |
| Level | float | -120 to 20 | 0 |
| EarlyLateBlend | float | 0.0-1.0 | 0.5 |
| PreDelay | float | 0.0-1.0 | 0.005 |

**Dynamic Room (VIC_ReverbDynRoom):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Mix | float | 0.0-1.0 | 0.21 |
| Decay | float | 0.1-5.0 | 0.6 |
| Diffusion | float | 0.0-1.0 | 0.5 |
| LowCut | int | 19-2000 | 100 |
| HighCut | int | 2000-20100 | 10000 |
| Damping | int | 500-20000 | 3720 |
| Level | float | -120 to 20 | 0 |
| BassFreq | int | 50-500 | 100 |
| BassBoost | float | -12 to 12 | 0 |
| ERLevel | float | 0.0-1.0 | 0.8 |
| MatrFreq | float | 0.0-1.0 | 0.333 |
| PreDelay | float | 0.0-1.0 | 0.01 |

**Rotating Speaker Reverb (VIC_ReverbRotating):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Mix | float | 0.0-1.0 | 0.22 |
| Decay | float | 0.1-10.0 | 1.6 |
| RoomSize | int | 0-1 | 1 |
| Diffusion | float | 0.0-1.0 | 0.7 |
| Damping | int | 500-20000 | 3720 |
| LowCut | int | 19-2000 | 117 |
| HighCut | int | 2000-20100 | 6300 |
| BassFreq | int | 50-500 | 100 |
| BassBoost | float | -12 to 12 | 0 |
| Motion | float | 0.0-1.0 | 0.17 |
| Level | float | -120 to 20 | 0 |
| Predelay | float | 0.0-1.0 | 0.05 |

### @type=7 (Delay) Parameters

**Simple Delay (HD2_DelaySimpleDelay):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Time | float | 0.01-4.0 | 0.60 |
| Feedback | float | 0.0-1.0 | 0.30 |
| Mix | float | 0.0-1.0 | 0.27 |
| Level | float | -120 to 20 | 0 |
| Scale | float | 0.0-1.0 | 0.75 |
| TempoSync1 | bool | - | true |
| SyncSelect1 | int | 0-15 | 6 (dotted 8th) |

**Adriatic Delay (HD2_DelayAdriaticDelay):**
| Parameter | Type | Range | Typical |
|-----------|------|-------|---------|
| Time | float | 0.01-4.0 | 0.5 |
| Feedback | float | 0.0-1.0 | 0.36 |
| Mix | float | 0.0-1.0 | 0.27 |
| Level | float | -120 to 20 | 0 |
| Depth | float | 0.0-1.0 | 0.22 |
| Rate | float | 0.0-1.0 | 0.35 |
| Noise | float | 0.0-1.0 | 0.36 |
| Spread | float | 0.0-1.0 | 0.5 |
| Headroom | int | 0-24 | 12 |
| Scale | float | 0.0-1.0 | 1.0 |
| BBD Size | int | 0-3 | 2 |
| TempoSync1 | bool | - | true |
| SyncSelect1 | int | 0-15 | 6 |

---

## Section 3: Infrastructure Spec

### inputA (Path A Input)

Present in EVERY DSP. Structure is always:

```json
{
  "@input": 1,
  "@model": "HD2_AppDSPFlow1Input",
  "noiseGate": true,
  "decay": 0.15,
  "threshold": -75
}
```

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| `@input` | int | 0 or 1 | 1 = Guitar input (dsp0), 0 = no input / from other DSP |
| `@model` | string | `"HD2_AppDSPFlow1Input"` | Always this exact value |
| `noiseGate` | bool | true/false | Enable noise gate on input |
| `decay` | float | 0.01-0.5 | Gate release time. Typical: 0.03-0.15 |
| `threshold` | float | -90 to 0 | Gate threshold in dB. Typical: -48 to -75 |

**Key rule:** For dsp0, `@input` is typically 1 (guitar). For dsp1, `@input` is typically 0 (from DSP0 or no direct input).

### inputB (Path B Input)

```json
{
  "@input": 0,
  "@model": "HD2_AppDSPFlow2Input",
  "noiseGate": false,
  "decay": 0.5,
  "threshold": -48
}
```

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| `@input` | int | 0 | Always 0 for path B |
| `@model` | string | `"HD2_AppDSPFlow2Input"` | Always this value |
| `noiseGate` | bool | false | Almost always false |
| `decay` | float | 0.5 | Default value |
| `threshold` | float | -48 | Default value |

### outputA (Path A Output)

```json
{
  "@model": "HD2_AppDSPFlowOutput",
  "@output": 1,
  "pan": 0.5,
  "gain": 0
}
```

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| `@model` | string | `"HD2_AppDSPFlowOutput"` | Always this value |
| `@output` | int | 0 or 1 | 1 = main output (typical for dsp0 path A) |
| `pan` | float | 0.0-1.0 | 0.5 = center |
| `gain` | float | -120 to 20 | Output level. Usually 0 |

### outputB (Path B Output)

```json
{
  "@model": "HD2_AppDSPFlowOutput",
  "@output": 0,
  "pan": 0.5,
  "gain": 0
}
```

Same structure as outputA. `@output` is typically 0 for path B.

### split (Signal Splitter)

**Y Split (most common, ~90%+):**
```json
{
  "@model": "HD2_AppDSPFlowSplitY",
  "@position": 0,
  "@enabled": true,
  "@no_snapshot_bypass": false,
  "BalanceA": 0.5,
  "BalanceB": 0.5,
  "bypass": false
}
```

**A/B Split (for parallel routing):**
```json
{
  "@model": "HD2_AppDSPFlowSplitAB",
  "@position": 0,
  "@enabled": true,
  "@no_snapshot_bypass": false,
  "RouteTo": 0.5,
  "bypass": false
}
```

| Split Model | Parameters | Usage |
|-------------|-----------|-------|
| `HD2_AppDSPFlowSplitY` | BalanceA (0-1), BalanceB (0-1), bypass (bool) | Default; signal goes to both paths |
| `HD2_AppDSPFlowSplitAB` | RouteTo (0-1), bypass (bool) | Signal routed A or B or blend |

**Key rules:**
- `@position` is ALWAYS 0 for splits
- `@enabled` is ALWAYS true
- `bypass` (lowercase, NOT @bypass) is typically false

### join (Signal Merger)

```json
{
  "@model": "HD2_AppDSPFlowJoin",
  "@position": 8,
  "@enabled": true,
  "@no_snapshot_bypass": false,
  "A Pan": 0.5,
  "B Pan": 0.5,
  "A Level": 0,
  "B Level": 0,
  "Level": 0,
  "B Polarity": false
}
```

| Field | Type | Range | Default | Notes |
|-------|------|-------|---------|-------|
| `@model` | string | - | `"HD2_AppDSPFlowJoin"` | Always this value |
| `@position` | int | - | 8 | ALWAYS 8 |
| `@enabled` | bool | - | true | ALWAYS true |
| `@no_snapshot_bypass` | bool | - | false | Usually false |
| `A Pan` | float | 0.0-1.0 | 0.5 | Path A pan position |
| `B Pan` | float | 0.0-1.0 | 0.5 | Path B pan position |
| `A Level` | float | -120 to 20 | 0 | Path A level in dB |
| `B Level` | float | -120 to 20 | 0 | Path B level in dB |
| `Level` | float | -120 to 20 | 0 | Overall join level in dB |
| `B Polarity` | bool | - | false | Invert path B phase |

**Critical note:** The join Level can be used as a master volume. The Bethel preset uses Level: -10 in snapshot controllers for volume management.

### cab0 (Cab Reference Block)

When a block has `@cab: "cab0"`, there must be a corresponding `cab0` entry in the same DSP:

```json
{
  "@model": "HD2_CabMicIr_4x12CaliV30WithPan",
  "@enabled": true,
  "Level": 0,
  "LowCut": 19.9,
  "HighCut": 12000,
  "Mic": 10,
  "Angle": 45,
  "Position": 0.17,
  "Distance": 1,
  "Delay": 0.00002,
  "Pan": 0.5
}
```

This is the SECOND microphone for dual-cab setups. The main cab block (@type=4) has the first mic, and cab0 provides the second mic for blending.

---

## Section 4: Snapshot Spec

Each preset has exactly 8 snapshots (snapshot0 through snapshot7).

### Snapshot Structure

```json
{
  "@name": "SNAPSHOT 1",
  "@tempo": 120,
  "@valid": true,
  "@pedalstate": 2,
  "@ledcolor": 0,
  "@custom_name": false,
  "blocks": {
    "dsp0": {
      "block0": true,
      "block1": true,
      "block2": false,
      ...
    },
    "dsp1": {
      "block0": true,
      ...
    }
  },
  "controllers": {
    "dsp0": {
      "block1": {
        "Pedal": {
          "@fs_enabled": false,
          "@value": 1
        }
      }
    }
  }
}
```

### Snapshot Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `@name` | string | YES | Display name. Default: "SNAPSHOT 1" through "SNAPSHOT 8" |
| `@tempo` | float | YES | Tempo for this snapshot. Usually matches global tempo |
| `@valid` | bool | YES | ALWAYS true |
| `@pedalstate` | int | YES | ALWAYS 2 |
| `@ledcolor` | int | YES | LED color code. 0 = default. Custom colors seen: 8, etc. |
| `@custom_name` | bool | YES | true if user renamed from default |
| `blocks` | object | YES | Block enable states per DSP |
| `controllers` | object | YES | Parameter snapshots for controlled params |

### Snapshot Blocks

The `blocks` object mirrors each DSP, with each block key mapped to a boolean (enabled/disabled state for that snapshot):

```json
"blocks": {
  "dsp0": {
    "block0": false,    // Wah OFF in this snapshot
    "block1": true,     // Volume ON
    "block2": true,     // Amp ON
    "block3": true,     // Cab ON
    "block4": false,    // Chorus OFF
    "block5": false,    // Delay OFF
    "block6": true      // Reverb ON
  }
}
```

**Important:** The `split` key can also appear as a boolean in snapshot blocks (e.g., `"split": true`).

### Snapshot Controllers

Controllers in snapshots capture the value of any parameter assigned to a snapshot controller:

```json
"controllers": {
  "dsp0": {
    "block1": {
      "Pedal": {
        "@fs_enabled": false,
        "@value": 1
      }
    },
    "block6": {
      "Decay": {
        "@fs_enabled": false,
        "@value": 1.1
      },
      "Mix": {
        "@fs_enabled": false,
        "@value": 0.33
      }
    }
  }
}
```

Each controlled parameter has:
- `@fs_enabled` (bool): Footswitch enable state for this snapshot. Usually false.
- `@value` (float): The parameter value for this snapshot.

### Controller Definitions (Top Level)

Separate from snapshots, the `controller` object at the tone level defines the control source:

```json
"controller": {
  "dsp0": {
    "block1": {
      "Pedal": {
        "@min": 0,
        "@max": 1,
        "@controller": 2,
        "@snapshot_disable": false
      }
    }
  }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `@min` | float | Minimum controller value |
| `@max` | float | Maximum controller value |
| `@controller` | int | Controller source: 1=EXP1, 2=EXP2, 19=Snapshot |
| `@snapshot_disable` | bool | If true, snapshots don't override this |

### Footswitch Definitions

```json
"footswitch": {
  "dsp0": {
    "block0": {
      "@fs_label": "Chrome",
      "@fs_enabled": false,
      "@fs_index": 13,
      "@fs_ledcolor": 196619,
      "@fs_primary": true,
      "@fs_momentary": false
    }
  }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `@fs_label` | string | Display name on footswitch |
| `@fs_enabled` | bool | Default enabled state |
| `@fs_index` | int | Footswitch number (8-11 = FS1-4, 13 = EXP toe) |
| `@fs_ledcolor` | int | LED color as integer |
| `@fs_primary` | bool | Usually true |
| `@fs_momentary` | bool | Momentary (hold) vs. toggle |
| `@fs_customlabel` | string | Optional custom label |

Common LED colors:
- 196619 = Blue (Wah)
- 65408 = Yellow-Green (Volume)
- 525824 = Green (Drive)
- 13676288 = Orange (Overdrive)
- 1037 = Cyan (Modulation)
- 67840 = Blue-Green (Delay)
- 16723200 = Magenta (Reverb)
- 8716032 = Purple (EQ)

---

## Section 5: Top 20 Signal Chain Patterns

Based on analysis of block positions across all presets, sorted by frequency:

### Type-Based Patterns (by block category)

1. **Wah > Vol > Amp > Cab > Reverb** (simplest clean tone)
   - @type=0 > @type=0 > @type=1 > @type=4 > @type=7

2. **Wah > Vol > Amp > Cab > Delay > Reverb** (standard with delay)
   - @type=0 > @type=0 > @type=1 > @type=4 > @type=7 > @type=7

3. **Wah > Vol > Drive > Amp > Cab > Delay > Reverb** (full chain with drive)
   - @type=0 > @type=0 > @type=0 > @type=1 > @type=4 > @type=7 > @type=7

4. **Drive > Vol > Amp > EQ > Cab > Reverb** (sculpted tone)
   - @type=0 > @type=0 > @type=1 > @type=0 > @type=4 > @type=7

5. **Comp > Drive > Amp > Cab > Mod > Delay > Reverb** (worship full chain)
   - @type=0 > @type=0 > @type=1 > @type=4 > @type=0 > @type=7 > @type=7

6. **Drive > EQ > Amp > Cab > Vol** (high-gain rhythm, no time effects)
   - @type=0 > @type=0 > @type=1 > @type=4 > @type=0

7. **Wah > Drive > Amp+Cab > Mod > Delay > Reverb** (combo amp chain)
   - @type=0 > @type=0 > @type=3 > @type=0 > @type=7 > @type=7

8. **Comp > Pitch > Drive > Gate > Amp > Cab > Vol** (djent/metal)
   - @type=0 > @type=0 > @type=0 > @type=0 > @type=1 > @type=4 > @type=0

### Model-Based Top Signal Chains

1. **HD2_WahChrome > HD2_VolPanVol > HD2_AmpArchetypeClean > HD2_CabMicIr_2x12Mandarin > HD2_ChorusTrinityChorus > HD2_DelayAdriaticDelay > VIC_ReverbRotating**

2. **HD2_WahThroaty > HD2_DistHorizonDrive > HD2_AmpArchetypeLead > HD2_VolPanVol > HD2_CabMicIr_4x12CaliV30 > HD2_DelaySimpleDelay > VIC_ReverbDynAmbience**

3. **HD2_WahUKWah846 > HD2_VolPanVol > HD2_DistTeemah > HD2_PhaserScriptModPhase > HD2_AmpBritPlexiBrt > HD2_CabMicIr_4x12Greenback25 > VIC_ReverbDynAmbience**

4. **HD2_DistHorizonDrive > HD2_EQLowCutHighCut > HD2_AmpCaliRectifire > HD2_EQParametric > HD2_VolPanVol > HD2_CabMicIr_4x12CaliV30 > VIC_ReverbDynAmbience**

5. **HD2_WahUKWah846 > HD2_VolPanVol > HD2_DistDerangedMaster > HD2_AmpEssexA30 > HD2_Tremolo60sBiasTrem > HD2_CabMicIr_2x12SilverBell > VIC_ReverbDynRoom**

### Key Signal Chain Rules

1. **Wah/Volume ALWAYS first** (positions 0-1)
2. **Drive/Comp before Amp** (positions 1-3)
3. **Amp is always the core** (positions 2-4, never at edges)
4. **Cab immediately after Amp** (position = amp_position + 1)
5. **Modulation after Cab** (position = cab_position + 1)
6. **Delay before Reverb** (delay position < reverb position)
7. **Reverb is always last** (highest position number)
8. **Volume pedal** can be pre-amp (position 1) or post-cab (position 5-6)

---

## Section 6: Settings Sweet Spots

### Global Settings

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| `@model` | string | `"@global_params"` | Always this |
| `@topology0` | string | `"A"`, `"SABJ"` | A = serial, SABJ = parallel A/B |
| `@topology1` | string | `"A"`, `"SABJ"` | Same for DSP1 |
| `@tempo` | float | 40-240 | Default 120. Worship: 70-130 |
| `@current_snapshot` | int | 0-7 | Active snapshot index |
| `@cursor_dsp` | int | 0 or 1 | Which DSP is selected |
| `@cursor_path` | int | 0 or 1 | Path A (0) or B (1) |
| `@cursor_group` | string | "block0"-"block15" | Selected block |
| `@cursor_position` | int | 0-7 | Selected position |
| `@guitarpad` | int | 0 | 0 = off, 1 = -6dB pad |
| `@guitarinputZ` | int | 0 | 0 = auto impedance |
| `@pedalstate` | int | 2 | Always 2 |
| `@PowercabMode` | int | 0 | PowerCab mode |
| `@PowercabVoicing` | int | 0 | PowerCab voicing |
| `@PowercabSelect` | int | 2 | PowerCab selection |
| `@DtSelect` | int | 0 or 2 | DT amp selection |

**Topology distribution:**
- `"A"/"A"`: ~85% of presets (simple serial routing)
- `"SABJ"/"SABJ"`: ~10% (parallel A/B routing, worship/complex)
- `"A"/"SABJ"` or `"SABJ"/"A"`: ~5% (mixed)

### Top Amp Sweet Spots

#### HD2_AmpArchetypeClean (Clean Foundation)
| Parameter | Sweet Spot | Range Seen |
|-----------|-----------|------------|
| Drive | 0.51 | 0.30-0.65 |
| Bass | 0.43 | 0.30-0.60 |
| Mid | 0.38 | 0.25-0.50 |
| Treble | 0.44 | 0.35-0.55 |
| Presence | 0.37 | 0.20-0.50 |
| Master | 0.67 | 0.50-0.85 |
| ChVol | 0.57 | 0.45-0.70 |
| Sag | 0.50 | 0.50 |
| Hum | 0.50 | 0.50 |
| Bias | 1.00 | 1.00 |
| BiasX | 0.50 | 0.50 |
| Ripple | 0.50 | 0.50 |
| Depth | 0.55 | 0.50-0.60 |
| BrightSW | true | true/false |

#### HD2_AmpArchetypeLead (Lead/Crunch)
| Parameter | Sweet Spot | Range Seen |
|-----------|-----------|------------|
| Drive | 0.55 | 0.40-0.70 |
| Bass | 0.50 | 0.35-0.65 |
| Mid | 0.46 | 0.35-0.55 |
| Treble | 0.58 | 0.45-0.70 |
| Presence | 0.31 | 0.20-0.45 |
| Master | 0.54 | 0.40-0.70 |
| ChVol | 0.83 | 0.65-0.95 |

#### HD2_AmpBritPlexiBrt (Marshall Plexi Bright)
| Parameter | Sweet Spot | Range Seen |
|-----------|-----------|------------|
| Drive | 0.64 | 0.45-0.80 |
| Bass | 0.44 | 0.30-0.60 |
| Mid | 0.56 | 0.40-0.70 |
| Treble | 0.78 | 0.60-0.90 |
| Presence | 0.50 | 0.30-0.70 |
| Master | 1.00 | 0.70-1.00 |
| ChVol | 0.67 | 0.50-0.80 |
| Bias | 0.70 | 0.50-0.90 |

#### HD2_AmpEssexA30 (Vox AC30)
| Parameter | Sweet Spot | Range Seen |
|-----------|-----------|------------|
| Drive | 0.45 | 0.30-0.65 |
| Bass | 0.68 | 0.50-0.80 |
| Treble | 0.60 | 0.45-0.75 |
| Cut | 0.61 | 0.40-0.80 |
| Presence | 0.00 | 0.00 (AC30 has Cut instead) |
| Master | 1.00 | 0.80-1.00 |
| ChVol | 0.77 | 0.60-0.90 |
| Hum | 0.00 | 0.00 |
| Bias | 0.58 | 0.40-0.70 |
| BiasX | 0.58 | 0.50-0.70 |
| Ripple | 0.67 | 0.50-0.80 |
| Sag | 0.71 | 0.50-0.80 |

#### HD2_AmpCaliRectifire (Mesa Rectifier)
| Parameter | Sweet Spot | Range Seen |
|-----------|-----------|------------|
| Drive | 0.65 | 0.50-0.80 |
| Bass | 0.28 | 0.15-0.45 |
| Mid | 0.50 | 0.35-0.65 |
| Treble | 0.38 | 0.25-0.55 |
| Presence | 0.38 | 0.25-0.50 |
| Master | 0.30 | 0.20-0.50 |
| ChVol | 0.72 | 0.55-0.85 |
| Bias | 0.10 | 0.05-0.25 |
| Hum | 0.27 | 0.10-0.40 |

#### HD2_AmpLine6Clarity (Line 6 Clarity -- Worship Favorite)
| Parameter | Sweet Spot | Range Seen |
|-----------|-----------|------------|
| Drive | 0.38 | 0.25-0.55 |
| Bass | 0.72 | 0.55-0.85 |
| Mid | 0.38 | 0.25-0.55 |
| Treble | 0.35 | 0.20-0.50 |
| Presence | 0.09 | 0.00-0.20 |
| ChVol | 0.60 | 0.45-0.75 |
| Sag | 0.50 | 0.50 |
| Boost | 0.00-0.40 | 0.00 (clean) to 0.40 (driven snapshot) |
| HumSwitch | false | false |

### Top Cab/IR Sweet Spots

#### HD2_CabMicIr_4x12CaliV30WithPan (Mesa 4x12 V30)
| Parameter | Sweet Spot |
|-----------|-----------|
| Mic | 0 (57 Dyn) primary, 10 (4038 Ribbon) secondary |
| Position | 0.17-0.29 |
| Distance | 1-2 |
| Angle | 0 or 45 |
| LowCut | 19.9 (off) |
| HighCut | 12000 |
| Level | 0 to 1 |

#### HD2_CabMicIr_4x12Greenback25WithPan (Marshall 4x12 Greenback)
| Parameter | Sweet Spot |
|-----------|-----------|
| Mic | 0 (57 Dyn) primary, 5 (67 Cond) secondary |
| Position | 0.20-0.26 |
| Distance | 2-3 |
| Angle | 0 or 45 |
| LowCut | 80 |
| HighCut | 12000 |

#### HD2_CabMicIr_2x12MandarinWithPan (Orange 2x12)
| Parameter | Sweet Spot |
|-----------|-----------|
| Mic | 0 (57 Dyn) |
| Position | 0.23 |
| Distance | 1 |
| Angle | 0 or 45 |
| LowCut | 79-80 |
| HighCut | 12000 |

#### HD2_CabMicIr_2x12SilverBellWithPan (Vox 2x12)
| Parameter | Sweet Spot |
|-----------|-----------|
| Mic | 0 (57 Dyn) primary, 9 (160 Ribbon) secondary |
| Position | 0.24-0.45 |
| Distance | 1.25-2.25 |
| Angle | 0 |
| LowCut | 90 |
| HighCut | 5000 |

### Top Reverb Sweet Spots

#### VIC_ReverbDynAmbience (Most Used Reverb)
| Parameter | Sweet Spot |
|-----------|-----------|
| Mix | 0.26-0.32 |
| PreDelay | 0.005 |
| RoomSize | 0 (small) |
| Diffusion | 0.5 |
| Damping | 5000 |
| LowCut | 100 |
| HighCut | 10000 |
| EarlyLateBlend | 0.5 |
| Level | 0 |

---

## Section 7: Complete Model Registry

### Amp Models (@type=1)

| Model ID | Based On | Common Pairing |
|----------|----------|----------------|
| HD2_AmpArchetypeClean | Line 6 Original | 2x12 Mandarin |
| HD2_AmpArchetypeLead | Line 6 Original | 4x12 Cali V30 |
| HD2_AmpBritPlexiBrt | Marshall Plexi Bright | 4x12 Greenback25 |
| HD2_AmpBritPlexiNrm | Marshall Plexi Normal | 4x12 Greenback25 |
| HD2_AmpBrit2203 | Marshall JCM800 | 4x12 Greenback25 |
| HD2_AmpEssexA30 | Vox AC30 | 2x12 SilverBell |
| HD2_AmpA30FawnNrm | Vox AC30 Fawn Normal | 2x12 SilverBell |
| HD2_AmpCaliRectifire | Mesa Rectifier | 4x12 Cali V30 |
| HD2_AmpCaliIVRhythm1 | Mesa Mark IV | 4x12 Cali V30 |
| HD2_AmpCaliTexasCh1 | Mesa Lonestar Ch1 | 1x12 or 2x12 |
| HD2_AmpUSDoubleNrm | Fender Twin Normal | 2x12 |
| HD2_AmpUSDeluxeNrm | Fender Deluxe Normal | 1x12 |
| HD2_AmpUSPrincess | Fender Princeton | 1x10 |
| HD2_AmpTweedBluesBrt | Fender Bassman | 4x10 |
| HD2_AmpLine6Litigator | Line 6 Original | Various |
| HD2_AmpLine6Clarity | Line 6 Original | Various |
| HD2_AmpLine6Elmsley | Line 6 Original | Various |
| HD2_AmpLine6Ventoux | Line 6 Original | Various |
| HD2_AmpRevvGenPurple | Revv Generator Purple | 4x12 |
| HD2_AmpRevvGenRed | Revv Generator Red | 4x12 |
| HD2_AmpDasBenzinMega | Diezel VH4 Mega | 4x12 |
| HD2_AmpPlacaterDirty | Friedman BE Dirty | 4x12 |
| HD2_AmpPVPanama | PV 5150 | 4x12 |
| HD2_AmpPVVitriolLead | PV 6505+ Lead | 4x12 |
| HD2_AmpGrammaticoGSG | Grammatico GSG | 1x12 |
| HD2_AmpGrammaticoLGNrm | Grammatico LG Normal | 1x12 |
| HD2_AmpMatchstickCh1 | Matchless Ch1 | 1x12 or 2x12 |
| HD2_AmpDerailedIngrid | Trainwreck | 1x12 |
| HD2_AmpJazzRivet120 | Roland JC-120 | 2x12 |
| HD2_AmpMailOrderTwin | Fender Twin mail order | 2x12 |
| HD2_AmpMandarinRocker | Orange Rockerverb | 2x12 Mandarin |
| HD2_AmpCartographer | Line 6 Original | Various |
| HD2_AmpLine6Badonk | Line 6 Original | 4x12 |
| HD2_AmpUSAmericanDripN | Fender American Drip Norm | 1x12 |
| HD2_AmpMandarin80 | Orange OR80 | 2x12 Mandarin |

### Bass Amp Models (@type=1)

| Model ID | Based On |
|----------|----------|
| HD2_AmpSVTNrm | Ampeg SVT Normal |
| HD2_AmpSVT4Pro | Ampeg SVT-4 PRO |
| HD2_AmpCaliBass | Mesa Bass 400 |
| HD2_AmpCali400Ch1 | Mesa Cali 400 Ch1 |
| HD2_AmpAgua51 | Aguilar DB 751 |
| HD2_AmpAguaSledge | Aguilar AG 500 |
| HD2_AmpCougar800 | Cougar 800 |
| HD2_AmpDelSol300 | Sunn 300T |

### Drive/Distortion Models (@type=0)

| Model ID | Based On |
|----------|----------|
| HD2_DistHorizonDrive | Horizon Precision Drive |
| HD2_DistTeemah | Paul Cochrane Timmy |
| HD2_DistDerangedMaster | Dallas Rangemaster |
| HD2_DistPillars | DOD 250 |
| HD2_DistKWB | Klon KTR |
| HD2_DistMinotaur | Ibanez TS808 |
| HD2_DistScreamDrive | Ibanez TS9 |

### Reverb Models (@type=7)

| Model ID | Based On |
|----------|----------|
| VIC_ReverbDynAmbience | Dynamic Ambience |
| VIC_ReverbDynRoom | Dynamic Room |
| VIC_ReverbRotating | Rotating Speaker Hall |
| VIC_ReverbDynHall | Dynamic Hall |
| HD2_ReverbPlateaux | Plateaux |
| HD2_ReverbSearchlights | Searchlights |
| HD2_ReverbGlitz | Glitz |

### Delay Models (@type=7)

| Model ID | Based On |
|----------|----------|
| HD2_DelaySimpleDelay | Simple Delay |
| HD2_DelayAdriaticDelay | Adriatic Delay |
| HD2_DelayTransistorTape | Transistor Tape |
| HD2_DelayMultipass | Multipass |
| HD2_DelayDualDelay | Dual Delay |
| HD2_DelayBucketBrigade | MXR Carbon Copy |

### Cab Models (@type=4)

| Model ID | Based On |
|----------|----------|
| HD2_CabMicIr_4x12CaliV30WithPan | Mesa 4x12 with Vintage 30 |
| HD2_CabMicIr_4x12Greenback25WithPan | Marshall 4x12 with Greenback 25W |
| HD2_CabMicIr_2x12MandarinWithPan | Orange 2x12 |
| HD2_CabMicIr_2x12SilverBellWithPan | Vox 2x12 Silver Bell |
| HD2_CabMicIr_1x12USDeluxeWithPan | Fender 1x12 Deluxe |
| HD2_CabMicIr_1x12CaliExtWithPan | Mesa 1x12 Extension |
| HD2_CabMicIr_4x12UberWithPan | Bogner 4x12 Uberkab |

### Utility Models (@type=0)

| Model ID | Function |
|----------|----------|
| HD2_VolPanVol | Volume Pedal |
| HD2_WahChrome | Chrome Wah |
| HD2_WahThroaty | Throaty Wah |
| HD2_WahUKWah846 | UK Wah 846 |
| HD2_EQParametric | Parametric EQ |
| HD2_EQLowCutHighCut | Low/High Cut EQ |
| HD2_CompressorDeluxeComp | Deluxe Compressor |
| HD2_GateHardGate | Hard Gate |
| HD2_PitchSimplePitch | Simple Pitch |
| HD2_ChorusTrinityChorus | Trinity Chorus |
| HD2_Tremolo60sBiasTrem | 60s Bias Tremolo |
| HD2_PhaserScriptModPhase | Script Mod Phaser |
| HD2_FXLoopSendReturn1 | FX Loop Send/Return |
| HD2_VolPanGain | Gain Block |
| HD2_DM4BassOctaver | Bass Octaver |

---

## Appendix A: IR UUID Table

Every preset includes an `irUuidTable` with 128 entries ("000" through "127"). Each entry is either:
- `""` (empty string) for unused IR slots
- A 32-character hex UUID for loaded IRs

Example with IRs loaded in slots 000-006:
```json
"irUuidTable": {
  "000": "ab34b8a0f66c1bc33d04aa983051a7fe",
  "001": "6ccccfaf1f009247d4a16a796e3f91ab",
  "002": "3b450c82ec062e5c00596c0c155a73fa",
  ...
  "007": "",
  ...
}
```

## Appendix B: Variax Default Block

Always present, with these default values:

```json
"variax": {
  "@model": "@variax",
  "@variax_model": 0,
  "@variax_str1tuning": 0, "@variax_str2tuning": 0,
  "@variax_str3tuning": 0, "@variax_str4tuning": 0,
  "@variax_str5tuning": 0, "@variax_str6tuning": 0,
  "@variax_str1level": 1, "@variax_str2level": 1,
  "@variax_str3level": 1, "@variax_str4level": 1,
  "@variax_str5level": 1, "@variax_str6level": 1,
  "@variax_lockctrls": 0,
  "@variax_customtuning": false,
  "@variax_magmode": true,
  "@variax_toneknob": -0.1,
  "@variax_volumeknob": -0.1
}
```

## Appendix C: DT Default Block

Always present for dt0, dt1, dtdual:

```json
{
  "@dt_topology": 0,
  "@dt_tubeconfig": 0,
  "@model": "@dt",
  "@dt_channel": 0,
  "@dt_reverb": true,
  "@dt_poweramp": 1,
  "@dt_12ax7boost": 0,
  "@dt_bplusvoltage": 0,
  "@dt_feedbackcap": 0,
  "@dt_revmix": 0.25
}
```

## Appendix D: PowerCab Default Block

Always present for powercab0, powercab1, powercabdual:

```json
{
  "@model": "@powercab",
  "@powercab_color": 0,
  "@powercab_mic": 0,
  "@powercab_flatlevel": 0,
  "@powercab_irlevel": -18,
  "@powercab_hicut": 20100,
  "@powercab_lowcut": 19.9,
  "@powercab_distance": 3.5,
  "@powercab_speakerlevel": -15,
  "@powercab_userir": 0,
  "@powercab_speaker": 0
}
```

## Appendix E: Validation Checklist

When generating a preset, verify:

1. **Top level:** `schema: "L6Preset"`, `version: 6`, `data.device: 2162692`
2. **Global:** `@topology0` and `@topology1` are valid ("A", "AB", "SABJ")
3. **DSP structure:** Both `dsp0` and `dsp1` exist with at minimum: inputA, inputB, outputA, outputB, split, join
4. **Block positions:** Each block has unique `@position` within its DSP (0-7 for blocks, 0 for split, 8 for join)
5. **Block fields:** Match field rules from Section 1 exactly based on `@type`
6. **Cab references:** If any block has `@cab: "cab0"`, ensure `cab0` exists in the same DSP
7. **Amp+Cab type=3:** Has `@cab` field, no `@stereo`, no `@trails`
8. **Reverb/Delay type=7:** Has `@trails` field, has `@stereo` field
9. **Snapshots:** All 8 snapshots (snapshot0-7) exist with valid structure
10. **Snapshot blocks:** Every block in each DSP has an enable/disable entry
11. **Controllers:** Any parameter in snapshot controllers must also appear in the top-level `controller` section
12. **irUuidTable:** 128 entries ("000" through "127"), all strings
13. **Auxiliary blocks:** variax, dtdual, dt0, dt1, powercabdual, powercab0, powercab1 all present
14. **No @path on infrastructure:** split, join, inputA/B, outputA/B do NOT have @path
15. **Parameter value ranges:** All floats within documented ranges (no negative volumes unless dB scale)
