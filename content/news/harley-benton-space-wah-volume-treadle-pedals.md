---
title: "Harley Benton's Space Wah and Space Volume Land at €39–€49 — And If You're Going Direct, Only One of Them Belongs on Your Board"
date: "2026-08-06"
category: "new-gear"
slug: "harley-benton-space-wah-volume-treadle-pedals"
excerpt: "Thomann just launched three aluminium treadle pedals — Space Wah (€49), Space Volume (€39), and a combined Space Wah/Volume (€49). For anyone running a Helix, HX Stomp or Quad Cortex, the interesting question isn't whether a €49 wah is good. It's that you already own a wah block and a volume block, and buying an analog treadle changes where in the signal path those functions live. That placement change is bigger than the price tag."
source_url: "https://www.gearnews.com/harley-benton-space-wah-volume-3-new-pedals-launched/"
image_url: ""
author_slug: "jess-kowalski"
---

Harley Benton put out three treadle pedals today. Aluminium housings, rocket logos, classic wah-shaped rockers, and prices that round to nothing:

- **Space Wah** — €49. Black enclosure. Vintage '60s voicing, **400 Hz to 2 kHz** sweep. True bypass, status LED, adjustable treadle resistance, 9V battery or DC.
- **Space Volume** — €39. White enclosure. Low-impedance design, **Aux/Tuner output**, a Range knob for sweep adjustment, 9V battery or DC.
- **Space Wah/Volume** — €49. Black base, white treadle. Both functions in one chassis, same 400 Hz–2 kHz wah sweep, switchable true bypass.

All three are up at Thomann now.

I'm the writer here who tells you your $50 RAT is fine, so you already know I'm not going to spend 1,200 words being amazed that a wah costs €49. Wahs have been a solved circuit since 1967. Four resistors, an inductor, and a pot. There is no reason a competent one should cost €200, and there hasn't been for about thirty years.

The thing worth your time is different. **If you run a Helix, HX Stomp, POD Go, Quad Cortex, or basically any modeler made in the last decade, you already have a wah and a volume control.** They're in the box. They're free. So the actual question isn't "is this a good wah." It's "what changes when I put a physical treadle in front of my modeler instead of using the blocks I already own" — and the answer is not what most people assume.

## The Spec Line That Doesn't Parse

First, a flag on the Space Volume. The listing describes it as attenuating your signal **"from 0 dB to +10 dB."**

That phrasing is doing something impossible. Attenuation is negative. A passive volume pedal — which is what almost every €39 volume pedal on earth is — takes your signal from unity down to silence. It cannot make +10 dB, because there's no gain stage inside a potentiometer.

Two readings, and they lead to very different pedals:

1. **It's an active/buffered volume pedal with a boost stage**, and the treadle sweeps from unity to +10 dB. That's a solo-boost pedal in a treadle body, not a swell pedal. It also explains the 9V power requirement and the "low-impedance design."
2. **It's a translation artifact**, the pedal is a normal attenuating volume pedal, and the +10 dB refers to headroom or to the Range knob's ceiling.

The 9V requirement and the low-impedance spec push me toward reading one, but I'm not going to state it as fact off a launch listing. **If you're buying it for volume swells, wait for a real manual or a hands-on before you order.** A pedal that only goes up from unity does not do swells.

That's not a Harley Benton problem specifically — budget launch copy is like this across the board. It's just worth catching before you buy the wrong tool.

## The Part That Actually Matters: Where the Volume Lands

Here's the thing nobody puts in a press release, and it's the single most consequential difference between a hardware treadle and your modeler's built-in block.

**A physical volume pedal in front of your modeler is a volume pedal in front of the amp. It changes your gain, not just your level.**

Think about what your signal chain actually is when you go direct. Guitar → volume pedal → modeler input → drive block → amp block → cab → PA. That volume pedal is upstream of every gain stage in the rig. Roll it back and you're not turning yourself down — you're turning the **input to your virtual Plexi** down. The amp cleans up, the distortion thins out, the tone gets darker, and the sustain falls off a cliff. It behaves exactly like rolling your guitar's volume knob back, because functionally that's what it is.

Your modeler's internal volume block does not have that problem, because **you can drag it anywhere in the chain.** Put it after the amp and cab and it's a true level control: same distortion, same character, less loud. That's what you want for swells and for a quiet outro where the tone shouldn't change.

I wrote about this distinction in [the volume pedal as a dynamics control](/blog/volume-pedal-dynamics-control), and it's the whole argument in [expression pedal vs. volume pedal](/blog/expression-pedal-vs-volume-pedal). Short version for anyone going direct:

- **You want tone-neutral level control (swells, fades, outros)?** Use the modeler's volume block, placed post-amp, driven by an **expression pedal** — a TRS pot, no audio passing through it. The Space Volume is the wrong tool.
- **You want the amp to clean up as you back off?** A hardware volume pedal in front does that beautifully. So does your guitar's volume knob, for free, which you already own.

