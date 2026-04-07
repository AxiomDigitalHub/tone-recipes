# Set Patch Strategy Research

How gigging guitarists build "do-it-all" presets with snapshots to cover an entire setlist from a single patch. Research compiled for faderandknob.com.

---

## Table of Contents

1. [The Core Concept: Why Set Patches Exist](#the-core-concept)
2. [Worship Set Patches](#worship-set-patches)
3. [Classic Rock Cover Band](#classic-rock-cover-band)
4. [90s / Alternative Cover Band](#90s-alternative-cover-band)
5. [Blues / Classic Rock](#blues-classic-rock)
6. [Modern Worship / Ambient](#modern-worship-ambient)
7. [Metal Set Patch](#metal-set-patch)
8. [Country Set Patch](#country-set-patch)
9. [Effects-Heavy / Tom Morello Style](#effects-heavy-tom-morello)
10. [Worship Tutorials Deep Dive](#worship-tutorials-deep-dive)
11. [Cross-Platform Terminology](#cross-platform-terminology)
12. [The "Set Pack" Product Concept](#the-set-pack-product-concept)
13. [SET PACK PRODUCT ROADMAP](#set-pack-product-roadmap)

---

## The Core Concept: Why Set Patches Exist <a name="the-core-concept"></a>

### The Problem

A cover band guitarist playing a 3-hour gig (40-50 songs) does not want 50 separate presets. Switching between presets introduces:

- **Gap/silence** during preset changes (even on Helix, preset switching is not seamless)
- **Volume matching nightmares** across dozens of presets
- **Cognitive overload** remembering which preset goes with which song
- **Setlist inflexibility** -- if the singer calls an audible, you are scrolling through banks

### The Solution: The "Set Patch" Approach

Build 1-4 presets, each with 8 snapshots, that cover your entire gig. Snapshots switch instantly with zero gap, and all tones within a preset are inherently volume-matched because they share the same amp block and signal chain.

### The Debate: 1 Preset vs. 1 Preset Per Song

Forum consensus from The Gear Page, Line 6 Community, and The Gear Forum strongly favors a small number of "kitchen sink" presets over per-song presets:

- **Pro-set-patch argument**: A band has a cohesive "sound." Having one consistent amp tone that you ride across the night sounds more natural than jumping between wildly different amp models song to song. Volume matching is automatic. Setlist changes are trivial.
- **Pro-per-song argument**: You can nail the exact tone for each song. Best for tribute bands doing one artist.
- **Practical middle ground**: Most working cover band guitarists land on 2-4 presets (e.g., clean/Fender, crunch/Marshall, heavy/Mesa, acoustic sim) with 8 snapshots each. This covers 95% of gigs.

### The Proven Formula

One widely cited approach: a gigging musician covered 45 songs across three 1-hour sets using just 4 presets with 8 snapshots each:

1. Acoustic simulator preset
2. Fender clean with distortion block options
3. Marshall-type crunch/drive
4. Mesa-type heavy drive

### Snapshot + Stomp Hybrid Mode

The most practical live approach uses the Helix in snapshot/stomp hybrid mode:

- **Bottom row (footswitches 1-4)**: Snapshots -- Clean, Crunch, Drive, Lead
- **Top row (footswitches 5-8)**: Stomp toggles -- Boost, Chorus, Delay tap, Tremolo (or other per-song effects)

This gives you 4 core tones plus the ability to toggle individual effects on/off within any snapshot.

---

## 1. Worship Set Patches <a name="worship-set-patches"></a>

### Why This Is the Biggest Market

According to Fender's own market research, approximately one-third of all musical instruments sold are used for Christian praise and worship music. About one million musicians perform weekly at their church. This makes worship guitarists the single largest addressable segment for preset products.

Worship guitarists are heavy preset buyers because:

- They need to sound like the recording every Sunday
- Many are volunteer musicians, not professionals -- they want plug-and-play solutions
- The tonal vocabulary is specific and consistent (delay-heavy, reverb-heavy, clean-to-light-drive)
- New songs rotate in weekly, requiring fast tone preparation
- Multiple preset vendors (Worship Tutorials, Sunday Shred, That Worship Sound, GuitarforHISGLORY) have built entire businesses on this market

### The Standard Worship Amp

The **Vox AC30** is the undisputed worship guitar standard. On Helix, the models used are:

- **Essex A30** (modern AC30) -- the most common
- **Essex A15** (AC15 variant)
- **Matchless DC30** (similar chime character, slightly more headroom)

The AC30 is preferred because:
- Beautiful clean-to-breakup transition
- Chimey, sparkly top end that sits well under vocals
- Responds dynamically to guitar volume knob for gain staging
- Pairs perfectly with transparent overdrive pedals (Klon, Tubescreamer)

Secondary amp choices include the Fender Deluxe Reverb (Fullerton model on Helix) for a warmer, darker worship tone.

### Standard Worship Snapshot Layout (8 Snapshots)

Based on analysis of Worship Tutorials, Sunday Shred, and GuitarforHISGLORY presets, the standard worship snapshot layout is:

| Snapshot | Name | Purpose | Gain Level |
|----------|------|---------|------------|
| 1 | CLEAN | Base clean tone with subtle reverb + quarter note delay | Unity |
| 2 | DRIVE | Light overdrive (Klon/Minotaur always-on + amp gain bump) | Low |
| 3 | DRIVE+ | Medium drive (add Tubescreamer or second OD) | Medium |
| 4 | LEAD | Full drive with mid boost for solos | Medium-High |
| 5 | CLEAN AMBI | Clean tone with big modulated reverb + dotted eighth delay | Unity |
| 6 | AMBI DRIVE | Drive tone with ambient effects | Low-Medium |
| 7 | ROCK RHYTHM | Heavier crunch for rock-influenced worship songs | Medium-High |
| 8 | SWELLS | Volume swells with maximum reverb + shimmer + delay | Unity |

### Essential Worship Effects

- **Klon/Minotaur overdrive**: Almost always on, set low for compression and mid push
- **Tubescreamer**: Stacked with Klon for heavier drive sections
- **Dotted eighth note delay**: The signature worship delay (a la U2/The Edge)
- **Quarter note delay**: Standard rhythmic delay, often used on cleans
- **Plate reverb**: Subtle always-on reverb for depth
- **Modulated/Glitz reverb**: Big ambient reverb for swells and pads
- **Shimmer reverb**: Octave-up reverb for ethereal sections
- **Tremolo**: For specific songs
- **Chorus**: Light chorus for clean sections

### Standard Worship Signal Chain

```
Guitar -> Volume Pedal/Expression -> Compressor -> Klon (Minotaur) -> Tubescreamer ->
Amp (AC30) -> Cab/IR -> Chorus/Mod -> Transistor Tape Delay (1/4) ->
Vintage Digital Delay (dotted 1/8) -> Plate Reverb -> Glitz/Shimmer Reverb
```

### Gain Staging Strategy

The worship gain staging approach is distinctly different from rock/metal:

1. **Clean**: Amp drive at edge-of-breakup (~3-4 on the drive knob). Guitar volume rolled back slightly cleans up completely.
2. **Light drive**: Klon/Minotaur always on at low gain, pushing the amp into mild breakup.
3. **Medium drive**: Add Tubescreamer on top of Klon for more saturation.
4. **Full drive**: Increase amp drive parameter via snapshot + both ODs engaged.
5. **Swells**: Return to clean amp settings, maximize reverb/delay, use expression pedal or auto-volume swell.

The key insight: worship guitar almost never goes past "classic rock" gain levels. The maximum gain in a worship preset is roughly equivalent to a classic rock rhythm tone.

---

## 2. Classic Rock Cover Band <a name="classic-rock-cover-band"></a>

### The Challenge

Covering Led Zeppelin through GNR through Aerosmith requires a gain range from sparkly clean to moderate high-gain. The tonal common ground is the British crunch sound.

### Base Amp Model

The **Marshall JCM800** (Brit 2204 on Helix) is the most versatile choice for classic rock:

- Cleans up beautifully with the guitar volume knob
- Natural crunch at moderate drive settings
- Enough gain for GNR-level saturation when pushed with a drive pedal
- Sits in the mix like a real Marshall should

Alternative: **Plexi (Brit Plexi)** for a more vintage flavor, but it may lack gain for harder material without heavy pedal stacking.

### Snapshot Layout

| Snapshot | Name | Purpose | Example Songs |
|----------|------|---------|---------------|
| 1 | CLEAN | Sparkling Fender-style clean | Hotel California intro, Wonderful Tonight |
| 2 | EDGE | Amp just breaking up, responsive to pick attack | Brown Eyed Girl, Sultans of Swing |
| 3 | CRUNCH | Medium Marshall crunch | Back in Black, Rock and Roll |
| 4 | RHYTHM | Full rhythm distortion | Sweet Child O' Mine rhythm, Livin on a Prayer |
| 5 | LEAD | Solo boost with delay | Comfortably Numb solo, Free Bird |
| 6 | HEAVY | Maximum gain for heavier tracks | Welcome to the Jungle, Paranoid |
| 7 | ACOUSTIC | Acoustic simulator for unplugged moments | Wish You Were Here, Dust in the Wind |
| 8 | SPECIAL | Wah, phaser, or song-specific effect | Voodoo Child wah, Eruption |

### Signal Chain

```
Guitar -> Wah -> Compressor -> Tubescreamer -> Amp (JCM800) -> Cab/IR ->
Chorus -> Phaser -> Analog Delay -> Hall Reverb
```

### Gain Staging Strategy

- The JCM800 amp drive sits at about 5-6 (noon) as the "home base" crunch tone
- Rolling guitar volume to 4-5 gets a usable clean
- A Tubescreamer in front pushes it into lead territory
- For true cleans, snapshots can drop the amp drive to 2-3
- For heavy tones, snapshots bump drive to 7-8 plus engage the Tubescreamer

### Key Settings

- **Amp drive responsive to guitar volume**: Set the amp drive at the crunch sweet spot where rolling back the guitar volume cleans up. This is the single most important technique for a versatile set patch.
- **Master volume consistency**: Use the Channel Volume parameter (not Drive) to level-match between snapshots.
- **Delay choices**: Analog delay for classic rock warmth. Tap tempo essential for live use.

---

## 3. 90s / Alternative Cover Band <a name="90s-alternative-cover-band"></a>

### The Challenge

This is one of the hardest genres to cover with a single preset because the bands had wildly different tones:

- **Nirvana**: DS-1 into a cranked Twin or JCM800 -- buzzy, fizzy, lo-fi
- **Pearl Jam**: JCM800, more refined Marshall crunch
- **Soundgarden**: Mesa Dual Rectifier, dropped tuning, heavy scooped mids
- **RHCP**: Clean funk tones through a Marshall Silver Jubilee
- **Alice In Chains**: Thick, dark, Bogner/Mesa territory
- **STP**: Versatile -- clean to heavy, Marshall-based

### Finding Common Ground

The compromise amp for 90s/alt is either:

1. **JCM800 (Brit 2204)**: Covers Pearl Jam, Nirvana, STP, and gets close enough to Soundgarden with a boost pedal. Best single-amp choice.
2. **Dual Rectifier (Cali Rectifire on Helix)**: Covers Alice In Chains, Soundgarden, heavier STP. Cleans are usable but not as sparkly.
3. **Best of both worlds**: Use two amp blocks -- JCM800 for cleaner/crunch material, Rectifier for heavy songs. Snapshots switch between them.

### Snapshot Layout

| Snapshot | Name | Purpose | Example Songs |
|----------|------|---------|---------------|
| 1 | CLEAN | Fender-style clean for RHCP funk, STP ballads | Under the Bridge, Plush (intro) |
| 2 | CRUNCH | Light Marshall drive | Alive, Interstate Love Song |
| 3 | GRUNGE | Classic 90s grunge tone (DS-1 style buzz) | Smells Like Teen Spirit, Even Flow |
| 4 | HEAVY | Dropped, scooped, heavy | Black Hole Sun, Would?, Man in the Box |
| 5 | LEAD | Mid-boosted solo tone with delay | Alive solo, Yellow Ledbetter |
| 6 | FUNK | Clean with compression, envelope filter | Give It Away, Californication |
| 7 | WAH | Wah engaged for specific songs | Bulls on Parade, Enter Sandman |
| 8 | ACOUSTIC | Acoustic sim for unplugged moments | About a Girl (unplugged) |

### Signal Chain

```
Guitar -> Wah -> Compressor -> Rat/DS-1 style distortion -> Tubescreamer ->
Amp (JCM800 or Dual Rec) -> Cab/IR -> Chorus -> Flanger -> Analog Delay -> Hall Reverb
```

### Key Insight: Embrace the Compromise

A 90s cover band preset will never nail every tone perfectly. The goal is to be "close enough" that the audience (who are not tone nerds) recognizes the song. The important things to get right:

- The buzzy, aggressive feel for grunge (a Rat or DS-1 pedal model does 80% of the work)
- The clean funk tone for RHCP (compressor + clean amp channel)
- The heavy, dark tone for Alice In Chains/Soundgarden (high gain + darker EQ)
- A usable wah for Morello/Cantrell moments

---

## 4. Blues / Classic Rock <a name="blues-classic-rock"></a>

### The Challenge

SRV to Clapton to Hendrix to BB King spans a wide tonal range but shares a common philosophy: amp breakup and touch sensitivity matter more than pedals.

### Base Amp Model

The **Fender Deluxe Reverb** or **Twin Reverb** (US DLX Nrm or US Double Nrm on Helix) is the foundation:

- SRV's entire sound was a cranked Fender with a Tubescreamer
- Clapton (post-Cream) used Fender Twins
- BB King's Lucille tone was a clean, warm amp
- Hendrix used Marshalls, but a Fender-based preset with a fuzz covers his cleaner material

For more Marshall-leaning blues (Hendrix, Clapton Bluesbreakers era), a **Plexi** model works, or use it as a secondary amp block.

### Snapshot Layout

| Snapshot | Name | Purpose | Example Songs |
|----------|------|---------|---------------|
| 1 | CLEAN | Warm, round Fender clean | The Thrill Is Gone, Wonderful Tonight |
| 2 | EDGE | Amp barely breaking up, very touch sensitive | Lenny, Crossroads |
| 3 | CRUNCH | Tubescreamer pushing amp into breakup | Pride and Joy, Layla |
| 4 | LEAD | Full drive for screaming leads | Texas Flood, Still Got the Blues |
| 5 | FUZZ | Fuzz Face for Hendrix material | Purple Haze, Foxy Lady |
| 6 | SLIDE | Slightly compressed, medium drive for slide guitar | Dust My Broom style |
| 7 | SPARKLE | Bright clean with tremolo and reverb | Born Under a Bad Sign (Albert King vibe) |
| 8 | BOOST | Lead tone + mid boost + delay for big solos | Comfortably Numb |

### Signal Chain

```
Guitar -> Compressor (light) -> Fuzz Face -> Tubescreamer -> Klon ->
Amp (Deluxe Reverb) -> Cab/IR -> Uni-Vibe -> Tremolo -> Analog Delay -> Spring Reverb
```

### Gain Staging Strategy

Blues gain staging is all about **the guitar volume knob**:

- Set the amp drive so that with the guitar volume on 10 and a Tubescreamer engaged, you get a singing lead tone
- Roll the guitar volume to 7-8 for rhythm crunch
- Roll it to 5-6 for edge-of-breakup
- Roll it to 3-4 for clean

This is how SRV, Clapton, and Hendrix actually controlled their dynamics. A good blues set patch should reward this approach.

### Key Settings

- **Amp drive**: Set at the sweet spot where it responds to guitar volume (typically 5-7 on the drive)
- **Tubescreamer**: Low gain, high level -- use it as a clean boost to push the amp, not as a distortion source
- **Spring reverb**: Always on, subtle. Essential for the Fender blues sound
- **Analog delay**: 300-400ms, 2-3 repeats, low mix. Adds depth without being obvious.

---

## 5. Modern Worship / Ambient <a name="modern-worship-ambient"></a>

### The Market Opportunity

Modern worship / ambient is the single most commercially viable set patch category. The audience is:

- Millions of church guitarists worldwide
- Many are intermediate players who want professional-sounding tones without deep tweaking
- New songs from Hillsong, Bethel, Elevation, and Maverick City drop constantly, creating ongoing demand
- The "sound" is highly codified -- there is a specific formula that most worship guitarists follow

### The Ambient Worship Sound

The ambient worship sound is characterized by:

- **Huge, immersive reverbs** that create a sense of space
- **Rhythmic delays** (dotted eighth is the standard, quarter note secondary)
- **Volume swells** using expression pedal for pad-like textures
- **Shimmer effects** (octave-up reverb) for ethereal moments
- **Minimal gain** -- the focus is on clean tones with texture, not distortion
- **Stereo spread** -- many worship rigs run stereo for a wider, more immersive sound

### Key Artists and Their Signatures

- **Hillsong United (Nigel Hendroff)**: AC30, Analogman King of Tone, heavy delay use, POG for octave effects
- **Bethel Music**: Clean tones, shimmer, ambient pads
- **Elevation Worship**: Modern production, big reverbs, dotted eighth delays
- **Maverick City**: More organic, less effects-heavy, but still ambient

### Base Amp Model

Same as standard worship: **AC30 (Essex A30)** or **Matchless DC30 (Matchstick Ch1)**

### Snapshot Layout (Ambient-Focused)

| Snapshot | Name | Purpose |
|----------|------|---------|
| 1 | CLEAN PAD | Clean with huge reverb, for playing ambient pads between songs |
| 2 | DOTTED 8TH | Clean with signature dotted eighth delay |
| 3 | SHIMMER | Clean with shimmer reverb + delay for ethereal moments |
| 4 | LIGHT DRIVE | Klon-pushed breakup with ambient effects |
| 5 | DRIVE AMBI | Medium drive with modulated delay and big reverb |
| 6 | SWELL | Expression pedal volume swell with max reverb |
| 7 | OCTAVE | POG/pitch block for octave-up leads |
| 8 | LEAD | Full drive with delay for melodic leads |

### Signal Chain

```
Guitar -> Volume/Expression Pedal -> Compressor -> POG/Pitch -> Klon ->
Tubescreamer -> Amp (AC30) -> Cab/IR -> Chorus -> Dual Delay (1/4 + dotted 1/8) ->
Plate Reverb -> Shimmer/Glitz Reverb
```

### The "Worship Tone Formula"

The widely replicated formula is:

1. **AC30 amp** at edge of breakup
2. **Klon (Minotaur) always on** at low gain for compression, smoothness, and mid push
3. **Dotted eighth note delay** as the primary rhythmic texture
4. **Big modulated reverb** for ambient space
5. **Expression pedal** mapped to volume for swells
6. **Shimmer reverb** on a stomp switch for special moments

This formula originated from U2/The Edge and was adopted and refined by the worship guitar community.

---

## 6. Metal Set Patch <a name="metal-set-patch"></a>

### The Challenge

Metal spans from Metallica's tight thrash to Pantera's groove metal to modern djent. The gain range is narrower than other genres (everything is high gain), but the voicing differences are significant.

### Base Amp Model

Options ranked by versatility:

1. **Peavey 5150 (Line 6 PV Panama)**: Covers Pantera, Van Halen, modern metal, djent. Extremely versatile high-gain amp.
2. **Mesa Dual Rectifier (Cali Rectifire)**: Covers Metallica (post-Black Album), Alice In Chains, modern metal.
3. **JCM800 boosted with a Tubescreamer**: Covers Metallica (early), Megadeth, thrash. Less gain but tighter low end.

For maximum versatility, the 5150 is the best single choice. For a "Metallica to modern" range, the Rectifier works well.

### Snapshot Layout

| Snapshot | Name | Purpose | Example Songs |
|----------|------|---------|---------------|
| 1 | CLEAN | Clean with chorus for ballad intros | Fade to Black intro, Nothing Else Matters |
| 2 | CRUNCH | Medium gain for verse riffs | Enter Sandman verse, Walk verse |
| 3 | RHYTHM | Tight high-gain rhythm | Master of Puppets, Cowboys From Hell |
| 4 | HEAVY | Maximum gain, scooped mids for chug | Djent riffs, Meshuggah-style |
| 5 | LEAD | Mid-boosted solo tone with delay | One solo, Floods solo |
| 6 | MELODY | Clean with delay for melodic interludes | To Live Is to Die, Orion |
| 7 | HARMONICS | Settings optimized for pinch harmonics and dive bombs | Cemetery Gates |
| 8 | BOOST | Lead tone + extra volume for big solos | Kirk Hammett wah solo |

### Signal Chain

```
Guitar -> Noise Gate -> Tubescreamer (tight, low gain) -> Amp (5150/Recto) ->
Cab/IR -> Noise Gate (post-amp) -> Chorus -> Delay -> Hall Reverb
```

### Noise Gate Strategy

Noise gates are essential for metal and require careful placement:

- **Pre-amp gate**: Place before the amp block. Set threshold so it cuts noise between riffs but does not choke sustained notes. This is the primary gate.
- **Post-amp gate (optional)**: A second gate after the amp/cab cleans up any remaining hiss. Set with a lower threshold than the pre-amp gate.
- **Helix Hard Gate**: The Hard Gate model works well for djent-style staccato playing where you want the note to cut off sharply.
- **Sidechain input**: Use the guitar's direct input as the sidechain source for the gate so the gate responds to pick attack rather than the already-distorted signal.

### Gain Staging Strategy

Metal gain staging works differently from other genres:

- **Do not max out the amp gain**. Set it to 6-7 (not 10). More gain = more fizz and less note definition.
- **Use a Tubescreamer in front** with the gain at 0 and level at max. This tightens the low end and pushes the amp's front end. This is the "secret weapon" of modern metal tone.
- **Channel Volume** for snapshot volume matching -- keep rhythm tones slightly quieter than lead tones.
- **Presence and treble management**: High-gain amps can get harsh. Use presence at 4-5, not cranked.

---

## 7. Country Set Patch <a name="country-set-patch"></a>

### Base Amp Model

The **Fender Twin Reverb (US Double Nrm)** or **Fender Deluxe Reverb (US DLX Nrm)** is the country standard:

- Tons of clean headroom (essential for chicken pickin)
- The "Nashville" sound is built on clean Fenders
- Brad Paisley, Brent Mason, and most Nashville session players use Fender amps

For Keith Urban's driven tones, a **Fender Tweed Twin (Tweed)** or even a **Vox AC30** can be used as a secondary voice.

### Snapshot Layout

| Snapshot | Name | Purpose | Example Songs |
|----------|------|---------|---------------|
| 1 | CLEAN | Sparkling Tele clean with compression | Any Brad Paisley clean |
| 2 | TWANG | Extra compression + slapback for chicken pickin | Mud on the Tires |
| 3 | CRUNCH | Light gritty drive for country rock | Keith Urban style |
| 4 | LEAD | Compressed lead with delay | Brad Paisley solo |
| 5 | SLAPBACK | Rockabilly-influenced slapback delay | Folsom Prison Blues |
| 6 | TREMOLO | Clean with tremolo for ballads | Ring of Fire |
| 7 | DRIVE | Heavier drive for country rock | Keith Urban, Eric Church |
| 8 | STEEL SIM | Volume pedal swells to simulate pedal steel | Ballad fills |

### Signal Chain

```
Guitar -> Compressor (LA Studio Comp) -> Boost/Klon -> Tubescreamer ->
Amp (Twin Reverb) -> Cab/IR -> Tremolo -> Slapback Delay -> Analog Delay -> Spring Reverb
```

### Key Settings

- **Compressor is king**: Country guitar lives on compression. The LA Studio Comp on Helix works well. Set the attack slightly slow so the pick transient snaps through before the compressor kicks in -- this is essential for chicken pickin tone.
- **Brad Paisley does not use a compressor pedal**: He relies on his amp's natural compression from cranking it. His "secret" is slapback delay, which he says changes his amp's response and feel.
- **Slapback delay**: 80-120ms, single repeat, moderate mix. This is a country essential.
- **Spring reverb**: Always on, moderate depth. The Fender spring reverb sound is the country reverb.
- **Guitar choice matters**: Telecaster bridge pickup is the standard. Strat players should use position 1 or 2.

---

## 8. Effects-Heavy / Tom Morello Style <a name="effects-heavy-tom-morello"></a>

### The Challenge

Tom Morello's sound relies on effects that are not typically part of a standard set patch:

- **Digitech Whammy**: Pitch shifting up/down across a range
- **Kill switch**: Rapid on/off for staccato/DJ-style effects
- **Wah**: Used as a tone-shaping tool, not just for solos
- **Delay**: Used as a rhythmic instrument, not just an effect

### The Hybrid Approach: Snapshot + Stomp Mode

For effects-heavy presets, the pure snapshot approach breaks down. You need real-time stomp control. The solution is a **hybrid mode**:

- **Bottom row**: 4 snapshots for your base tones (Clean, Crunch, Heavy, Lead)
- **Top row**: 4 stomp switches for real-time effect control (Whammy, Kill Switch, Delay On/Off, Wah)

Alternatively, switch between Snapshot and Stomp views during performance. Helix allows you to toggle between views with a footswitch hold.

### Signal Chain

```
Guitar -> Wah -> Whammy/Pitch -> Kill Switch (volume block) ->
Amp (JCM800 or Plexi) -> Cab/IR -> Flanger -> Digital Delay -> Hall Reverb
```

### Snapshot Layout

| Snapshot | Name | Purpose |
|----------|------|---------|
| 1 | CLEAN | Clean tone for verses |
| 2 | CRUNCH | Marshall crunch for rhythm |
| 3 | HEAVY | High gain for heavy riffs |
| 4 | LEAD | Solo tone with delay |

Plus stomp switches:

| Stomp | Effect | Use |
|-------|--------|-----|
| 5 | Whammy | Pitch shifting for solos and effects |
| 6 | Kill Switch | Volume block assigned to momentary for staccato |
| 7 | Delay Toggle | Turn delay on/off for rhythmic effects |
| 8 | Wah Toggle | Engage/disengage wah |

### Key Implementation Details

- **Kill switch**: Assign a Volume block to a footswitch in momentary mode. When you press it, volume goes to zero. Release and it comes back. This simulates the hardware kill switch Morello uses.
- **Whammy**: Use the Pitch Wham block on Helix with expression pedal assignment. Set the range to +2 octaves for classic Morello sounds.
- **Delay as instrument**: Set a long delay (800ms+) with high feedback, then use the kill switch to create rhythmic patterns with the repeats.

---

## 9. Worship Tutorials Deep Dive <a name="worship-tutorials-deep-dive"></a>

### Business Model

Worship Tutorials (worshiptutorials.com) is the dominant preset vendor in the worship guitar space. Their approach:

- **Song-specific presets**: Individual patches designed to replicate the guitar tone of specific worship songs (e.g., "Praise" by Elevation Worship)
- **Versatile "building block" presets**: Foundation patches that users can customize
- **Tone Match series**: Presets modeled after specific real amps (e.g., 1964 AC30)
- **Multi-platform**: Helix, Quad Cortex, Kemper, Fractal, TONEX
- **Bundled with Sweetwater**: Exclusive worship packages sold through Sweetwater, the largest online instrument retailer

### Snapshot Naming Convention

Worship Tutorials uses a consistent naming scheme across their presets:

1. **CLEAN** -- Base clean tone with subtle delay
2. **DRIVE** -- Light overdrive
3. **DRIVE+** -- Medium overdrive (stacked drives)
4. **P&W LEAD** -- Praise and worship lead tone
5. **CLEAN AMBI** -- Clean with ambient effects
6. **AMBI DRIVE** -- Drive with ambient effects
7. **ROCK RHYTHM** -- Heavier crunch
8. **SWELLS** -- Maximum reverb/delay for volume swells

### Signal Chain Template

Worship Tutorials uses a consistent chain across most presets:

```
Minotaur (Klon) -> [Second OD] -> Amp (AC30/Matchless) -> Cab/IR ->
Transistor Tape (1/4 delay) -> Vintage Digital (dotted 1/8 delay) ->
Plate Reverb -> Glitz Reverb
```

Additional blocks activated per-snapshot:
- Cosmos Echo (ambient delay for swells)
- Chorus/Modulation
- Amp Gain toggle (additional gain staging via amp drive parameter)

### "Building Blocks" Approach

Worship Tutorials offers "building blocks" patches -- individual effect category patches (drives, reverbs, delays, modulation) that users can copy-paste into their own presets. This is clever because:

1. It upsells users from single presets to the full ecosystem
2. It positions WT as the knowledge authority, not just a preset seller
3. It creates recurring purchases as users build and modify

### Why Worship Guitarists Are the Biggest Preset Buyers

1. **Weekly performance pressure**: Unlike a gigging band that might play twice a month, worship guitarists play every single Sunday
2. **Song rotation**: New songs enter the setlist constantly as churches follow trends from Hillsong, Bethel, Elevation
3. **Time constraints**: Most worship guitarists are volunteers with day jobs -- they do not have hours to tweak tones
4. **Specific tonal expectations**: Worship leaders and music directors expect the guitar to sound like the recording
5. **Community-driven**: Worship guitarist Facebook groups, forums, and YouTube channels create a strong word-of-mouth network
6. **Lower technical skill**: Many worship guitarists are intermediate players who are intimidated by deep preset editing
7. **Willingness to pay**: Churches often have equipment budgets, and $5-15 per preset is trivial

---

## 10. Cross-Platform Terminology <a name="cross-platform-terminology"></a>

Since faderandknob.com covers multiple platforms, it is important to use consistent language:

| Concept | Helix | Quad Cortex | Fractal (Axe-FX) | Kemper | Katana |
|---------|-------|-------------|-------------------|--------|--------|
| A saved tone | Preset | Preset | Preset | Rig | Patch/Tone Setting |
| Variations within a tone | Snapshot (8) | Scene (8) | Scene (8) | Performance Slots (5) | N/A (limited) |
| Individual effect toggle | Stomp | Stomp | Stomp | Stomp | Stomp |
| Collection of presets | Setlist | Setlist | Bank | Performance | Bank |
| Switching gap | Seamless (snapshots) | Seamless (scenes) | Seamless (scenes) | Minimal | Gap between patches |

**Important note**: The Katana does not have a true snapshot/scene system. Its "set patch" equivalent is limited -- users rely on channel switching and a few stomp toggles. Set pack content for Katana would need a fundamentally different structure (multiple Tone Settings organized in a bank rather than one patch with snapshots).

---

## 11. The "Set Pack" Product Concept <a name="the-set-pack-product-concept"></a>

### What a Set Pack Is

A **Set Pack** is a downloadable product designed for faderandknob.com that contains:

1. **A single preset file** (.hlx, .json, etc.) with 8 snapshots covering an entire genre or setlist
2. **A Setlist Mapper document** -- a reference guide showing which snapshot to use for which song
3. **A Setup Guide** -- how to load the preset, recommended global settings, guitar/pickup recommendations
4. **A Signal Chain Diagram** -- visual of the effects chain with explanations
5. **Song-by-Snapshot Cheat Sheet** -- printable one-pager for the music stand

### How It Differs From Individual Song Recipes

Our existing 50 song recipes are great for learning how to nail ONE specific tone. A Set Pack solves a different problem:

| | Song Recipe | Set Pack |
|---|---|---|
| **Use case** | "I want to sound exactly like Sweet Child O' Mine" | "I'm playing a GNR tribute show and need one preset for the whole set" |
| **Scope** | 1 song, 1 tone (maybe 2-3 variations) | 20-40 songs, 8 tones that cover them all |
| **Target user** | Hobbyist learning a song at home | Gigging musician preparing for a show |
| **Value prop** | Accuracy to the original | Convenience and reliability on stage |
| **Relationship to site** | Standalone content / free or low-cost | Premium product / higher price point |

### The Setlist Mapper

The most valuable component of a Set Pack. Example for a "Classic Rock Set Pack":

```
SETLIST MAPPER: Classic Rock Set Pack
======================================

Song                        | Snapshot | Notes
--------------------------- | -------- | -----
Hotel California (Eagles)   | 1-CLEAN  | Use neck pickup. Switch to 5-LEAD for solo.
Brown Eyed Girl (Van M.)    | 2-EDGE   | Stay here entire song.
Back in Black (AC/DC)       | 3-CRUNCH | Angus rhythm. 5-LEAD for solo.
Sweet Child O' Mine (GNR)   | 4-RHYTHM | Intro on 1-CLEAN. Verse on 4. Solo on 5-LEAD.
Comfortably Numb (Floyd)    | 1-CLEAN  | Verse. Switch to 5-LEAD for solos.
Livin' on a Prayer (Bon J.) | 4-RHYTHM | Talk box sim not included. Use 3-CRUNCH for verse.
...
```

This is the killer feature. No other preset vendor provides this level of practical guidance for live performance.

### Product Bundle Options

1. **Single Set Pack**: One genre, one preset, one setlist mapper. ($9.99-14.99)
2. **Genre Bundle**: 2-3 related set packs for a genre (e.g., Classic Rock + Southern Rock + 80s Rock). ($24.99-29.99)
3. **Gigging Guitarist Bundle**: 4-5 set packs covering the most common cover band genres. ($39.99-49.99)
4. **Platform-specific**: Each set pack available for Helix, Quad Cortex, Fractal, Kemper. Same setlist mapper works across all platforms.

---

## SET PACK PRODUCT ROADMAP <a name="set-pack-product-roadmap"></a>

### Phase 1: Launch Genres (Ranked by Market Size)

| Priority | Genre | Why | Estimated Market Size |
|----------|-------|-----|----------------------|
| 1 | **Modern Worship / Ambient** | Largest addressable market. 1M+ weekly church musicians. Highest willingness to pay. Most codified "sound." | Very Large |
| 2 | **Classic Worship (Hymns + Contemporary)** | Complements #1. Targets the other half of church guitarists who play a mix of hymns and modern songs. | Large |
| 3 | **Classic Rock Cover Band** | The most common cover band genre. Every bar band needs this. | Large |
| 4 | **90s / Alternative** | Huge nostalgia market. Many active tribute and cover bands. | Medium-Large |
| 5 | **Blues / Classic Rock** | Dedicated, passionate audience. Blues jam nights are everywhere. | Medium |
| 6 | **Country** | Nashville is big business, and country cover bands are common in many regions. | Medium |
| 7 | **Metal** | Dedicated but niche. Metal players tend to DIY their tones more than other genres. | Medium |
| 8 | **Effects-Heavy / Experimental** | Small but passionate niche. Good for brand differentiation. | Small |

### Phase 2: Expansion Packs

After launching the core genres:

- **Band-specific set packs**: "The GNR Set Pack" -- one preset covering their entire catalog
- **Decade-specific**: "The 80s Set Pack," "The 70s Set Pack"
- **Subgenre packs**: "Southern Rock Set Pack," "Brit Pop Set Pack," "Pop Punk Set Pack"
- **Setlist-specific**: "The Wedding Band Set Pack," "The Corporate Event Set Pack"
- **Platform expansions**: Port each pack to every supported platform

### Template for Each Set Pack

Every Set Pack ships with:

1. **Preset file(s)** for the target platform
2. **Setlist Mapper** (PDF) -- 30-50 songs mapped to snapshots with performance notes
3. **Setup Guide** (PDF) -- loading instructions, global settings, guitar/pickup recommendations
4. **Signal Chain Diagram** (image) -- visual chain with block-by-block explanations
5. **Quick Reference Card** (PDF) -- one-page snapshot summary for the music stand
6. **Video walkthrough** (optional, adds value) -- 5-10 minute demo of the preset in action

### Pricing Recommendation

Based on market research of existing preset vendors:

| Product | Price | Rationale |
|---------|-------|-----------|
| Individual Set Pack | $12.99-14.99 | Higher than a single-song preset ($3-8) because it includes the setlist mapper, docs, and covers 30+ songs |
| Genre Bundle (2-3 packs) | $24.99-29.99 | ~30% discount vs. individual |
| Gigging Bundle (4-5 packs) | $39.99-49.99 | ~40% discount vs. individual |
| Worship Mega Bundle (all worship packs) | $29.99-34.99 | Target the largest market with a comprehensive offering |

The setlist mapper and documentation justify a premium over raw preset files. No one else in the market is providing this level of practical, gig-ready guidance.

### Integration With Existing Recipe Content

The Set Pack strategy amplifies the value of our existing 50 song recipes:

1. **Upsell path**: A user reads our free "Sweet Child O' Mine" tone recipe, then sees "Want to cover GNR's entire catalog from one preset? Get the Classic Rock Set Pack."
2. **Cross-reference**: Each Set Pack's setlist mapper links back to individual song recipes for users who want to go deeper on specific tones.
3. **Content flywheel**: New song recipes feed into set packs. New set packs drive traffic to song recipes.
4. **SEO synergy**: "Helix worship preset" and "worship set patch" are high-intent search terms. Set pack landing pages capture this traffic.
5. **Authority building**: Moving from "here is how to sound like X song" to "here is how to run your entire gig" elevates faderandknob.com from a recipe site to a trusted gigging resource.

### Key Differentiators vs. Competition

What makes faderandknob.com Set Packs different from Worship Tutorials, Sunday Shred, ChopTones, etc.:

1. **The Setlist Mapper**: No competitor provides song-by-song snapshot guidance for 30+ songs. This is the killer feature.
2. **Multi-platform**: Most vendors are platform-specific. faderandknob.com covers Helix, Quad Cortex, TONEX, Katana, Kemper, and Fractal.
3. **Genre breadth**: Worship Tutorials only does worship. ChopTones does song-specific packs. No one does genre-wide set packs with setlist mapping across all genres.
4. **Integration with recipes**: The existing recipe library provides depth that no preset-only vendor can match.
5. **Educational component**: Each set pack teaches why the preset is built the way it is, not just "load and play."

### Launch Priority Action Items

1. Build the Modern Worship Set Pack first -- largest market, most codified sound, clearest product-market fit
2. Build the Classic Rock Set Pack second -- broadest appeal, validates the concept outside worship
3. Create a free "sample" set pack (e.g., a simplified 4-snapshot worship preset) as a lead magnet
4. Write a flagship article: "How to Build a Set Patch for Your Cover Band" that drives organic traffic and positions the set pack products
5. Partner with worship guitarist YouTubers for launch promotion
6. Build set packs for Helix first (largest modeler user base), then port to Quad Cortex and Fractal

---

*Research compiled April 2026 for faderandknob.com*
