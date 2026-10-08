---
title: "Joe Bonamassa Just Put His Name on a Digital Amp — and the Circuit Inside It Has Been Sitting in Your Quad Cortex Since 2022, Four Different Ways, While Your Helix Has Never Had It At All"
date: "2026-10-08"
category: "new-gear"
slug: "fender-bonamassa-tone-master-59-twin-jb-5f8a-quad-cortex-helix"
excerpt: "Fender unveiled the Tone Master '59 Twin-Amp JB Edition today — $1,999.99, 85 watts, 2x12 Celestion JB Neodymiums, six-way attenuator, and a digital recreation of the 5F8-A high-power tweed Twin. The man who called himself the king cork-sniffer of vintage amps says he wanted to hate it. Here is the part nobody is reporting: the 5F8-A has been a stock amp model on the Quad Cortex since June 2022, in four variants including two jumped ones, and it has never existed on a Helix in any firmware. If you own one of those two boxes, today's news is a settings change, not a purchase."
source_url: "https://www.premierguitar.com/news/fender-and-joe-bonamassa-introduce-the-tone-master-59-twin-amp-jb-edition"
image_url: ""
author_slug: "hank-presswood"
---

Fender unveiled the **Tone Master '59 Twin-Amp JB Edition** today — the first signature amplifier in the Tone Master line, built with **Joe Bonamassa**, at **$1,999.99** street (£1,789 / €2,099).

The specs: **85 watts** maximum into **two 12" Celestion JB Neodymium speakers** voiced to Bonamassa's spec, a **six-way power attenuator** (full power plus five reduced settings), **convolution spring reverb**, an **effects loop**, a **Vintage/Tight switch** for low-end response, and a **balanced XLR line output** with **three onboard cabinet impulse responses** plus custom IR loading through the Tone Master IR Manager app. It weighs **29 pounds**, and the footswitch and cover are in the box.

What it models is a **5F8-A high-power tweed Twin**, voiced after Bonamassa's own late-'50s amps.

Bonamassa, who has spent his career as one of the loudest voices for vintage tube amplification, did not bury the lede himself. **"I wanted to hate it,"** he told MusicRadar. **"I'm the king cork-sniffer of vintage amps… but you cannot deny the fact that it sounded, at least to my ears, better and more consistent."** And: **"I never thought I'd see in my lifetime the fact that I'd be sitting next to a digital amp."**

I have been selling and appraising vintage Fenders for a living since the Reagan administration, so let me say plainly that I understand exactly what he means and I am not going to pretend to be scandalized by it.

But every piece of coverage I have read today stops at that quote. None of them answer the question a modeler owner should actually be asking, which is: **I already own a digital amp. Do I already own this?**

For a lot of you, the answer is yes, and has been for four years.

## Who Already Has a 5F8-A

| Platform | The 5F8-A model | Since |
|---|---|---|
| **Neural DSP Quad Cortex / mini** | **US HP Tweed TWN Normal**, **Normal Jumped**, **Bright**, **Bright Jumped** | CorOS 1.4.0, June 21 2022 |
| **Fractal Axe-FX III / FM9 / FM3** | **5F8 Tweed** (modeled from Keith Urban's '59) | long-standing |
| **Line 6 Helix / HX Stomp / LT / POD Go** | **nothing** | — |

Go check. If you own a Quad Cortex, open the amp list and scroll to US HP Tweed TWN. It is stock. It came free in a firmware update when the Quad Cortex was barely a year old, alongside the Bogner Überschall and three Diezel Herbert channels, and it has been sitting there ever since while most owners walked past it on the way to something with more gain.

Four variants, because the 5F8-A has **two inputs and two volume controls** — Normal and Bright. Neural modeled both channels, and then modeled both channels **jumped**, which is the thing I want to talk about, because it is the part that matters for this tone and almost nobody uses it.

## Jumping Is the Tone, Not a Trick

On a real 5F8-A you have six knobs: **Volume (Normal), Volume (Bright), Treble, Middle, Bass, Presence**. The two volumes are not a channel selector. They are two separate preamp paths into a shared tone stack and a shared power section.

Jumping means running a short patch cable from one input to the other so your guitar feeds **both** preamps at once, and then blending them with the two volume knobs. The Normal channel is darker and fuller; the Bright channel has a treble bypass cap on its volume pot and gets thin and cutting at low settings. Blend them and you get a thickness and a harmonic density that **neither channel can produce alone**, because you are summing two slightly different-sounding paths with slightly different phase behavior into one tone stack.

This is the oldest trick in the tweed/Bassman/Plexi world and it is why "Jumped" exists as a separate model rather than a switch. It is a different circuit, not a different setting.

So on a Quad Cortex, if you want the amp Fender just announced:

