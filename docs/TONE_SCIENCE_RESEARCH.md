# Tone Science Research

> Deep research into the mathematics, physics, and systematic approaches to creating
> great guitar tones programmatically --- without relying on human hearing for validation.

---

## Table of Contents

1. [Creating Great Tones Without Hearing](#1-creating-great-tones-without-hearing)
2. [Helix Tone Families and Amp Character](#2-helix-tone-families-and-amp-character)
3. [10 Programmatic Approaches to Tone Quality](#3-10-programmatic-approaches-to-tone-quality)
4. [Helix-Specific Deep Dive](#4-helix-specific-deep-dive)
5. [Competitive Analysis](#5-competitive-analysis)

---

## 1. Creating Great Tones Without Hearing

### 1.1 The Electric Guitar Frequency Spectrum

The electric guitar occupies a well-defined frequency territory. Understanding this is the
foundation for every algorithmic approach that follows.

**Fundamental frequency range:** 82 Hz (low E in standard tuning) to ~400 Hz (high E, 12th fret).

**Open string fundamentals in standard tuning:**

| String | Note | Frequency (Hz) |
|--------|------|-----------------|
| 6th    | E2   | 82.41           |
| 5th    | A2   | 110.00          |
| 4th    | D3   | 146.83          |
| 3rd    | G3   | 196.00          |
| 2nd    | B3   | 246.94          |
| 1st    | E4   | 329.63          |

**Harmonic overtone series:** Each fundamental generates integer-multiple harmonics.
For low E (82 Hz): 82, 164, 246, 328, 410, 492... Hz. The presence of these harmonics
and their relative amplitudes is what gives each guitar its tonal fingerprint.

**Usable spectrum:** While fundamentals live below 400 Hz, harmonics and pick attack
transients extend to ~5 kHz for core tone, with air and shimmer reaching 10-15 kHz.

**Frequency region map for guitar:**

| Range          | Frequency     | Character Description                    |
|----------------|---------------|------------------------------------------|
| Sub-bass       | 20-80 Hz      | Rumble, mud --- usually filtered out      |
| Bass/Body      | 80-250 Hz     | Warmth, fullness, fundamental weight     |
| Low-mids       | 250-500 Hz    | Thickness, boxiness, muddiness zone      |
| Mids           | 500-2000 Hz   | Core character, presence, "guitar voice" |
| Upper-mids     | 2-5 kHz       | Bite, attack, cut, articulation          |
| Presence       | 5-8 kHz       | Sparkle, clarity, pick definition        |
| Air            | 8-15 kHz      | Shimmer, open feel, hiss territory       |

### 1.2 Frequency Signatures of Famous Tones

Famous tones can be characterized by their frequency emphasis patterns. These serve
as "target curves" for algorithmic tone matching.

**Stevie Ray Vaughan (SRV):**
- Heavy emphasis at 800 Hz and 1.6 kHz (mid-presence peak)
- Moderate boost at 400 Hz for warmth
- Characteristic midrange frequency centered around 1.25 kHz
- Despite sounding "scooped," the tone maintains strategic mid boosts for clarity
- Strong pick attack energy in the 2-4 kHz range
- Equipment DNA: Fender Stratocaster (position 2 = bridge+middle), heavy strings (.013),
  Fender Super Reverb/Vibroverb, Ibanez Tube Screamer for mid push
- Key insight: SRV's tone is "relatively scooped in low mids" but boosted in the
  800-1600 Hz range, giving it cut without harshness

**David Gilmour:**
- Mid-heavy tone is the foundation --- keeps the guitar in its own frequency slot
- Generous mid boost with slight top-end shimmer
- Lower gain than many assume --- the sustain comes from compression, not distortion
- Heavy use of delay (long, dark, high-repeat) to create ambient wash
- Core frequencies: Strong 600-2000 Hz, gentle 5-8 kHz presence
- Signature: Mellow overdrive layered with compression, delay, chorus, and reverb

**The Edge (U2):**
- Minimal distortion --- tone is defined by effects processing, not amp gain
- Dotted-eighth-note delay is the defining characteristic
- Rhythmic delay patterns create perceived complexity from simple playing
- Frequency profile is relatively clean/flat with strong transient preservation
- The delay fills rhythmic gaps, making sparse single notes sound orchestral

**John Mayer (Continuum era):**
- Clean-to-light-overdrive territory
- Strong mid presence similar to SRV (acknowledged influence)
- Emphasis on dynamic range --- quiet notes are very quiet, loud notes break up
- Frequency emphasis in the 800 Hz-2 kHz range for vocal quality

**Algorithmic takeaway:** Each famous tone can be reduced to a frequency emphasis
curve + a gain/compression profile + a time-based effects recipe. These three vectors
form the basis for tone fingerprinting.

### 1.3 EQ Curve Patterns by Genre

These are target EQ curves that can be stored as data and applied programmatically.
All values are relative to a flat response at 0 dB.

**Blues:**

| Frequency | Adjustment | Purpose                        |
|-----------|------------|--------------------------------|
| 80 Hz     | +2 to +4 dB | Warmth and body              |
| 250 Hz    | 0 dB       | Neutral --- avoid mud           |
| 400 Hz    | +1 to +2 dB | Thickness (don't overdo)     |
| 800 Hz    | +1 to +3 dB | Core tone richness           |
| 2 kHz     | 0 to +1 dB | Mild presence                |
| 4 kHz     | 0 dB       | Neutral                      |
| 6 kHz     | +1 to +2 dB | Sparkle and string shimmer   |

**Rock:**

| Frequency | Adjustment  | Purpose                       |
|-----------|-------------|-------------------------------|
| 80-100 Hz | +3 to +5 dB | Robust low end              |
| 250 Hz    | 0 dB        | Keep neutral                |
| 400 Hz    | -2 to -3 dB | Cut muddiness              |
| 800 Hz    | 0 to +2 dB  | Body without mud            |
| 2-3 kHz   | +3 to +6 dB | Edge, bite, aggression      |
| 5 kHz     | +1 to +2 dB | Pick attack definition      |
| 8 kHz     | 0 to +1 dB  | Air                         |

**Metal:**

| Frequency  | Adjustment  | Purpose                       |
|------------|-------------|-------------------------------|
| < 80 Hz    | HPF cut     | Remove rumble (60-70 Hz for drop tunings) |
| 100 Hz     | +2 to +4 dB | Low-end thump               |
| 250-350 Hz | -2 to -4 dB | Cut mud and congestion      |
| 400-600 Hz | -2 to -3 dB | Remove boxiness             |
| 800-1.5 kHz| +2 to +4 dB | Aggression and core character |
| 2-4 kHz    | +2 to +4 dB | Pick articulation and definition |
| 6-8 kHz    | +1 to +2 dB | Presence and string noise   |
| > 10 kHz   | LPF cut     | Remove hiss and fizz        |

**Worship/Ambient:**

| Frequency | Adjustment  | Purpose                       |
|-----------|-------------|-------------------------------|
| 80-120 Hz | +1 to +2 dB | Gentle warmth               |
| 250 Hz    | -1 to -2 dB | Slight mud reduction        |
| 500 Hz    | 0 dB        | Neutral                     |
| 1-2 kHz   | +2 to +3 dB | Chime and clarity           |
| 3-4 kHz   | +1 to +2 dB | Pick articulation           |
| 6-8 kHz   | +2 to +3 dB | Shimmer for ambient effects |
| 10+ kHz   | +1 dB       | Air and openness            |

**Key algorithmic insight:** The primary differentiator between genres in the EQ domain
is how the 250-600 Hz "mud zone" and the 2-5 kHz "bite zone" are handled. Blues keeps
the mud zone warm; metal slashes it aggressively. Metal boosts bite; blues keeps it
gentle.

### 1.4 Gain Staging Mathematics

Gain staging is the science of managing signal levels through a chain of processing
blocks to optimize headroom and tone at each stage.

#### Core Principles

**Digital headroom target:** -18 dBFS average signal, leaving ~18 dB of headroom
before digital clipping (0 dBFS). This is the standard reference level.

**Clipping types and their mathematics:**

| Clipping Type | Waveform Shape | Harmonic Content | Perceived Sound |
|---------------|----------------|------------------|-----------------|
| Soft clip     | Rounded peaks  | Predominantly 3rd harmonic, smaller 5th, diminishing higher odds | Warm, tube-like, musical |
| Hard clip     | Flat-topped    | Strong 11th, 15th, 19th harmonics | Aggressive, buzzy, edgy |
| Asymmetric    | Uneven rounding| Even AND odd harmonics | Complex, rich, tube-like warmth |

**Soft clipping** places diodes in the feedback loop of an op-amp. As the signal
reaches forward voltage, gain is gradually reduced. This produces primarily odd-order
harmonics (3rd, 5th, 7th) with rapidly diminishing amplitude. Because the clipping
is symmetrical, even-order harmonics are at vanishingly small amplitudes.

**Hard clipping** routes diodes to ground. The waveform peaks are abruptly chopped,
generating high levels of upper odd harmonics (11th, 15th, 19th). This creates the
aggressive character of distortion and fuzz pedals.

**Tube saturation** is asymmetric --- the positive and negative halves of the waveform
clip differently, generating both even and odd harmonics. Even harmonics (2nd, 4th)
are often described as "musical" and "warm." This is why tube amps are prized: they
produce a richer, more complex harmonic spectrum.

#### Gain Stage Cascade

In a typical guitar signal chain, each stage adds gain:

```
Guitar output (~-20 dBu)
  -> Boost pedal (+10-20 dB)
    -> Overdrive pedal (soft clip at threshold)
      -> Amp preamp (multiple tube gain stages)
        -> Power amp (tube saturation under load)
          -> Speaker (frequency filtering + resonance)
```

**Critical rule:** Each stage should receive a signal that is loud enough to overcome
its noise floor but quiet enough to preserve headroom for dynamics. When a stage is
intentionally driven into clipping (overdrive, distortion), the input level determines
HOW MUCH clipping occurs, which directly maps to perceived "crunch."

**Perceived crunch formula (simplified):**
```
Crunch Level = (Input Signal Level - Clipping Threshold) / Clipping Threshold
```
When input barely exceeds threshold: light breakup, touch-sensitive.
When input greatly exceeds threshold: heavy saturation, compressed dynamics.

#### Drive Stacking Gain Budget

When stacking drive pedals, the total gain accumulates multiplicatively:

```
Total Gain (dB) = Gain_pedal1 + Gain_pedal2 + Gain_amp_preamp

Example: Boost (+12 dB) -> Tubescreamer (+15 dB) -> Amp preamp (+30 dB)
Total = 57 dB of potential gain before power amp
```

**Rule:** Keep the total gain below the point where dynamics are completely crushed.
For blues: 30-45 dB total. For rock: 45-60 dB. For metal: 60-80 dB.

### 1.5 Compression Parameters by Playing Style

Compression tames dynamic range. The right settings depend entirely on playing style.

**Core compression parameters:**
- **Ratio:** How much the signal above threshold is reduced (2:1, 4:1, 8:1, etc.)
- **Attack:** How quickly compression engages after signal crosses threshold
- **Release:** How quickly compression disengages after signal drops below threshold
- **Threshold:** The level at which compression begins

**Compression settings by playing style:**

| Style         | Ratio   | Attack     | Release   | Gain Reduction | Notes |
|---------------|---------|------------|-----------|----------------|-------|
| Fingerpicking | 3:1-4:1 | 10-25 ms   | 50-100 ms | 3-5 dB         | Slow attack preserves pluck nuance; fast release prevents mud |
| Light strumming | 2:1-4:1 | 5-15 ms  | 50-150 ms | 3-5 dB         | Medium attack preserves strum definition |
| Heavy strumming | 4:1-8:1 | 3-10 ms  | 30-80 ms  | 5-8 dB         | Faster attack tames percussive peaks |
| Lead/Solo     | 4:1-6:1 | 5-15 ms   | 100-200 ms | 4-8 dB        | Medium attack preserves pick dynamics; longer release adds sustain |
| Country chicken picking | 6:1-10:1 | 1-5 ms | 50-100 ms | 6-10 dB | Fast attack, heavy ratio = "squish" |
| Ambient/Swells | 2:1-3:1 | 20-50 ms | 200-500 ms | 2-4 dB        | Very slow attack for volume swell feel |

**Key insight for algorithms:** Attack time is the most critical parameter. Slow attack
(>15 ms) preserves transients and dynamics. Fast attack (<5 ms) flattens dynamics for
consistency. The "musicality" of compression lives in getting attack time right for the
playing context.

### 1.6 Delay Timing Formulas

Delay times must be synchronized to the song tempo for musical results. These are
pure mathematical conversions.

#### Master Formula

```
Delay (ms) = (60,000 / BPM) * Subdivision_Multiplier
```

Where 60,000 converts minutes to milliseconds, and BPM is beats per minute.

#### Subdivision Multipliers

| Note Value          | Multiplier | Formula              |
|---------------------|------------|----------------------|
| Whole note          | 4.0        | (60000/BPM) * 4     |
| Dotted half         | 3.0        | (60000/BPM) * 3     |
| Half note           | 2.0        | (60000/BPM) * 2     |
| Dotted quarter      | 1.5        | (60000/BPM) * 1.5   |
| Quarter note        | 1.0        | (60000/BPM) * 1     |
| Dotted eighth       | 0.75       | (60000/BPM) * 0.75  |
| Eighth note         | 0.5        | (60000/BPM) * 0.5   |
| Dotted sixteenth    | 0.375      | (60000/BPM) * 0.375 |
| Sixteenth note      | 0.25       | (60000/BPM) * 0.25  |
| Eighth triplet      | 0.333      | (60000/BPM) * (1/3) |
| Sixteenth triplet   | 0.167      | (60000/BPM) * (1/6) |

**Dotted note rule:** Dotted notes = straight note value * 1.5.
**Triplet rule:** Triplet notes = straight note value * (2/3).

#### Common Tempo Reference Table

| BPM | Quarter (ms) | Dotted 8th (ms) | Eighth (ms) | Sixteenth (ms) |
|-----|-------------|------------------|-------------|-----------------|
| 60  | 1000        | 750              | 500         | 250             |
| 72  | 833         | 625              | 417         | 208             |
| 80  | 750         | 563              | 375         | 188             |
| 90  | 667         | 500              | 333         | 167             |
| 100 | 600         | 450              | 300         | 150             |
| 110 | 545         | 409              | 273         | 136             |
| 120 | 500         | 375              | 250         | 125             |
| 130 | 462         | 346              | 231         | 115             |
| 140 | 429         | 321              | 214         | 107             |
| 150 | 400         | 300              | 200         | 100             |

**Dotted eighth note** is the most popular delay subdivision for modern worship,
ambient, and U2-style playing. It equals 3/4 of a beat (three sixteenth notes),
creating syncopated echoes that fall between beats.

#### Programmatic Implementation

```javascript
function calculateDelay(bpm, noteValue) {
  const multipliers = {
    'whole': 4.0,
    'dotted_half': 3.0,
    'half': 2.0,
    'dotted_quarter': 1.5,
    'quarter': 1.0,
    'dotted_eighth': 0.75,
    'eighth': 0.5,
    'dotted_sixteenth': 0.375,
    'sixteenth': 0.25,
    'eighth_triplet': 1/3,
    'sixteenth_triplet': 1/6
  };
  return (60000 / bpm) * multipliers[noteValue];
}
```

---

## 2. Helix Tone Families and Amp Character

### 2.1 Helix Amp Model Naming Conventions

Helix uses geographical and brand-coded naming to reference real amp manufacturers:

| Helix Prefix    | Real Manufacturer    | Origin              |
|-----------------|---------------------|----------------------|
| US              | Fender              | Fullerton, California |
| Tweed           | Fender (1950s era)  | Pre-CBS Fender       |
| Fullerton       | Fender              | Fullerton, California |
| Brit            | Marshall             | United Kingdom        |
| Essex           | Vox                  | Essex, England        |
| Cali            | Mesa/Boogie          | Petaluma, California  |
| German          | Bogner, Diezel, ENGL | Germany              |
| Match           | Matchless            | Los Angeles           |
| Cartographer    | Ben Adrian design    | Line 6 Original       |
| Litigator       | Dumble-inspired      | Line 6 (litigation-prone brand) |
| Line 6          | Line 6 Originals    | Various inspirations  |
| Catalyst        | Line 6 Catalyst      | Idealized versions    |

### 2.2 Amp Family Categorization

Helix contains 111+ amp models as of the latest firmware. They can be organized
into functional families based on their tonal DNA.

#### Family 1: Fender Clean (US/Tweed/Fullerton)

**Character:** Clean headroom, scooped mids, glassy highs, warm lows.
**Gain range:** Clean to mild breakup.
**Best for:** Blues, country, jazz, worship, pop, R&B.

| Model Name         | Based On              | Gain Level | Key Character         |
|--------------------|-----------------------|------------|----------------------|
| US Deluxe Nrm      | Fender Deluxe Reverb  | Low        | Warm, chimey clean   |
| US Deluxe Vib       | Fender Deluxe Reverb (vibrato channel) | Low-Med | Slightly darker |
| US Double Nrm       | Fender Twin Reverb    | Very Low   | Ultra-clean headroom |
| US Princess          | Fender Princeton      | Low-Med    | Sweet breakup        |
| Fullerton Nrm/Jump  | Various Fender        | Low        | Classic Fender clean |
| Tweed Blues Nrm      | Fender Bassman        | Med        | The grandfather of rock |

**EQ DNA:** Fender tone stacks have a characteristic mid-scoop. "Flat" is NOT
at 5-5-5. Closest to flat: bass ~1, mid ~10, treble ~3. The mid control on
Fender amps has enormous range.

#### Family 2: Vox Chime (Essex)

**Character:** Chimey, jangly, bright with a mid push, Class A feel.
**Gain range:** Clean to medium crunch.
**Best for:** British invasion, indie, pop-rock, jangle-pop.

| Model Name        | Based On            | Gain Level | Key Character       |
|-------------------|---------------------|------------|---------------------|
| Essex A15         | Vox AC15            | Low-Med    | Intimate, responsive |
| Essex A30         | Vox AC30            | Med        | Jangly, chimey       |

**EQ DNA:** More midrange emphasis than Fender. The "chime" comes from strong
upper-mid harmonic content around 2-4 kHz.

#### Family 3: Marshall Crunch (Brit)

**Character:** Mid-forward, crunchy, aggressive, "classic rock."
**Gain range:** Crunch to high gain.
**Best for:** Classic rock, hard rock, punk, blues-rock.

| Model Name        | Based On              | Gain Level | Key Character        |
|-------------------|-----------------------|------------|----------------------|
| Brit Plexi Brt    | Marshall Super Lead 1959 | Med     | The classic crunch   |
| Brit Plexi Nrm    | Marshall Super Lead 1959 | Med-Low | Warmer, less bright  |
| Brit 2204         | Marshall JCM 800     | Med-High   | The 80s rock sound   |
| Brit J45 Nrm      | Marshall JTM 45      | Med        | Bluesy Marshall      |

**EQ DNA:** Marshall tone stacks have a forward midrange character. The mid
control is interactive with bass and treble in a way that creates the
characteristic "Marshall growl" in the 800-2000 Hz range.

#### Family 4: High Gain (Cali/German)

**Character:** Saturated, compressed, tight low end, scooped or mid-forward.
**Gain range:** High to extreme.
**Best for:** Metal, djent, modern rock, progressive.

| Model Name         | Based On              | Gain Level | Key Character        |
|--------------------|-----------------------|------------|----------------------|
| Cali Rectifire     | Mesa Rectifier        | Very High  | Scooped metal        |
| Cali IV Lead       | Mesa Mark IV          | High       | Tight, focused lead  |
| German Mahadeva    | Bogner Shiva          | Med-High   | Articulate high gain |
| German Ubersonic   | Bogner Uberschall     | Very High  | Brutal, modern       |

**EQ DNA:** These amps have built-in scooped mids or aggressive mid-push
depending on the model. Mesa Rectifiers scoop; Mesa Marks have a graphic EQ
that typically creates a "V" curve.

#### Family 5: Boutique/Transparent (Match/Litigator)

**Character:** Touch-sensitive, dynamic, "amp-in-a-room" feel.
**Gain range:** Clean to medium overdrive.
**Best for:** Worship, singer-songwriter, blues, jazz-fusion.

| Model Name        | Based On              | Gain Level | Key Character        |
|-------------------|-----------------------|------------|----------------------|
| Litigator         | Dumble Overdrive Special | Med      | The holy grail tone  |
| Matchstick Ch1    | Matchless DC30 ch1    | Low-Med    | Pristine clean       |
| Matchstick Ch2    | Matchless DC30 ch2    | Med        | Vocal overdrive      |

### 2.3 Amp-to-Genre Matching Algorithm

To algorithmically select an amp for a genre, use this decision matrix:

```
Input: genre, gain_level (0-10), mid_preference (scooped/neutral/forward)

IF genre IN [blues, jazz, country, R&B]:
    amp_family = "Fender Clean"
    IF gain_level < 3: model = "US Double" or "US Deluxe"
    IF gain_level 3-5: model = "US Princess" or "Tweed Blues"
    IF gain_level 5-7: model = "Litigator"

IF genre IN [classic_rock, blues_rock, hard_rock]:
    amp_family = "Marshall Crunch"
    IF gain_level < 5: model = "Brit Plexi"
    IF gain_level 5-7: model = "Brit 2204"
    IF gain_level > 7: model = "Brit Treadplate"

IF genre IN [indie, britpop, jangle]:
    amp_family = "Vox Chime"
    model = "Essex A30" or "Essex A15"

IF genre IN [metal, djent, progressive_metal]:
    amp_family = "High Gain"
    IF mid_preference == "scooped": model = "Cali Rectifire"
    IF mid_preference == "forward": model = "Cali IV Lead"
    IF mid_preference == "modern": model = "German Ubersonic"

IF genre IN [worship, ambient, post_rock]:
    amp_family = "Boutique"
    IF gain_level < 3: model = "Matchstick Ch1" or "US Deluxe"
    IF gain_level 3-6: model = "Litigator"
    IF gain_level > 6: model = "Matchstick Ch2"
```

### 2.4 Cabinet and Microphone Pairing Guide

Cabs shape the final frequency response more dramatically than almost any other
element in the chain. Mic selection adds further coloration.

#### Speaker Character Profiles

| Speaker          | Frequency Range  | Character                          | Best With         |
|------------------|------------------|------------------------------------|-------------------|
| Celestion V30    | 70-5000 Hz       | Aggressive upper-mid presence, less 1.4 kHz dip | High gain, rock |
| Celestion Greenback | 75-5000 Hz   | Mid-focused, slightly compressed, subdued top | Classic rock, blues |
| Celestion Blue   | 75-5000 Hz       | Chimey, bright, jangly             | Vox amps, indie  |
| Jensen P-series  | ~80-5000 Hz      | Warm, smooth, vintage character    | Fender cleans, country |
| EV (Electro-Voice) | 65-5000+ Hz   | Extended range, flat, analytical   | Metal, modern tones |

#### Recommended Pairings

| Amp Family         | Cabinet             | Mic          | Distance | Character |
|--------------------|---------------------|--------------|----------|-----------|
| Fender Clean       | 1x12 US Princess    | 57 Dynamic   | 1-2"     | Classic studio Fender |
| Fender Clean       | 1x12 US Deluxe      | 121 Ribbon   | 2-3"     | Warm, rounded |
| Vox Chime          | 2x12 Blue Bell      | 160 Ribbon   | 2"       | Definitive AC30 sound |
| Marshall Crunch    | 4x12 XXL V30        | 57 Dynamic   | 2"       | Classic rock standard |
| Marshall Crunch    | 4x12 Greenback 25   | 57 + 121 blend | 1-2"  | Wider, smoother |
| High Gain          | 4x12 XXL V30        | 57 Dynamic   | 1"       | Tight, articulate metal |
| High Gain          | 4x12 Cali V30       | 421 Dynamic  | 1-2"     | Scooped, heavy |
| Boutique/Dumble    | 1x12 Cali IV Lead   | 121 Ribbon   | 2.5"     | Ribbon tames upper-mid harshness |

**Mic character guide:**
- **57 Dynamic** (SM57): Industry standard. Focused midrange, cuts through mix.
- **121 Ribbon** (Royer 121): Smooths high end, adds warmth. Often blended with 57.
- **160 Ribbon**: More colored than 121, adds "hype" and size.
- **421 Dynamic** (Sennheiser 421): Scooped mids, good for heavy tones.
- **414 Condenser** (AKG 414): Full range, natural, detailed.
- **67 Condenser** (Neumann U67): Warm, vintage character.

**Multi-mic blending:** The 57 + 121 combination is the studio standard for guitar.
The 57 provides midrange focus and attack; the 121 fills in body and smooths the top.
Blend ratio: start at 70% SM57 / 30% Royer 121.

**Mic distance effect:** Closer = more focused, more proximity effect (bass boost).
Further = more room character, thinner direct sound. 1-3 inches is the sweet spot
for most guitar cab micing.

#### Cabinet Physics Notes

Multi-speaker cabinets (2x12, 4x12) exhibit comb filtering --- frequency dips caused
by phase cancellation between speakers at certain frequencies. This is actually
desirable; it creates the characteristic "cab sound" that guitarists expect. However,
in live band contexts, 1x12 cabs can provide more excitement and less comb filtering.

### 2.5 The "Golden Ratios" of Amp Settings

There is no universal 5-5-5 that equals flat, because tone stacks are interactive and
nonlinear. However, there are useful starting-point relationships:

**Fender tone stack "flat" approximation:** Bass 1, Mid 10, Treble 3.
This is counterintuitive but reflects the massive mid-scoop built into the circuit.
At 5-5-5, a Fender is heavily scooped.

**Marshall tone stack:** More linear than Fender. 5-5-5 is closer to balanced
but still has some inherent mid emphasis.

**Starting point recommendations by genre:**

| Genre        | Bass | Mid  | Treble | Presence | Drive |
|-------------|------|------|--------|----------|-------|
| Blues        | 5-6  | 6-7  | 5-6    | 4-5      | 3-5   |
| Classic Rock | 6   | 5-6  | 6-7    | 5-6      | 5-7   |
| Metal        | 6-7  | 3-5  | 7-8    | 6-7      | 7-9   |
| Worship      | 4-5  | 6-7  | 6-7    | 5-6      | 3-5   |
| Country      | 5-6  | 5-6  | 7-8    | 5-6      | 2-3   |
| Jazz         | 6-7  | 5-6  | 3-5    | 3-4      | 1-3   |

---

## 3. 10 Programmatic Approaches to Tone Quality

### Approach 1: Frequency Spectrum Templates

**Concept:** Define a target EQ curve for each genre as a data structure. Compare the
frequency response of a generated preset against this template, and flag deviations.

**Implementation:**
```javascript
const genreTemplates = {
  blues: {
    bands: [
      { freq: 80, gain: 3, q: 1.0 },    // warmth
      { freq: 400, gain: 1, q: 0.7 },    // mild thickness
      { freq: 800, gain: 2, q: 1.0 },    // core richness
      { freq: 2000, gain: 0.5, q: 0.8 }, // gentle presence
      { freq: 6000, gain: 1.5, q: 0.7 }, // sparkle
    ],
    tolerance: 2.0  // dB tolerance for matching
  },
  metal: {
    bands: [
      { freq: 80, gain: 0, q: 0 },       // HPF below 80 Hz
      { freq: 100, gain: 3, q: 0.8 },    // thump
      { freq: 300, gain: -3, q: 1.0 },   // cut mud
      { freq: 500, gain: -2, q: 0.8 },   // cut boxiness
      { freq: 1200, gain: 3, q: 1.0 },   // aggression
      { freq: 3000, gain: 3, q: 0.8 },   // articulation
    ],
    tolerance: 2.5
  }
};
```

**Validation logic:** For each band in the template, check whether the cumulative
EQ effect of all blocks in the preset falls within the tolerance range. Flag specific
frequency ranges that deviate.

### Approach 2: Reference Tone Matching

**Concept:** Compare a generated preset's calculated frequency response against
known-good reference presets. Use spectral similarity scoring.

**How tone matching works:**
1. Analyze two signals (or preset configurations) to compute their linear frequency
   response.
2. Calculate the difference as an EQ adjustment curve.
3. Score similarity from 0-100% based on deviation.

**Limitations discovered in research:**
- Tone match analysis is most accurate between 90 Hz and 11 kHz.
- Below 90 Hz and above 11 kHz, accuracy drops significantly.
- Best results come from playing chords across the entire neck for ~10 seconds
  to get full frequency density.

**Algorithmic approach for presets (without audio):**
- Sum the frequency effects of each block in the chain (EQ, amp tone stack, cab IR).
- Compare the resulting cumulative curve against a reference preset's cumulative curve.
- Use mean squared error across frequency bands to score similarity.

### Approach 3: Gain Structure Validation

**Concept:** Ensure clean headroom at each stage of the signal chain. Detect
gain stacking problems that lead to harsh over-compression or noise.

**Validation rules:**
```
Rule 1: Total gain before amp should not exceed +25 dB for clean tones
Rule 2: Total gain before amp should not exceed +40 dB for crunch
Rule 3: Total gain before amp should not exceed +55 dB for high gain
Rule 4: No single pedal gain should exceed +20 dB unless intentional saturation
Rule 5: Signal should not pass through more than 3 cascaded clipping stages
Rule 6: If compression ratio > 8:1 AND drive > 7, warn about dynamics loss
```

**Gain budget calculator:**
```javascript
function validateGainStructure(blocks, genre) {
  let totalGain = 0;
  let clippingStages = 0;

  blocks.forEach(block => {
    if (block.type === 'drive' || block.type === 'distortion') {
      totalGain += block.gain_db;
      clippingStages++;
    }
    if (block.type === 'boost') {
      totalGain += block.gain_db;
    }
  });

  const maxGain = { clean: 25, crunch: 40, highgain: 55 };
  const warnings = [];

  if (totalGain > maxGain[genre]) {
    warnings.push(`Total gain ${totalGain}dB exceeds ${genre} budget of ${maxGain[genre]}dB`);
  }
  if (clippingStages > 3) {
    warnings.push(`${clippingStages} clipping stages may cause over-compression`);
  }
  return warnings;
}
```

### Approach 4: Cab Resonance Pairing

**Concept:** Match the frequency response characteristics of the cabinet to complement
(not duplicate) the amp's natural frequency profile.

**Pairing rules:**
```
IF amp has strong upper-mid emphasis (Marshall, German):
    Prefer cab with V30 speakers (strong mids complement without comb-filter dip)
    OR cab with Greenback (soften the top end)

IF amp has mid-scoop (Fender clean, Mesa Rectifier):
    Prefer cab with strong mid presence (Greenback, Jensen)
    AVOID highly scooped cabs (doubles the scoop)

IF amp is bright (Vox, Fender Deluxe):
    Prefer ribbon mic (121, 160) to tame top end
    OR Celestion Blue cab (designed for Vox chime)

IF amp is dark (Tweed, some boutique):
    Prefer dynamic mic (57, 421) for definition
    AVOID ribbon mic (may become muddy)
```

**Frequency complementarity score:**
```
Score = 1 - |AmpMidEmphasis + CabMidEmphasis| / MaxEmphasis
```
A score of 1.0 means perfect complementarity (one scooped + one boosted).
A score of 0.0 means both emphasize the same range (potential problem).

### Approach 5: Dynamic Range Analysis

**Concept:** Ensure that compression settings preserve musicality. Too much
compression kills dynamics; too little leaves the tone inconsistent.

**Target dynamic range by genre:**

| Genre        | Target Dynamic Range | Max Compression | Notes |
|-------------|---------------------|-----------------|-------|
| Jazz        | 15-25 dB            | 2:1             | Preserve all dynamics |
| Blues       | 10-18 dB            | 4:1             | Touch-sensitive |
| Worship     | 8-15 dB             | 4:1-6:1         | Controlled but expressive |
| Rock        | 6-12 dB             | 4:1-8:1         | Consistent but punchy |
| Metal       | 4-8 dB              | 8:1-12:1        | Tight, consistent |
| Ambient     | 12-20 dB            | 2:1-4:1         | Preserve volume swells |

**Validation algorithm:**
```
IF (compression_ratio * drive_level) > threshold_for_genre:
    WARN "Dynamics may be over-compressed for {genre}"

IF compression_ratio < 2 AND genre IN [rock, metal]:
    WARN "Dynamics may be too wide for {genre} --- tone will be inconsistent"

IF attack_time < 3ms AND genre NOT IN [country, chicken_picking]:
    WARN "Very fast attack may kill pick transients"
```

### Approach 6: Delay Timing Optimization

**Concept:** Automatically calculate correct delay times from BPM and desired
subdivision, and validate that delay parameters are musically appropriate.

**Core formula** (from Section 1.6):
```
Delay_ms = (60000 / BPM) * subdivision_multiplier
```

**Genre-appropriate delay settings:**

| Genre       | Primary Subdivision | Feedback | Mix  | Modulation |
|-------------|-------------------|----------|------|------------|
| Worship     | Dotted eighth     | 30-45%   | 25-35% | Light    |
| Ambient     | Dotted eighth + quarter | 40-60% | 30-45% | Medium |
| Blues       | Quarter or eighth | 15-25%   | 15-25% | None     |
| Rock        | Quarter           | 20-30%   | 20-30% | None     |
| Country     | Slapback (40-120ms) | 0-10% | 30-40% | None     |
| Metal       | None or sixteenth | 10-20%   | 10-15% | None     |

**Validation:**
```
IF delay_time deviates > 5% from nearest musical subdivision:
    WARN "Delay time {ms}ms doesn't align with any subdivision at {bpm} BPM"

IF feedback > 50% AND mix > 40%:
    WARN "High feedback + high mix may create wash that obscures playing"
```

### Approach 7: Reverb Tail Shaping

**Concept:** Set reverb parameters based on musical context --- faster tempos need
shorter reverbs, slower tempos can accommodate longer tails.

**Pre-delay formula:**
```
Pre-delay (ms) = (60000 / BPM) * factor
Where factor = 0.05-0.1 for subtle separation
               0.1-0.2 for obvious separation
```

This keeps the pre-delay rhythmically related to the tempo.

**Reverb parameters by context:**

| Context         | Type    | Pre-delay | Decay   | HPF      | LPF       | Mix   |
|-----------------|---------|-----------|---------|----------|-----------|-------|
| Tight rhythm    | Room    | 10-30 ms  | 0.5-1s  | 300 Hz   | 6 kHz     | 15-25% |
| Rock lead       | Plate   | 40-80 ms  | 1.5-2.5s| 200 Hz   | 8 kHz     | 20-30% |
| Ballad/slow     | Hall    | 60-120 ms | 2-4s    | 150 Hz   | 10 kHz    | 25-40% |
| Worship ambient | Hall/Mod| 80-150 ms | 3-6s    | 200 Hz   | 8 kHz     | 30-50% |
| Country         | Spring  | 0-20 ms   | 1-2s    | 250 Hz   | 5 kHz     | 15-25% |
| Blues            | Spring  | 10-40 ms  | 1-2s    | 200 Hz   | 7 kHz     | 15-25% |

**Key filter settings:**
- **HPF (high-pass filter):** Remove low-frequency mud from the reverb tail.
  Standard starting point: 450-500 Hz.
- **LPF (low-pass filter):** Remove harsh high-frequency content from reverb.
  Standard starting point: 10-12 kHz. Darker reverb = lower LPF.

### Approach 8: Drive Stacking Rules

**Concept:** Validate that drive pedal order and interaction follows established
best practices for musical results.

**Core stacking principles:**

1. **Order from lowest to highest gain.** Place light overdrive before heavy
   distortion. Example: Timmy -> Tube Screamer -> Rat.

2. **Boost BEFORE overdrive** = more gain, same volume (pushes OD harder).
   **Boost AFTER overdrive** = same gain, more volume (clean volume increase).

3. **Transparent overdrive first, colored overdrive second.** The first pedal
   sets the base character; the second shapes it. Example: Transparent OD
   (flat EQ, no mid hump) -> Tube Screamer (mid hump) gives you the TS
   character without losing low-end clarity.

4. **Fuzz goes FIRST.** Fuzz pedals are sensitive to input impedance and
   generally want to see the guitar pickup directly. Putting buffers or
   other pedals before fuzz can kill its character.

5. **Maximum of 2-3 stacked drive stages** before dynamics are completely
   crushed. Beyond 3, you get diminishing returns and increasing noise.

**Validation rules:**
```
IF fuzz NOT first in drive chain:
    WARN "Fuzz works best receiving guitar signal directly"

IF high_gain_pedal BEFORE low_gain_pedal:
    WARN "Consider reversing order: low gain -> high gain for better stacking"

IF count(drive_blocks) > 3:
    WARN "More than 3 drive stages may over-compress signal"

IF tubescreamer AND bass_heavy_amp:
    NOTE "TS will cut bass and push mids --- may thin out the tone"
```

### Approach 9: Template Interpolation

**Concept:** Blend between genre templates to create unique hybrid tones.
Rather than using a single genre template, interpolate between two.

**Algorithm:**
```javascript
function interpolateTemplates(templateA, templateB, blendFactor) {
  // blendFactor: 0.0 = 100% A, 1.0 = 100% B
  const result = {};

  for (const param in templateA) {
    result[param] = templateA[param] * (1 - blendFactor)
                  + templateB[param] * blendFactor;
  }

  return result;
}

// Example: 70% blues, 30% rock
const bluesRock = interpolateTemplates(
  templates.blues,
  templates.rock,
  0.3
);
```

**Use cases:**
- Blues-rock: Interpolate blues (70%) + rock (30%)
- Worship-ambient: Interpolate worship (60%) + ambient (40%)
- Jazz-fusion: Interpolate jazz (50%) + rock (30%) + blues (20%)
- Southern rock: Interpolate country (40%) + rock (60%)

**Interpolatable parameters:**
- Gain level, compression ratio, EQ band gains
- Delay time, feedback, mix
- Reverb decay, pre-delay, mix
- Amp drive, bass, mid, treble

**Non-interpolatable parameters** (must be discrete choices):
- Amp model selection
- Cabinet selection
- Mic type
- Effect type (plate vs. hall reverb)

### Approach 10: A/B Testing with Real Preset Data

**Concept:** Compare generated preset settings against known-good presets from
professional sources (Worship Tutorials, Jason Sadites, etc.) to validate
that parameters fall within reasonable ranges.

**Reference data sources:**
- Worship Tutorials Helix presets (professional worship tones)
- Jason Sadites template presets (structured tone foundations)
- Line 6 CustomTone community presets (large sample size)
- ToneJunkies profiles (worship-specific)

**Comparison methodology:**
1. Parse .hlx JSON files from reference presets.
2. Extract key parameters: amp model, drive, bass, mid, treble, presence,
   cab selection, mic choice, delay time, reverb settings.
3. Build statistical distributions for each parameter per genre.
4. Score generated presets against the distribution: within 1 standard
   deviation = good, within 2 = acceptable, beyond 2 = flagged.

**Example parameter ranges from professional worship presets:**

| Parameter      | Typical Range | Mean  | Notes |
|---------------|---------------|-------|-------|
| Drive         | 3.0-6.0       | 4.5   | Light breakup, not saturated |
| Bass          | 4.0-6.0       | 5.0   | Moderate warmth |
| Mid           | 5.0-7.0       | 6.0   | Slightly above neutral |
| Treble        | 5.0-7.0       | 6.0   | Present but not harsh |
| Delay Mix     | 20-40%        | 30%   | Audible but not dominant |
| Delay Feedback| 25-45%        | 35%   | Multiple repeats, not infinite |
| Reverb Mix    | 20-40%        | 30%   | Spacious, not washed out |
| Reverb Decay  | 2.0-5.0s      | 3.0s  | Medium to long tails |

---

## 4. Helix-Specific Deep Dive

### 4.1 Internal Amp Parameters Explained

These are the "hidden" parameters accessible in the amp block that model the physics
of tube amplifier power sections.

#### Sag

**What it models:** Voltage sag in the power supply --- the momentary drop in voltage
that occurs when a real tube amp is pushed hard.

**Physical reality:** When you hit a loud chord on a tube amp, the power tubes draw
more current than the power supply can instantly deliver. The voltage drops
momentarily, which reduces the available headroom and creates a brief compression
followed by a bloom as the supply recovers.

**Helix behavior:**
- **Low Sag (1-3):** Fast, tight, punchy response. Amp recovers instantly from
  transients. Mimics solid-state behavior or a very stiff tube power supply.
  Best for: modern metal, djent, tight rhythm playing.
- **Medium Sag (4-6):** Balanced response. Natural tube amp feel with some bloom.
  Best for: rock, blues-rock, general purpose.
- **High Sag (7-10):** Slow, spongy response. Heavy compression and bloom.
  More touch dynamics and sustain.
  Best for: blues, classic rock, expressive lead playing.

**Programmatic guideline:**
```
IF genre == "metal" OR genre == "djent": sag = 1-3
IF genre == "rock": sag = 4-6
IF genre == "blues" OR genre == "worship": sag = 5-8
IF genre == "jazz": sag = 3-5 (tight but responsive)
```

#### Bias

**What it models:** The DC bias voltage applied to the power tubes, which determines
their idle operating point.

**Physical reality:** Tube bias determines how the tube conducts:
- **Cold bias (low values):** Tubes idle with less current. More headroom before
  clipping. Class AB operation with crossover distortion. Cleaner overall but
  potentially gritty in the crossover region.
- **Hot bias (high values):** Tubes idle with more current. Less headroom.
  Class A operation. Warmer, richer, but distorts earlier. More even-order harmonics.

**Helix behavior:**
- **Low Bias:** Colder biasing. More headroom, cleaner response. Can sound
  sterile at extreme low settings.
- **High Bias:** Hotter biasing. Warmer, more harmonic complexity, earlier breakup.
  At maximum, the amp operates in full Class A.

**Programmatic guideline:**
```
IF genre == "clean_jazz": bias = 4-5 (neutral, clean)
IF genre == "blues": bias = 6-7 (warm, harmonic richness)
IF genre == "rock": bias = 5-6 (balanced)
IF genre == "metal": bias = 4-5 (headroom for tight response)
```

#### Bias X (Bias Excursion)

**What it models:** How much the bias point shifts dynamically under high-input
conditions --- the tube's bias point moves in response to signal level.

**Physical reality:** Under heavy signal, the operating point of the tube shifts.
With high Bias X, the tube runs cooler when you play softly (cleaner) and hotter
when you dig in (more saturated). This creates deeply touch-sensitive behavior.

**Helix behavior:**
- **Low Bias X (1-3):** Stable bias point. Consistent response regardless of
  playing dynamics. Predictable.
- **High Bias X (6-8):** Dynamic bias shifting. Light touch = cooler/cleaner.
  Hard attack = hotter/more saturated. Deeply expressive and touch-responsive.

**Programmatic guideline:**
```
IF playing_style == "consistent" (metal, tight rhythm): biasX = 2-4
IF playing_style == "dynamic" (blues, worship): biasX = 5-7
IF playing_style == "very_expressive" (jazz, solo): biasX = 6-8
```

#### Hum

**What it models:** Heater hum from tube filaments --- the low-voltage AC signal
that heats tube cathodes and can leak into the audio path.

**Physical reality:** Tube heaters use low-voltage AC (typically 6.3V or 12.6V).
This AC signal can magnetically couple into the audio signal, adding a subtle
60 Hz (or 50 Hz) hum. At higher levels, this hum intermodulates with the audio
signal, creating intermodulation distortion.

**Helix behavior:**
- **Low Hum (0-2):** Clean, modern, noise-free. Like a well-maintained amp.
- **Medium Hum (3-5):** Subtle vintage character. Adds warmth and "life."
- **High Hum (6-10):** Obvious hum and intermodulation. Gritty, lo-fi vintage.

**Programmatic guideline:** For most presets, keep Hum at 0-2 unless specifically
targeting a vintage or lo-fi aesthetic. Values above 5 add noticeable noise.

#### Ripple

**What it models:** AC ripple in the power supply --- the residual AC component
that survives the rectification and filtering process.

**Physical reality:** Power supplies convert AC to DC, but some AC residual
always remains. Unlike hum (which mixes in parallel with audio), ripple
MODULATES the audio level --- it creates a subtle amplitude tremolo effect
at the AC frequency. This is audible even under heavy distortion.

**Helix behavior:**
- **Low Ripple (0-2):** Tight, modern power supply feel. No modulation artifacts.
- **Medium Ripple (3-5):** Subtle "breathing" quality. Vintage character.
- **High Ripple (6-10):** Obvious amplitude modulation. Vintage, saggy, spongy.

**Programmatic guideline:** Ripple interacts strongly with Sag. High Ripple +
High Sag = very vintage/spongy feel. Keep Ripple at 0-3 for modern tones.

### 4.2 Drive and Master Volume Interaction

This is the most important concept in Helix amp modeling.

**Two-stage gain architecture:**

```
Guitar Signal
  -> Drive (preamp gain) -> [PREAMP DISTORTION]
    -> Master Volume (controls level into power amp)
      -> Bias/Sag/BiasX (power amp character)
        -> [POWER AMP DISTORTION]
          -> Output
```

**Preamp-dominant distortion** (High Drive, Low Master):
- Tight, focused, compressed distortion.
- Consistent response regardless of dynamics.
- Modern metal, high-gain sound.
- The distortion character comes from preamp tube stages cascading.

**Power-amp-dominant distortion** (Low Drive, High Master):
- Open, dynamic, touch-sensitive breakup.
- "Feel" changes dramatically with picking dynamics.
- Classic rock, blues, vintage sound.
- The distortion has a different harmonic character than preamp distortion,
  with more even-order harmonics and natural compression from output tube
  saturation.

**Balanced** (Medium Drive, Medium Master):
- Mix of both characters.
- Versatile, musical, good for most applications.

**Master Volume implementation note:** In Helix, the Master Volume knob maps to the
physical master volume on amps that have one. For amps without a master volume
(vintage Marshalls, old Fenders), Helix adds a virtual master volume between the
preamp and power amp, simulating where an amp tech would install one.

**Critical for algorithms:** The Drive-to-Master-Volume ratio is more important
than their absolute values:

| Ratio (Drive:Master) | Character | Best For |
|----------------------|-----------|----------|
| 7:3                  | Preamp-heavy, compressed, modern | Metal, modern rock |
| 5:5                  | Balanced | Rock, worship, all-purpose |
| 3:7                  | Power-amp-heavy, dynamic, vintage | Blues, classic rock |
| 2:8                  | Power amp saturation dominant | Vintage cranked amp |

### 4.3 Signal Routing and the @type Parameter

In Helix .hlx preset files, blocks are stored as JSON objects within `dsp0` and
`dsp1` paths. Each block has metadata fields:

**Key JSON fields in a block:**
- `@model`: The specific model identifier (e.g., "HD2_AmpBritPlexi")
- `@type`: Defines the block category and affects routing behavior
  - Type values control whether a block processes mono, stereo, or splits signal
- `@position`: Physical location on the signal path (0-7 on each path)
- `@enabled`: Whether the block is active (true/false)
- `@path`: Which DSP path the block is on (0 or 1)

**Stereo considerations:**
- Amp blocks are inherently mono (real amps are mono).
- Cab blocks can be mono (single) or stereo (dual).
- Time-based effects (delay, reverb, chorus) can operate in stereo.
- Placing a stereo effect after a mono block automatically converts the
  signal to stereo (duplicating the mono signal to both channels).

**When blocks need @stereo:**
- Delay blocks: Optional stereo for ping-pong or wide effects.
- Reverb blocks: Almost always stereo for spatial width.
- Modulation blocks: Chorus and flanger benefit from stereo.
- Drive/distortion blocks: Typically mono (no spatial benefit).
- EQ blocks: Typically mono unless applied to a stereo signal.

### 4.4 Snapshots, Controllers, and Bypass Modes

#### Snapshots

Snapshots are Helix's most powerful performance feature. Each preset can have
up to 8 snapshots, and each snapshot stores:

1. **Block bypass states** (on/off for each block) --- unless snapshot bypass
   control is turned off for that block.
2. **Parameter values** for up to 64 controller-assigned parameters.
3. Snapshots do NOT change the preset's block structure, signal routing,
   or model selections.

**Snapshot bypass interaction:**
- Each block has a "Snapshot Bypass" toggle.
- When ON: The block's bypass state is saved/recalled per snapshot.
- When OFF: The block's bypass state is manual only and stays wherever
  you last set it, regardless of snapshot changes.

**Parameter snapshot control:**
- Any parameter assigned to a controller can be set to "Snapshot Control ON."
- When ON: The parameter value is saved/recalled per snapshot.
- When OFF: The parameter stays at its last manually-set value.

#### Controllers

Controllers provide real-time parameter manipulation:

| Controller Type | Behavior |
|-----------------|----------|
| Footswitch (FS) | Toggle or momentary switching |
| Expression (EXP) | Continuous sweep (volume, wah) |
| Variax | Per-string tuning and model |
| Snapshot | Discrete values per snapshot |

**Controller types for footswitches:**
- **Latching:** Toggle on/off. Press once = on, press again = off.
- **Momentary:** Active only while pressed. Release = off.

**Up to 64 parameters** can be assigned to controllers per preset.

#### Bypass Modes

Bypass determines what happens when a block is turned off:

- **True Bypass:** Signal passes through unchanged. No coloration.
  DSP is freed (partially).
- **Buffered Bypass:** Signal passes through a buffer. Maintains
  impedance and prevents signal loss in long chains.
- **Trail:** For time-based effects (delay, reverb). When bypassed,
  existing repeats/tails continue to ring out naturally instead of
  cutting off abruptly. The block continues using DSP until the tail fades.

### 4.5 Legacy Cabs vs. Dual Cabs

Helix has evolved its cabinet simulation over firmware versions:

**Single Cab block:**
- One speaker model, one microphone, adjustable distance.
- Lower DSP usage.
- Good for simple setups.

**Dual Cab block:**
- Two speaker models, each with their own microphone and distance settings.
- Includes a Pan parameter for stereo spread (e.g., Cab A hard left, Cab B hard right).
- Uses roughly twice the DSP of a single cab.
- Can be panned independently for width.

**Separate single cabs on parallel paths vs. Dual Cab:**
- Two separate cabs feeding a Mixer give more control: each can be panned
  anywhere, with independent level and EQ.
- The Dual Cab block provides a simpler interface but less routing flexibility
  (primarily hard-pan left/right).

**IR (Impulse Response) blocks:**
- Can load third-party impulse responses (WAV files).
- Capture the complete frequency response of a specific cab/mic/room combination.
- Typically more "realistic" than stock cabs but less adjustable.
- Standard IR lengths: 200ms or 500ms at 44.1/48/88.2/96 kHz, 24-bit.

**For .hlx file format purposes:**
- Cab types are encoded numerically in the JSON.
- Different cab block types occupy different DSP footprints.
- Dual cabs always consume more DSP than single cabs.

---

## 5. Competitive Analysis

### 5.1 Major Players in the Preset Market

#### Worship Tutorials (worshiptutorials.com)

**Approach:**
- Song-specific presets --- one preset per popular worship song.
- Multi-platform: Helix, HX Stomp, Fractal, Kemper, ToneX, Quad Cortex.
- Tutorial-first methodology: demonstrates how to build tones, not just
  provides downloads.
- Systematic process: record raw guitar into DAW while playing along with
  band stems, loop a section, build patches with modeling software.

**Business model:**
- WT Tone Pass (annual subscription): ~$99-149/year. Includes all new presets
  released that year (roughly one every 2-3 weeks = ~16-20 presets/year).
- Subscribers get 50% off additional guitar-based digital products.
- Individual presets available for purchase (typically $4.99 each).
- Free content available as lead generation.

**Key differentiator:** Context-aware mixing. Presets are built while playing
along with full band stems, ensuring they sit well in a mix rather than
sounding good in isolation.

#### Tone Junkie (tonejunkiestore.com)

**Approach:**
- Profile-based (primarily Kemper profiles, expanding to Helix and others).
- Worship performance packs organized by popular songs.
- Named profiles based on real amps (e.g., "Praises" based on Matchless Spitfire).

**Business model:**
- Individual packs: varies by size ($15-40 range).
- "Everything Worship Bundle": 150 performances, premium pricing.
- Worship Performance Packs: song-specific collections.
- Free sampler packs for lead generation.
- Impulse Response packs as a separate product line.

**Key differentiator:** Amp profile accuracy. Focuses on capturing the character
of specific physical amplifiers through profiling/capturing technology.

#### Jason Sadites (sadites.com)

**Approach:**
- Education-first content creator (YouTube) + premium presets.
- Template-based methodology: provides foundational preset structures that
  users customize with their preferred amp and cab.
- "ULTIMATE" presets: multi-snapshot presets with full effect arrays.
- Yamaha/Line 6 artist partnership lends official credibility.

**Business model:**
- Free template presets as lead generation and community building.
- Premium "ULTIMATE" preset bundles.
- YouTube ad revenue from extensive tutorial content.
- Tutorials cover: understanding EQ, using delays, managing sag and bias,
  microphone models --- comprehensive educational approach.

**Key differentiator:** Structured education. Teaches the "why" behind settings,
not just the "what." Template approach empowers users to customize.

#### Line 6 CustomTone (line6.com/customtone)

**Approach:**
- Official Line 6 community preset sharing platform.
- User-generated content --- anyone can upload presets.
- Free access, large volume, variable quality.

**Business model:**
- Free platform (drives Helix hardware sales).
- No quality control or curation.
- Community rating system for discovery.

**Key differentiator:** Volume and accessibility. Largest library of Helix presets.
Quality ranges from professional to beginner experiments.

### 5.2 What Makes a "Professional" Preset

Research reveals consistent differences between professional and amateur presets:

**Professional presets:**

1. **Mixed in context.** Built while playing along with full band stems or
   backing tracks. The tone is optimized to sit in a mix, not to sound
   impressive in isolation.

2. **Restrained effects.** Reverb and delay are present but controlled.
   Multiple users report needing to dial back reverb and delay significantly
   when using professional presets --- because pros set effects to be felt
   rather than heard.

3. **Proper gain staging.** Each block in the chain is calibrated so that
   engaging or disengaging any block doesn't create jarring volume jumps.
   Level matching between snapshots is meticulous.

4. **Snapshot-ready.** Professional presets use snapshots to provide multiple
   tones (clean, crunch, lead, ambient) within a single preset, with smooth
   transitions between them.

5. **DSP-efficient.** Blocks are chosen to maximize tone quality while leaving
   DSP headroom. Unnecessary blocks are removed.

6. **Musically appropriate compression.** Dynamics are controlled enough for
   consistency in a live band context but not so compressed that the tone
   feels lifeless.

**Amateur presets:**

1. **Built in isolation.** Tone sounds impressive solo but disappears or
   clashes in a band mix.

2. **Effects overload.** Too much reverb, too much delay, too many drive
   pedals. The "more is better" trap.

3. **Volume inconsistency.** Switching snapshots causes jarring volume
   changes. Engaging a drive pedal drastically changes overall level.

4. **Gain too high.** Excessive gain that sounds thick in isolation but
   turns to mush in a band context.

5. **No high-pass filtering.** Low-end rumble that conflicts with bass
   guitar and kick drum.

### 5.3 Pricing Models in the Market

| Model Type | Price Range | Example | Pros | Cons |
|------------|-------------|---------|------|------|
| Annual subscription | $99-149/yr | WT Tone Pass | Ongoing new content, song-specific | Recurring cost |
| Individual preset | $4.99 each | Various | Pay only for what you need | Expensive at scale |
| Bundles (5-25 presets) | $15-50 | Tone Junkie packs | Good value per preset | May not need all presets |
| Mega bundle (50+) | $75-200 | "Everything" packs | Best per-preset value | Large upfront cost |
| Free/community | $0 | CustomTone | No cost | Variable quality |
| Template + education | $0-50 | Jason Sadites | Learning value, customizable | Requires user skill |

**Market observations:**
- Song-specific presets command premium pricing because they solve an immediate,
  specific need ("I need to sound like THIS song on Sunday").
- Subscription models work well for worship market where new songs constantly
  release.
- The free tier (CustomTone, YouTube tutorials) drives hardware adoption and
  creates a funnel for premium products.
- Professional presets typically sell at a $3-7/preset price point.
  Bundles bring this down to $1-3/preset.

---

## Appendix A: Key Formulas Reference

### Delay Timing
```
delay_ms = (60000 / bpm) * multiplier

Multipliers:
  whole = 4.0, half = 2.0, quarter = 1.0
  eighth = 0.5, sixteenth = 0.25
  dotted_X = X * 1.5
  triplet_X = X * (2/3)
```

### Reverb Pre-delay (tempo-synced)
```
pre_delay_ms = (60000 / bpm) * factor
  factor: 0.05-0.2 depending on desired separation
```

### Frequency Ratios
```
octave_up = frequency * 2
octave_down = frequency / 2
harmonic_N = fundamental * N
```

### Gain Budget (simplified)
```
total_gain_db = sum(all_drive_and_boost_blocks)

Clean tone:  total_gain_db < 25
Crunch:      total_gain_db < 40
High gain:   total_gain_db < 55
```

### Compression Dynamics
```
output_above_threshold = input_above_threshold / ratio

Example: 12 dB above threshold at 4:1 ratio
  output = 12 / 4 = 3 dB above threshold
  gain_reduction = 12 - 3 = 9 dB
```

---

## Appendix B: Helix Amp Parameter Quick Reference

| Parameter | Low (1-3) | Medium (4-6) | High (7-10) | Default Use |
|-----------|-----------|--------------|-------------|-------------|
| Sag       | Tight, modern, fast | Balanced, natural | Spongy, vintage, slow | Metal=low, Blues=high |
| Bias      | Cold, clean, headroom | Balanced | Hot, warm, early breakup | Clean=low, Warm=high |
| Bias X    | Stable, consistent | Moderate dynamics | Deeply touch-sensitive | Metal=low, Blues=high |
| Hum       | Silent, modern | Subtle vintage vibe | Noisy, lo-fi | Usually 0-2 |
| Ripple    | Tight power supply | Subtle breathing | Obvious modulation | Usually 0-3 |

---

## Appendix C: Genre Template Quick Reference

### Blues Template
- **Amp:** Fender Deluxe or Tweed Bassman
- **Drive:** 3-5/10, light breakup
- **EQ:** Warm lows, boosted 800 Hz, sparkly highs
- **Compression:** 3:1-4:1, slow attack
- **Delay:** Quarter note, 15-25% mix, low feedback
- **Reverb:** Spring, 1-2s decay, 15-25% mix
- **Sag:** 5-8, Bias: 6-7, BiasX: 5-7

### Rock Template
- **Amp:** Marshall Plexi or JCM 800
- **Drive:** 5-7/10, crunchy
- **EQ:** Cut 400 Hz, boost 2-3 kHz for bite
- **Compression:** 4:1-6:1, medium attack
- **Delay:** Quarter note, 20-30% mix
- **Reverb:** Room or plate, 1-2s decay, 15-25% mix
- **Sag:** 4-6, Bias: 5-6, BiasX: 4-5

### Metal Template
- **Amp:** Mesa Rectifier or German high gain
- **Drive:** 7-9/10, heavy saturation
- **EQ:** HPF at 80 Hz, cut 300 Hz, boost 1.2 kHz and 3 kHz
- **Compression:** 6:1-8:1, fast attack for consistency
- **Delay:** None or subtle sixteenth
- **Reverb:** Minimal, short room if any
- **Sag:** 1-3, Bias: 4-5, BiasX: 2-4

### Worship Template
- **Amp:** Matchless, Vox AC30, or Litigator (Dumble)
- **Drive:** 3-5/10, edge of breakup
- **EQ:** Boosted upper mids (2-4 kHz), shimmer (6-8 kHz)
- **Compression:** 4:1, medium attack, preserves dynamics
- **Delay:** Dotted eighth, 25-35% mix, 30-45% feedback
- **Reverb:** Hall or modulated, 3-5s decay, 30-45% mix
- **Sag:** 5-7, Bias: 5-6, BiasX: 5-7

### Country Template
- **Amp:** Fender Twin or Deluxe
- **Drive:** 1-3/10, clean with compression
- **EQ:** Bright treble (7-8 kHz), moderate lows
- **Compression:** 6:1-10:1, fast attack (chicken picking)
- **Delay:** Slapback (40-120 ms), 30-40% mix, no feedback
- **Reverb:** Spring, short decay, 15-25% mix
- **Sag:** 3-5, Bias: 4-5, BiasX: 3-5

---

*Research compiled April 2026. Sources include Line 6 official documentation,
Sweetwater InSync articles, Neural DSP technical guides, community forums
(Line 6, The Gear Page, The Gear Forum), Worship Tutorials, Jason Sadites,
Tone Junkie, Guitar Gear Finder, and various music production resources.*
