# Council Round 1: Social Media Manager (Sasha Okafor)

**Date:** 2026-10-25 · **Inputs:** EVIDENCE_BRIEF, published_posts.txt, src/lib/social/generate.ts, MESSAGING_FRAMEWORK, COMMODITY_WRITING_CHECKLIST, src/types/recipe.ts + src/lib/data/index.ts (recipes are static TS here, not Supabase), content/blog, content/news.

## 1. Triage of what we published

Scores run 1–5 per column. Escalator is pass or fail.

| Post | Hook | Value in feed | Visual | CTA | Tags | Escalator |
|---|---|---|---|---|---|---|
| Y cable ("turning one guitar down can mute the other") | 3 | 2 | 1 | 1 | 2 | Fail ("signal chain" tag, jargon) |
| Dual Cab ("3 DSP units against 40") | 2 | 2 | 1 | 1 | 2 | Fail |
| Alnico vs ceramic ("0.6 to 1.4 dB in no fixed direction") | 1 | 1 | 1 | 1 | 2 | Fail |
| Oxford or Jensen | 2 | 1 | 1 | 1 | 2 | Fail |
| Jumping channels | 3 | 2 | 1 | 1 | 2 | Fail |
| 8/10/12 ("135, 97, 80 Hz — and your open low E is 82.41 Hz") | 3 | 2 | 1 | 1 | 2 | Fail |
| Preset Won't Fit | 2 | 1 | 1 | 1 | 2 | Fail ("Preset" is the first word) |

The 30-day result was 22 views, reach 1 and 0 interactions, which is what you'd expect from this set. Six failure patterns:

1. **The SEO title is used as the hook.** Four of seven use the colon-pivot "X: What Y Actually Z" ("Actually" appears four times). That title shape works for search queries. It doesn't stop a thumb.
2. **The answer is withheld.** "Here is what that decides." "Here are the numbers." "Here is the per-amp rule." The caption promises the payoff and sends people to a link they can't tap. On Instagram the payoff has to be on the slide.
3. **The topics drift away from our audience.** Four of seven are about speaker or cab physics. None mention a song or worship, and none use a recipe, which is the actual product. A worship player on an HX Stomp doesn't care about Oxford speaker date codes.
4. **The visual doesn't carry anything.** Every post is one 16:9 AI studio shot with no text on it, cropped into a 3:4 grid. It says nothing with the sound off, and it's AI-flagged on top of that.
5. **The CTA goes nowhere.** "Link in bio" points to a profile with no picture. Nothing asks people to save or send, and saves and sends are the signals that matter.
6. **The hashtags are illegal and repetitive.** We attach 12–13 tags per post. Instagram has capped posts at **5 hashtags** since December 2025, and the same six-tag tail (#ampsim #tonequest…) repeats on every post. The three retry failures of "Jumping channels" are worth checking against the tag cap.

## 2. Content source triage

| Asset | Social value | Why |
|---|---|---|
| **Artist recipes, `platform_translations.helix.chain_blocks`** | **Highest** | Real block names and knob values, plus tempo-derived delay times. This is the product, and it's 100% data with no prose to fabricate. Worship recipes carry `attribution_confidence`. |
| Settings guides (33+5, e.g. fender-deluxe-reverb-settings) | High | Q1 is our biggest intent (17 users/page). `takeaways` frontmatter and settings tables parse straight into slides. |
| Quick-fixes (56+7) | High | Q5 frustration content gets saved. Each post has a symptom → cause → fix table. |
| Comparisons (107) | Medium | Use only posts with an explicit verdict. Many hedge. |
| News (104) | Medium-low | Q6 freshness. Use one card within 48h, and only when there's a non-obvious angle (e.g., the MXR Turbo Tuner's buffer modes mattering more than the strobe). |
| Gear-lab and signal-chain physics (94+77) | Low | Accurate, but this is collector or engineer content. Use it at most as one fact inside a Fix-It post. |
| Seasonal (C2 Holiday Gift Engine) | Medium, Nov–Jan | Post-gift "just unwrapped a Katana or HX Stomp" Knob Cards. |