- Load **US HP Tweed TWN Normal Jumped** (not plain Normal — start jumped)
- Both volumes are available as parameters. Start **Normal at 6.0, Bright at 3.5** and move the balance by ear. More Bright = more cut and more top-end grit. More Normal = more body
- **Middle high.** The 5F8-A's tone stack is a passive Fender network, which means the Middle control sets how deep the mid notch goes, and there is no setting that fills it back in. Start at **7.5–8.0** and only come down if it is honking. Our full explanation of why that knob works backwards from how people assume is in [the Fender amps with no mid knob](/blog/fender-amps-with-no-mid-control) — the mechanism is the same network
- **Presence is a power-amp control, not a treble control.** It operates in the negative feedback loop of the output stage, so it adds top-end *by removing feedback*, which also loosens the amp slightly. Start **4.0** and treat it as a feel knob
- **Keep the gain structure low and the output stage honest.** This is an 85-watt amp with four power tubes. It is not supposed to be compressing

On a Fractal, load **5F8 Tweed** and do the same thing — the model is already the right amp.

## If You Own a Helix, You Don't Have This Amp

Here is the full tweed and Bassman roster on a Helix, and I checked our own [amp model cheat sheet](/blog/helix-amp-model-cheat-sheet) against the 3.80 list before writing this:

- **Fullerton Nrm / Brt / Jump** — tweed Deluxe, 5E3. Two 6V6s, 15 watts, 1x12
- **Tweed Blues Nrm / Brt** — tweed Bassman, 5F6-A. Two 5881s, about 40 watts, 4x10
- **US Small Tweed** — small tweed combo
- **Mail Order Twin** — a Silvertone, despite the name
- **Voltage Queen**, **Soup Pro**, **Stone Age 185**, **US Dripman**

No 5F8-A. Not in any firmware, not under any name. And note that **Mail Order Twin is not a Fender Twin** — it is the Silvertone 1484, and if you went looking for a tweed Twin on a Helix by reading model names, that is the trap you fell into.

The closest thing you have is **Tweed Blues Nrm**, the 5F6-A Bassman, and the good news is that it is a genuinely close relative. Same era, same designer, same six-control panel with Middle and Presence, same GZ34 rectifier. The 5F8-A is essentially what happens when Fender takes that circuit, **doubles the output tubes to four**, stiffens the power filtering, and puts it in front of a 2x12 instead of a 4x10.

So the knob positions transfer almost directly. What does not transfer is the power section, and that is the whole difference.

### Three Changes to Move Tweed Blues Toward a High-Power Twin

**1. Bring the Master *down*, not up.** This is the opposite of the advice we give for small amps and it is the single most important change here. In a Helix amp block, the **Master parameter models the power section** — how hard the output stage is working — and it is not your output level. A 40-watt Bassman at Master 6 is starting to compress and sag. An 85-watt Twin with four power tubes at any volume a human can tolerate **is not doing that**. Drop **Master to 3.5–4.5** and make up the volume with the block's **Level** or the Ch Vol. What you are buying is headroom, and headroom is this amp's entire personality. (Helix amp parameters run 0–10, not 0–1 — if you have been typing decimals, fix that first.)

**2. Change the cab.** Swap the 4x10 for the **2x12 Twin** cab (a C12N-style 2x12). The 4x10 Bassman cab has a low-mid push and a looser bottom that reads as "Bassman" to anyone who knows the sound. The 2x12 is tighter and more focused in the upper mids, which is what you want. Mic and cut positions are in [our cab and IR pairings guide](/blog/helix-cab-ir-pairings).

**3. Add 1.0 to the Bass, take 0.5 off the Drive.** The extra filtering and the extra pair of power tubes give the 5F8-A a firmer, more extended low end than the Bassman has, and the stiffer supply means it takes more signal to push into breakup. Both of those are the same physical cause expressed two ways.

