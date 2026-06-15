# Commodity-Writing Checklist

**Created:** 2026-06-14
**Companion to:** `writers.md` (voice bibles), `BLOG_VOICE_AUDIT.md`, `AI_SEARCH_PLAYBOOK.md` (§4, §6).

## Why this is framed as *quality*, not *AI-detection evasion*
There is no Google classifier that docks you for "AI tells." Google (and Bing, which is currently sending you 3× the traffic) grades **value**, not provenance — AI_SEARCH_PLAYBOOK §4. What gets a high-velocity site in trouble is the **scaled-content-abuse policy** (§6): many pages that read like commodity filler. The patterns below are worth removing **because they signal commodity writing** — the genuine risk — and because distinct, opinionated prose is what earns the forum/Reddit links that fix our real bottleneck (domain authority on a young site). Inserting deliberate errors does the opposite: it destroys the "human-verified, accurate settings" E-E-A-T that is our entire moat. **Never trade accuracy for camouflage.**

So: strip these because they're bad writing. The SEO benefit is a side effect of being genuinely better.

---

## The checklist (run against any draft before publish)

### 1. Structural tells (commodity scaffolding)
- [ ] **No throat-clearing intro.** First sentence is about the topic, not "In the world of guitar tone…" / "When it comes to…" (writers.md already mandates topic-first openers — enforce it.)
- [ ] **No symmetric listicle padding** — every section the same length, each with a tidy mini-conclusion. Real expertise is lumpy: some points get a paragraph, some get a sentence.
- [ ] **No summary-of-the-SERP.** If the whole post could be assembled from the top 5 results, it fails the Non-Commodity Gate. Needs first-hand settings, a test, or a cross-platform translation.
- [ ] **No "Conclusion" heading that restates the post.** End on the last useful point or a real opinion.

### 2. Sentence-level tells (the register that reads as machine-generic)
- [ ] **No "It's not just X — it's Y"** construction (and its cousins "More than just…", "isn't merely…").
- [ ] **No rule-of-three padding** where three adjectives do the work of one ("rich, warm, and full").
- [ ] **No hedging-everything register.** Commodity writing never commits. Our writers have opinions (Rick: "most players use too much gain"). Take the position.
- [ ] **Kill the filler verbs/nouns:** delve, leverage, utilize, robust, seamless, elevate, unlock, navigate (figurative), realm, landscape, tapestry, testament, "plays a (vital/crucial) role," "when it comes to," "at the end of the day."
- [ ] **No "Whether you're a beginner or a pro…"** audience-spanning hedge. Pick the reader.
- [ ] **No em-dash tic on autopilot.** (Some writers use em dashes by design — that's fine. Watch for the *uniform* one-per-paragraph machine rhythm.)

### 3. Voice tells (the same-y problem — the real opportunity)
- [ ] **Does this sound like a *specific* writer**, or like the house average? Read it against the author's bible in `writers.md`. Rick is short and blunt; Margot is lyrical and harmonic; Viktor is clinical/dark. If you can't tell who wrote it, it's commodity.
- [ ] **Sentence-length signature present?** (writers.md: Rick/Carl/Elena short; Margot/Hank/Dev longer; Sean/Viktor precise-medium.)
- [ ] **One reference only that writer would reach for?** (Rick → a classic amp he's owned; Sean → a spreadsheet/version-control metaphor.) The 80/20 rule: personality in *how*, not *what*.
- [ ] **Opinion or surprise that a summary wouldn't contain?** The "surprised discovery" signal (playbook Gate 5) is first-hand experience — it can't be faked from the SERP, and it's the most human thing in the piece.

### 4. The accuracy gate (non-negotiable)
- [ ] **Every setting/value verified.** This is a tone-*settings* site; a wrong gain number or delay time is the one unrecoverable trust break. Accuracy is the moat, full stop.

---

## How to use the podcaster-archetype idea (the right way)
The instinct — model voices on great communicators — is good. The wrong mechanism is ingesting a named living person's copyrighted transcripts and cloning them (copyright + likeness risk, and it's the wrong unit of analysis). **Style/register isn't copyrightable; a specific person's words are.** So:

- Distill the **archetype**, not the person: e.g. "blunt, contrarian sports-radio cadence," "warm long-form curiosity," "deadpan technical skeptic." Write it as an original voice spec in `writers.md`.
- We already have 11 built voice bibles. Sharpen them with one or two archetype descriptors each — don't build a transcript corpus.
- Test: read a paragraph aloud. Does it sound like a *person* with a point of view? If yes, it's both better writing and lower commodity-risk. That's the whole game.

## Operationalize
- Add this checklist to the daily/weekly content routine as a pre-publish pass.
- Extend `scripts/audit-blog-voice.ts` to flag the §2 filler list automatically (cheap regex pass) and surface posts where author voice reads as house-average.