**Never promote on social:**
- **The 35 blog posts where an AI persona claims first-person testing** ("two units I tested", "I've owned a few NOS Mullard sets", "I tested it with a multimeter"). Find them with `grep -l -iE "I tested|we tested|I've owned|in my studio"`. On social those claims read as a human testing gear. That's fabricated testing under our honest-authorship rules.
- AI-tool and meta posts (ask-axl-ai-guitar-tone-assistant, how-ai-tone-tools-differ…). These lead with P3, which belongs on the founder channel.
- Pure-spec posts with a non-finding (alnico-vs-ceramic, 44-1-vs-48-khz, 50hz-vs-60hz-mains).
- Any quick-fix table that hasn't passed the accuracy gate. Example: fix-fizzy-high-gain says "Back off to 7-8 o'clock". A card freezes a number in an image, so a wrong one stays wrong forever.

## 3. Content type system

These rules apply to every format:
- Size is 1080×1350.
- Slide 1 and the first caption line pass the escalator test. Slides 2 onward may use the unit's own on-screen labels ("Adriatic Delay"), because those are the words on the reader's screen.
- Every number has to trace back to a field path in the source.
- No guitar audio of any kind until `audio_demos.json` is populated with real DI renders. It is `{}` today.
- Maximum 5 hashtags.

| # | Format | Purpose and question | Source | Build | Hook pattern | CTA |
|---|---|---|---|---|---|---|
| 1 | **Knob Card** carousel | Q1 "what do I set it to" | Settings-guide tables + `takeaways` | 6 slides: hook → 1 surprising fact → clean card → breakup card → modeler card → save slide | "Your [amp] has [a knob it never had / one setting that matters]" | "Save this for your next rehearsal" |
| 2 | **Sunday Sound** carousel | Q4 for worship, "sound like the album by Sunday" | Worship recipes, `helix.chain_blocks`, `song.album/year`, key and BPM | 7 slides: hook → the move → one block per slide (delay, reverb, amp, dynamics) → credit + save | "The part you barely hear in [song]" | "Send to whoever runs your Sunday rig" |
| 3 | **Fix-It** card | Q5 "why does my rig sound wrong" | Quick-fix tables (gate-verified) | 3 slides: symptom in their words → cause → exact move | "[Symptom]? It's usually [one cause]" | Save |
| 4 | **Verdict** carousel | Q3 "X or Y" | Comparisons with an explicit verdict | 4 slides: verdict first → why → when the other wins → settings for both | "[X] or [Y]: [verdict] unless [one condition]" | "Send to the friend who's deciding" |
| 5 | **Same Sound, Your Gear** carousel | Q2/P2 "works on whatever you own" | One recipe, ≥4 `platform_translations` | One slide per platform: Helix, Katana, QC, pedalboard | "One sound, four rigs" | "Tag your rig" (comment prompt) |
| 6 | **48-Hour News** card | Q6 | News `excerpt` + one sourced spec | Single image, 2 lines + price | "[Product] is out. The part that matters for you is [angle]" | None (follow) |

**Reels** are the reach format, but we don't make guitar audio. Until real DI renders exist, the only allowed Reel is a silent 8–10s "knob turn" animation of Knob Card values with on-screen text and no music claim. At most one per week, as a reach test.

**Weekly mix (5 posts, one per day max):**
- Mon: Knob Card
- Tue: Sunday Sound (setlists land Tuesday)
- Wed: Fix-It
- Thu: Verdict or Same Sound, alternating
- Fri: Sunday Sound #2, or News if something broke
- Nov–Dec: Monday becomes "Just unwrapped" (C2).

Worship stays at two of five slots because it's the ICP.

## 4. Two worked examples

