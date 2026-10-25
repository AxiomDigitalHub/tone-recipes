# Council Round 2: Social Media Manager (Sasha Okafor), reply to Mara

Theo's recon (00-prompt-engineer-recon.md) hadn't landed when I wrote this, so section (c) is written to be implemented directly.

## (a) Answers to Mara

**Slide 1 answers the question with no caption.** Each slide 1 has three parts:
- the question, in the reader's own words
- the gear it's for
- one hard number, which proves the answer is inside

```
WORSHIP (Q4)                          AMP GUIDE (Q1)
┌──────────────────────────┐          ┌──────────────────────────┐
│ GOODNESS OF GOD          │          │ DELUXE REVERB ON HELIX   │
│ The guitar you barely    │          │ Your model has a knob    │
│ hear is doing the work.  │          │ the real amp never had.  │
│                          │          │                          │
│ 549 ms · 82 BPM · Ab     │          │ Mid: park it at 5.       │
│ Helix settings →         │          │ Every knob →             │
│ Bethel · Victory (Live)  │          │                          │
└──────────────────────────┘          └──────────────────────────┘
```

**Two hook styles to A/B on sends**, alternating by post within each format, judged on sends per reach after 4 weeks:
- **H1, Recognition:** names a problem the reader already has. "Your swells sound choppy on Sunday." "Your Deluxe model sounds thin."
- **H2, Revelation:** one concrete fact they didn't know. "The real amp has no Mid knob." "549 ms is just 82 BPM."

My bet is that H1 earns more sends, because the reader thinks of the bandmate with that exact problem. H2 should earn more saves.

**Where "honestly AI" (P3) lives:**
- **Bio:** "AI-researched settings. Corrections published."
- A one-line disclosure in every caption (the template renders it, not the LLM).
- Meta's AI label on generated imagery.
- One monthly "What we got wrong" carousel built from the public corrections log (`/experiment`). It's honest proof of rigor and leads with a fix, not with the org chart.
- P3 never appears on slide 1 of gear content.

## (b) Mapping my formats to Mara's channels

| Format | IG 4:5 carousel (1080×1350) | Pinterest 2:3 pin (1000×1500) | Silent Trial Reel (from day 30) |
|---|---|---|---|
| Knob Card | Yes, 6 slides | Yes, one tall card with every value, linking to the settings-guide URL | Yes, slides as 1.5s cuts, knob values counting up |
| Sunday Sound | Yes, 7 slides | Yes: "Goodness of God on Helix" with the full block list | Yes: block-by-block reveal |
| Fix-It | Yes, 3 slides | Yes, the best Pinterest format (problem search) | No |
| Verdict | Yes, 4 slides | Yes, verdict plus a two-column settings card | No |
| Same Sound, Your Gear | Yes | One pin per platform (four pins from one record) | No |
| 48-Hour News | Single image | No (not evergreen) | No |

Everything is rendered from one JSON record. The template stays the same across sizes and only the layout changes. Pinterest gets the direct page URL with UTMs; Instagram gets the link-in-profile page. Reels never carry guitar audio, only no music or platform-library ambient tracks with no guitar in them.

## (c) Caption spec for the LLM

**Templates render (never the LLM):**
- every number
- every block or model name
- song, album and year
- the attribution line (from `attribution_confidence`)
- the disclosure line
- URL and UTM
- hashtags (picked from a curated per-format pool, max 5)
- all slides from slide 2 onward

**The LLM writes JSON only:**
```json
{ "hook_style": "H1|H2",
  "slide1_headline": "≤12 words",
  "caption_line1": "≤110 chars",
  "caption_body": "≤60 words, 1–2 sentences",
  "cited_facts": [{"text": "...", "source_path": "helix.chain_blocks[6].settings.Time"}],
  "comment_prompt": "≤12 words, optional" }
```

Input is the source record plus the last 10 hooks. Any digit in the LLM's output must appear in `cited_facts`, and the checker resolves each `source_path` against the record and compares values exactly.

**Banned patterns** (case-insensitive regex, any hit is a hard fail):
- `here'?s (what|why|how)`, `here (is|are) the`, `you won'?t believe`, `the answer (might|will) surprise`, `game.?changer`, `next level`
- `unlock`, `elevate`, `delve`, `seamless`, `lush`, `magic`, `whether you'?re`, `when it comes to`, `not just .* it'?s`
- `\bI\b.*\b(tested|own|owned|tried)\b`, `we tested`, `in my experience`, `players (love|swear)`
- In `slide1_headline` and `caption_line1` only: `tone recipe|preset|snapshot|signal chain|\bIR\b|DSP|block`
- A player's name when `attribution_confidence != documented`
- More than one emoji, any hashtag, any URL
- Starting with "Link in bio"

**Critic rubric.** A second model scores each line 0 or 1, with the deterministic checks listed separately:

| # | Check | Pass rule |
|---|---|---|
| D1 | Number fidelity | 0 untraced or mismatched numbers (deterministic) |
| D2 | Banned patterns | 0 hits (deterministic) |
| D3 | Length limits | All fields within limits (deterministic) |
| D4 | Novelty | First 5 words of the hook don't match any of the last 10; trigram Jaccard < 0.5 |
| C1 | Stranger test | Slide 1 makes sense to a guitarist who has never heard of us |
| C2 | Answers its visitor question without the caption | Names the question type: Q1–Q6 |
| C3 | Specific | Contains a number or a named gear or song |
| C4 | Hook style | Matches the assigned `hook_style` |
| C5 | Honest | No implied human testing, no invented community |

**Publish only if:** D1–D4 all pass and C1–C5 score 5/5. On a failure, regenerate up to 2 times with the critic's reason attached. After that, skip the slot and put it in the Monday digest. Never publish a fallback.

## (d) Where I disagree with Mara

1. **A 50% worship mix exhausts the catalog.** I count about 9 worship-genre songs in `src/lib/data/index.ts`, and only 17 recipes are graded `documented`. At 2.5 worship posts a week we'd repeat songs in about a month. I'd go 40% worship (two Sunday Sound slots), 30% settings, 15% Fix-It, 15% seasonal. Q5 Fix-It content is our best save and send driver, and her mix gives it nothing. Worship rises as the worship backlog ships.
2. **"Real numbers, not 'add some warmth'" fails the escalator test.** It describes how we work, not a feeling the reader already has. Drop it as a hook and keep it for the bio.
3. **The day-45 kill rule should judge sends plus saves per reach, not raw reach.** With 0 followers, reach under 150 can come from a cold account while the format is actually working.
4. **We agree** on everything else: carousels first, Pinterest now, silent Trial Reels from day 30, values that never pass through an LLM, the 10 minutes a week of replies, and hiring the audio contractor.

---
**Summary:**
1. Slide 1 shows the question, the gear and one number. We A/B Recognition against Revelation hooks on sends, and P3 lives in the bio, the caption disclosure and a monthly corrections carousel.
2. One JSON record renders 4:5 carousels, 2:3 pins and silent Trial Reels. The LLM writes only the hook, caption, cited facts and comment prompt.
3. Publishing is gated by deterministic number, banned-pattern, length and novelty checks plus a 5/5 critic, with no fallback publish. I'd cut worship to 40%, add Fix-Its, and judge the kill rule on per-reach saves and sends.
