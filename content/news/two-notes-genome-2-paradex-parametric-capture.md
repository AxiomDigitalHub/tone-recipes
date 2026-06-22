---
title: "Two Notes Genome 2.0 Adds a Free Parametric Capture Engine — And It Quietly Fixes the One Thing Static Captures Always Got Wrong"
date: "2026-06-22"
category: "new-gear"
slug: "two-notes-genome-2-paradex-parametric-capture"
excerpt: "Genome 2.0 landed with iOS support, seven new amps, and a free capture studio. The headline everyone's running is 'all-in-one modeling suite.' The part that actually matters: PARADEX captures how an amp responds across its whole control range — so a captured amp finally cleans up when you roll your volume knob back, the way a static NAM or TONEX snapshot never did. Here's what that changes, and what a Helix or HX Stomp player should take from it."
source_url: "https://www.premierguitar.com/news/two-notes-unveils-genome-2"
image_url: ""
author_slug: "dev-okonkwo"
---

Two Notes released Genome 2.0 on June 18, and the press coverage is doing the thing it always does with a big modeling update — listing the feature count and moving on. All-in-one suite. Seven new amps. iPad app. Global Transpose. All real, all in the box.

But if you read the spec sheet the way I do — as a systems problem rather than a feature list — there's exactly one thing in this release that changes the math, and it's buried under a component name most people will skim past: **PARADEX**. It's a parametric capture engine, it runs on a capture model Two Notes calls AmpNet, and the free download that feeds it quietly solves the single biggest limitation that's been baked into captured amp tones since the original Kemper.

Let me explain what that limitation is, because once you see it you can't unsee it, and it reframes how you should think about every capture-based tone you own.

## What Genome 2.0 actually is

Quickly, so we're on the same page. Genome is software — desktop plus a new iOS/iPad version — not a box. It runs as a plugin in your DAW and standalone. Three tiers:

- **Genome Intro** — free with an account
- **Genome** — $129.99
- **Genome Suite** — $299.99

Genome 2.0 adds the iPad app, seven new TSM-Ai amp models, a redesigned 24-component routing grid, and a Global Transpose that does real-time ±24-semitone pitch shifting across the whole rig. There are two capture engines living inside it: **CODEX**, which plays static NAM (Neural Amp Modeler) captures, and **PARADEX**, the new parametric one. And there's a free standalone app, **Capture Studio**, that makes both kinds of capture from your own gear.

That's the inventory. Now the part worth your time.

## Static captures freeze the amp. That's the bug nobody calls a bug.

Here's the thing about a NAM capture, a TONEX Tone Model, or a first-generation Kemper profile: it's a photograph. You set the amp — gain at 4, treble at 6, a specific bright switch position — and the capture learns *that one snapshot*. It's an incredibly accurate snapshot. But it's one frame.

So what happens when you load that capture and turn the "gain" knob in the plugin? On a static capture, you are mostly just changing input level into a frozen nonlinearity. You are not re-voicing the amp the way the real amp's gain knob does — where lowering it doesn't just get quieter, it shifts the whole harmonic and EQ structure, tightens the low end, and changes how the thing breaks up. The capture can't do that, because it never saw the amp at any other setting. This is exactly the [captures-versus-models distinction we walked through for the Quad Cortex](/blog/quad-cortex-captures-vs-models): a *model* has the knobs because someone built the circuit's behavior; a *capture* only has whatever single state you fed it. It's also why the [TONEX Tone Models guide](/blog/tonex-tone-models-guide) tells you to capture the same amp at several gain settings and switch between them — you're manually rebuilding the knob the snapshot threw away.

The most important casualty of a frozen capture is **dynamic response to your guitar's volume knob**. On a real edge-of-breakup amp, you roll the volume pot back and the amp cleans up — fewer harmonics, more headroom, a different EQ curve. That cleanup is the entire technique behind a huge amount of worship and ambient playing: set one slightly-driven sound, then control the whole verse-to-chorus dynamic from the guitar instead of stomping a switch. A static capture mostly just gets *quieter* when you roll back. It doesn't re-voice. The trick stops working.

## What PARADEX changes

A PARADEX/AmpNet capture isn't a single frame. Capture Studio sweeps the amp across its control range and learns how it *responds* — so the resulting model carries the relationship between knob position and tone, not just one fixed point. Turn the gain down on a PARADEX capture and it behaves like turning the gain down on the amp: the voicing moves, not just the level. Roll your guitar volume back and it cleans up the way the real circuit does.

If that sounds familiar, it should. This is the same leap [Kemper made with Profiling 2.0](/news/kemper-profiling-2-os-14-public-beta), the same reason Neural's Quad Cortex captures behave more like models than snapshots, and the same direction [NAM's A2 architecture is pushing the open-source side](/news/tone3000-nam-architecture-2-a2-open-source-modeling). The whole industry figured out the same thing at once: a static capture is a beautiful dead end, and the future of capturing is parametric. Genome 2.0's contribution is that the capture tool — Capture Studio — is **free**, and it makes both kinds, so you can hear the difference on your own amp without paying for the privilege.

## What a Helix or HX Stomp player should take from this

I'll be straight, because most of you reading this site are running a Helix or HX Stomp into in-ears on a Sunday, not a laptop at 2 AM like me. Genome is software. It is not going to ride your pedalboard or replace your floor unit. So why does this matter to you?

Two reasons.

**First, it settles an argument about your own rig.** A lot of players assume a capture of a great amp beats a modeled amp. Genome 2.0 makes the real distinction obvious: it's not capture-vs-model, it's *static-vs-parametric*. Your Helix amp blocks are parametric by design — the Drive, Bass, Mid, Treble, and Bright controls genuinely re-voice the circuit, which is the whole reason [the amp's gain and master controls interact the way they do](/blog/amp-gain-volume-master-controls) and why you can [build your verse/chorus dynamic off the volume knob](/blog/volume-pedal-dynamics-control). If you've been chasing TONEX or NAM captures thinking they're automatically "more real," know that you may be trading away exactly that knob response. Sometimes that's a fair trade. Now you know what the trade is.

**Second, Capture Studio is a free way to capture your own amp *with* knob response.** If you have a real AC30 or Deluxe in a room and a $129 reason not to buy the full suite, you can still use the free capture tool to make a parametric model of your amp, then reamp into it in your DAW — or A/B it against your Helix model to decide which one actually nails your amp's cleanup. For anyone doing direct recording, that's a genuinely useful free tool, and it's the kind of thing I'd normally have to talk myself out of overusing at 2 AM.

For the worship players specifically: the Global Transpose is the sleeper feature. Real-time ±24 semitones across the rig means transposing a whole patch to fit a vocalist's key without a capo and without rebuilding anything — software-side, sure, but if you track or run worship sets in a DAW it's one less thing to fight.

## The bottom line

Ignore the "all-in-one suite" framing — that's marketing for a feature checklist. The actual story in Genome 2.0 is that parametric capture, the thing that gives a captured amp its knobs and its volume-knob cleanup back, now ships with a free capture tool. It doesn't change what's on your pedalboard. It changes what you should *expect* from any capture you load into anything — and it makes the static snapshot, after a good decade as the gold standard, start to look like the compromise it always quietly was.
