# Measurement Plan — Fader & Knob

**Created:** 2026-07-25
**Owner:** Daniel
**Code:** `src/lib/traffic-source.ts` (classifier), `scripts/weekly-metrics.ts` (scorecard), `src/lib/analytics.ts` (GA4 shim)
**Companions:** `docs/AI_SEARCH_PLAYBOOK.md` (what we're trying to cause), `docs/EMAIL_FUNNEL_MAP.md` (the funnels being measured), `docs/PRICING_MODEL.md` (what a conversion is worth)

This file defines what we count, how we count it, and — just as importantly — what we refuse to pretend we can count. When a dashboard disagrees with this file, this file is the spec and the dashboard is a bug.

---

## 0. The one-paragraph version

We ship an enormous amount of machinery — 800+ pages, an MCP server, DNS-AID records, OAuth well-knowns, an agent auth surface, an email sequence engine — and we currently measure **none of it against a business outcome**. GA4 records pageviews and a handful of client-side clicks. Supabase records downloads with no idea where the user came from. The free-tier download cap generates upgrade intent that is never written down. This plan fixes the measurement in three moves: (1) one north-star number, computed from data we already have; (2) a traffic-source column on every conversion row, populated by a first-touch cookie set in middleware; (3) a server-side log of AI crawler hits, kept strictly separate from AI *referrals*.

---

## 1. North star: Weekly Tones Deployed

> **Weekly Tones Deployed** = the number of preset files and recipe PDFs downloaded by **signed-in users** in the trailing 7 days.

### Why this one

- It is the moment the product actually works. Everything upstream (search rank, AI citation, email, the recipe catalog itself) exists to cause it; everything downstream (Pass, Pro, Set Packs, ToneTrace) is sold to people who have experienced it.
- It cannot be inflated by publishing more. Pageviews go up when we publish; tones deployed only goes up when someone takes a sound to their rig.
- It requires sign-in, so every unit is attributable to a person, joinable to a plan, and reachable by email.
- It moves weekly. A month is too slow to steer with; a day is noise.

### Why *not* the alternatives

| Candidate | Why it loses |
|---|---|
| Sessions / pageviews | Rewards volume publishing, the exact behaviour §6 of the AI Search Playbook says will get the domain penalized. |
| Signups | We already get signups that never download. A signup with no tone is a dead row. |
| MRR | Correct destination, far too laggy and too small-N to steer a week. Track it; don't steer by it. |
| "AI citations" / SOV | Unfalsifiable, unstable (§10 of the playbook: 60%→10% in weeks), and not a business outcome. |

### Exact SQL — this is the definition

```sql
-- Weekly Tones Deployed, current week.
SELECT
  count(*)                                          AS tones_deployed,
  count(DISTINCT user_id)                           AS active_users,
  count(*) FILTER (WHERE download_type = 'preset')  AS presets,
  count(*) FILTER (WHERE download_type = 'pdf')     AS pdfs
FROM recipe_downloads
WHERE created_at >= date_trunc('week', now() AT TIME ZONE 'utc')
  AND user_id IS NOT NULL
  AND download_type IN ('preset', 'pdf');
```

```sql
-- Trend. Weekly buckets, UTC weeks, 12 weeks back. This is the wall chart.
SELECT
  date_trunc('week', created_at AT TIME ZONE 'utc') AS week,
  count(*)                                          AS tones_deployed,
  count(DISTINCT user_id)                           AS active_users,
  round(count(*)::numeric / nullif(count(DISTINCT user_id), 0), 2) AS per_active_user
FROM recipe_downloads
WHERE created_at >= now() - interval '12 weeks'
  AND user_id IS NOT NULL
  AND download_type IN ('preset', 'pdf')
GROUP BY 1
ORDER BY 1;
```

### Definitional edges, decided

- **`user_id IS NOT NULL` is load-bearing.** Anonymous email-gated PDF rows exist in the same table. They are real value delivered, but they can't be joined to a plan or a retention cohort, so they are reported as a separate line ("excluded: anonymous"), never folded into the north star.
- **PDFs count.** A recipe printed and set on a music stand is a tone deployed. Excluding them would bias the metric toward the platforms we happen to generate preset files for.
- **No de-duplication.** Re-downloading the same recipe on a second device is still the product being used. If repeat-download spam ever appears, add `count(DISTINCT (user_id, recipe_slug))` as a *companion* line — do not silently change the north star.
- **Staff and admin accounts are included** and are currently a rounding error. Revisit at >2% of the total.
- **UTC weeks.** Same window as the quota reset in `src/lib/downloads.ts`, so "tones deployed" and "quota consumed" are always comparable.

---

## 2. KPI tree

```
                    Weekly Tones Deployed
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Active users        ×   Downloads per      (composition:
   (who showed up)         active user         which tones)
        │                     │
   ┌────┴────┐          ┌─────┴─────┐
   New       Returning   Catalog fit  Quota ceiling
   │          │          │             │
 Traffic → Activation  4-week      Quota hits →
 by source   rate      return rate  upgrade conversion
```

| Metric | Definition | Source | Query sketch | Status |
|---|---|---|---|---|
| **Weekly Tones Deployed** | preset+pdf downloads, signed-in, 7d | `recipe_downloads` | §1 | ✅ available now |
| Active users | distinct `user_id` in the above | `recipe_downloads` | `count(DISTINCT user_id)` | ✅ |
| Downloads / active user | tones ÷ active users | derived | — | ✅ |
| New accounts | `profiles` created in 7d | `profiles` | `WHERE created_at >= now() - interval '7 days'` | ✅ |
| **Activation rate** | % of accounts created 8–35d ago with ≥1 tone within 7d of signup | `profiles` ⨝ `recipe_downloads` | `LEFT JOIN LATERAL (SELECT min(created_at) …)`; see script §4 | ✅ |
| **4-week return rate** | of users active in the week starting 35d ago, % active again in the last 7d | `recipe_downloads` | two `DISTINCT user_id` CTEs, joined | ✅ |
| **Quota hits** | free users with ≥5 preset downloads this calendar month | `recipe_downloads` ⨝ `profiles` | `HAVING count(*) >= 5 AND role = 'free'` | ⚠️ partial — see gap #2 |
| Near-quota | free users at exactly 4 | same | `HAVING count(*) = 4` | ⚠️ partial |
| Quota → upgrade conversion | % of quota-hitters who become `pass`/`pro` within 30d | `events` ⨝ `profiles` | needs `quota_blocked` events | ❌ gap #2 |
| Tone-request volume | requests created in 7d | `tone_requests` | `WHERE created_at >= now() - 7d` | ✅ |
| Tone-request backlog age | age of oldest/median `pending`+`in_progress` | `tone_requests` | `max(now() - created_at)` | ✅ |
| Fulfillment latency | created → completed, p50/p90 | `tone_requests` | needs `completed_at` | ❌ gap #6 |
| **Tones by traffic source** | north star split by `ai_assistant`/`search`/… | `recipe_downloads.traffic_source` | `GROUP BY traffic_source` | ❌ **gap #1 — the big one** |
| Signups by traffic source | new accounts split by first touch | `profiles.signup_source` | `GROUP BY signup_source` | ❌ gap #1 |
| AI crawler hits | retrieval-bot fetches per day | `bot_hits` (proposed) | `GROUP BY detail, day` | ❌ gap #3 |
| Newsletter → account | subscribers who later create an account | `newsletter_subscribers` ⨝ `profiles` on email | `JOIN … USING (email)` | ✅ (email join) |
| Paid conversions | role transitions to `pass`/`pro` | `events` (Stripe webhook) | `WHERE name = 'checkout_complete'` | ✅ |

Everything marked ✅ is computed today by `npx tsx scripts/weekly-metrics.ts`.

---

## 3. AI attribution design

### 3.1 The distinction that has to survive every dashboard

| | AI **crawler** | AI **assistant referral** |
|---|---|---|
| What it is | GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot fetching a page | A person clicking a link inside a ChatGPT/Perplexity/Claude answer |
| Humans involved | zero | one |
| Conversion rate | 0.00%, permanently | high — they arrive pre-sold |
| What it tells us | *eligibility*: we are fetchable and being indexed. Leading indicator. | *outcome*: we are being cited and the citation works. Lagging, revenue-bearing. |
| Where it's counted | `source: "ai_crawler"`, `isBot: true` | `source: "ai_assistant"`, `isBot: false` |
| Correct reaction to a spike | check bandwidth and robots; expect referrals in 2–6 weeks | do more of whatever caused it |

Mixing them produces the single most misleading chart it is possible to draw here: "AI traffic up 400%" that is entirely Bytespider. `classifyTrafficSource()` returns them as different `source` values and `isHumanTraffic()` exists so no human-behaviour metric can accidentally include a robot.

### 3.2 Signal ladder (in order of reliability)

1. **Campaign parameter.** ChatGPT appends `?utm_source=chatgpt.com` to links it renders. This survives referrer stripping and is checked *before* the referrer. Highest confidence signal we get.
2. **Referrer host.** `chatgpt.com`, `perplexity.ai`, `claude.ai`, `copilot.microsoft.com`, `gemini.google.com`, `edgeservices.bing.com` (the Edge sidebar), plus ~30 more in `AI_ASSISTANT_HOSTS`. Reliable when present.
3. **User-agent.** Only for bots. Establishes `ai_crawler` and never `ai_assistant` — no human's browser announces "I came from ChatGPT."
4. **Landing-page heuristic (`isDarkAiCandidate`).** No referrer + a cold landing on a deep content path (`/recipes/…`, `/blog/…`, `/artists/…`). Nobody types a 60-character recipe slug from memory. Reported as **its own line** — "direct-to-deep-page, likely assistant: N" — and **never** used to relabel a session's source. Sizing the blind spot is legitimate; filling it in with guesses is not.

### 3.3 Capture mechanism (the missing plumbing)

Three small pieces, in dependency order:

**(a) First-touch cookie, set in middleware.** `src/middleware.ts` already runs on every non-static request and is the only place that sees the referrer for a hard navigation. Classify there and write a 90-day `fk_src` cookie **only if absent** (first touch wins — the assistant that introduced us should get credit for the signup three weeks later, not the Google search that brought them back).

```ts
// src/middleware.ts — sketch
const c = classifyTrafficSource({
  referrer: request.headers.get("referer"),
  userAgent: request.headers.get("user-agent"),
  searchParams: request.nextUrl.searchParams,
});
if (c.isBot) {
  logBotHit(c, request.nextUrl.pathname);      // (c) below — never a cookie
} else if (!request.cookies.get("fk_src")) {
  res.cookies.set("fk_src", `${c.source}|${c.detail}|${request.nextUrl.pathname}`, {
    maxAge: 90 * 24 * 60 * 60, sameSite: "lax", httpOnly: false, path: "/",
  });
}
```

**(b) Stamp it on every conversion row.** One migration:

```sql
ALTER TABLE recipe_downloads
  ADD COLUMN traffic_source TEXT,        -- ai_assistant | search | social | …
  ADD COLUMN traffic_detail TEXT;        -- chatgpt | google | reddit | …
CREATE INDEX recipe_downloads_source_idx
  ON recipe_downloads (traffic_source, created_at DESC);

ALTER TABLE profiles
  ADD COLUMN signup_source TEXT,
  ADD COLUMN signup_detail TEXT,
  ADD COLUMN signup_landing_path TEXT;   -- which page introduced us

ALTER TABLE newsletter_subscribers
  ADD COLUMN traffic_source TEXT,
  ADD COLUMN traffic_detail TEXT;
```

Write sites: `src/app/api/preset/[slug]/route.ts` and `src/app/api/recipes/[slug]/download/route.ts` (both already insert into `recipe_downloads`), the signup handler, and the newsletter endpoint. Each reads the `fk_src` cookie; if it is missing, fall back to classifying the request's own referrer/UA, and if that yields nothing, store `direct`. Never store `NULL` for "we didn't look" and `direct` for "we looked and found nothing" — one column, one meaning.

**(c) Server-side bot log.** Crawlers never run JavaScript, so GA4 cannot see them; Cloudflare/Caddy logs can, and nobody reads them. A tiny table makes the leading indicator queryable:

```sql
CREATE TABLE bot_hits (
  id          BIGSERIAL PRIMARY KEY,
  detail      TEXT NOT NULL,          -- gptbot | oai_searchbot | perplexitybot | …
  role        TEXT NOT NULL,          -- retrieval | training  (crawlerRole())
  path        TEXT NOT NULL,
  status      SMALLINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX bot_hits_detail_day_idx ON bot_hits (detail, created_at DESC);
```

Write it **sampled and fire-and-forget** (e.g. 1-in-N, or aggregate in memory and flush hourly) — a crawler sweep is thousands of requests and must never add latency or a write-amplification bill to a page render. The number that matters is the daily count per bot, not the individual rows. `crawlerRole()` splits retrieval bots (OAI-SearchBot, PerplexityBot, Claude-User — these predict citations) from training bots (GPTBot, CCBot — these predict nothing this quarter).

### 3.4 The report that finally answers the AI question

```sql
-- Does AI-referred traffic actually convert? The whole point.
SELECT
  coalesce(p.signup_source, 'unknown')                       AS source,
  count(DISTINCT p.id)                                       AS accounts,
  count(DISTINCT d.user_id)                                  AS activated,
  round(100.0 * count(DISTINCT d.user_id)
        / nullif(count(DISTINCT p.id), 0), 1)                AS activation_pct,
  count(DISTINCT p.id) FILTER (WHERE p.role IN ('pass','pro')) AS paid
FROM profiles p
LEFT JOIN recipe_downloads d
  ON d.user_id = p.id AND d.download_type IN ('preset','pdf')
WHERE p.created_at >= now() - interval '90 days'
GROUP BY 1
ORDER BY accounts DESC;
```

Until §3.3 ships, this query returns one row: `unknown`. That is the honest current state of AI attribution at Fader & Knob.

---

## 4. GA4 custom channel group

GA4's default channel grouping files `chatgpt.com` under **Referral** and buries it next to a forum link. Create a custom channel group named **"F&K Channels"** (Admin → Data display → Channel groups → Create). Rules are evaluated top-down; first match wins. Names match `channelLabel()` in `src/lib/traffic-source.ts` so the dashboard and the database never drift.

| # | Channel | Condition |
|---|---|---|
| 1 | **AI Assistant** | `Session source` matches regex `chatgpt\|openai\|perplexity\|pplx\|claude\.ai\|claude\.com\|copilot\|edgeservices\.bing\|gemini\.google\|bard\.google\|meta\.ai\|grok\|x\.ai\|deepseek\|mistral\|you\.com\|phind\|poe\.com\|andisearch\|iask\|komo\|genspark\|felo\|liner\|duck\.ai\|perplexity\.ai` |
| 2 | **AI Assistant** | `Session manual source` exactly matches `chatgpt.com` (catches the UTM-tagged, referrer-stripped case) |
| 3 | **Email** | `Session medium` matches regex `^(email\|e-mail\|newsletter\|mail\|drip\|sequence\|broadcast)$` |
| 4 | **Organic Search** | GA4 default "Organic Search" definition |
| 5 | **Organic Social** | GA4 default "Organic Social" definition |
| 6 | **Referral** | `Session medium` = `referral` |
| 7 | **Direct** | `Session source` = `(direct)` and `Session medium` in `(not set)`, `(none)` |

Notes and caveats:

- **AI Assistant must sit above Organic Search**, or `gemini.google.com` gets swallowed by the Google organic rule.
- **Channel groups are not retroactive by default** — GA4 applies a new group going forward and reprocesses only a limited window. Create it once, then stop editing it; every edit resets comparability.
- Also register a **custom dimension** `traffic_source_detail` (event-scoped) and send `detail` from `classifyTrafficSource()` on the first pageview of a session. GA4's own source/medium is last-non-direct-click; ours is first-touch. They will disagree, and ours is the one joined to revenue.
- Mark `recipe_download_click` and `checkout_complete` as **key events** so the channel report shows conversions, not just sessions.
- GA4 cannot see crawlers at all (no JS). Never look for `ai_crawler` in GA4 — that lives in `bot_hits` only.

---

## 5. The Monday-morning report

One page, read in 90 seconds, produced by `npx tsx scripts/weekly-metrics.ts`. Shape:

```
Fader & Knob — weekly scorecard
Week ending 2026-07-27

★ NORTH STAR — Weekly Tones Deployed
  Tones deployed (7d)         184        +23 (+14%) vs last week
    presets                   131
    recipe PDFs                53
  Active users (7d)            61
  Downloads / active user     3.02
  Trend (8w)                  ▃▄▄▅▄▆▆█   98 · 112 · 119 · 140 · 128 · 161 · 161 · 184

Acquisition
  New accounts (7d)            27        prev week 22
  Total accounts            1,240        38 paid · 2 staff

Activation & retention
  Activation (≤7d)          41.2%        33/80 of accounts created 8–35d ago
  4-week return rate        28.6%        12/42 active 4w ago, active again this week

Quota pressure — free cap is 5 presets/month
  Hit the cap this month        9        ← upgrade candidates, contact them
  One download away             6        ← pre-emptive upgrade audience

Tone requests
  New requests (7d)            11
  Open (pending + WIP)         34
  Oldest open               19.4d        median 6.2d

Top tones this week
    22  oceans-hillsong-helix
    17  something-in-the-water …
```

**Rules for the ritual, so it stays a decision tool and not a wall of numbers:**

1. **One number leads.** The north star and its week-over-week delta. Everything else is diagnosis.
2. **Every metric has an owner action.** Activation down → onboarding email or first-download UX. Quota hits up → send the upgrade email *this week*, while the frustration is fresh. Backlog age up → fulfil or decline; stale promises cost more than declines.
3. **Do not add a metric without deleting one.** The scorecard tops out at what fits on one screen.
4. **Annotate.** When the number moves >20%, write one line of why in `docs/index-health-log.md`. Six months of annotations beats any dashboard.
5. Once §3.3 ships, add exactly one row: `Tones by source: ai_assistant 31 · search 88 · direct 41 · email 19 · social 5`.

---

## 6. Instrumentation gaps, ranked by decision-value

Ranked by "what decision does this unblock," not by effort.

| # | Gap | Decision it unblocks | Effort | Fix |
|---|---|---|---|---|
| **1** | **No traffic source on any conversion row.** Nothing in `recipe_downloads`, `profiles`, or `newsletter_subscribers` records where the person came from. Zero referrer classification exists in the codebase. | *Do we keep investing in the AI/agent surface (MCP, DNS-AID, auth.md, well-knowns) or redirect that effort to email and Bing?* Currently unanswerable — this is a multi-month allocation decision being made on vibes. | M | §3.3 (a)+(b): middleware cookie + 2 columns + stamp at 4 write sites |
| **2** | **Quota refusals are never logged.** `canDownload()` returns 402 and the moment evaporates. We can count who *reached* 5, never who *wanted a 6th*. | *Is $4.99 the right price, and is 5 the right cap?* The refusal count is the demand curve. Also: who to email today. | S | Insert `events(name:'download_quota_blocked', user_id, params:{recipe_slug, count})` at the 402 in `src/app/api/recipes/[slug]/download/route.ts` |
| **2b** | **The cap is enforced on one download path and not the other.** `/api/recipes/[slug]/download` calls `canDownload()`; `/api/preset/[slug]/route.ts` explicitly does not ("free as of 2026-05-10, no quota"). Free users can exceed 5 via the second route. | *Is our paywall real?* Quota-hit counts undercount by however much traffic uses the unmetered path — and the revenue line is leaking. **Decide the intended policy before building any quota metric on top of it.** | S | Product decision, then align the two routes |
| **3** | **No server-side AI-crawler log.** Crawler hits exist only in Cloudflare/Caddy logs nobody reads. GA4 structurally cannot see them. | *Are we citation-**eligible**?* This is the early warning for the exact failure that already happened twice (Vercel firewall challenging all bots; Cloudflare Bot Fight Mode blocking PerplexityBot). Both were caught by luck, months late. | M | §3.3 (c): `bot_hits`, sampled write from middleware |
| **4** | **Client-only funnel events.** `signup_start`, `checkout_start`, `recipe_download_click` go to GA4 only. Ad blockers eat a meaningful share, and GA4 rows can't be joined to a `user_id`. | *Where exactly does checkout leak?* Any funnel built on these has an unknown, non-constant denominator. | S | Mirror the 4 highest-value events into the existing `events` table server-side |
| **5** | **No first-touch persistence.** Even after gap #1, a user who found us via ChatGPT in week 1 and signs up in week 3 via a Google search would be credited to Google. | *What actually starts the journey?* Discovery and conversion are weeks apart in this category; last-click will systematically undercount AI and overcount branded search. | S | The `fk_src` cookie in §3.3(a) is already first-touch-only — just don't overwrite it |
| 6 | No `completed_at` on `tone_requests`; `updated_at` moves on any edit. | Can't measure fulfillment latency, the core promise of the $4.99 plan. | S | Add column, set on status→completed |
| 7 | Agent surface (`/api/mcp`, `/agent-md`, `/auth.md`, well-knowns) logs nothing. | *Does the agent surface produce anything?* Right now it is a pure act of faith. | S | Count requests per agent path into `bot_hits` or `events` |
| 8 | Anonymous PDF downloads carry an email but no source and no join to `profiles`. | Sizing the email-gate funnel from `EMAIL_FUNNEL_MAP.md` Funnel 2/3 hooks. | S | Same `traffic_source` columns; join on email |
| 9 | No landing-page dimension on conversions. | Which of the 800 pages actually recruits members (vs merely gets traffic). | S | `signup_landing_path`, already in the §3.3 migration |

**Suggested order:** 2 → 2b → 1 → 3 → 4. Gap 2 is an afternoon and points straight at revenue; gap 2b may be a bug rather than a policy; gap 1 is the biggest strategic unlock but needs a migration and four write sites.

---

## 7. What we cannot know, and why

Every attribution system has a floor. Ours:

- **Assistants that send no referrer.** Native ChatGPT and Claude desktop/mobile apps, Copilot in the Windows shell, and most in-app webviews open links with an empty `Referer` and no UTM. Those people land in `direct`. We can *size* the population with `isDarkAiCandidate()` (no referrer + cold landing on a deep content path) but we cannot name their origin. **Any "AI referrals" number we publish is a floor, not a total.**
- **Google AI Overviews and AI Mode are invisible.** They refer as plain `google.com`, identical to a blue-link click. Google publishes no parameter, no referrer variant, and no Search Console segment separating them. Our classifier calls this `search` and that is the truthful answer, not a shortcoming to engineer around. Anyone selling an "AI Overview traffic" number is inferring it.
- **User-agents are self-reported.** A scraper can claim to be Chrome; a browser extension can claim to be GPTBot. Bot classification here is for measurement, never for access control, and the counts have an unknown error bar in both directions.
- **Crawler hits do not imply citations.** Being fetched by OAI-SearchBot means we are *eligible* to be cited. Whether we were actually quoted in any given answer is unobservable from our side. Bing Webmaster Tools' AI Performance report is the only first-party dataset anyone offers, and it covers one engine.
- **Citation counts are not measurable, only sampled.** SOV runs (`docs/ai-sov-runs/`) are non-deterministic prompts against non-deterministic models on a moving index. Treat them as anecdote at scale, not measurement; the playbook (§10) already documents a 60%→10% swing in weeks. Never put an SOV number next to a revenue number as if they are the same kind of thing.
- **Ad blockers and privacy browsers remove a share of GA4 entirely.** Server-side rows in Supabase are the ground truth; GA4 is the texture. When they disagree, Supabase wins.
- **Cross-device journeys break.** Discovered on a phone in a rehearsal, signed up on a laptop at home — two `fk_src` cookies, one credited. Unfixable without cross-device identity we have no reason to build.
- **The cookie is per-browser and 90 days.** Clearing cookies, Safari's ITP, or a >90-day consideration window all reset first touch to `direct`.

**The rule:** when the data cannot answer the question, say so in the report. A blank cell labelled "not measurable" is worth more than a confident number nobody can reproduce — and it is the only way the number that *is* real keeps its authority.
