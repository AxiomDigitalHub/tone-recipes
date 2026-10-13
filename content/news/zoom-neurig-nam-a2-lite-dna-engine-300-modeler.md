---
title: "Zoom's Neurig Is a ~$300 Battery Modeler With NAM A2 Lite, a Knob-Aware 'DNA Engine,' and Capture via the Effects Loop Coming in December. Here's What Each Part Means for Your Tones"
date: "2026-10-13"
category: "new-gear"
slug: "zoom-neurig-nam-a2-lite-dna-engine-300-modeler"
excerpt: "Zoom announced the Neurig on October 9: ¥47,800 (about $300) in Japan from early November, with no US price yet. It has about 30 'DNA Engine' amp and drive models that track knob changes, native NAM A2 Lite loading from TONE3000, 139 effects, two touchscreens, four footswitches, a 4.5-hour battery, and a promise of cloud-built NAM captures from gear plugged into its send/return in December. The two engines solve different problems, and that matters more than either spec on its own."
source_url: "https://guitargangsters.net/zoom-neurig-japan-announcement-2026/"
image_url: ""
author_slug: "jess-kowalski"
---

Zoom announced the **Neurig** on **October 9** in Japan. Most English-language gear sites picked it up on October 12. Here's what's confirmed:

- **Price:** **¥47,800** at the Zoom Store, which is roughly **$300**. That's a currency conversion, not a US price. Zoom hasn't announced US pricing or a worldwide ship date. One Australian retailer lists it at **AU$499**.
- **Release:** **early November 2026**, Japan first.
- **Models:** about **30 "DNA Engine" models** of amps, amp heads, and drive pedals. Zoom's materials and Guitar World's count differ slightly. Six of them are **Zoom originals**, including **Pollex**, which is built for drop tunings.
- **NAM:** native **NAM A2 Lite** loading, with the TONE3000 library available.
- **Effects:** **139**, with up to **14 at once** in series, parallel or split routing. 17 of them are built for an expression pedal, which you'll need to buy separately.
- **Hardware:** two small touchscreens plus physical knobs, **four footswitches**, a **+4 dBu send/return**, stereo outs, MIDI in/out, headphones, a **45-second looper**, a USB-C audio interface at 48 kHz, Bluetooth, and a built-in battery rated for **about 4.5 hours**. It's 850 g.
- **Rigs:** 200 slots, 75 factory rigs, and delay/reverb tails carry over when you switch.
- **Coming later:** a store selling extra DNA models, plus **capture of your own amps and pedals through the send/return, analyzed in the cloud and returned as NAM A2 models**. Both are planned for **December 2026**. Sound sharing is planned for next spring.
- **AI features:** tone generation and stem separation, via Zoom's **SessionZ Pedal** cloud app.

My first question is the one I ask about any modeler with this many features: is this a real rig, or is it a demo video? You can't fully answer that from a spec sheet. You can figure out what each part is actually for, though, and that tells you how you'd use it.

## Two Engines, Two Different Jobs

Zoom put two kinds of amp modeling in one box, and they don't solve the same problem.

**NAM captures are snapshots.** A NAM file is one amp at one setting with one gain, EQ and volume. It can sound fantastic. It also doesn't respond if you turn up the gain knob. You can EQ after it, but you can't make a snapshot taken at 4 o'clock behave like 11 o'clock. That's the same trade-off we explained in [captures vs. models](/blog/quad-cortex-captures-vs-models), and it applies to a $300 Zoom exactly as it does to a $1,700 Quad Cortex.

**The DNA Engine is Zoom's answer to that.** Zoom says these models capture how the amp responds when you move its controls, not just one setting. If that's true, a DNA model behaves like a traditional model: the knobs do what the real amp's knobs do. We haven't played one, so we can't judge how well it holds up across the full range of a knob. That's the first thing I'll test when units ship.

So here's how I'd split the work:

- **Use a DNA model when you'll adjust the amp a lot,** for example a clean amp you push with your guitar's volume knob, or a crunch you change from song to song.
- **Use a NAM capture when there's one exact sound you want,** for example a specific amp a specific capture author dialed in, played the same way every time. On TONE3000 there's probably a capture of whatever you're chasing.

## A2 Lite Isn't a Downgrade on Hardware Like This

People will see "Lite" and assume it's the worse version. Dev covered this in our [A2 explainer](/news/tone3000-nam-architecture-2-a2-open-source-modeling). A2 Lite exists so NAM can run on cheap embedded chips. TONE3000's claim is that it beats some much more expensive capture engines while using a fraction of the processing. For a $300 battery-powered box, A2 Lite is the right choice.

