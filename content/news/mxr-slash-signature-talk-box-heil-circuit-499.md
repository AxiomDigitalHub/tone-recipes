---
title: "MXR Built Slash a $499 Talk Box — and Your Helix Has Had a Block Named After One for Eight Years That Can't Do It"
date: "2026-09-16"
category: "new-gear"
slug: "mxr-slash-signature-talk-box-heil-circuit-499"
excerpt: "MXR's Slash Signature Talk Box is a hot-rodded Heil circuit with Volume, Tone and Gain, finished in Candy Apple Red, $499.99 and exclusive to Reverb. Helix owners will reach for the Voice Box block instead and be disappointed, because Voice Box sweeps between two vowels on an LFO timer and a talk box is your mouth. There is one controller assignment that closes most of that gap, and a routing problem with ampless rigs that nobody in the press release mentions."
source_url: "https://www.guitarworld.com/gear/guitar-pedals/mxr-slash-talk-box"
image_url: ""
author_slug: "hank-presswood"
---

MXR announced a Slash signature talk box today. **$499.99, exclusive to Reverb.** It is a hot-rodded version of the classic Heil circuit with an upgraded loudspeaker, three controls — **Volume, Tone, Gain** — and the Candy Apple Red finish Slash has put on nearly everything he has ever signed his name to.

Slash, on the pedal: *"I've had a talk box since I was 16."* He goes on to rank it alongside the Cry Baby wah in importance.

That's a bigger claim than it sounds like. The wah is on more records than anybody can count. The talk box is on maybe a dozen songs most people can name. I want to spend a minute on why that is, because it explains the price, and then spend the rest of this on the thing that actually matters to anyone reading this on a modeler: **the block in your Helix called Voice Box is not a talk box, and it was never going to be.**

## The Heil Lineage, Briefly

A talk box is not an effect in the sense that a fuzz is an effect. There is no circuit shaping your tone. There is a small loudspeaker driver in a box, a length of plastic tubing running from that driver up to the side of your mouth, and a vocal mic in front of your face. The driver plays your guitar signal into the tube. The tube fires it into your mouth. Your mouth — tongue, jaw, lips — filters it the same way it filters your voice. The mic picks up what comes out.

You are the filter. That is the whole design.

Bob Heil built his version for Joe Walsh in the early '70s, and it turned up on "Rocky Mountain Way." Peter Frampton's is the one everybody knows from *Frampton Comes Alive!*, and the Heil was the preferred unit because it put out more level than the alternatives, which matters when the whole thing depends on driving enough acoustic energy up a piece of tubing.

Slash's own origin story on this is better than most signature-pedal copy. He has said he bought his from a guy who used to play in a disco band, and that he is well aware the effect carries a reputation for indulgence. He used it on **"Anything Goes"** on *Appetite for Destruction* — trading phrases between straight guitar and talk box rather than parking on it for eight bars. That restraint is the correct way to use one and it is why that track has aged better than most talk box features.

I have sold exactly four talk boxes in 25 years behind a counter. Three came back within a month. The one that didn't went to a guy who had a specific part to play.

## Why the Helix "Voice Box" Block Disappoints You

Here is the part that sends people looking for a real one.

Line 6 has shipped a model called **Voice Box** since Helix firmware 2.50. It lives in the **Legacy** category — it came up out of the M-series and FM4 line — and Line 6's own description name-checks vocoders, vocal tracts and surgical tubing, telling you it produces a sound typical of a classic talk box.

It does, sort of. And then it doesn't, for a reason that is structural rather than a matter of tweaking.

Voice Box is a **formant filter driven by an LFO.** You set a **Start** vowel and an **End** vowel, you set a **Speed**, you set a **Mix**, and the block sweeps between those two vowel shapes on a timer, over and over, whether or not that is what the music wants. Set Start to *U* and End to *A* and it will go "oo-ah, oo-ah, oo-ah" at whatever rate you dialed, forever.

A talk box does not have a rate. A talk box has *you*. The reason "Anything Goes" and "Rocky Mountain Way" sound like speech is that a human being is forming syllables in real time, in rhythm with the part, with the irregularity that implies. An LFO cannot do irregular. That is the definition of an LFO.

So when you A/B the Voice Box block against a record and conclude your modeler is doing it wrong — it isn't. You are comparing a metronome to a singer.

**Quad Cortex owners have it worse:** there is no formant or talk box device at all. The request has been sitting in Neural DSP's own community since at least September 2025, and a Neural rep confirmed on that thread there's an existing feature request and no word on whether it's coming. Don't build a live set around it arriving.

## The One Assignment That Gets You Most of the Way There

Here's the fix, and it costs nothing.

**Stop letting the LFO drive the vowel. Put your foot on it.**

On Helix or HX Stomp, add a Voice Box block and controller-assign the vowel movement to an expression pedal instead of leaving it on Speed. The point is to make the vowel position a thing you *perform* rather than a thing that cycles.