That's the honest framing. The Space Volume's best case in a direct rig is the **Aux/Tuner output** — a silent-tuning mute point on a board that doesn't otherwise have one. For €39 that's a legitimate reason to buy it. "Volume swells" is not.

And if you're chasing a solo boost, don't do it with a treadle at all — [do it inside the modeler](/blog/solo-patch-volume-drop-fix) where the boost is repeatable to the decibel and doesn't depend on where your foot happened to land.

## The Wah Is a Better Argument Than the Volume

The Space Wah has a stronger case, and it's a boring one: **the HX Stomp doesn't have an onboard treadle.** Neither does the Stomp XL. Neither does the Quad Cortex. If you own one of those and you want wah, you need a physical rocker either way. Your two options are:

1. An **expression pedal** (~€40–€70) driving the modeler's internal wah block.
2. An **analog wah** (€49, this one) in front of the input.

Option 1 gets you every wah model in the box, saved per-preset, with adjustable heel/toe range and auto-engage. Option 2 gets you one wah, always the same, but with a real inductor doing it.

For most people option 1 wins, and it's not close — a preset-recalled wah range is worth more live than any tonal difference between a Wah 1 model and a Cry Baby clone. But option 2 has one genuine advantage, and it's specific:

**An analog wah in front of the modeler sits before the modeler's input, which means it hits your virtual drive with a real resonant peak.** The 400 Hz–2 kHz sweep is a classic '60s range — narrower and lower than a modern Cry Baby's roughly 450 Hz–2.2 kHz — which is squarely the Hendrix/Clapton territory rather than the Morello shriek. If you're building something like the [Hendrix fuzz tone](/blog/hendrix-fuzz-tone-recipe), that lower, throatier sweep is the correct one.

There's a catch, though, and it's the one that trips people moving from a pedalboard to a modeler.

## Wah Into Fuzz Doesn't Work the Way It Used To

The famous wah/fuzz interaction — where a wah in front of a Fuzz Face turns into a squealing oscillating mess — is an **impedance** problem. A vintage-style wah's output impedance is high and swings wildly across the sweep, and a germanium fuzz's low input impedance loads it in a way that breaks both circuits. That's the whole reason "wah before fuzz" is a decades-old argument. I broke the mechanism down in [impedance and buffers](/blog/impedance-buffers-fuzz).

**In a modeler rig, that interaction is gone.** Your Helix or QC input is a fixed high-impedance buffered stage. It doesn't care what the wah's output impedance is doing. So a Space Wah into a virtual Fuzz Face gives you the *frequency* behavior of wah-into-fuzz with none of the *loading* behavior — which means it's cleaner, more predictable, and missing exactly the unhinged quality some people wanted.

Whether that's a bug or a feature is up to you. If you're going for controlled funk wah or a [Morello-style](/blog/tom-morello-rage-tone-recipe) rhythmic thing, buffered and predictable is better. If you're chasing the chaos, the modeler is going to sand it off no matter which wah you put in front.

Worth noting: Line 6's input impedance is switchable (Auto, or fixed values down to 10k). Dropping it manually gets you partway toward the loading behavior, if you want to experiment. That's a free setting, not a purchase.

## Setup, If You Buy One

For the **Space Wah** in front of a modeler:

- Set the modeler input impedance to **Auto** first, and leave the internal wah block off entirely. Two wahs in series is a mistake people make and then blame on the pedal.
- Place it **first in the physical chain**, guitar straight in. It's true bypass, so it's out of the path when disengaged — which also means no buffer, so keep the cable run to the modeler short.
- Adjust the treadle resistance before the first gig, not at soundcheck. Loose treadles drift; over-tight ones kill your ankle by song four.

For the **Space Volume**, if the boost reading turns out to be right, treat it as a **boost**, not a volume pedal: heel-down is your rhythm level, toe-down is your lead. Put it in front and let the amp block get pushed — that's [the same job a clean boost does](/blog/clean-boost-vs-overdrive-vs-volume-pedal-solo-boost), just with continuous control instead of a footswitch.

Either way, everything hangs on placement, and [signal chain order](/blog/signal-chain-order-guide) is where that gets decided.

## What I'd Actually Do

If you're on an HX Stomp or a QC and you don't have a treadle yet, buy an **expression pedal** first. It's the same money, it drives the wah block *and* the volume block *and* whatever else you assign it to, and it saves its range per preset. One purchase, unlimited jobs.

Buy the **Space Wah** if you specifically want an always-the-same analog wah with a vintage-narrow sweep and you already have your expression needs covered, or if you're running a real amp and this is just a wah. At €49 it's a fair deal against a Cry Baby at four times the price, and I'd expect it to be roughly as good, because it's a sixty-year-old circuit.

The **Space Volume** I'd hold on until someone confirms what that ±dB spec actually means. €39 is cheap enough to gamble, but a volume pedal that doesn't attenuate isn't a volume pedal, and "it's only €39" is how boards fill up with things you don't use.
