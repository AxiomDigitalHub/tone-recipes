---
title: "Epiphone's Lzzy Hale Explorer Custom Ships With a New High-Output Humbucker — And That's a Gain Staging Problem Nobody Will Warn You About"
date: "2026-08-19"
category: "new-gear"
slug: "epiphone-lzzy-hale-explorer-custom-probucker-ignite"
excerpt: "Epiphone unveiled the limited-edition Lzzy Hale Explorer Custom this week: mahogany body, ebony board, Black Diamond Holographic Sparkle, hardshell case included, €999, mid-September. The spec that matters isn't the finish — it's the new ProBucker Ignite humbuckers. Swap a hotter pickup into a preset dialed for a PAF and your amp model is now clipping at a different point in its transfer curve. Here's the measurement, the correction, and where to land the knobs for a Halestorm-adjacent tone on Helix and Quad Cortex."
source_url: "https://www.gibson.com/products/epiphone-lzzy-hale-explorer-custom-black-diamond-holographic-sparkle"
image_url: ""
author_slug: "viktor-kessler"
---

Epiphone announced the **Lzzy Hale Explorer Custom** on August 18 — a limited-edition signature model for the Halestorm frontwoman, and the Custom-tier addition to a signature line that already spans Gibson, Kramer, and Epiphone.

The spec sheet, from Gibson's listing:

- **Solid mahogany Explorer body**, 7-ply top binding, mirrored pickguard
- **Set mahogany neck**, SlimTaper 60s "C" profile
- **Ebony fretboard**, 12-inch radius, single-ply binding, 22 medium jumbo frets, block inlays
- **Two ProBucker Ignite humbuckers** — a new high-output design
- Two volume, one tone, three-way toggle
- **LockTone Tune-O-Matic** bridge and Stop Bar tailpiece, Grover Rotomatic tuners, silver Speed knobs, nickel hardware
- **Black Diamond Holographic Sparkle** gloss — the same finish that appeared on her Kramer signature
- **Custom Artist hardshell case included** — which, for an Explorer, is not a throwaway inclusion; the body shape doesn't fit generic cases and a compatible hardshell is a real expense you're not paying separately
- **€999 / AU$2,199**, available mid-September 2026. Epiphone had not published a US figure at the time of writing.

The finish is what the coverage is leading with. I understand why — it's a holographic sparkle Explorer with a mirrored pickguard and it looks extremely good under stage lighting. That's the point of it.

But the line in that spec sheet with an actual measurable consequence for your rig is **ProBucker Ignite**, and I have not seen a single outlet address what it does to your existing presets.

## What "High-Output" Actually Changes

Epiphone has not published DC resistance or output voltage figures for the Ignite, so I'm not going to invent numbers. What we know is the positioning: it is a **higher-output design than the standard ProBucker**, which is Epiphone's PAF-voiced humbucker.

Here is the mechanism, and it is not subtle.

An amplifier — real or modeled — is a **nonlinear transfer function**. You put a voltage in, you get a voltage out, and the relationship between them is a curve that is roughly linear at low input and progressively compresses as input rises. The Drive control sets how far up that curve your signal sits.

**The pickup sets the input voltage.** A hotter pickup does not "add gain" in the sense of adding another gain stage. It moves your entire signal further up an existing transfer curve. The audible consequences, in order of how much they'll annoy you:

1. **More clipping at the same Drive setting.** Obvious, expected, usually the only one people mention.
2. **Earlier onset of compression, which flattens your picking dynamics.** This is the one that matters. The distance between a light pick stroke and a hard one shrinks, because both are now landing in the compressed region of the curve. Players describe this as the guitar feeling "less responsive" and then blame the guitar. It's the operating point.
3. **A different low-mid clipping character.** Higher input into a preamp stage means the low frequencies — which carry the most energy — hit saturation first and hardest. This is why hot pickups get called "muddy" when the actual problem is that the amp's low end is now clipping harder than the mids.

So: plug an Ignite-loaded Explorer into a preset you built with a PAF-output guitar and it will not sound like the same preset with more gain. It will sound like a *worse* preset, and the reason is that you moved the operating point on three axes at once.

## The Correction, in Order

Do these in sequence. Do not skip to step three.

### Step 1 — Set pickup height before you touch the amp

This is the free variable and it's the one everyone leaves at factory spec.

Measure from the **top of the pole piece to the bottom of the string**, fretted at the highest fret. A steel rule or feeler gauge, not eyeballing.