- Add **Voice Box** (Legacy > Filter), place it **after the amp block and before the cab**, not at the front of the chain. A real talk box is driven at speaker level from an amp's output, so post-amp is where it belongs tonally.
- Assign the **vowel parameter to EXP 2** (or EXP 1 if your wah lives elsewhere). Set the heel position to a closed, dark vowel and the toe to an open one — **heel at U, toe at A** is the classic sweep and the one that reads most clearly as speech.
- Pull **Speed** down as far as the model allows so the LFO stops fighting your foot for control.
- **Mix around 45%.** Above about 60% the dry guitar disappears and the effect goes from "talking guitar" to "novelty." Slash's restraint on the record is a mix decision as much as a playing decision.
- Set the amp block **cleaner than your normal lead sound.** A formant filter is a stack of narrow resonant peaks, and heavy distortion ahead of it smears the peaks into mush. This is also true of the real hardware, which is why talk box parts on records sound less saturated than the rest of the guitars.

That gets you a foot-controlled vowel sweep with your phrasing in it. It will not get you consonants — no pedal gives you a hard *T* or a *ch* — and consonants are half of why the real thing sounds like a voice. That's the honest ceiling on the software approach, and it's the $499.99 question.

## The Routing Problem Nobody Mentions

If you run a modeler direct into FRFR or straight to in-ears, and you buy a traditional Heil-circuit talk box, you may discover you cannot plug it into anything.

The classic design expects to be fed **at speaker level from an amp head's speaker output.** That's why the old instructions all involve a second amp and a speaker-jack swap. Our [preamp out vs. effects loop routing guide](/blog/preamp-out-power-amp-in-vs-effects-loop-jacks) walks through what those jacks actually carry and why a line-level modeler output isn't a substitute — you cannot send a Helix's XLR out into a driver that wants 20 watts of speaker signal and expect noise.

MXR describes this one as compact and pedalboard-friendly with its own amp and speaker driver on board. **If that holds up, it is genuinely the news here for our readers** — a self-powered talk box is the first version of this effect that drops into an ampless rig without a power amp hanging off the back. MXR has not published a wattage figure for the internal amp, and I'd want that number before I called it solved, particularly for anyone playing a loud stage where the driver has to compete with wedges.

The other half of the routing that people forget: **the talk box output is not an output.** The sound leaves through your mouth and into a vocal mic. That means the part never passes through your modeler's cab block, your IR, your delay or your FOH channel — it lands on the *vocal* channel. Sort that out with your sound person before the service or the gig, not during it. If you're the one running the board too, our [DI and mic-blend guide](/blog/acoustic-pickup-microphone-blend) covers the same gain-staging problem from the acoustic side and the arithmetic is identical.

## Running It With Our Slash Recipes

Our [Welcome to the Jungle recipe](/recipe/slash-welcome-to-jungle-aggressive-riff) is built on **Brit 2204** with **Drive at 8.0, Mid at 7.0, Treble at 7.0**, a **Scream 808** in front at **Gain 2.0, Tone 5.5, Level 8.5**, a **4x12 Greenback 25** cab and a Deluxe Comp. That's a great rhythm sound and a bad talk box feed, for the reason above: too much gain ahead of a formant filter turns resonant peaks into fizz.

If you want to add a talk box passage — real or Voice Box — to a preset built on that recipe, change these:

- **Drive: 8.0 down to about 4.5.** You want the amp's midrange character without the compression that comes with the saturation.
- **Scream 808: bypass it entirely** for the talk box snapshot. It's doing boost duty into the 2204 and you don't need boost here.
- **Mid: leave it at 7.0.** The midrange is what survives the tube. Don't scoop it.
- **Deluxe Comp: keep it, and consider more of it.** Even attack helps the driver, and it's the one place compression genuinely earns its keep in this chain.

Set that as its own snapshot so you can jump in and out mid-song the way "Anything Goes" does. Our [snapshot workflow guide](/blog/helix-worship-snapshots-sunday-morning) is written around Sunday mornings, but the mechanics are the same for a bar gig.

For the amp side generally, the [JCM800 settings guide](/blog/jcm800-settings-guide) covers why the 2204 responds the way it does when you back the Drive off, which is the single adjustment this whole section hinges on.

## Is It Worth $499.99?

I price gear for a living, so here's how I'd weigh it.

Five hundred dollars is a lot for an effect you will use on one song, and most people who buy a talk box use it on one song. Reverb-exclusive distribution also means no shop is going to discount it, and it means you can't play one before you buy unless a friend has it.

Against that: there is no software substitute. That is unusual in 2026. Nearly every classic pedal on this site has a modeler block that gets you 90% of the way there for free — that's most of what we write about. The talk box is the exception, because the missing piece is not a circuit, it's your mouth, and nobody has modeled that. The Voice Box block with an expression pedal will cover a *filter sweep* convincingly. It will not cover a syllable.

So the honest test is simple. If you have a specific part — a real one, in a set you actually play — where the guitar needs to say a word, this is the only way to get there, and the built-in amp means you can finally do it without dragging a head to the gig. If you're buying it because the Frampton record is great, you will be one of the three out of four that came back to my counter.

Either way: if you're going to try the Voice Box route first, assign the vowel to a pedal, drop the Mix to 45%, and take 3.5 off your Drive. Most people who conclude the block is useless never did any of the three.
