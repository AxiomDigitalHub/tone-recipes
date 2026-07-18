# How AI Answer Engines Cite Small Sites — Research Pass 2026-07-17

> Overnight research session (web sources fetched + read; strongest 14 primary/empirical).
> Distilled deltas live in AI_SEARCH_PLAYBOOK.md §10 — this file is the full findings + sources.

## Per-engine retrieval mechanics

**ChatGPT search** (~92% of all AI referral traffic, per 6.77M-session analysis):
retrieval rides Bing's index plus OpenAI's own growing index. 87% of sampled ChatGPT
citations sat within Bing's top-20 organic — but Bing's top-3 matched citations only ~7%
of the time. Translation: being retrievable in Bing top-~20 is near-necessary; the LLM
re-ranks the set on passage extractability, so ranking #1 in Bing is not the game.
OAI-SearchBot = the search index crawler (never block); GPTBot = training; ChatGPT-User
= live fetches.

**Perplexity**: own index now (200B+ URLs), not Bing. No submission path for small
sites; publisher program is invite-only majors. Strongest freshness bias (~50% of
citations from current-year content) and most Reddit-heavy engine. Referral volume
small and declining — treat as a side effect, not a target.

**Google AI Overviews / AI Mode**: grounding from the core index via query fan-out.
Studies conflict on top-10 overlap (17–56%), but consistently a large minority of
citations (~44%+ beyond top-20 in seoClarity's 5.1M-citation set) arrive via fan-out
sub-queries — structurally great for an 800-page long-tail site: a page ranking for
"[song] amp settings" gets cited in an AIO for a broader question it could never rank
for. ~13 sources cited per AIO on average = more citation slots than blue links.

**Claude**: web search is backed by Brave Search (~86.7% citation overlap with Brave's
top results). Fastest-growing referrer (64x from a small base). Lever: verify Brave
indexation/ranking for money queries. Claude-SearchBot / Claude-User / ClaudeBot all
stay allowed.

## Cross-engine confirmed findings

1. Retrieval eligibility ≠ citation — engines re-rank the grounding set for the most
   extractable, self-contained passage. 44–55% of cited passages come from the TOP
   THIRD of the page.
2. Freshness is measured, not folklore: AI-cited content is ~25% fresher than organic;
   <30-day-old content earns ~3.2x more citations than 90+ days. BUT bare redating is
   detectably ignored — only substantive refresh + honest dateModified works.
3. Reddit is the #1–2 cited domain in exactly our query class (settings/gear
   recommendations). Engines anoint 3–5 subreddits per topic as truth sources; cited
   threads average ~1 year old; complete in-thread answers are what gets quoted.
   Honest play only: genuine named participation, full answers in-thread, link when it
   truly adds the preset/system. No seeding — low-quality threads don't develop the
   upvote/reply profile that gets cited anyway.
4. Citation patterns are volatile (ChatGPT's Reddit citation rate moved 60%→10% in
   weeks after a platform-side change). Don't overfit to any month.
5. AI referrals are 0.1–2.8% of traffic for most sites today but visitors spend ~68%
   more time on site — small, compounding, high-intent channel.

## Ranked marginal levers for F&K (basics already done)

1. **Bing Webmaster Tools** (needs Daniel: verify site, submit sitemap, audit that all
   ~800 pages are actually in Bing's index; check the AI Performance report monthly —
   the only first-party AI-citation dataset anywhere).
2. **Answer block in the top third of recipe pages** (template change — the settings
   table/at-a-glance chain before narrative). Design-sensitive → Daniel review.
3. **IndexNow on deploy** — ✅ SHIPPED 2026-07-17 (CI job, --since-hours=48 window,
   INDEXNOW_ENABLED gate). Bing/Yandex/Naver/Seznam; Google does not participate.
4. **Substantive refresh cycle** — re-verify recipes on current firmware, add variants,
   honest redate (weekly audit already half-does this; make freshness explicit).
5. **Genuine community presence** in the 3–5 subreddits engines cite for our queries
   (r/Line6Helix, r/guitarpedals, worship-tech) — human lane (Nathan), pairs with
   docs/outreach-drafts.md. Map actual cited threads by asking the engines our money
   questions and noting sources.
6. **Brave Search audit** for Claude visibility (1 hr, needs eyeballs).
7. **Fan-out-shaped titles/H1s** — phrase as the sub-queries engines generate
   ("[song] Helix preset settings") — mostly already our architecture; audit titles.

Not worth doing: Perplexity publisher program, llms.txt investment (unchanged),
Copilot-specific work, redating without changes, any astroturfing.

## Sources
Official: OpenAI bots docs · Perplexity crawler docs + search-API research post ·
Google Search Central AI-features guide · Bing Webmaster blog (AI Visibility Insights,
June 2026) · IndexNow FAQ.
Empirical: Semrush 230K-prompt citation study · Profound 680M-citation patterns + Reddit
analysis · Seer content-recency study · Ahrefs 17M-citation freshness study · seoClarity
362K-keyword AIO overlap · BrightEdge AIO overlap tracking · Search Engine Land 6.77M
AI-referral-session analysis.
