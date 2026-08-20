---
title: "JAM Pedals Built a $399 Box to Sound Like a $29 Amp — And the Reason It Works Is Bandwidth, Not Gain"
date: "2026-08-19"
category: "new-gear"
slug: "jam-pedals-tiny-amp-destroyer-stu-mackenzie"
excerpt: "JAM Pedals and Stu Mackenzie of King Gizzard announced the Tiny Amp Destroyer this week — €369, three footswitches, two stackable gain stages plus a treble booster, built from a pawnshop mini amp Stu bought for $29. The joke writes itself, and everyone's writing it. Here's the part nobody's covering: the reason a busted 4-inch speaker cuts through a mix isn't distortion, it's a 300 Hz–4 kHz bandwidth window. Build it on a Helix or HX Stomp tonight with an amp model you already own, and here's the notch frequency to sweep for."
source_url: "https://jampedals.com/shop/tiny-amp-destroyer/"
image_url: ""
author_slug: "jess-kowalski"
---

JAM Pedals and Stu Mackenzie from King Gizzard & the Lizard Wizard announced the **Tiny Amp Destroyer** this week. €369 / £319, roughly $399 depending on where you're standing. Three footswitches. Artwork by Jason Galea, who does the band's album covers and tour posters.

The origin story is the part every outlet is leading with, and fair enough, because it's genuinely funny: Stu bought a tiny amp at a Cash Converters for **$29**. He liked it because it sounded terrible. He used it on King Gizzard records. On recent albums he'd been running *two* JAM Boomster clean boosts into it until it stopped behaving like an amplifier and started behaving like a small appliance failing. JAM built a pedal of that.

So: $399 pedal, $29 amp. Everyone gets one joke, we all move on.

Except I've been mixing bands in a Philly club three nights a week for six years, and I want to tell you why that sound actually works in a room, because it's not the reason people think, and once you know it you can build most of it on the modeler you already own.

## What Actually Shipped

From JAM's listing:

- **Three footswitchable sections.** Two independent gain stages — labeled **G1** and **G2** — that stack, plus a standalone **treble booster**. That's the Boomster-into-Boomster-into-tiny-amp architecture made into one enclosure.
- **Active Bass and Treble.** Active, not passive — meaning they boost as well as cut, which matters on a circuit designed to have almost no low end to begin with.
- **A Notch control.** This is the interesting knob. It cuts a band to make the tone boxier.
- **A "Magic" switch** that adds compression, described as mimicking a small amp being pushed hard into distortion.
- **Internal DIP switches** for the treble booster: **Standard** mode is a narrower, more focused treble boost; **Full** mode opens up the frequency response with more low end. It ships in Full.

First 30 units went out at Field of Vision, the band's own festival. Now it's on the general market.

## The Thing Nobody Says About Tiny Amps

Here's my actual point, and it's a live-sound point.

A $29 practice amp with a 4-inch speaker is not a distortion device. It's a **filter with a distortion problem**. Two things are happening, and only one of them is the gain:

**One: the speaker is a brick wall on both ends.** A 4- to 6-inch paper cone in a plastic box has essentially nothing below about 250–300 Hz — no cabinet volume to support it, no cone excursion to produce it — and it falls apart above roughly 4 kHz because the cone is breaking up and the whole thing is undamped. So your guitar is arriving in about a **300 Hz to 4 kHz** window. That's it. That's a three-and-a-half-octave slot in the middle of the spectrum.

**Two: there's a resonant honk.** Small enclosure plus a small cone gives you a hard peak somewhere in the 700 Hz–1.5 kHz region — the "cupped hands" quality. It's what makes a cheap amp sound cheap when you A/B it, and it's *also* what makes it sound like a record when it's sitting in a mix.

