# Distribution & Automation Operating System

**Created:** 2026-07-25
**Extends:** `docs/HEADLESS_DISTRIBUTION_PLAYBOOK.md` (channel rules and lanes stay as written there). This doc turns the playbook plus newsletter, backlinks, and social into a weekly operating cadence with named automations, and defines the minimum human-in-the-loop budget.
**Design target:** the machine prepares everything; Daniel's total recurring involvement is **one ~20-minute approval window per week** plus occasional one-time capital events. Nothing in the SEMI or HUMAN lanes ever fires without explicit go (standing rule, unchanged).

---

## 1. Why distribution is the priority (from the data)

Content production is solved (5 posts + 5 recipes/day, automated). The 90-day GA4 window shows the consequence of distribution being unsolved:

- **Retention:** ~2,400 new users in 90 days, but daily returning users run at only ~17% of new arrivals (411 vs 2,402 across the window). People arrive, get their answer, and vanish because nothing follows them home. Fix: newsletter actually sending.
- **Authority:** 0 backlinks; Google is indexing the site slowly (worship cluster stuck 25+ days) while Bing/DDG/AI assistants already deliver 57% of first-touch users. Fix: the backlink circuit.
- **Conversion:** 54 key events, no purchases recorded. Checkout itself is live and verified (July 2026 live test); the gap is instrumentation and conversion surfaces. Fix: star the purchase key events, configure the funnels, fix the dead clicks.

So the OS below has three engines: **Retain (newsletter), Earn (backlinks), Reach (social/syndication)**, plus the sales gate.

---

## 2. Engine 1: Retain (the newsletter, actually shipping)

**Product:** "Tone of the Week" (name already in `src/lib/email.ts` scope). Weekly, from fk-staff voice: one recipe (with one exact settings takeaway inline, so the email is useful without a click), one insight from the week's best-performing post, one news item, one CTA. Plain text-ish template, no design project.

**Pipeline (fully automatable today; infra exists):**
1. Scheduled task (weekly, Thu morning): query the week's new recipes + GA4-winning post + top news item; draft the issue in voice; commit to repo as MDX/HTML; send via Resend broadcast to `newsletter_subscribers`.
2. **Welcome sequence (one-time build, then automated):** full copy and implementation spec now live in `docs/WELCOME_SEQUENCE.md` (Sequence A for account signups, Sequence B for newsletter-only subscribers, queue-table architecture, suppression rules, Stripe/Supabase measurement). Extend to the 5-email seasonal onboarding variants per `SEASONAL_CAMPAIGN_CALENDAR.md` C2.
3. Capture surfaces: per-question email hooks on top-20 pages (settings PDF, buying checklist, fix-it diagnostic) per `MESSAGING_FRAMEWORK.md` §7.2.

**Human in loop:** none per issue after the first two sends are reviewed. Corrections policy applies (if a sent issue contained a wrong value, the next issue corrects it visibly; same public-corrections ethos).

**KPI:** subscriber count (target: 200 by Oct 1), open rate (35-45% benchmark per launch plan), returning-user rate climbing off ~17%.

## 3. Engine 2: Earn (the backlink circuit that fixes the Google bottleneck)

Priority order by effort-to-authority ratio. The index-health log is explicit: do not publish more pages to fix indexing; earn authority. Links here also compound the AI-citation flywheel (engines trust linked/named sources).

| Play | Lane | What the machine does | What Daniel does | Status |
|---|---|---|---|---|
| **AI directory circuit** (There's An AI For That, Ben's Bites, Uneed, MicroLaunch, BetaList, SaaSHub, TinyLaunch) | HUMAN once | Drafts every listing (copy, screenshots list, links) as a ready-to-paste pack | ~15 min per directory, once | Drafts ready on request; permanent backlinks, story is hot |
| **Show HN** | HUMAN once | Drafts post + anticipated-questions doc from /experiment data | One day of comment presence | Biggest single-day event available; do after Stripe works and unwrapping-window content exists (traffic should land somewhere that converts) |
| **Press photo outreach → relationships** | SEMI | Emails drafted (Marshall ready; Neural DSP, Line 6 queued) | Approve + send from hello@ | Also earns industry contacts that become link sources |
| **Linkable assets** (we already have them: cable-length measurements, delay-time BPM tables, 60-cycle-hum decision tree, nut-lube showdown, A/B pedal tests) | AUTOMATED + SEMI | Quarterly: package one existing original-data piece as "the reference"; draft short pitch notes to the 10 sites/newsletters/forums that cite such things | Approve outreach sends | The Gear Lab pillar is the link magnet; original data is the only thing strangers link to |
| **CustomTone + guitarpatches uploads** | SEMI | `customtone-batch.ts` (to build) exports 2-3 presets/wk + descriptions with UTM'd recipe URLs | Upload batch in the weekly window (ToS requires human) | Best-matched audience; every visitor owns a Helix |
| **NAMM/news citations** | AUTOMATED | Fast, accurate coverage gets cited by roundup writers; hub pages give them one URL to link | none | Freshness engine already runs |
| **Worship creator warm DMs** | HUMAN | Drafted in outreach-drafts.md | Send personally, slowly | Relationship channel, never automated |