Starting points for a high-output humbucker in a mahogany body:

- **Bridge: 2.0–2.4 mm** (roughly 5/64" to 3/32")
- **Neck: 2.4–3.0 mm** (roughly 3/32" to 1/8")

That's **lower than the factory default on most Epiphones**, deliberately. You are trading a small amount of output for a large amount of dynamic range back. A hot pickup set high is also close enough for magnet pull to interfere with string vibration — you get a warbling, out-of-tune sustain on the low strings that people mistake for a setup problem. The full procedure and how to hear the warble before it ruins a take is in [Pickup Height, Magnet Pull, and the Warble You Can't Intonate Away](/blog/pickup-height-magnet-pull-warble).

Get this right first. Everything downstream is easier.

### Step 2 — Reduce amp Drive, don't reduce guitar volume

Once height is set, take **10–15% off the Drive control** of whatever amp model you were using with your previous guitar. If you were at 7.0, try 6.0–6.3.

The instinct is to roll the guitar volume back instead. Don't, as a default. Rolling the guitar volume down changes the resonant peak of the pickup circuit — the load the pickup sees changes with the pot position, and on a non-treble-bleed circuit you lose high end as you go down. You end up with a darker guitar *and* a lower operating point, which is two changes when you wanted one. Fix the amp; keep the guitar's volume as a performance control.

### Step 3 — Re-check the low end, not the treble

After dropping Drive, most people go straight to the Treble knob because the tone "changed." Check the **Bass** control first.

A hotter pickup pushing a preamp harder saturates low frequencies first. The fix is upstream of the amp's EQ: either pull the amp's Bass control down 1–2 notches, or — better — put a high-pass in front of the amp. A boost or overdrive block with the gain near zero and the level up does exactly this, and it's the single most reliable move in high-gain rigs. I've written the whole signal theory of why in [Why a Tube Screamer Before a High-Gain Amp Is the Best Metal Trick](/blog/tube-screamer-before-high-gain-amp), and the humbucker-specific version is [Setting an Overdrive With Humbuckers](/blog/overdrive-with-humbuckers-settings).

If it's fizzy rather than muddy, the problem is on the other end and it's usually the cab, not the amp — [Fixing Fizzy High Gain](/blog/fix-fizzy-high-gain) covers the diagnostic order there.

### Step 4 — Reset your gate threshold

A hotter pickup raises your noise floor along with everything else. Whatever threshold you had is now letting hum through. Re-set it with the guitar volume at 10 and your hands off the strings, in the room you actually play in. [Noise Gate Threshold and Decay for High Gain](/blog/noise-gate-threshold-decay-settings-high-gain) has the procedure and the decay values that stop the chug from getting chopped.

## Chasing the Halestorm Tone

The tone question this guitar raises is "what does Lzzy Hale actually sound like," and that's answerable, because she's been consistent and her rig has been documented in multiple rundowns.

She has been seen live through a white-tolexed **Marshall of the JCM800 family**, a **Peavey/EVH 5150**, and more recently a **Friedman BE-100**. That's three amps in the same conceptual family — a hot-rodded British-voiced high-gain circuit — approached from three directions. Her stated philosophy is plug-in-and-play with no tracks; the pedalboard is deliberately sparse, with a Dunlop wah modified to engage on touch rather than on a switch.

That's a useful constraint. It means the tone is coming from the amp and the pickups, not from a chain, which makes it reproducible.

### On Helix, HX Stomp, or Helix Native

Three starting points, roughly in order of how close I'd expect them to land:

**`Placater Dirty`** — the Friedman BE-100 model, and the closest match to her current rig.
- Drive **5.5–6.0** (remember: reduced for the hot pickups)
- Bass **4.5**, Mid **6.0**, Treble **6.0**, Presence **5.0**
- Master **7.0+** — the Friedman circuit's character is in the power section; leaving Master low gives you a thin, static version of it

**`Brit 2204`** — the JCM800 2203/2204 model. The white Marshall.
- Drive **6.0–6.5**
- Bass **4.0**, Mid **6.5**, Treble **6.5**, Presence **5.5**
- This one *needs* the boost in front. A JCM800 with a hot humbucker and no high-pass ahead of it is the textbook mud case. Gain at 0, Level at max, on a `Minotaur` or `Kinky Boost` block. The [JCM800 Settings Guide](/blog/jcm800-settings-guide) has the full map, and if you're deciding between the 800 flavor and the Jubilee flavor for this kind of rock, [Silver Jubilee vs. JCM800](/blog/marshall-silver-jubilee-vs-jcm800) is the comparison.

