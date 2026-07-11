# Overnight Session — 2026-07-10 → 11

Good morning. Skim the TL;DR, then the decisions queue.
(Previous overnight report from 2026-07-07→08 is in git history at `1792d39^` and earlier.)

## TL;DR

- **Every downloaded Helix preset was silently losing its reverb pre-delay.** The generator
  force-cased the param to `PreDelay`, but 18 of 21 models want `Predelay` — HX Edit drops
  mismatched keys without a word. Fixed with model-aware casing, corpus-verified (the 3 VIC
  "Dyn" reverbs are the real exceptions), and a permanent verify script now lives in
  `scripts/verify-predelay-fix.ts`. Generator bug #3 (empty-dsp1 output routing, corpus
  says 256/256 use `1`, we emitted `0`) is also fixed and verified across all 190 recipes.
- **Canonical URLs now emit on every major page type.** Home, /blog + posts, /news + posts,
  /pricing, /platforms had none — Google was picking its own during the indexing recovery.
  Verified: exactly one canonical per page type; `/news?category=` folds into `/news`.
- **33 factual errors fixed across 8 more high-traffic posts** (second rotation of the
  fact-pass). Two fabricated products found and replaced. The AC30 post's "Class A" physics
  and the Jubilee post's Slash/Appetite myth are gone. The Edge delay post: zero errors.
- **The S1–S3 worship posts were brought to cluster spec** — the morning drafts lacked the
  required snapshot layouts and had persona-mismatched bylines (a never-gigged bedroom
  producer and a QC player on worship/Helix posts). Rewritten, re-bylined, verified against
  the shipped recipes. "Paul Hislop" → David Hislop in the Bethel hub.
- **You asked about the Sign out in the header (mid-session) — done.** It's now an avatar
  disclosure menu (name/email, Dashboard, Sign out) instead of a top-level nav item one
  misclick from the avatar. Browser-verified: Escape/click-outside/focus return, mobile fit,
  end-to-end sign out.
- **News:** Blackstar Beam Solo native NAM post live. FM9 12.00-final was deliberately
  skipped — the 07-08 post already covers it (the agent caught the dupe).
- All gates green at every step: tsc 0 errors · build 1,217 pages · audit 190 recipes,
  0 errors · MDX 364 clean · deploy run for the first batch confirmed **success** (the
  predelay/canonical/dsp1 commits are live; the content + header batch pushed after).

## Commit ledger (overnight, oldest → newest)

| SHA | What |
|---|---|
| `89d8125` | Predelay fix: model-aware `Predelay`/`PreDelay` casing + verify script |
| `e55ade7` | Canonicals: home, blog, news, pricing, platforms (7 page types) |
| `1792d39` | Empty-dsp1 `outputA.@output` → 1 (corpus-canonical), all 190 recipes verified |
| `0034e75` | Header: Sign out moved into avatar disclosure menu (your mid-session ask) |
| `67fc136` | Fact-check sweep: 33 corrections across 8 posts |
| `e4636cd` | Worship S1–S3 rewritten to cluster spec + re-bylined + Hislop fix |
| `323f0d7` | News: Blackstar Beam Solo native NAM A2 |

## What to review on the live site

1. **Header account menu** (signed in) — the thing you flagged. Avatar → menu.
2. `/blog/goodness-of-god-guitar-tone-helix` and `/blog/way-maker-guitar-tone-helix` —
   now with verse/chorus/bridge snapshot tables.
3. `/blog/vox-ac30-settings-guide` — the heaviest fact-check rewrite (Class A physics,
   phantom knob removed).
4. Download any recipe with a reverb pre-delay (e.g. SRV Pride and Joy) and load it in
   HX Edit — the pre-delay now actually arrives.

## Morning decisions queue (yours)

1. **Generator bug #2 — surveyed, NOT fixed (deliberate).** Cab names resolve to legacy
   single-mic `HD2_Cab*` models, so recipes authoring Mic/Position lose those params
   silently (dual-mic recipes are fine — auto-promoted to WithPan). The fix changes the
   default cab block type on every generated preset, so it needs your call + a QC pass.
   Corpus and affected-recipe survey notes are in this file's history and the code comments.
2. **The other session's work is still uncommitted** (12 recipes in `src/lib/data/index.ts`,
   the Stripe SITE_URL fix in `constants.ts` + 3 API routes, `docs/ai-sov-runs/`). I worked
   around it all night per the no-clobber rule. It needs committing from that session —
   the regenerated `RECIPE_AUDIT_REPORT.md` (190 recipes) belongs with it.
3. **GA4 key events** — star `signup_start` / `checkout_complete` / `upgrade_prompt_*` when
   they appear under Admin → Events. Trust the account name (daniel.livengood@gmail.com),
   not the /u/N/ index.
4. **Standing:** Vercel project deletion + billing cancel ~7/14; GH cron 200-check Tue 7/14.
5. Optional: an /experiment log entry for the overnight batch (the other session already
   logged the daytime run; I didn't double-post).

## Loose ends / hygiene

- Untracked files I left alone (not mine): `docs/index-health-log.md` (scheduled task's
  log — its 07-13 run will check whether the worship posts got indexed),
  `docs/outreach-drafts.md` (outreach skill output, for you to post manually),
  `scripts/animate-frame.ts` modification (DBBV Veo flag, another session's work).
- Fact-pass meta-finding: for two wrong claims, Google's top confirmation was
  **faderandknob.com itself** — our errors echo back through search. The rotation continues
  to be worth it; next tier is queued in the calendar.
- Dev server was run for header verification and stopped. Demo-user localStorage testing
  works (`tone-recipes-demo-user`) since local env has no Supabase keys.
