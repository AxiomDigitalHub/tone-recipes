---
title: "John Page Built Noah Kahan's Guitarist a $5,995 Baritone — And If You Copy Our Drop-Tuning Settings Onto One, You'll Ruin It"
date: "2026-08-12"
category: "new-gear"
slug: "john-page-noah-levine-signature-dl-baritone"
excerpt: "John Page Guitars unveiled the Noah Levine Signature DL Baritone on August 12 — $5,995, 27-inch scale, P-90s, four heavy-relic finishes Levine picked himself, first batch shipping January 2027. Levine plays lead for Noah Kahan and co-wrote 'Dial Drunk.' But here's the part that matters if you already own a baritone: our own drop-tuning high-pass table is built for metal, and applying it to a clean 27-inch baritone cuts above the fundamental and hollows the instrument out. Scale length is the column that table doesn't have."
source_url: "https://www.johnpageguitars.com/pages/noah-levine-signature-dl-baritone"
image_url: ""
author_slug: "margot-thiessen"
---

John Page Guitars unveiled the Noah Levine Signature DL Baritone today. It is $5,995, it is hand-built to order in Delaware, Ohio by master builder Chase Gullett, and the first batch ships January 2027.

Page co-founded the Fender Custom Shop. That is the pedigree line every outlet will lead with, and it's earned. But I want to spend most of this piece somewhere else, because there's a technical point buried in this announcement that applies to anyone who owns a baritone — including the ones that cost four hundred dollars — and I think we've contributed to getting it wrong.

## What Was Announced

From John Page Guitars and the Premier Guitar release:

- **$5,995 USD**, hand-built to order. "Batch 01" carries its own serial designation.
- **Four heavy-relic finishes**, personally selected by Levine: Olive Drab, Pelham Blue, Black on Black, TV Yellow.
- **Neck and fretboard:** your choice of rosewood or maple.
- **Pickups:** your choice of Fishman Fluence P-90 or Lollar P-90.
- **Levine's own touring spec:** rosewood neck and board, Fishman Fluence P-90s.
- **The DL Baritone platform:** 27-inch scale, 23 frets, on Page's modular design where the body is shared with the standard DL and only the neck changes.
- First batch shipping **January 2027**; pre-orders open now.

Levine is the lead guitar player in Noah Kahan's touring band. He played the solo on "Homesick," which led to him playing guitar across the rest of the record, and he co-wrote "Dial Drunk" — the one with the Post Malone feature — on *Stick Season (We'll All Be Here Forever)*.

On the instrument, Levine says: "Baritone has become a central instrument for me, both on stage, and in the studio." He calls it the most versatile and easy-to-play baritone he's used.

I'll take him at his word on the feel. I have no way to evaluate a guitar I haven't held, and I'm not going to pretend otherwise.

## The Part I Actually Want to Talk About

Fader & Knob publishes a guide called [Gain Staging for Drop Tunings](/blog/gain-staging-drop-tunings). It contains a high-pass filter table, and that table says this:

| Tuning | Low String | HPF Frequency |
|---|---|---|
| Drop B | 62 Hz | 100-110 Hz |
| Drop A | 55 Hz | 110-120 Hz |

Look at the Drop B row for a second. The low string's fundamental is 62 Hz. The recommended high-pass is 100–110 Hz.

**We are telling you to filter out the fundamental.**

That is not an error. In a high-gain metal context it is exactly right, and the article explains why: a heavily saturated preamp turns low-frequency energy into intermodulation mud, the guitar cab can't reproduce much below 90 Hz anyway, and the bass guitar is carrying the weight of the low end. You keep the harmonics, which is where note definition lives, and you let the low B exist as an *implied* pitch reconstructed from its overtones. It works. It's why palm mutes get heavier when you cut lows, which is the counterintuitive result that article documents.

Now put a 27-inch P-90 baritone into an indie-folk arrangement and run the same numbers.

You have just deleted the instrument.

## Why Scale Length Is the Missing Column

Here's the mechanism, because "baritones are different" is the kind of advice that gets repeated without anyone saying why.

A low B is 61.7 Hz whether you get there by detuning a 25.5-inch guitar or by playing an in-tune 27-inch baritone. **Pitch is identical. Tension is not.** Scale length sets how much tension a given gauge needs to reach a given pitch, and an inch and a half is a large fraction of the difference.

That tension difference changes what the string actually produces:

- **A properly tensioned string puts more energy into its fundamental** relative to the noise below and around it. A slack string wobbles. That wobble is inharmonic content sitting underneath the note, and it is a meaningful share of what the metal HPF table exists to remove.
- **Attack transients are faster on a tighter string.** Slower attack on a floppy low string is what reads as "flub," and it's the other thing that filtering is compensating for.
- **The fundamental is worth keeping when nothing is destroying it.** Feed a clean or edge-of-breakup amp model instead of a saturated one and there is no intermodulation problem to solve. The low B isn't mud. It's the sound you bought the guitar for.

So the metal table is doing damage control for a problem a 27-inch scale largely doesn't have, in a gain structure a folk-rock part doesn't use.

## What to Actually Set

If you're running a baritone clean or lightly broken up — Helix, HX Stomp, Quad Cortex, doesn't matter, this is block-agnostic:

**High-pass: 45–55 Hz, 12 dB/octave.** This is a rumble filter, not a tone shaper. You're removing handling noise, stage subsonics and whatever your DI picks up below the instrument's actual range. You are not carving. If you can hear the filter working, it's too high.

