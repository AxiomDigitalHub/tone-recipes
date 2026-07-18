# AI Search Playbook — Fader & Knob

**Last updated:** 2026-06-10
**Primary source:** [Google's Guide to Optimizing for Generative AI Features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (Search Central, the canonical word on AI Overviews / AI Mode)
**Supporting sources:** [OpenAI Publishers & Developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), [OpenAI crawler docs](https://developers.openai.com/api/docs/bots)

This is THE reference for how F&K content gets surfaced in AI search (Google AI Overviews / AI Mode, ChatGPT search, Perplexity, Claude). The daily content routine, news routine, and strategy docs defer to this file. When guidance here conflicts with older AEO notes elsewhere, this file wins.

---

## 1. The one-sentence summary

> "Optimizing for generative AI search is optimizing for the search experience, and thus still SEO." — Google

There is no separate AEO/GEO discipline. Google's AI features use the same core ranking systems via **retrieval-augmented generation (grounding)**. What ranks in Search is what gets retrieved, quoted, and cited by AI. Everything F&K already does for SEO is the AI-search strategy; the rest of this doc is about which tactics are real and which are folklore.

## 2. How AI search actually retrieves content

- **RAG / grounding:** AI Overviews and AI Mode pull from Google's core Search index. A page must be **indexed and snippet-eligible** to appear in AI features. (We're fine: open robots, sitemap, no `nosnippet`.)
- **Query fan-out:** the model issues many concurrent sub-queries around the user's question ("john mayer clean tone" fans out to "mayer amp settings", "dumble vs fender clean", "helix mayer preset"...). **Implication: a tight topical cluster wins multiple fan-out slots.** Our recipe pages + cross-platform translations + pillar posts are exactly the right shape — each page can be retrieved by a different sub-query of the same user question.
- **Passage-level extraction:** AI answers quote specific passages. Clear headings, tables, and self-contained sections help **because they're good for readers**, not because AI needs special formatting (see §4).

## 3. What Google says TO do (and how F&K maps to it)

| Google's guidance | F&K application |
|---|---|
| **Unique, non-commodity content** from first-hand experience — "a first-hand review provides a unique perspective… a summary of existing content simply restates information already available elsewhere" | The recipe layer IS our non-commodity moat: exact settings, tested on real hardware, with platform translations nobody else publishes. Every post must contain something that can't be found by summarizing the top 5 SERP results. The "surprised discovery" gate (Gate 5) is a first-hand-experience signal — keep it. |
| **People-first, audience-first** — don't spin out a page per search variation | One great cross-platform page beats six thin per-modeler clones. Per-platform pages are only justified when the platform content is genuinely different (real model names, real parameter differences) — which our recipes satisfy. Never create near-duplicate posts to chase keyword variations. |
| **Clear structure** — headings, paragraphs, sections | Already standard. Keep direct-answer H2s, settings tables, takeaways. |
| **Multimedia** — high-quality relevant images/video | Hero images ✓. Audio previews + YouTube Shorts (per research KB) would add a retrieval surface text can't. |
| **Technical health** — indexed, crawlable, semantic HTML, good page experience, Search Console | Next.js SSR ✓, sitemap.ts ✓, robots open ✓. Keep semantic HTML in recipe pages (tables, lists, headings — not div soup). |
| **E-E-A-T / experience signals** | "Human-verified, AI-powered" transparency framing + Daniel's real hardware testing. Author pages for the editorial voices. Methodology page ("How We Create Tone Recipes"). |

## 4. What Google says NOT to bother with (debunked hacks)

Quoted or paraphrased directly from the guide — stop investing in these and don't re-add them to routines:

- **llms.txt / AI text files / special markup:** "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in generative AI search." Our `/llms.txt` and `/llms-full.txt` routes are harmless and may help *non-Google* tools, but they are NOT load-bearing. Zero maintenance priority.
- **Content chunking:** "There's no requirement to break your content into tiny pieces for AI." Write for the reader; long comprehensive guides are fine.
- **Writing "for AI":** AI systems understand synonyms and meaning. Don't keyword-stuff variations or write robotic Q&A prose.
- **Long-tail variation farming:** no need to capture every phrasing — and doing it at scale "primarily to manipulate rankings… violates Google's scaled content abuse spam policy." **This is our biggest live risk — see §6.**
- **Inauthentic mentions:** seeking manufactured brand mentions across the web isn't as helpful as it seems. Earn forum/Reddit presence by genuinely helping, never by seeding.
- **Structured data for AI:** "Structured data isn't required for generative AI search." Keep our Article/BreadcrumbList/FAQPage JSON-LD for classic rich-result and machine-readability reasons, but stop treating JSON-LD as the AI-citation lever. The **visible on-page content** (takeaways callout, FAQ block, settings tables) is what gets retrieved; the frontmatter `takeaways:`/`faq:` fields stay because they render real on-page content, not because of the JSON-LD they also emit. (Note: Google deprecated FAQ/HowTo *rich results* for most sites back in 2023 — the schema is belt-and-suspenders, not a ranking play.)

## 5. Non-Google answer engines (ChatGPT, Perplexity, Claude)

> **⚠️ PARTIALLY RE-VERIFIED 2026-07-17 (post-Vercel migration):** from a RESIDENTIAL IP, `/robots.txt`, `/sitemap.xml`, and GPTBot/PerplexityBot-UA page fetches all return 200. **But the edge is `Caddy behind CLOUDFLARE`, and Cloudflare 403'd a plain fetch from a GitHub-Actions datacenter IP the same night** — so residential curls cannot prove real AI crawlers (which fetch from their own datacenters) get through. Real crawlers are on Cloudflare's *verified bots* list, which Bot Fight Mode normally exempts — **Daniel: confirm in Cloudflare dashboard that (a) verified bots are allowed through whatever bot-protection mode is on, and (b) Security → Events shows GPTBot/OAI-SearchBot/PerplexityBot/ClaudeBot requests succeeding, not challenged.** This is the exact Vercel failure mode (below) wearing a Cloudflare hat; the monthly check must use Security Events or server logs, not laptop curls. Same date: fixed soft-404s (unknown recipe/artist/gear/platform slugs returned HTTP 200; now real 404s) and made the `/request` queue server-rendered so its content is crawlable.
>
> **✅ RESOLVED 2026-06-11:** the Vercel firewall had been challenging ALL non-JS clients (403 + `x-vercel-mitigated: challenge` on every path, including `/robots.txt`), which silently zeroed crawler access regardless of robots.txt. Daniel disabled the challenge in the Vercel dashboard the same day; verified after: `/robots.txt` 200 with no mitigation header, sitemap 200, bot-UA page fetches 200. **Standing rule:** Attack Challenge Mode and the Bot Protection / AI Bots (`ai_bots`) managed rulesets must stay off or `log` — never `challenge`/`deny` — unless actively under attack, in which case allowlist verified AI crawlers. The monthly check (weekly-recipe-audit Step 5.5) curls the edge for `x-vercel-mitigated` so a regression gets caught within a month.

- These have their own crawlers. **Citation eligibility requires not blocking them.** Our `robots.ts` is `userAgent: "*" → allow /` which already permits every AI crawler (OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, etc.). **Decision (2026-06-10): keep fully open.** F&K wants maximum citation surface; we have no paywall-content-protection reason to block training bots, and recipes being cited/recommended by ChatGPT is top-of-funnel.
- OpenAI splits **GPTBot** (training) from **OAI-SearchBot** (ChatGPT search retrieval + citations). If we ever tighten robots, never block the retrieval bots.
- Review the AI-crawler landscape quarterly (new bots appear); revisit during the quarterly strategy review.

## 6. The scaled-content-abuse guardrail (read this before shipping daily content)

Google's spam policy targets "many pages… created primarily to manipulate rankings", regardless of whether AI or humans wrote them. F&K publishes at high velocity with AI assistance under pseudonymous editorial voices. That is survivable **only if every page passes the non-commodity bar**:

**The Non-Commodity Gate (applies to every blog post and news article):**
1. Does this post contain at least one thing that does NOT exist in the current top-5 SERP results — specific settings, an original test, a cross-platform translation, a first-hand observation?
2. If you stripped the byline and the intro, would a guitarist still bookmark it?
3. Is this topic genuinely distinct from an existing F&K post, or is it the same answer re-sliced for a keyword variant? If the honest fix is "update the existing post," update the existing post instead of writing a new one.

**It is always better to ship 3 posts that pass than 5 that don't.** Volume is not the goal; retrieval-worthy pages are. A thin page isn't neutral — at scale it's a spam-policy liability for the whole domain.

Supporting practices:
- Velocity caps per persona (3/week) stay.
- AI transparency page stays linked sitewide ("Researched by AI, verified by guitarists").
- Prefer **updating + redating** strong existing posts (with `updated:` frontmatter) over new near-duplicates — freshness on a proven URL beats a new thin URL.

## 7. Agentic search (emerging, watch-list)

AI agents increasingly visit sites to complete tasks (compare specs, fetch a preset, book/buy). They parse **rendered pages, the DOM, and the accessibility tree** — semantic HTML and accessible markup is the prep, which we should be doing anyway. When preset/Set Pack commerce goes live, watch the **Universal Commerce Protocol (UCP)** and Google Merchant Center feeds so agents can transact. No action needed today beyond keeping recipe data in clean, semantic, machine-legible markup (tables with real `<th>`, labeled controls, alt text).

## 8. Measurement additions

**Operationalized 2026-06-10** in the `weekly-recipe-audit` routine, Step 5.5 (runs first Sunday of each month):
1. **AI Overview presence:** for our top target queries, note whether an AI Overview appears and whether F&K is cited in it (logged in the SERP analysis section of the content calendar). The daily content routine also logs this per-post at write time.
2. **Crawler hits:** Vercel logs for OAI-SearchBot / ChatGPT-User / PerplexityBot / ClaudeBot etc. as a leading indicator of citation eligibility.
3. **AI referral traffic:** GA4 sessions with referrers `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`. Trend matters more than volume.

Supporting plumbing (shipped 2026-06-10): sitemap `lastmod` now reflects reality — blog posts use `updated ?? date`, recipes carry `created_at`/`updated_at` (backfilled from git history via `scripts/backfill-recipe-dates.ts`, stamped by the daily/weekly recipe routines, enforced warn-level by `meta-dates` in the audit), and artist pages inherit their newest recipe's date. Blog posts auto-link into the recipe catalog via the `RelatedRecipes` component (`src/lib/related-recipes.ts` scoring: artist/song/gear-bigram/tag matches, precision over coverage).

## 9. Quick decision log

| Decision | Status |
|---|---|
| robots: fully open to all AI crawlers | ✅ Keep (max citation surface) |
| llms.txt routes | ✅ Keep, zero maintenance priority |
| FAQPage/HowTo JSON-LD | ✅ Keep, but not an AI lever; on-page content is |
| Frontmatter `takeaways:` + `faq:` | ✅ Keep — they render reader-facing answer surfaces |
| Tables-first / direct-answer headers | ✅ Keep — good for readers AND extraction |
| Per-keyword-variant posts | ❌ Stop — consolidate into one strong page |
| Chunking posts into fragments for AI | ❌ Never |
| Chasing manufactured mentions/backlinks | ❌ Never |
| Daily volume above quality bar | ⚠️ Ship fewer when topics don't pass the Non-Commodity Gate |

## 10. Citation-mechanics research deltas (2026-07-17)

Full findings + sources: docs/research/AI_CITATION_RESEARCH_2026-07-17.md. What changed in our understanding:

- **Bing is the ChatGPT lever.** ~92% of AI referral traffic is ChatGPT, and its retrieval leans on Bing (87% of sampled citations sat in Bing's top-20; Bing #1 isn't required — top-~20 retrievability is). **Action (Daniel): verify Bing Webmaster Tools, submit sitemap, audit indexation of all ~800 pages, check the AI Performance report monthly** — it's the only first-party AI-citation dataset any engine offers.
- **Claude ≈ Brave Search** (~87% citation overlap). Worth a one-hour Brave indexation check for money queries; fastest-growing referrer.
- **IndexNow: now shipped** (2026-07-17, CI post-deploy job, changed-URLs-only). Bing/Yandex/Naver/Seznam; Google confirmed non-participant. Value = minutes-not-weeks Bing freshness, compounding with the measured freshness bias (<30-day content ≈3.2x citation rate). Kill switch: `INDEXNOW_ENABLED` repo var.
- **Freshness is real but redating-without-changes is detectably ignored** — confirms §6's "update + redate" practice; make the substantive-refresh cycle explicit in the weekly audit.
- **Top-third answer placement:** 44–55% of cited passages come from the first third of the page. Recipe pages should lead with the at-a-glance settings/chain block. (Template change — design-sensitive, needs Daniel's eye before shipping.)
- **Fan-out favors our long tail:** ~44%+ of AIO citations come from beyond top-20 via sub-query matches — one recipe page per narrow question is structurally correct; keep titles phrased as the sub-query ("[song] Helix preset settings").
- **Reddit remains the #1–2 cited domain in our query class**; engines anoint 3–5 subreddits per topic as truth sources. Reinforces §4's "earn presence by genuinely helping" — now with a mechanism: complete in-thread answers are what gets quoted. Human lane only (outreach-drafts.md).
- **Volatility warning:** ChatGPT's Reddit citation rate swung 60%→10% in weeks once. Don't overfit tactics to any single month's citation pattern.
