---
title: "Boss Just Put the HM-2 in a Plugin — Your Helix Has Had It Since Firmware 3.0, and Almost Nobody Sets It Right"
date: "2026-09-21"
category: "new-gear"
slug: "boss-effects-plugin-hm2-hm3-mz2-swedish-chainsaw"
excerpt: "Boss added the HM-2 Heavy Metal, HM-3 Hyper Metal and MZ-2 Digital Metalizer to its Effects Pedals plugin today, Roland Cloud subscription only. Helix, HX Stomp and POD Go owners already have an HM-2 model called Swedish Chainsaw and have had it for years — the reason it sounds like mud is a gain-staging error, not a modeling one. The HM-3 and MZ-2 are the actual new ground, because no major modeler has ever modeled either."
source_url: "https://www.gearnews.com/boss-effects-pedals-plugin/"
image_url: ""
author_slug: "viktor-kessler"
---

Boss expanded its **Effects Pedals plugin** today with three metal-oriented additions: the **HM-2 Heavy Metal**, the **HM-3 Hyper Metal**, and the **MZ-2 Digital Metalizer**. They are included for anyone with a Roland Cloud subscription, and there is a 30-day demo if you want to hear them before committing.

The subscription is the catch, and I want to be direct about it before anything else. There is **no standalone purchase option**. Roland Cloud runs **$19.99/month**, **$49.99 for three months**, or **$199/year** for the Ultimate tier. The plugin ships as VST3, AU and AAX, and wants Windows 10 or later, macOS 12 or later, 2GB of RAM, and an Intel Core i5 or Apple Silicon.

So the question a Helix or HX Stomp owner should be asking is not "is the HM-2 good." It is: **what does this get me that my modeler does not already have?**

I went through it block by block. The answer is more interesting than I expected, and it is not the pedal everyone is excited about.

## You Already Own an HM-2. It Is Called Swedish Chainsaw.

Line 6 models the **Boss HM-2 (Japan black-label)** under the name **Swedish Chainsaw**, in the Distortion category. It has been in the Helix family since the 3.0 firmware — Helix Floor, Rack, LT, HX Stomp, HX Stomp XL, HX Effects and POD Go all have it. It costs nothing. You have had it for years.

The recurring complaint about that model is that it sounds like a wasp in a paper bag and nothing like the records. I have measured this one and I want to state the conclusion plainly: **the model is fine. Your gain structure is wrong.** There are two errors and they compound.

**Error one: you are running it into a high-gain amp model.**

The HM-2 is not a boost. It is a complete distortion circuit with its own clipping stage and its own tone network, and that network is not a normal tone control. The two stacked knobs are a **Color Mix** pair — one for highs, one for lows — and turning both up does not sweep a filter, it *adds* two bands on top of a signal that is already saturated and already thick with even and odd harmonics.

Feed that into a Badonk or a Line 6 Fatality and the amp's own input stage has nothing left to do except compress what is already compressed. The result is a broadband hash with no attack transient, which is the mush people describe.

The records that made this pedal famous were not made that way. That sound is an HM-2 into an **amp doing comparatively little distorting of its own** — the pedal is the distortion, the amp is a loud, fairly clean power stage and a speaker. In the Helix that means a clean-ish or edge-of-breakup model, not a modern high-gain one.

**Error two: you are treating maxed knobs as a setting rather than a starting point.**

The "everything on full" configuration is real, it is the documented origin of that Swedish guitar sound, and it works — but only in the context above. Turn all four controls up while feeding a high-gain amp model and you have stacked three distortion stages in series. That is not a tone, that is a measurement error.

## The Settings That Actually Work in a Helix

Here is the chain I would build, and the reasoning for each choice.

**Swedish Chainsaw → clean/low-gain amp → 4x12.** Put the Swedish Chainsaw block first, right after the noise gate.

