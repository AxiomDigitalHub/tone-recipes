---
title: "Epiphone's Marcus King El Dorado Puts Solid Rosewood Under $1,000 — Then Ships It With the One Pickup That Hides It"
date: "2026-08-06"
category: "new-gear"
slug: "epiphone-marcus-king-el-dorado-piezo-under-saddle"
excerpt: "Epiphone's limited-edition Marcus King signature revives the '70s El Dorado as a square-shoulder dreadnought with a solid spruce top and solid rosewood back and sides, at $999 with a hardshell case. The wood is the story. The L.R. Baggs Element Bronze under-saddle piezo it ships with is the problem — under-saddle pickups sense string pressure, not body resonance, so plugged in you hear almost none of what you paid for. Here's how to get the rosewood back on a Helix, HX Stomp or Quad Cortex."
source_url: "https://www.gearnews.com/epiphone-marcus-king-el-dorado/"
image_url: ""
author_slug: "margot-thiessen"
---

Epiphone brought back the El Dorado yesterday, and they did it with Marcus King, which is the correct pairing — his family's connection to the model is the reason the guitar exists. King has said his first El Dorado **"was a gift from my father."** That's the kind of provenance you can't manufacture, and it's why this reads as a reissue with a reason rather than a name badge on an existing SKU.

Here's what's actually in the box:

- **Body:** square-shoulder dreadnought, **solid spruce top**, **solid rosewood back and sides**
- **Neck:** mahogany, 25.5" scale, rounded C profile, 43 mm bone nut, headstock volute
- **Fingerboard:** three-ply bound rosewood, 20 frets, rounded-corner mother-of-pearl block inlays
- **Bridge:** belly-down rosewood, compensated bone saddle, black pins
- **Electronics:** **L.R. Baggs Element Bronze** under-saddle pickup and preamp, soundhole-mounted Volume and Tone
- **Finish:** Antique Natural. Limited edition. **$999** with a hardshell case.

**Solid rosewood back and sides at $999 is the line that matters.** At this price you normally get laminate, and laminate is not a scandal — it's stable, it's cheap, and plenty of great guitars use it — but it does not do what solid rosewood does. Solid rosewood gives you a scooped, glassy midrange, a low end that blooms late, and overtones that hang around long after mahogany's would have decayed. It's the wood you pick when you want the guitar to sound expensive under a microphone.

And that is exactly where this gets frustrating, because of what's under the saddle.

## What an Under-Saddle Piezo Actually Hears

The Element Bronze is a good under-saddle pickup. L.R. Baggs makes good under-saddle pickups. But the category has a physical limit that no amount of build quality fixes, and it's worth being precise about it.

**An under-saddle transducer senses pressure variation at the saddle slot. It does not sense the body.**

The string vibrates, the saddle transmits that vibration downward, the piezo crystal reads the changing force. That's the entire signal path. The top's flex, the rosewood's reflections, the air resonance inside the box, the way a dreadnought's lower bout blooms on a strummed G — the pickup is not in the room for any of that. It hears strings pushing on wood.

Which means: **the solid rosewood you paid extra for is essentially inaudible when you plug in.** Acoustically, in a quiet room, it's all there and it's lovely. Through a DI into a PA, you get the characteristic under-saddle signature instead — a hard upper-midrange presence around 2–4 kHz, a thin and slightly brittle top, compressed transients, and the "quack" everyone complains about on the low E and A.

That gap between "how it sounds in my lap" and "how it sounds in the monitors" is the single most common complaint I hear from acoustic players, and it is almost never the guitar's fault. I laid out the frequency-by-frequency version in [five frequency fixes for a bad-sounding acoustic pickup](/blog/acoustic-pickup-tone-fix). What follows is the version specific to this guitar.

## Fix One: Stop Loading the Piezo

Before you touch EQ, check what the pickup is plugged into, because you can lose the top end before the signal ever reaches a tone control.

**A piezo element is a capacitive source, and it needs a very high input impedance to sound right.** Feed it something in the 1 MΩ range — which is what a normal guitar input, a normal modeler input, and most DI boxes give you — and you've built a high-pass filter with the pickup's own capacitance. The result is thin, quacky, and missing exactly the warmth you're trying to get back. Piezos generally want **10 MΩ**.

The Element Bronze has an onboard preamp, which helps, but it does not make the rest of the chain irrelevant. If you're running into a Helix, HX Stomp, POD Go or Quad Cortex, set the **input impedance to the highest available value rather than leaving it on Auto**. Auto is guessing based on the first block, and on a piezo source that guess is often wrong.