**Don't touch 130 Hz.** The metal guide's 3–4 dB cut at 130 Hz is aimed at the mud a saturated preamp generates. On a clean baritone, 130 Hz is the second harmonic of your low B and a good part of the instrument's body.

**Cut at 150–250 Hz instead, and only if the mix asks.** This is where a baritone collides with the bass guitar in a full arrangement — and in Kahan-shaped music the bass is rarely the only thing down there, because there's usually an acoustic with its own low-mid bloom. A 2–3 dB dip somewhere in that window buys separation without thinning anything. Do it while listening to the whole track, never soloed.

**Pick an amp model with firm low end and real headroom.** Blackface-style circuits are the obvious home: they stay clean under a low B's larger string excursion instead of sagging into it. Tweed-style models are the opposite bet — they compress and bloom in the low end, which is charming at standard pitch and turns to porridge a fourth below. Our [clean headroom guide](/blog/clean-headroom-fender-amp-chords-dont-break-up) covers how to set that up so chords hold together, and the [Deluxe Reverb settings guide](/blog/fender-deluxe-reverb-settings) is a reasonable starting point to transpose from.

## The P-90 Choice Is Not Cosmetic

Both pickup options on this guitar are P-90s. That's a deliberate voicing decision and it's worth understanding, because it explains something about why baritones and P-90s keep showing up together.

Our [P-90 overdrive guide](/blog/p90-pickups-overdrive) documents the pickup's defining trait: a forward upper-midrange peak, more energy than a single-coil somewhere in the 800 Hz–2.5 kHz region, and more harmonic complexity up there than a humbucker.

Here's the interaction nobody spells out. **When you transpose the instrument down a fourth, the strings' harmonic series moves down with it. The pickup's resonant character does not.** A P-90's presence bump is a property of the coil's inductance and geometry — it sits where it sits regardless of what note you play.

So on a baritone, that fixed upper-mid bump lands on a *higher harmonic* of each note than it would on a standard-scale guitar. It is doing articulation work further up the overtone series, in a register where the fundamentals are too low to provide definition on their own.

That is precisely why the combination works. The P-90 supplies the intelligibility that a 62 Hz fundamental cannot. Put a dark, low-mid-focused humbucker in the same guitar and you stack low-mid on low-mid and get a beautiful instrument nobody can hear in a mix.

Practical consequence: **do not scoop the mids on a baritone.** That's the one piece of the drop-tuning guide that transfers over completely intact.

## If You Don't Have Six Thousand Dollars

Most people reading this don't, including me. So:

**A pitch block is not a baritone.** You can drop a Helix or Quad Cortex pitch shifter down a fourth and get the pitch. You will not get the tension, the attack transient, or the harmonic relationship between a long string and a fixed-resonance pickup that the last two sections were about. You'll get a tracking artifact on chords and a note that sounds like a shifted guitar, because it is one. There are good uses for that block. Replacing this instrument is not one of them.

**A $400 27-inch baritone gets you most of the way.** The scale length *is* the mechanism. It's the cheapest part of this guitar to buy elsewhere. What $5,995 buys you at John Page is the build, the relic work, the Fluence or Lollar sets, and a name on the headstock — not the physics.

**Get the nut right or none of it matters.** Baritone sets run heavy, and a nut slot cut for a .046 will bind a .062 and put you out of tune every time you bend or capo. Our [nut slot width guide](/blog/nut-slot-width-by-string-gauge) has the clearance rule. This is a $60 problem that will otherwise convince you the guitar is bad.

## My Take

I came up on *Continuum* and I write about warm neck-pickup tones for a living, so a heavy-relic baritone at six grand is not the thing I was going to fall for. And I'll say plainly: a January 2027 ship date on a pre-order is a long time to be holding someone's money for an instrument they haven't played.

But the announcement did something useful for me. It made me go back and read our own drop-tuning table with fresh eyes, and notice that it's a *metal* document wearing the label "drop tunings" — and that a lot of players now reaching for baritones are not playing metal at all. They're playing the low, ringing, open-chord thing that the last three years of folk-rock has made unavoidable. Those players have been handed settings advice calibrated for a completely different gain structure, and the failure mode is quiet: the guitar just sounds smaller than it should, and you assume the instrument is thin.

It isn't. You high-passed it above its own fundamental.

Go find your low-cut, drag it down to 50 Hz, and play an open B minor. That costs nothing and I think you'll hear the guitar you thought you'd bought.

## Dig Deeper on Fader & Knob

- The document this article argues with — and it's still right for its actual subject: [Gain Staging for Drop Tunings](/blog/gain-staging-drop-tunings).
- Why the P-90's upper-mid peak behaves the way it does: [P-90 Pickups and Overdrive](/blog/p90-pickups-overdrive).
- Setting an amp so low open chords don't collapse: [Clean Headroom](/blog/clean-headroom-fender-amp-chords-dont-break-up).
- A starting point to transpose downward: [Fender Deluxe Reverb Settings](/blog/fender-deluxe-reverb-settings).
- The $60 problem that masquerades as a bad guitar: [Nut Slot Width by String Gauge](/blog/nut-slot-width-by-string-gauge).
- Frequency-by-frequency, when you *are* playing heavy: [Dialing In Drop-Tuned High Gain](/blog/dialing-in-drop-tuned-high-gain).