- **Level: 5.0.** Unity-ish. You are not using this as a boost, so do not let it slam the amp's input.
- **Dist: 10.0.** This is the one knob where the extreme value is correct. The circuit's character *is* its clipping stage fully open.
- **Color Mix High: 10.0 / Color Mix Low: 10.0.** Both full. This is the part that makes it a chainsaw rather than a fuzz — a huge low shelf and a huge high shelf with the midrange left where it falls.
- **Amp block: something clean and loud.** A Line 6 Litigator or an Essex A30 set to **Drive 2.5–3.5** does the job. What you want from the amp is power-stage compression and a midrange voice, not gain. If your amp model's Drive is above 4.0, you have not fixed error one.
- **Cab: 4x12 with V30s, Low Cut at 90Hz, High Cut at 6.0kHz.** The maxed Color Mix High is going to put real energy above 6k. That energy is why the pedal sounds like a chainsaw on a record and like an insect through headphones — on a record it is being absorbed by a cab and a room. Model that or you will hate it. Our [V30 fatigue piece](/blog/v30-fatigue-modern-metal) covers why that upper-mid region behaves the way it does when it is not being loaded.
- **Noise gate first, not last.** Four controls at maximum is an enormous noise floor. Put a gate ahead of the distortion where it is looking at the clean signal, which is the only place it can make a threshold decision that is not garbage. [Sidechain vs. inline gating](/blog/sidechain-vs-inline-noise-gate) is the long version of why.

Make those five changes and A/B it against whatever you were doing before. If it still does not work, the problem is upstream of the pedal.

## The Real News Is the HM-3 and the MZ-2

Here is the part I did not expect.

Nearly every classic dirt box has a modeler equivalent by now. That is most of what we do here: the Rat is a Vermin Dist, the Tube Screamer is a Scream 808, the Big Muff is a Triangle Fuzz or a Bighorn Fuzz. The HM-2 is a Swedish Chainsaw.

**The HM-3 Hyper Metal and MZ-2 Digital Metalizer have no equivalent.** Not in the Helix family, not on the Quad Cortex. They were never modeled, they are not cheap or common secondhand, and until today the only way to hear one was to find one.

That is unusual, and it is the honest reason to take the 30-day demo.

The HM-3 is the later, tighter, more scooped take — closer to the mid-scooped modern voicing people chase now than to the HM-2's broadband wall. The MZ-2 is the odd one: a digital pedal with a short doubling delay built into the distortion path, which is why its reputation has never been purely a metal reputation. Boss's own announcement points at David Gilmour having used the doubling at one point, which tells you what the circuit is actually for.

A doubler inside the distortion stage is a different thing from a doubler after it, and that is worth understanding before you try to fake it. If you put a Simple Delay at 20–35ms after a distortion block in your Helix, you are delaying the *distorted* signal. The MZ-2's short delay is in the signal path in a way that affects what gets clipped. You can approximate the result, not the mechanism. Our [double-tracking on a time budget](/blog/double-tracking-on-a-time-budget) piece covers where short delays help and where they smear, and the smear risk is real at these gain levels.

## Should You Subscribe?

I will give you my actual decision procedure.

**If you own a Helix, HX Stomp, HX Effects or POD Go and you want an HM-2 sound:** you already have one. Fix the gain staging above. Do not pay $199/year for a pedal you own. If the Swedish Chainsaw still does not satisfy you after the five changes I listed, that is real information and worth knowing before you spend anything.

**If you record in a DAW and you want the HM-3 or MZ-2:** take the 30-day demo, print stems through both, and decide from the stems. These two circuits genuinely are not available anywhere else, and that is rare enough in 2026 to be worth a month of your attention.

**If you are considering the subscription for the whole collection:** the plugin has been accumulating steadily — the January 2026 batch added the DM-2 Delay, OD-2 Turbo OverDrive and DC-2 Dimension C; May 2026 brought the PW-2 Power Driver, XT-2 Xtortion and CS-2 Compression Sustainer; the original May 2025 launch had eight, the SD-1 and DS-1 among them. That is a reasonable library. It is also a rental. If you stop paying, your old sessions stop opening correctly, and that is a project-archival problem, not a tone problem. Weigh it as one.

For everyone else: a **Boss DS-1**, which the Helix models as **Deez One Vintage**, costs nothing and is in your unit right now. Our [DS-1 settings guide](/blog/boss-ds1-settings-guide) and the [overdrive vs. distortion vs. fuzz explainer](/blog/overdrive-vs-distortion-vs-fuzz) will get you further than a subscription will, and I would rather you spend the $199 on a noise gate and a better pair of headphones.

One last thing, because it is the entire point of this article. Before you conclude any modeled distortion is inadequate, check what is after it. In my experience the block is almost never the problem. The amp model behind it, at Drive 8, is.
