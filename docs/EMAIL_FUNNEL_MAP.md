# Email Funnel Map: Landing Page → Audience → Sequence → Destination

**Created:** 2026-07-26
**Visual:** FigJam board "F&K Email Funnels" (Team Rocketship): https://www.figma.com/board/cPGWoHxyTPo2KUGR5ZLHrJ
**Companions:** `MESSAGING_FRAMEWORK.md` (voice, escalator test), `WELCOME_SEQUENCE.md` (sequences A and B, built), migration 025 + `/api/cron/email-sequence` (the sending machinery all new sequences reuse).
**Principle:** every funnel ends in one of two places: a paying customer, or the weekly newsletter (Tone of the Week; Sunday Setlist for worship). Nobody captured is ever left with silence again.

## Status key

- **LIVE**: exists on the site today
- **HOOK TO BUILD**: page exists, email-capture offer must be added
- **TO CREATE**: page does not exist yet
- **BUILT**: email written, in `src/lib/email.ts`, sending via the queue
- **TO WRITE**: email planned here, not yet written

## Funnel 1: Modeler player (core product audience)

- **Profile:** owns a Helix/HX Stomp/QC, tired of scrolling presets. GA4: the recipe catalog is the main internal destination.
- **Landing:** /browse + recipe pages (LIVE). **Capture:** free account, 5 downloads/mo (LIVE).
- **Sequence A (BUILT):** A1 instant "Your 5 downloads, and where to spend them" → A2 day 3 "How to read a recipe" → A3 day 7 "The math on the download cap" (auto-skipped if paid).
- **Ends:** buys Pass/Pro → PAID; otherwise → newsletter. All other funnels feed here when someone creates an account (the DB trigger enqueues Sequence A automatically).

## Funnel 2: Amp and pedal owner (biggest search audience: 621 users/90d on settings guides)

- **Profile:** owns the amp/pedal, asks "what do I set the knobs to." Smart, not site-native; landed from a search engine or AI answer.
- **Landing (LIVE, HOOK TO BUILD):** Deluxe Reverb settings (172 users), Big Muff (49), Vox AC30 (34), JCM800 (24), Tube Screamer (24), and every other settings guide.
- **Hook to build:** "Free printable cheat sheet for your amp" email capture on every settings guide. (PDF generation already exists on recipes; this reuses it.)
- **Sequence C (TO WRITE, 3 emails):** C1 instant: the cheat sheet + the level-matching rule. C2 day 3: the 5 settings mistakes almost every owner makes. C3 day 7: "every song on your amp" → create the free account.
- **Ends:** account → Funnel 1; no account → newsletter.

## Funnel 3: Buying researcher (178 users/90d buying guides + 728 on comparisons)

- **Profile:** deciding what to buy: FRFR speaker (151 users on one page), IR libraries (70), which Helix (36).
- **Landing (LIVE, HOOK TO BUILD):** Best FRFR Speakers 2026 (top Google page), Cab IR Roundup, Helix family comparison, other X-vs-Y pages.
- **Hook to build:** "The buyer's checklist" PDF per guide.
- **Sequence D (TO WRITE, 3 emails):** D1 instant: checklist + what not to buy. D2 day 4: "when it arrives: the first-hour setup." D3 day 8: "the sound was never the gear, it's the settings" → free account.
- **Ends:** account → Funnel 1; no account → newsletter. Affiliate links live on these pages only.

## Funnel 4: Worship guitarist (highest-value ICP)

- **Profile:** plays Sunday services on Helix/HX Stomp; setlist arrives Tuesday. Pages LIVE but Google-gated (authority); Bing/AI carry them meanwhile.
- **Landing (LIVE):** /worship hub + Hillsong/Bethel/Elevation/Brewster/Wickham posts. **Capture (LIVE):** email signup feeding Sunday Setlist.
- **Sequence E (TO WRITE, 3 emails):** E1 instant: "this Sunday's five sounds, ready now." E2 day 4: "eight sounds, one download" → Worship Set Pack $19. E3 day 10: "your whole team, same sounds" → Pro now, Team tier when it ships.
- **Ends:** Set Pack/Pro → PAID; otherwise → Sunday Setlist weekly (their newsletter; already sends Tuesdays).

## Funnel 5: Boss Katana owner (underserved; no competitor ecosystem)

- **Profile:** intermediate player with the best-selling modeling amp. GA4: Katana deep-dive at 41 users and climbing.
- **Landing (LIVE, HOOK TO BUILD):** Boss Katana Deep Dive (7 hidden settings). **Hook to build:** free .tsl starter files for email.
- **Sequence K (TO WRITE, 3 emails):** K1 instant: starter files + the 7 settings. K2 day 3: "make the Katana feel like a tube amp." K3 day 7: "every song, dialed for Katana" → free account.
- **Ends:** account → Funnel 1; no account → newsletter.

## Funnel 6: Post-gift owner (seasonal: Dec 25 - Jan 15)

- **Profile:** just unwrapped a Katana/HX Stomp/Spark. Smart, brand new to it. Highest-leverage moment of the year (see `SEASONAL_CAMPAIGN_CALENDAR.md` C2 Phase D).
- **Landing (TO CREATE by Dec 18):** "Just got a [gear]? Day-one settings" pages per gift-tier product.
- **Hook:** "Day-one sounds in your inbox."
- **Sequence G (TO WRITE, 5 emails, build in November):** G1 instant: three sounds before dinner. G2 day 1: make it sound like the record. G3 day 3: the three mistakes every new owner makes. G4 day 7: your first five downloads → free account. G5 day 10: unlimited, $49/yr.
- **Ends:** PAID or newsletter.

## Funnel 7: Direct newsletter signup (homepage/footer forms)

- **Profile:** liked an article, not ready for an account.
- **Landing (LIVE):** newsletter forms. **Sequence B (BUILT):** B1 instant welcome (live today) → B2 day 5 "saved recipes beat bookmarks" (auto-skipped if account exists).
- **Ends:** account → Funnel 1; otherwise → newsletter.

## Build order (effort vs traffic)

1. **Funnel 2 hook + Sequence C.** Largest existing traffic, zero capture today. One capture component reused across ~36 pages.
2. **Funnel 4 Sequence E.** Highest revenue per subscriber (Set Pack is the only $19 impulse buy on the site) and Sunday Setlist already delivers the weekly habit.
3. **Funnel 3 hook + Sequence D**, then **Funnel 5**.
4. **Funnel 6 pages + Sequence G** in November, live by Dec 18.

All new sequences reuse the existing machinery: add steps to `SEQUENCE_STEPS` in `src/lib/email.ts`, extend the `sequence` check constraint in a follow-up migration, enqueue from the capture endpoint. Suppression rules follow `WELCOME_SEQUENCE.md`: one sequence per address, upsell steps skipped for paying users, unsubscribe halts everything, test-send every new email to daniel.livengood@gmail.com via `/api/cron/email-sequence?test=` before enabling.
