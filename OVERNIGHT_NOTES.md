# Overnight Session — 2026-07-07 → 08

Good morning. Skim the TL;DR, then the ⚠️ item — it's the one thing only you can do.
(Previous overnight report from 2026-04-17 is in git history at `57dc1dd^`.)

## TL;DR

- **⚠️ Cloudflare is blocking every AI crawler** (GPTBot, ClaudeBot, Google-Extended, CCBot, Amazonbot, meta-externalagent, more) via its managed robots.txt, live since cutover — the exact opposite of the AI Search Playbook while ChatGPT is your #6 traffic source. **Fix: Cloudflare dashboard → faderandknob.com → Security → Bots/Settings → disable "Block AI bots" / managed robots.txt / Content Signals.** I couldn't log in for you. Verify after: `curl -s https://faderandknob.com/robots.txt | grep -c "Cloudflare Managed"` → expect 0. (Same incident class as the 2026-06-11 Vercel firewall block.)
- **21 factual errors fixed** in your three highest-traffic posts (Deluxe Reverb, FRFR roundup, Big Muff) — including the AB763 being called cathode-biased (it's fixed-bias), Siamese Dream credited to the wrong Muff variant, and the Friedman ASM-12 priced at $500 (it's $1,399). All WebSearch-verified, live.
- **New recipe shipped through the full new pipeline**: `grohl-times-like-these-riff` (backlog #159), authored by the new **recipe-author agent**, then FAILED by helix-preset-qc, fixed, regenerated, and verified value-by-value. The QC catch-and-fix loop works.
- **Content strategy re-anchored**: the roadmap audit found 0/25 worship Tier-2 posts and 0/2 pillars shipped three weeks after the cluster spec called them highest-ROI. A strategic queue (S1–S10) now sits at the top of the calendar; next runs take ≥2 of 3 slots from it.
- **Reddit research filed** (docs/research/REDDIT_SERVICE_RESEARCH_2026-07-08.md): 15 evidence-backed improvement ideas. Headline: presets fail on *rig translation*, not tone — the moat is adaptation intelligence, which is the ToneTrace thesis validated by the market.
- **TimeLine MX news post live** (announced yesterday, $679) — the worship-board delay successor, with the Helix-loop buy/skip angle.
- Recipe audit 185/185 clean · MDX 361/361 compile · build green (1,194 pages) · every push deployed.

## Commit ledger (overnight, oldest → newest)

| SHA | What |
|---|---|
| `91a5d42` | Fact-check corrections: 21 fixes across the three highest-traffic posts |
| `e638886` | Strategy re-anchor: worship queue injection + Reddit research doc + recipe-author agent |
| `57dc1dd` | Times Like These recipe + TimeLine MX news + backlog rows 105/106 repaired |

(Earlier in the evening, same session: `8f9568d` funnel analytics wiring, `41f6029`/`590ee44` Vercel decommission, `ec17b2d` Google sign-in — see docs/VERCEL_DECOMMISSION_SPRINT.md.)

## The new authoring pipeline (and what its first run caught)

`.claude/agents/recipe-author.md` is the authoring counterpart to `helix-preset-qc`:
research-grounded (≥2 sources or needs-research), standard-enforcing (0–10 amp scale,
verified-inventory blocks, real units, honest stats), audit + tsc gates, QC handoff.

Shakedown run on backlog #159 produced an audit-clean recipe whose generated .hlx
**failed QC with 4 criticals** — exactly what the pipeline is for. Recipe-side issues
fixed (comp attack/release in ms → clamped; drive Gain/Level on 0–10 → emitted raw;
Master 7; Decay maxed; mic dial-in lost to legacy cab variant → fixed via the house
cabSibling/WithPan pattern). Regenerated and verified value-by-value.

### ⚙️ Three latent GENERATOR findings (affect existing presets; need a careful pass with corpus survey — don't blind-fix)

1. **Predelay casing silent-drop**: `PARAM_NAME_MAP` forces `predelay → "PreDelay"`, but the corpus uses `Predelay` 18:3 (e.g. `HD2_ReverbRoom` 26/26). Every recipe authoring a predelay on those models is silently dropped today — including existing recipes (the SRV Spring block has `Predelay: 20`). Fix needs model-aware casing (the 3 `PreDelay` models are real).
2. **Legacy cab aliases shadow CabMicIr variants**: `"2x12 Blue Bell" → HD2_Cab2x12BlueBell` (legacy, no Mic/Position, uses `"High Cut"` with a space). Single-mic recipes that author Mic/Position lose them silently. Dual-mic `cabSibling` recipes are fine (auto-promoted to WithPan). Survey which aliases/recipes are affected before switching aliases.
3. **Empty-dsp1 routing**: generator emits `dsp1.outputA.@output = 0`; reference + corpus use `1` (Multi). Likely harmless (50 shipped presets load), but non-canonical.

## What to review on the live site

1. `/recipe/grohl-times-like-these-riff` — the new recipe page.
2. `/news/strymon-timeline-mx-dual-engine-delay` — yesterday's news, published ahead of most outlets.
3. `/blog/fender-deluxe-reverb-settings` — your #1 page, now technically correct.

## Morning decisions queue (yours)

1. **Cloudflare AI-crawler toggle** (see ⚠️ above) — 2 minutes, biggest impact.
2. **Reddit quick wins** — the research doc lists 5 low-effort/high-impact moves (per-block design notes, level-match guarantee + FOH spec sheet, venue-translation checklist, one free flagship worship preset, trail-handling docs). Pick any and I'll build it.
3. **Worship recipe attribution policy** — 6 of 10 worship backlog entries died in needs-research under the per-track-attribution bar, but the cluster spec's Tier-2 *song posts* don't need that bar. Confirm the reconciliation (song posts ≠ recipes) and the worship queue unblocks.
4. **GA4 key events** — when `checkout_start`/`signup_start`/`checkout_complete` appear under Admin → Events (they're deployed and fire with real traffic), star them.
5. Standing items: GH cron 200-check Tue 7/14; delete Vercel project + cancel billing ~7/14; signed-in PDF + Google-login click-through when convenient.

## Audit results (the "errors in code, settings, facts" pass)

- **Code**: tsc clean; build green; 36 pre-existing lint errors (react-hooks/set-state-in-effect family — all predate tonight, mechanical to fix, none new). MDX 361/361 compile; 583 warnings are the known missing-takeaways/faq AEO backlog on old posts.
- **Settings**: the Cloudflare robots block (⚠️ above) was the big one. Everything else checked healthy: feed.xml 200, llms.txt consistent with playbook (keep/zero-maintenance), sitemap fresh with lastmod, security headers intact, geo-block live, firewall + rate-limit hardening from earlier tonight holding.
- **Facts**: 31 claims checked across the top 3 posts, 21 problems found and fixed. Recommend a rotating weekly fact-pass over the next-most-trafficked posts — the hit rate was high enough that older posts likely have more.
- **Data hygiene**: RECIPE_BACKLOG rows 105/106 were malformed link-dumps sitting in the queue path (would've confused the daily task); repaired as reference rows. `data/proposed-recipes.md` is stale (many entries long since shipped) — worth an archive pass someday, low priority.