### A. Sunday Sound: Goodness of God (source: recipe `hislop-goodness-of-god`, song `goodness-of-god-bethel-music`)
- **S1:** "The guitar you barely hear in Goodness of God is doing most of the work." (Helix rebuild over a photo-free type card)
- **S2:** "Verses are volume swells into a wash. Key of Ab, 82 BPM. The reverb is the lead instrument."
- **S3, Delay (Adriatic Delay):** Time 549 ms = dotted eighth at 82 BPM · Feedback 35 · Mix 28 · High Cut 5500. "Dark repeats blur into the reverb instead of slapping."
- **S4, Reverb (Plateaux):** Mix 42 · Decay 8.0 · Predelay 15 · Low Cut 150 · High Cut 7000.
- **S5, Amp (A30 Fawn Brt):** Drive 5 · Bass 5 · Mid 6 · Treble 6 · Presence 5 · Ch Vol 6 · Master 4 · Sag 6. Cab: 4x12 Greenback 25, Low Cut 100 / High Cut 7000.
- **S6, Swells and lift:** Volume pedal on EXP 1 first in line. Deluxe Comp Threshold −32, Ratio 4, Attack 15, Release 180, Mix 65. Last chorus: Kinky Boost on, Gain 4, Tone 5.5, Level 6.
- **S7, Credit + save:** "Bethel's *Victory (Live)* (2019) credits electric guitar to a pool of players, not per song. This is rebuilt from the recording. Save it for Sunday."
- **Caption:** "Swell in with the volume pedal, let the reverb carry it. 549 ms comes straight from 82 BPM: if your band plays it faster, divide 45,000 by your tempo. Full chain for Helix, Quad Cortex, Katana, Kemper and Fractal at faderandknob.com (link in profile). Settings researched and written by AI; corrections are published on the site."
- **Tags:** #worshipguitar #goodnessofgod #bethelmusic #line6helix #worshipleader

### B. Knob Card: Deluxe Reverb on Helix (source: `fender-deluxe-reverb-settings.mdx`)
- **S1:** "Your Helix Deluxe Reverb has a knob the real amp never had."
- **S2:** "The real amp has no Mid control. A fixed 6.8k resistor sits where the pot would be, so the scoop is permanent."
- **S3, Clean (US Deluxe Vib):** Drive 4.5 · Bass 5 · Mid 5 · Treble 5.5 · Master 7 · Sag 5
- **S4, Edge of breakup:** Drive 6.5 · Bass 4 · Mid 5 · Treble 5 · Master 7 · Sag 6
- **S5, The rule:** "Mid at noon, Presence at 0 = the stock amp. Every two steps up on Drive, take one off Bass."
- **S6, Save:** "Humbuckers? Use US Deluxe Nrm and pull Bass to 3–4."
- **Caption:** "Most 'the model doesn't sound like the amp' complaints come down to that Mid knob. Park it at noon. Add a Spring reverb block after the amp for the onboard tank. More amps at faderandknob.com (link in profile)."
- **Tags:** #fenderdeluxereverb #line6helix #helixtone #worshipguitar #cleantone

## 5. Where AI generation goes generic, and the guardrails

**Predictable drift:**
- adjective tone ("lush", "shimmering", "warm")
- withholding hooks
- "Whether you're…" hedges
- invented "players love…" community claims
- persona testing claims leaking through from the source blog
- rounding ("around 5ish")
- a naming the player on pool-attributed worship songs
- the same caption skeleton every day

**Banned list (regex-enforced, extending checklist §2):**
- "here's what", "here is the", "you won't believe", "game-changer", "unlock", "elevate", "take your tone to the next level", "lush", "dial in the magic"
- "I tested" / "we tested" / "in my experience"
- "tone recipe", "preset", "snapshot", "signal chain", "IR" (slide 1 and caption line 1)
- emoji stacks, "link in bio" as the first line

**Required specifics:**
- ≥6 numeric values per carousel, each copied verbatim from a named field (the generator emits `{value, sourcePath}` and a checker diffs them against the source)
- the song's album + year
- the attribution line whenever `attribution_confidence ≠ documented`
- the AI-researched disclosure line
- hook ≤12 words

**Critic rubric (a second model, pass ≥4 on all):**
1. Stranger test: does slide 1 make sense to someone who's never heard of us?
2. Value-without-click: could someone set their gear from the slides alone?
3. Number fidelity: 0 untraced numbers, otherwise automatic fail.
4. ICP fit: Helix/HX or worship relevance.
5. Distinctness: is the caption's first line different from the last 10 posts?
6. Honesty: no testing claims, attribution correct, no synthetic audio.

## 6. Questions for the council

**For Mara:**
- Is our KPI saves and sends per reach, or follower count? I'd steer every CTA toward saves and sends.
- Do we connect Threads now for text-native Fix-Its?
- Who fixes the empty profile (picture, bio, link page) this week? Nothing converts until it's done.

**For Theo:**
- Can slides render deterministically (PIL/sharp templates from JSON) so the LLM only writes the hook and caption, never numbers?
- Can the run select by format slot rather than "newest blog post"?
- How do we pull analytics into the Monday digest so the format mix is decided by data after 4 weeks?

**For both:**
- Do we accept zero Reels until real DI audio exists, knowing that caps our reach?