If you want to understand *why* you are chasing headroom rather than breakup here, [clean headroom on a Fender amp and why your chords don't break up](/blog/clean-headroom-fender-amp-chords-dont-break-up) is the piece — and the [rectifier and sag](/blog/tube-vs-solid-state-rectifier-vintage-fender-sag) article covers the supply-stiffness side of it.

## The One Part Nobody Can Model Yet

The **Celestion JB Neodymium** is a new speaker. It did not exist last week.

That means **no IR of it exists in any modeler, from anybody** — not Line 6, not Neural, not Fractal, not a third-party IR house, not a NAM capture. It cannot. And since a 2x12 cab is doing a very large share of the audible work in an amp like this, that is the honest gap between what you can build tonight and what Fender is shipping.

The real '59 Twin ran **Jensen P12N** or **P12Q** alloy-magnet speakers. The JB Neo is explicitly *not* that — it is a lightweight neodymium driver voiced for Bonamassa's touring rig, which is why the amp weighs 29 pounds instead of the 60-plus a real tweed Twin weighs. So you cannot even substitute a vintage Jensen IR and call it close; you would be modeling the 1959 amp, not the 2026 one.

The useful detail is that the JB Edition **accepts custom IRs through the Tone Master IR Manager app**. Which means Fender has built the infrastructure to distribute a JB Neodymium IR if it wants to, and if that file ever ships, it drops straight into a Helix, a Quad Cortex or a Fractal like any other IR. Until then: closest proxies are a 2x12 C12N or an alnico-magnet 2x12, and our [Celestion speaker comparison](/blog/celestion-speaker-showdown) covers what a neo driver actually does differently from a ceramic or alnico one.

## Why *This* Amp Converted Him, Specifically

I [put a Tone Master Deluxe Reverb next to a tube Deluxe Reverb on the same amp stand in April](/blog/fender-deluxe-reverb-vs-tonemaster) and ran identical settings. My finding then, which I stand behind: the Tone Master platform matches the tube amp **closely enough to be startling in clean and low-volume territory**, and the gap opens up at the top, at the specific moment the output tubes start saturating.

Now look at what Bonamassa plays. An 85-watt, four-power-tube amp, used loud and mostly clean, with the dirt coming from pedals in front of it and a Dumble doing the lead work. He operates almost entirely in the region where I found the Tone Master platform is **strongest**, and almost never in the region where I found it comes up short.

That is not a knock on him and it is not a defense of Fender's marketing. It is the actual reason the conversion story holds together. If Fender had handed him a Tone Master tweed Deluxe — 15 watts, two 6V6s, an amp whose entire identity *is* power-stage collapse — I do not think we would be reading these quotes today. The platform's weakness is in small amps, and they built him a big one.

Also worth noting, since I complained about it in April: **the JB Edition has an effects loop.** The Tone Master Deluxe Reverb does not, and neither does the tube original. That is a real addition.

## What This Does Not Change

Our [Bonamassa "Sloe Gin" recipe](/recipe/bonamassa-sloe-gin-blues-rock-lead) is built on a **Dumble Overdrive Special with a Marshall Greenback cab and an always-on TS808**, because that is what the tone on that record is. A high-power tweed Twin is not in that signal path, and today's announcement does not change a single parameter in that preset.

I am saying that out loud because the easy move would be to tell you this amp unlocks our Bonamassa presets. It does not. What it unlocks is **the clean platform underneath his rig** — the loud, stiff, headroom-forever Fender that his pedals and his Dumble sit on top of. If you have been building Bonamassa tones on a blackface Twin Reverb model because it was the only thing with "Twin" in the name, **that was the wrong amp**, and a jumped US HP Tweed TWN on a Quad Cortex or a retuned Tweed Blues on a Helix is a materially better starting point. The rest of our blues-platform picks are in [the best Helix amp models for blues](/blog/best-helix-amp-models-blues), and his gear history is on [his artist page](/artist/joe-bonamassa).

## The Thing I'd Want to Measure

A frequency sweep and a compression-onset measurement of the JB Edition at full 85 watts versus its lowest attenuator setting, against a Quad Cortex **US HP Tweed TWN Normal Jumped** at matched knob positions.

My prediction: at the top three attenuator settings the two land close enough that a blind listener would not reliably separate them, and essentially all of the remaining difference is the JB Neodymium cab rather than the amp model. My second prediction, less confident: at the **lowest** attenuator settings they diverge more than you would expect, because digital attenuation in a Tone Master and a modeled power stage in a Quad Cortex are solving the same problem with different assumptions about what happens to the output transformer. [Power scaling and attenuation are not the same thing](/blog/power-scaling-vs-attenuator), and that distinction is exactly where I would expect the two boxes to disagree.

I do not have the amp. That is a hypothesis, not a finding, and I will label it that way until somebody puts a mic in front of one.

*Sources: [Premier Guitar](https://www.premierguitar.com/news/fender-and-joe-bonamassa-introduce-the-tone-master-59-twin-amp-jb-edition), [MusicRadar interview](https://www.musicradar.com/artists/fender-joe-bonamassa-interview-tone-master-59-twin-amp-jb-edition), [guitar.com](https://guitar.com/news/gear-news/joe-bonamassa-signature-fender-tone-master/), [Guitar World](https://www.guitarworld.com/gear/combo-amps/fender-joe-bonamassa-tone-master-59-twin), [Sweetwater](https://www.sweetwater.com/store/detail/TMTwinJB--fender-joe-bonamassa-tone-master-59-twin-85-watt-2-by-12-inch-combo-amplifier), [Neural DSP CorOS 1.4.0 release notes](https://neuraldsp.com/quad-cortex-updates/coros-1-4-0-is-now-available), [Fractal Audio 5F8 Tweed model thread](https://forum.fractalaudio.com/threads/fractal-audio-amp-models-5f8-tweed-keith-urbans-59-high-power-fender-twin-amp-5f8.111123/), [Vintage Guitar on the high-powered Twin](https://www.vintageguitar.com/62702/the-fender-high-powered-twin/).*