The practical catch is that the same thing happened with the [HeadRush 5.x updates](/news/headrush-5-2-two-nam-a2-blocks-calibration-metadata). TONE3000 is a volunteer library and the files aren't consistently labeled. **Check whether a capture is A2 Lite, A2 Full or A1 before you build a preset around it.** Zoom has only said it supports A2 Lite natively. Until the manual is out, don't assume A1 or A2 Full files will load as they are.

## The December Capture Feature Is the One That Could Matter Most

If you plug a real amp or pedal into the Neurig's send/return and get back a NAM A2 model without buying a capture box, that's the feature that sets this apart from the [Valeton GP-150/GP-180](/news/valeton-gp-150-gp-180-nam-support) and the [Hotone Pulze Jr.](/news/hotone-pulze-jr-ai-presets-nam-battery-modeling-amp). Those two load NAM files but don't create them.

That's a promise, though, and Zoom says December. Two things I'd want answered before I paid for it:

1. **Does the cloud analysis cost money or need an account?** The AI tone generation, stem separation, and DNA model store all run through SessionZ. If capturing requires an ongoing subscription, factor that into the $300.
2. **Can you capture a full amp with a cab and mic, or only pedals and preamps through the loop?** A +4 dBu send/return is line level. That's fine for pedals and preamp outputs. Capturing a cranked tube head needs a load box between the speaker output and the loop. Plan for that hardware, and don't plug a speaker output into a pedal's return jack.

**Don't buy it for a feature that hasn't shipped.** If the Neurig is worth $300 with only what's in the box on day one, the December feature is a bonus. If it's only worth it with that feature, wait until December.

## Pollex and Drop Tunings

Zoom built one of its original amps, **Pollex**, specifically for drop tunings. That's smart, because most budget modelers fall apart there. The low end of a drop-tuned guitar overloads the amp model before the tone gets tight. Even so, a purpose-built model needs the right gain structure in front of it. Cut lows before the amp, keep the drive moderate, and tighten with a boost rather than more amp gain. Our [drop-tuning gain staging guide](/blog/gain-staging-drop-tunings) and [high-gain drop-tuned dial-in](/blog/dialing-in-drop-tuned-high-gain) both apply here.

## Where It Sits for Budget Buyers

Today, my sub-$500 advice is in the [best modeler under $500 roundup](/blog/best-modeler-under-500). The Neurig doesn't change it yet, because we don't know the US price and it doesn't ship until November. Here's what would put it on that list:

- **US price close to $300.** At AU$499, the Australian listing is already higher than the yen conversion. If the US price lands at $399, it's competing in a different bracket.
- **DNA models that actually respond to the knobs.** If they don't, this is a NAM loader with a nice screen, and those are getting cheap.
- **Four footswitches doing enough.** Four switches and 14 effects can work for a cover or worship set, but only if switching between rigs and scenes is fast. My usual test applies: can you build a set in an evening without getting frustrated?

Whatever modeler you have, [level-match](/blog/level-match-modeler-presets) your captures, because NAM files from different authors arrive at different volumes. Once you're running into a PA or FRFR, check the [cab/IR guide](/blog/impulse-response-ir-guide) before you decide a capture sounds bad. Half the time, the problem is a capture that already includes a cab running through another cab IR.

I'll get hands-on time with it as soon as US units exist. Until then: it's an interesting box, and the capture feature is still a promise.

*Zoom Neurig announced October 9, 2026. Specs via [Guitar Gangsters](https://guitargangsters.net/zoom-neurig-japan-announcement-2026/), [Guitar World](https://www.guitarworld.com/gear/amp-modeler-pedals/zoom-neurig), [Guitar.com](https://guitar.com/news/gear-news/zoom-neurig/) and [Gsus4](https://gsus4.com.au/en-us/blogs/guides/zoom-neurig-first-look-amp-modelling-effects).*

## Dig Deeper on Fader & Knob

- [NAM Architecture 2 (A2) explained](/news/tone3000-nam-architecture-2-a2-open-source-modeling): why Lite exists.
- [Captures vs. models](/blog/quad-cortex-captures-vs-models): the snapshot problem the DNA Engine is meant to solve.
- [Valeton GP-150/GP-180 NAM support](/news/valeton-gp-150-gp-180-nam-support): the sub-$200 NAM competition.
- [Best modeler under $500](/blog/best-modeler-under-500): where the Neurig will have to compete.
- [Gain staging for drop tunings](/blog/gain-staging-drop-tunings): before you judge Pollex.