This is the step people skip, and it's the one that costs the most tone. Full mechanism in [piezo DI and input impedance](/blog/piezo-di-for-acoustic-guitar-input-impedance), and if the modeler input alone isn't cutting it, [a buffer ahead of it](/blog/buffer-pedal-for-acoustic-piezo-passive-pickup) is the fix.

## Fix Two: Cut Before You Boost

The instinct with a thin piezo signal is to add — more lows, more air. Don't. Under-saddle quack is a *peak* problem, not a *missing* problem, and boosting around it just makes a louder version of the same tone.

Starting points on a parametric EQ block, to taste:

- **80–100 Hz:** high-pass. A dreadnought fed through a PA produces low-end nobody needs and the sound engineer will remove anyway. Do it yourself and keep control of it.
- **180–250 Hz:** a modest cut, narrow-ish Q. This is where dreadnought boom lives, and it's the biggest source of "muddy in the mix."
- **2–4 kHz:** the piezo peak. A **narrow cut of 3–6 dB** somewhere in here is usually the single biggest improvement available. Sweep a boost to find the ugliest spot first, then flip it to a cut.
- **6 kHz+:** gentle shelf cut if the pick attack is clicking.

Note that all four moves are subtractive. That's not an aesthetic preference — it's the correct order of operations when you're fixing a resonance rather than filling a hole.

## Fix Three: Put the Body Back

Subtractive EQ makes a piezo *inoffensive*. It doesn't make it sound like a rosewood dreadnought, because the body information was never captured in the first place. To get that back you have to add it, and there are two honest ways.

**An acoustic body IR** convolves the piezo signal with the measured response of a real acoustic body — top resonance, air mode, the whole shape. It's the closest thing to putting the box back into the signal. Most modelers will load a third-party acoustic IR into a cab or IR block. I compared this head-to-head with the EQ-only approach in [acoustic IR vs. subtractive EQ](/blog/acoustic-ir-vs-subtractive-eq-piezo-real), and the short answer is that EQ gets you 60% and an IR gets you most of the rest.

The better version, if you own this guitar: **capture a body IR of this specific instrument.** A generic "dreadnought" IR is someone else's guitar. Given that the entire reason to buy the El Dorado over a laminate dread is its particular rosewood voice, capturing that voice and convolving it onto its own piezo signal is the only path that actually preserves what you paid for. [Here's how to capture one](/blog/acoustic-body-ir-capture-your-own-guitar).

If you're recording rather than gigging, skip all of this and [blend the pickup with a microphone](/blog/acoustic-pickup-microphone-blend) — piezo for attack and immunity to bleed, mic for the body. Nothing digital beats a small-diaphragm condenser at the 12th fret.

## If You're Playing This on a Stage

Two things change live, and both bite dreadnoughts harder than smaller bodies.

**Feedback.** A big square-shoulder box with a large air volume has a low, strong Helmholtz resonance — usually somewhere around 90–110 Hz on a dread — and that's the frequency that will run away first through a wedge. A **narrow notch filter** parked on it, plus the high-pass from Fix Two, handles the majority of it. A soundhole cover handles the rest, at the cost of some acoustic volume you don't need when you're amplified anyway. The full live setup, including gain-before-feedback and DI routing, is in [acoustic guitar through a modeler](/blog/acoustic-guitar-through-modeler-worship-di).

**Compression.** Under-saddle pickups already compress on their own — the transducer's response to a hard strum is not linear — so stacking a heavy compressor on top is how you get that lifeless, strummy plateau. If you compress at all, use a low ratio and a slow attack so the pick transient survives.

## What I'd Tell Someone Considering It

At $999 with solid rosewood, a bone nut, a compensated bone saddle and a hardshell case, the acoustic instrument is a straightforwardly good deal. Square-shoulder dread means this sits in the J-45/Dove lineage rather than the Martin D-28 one — more midrange push, a bit less of the scooped hi-fi thing — which is precisely the voicing that suits the Southern soul context King plays in. If you want that, this is a lot of guitar for the money, and the limited-edition status means the window is what it is.

Just go in understanding the trade. **You are buying an acoustic guitar with a good under-saddle pickup, not an acoustic-electric whose plugged-in tone reflects its wood.** Those are different purchases. If you're only ever going to hear it through a PA, a $500 laminate dread with the same pickup gets you a startlingly similar signal, and I'd rather you knew that before you spent the difference.

Buy it for how it sounds in the room. Then do the work above so the room comes with you.