Because here's the live-sound half. When I've got a four-piece on stage, the fight is over 80–250 Hz (kick, bass, floor tom, and every guitarist's low-end knob) and over 2–5 kHz (vocal presence, snare crack, cymbals). A guitar tone that occupies 300 Hz to 4 kHz and *nothing else* is a tone that never fights the bass and never fights the vocal. It just sits in its lane and gets loud.

King Gizzard records sound enormous partly *because* the guitars are band-limited. It's not a compromise they made. It's the mechanism. The same reason a Big Muff scooped to death disappears in a band and a boxy little amp doesn't — I went through the whole taxonomy of that in [Overdrive vs. Distortion vs. Fuzz](/blog/overdrive-vs-distortion-vs-fuzz), and the small-amp case is the extreme end of it.

The gain is the personality. **The bandwidth is the reason it works.**

Which is great news, because bandwidth is free.

## Building It: Helix, HX Stomp, Helix Native

Five blocks. Four if you're DSP-starved on a Stomp. Order matters.

### 1. Treble booster in front — `Deranged Master`

Line 6's model of the Dallas Rangemaster. This is the single most important block and the one people skip.

- **Boost: 6–8 out of 10**
- **Level: enough to slam the amp, not enough to clip the input meter**

What it's doing: a treble booster is a **high-pass filter with a gain stage after it**. It strips low end *before* the distortion, so the amp is clipping a signal that's already thin. That's the difference between "aggressive and articulate" and "a blanket on fire." If you put full-range guitar into two stacked gain stages you get mush; if you high-pass first, you get the thing on the record.

If you want the pedal's **Standard** vs **Full** DIP behavior: Standard is roughly this block with the Bass control pulled down; Full is the same with more low end let through. On Helix, just use the block's Bass/tone control to slide between them.

### 2. Two boost blocks stacked — `Kinky Boost` → `Minotaur`

This is your G1 and G2.

- **Kinky Boost:** Gain around 5–6, Treble +2, Bass −3.
- **Minotaur:** Gain 3–4, Level high, Treble around 6.

Set them to **separate footswitches**, same as the pedal. The whole design intent of G1/G2 is that you play the *stack* — one on for verses, both on for the part where everything goes wrong. Don't merge them into one always-on block; you lose the arrangement tool.

The mechanics of what stacking actually does to the front end — and why stage two behaves completely differently once stage one is already clipping — is [Stacking a TS and a Klon Into a Marshall](/blog/stacking-ts-and-klon-into-marshall). Same physics, dumber amp.

### 3. Amp — `US Small Tweed`, cranked

The Champ model. This is the correct amp, and "cranked" is not a suggestion.

- **Drive: 8.5–10**
- **Bass: 2–3**
- **Treble: 6–7**
- **Master: high**

You want the power section in it, not just the preamp. The reason a small amp sags and blooms the way it does is that its power supply can't keep up — that's the character you're after, and on a modeler it only shows up when the Master is up. If you're wondering which knob is doing what here, [Amp Gain, Volume, and Master Explained](/blog/amp-gain-volume-master-controls) is the map.

### 4. Cab — `1x8 Tweed`, and this is where the tone lives

If you take one thing from this article: **the cab block is doing more work than the amp block.**

- **Mic: Dynamic 57 or 121, close**
- **Low Cut: 250–300 Hz**
- **High Cut: 4.0–4.5 kHz**

Those two cut values *are* the tiny amp. Sweep the High Cut from 8 kHz down to 4 kHz while you play and listen for the moment it stops sounding like a guitar cab and starts sounding like a device. It's very sudden and it's usually right around 4–4.5k.

I know 250 Hz feels insane as a low cut. Do it anyway, then play with your band or a backing track. It'll feel thin solo and correct in context — which is the entire lesson of [Why Cabinet Volume and Size Change Your Tone](/blog/cabinet-volume-and-tone-why-size-matters) and the reason [Helix Cab Models Decoded](/blog/helix-cab-models-decoded) spends so long on small-format cabs that nobody selects.

### 5. The Notch — `Parametric EQ`, and here's the frequency

This is the pedal's most distinctive control and the one you can't get from any stock model. It's also a two-minute build.

Add a Parametric EQ **after the cab**:

- **Frequency: sweep 400–900 Hz**
- **Q: narrow — 3 to 6**
- **Gain: −6 to −12 dB**

The counterintuitive part: cutting a narrow band in the low-mids makes the tone sound *boxier*, not thinner, because you're carving a valley that leaves the 1–1.5 kHz honk standing above everything around it. You're not removing box, you're **isolating** it.

Sweep it live with the gain stack on. There's one frequency on your specific guitar where the tone snaps into the cheap-transistor-radio thing, and it depends heavily on your pickups. On my Jazzmaster with P-90s it's around 620 Hz. On a humbucker guitar it'll sit lower.

If you have a spare footswitch, put the EQ on it. That's your "Notch" switch, and it's a genuinely useful arrangement tool — clean-ish verse, notched-and-boxed chorus.

### 6. Optional — the "Magic" switch

A compressor **after** the amp and cab:

- **LA Studio Comp** or **Deluxe Comp**
- **Fast attack, heavy ratio, makeup gain to match bypass**

What JAM's Magic switch is emulating is a power supply that has given up — the amp compressing itself because it can't deliver current fast enough. A post-amp compressor with a fast attack approximates the audible result: transients flattened, sustain shoved up, everything at one volume. It's not the same mechanism, but it lands close enough that I'd try it before deciding you need hardware.

## On a Quad Cortex, TONEX, or a Budget Modeler

The block names change, the recipe doesn't:

1. **Treble booster or a boost with the bass rolled off** in front.
2. **Two overdrive/boost blocks**, stacked, on separate switches.
3. **Smallest tweed-style amp model** in your library, drive near max.
4. **1x8 or 1x10 cab**, or any cab with a low cut at 250–300 Hz and a high cut at 4–4.5 kHz.
5. **Narrow parametric cut, −8 dB, swept between 400 and 900 Hz.**

On a **GP-200, MG-30, or Ampero II** you have every one of these. This is not a tone that requires expensive DSP — it requires *removing* things, which is the cheapest operation in audio.

If you're going straight to a PA with no amp on stage like I do, the cab block's cut frequencies are doing double duty: they're also stopping you from sending 100 Hz of nothing into a subwoofer. Worth reading [Why a Tube Amp Sounds Different at Bedroom Volume](/blog/tube-amp-sounds-different-bedroom-volume) alongside this, because the sag you're chasing is exactly the thing that disappears when you turn a real one down.

## So Should You Buy It?

**Probably not, if you own a modeler.** I built the above on an HX Stomp in about twelve minutes and it gets you a long way there. The recipe is five blocks of stuff you already paid for.

**Yes, if any of these are you:**

- **You play a real amp and you want this on a pedalboard.** Everything above is a modeler build. If your rig is a Twin and a board, there's no version of this you can assemble from an EQ block, and three footswitchable gain stages in one enclosure is a genuinely well-thought-out layout.
- **You want the specific circuit.** JAM builds these by hand and the Boomster lineage is real — Stu was using two actual Boomsters. A model of a boost is not the same as two of them into a failing amp, and I'm not going to pretend the gap is zero.
- **You want the Notch control as a physical knob.** Sweeping a parametric EQ on a touchscreen mid-song is not a thing. On the pedal it's a knob you can grab. That's a real ergonomic difference and it's the control I'd miss most.
- **You want the Jason Galea artwork.** Legitimate reason. I'm not going to be snobby about it.

**No, if you're buying it to sound like King Gizzard.** Their guitar sound is band-limited, compressed, and mixed by people who understand that a guitar doesn't need to be full-range to be huge. You get 80% of that from a low cut, a high cut, and the confidence to leave them there when it sounds thin in your headphones.

My honest read: this is a well-designed pedal with a great story attached, and the story is doing a lot of the $399. That's fine — plenty of gear I own is like that. But the *information* in this announcement is free, and it's the best argument I've seen this year for the thing I keep saying: your tone problem is usually a subtraction problem.

Set a low cut at 280 Hz and a high cut at 4.2k on whatever you already own. Play it with a band. Then decide.

## Dig Deeper on Fader & Knob

- The other great argument for band-limited, half-broken guitar: [Jack White's Lo-Fi Garage Tone](/blog/jack-white-lo-fi-garage-tone).
- Why the small cab is the tone and not the amp: [Cabinet Volume and Size](/blog/cabinet-volume-and-tone-why-size-matters).
- Picking the small-format cab models nobody scrolls to: [Helix Cab Models Decoded](/blog/helix-cab-models-decoded).
- What the second gain stage actually does to the first: [Stacking a TS and a Klon Into a Marshall](/blog/stacking-ts-and-klon-into-marshall).
- Where fuzz, distortion, and "broken" actually differ: [Overdrive vs. Distortion vs. Fuzz](/blog/overdrive-vs-distortion-vs-fuzz).
- Getting the Master knob right so the sag shows up: [Amp Gain, Volume, and Master Controls](/blog/amp-gain-volume-master-controls).
- Why the sag vanishes when you turn down: [Tube Amps at Bedroom Volume](/blog/tube-amp-sounds-different-bedroom-volume).
