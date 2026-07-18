# LinkedIn Video Scripts — The Fader & Knob Case Study Series

Ten ~60-second scripts (145–160 words each ≈ 60s at conversational pace). Each is
self-contained — post in any order, though 1 → 2 → 3 is the natural on-ramp. Numbers
marked ⟲ are live counters: **re-check faderandknob.com's top banner on filming day**
(as of 2026-07-10: Day 117 · 623 commits · 23 public corrections).

**Format per script:** HOOK (spoken cold, first 3 seconds) → VO (the words) →
SHOW (what's on screen) → CTA.

**Voice rules:** first person, plainspoken, zero AI-hype vocabulary ("delve,"
"game-changer," "revolutionize" are banned). You're a person reporting what happened,
not selling a future. Every claim in these scripts is true and checkable in the repo
or on the site — that's the entire brand. If a number drifted, fix the number, don't
soften the claim.

---

## 1. The Premise — "I let an AI run a business in public"

**HOOK:** "For the last ⟲117 days, an AI has been running a real business. Mine. In public."

**VO:**
It's called Fader & Knob. It publishes exact guitar-tone settings — the amp, the
pedals, every knob — for the songs guitarists actually want to play. Real product,
real Stripe account, real customers.

Here's the part that makes it a case study: the AI doesn't just write content. It
ships code, publishes posts, fixes its own bugs, and commits everything to a public
git history. ⟲623 commits so far. When it gets a fact wrong, the correction gets
logged publicly — ⟲23 of them to date.

I'm the editor and the accountability. It's the operator.

I started this because every AI-agent demo I saw was a toy. I wanted to know what
happens when you give one a P&L and consequences.

Turns out: a lot. Some of it embarrassing. All of it on the record.

**SHOW:** faderandknob.com homepage → the "Open experiment · Day X · X commits ·
X public corrections" banner → scroll the /experiment log → GitHub commit graph.

**CTA:** "The whole run is logged at faderandknob.com/experiment. Follow along — the next posts get specific."

---

## 2. Show the Function — what the product actually does

**HOOK:** "Here's what the AI actually built. Not a chatbot. This."

**VO:**
Say you want to play Smoke on the Water and actually sound like the record. The tone
is half the song — and dialing it in usually means an hour on forums.

Fader & Knob gives you the recipe: the signal chain, block by block, every setting a
real number. And here's the hard part — it translates that recipe across seven rigs.
Line 6 Helix, Quad Cortex, TONEX, Fractal, Kemper, a Boss Katana, or a plain
pedalboard. Same song, your gear.

For Helix players it goes further: you download an actual preset file, load it, play.
The AI generates those files — and validates them against a corpus of real presets,
because one wrong parameter name and the hardware silently drops your settings.

That last sentence is a bug story. It's post five. It's a good one.

**SHOW:** Screen recording — browse a recipe page, flip platform tabs
(Helix → Kemper → pedalboard), download the .hlx, open it in HX Edit.

**CTA:** "Free to browse, all of it. Link in comments."

---

## 3. The Niche Lesson — why guitar tones, of all things

**HOOK:** "If your AI business idea starts with 'it's like ChatGPT but—' stop. Pick a niche with a right answer."

**VO:**
Why guitar tones? Three filters, and they apply to any AI business.

One: the problem has a verifiable answer. A tone recipe is falsifiable — the amp
existed, the settings work or they don't. AI plus falsifiable beats AI plus vibes,
because you can build quality control around true and false.

Two: fragmented demand nobody serves. A thousand searches a month for "Way Maker
guitar tone" is too small for a media company and too niche for a lazy content farm.
An AI operator with near-zero marginal cost? That's the sweet spot.

Three: I actually know the domain. When the AI writes something subtly wrong about a
Vox AC30, I can smell it. Your unfair advantage isn't the model — everyone has the
model. It's whether you can referee it.

Falsifiable, fragmented, refereeable. That's the checklist.

**SHOW:** Talking head, then cut to a search results page for a long-tail tone query →
the matching F&K recipe ranking → the settings table.

**CTA:** "Post four: how it ships every day without turning into slop."

---

## 4. The Content Engine — a calendar that argues back

**HOOK:** "My content calendar has an opinion. Sometimes it overrules the plan."

**VO:**
Every day the AI runs a content cycle: three new posts, two refreshes of old ones,
and — this is the part people skip — a live check of what's actually ranking before
it writes a word.

The calendar isn't a list of topics. It's a strategy document the AI maintains: a
prioritized queue, a rule that every post has to pass what we call the non-commodity
gate — if the piece wouldn't add something the top ten results don't have, it doesn't
get written.

Last week it skipped a news post I'd asked for. Reason, logged: we'd already covered
the story two days earlier, and a re-report would be duplicate content. It was right.

The lesson: don't automate output. Automate the editorial judgment, then audit it.
Volume without a gate is how AI content became a slur.

**SHOW:** The SEO_AEO_Content_Calendar.md scrolling — strategic queue table, a SERP
analysis block, the logged "skipped: duplicate" decision.

**CTA:** "Next: the day I found out Google was using our own mistakes to confirm our mistakes."

---

## 5. The Trust Problem — 33 errors in one night

**HOOK:** "Last night the AI fact-checked itself and found 33 errors. Two products it cited don't exist."

**VO:**
Here's the uncomfortable truth about AI content: it lies confidently, in fluent
paragraphs, about things that sound exactly right. Ours claimed a free IR pack that
has never existed. Named three pedals that were never made.

So we run a rotating fact-check sweep. An agent re-reads published posts, verifies
every claim against primary sources, and fixes what's wrong — publicly. The
corrections counter on our homepage is at ⟲23 and it only goes up.

The scariest finding: for two wrong claims, Google's top confirming source was our
own site. Our errors were echoing back through search as evidence. That's the AI
content loop nobody talks about — pollution that cites itself.

The lesson isn't "AI can't be trusted." It's that trust is a process you run, not a
property the model has.

**SHOW:** The fact-check commit diff scrolling — red deletions of the fabricated
product, green corrections → the public corrections count.

**CTA:** "We publish every correction. That's not humility, it's strategy — post six explains."

---

## 6. Honest Authorship — the fake-persona line we won't cross

**HOOK:** "Our writers don't exist. And every one of them says so."

**VO:**
Fader & Knob's posts carry bylines — Nathan Cross, a working worship guitarist. He's
an AI persona, and the site says so, on the page, plainly.

We have rules I'd suggest to anyone running AI content. AI voices are labeled. No
fabricated community — no fake testimonials, no invented user numbers. No claims
that a human tested something a human didn't test.

Last night the AI actually enforced this against itself: it caught that a worship
guitar post had been assigned to the wrong persona — a bedroom-producer character
who, in his own fictional bio, has never played a live service. It reassigned the
byline and logged why.

Sounds absurd. It's not. Persona consistency is just honesty at the detail level —
and in a category drowning in fake authority, disclosed AI beats fake human. Trust
compounds; so does getting caught.

**SHOW:** A post's byline + persona disclosure → the cluster doc's persona rules →
the re-byline commit message.

**CTA:** "Post seven is the bug that was silently breaking the product for weeks."

---

## 7. The QC Lesson — AI checking AI, or: the silent predelay bug

**HOOK:** "For weeks, every preset we shipped was quietly broken. No error. No crash. Just... wrong."

**VO:**
The product generates preset files for guitar hardware. One parameter — reverb
pre-delay — was being written with a capital D: "PreDelay." The hardware wanted
lowercase: "Predelay." No error message. The hardware just silently dropped the
setting and used its default.

Nobody complained, because who A/Bs their reverb pre-delay against a blog post?

We found it because we run an adversarial setup: one agent authors, a different
agent tries to break what the first one made, checking output against a corpus of
256 real preset files. The corpus said: eighteen models want lowercase, three want
capital. Our code assumed one spelling for all.

The fix ships with a verification script that runs forever after.

The lesson: a generator without a referee is a liability. The second AI isn't
redundancy — it's the product.

**SHOW:** Split screen — HX Edit with the parameter missing vs. fixed → the corpus
survey output (18 vs 3) → the verify script passing.

**CTA:** "Post eight: the traffic chart that looks broken but isn't."

---

## 8. The Distribution Lesson — DuckDuckGo beats Google?!

**HOOK:** "DuckDuckGo sends this business three times more traffic than Google. That's not a DuckDuckGo success story."

**VO:**
Real numbers from our analytics: DuckDuckGo, 364 sessions. Bing, 345. Google — the
one with ninety percent of the market — 136.

Here's what that actually means. DuckDuckGo runs on Bing's index. So Bing's index has
us fully indexed and ranking. Google is barely indexing us at all — because we're a
new domain with almost no backlinks, and Google doesn't extend trust to new sites
anymore. Bing does.

The kicker: ChatGPT's web search also rides Bing. So the same under-loved index that
Google ignores is feeding us AI-assistant referrals — chatgpt.com is already a
top-ten source.

If you're launching anything new: your content can be provably good — Bing proves
ours ranks — and Google will still make you wait in line. Authority is the
bottleneck. Plan for it. The new-site playbook runs through Bing and the AI
assistants first.

**SHOW:** The GA4 source/medium table (real screenshot) → simple diagram:
Bing index → DDG + ChatGPT + Bing.

**CTA:** "Post nine: what this actually costs to run. The number is silly."

---

## 9. The Unit Economics — what an AI operator actually costs

**HOOK:** "Marginal cost of a new product line item in this business: about forty cents."

**VO:**
Let's talk money, because AI business content never does.

Fader & Knob sells access: forty-nine dollars a year for unlimited preset downloads,
seventy-nine for the pro tier. Standard content-business economics on the revenue
side.

The cost side is where it gets weird. Researching and authoring a new tone recipe —
research, writing, preset generation, QC — costs roughly thirty to fifty cents of
API calls using batch processing. A human audio engineer doing the same workup is
hours of skilled labor.

That asymmetry changes what's viable. Remember the fragmented-demand thing from post
three? Requests too niche for any human business to serve profitably — a specific
song, a specific rig — become fine at forty cents. We built request-a-tone on
exactly that: ask for a song, the AI builds it.

The catch: quality control is the real cost center. Cheap generation, expensive
trust. Budget accordingly.

**SHOW:** Pricing page → the request-a-tone form → a batch-API cost line vs. a
"human equivalent" comparison card.

**CTA:** "Last one: where this goes next, and why the content was never the point."

---

## 10. The Endgame — the content was never the moat

**HOOK:** "⟲117 days in, here's the actual thesis: the content site is the training ground, not the business."

**VO:**
Everything I've shown you — the recipes, the fact-checking, the preset generator —
points somewhere: the reason presets disappoint people isn't that the tone is wrong.
It's that the tone was built for someone else's rig. Different guitar, different
speakers, different room.

The market told us this directly — we mined the forums. People don't need another
patch file. They need translation: this sound, adapted to my gear. That's the
skill the AI has been building in public this whole time — every recipe is a
translation exercise across seven platforms.

The endgame is a tool where you upload audio and get back a matched signal chain for
your rig. Tone analysis as a product. The content business funds it, ranks for it,
and taught the AI the domain.

The case-study lesson: use content to buy a dataset and a distribution channel while
you build the real thing.

**SHOW:** Forum quotes about presets "not sounding right" → the platform-translation
tabs → a teaser mock of the analysis tool.

**CTA:** "Day one of the whole log is public — faderandknob.com/experiment. Steal the playbook."

---

## Production notes

- **Order:** 1–2–3 are the on-ramp; after that, alternate a "lesson" post (3, 5, 8, 9)
  with a "story" post (4, 6, 7, 10). Two per week sustains a month of posting.
- **Format:** talking head for hooks + screen recordings for the SHOW beats. The screen
  material is the credibility — real commits, real diffs, real GA4. Don't mock anything
  that can be shown real (the only mock is the ToneTrace teaser in #10, and call it a mock).
- **Captions:** burn them in; most LinkedIn viewing is muted. Hook text on screen in the
  first frame.
- **Counters:** re-check the banner (day / commits / corrections) the morning you film.
  Every other number here is stable and sourced from the repo as of 2026-07-10.
- **What NOT to do,** per the site's own honesty rules (they apply to you too): no
  invented user quotes, no revenue claims until there's revenue worth claiming, no
  "the AI did everything" — you're the editor and referee, and that role is half of
  every lesson. The series works because it's checkable.
- **Comment-link strategy:** link `/experiment` (not the homepage) — it's the page
  built for exactly this audience.
