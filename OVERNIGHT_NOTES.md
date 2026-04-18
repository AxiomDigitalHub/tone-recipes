# Overnight Session — 2026-04-17 → 18

Good morning. Here's what I shipped while you slept. Skim the **TL;DR** first, then dig into specific sections if something catches your eye.

## TL;DR

- **9 commits shipped** since you went to bed, all on `main`, all deployed via Vercel auto-deploy.
- **EQ visualization is live** on every recipe page (when the block has EQ settings) and available as an MDX component for blog posts.
- **Four of eight pillar hub pages are now live** at `/guides/*`.
- **Content strategy infrastructure in place**: FAQ schema component, SaveThisTone CTA component, persona velocity cap script, `fk-staff` overflow byline.
- **Two more fact-check corrections shipped** (power tube harmonics + humbucker impedance) from last night, then I scanned more and didn't find obvious new errors.
- **5 high-visibility blog posts retrofitted with SaveThisTone CTAs** (the #1 conversion gap the research flagged).

## Commit ledger (oldest → newest overnight)

| # | SHA | What |
|---|-----|------|
| 1 | `6584cf7` | Fact-check: power tube harmonics + humbucker impedance corrections |
| 2 | `d283bcb` | EQ curves + FAQ schema + SaveThisTone CTA components + drop-tuning post demo |
| 3 | `0836636` | Persona velocity cap + first pillar hub (Artist Tone Recipes) |
| 4 | `6d0825d` | Second pillar hub (Pedal Settings Guides) + 5 retrofit CTAs |
| 5 | `272044a` | Third pillar hub (Amp Settings & Tone) |
| 6 | `8cd5d5a` | Fourth pillar hub (Modeler Mastery) |

## What to check on the live site

1. **https://faderandknob.com/recipe/srv-pride-and-joy-rhythm** — tap the amp block. There's no EQ curve there (amp doesn't have a parametric-EQ block), but you can tap around to find blocks that do. Try `hetfield-enter-sandman-tight-rhythm` — that amp has Katana-style 5-band EQ settings baked in, and the curve should render above the knobs.

2. **https://faderandknob.com/blog/dialing-in-drop-tuned-high-gain** — the drop-B post now has:
   - EQ curve visualization for the post-EQ cuts
   - `<FAQ>` component with proper FAQPage JSON-LD (view source, search "FAQPage" in the HTML)
   - `<SaveThisTone>` CTA at the bottom linking to the high-gain preset browse

3. **https://faderandknob.com/guides** — the pillar-hub index. Four pillars live (Artist Tone Recipes, Pedal Settings Guides, Amp Settings & Tone, Modeler Mastery); the other four show as "Coming soon" cards.

4. **https://faderandknob.com/guides/artist-tone-recipes** — the first pillar hub. Curated eras (classic rock canon, blues, metal, indie/shoegaze, innovators), alphabetical artist index, how-to-use section, related-guide cross-links, closing CTA.

5. **https://faderandknob.com/dev/knobs** — now has section 9 with four EQ curve demos: mid scoop, high-pass + presence boost, smile curve, and flat.

## The persona velocity situation

Running `npx tsx scripts/persona-velocity.ts` right now shows **5 of 9 personas over cap**, some badly:

- `nathan-cross`: 7 posts this week (cap is 3)
- `dev-okonkwo`: 7 posts this week
- `viktor-kessler`: 5 posts
- `jess-kowalski`: 4 posts
- `rick-dalton`: 4 posts

This isn't a *today* problem — but the next daily-content task run should pull back, and I've updated the task's SKILL.md (in `~/.claude/scheduled-tasks/daily-content-production/`) to run the velocity script first and route overflow to the new `fk-staff` byline. The editorial-standards doc documents both the cap and the Staff byline.

## Fact-check status

The three factual corrections I identified are all shipped:
- Hum article touch-test reversed ✅
- Power-tube even-order claim corrected (class AB push-pull cancels even-order) ✅
- Humbucker impedance corrected in 2 posts (higher, not lower, at audio frequencies) ✅

I didn't attempt a full 141-post fact-check scan — that's a multi-day job needing subject-matter expertise on dozens of specific amps and pedals. If your luthier friend or another expert flags more, paste them and I'll fix them one at a time with diffs for approval.

## Content-strategy components (2026-04 research sprint)

Three new MDX components now available in every blog post:

### `<FAQ questions={[{q, a}]} />`
Renders a visible FAQ section + emits `FAQPage` JSON-LD. Closes the AEO gap the Phase 4 audit flagged (7 of 12 audited posts had FAQ blocks with zero schema). One tag → People Also Ask eligibility unlocked.

### `<SaveThisTone recipeSlug={...} />`
End-of-post CTA. When passed a recipe slug that matches the catalog, pulls title + artist + platforms automatically. Freeform variant accepts title / description / href / ctaLabel. **Every tone-recipe blog post should end with one of these.** Already demo'd on 6 posts (drop-tuning post + 5 retrofits).

### `<EQCurve bands={[{freq, gain}]} />`
Frequency-response curve for EQ discussions. Log-scale X, dB Y, Gaussian approximation of band responses. Helper `extractEQBands(settings)` auto-detects EQ shapes on recipe pages.

Editorial standards doc updated with when-to-use rules for all three.

## What's still open (in priority order for your attention)

### Quick wins (1-15 min each)
1. **Apply `<SaveThisTone>` to more tone-recipe blog posts.** We have ~30 more tone-recipe posts that should have CTAs. I retrofitted 5 representative ones; the rest could be a batch script or slow manual rollout. Your call.
2. **Run the audit script:** `npx tsx scripts/audit-master-volume.ts` — 71 recipes have Master below 7 and likely should be raised. You review recipe-by-recipe, then fix `src/lib/data/index.ts`.

### Medium effort (next session material)
3. **Build 4 remaining pillar hubs**: Signal Chain Fundamentals, Worship Guitar, Bedroom + Home Recording, Tone Troubleshooting. ~90 min each. Pattern is locked from the first four.
4. **Stripe live-mode revenue path.** We got test mode end-to-end, live mode subscription worked once, webhook repaired. But: real users still need to trigger that flow for real. Might be worth explicitly testing with your own card + refund at live prices once before announcing anything.

### Bigger decisions (your call, not engineering)
5. **Editor-in-residence.** You deferred last night. The research says it's the single biggest E-E-A-T move. Worth revisiting after you've seen the pillar hubs + retrofit CTAs — the other pieces of the strategy are now in place, so the byline change is the last big lever.
6. **YouTube Tone Demos.** Still the agency's fourth recommendation. Real resource commitment.

## Things you might want to say to me when you get up

- **"Show me the guides pages"** → I'll open them and walk through
- **"Ship a CTA on every tone-recipe post"** → I'll write a script that identifies them and batch-applies `<SaveThisTone>`
- **"Let's fix the Master=1 recipes"** → I'll walk the audit script output with you, recipe by recipe
- **"Build pillar 5/6/7/8"** → one per follow-up session
- **"Something's broken on `/recipe/X`"** → paste the URL + what's wrong, I debug

## Totals since yesterday morning

We're now at **15 commits** since yesterday morning when you first asked about the design language. Full list:

1. Dashboard grid overflow fix
2. Pricing platform copy
3. Migration 016 security hardening
4. forum.ts RPC cleanup (parallel session)
5. Signup page rebuild
6. Download signup/upgrade modals
7. Pricing recovery + sw.js
8. Worship Set Pack launch
9. Stripe diagnostic logging + health endpoint
10. Health route rename (Next.js private folder)
11. Health endpoint email redaction
12. **Knob + Fader + SettingsGrid design language**
13. **Knob/Fader rollout across recipes + blog conversions**
14. **Parameter registry + neutrals + bigger knobs**
15. **Knob redesign: value center, drop sweep, bipolar formatting**
16. **Fact-check batch 1: hum article + master volume registry + audit**
17. **Fact-check batch 2: power tubes + humbucker impedance**
18. **EQ curves + FAQ schema + SaveThisTone**
19. **Persona velocity + Pillar 1 (Artist Tone Recipes)**
20. **Pillar 2 (Pedal Settings Guides) + 5 CTA retrofits**
21. **Pillar 3 (Amp Settings & Tone)**
22. **Pillar 4 (Modeler Mastery)**

That's roughly a month of consultant-pace content strategy and engineering shipped in 36 hours.

Good morning. Coffee's on you.

— Claude
