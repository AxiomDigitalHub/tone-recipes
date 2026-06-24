# Pricing Model — Final Spec

**Created:** 2026-06-15
**Status:** Locked design, ready to implement on the word. A few values flagged **[CONFIRM]** still need a final yes (annual amounts, grandfathering).
**Supersedes:** the current single-tier "Pass" model on `/pricing` (Free + Pass $39/yr·$4.99/mo).

## Principles (why it's shaped this way)
1. **Tiers differ by *kind* of value, not quantity.** A download cap on a *paid* tier punishes new users during exploration and recreates the "nothing to upgrade for" trap that killed the old $7/$12 tiers. So the paid entry tier is *unlimited on the core action*; higher tiers add different value (Set Packs, the AI tool, commercial use, team collaboration).
2. **Plan names are audience-neutral.** One billing construct serves worship, metal, blues, classic rock. Names never sound churchy or genre-specific. The worship framing lives in the `/worship` hub and the Set Packs, never in plan labels.
3. **"Team" not "Church."** Churches are the prime Team buyer, but the neutral name also captures cover bands, music schools/teachers, and multi-guitarist projects. Market the church angle inside `/worship`.

## The tiers

### Individual ladder (the main pricing row)
| Feature | **Free — $0** | **Pass — $4.99/mo** | **Pro — $7.99/mo** |
|---|---|---|---|
| Browse every recipe, every platform | ✓ | ✓ | ✓ |
| Saved recipes | unlimited | unlimited | unlimited |
| Forum & comments | ✓ | ✓ | ✓ |
| Preset downloads (.hlx/.tsl…) | **5 / month** | **Unlimited** | Unlimited |
| Recipe PDFs | **10 / month** | **Unlimited** | Unlimited |
| Early access (new recipes 1 wk early) | — | ✓ | ✓ |
| Set Packs | buy à la carte ($19) | buy à la carte | **All included** (while subscribed) |
| ToneTrace (AI tool, at launch) | — | — | **Priority access** |
| Commercial-use license | — | — | ✓ |
| **Annual price** | — | **$49/yr** [CONFIRM] | **$79/yr** [CONFIRM] |

Upgrade logic: **Free→Pass** = "stop counting downloads." **Pass→Pro** = "Set Packs are bundled" — one Set Pack is $19, so anyone who'd buy even one a year nets out ahead at $7.99.

### Team (separate offering, below the individual row — like the Set Packs section)
Not a 4th column in the individual comparison; its own card so it doesn't clutter the individual decision.

| | **Team — $25/mo · $249/yr** [CONFIRM] |
|---|---|
| Everything in **Pro**, for | **up to 5 seats** |
| Shared team preset library | one workspace; lead builds, team pulls the same presets |
| Shared setlists / Setlist Mapper | one person maps the setlist → whole team sees it |
| All Set Packs | included for the whole team |
| Centralized billing | leader pays once |
| Seat management / admin | add/remove members, usage view |
| **Later (post-validation):** Planning Center sync ("pull the setlist → matching presets"), live shared workspace | roadmap |

**Build note:** Team is highest-value *and* highest-effort (multi-seat auth, shared resources, admin). Ship **MVP Team** first = 5 seats + all Set Packs + shared setlist doc + central billing + seat admin. Layer Planning Center sync + live shared workspace later. Do **not** gate launch on the hard parts. Team can also ship *after* Free/Pass/Pro if needed.

## Cleanup required (current page makes promises the new model breaks)
- **Remove "Members Discord"** everywhere — there is no Discord. (`src/app/pricing/page.tsx` JSON-LD desc + FAQ; grep repo-wide for "discord".)
- **Remove the "Tone Adapter" perk wording** or rename to ToneTrace and move it to Pro-only.
- **Drop "30% off Set Packs"** (replaced by "Set Packs included" on Pro/Team).
- **Grandfathering [CONFIRM]:** the live FAQ promises free users before 2026-06-09 keep unlimited downloads forever. Recommend **honoring it** (it's a published trust promise) via a one-time `legacy_unlimited` flag on those profiles that bypasses the Free download/PDF caps. Alternative: retire it with an email + a discounted upgrade offer. Pick one.

## Implementation map (what changes in code)

**Roles** (`profiles.role`, DB check constraint — currently allows `free`/`pass`/`admin` via migration `019`):
- New constraint values: `free`, `pass`, `pro`, `team`, `admin`. New migration (e.g. `021_pricing_tiers.sql`) to widen `profiles_role_check`, add `team_id`/seat columns for Team, and a `legacy_unlimited boolean` flag.

**Entitlements** (mirror the `tone_chat_usage` metering pattern from migration `020`):
- New usage tables/counters for **monthly preset downloads** and **monthly PDF generations**, with an increment-and-check function. Free = 5 dl / 10 pdf per month; Pass/Pro/Team = unlimited (skip the check). Gate the download route(s) and PDF route(s) on role + monthly count.

**Stripe** (extend `scripts/stripe-create-pass-product.ts` → create Pro + Team too):
- Products: Pass, Pro, Team. Prices: monthly + annual each (6 prices total).
- Env vars: `STRIPE_PASS_PRICE_ID_MONTHLY/ANNUAL` (exist), add `STRIPE_PRO_PRICE_ID_MONTHLY/ANNUAL`, `STRIPE_TEAM_PRICE_ID_MONTHLY/ANNUAL`.

**Webhook** (`src/app/api/webhooks/stripe/route.ts`):
- Map Stripe price → role (pass/pro/team) on `checkout.session.completed`; downgrade to `free` on cancellation. Team also provisions/decrements seats.

**Checkout** (`src/app/api/checkout/route.ts`): accept a `tier` + `cadence` param → resolve to the right price ID.

**UI** (`src/app/pricing/page.tsx` + `src/components/pricing/`): Free/Pass/Pro comparison row with annual/monthly toggle, Team card below, rewritten FAQ + JSON-LD (3 products / multi-offer), Discord removed.

## Open decisions before Stripe setup
1. **Annual amounts** — proposed $49 (Pass) / $79 (Pro) / $249 (Team). Alternative: keep the $39 Pass anchor, $69 Pro. [CONFIRM]
2. **Grandfathering** — honor (recommended) vs retire. [CONFIRM]
3. **Team now or later** — ship with Free/Pass/Pro, or fast-follow. [CONFIRM]