**`PV Panama`** — the 5150 model. Tighter and more modern than either of the above.
- Drive **5.0** (the 5150 preamp has the most gain on tap of the three; it needs the most reduction for a hot pickup)
- Bass **3.5**, Mid **5.5**, Treble **6.0**, Presence **5.0**
- Resonance **5.5**

**Cab for all three:** a 4x12 with **Celestion V30**-family speakers, close-mic'd with a 57 slightly off-axis, plus a 121 blended under it if you have the DSP. High cut around **6.5–7.5 kHz**, low cut around **90–100 Hz**.

A note on the V30 choice, since it's become fashionable to argue against it: for this style — hard rock, mid-forward, one guitar carrying the whole harmonic load — the V30's upper-mid peak is doing exactly the right job. The complaints about V30 fatigue are mostly a modern-metal, multi-tracked-guitar problem. [Is the V30 Still Right for Medium-Gain Rock?](/blog/v30-still-right-medium-gain-rock) is the longer version.

### On a Quad Cortex

Same three targets: the QC's Friedman-derived, Marshall-derived, and 5150-derived captures or models. Same correction — knock the gain down from wherever you had it for a PAF-output guitar, high-pass in front, check the low end before the treble.

## Does the Wood Matter Here?

Briefly, because I'll get asked.

Mahogany body, mahogany neck, ebony board is a well-understood combination and the audible tendencies are real but small relative to the pickup change. Mahogany contributes low-mid weight around 200–400 Hz. Ebony is a dense, stiff board material and correlates with a harder pick transient and a slightly extended top end compared to rosewood.

The practical consequence for dialing: **you will want less amp Bass and less low-mid on this guitar than on an alder-bodied, rosewood-boarded one**, and the harder transient means your compressor's attack setting — if you use one — will be more audible.

That is the whole of what I'd claim. The difference between this guitar's woods and a different set is measurable but it is an order of magnitude smaller than the difference between a PAF-output pickup and a high-output one, and I'd rather you spent your evening on pickup height than on tonewood forums. Which pickup position you're actually using matters more than either — [Pickup Position Guide](/blog/pickup-position-guide) if you want the frequency breakdown.

## My Take

This is a good-looking limited-edition Explorer at €999 with a hardshell case included, and the case is worth more to the value calculation than most reviewers will credit — Explorer-compatible hardshells are genuinely annoying to source and genuinely not cheap.

The ProBucker Ignite is the interesting spec and the under-covered one. I'd like Epiphone to publish output figures; they haven't, and "high-output" is a marketing category, not a measurement. Until they do, the honest advice is procedural rather than numerical: **set the height, drop the drive, high-pass the front end, re-gate.** In that order. Those four steps will do more for how this guitar sounds through your rig than any preset anyone hands you.

And if you're buying it because it's a holographic sparkle Explorer with a mirrored pickguard — that's a completely defensible reason to buy a guitar, and I'd ask that you still do the four steps.

## Dig Deeper on Fader & Knob

- Set the height before you touch anything else: [Pickup Height, Magnet Pull, and Warble](/blog/pickup-height-magnet-pull-warble).
- The high-pass that fixes hot-humbucker mud: [Tube Screamer Before a High-Gain Amp](/blog/tube-screamer-before-high-gain-amp).
- Overdrive settings specifically for humbucker output: [Setting an Overdrive With Humbuckers](/blog/overdrive-with-humbuckers-settings).
- Which dirt pedal pairs with a hot humbucker: [TS808 vs. Klon vs. RAT With Humbuckers](/blog/ts808-klon-rat-humbuckers).
- The white Marshall, dialed: [JCM800 Settings Guide](/blog/jcm800-settings-guide).
- Choosing between the two classic hot-rodded Marshall voices: [Silver Jubilee vs. JCM800](/blog/marshall-silver-jubilee-vs-jcm800).
- If it's harsh rather than muddy: [Fixing Fizzy High Gain](/blog/fix-fizzy-high-gain).
- Re-setting the gate after a pickup change: [Noise Gate Threshold and Decay](/blog/noise-gate-threshold-decay-settings-high-gain).
- The speaker argument, at length: [Is the V30 Still Right for Medium-Gain Rock?](/blog/v30-still-right-medium-gain-rock).
