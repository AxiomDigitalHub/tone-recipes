---
title: "TONE3000 Releases NAM Architecture 2 — Free, Open-Source, and It Beat Neural DSP and Line 6 in Blind Tests"
date: "2026-06-05"
category: "new-gear"
slug: "tone3000-nam-architecture-2-a2-open-source-modeling"
excerpt: "On June 2, TONE3000 and NAM creator Steve Atkinson released Architecture 2 — a ground-up rebuild of the free Neural Amp Modeler engine. It runs better than Quad Cortex's capture engine at 50% CPU on a $3 chip, it's fully open source, and in a 1,000-person blind test it out-scored Neural DSP, IK ToneX, and Line 6 Proxy. The whole thing costs nothing."
source_url: "https://www.tone3000.com/blog/introducing-neural-amp-modeler-nam-architecture-2-a2"
image_url: ""
author_slug: "dev-okonkwo"
---

I want to be careful here, because every few months somebody claims they've reinvented amp modeling and it usually turns out to be a marketing slide. So let me start with the part that's hardest to wave away: the blind test.

On June 2, TONE3000 — the capture-sharing platform formerly known as ToneHunt — released **Neural Amp Modeler Architecture 2 (A2)**, built in partnership with Steve Atkinson, the person who created NAM and open-sourced it back in 2019. Before launch they ran a MUSHRA listening test. Over 1,000 participants. More than 100,000 individual ratings. MUSHRA is the methodology audio researchers actually use when they need to defend a result — hidden reference, hidden anchor, blind comparison. It's not a YouTube poll.

A2 won. In median scores, both A2 variants out-ranked Neural DSP's Neural Capture V2, IK Multimedia ToneX, and Line 6's Proxy engine. TONE3000 also published the quantitative side — four error metrics (ESR, MAE, LOG_MEL, MRSTFT) run through Bayesian Elo ratings across 39 different tones. You can argue about weighting. You can't really argue that they hid the methodology.

And the thing doing the winning is free.

## Two versions, and the second one is the interesting one

A2 ships in two flavors.

**A2-Full** is the studio/pro target. It sounds better than the old A1-Standard architecture *while using 30–40% less CPU* — TONE3000's framing is that you can run three A2-Full models for the CPU cost of two old ones. For someone like me, who builds ambient loops by stacking four or five processed guitar layers in a session until my interface starts complaining, that's not a footnote. That's headroom.

**A2-Lite** is the one that changes the map. It's built for embedded hardware — multi-fx pedals, amps, the cheap stuff — and it runs at **50% CPU on a $3 ARM Cortex-M7 600MHz chip**. TONE3000's claim is that A2-Lite on that $3 chip sounds better than a Quad Cortex's capture engine. Sit with that for a second. The capture quality people pay $1,700 for, running on a microcontroller that costs less than a coffee.

For perspective, they say a MacBook with an M-series chip can run 64 A2-Full models or 200 A2-Lite models simultaneously. I have no use for 200 amp models at once, but the number tells you how light this architecture is.

## Why open source is the actual headline

I'm a developer in my day job, so maybe I'm biased, but the sound-quality win is not the part that's going to matter in two years. The licensing is.

A2 is fully open source — model architecture, training code, and the inference engine are all freely available, and any hardware or software company can build it into a product, including commercial products, without paying a toll. NAM has worked this way since 2019, which is exactly how a free plugin ended up with the largest capture library on the internet. A2 is that, rebuilt to sound better and run lighter.

The launch partner list tells you it's already moving off the desktop: **Blackstar, Lava Music, Darkglass, HeadRush, Chaos Audio, and Dimehead** are on board at release. That's a real amp company, a couple of pedal/modeler makers, and the budget-modeler world all signing up to a format they don't have to license. Valeton and Hotone already added NAM import support to the GP-200 and Ampero II last year. The direction is obvious.

## What this means if you record into a laptop

Here's the bedroom-producer read, because that's the only chair I sit in.

The premium modeler pitch has always been "pay once for the best-sounding capture engine, and pay again for the artist plugins." A2 quietly removes the first half of that sentence. If the best-sounding capture tech is free, open, and runs on anything, then what you're actually paying Neural DSP, IK, or Line 6 for is the *content and the workflow* — the curated captures, the artist-signature chains, the editor, the support. Those are real things worth real money. But the moat just got narrower, and the companies know it, which is why "Proxy" and "Neural Capture V2" were the named comparison targets in the first place.

For me, practically, today: nothing in my session changes this week. My NAM plugin still loads the same way, my captures still work. What changes is the next two years of what shows up *inside* the $200 pedals and the free plugins — because the engine in them can now be the one that won the blind test, and nobody has to pay to put it there.

The cynic in me has watched "this changes everything" announcements evaporate before. But "we open-sourced something that measurably beats the paid options, here's the methodology, here's the code" is a different kind of claim. That one you can check yourself. So go check it — that's the whole point of it being open.

*A2 is available now through TONE3000. The architecture, training code, and inference engine are published openly; the [full announcement and technical writeup](https://www.tone3000.com/blog/introducing-neural-amp-modeler-nam-architecture-2-a2) are on the TONE3000 blog.*