**KPI:** referring domains (from 0; target 15+ by year-end), worship-cluster indexation (4 stuck URLs), Bing Webmaster AI Performance citations monthly.

## 4. Engine 3: Reach (social & syndication)

| Channel | Lane | Cadence | State |
|---|---|---|---|
| RSS/JSON/WebSub/IndexNow plumbing | AUTOMATED | on deploy | ✅ shipped 7/17 |
| Flipboard magazine | SEMI (one form) then AUTOMATED | continuous | Apply; full-content feed strengthens it (MDX→HTML renderer is the unblock, also unlocks SmartNews) |
| LinkedIn founder videos | HUMAN films, machine scripts | 2/week for ~5 weeks | 10 scripts ready; highest-leverage human hours available: P3 story recruits the backlink audience |
| YouTube Shorts (60-second recipes) | AUTOMATED after unblock | 3-5/week | Blocked on audio contractor + one-time YouTube API audit. **Decision needed: hire the contractor.** Real audio is also the #1 conversion trust gap on recipes |
| F&K Discord #new-recipes webhook | SEMI once | continuous | One-time server+webhook creation, then automated |
| Partner Discord feeds | SEMI | one DM per server | Anti-astroturf community reach |
| Reddit / forums | HUMAN only | organic | Nathan Cross rules; never automated, never softened |
| Podcast digest ("Tone Recipe Radio") | AUTOMATED | weekly | Parked until newsletter + Shorts run; second directory ecosystem when ready |

## 5. The sales gate (do first, everything multiplies against it)

1. ~~Stripe standup~~ **DONE: checkout verified live** (real $4.99 purchase + refund test, July 2026). A stranger can pay.
2. **Funnels on:** the four Clarity funnels + GA4 key events (`signup_start`, `checkout_complete`) starred, per `CRO_AUDIT_2026-05-10.md`. GA4 shows zero purchase events over 90 days; until these exist we are flying blind on which engine produces buyers. **Revenue truth comes from Stripe and Supabase, not GA4:** a weekly metrics snapshot queries the Stripe API (subscriptions, MRR, refunds) and Supabase (signups, roles, download counts) directly; GA4/Clarity are for attribution only.
3. **Dead-click fixes** on /recipe and /browse (24.4% dead-click rate; auth-aware download modal is both a fix and a signup driver).
4. **Then** pricing-model rollout (Free/Pass/Pro per `PRICING_MODEL.md`) and the seasonal promos.

## 6. The weekly human window (the whole human budget)

A Monday scheduled task assembles one digest: newsletter issue preview (FYI), CustomTone batch ready to upload, any outreach drafts awaiting send, seasonal lookahead flags, and any decision requests (with recommended defaults). Daniel spends ~20 minutes: approve, upload, send, or veto. Everything not requiring judgment already ran.

## 7. Scheduled tasks to create (the automation delta)

| Task | Cadence | Does |
|---|---|---|
| `weekly-newsletter` | Thu 09:00 | Draft + send Tone of the Week (after 2 supervised sends) |
| `weekly-human-window-digest` | Mon 08:00 | Assemble the approval queue described in §6 |
| `monthly-seasonal-lookahead` | 1st of month | Check `SEASONAL_CAMPAIGN_CALENDAR.md` for campaigns entering their T-8-week window; inject rank-layer items into the content backlog; draft capture/convert assets |
| `quarterly-linkable-asset` | quarterly | Package one Gear Lab data piece + outreach pack |
| `weekly-metrics-snapshot` | Mon 07:30 | Query Stripe API (subs, MRR, refunds) + Supabase (signups, role changes, downloads, sequence sends); log the funnel to `docs/metrics-log.md`; feed the human-window digest |
| (existing) daily content, recipes, news, audits, index-health | unchanged | unchanged |

## 8. Sequencing (next 6 weeks)

1. **Week 1:** Instrumentation (star GA4 key events, configure the four Clarity funnels) + welcome sequence build + first supervised newsletter send. Create `weekly-human-window-digest`.
2. **Week 2:** Newsletter send #2, then flip to automated. AI-directory pack prepared; Daniel does 3 listings. Dead-click fixes shipped.
3. **Week 3:** C1 September worship campaign rank-layer enters the content pipeline. CustomTone batch script built; first upload window. Marshall press email goes.
4. **Week 4:** Flipboard + Discord webhook one-timers. LinkedIn video #1-2 filmed.
5. **Weeks 5-6:** C2 holiday gift hub drafting begins (Oct 15 publish deadline). Audio-contractor decision closed. Show HN scheduled for when checkout + onboarding content are proven.

The through-line: every engine is built once, then runs on schedule; humans only touch judgment, uploads platforms require to be human, and relationships.
