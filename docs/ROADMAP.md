# Fader & Knob — Core Service Roadmap

**Last updated:** April 13, 2026
**Scope:** The core faderandknob.com service. *ToneTrace has its own roadmap at `TONETRACE_ROADMAP.md`.*

---

## What "Fully Operational" Means

The core service is a tone recipe database and preset shop. A guitarist can:

1. **Discover** a tone — find the recipe for a song they want to play
2. **Trust** the recipe — hear it, understand it, believe it works
3. **Download** a working preset file for their modeler (Helix, Katana)
4. **Pay** if they want premium access (unlimited downloads, Set Packs)
5. **Come back** when new recipes are released

Everything else is growth strategy. These five things are the service.

---

## Current State (April 13, 2026)

### What's Working ✅

**Core product:**
- 50 tone recipes, all with 6 platform translations (Helix, QC, TONEX, Katana, Kemper, Fractal)
- 116+ blog posts across 10 editorial voices with local hero images
- 10 downloadable Helix .hlx presets (Volume Pedal, dual cab, proper HighCut/ER)
- Boss Katana .tsl preset generation
- Signal chain visualization (animated nodes)
- Recipe browse + search + detail pages

**Auth & payments:**
- ✅ Google OAuth + Supabase auth + user dashboard
- ✅ Stripe checkout (test mode verified, payment flows work)
- ✅ Webhook handles subscription lifecycle (upgrade/downgrade)
- ✅ `super_admin` role with protected `/dashboard/admin` route
- ✅ Admin dashboard with live user metrics, content counts, recent sign-ups

**Security (bug audit completed April 12):**
- ✅ AdminGuard with role check (super_admin/admin only)
- ✅ DownloadPatchButton auth-gated (premium/creator/admin)
- ✅ Forum reply_count atomic increment via Supabase RPC
- ✅ Stripe webhook userId fallback (lookup by stripe_customer_id)
- ✅ Email templates HTML-escaped (XSS prevention)
- ✅ PDF download works regardless of newsletter opt-in
- ✅ Geo-blocking (OFAC sanctioned countries)
- ✅ Rate limiting (in-memory, sufficient for current scale)

**Content pipeline (fully automated):**
- ✅ Daily content production task — 5 posts/day with writer personality (MBTI, enneagram, formativeBands)
- ✅ Daily news check — 13 modeler brands + 11 pedal brands monitored
- ✅ Moodboard-driven image generation — 9 visual styles, 10 authors mapped
- ✅ `generate-blog-images.ts` rewritten for Flux 2 Pro + moodboard system
- ✅ SEO/AEO content calendar with 48+ prioritized topics

**Preset quality (fixed April 12):**
- ✅ All 50 Helix recipe cabs: dual mic (57 Dynamic + 121 Ribbon), LowCut 80, HighCut 12000, 60% Early Reflections
- ✅ Volume Pedal at position 1 on all 50 Helix chains
- ✅ Enter Sandman reference preset verified on real Helix LT hardware
- ✅ 10 .hlx preset files batch-processed and shipping

**Landing page:**
- ✅ v3 (orbital signal arcs) — locked, best iteration
- ✅ v4 (Antigravity-style dot matrix) — serial icon cycling, path-sampled, dark theme, per-icon category colors, Halton scatter, mouse gravity
- ✅ Homepage: clean hero (headline → chain → CTA), no cable routing

**Writer system:**
- ✅ 10 writers with full identity: birthYear, formativeBands, favoriteSongs, MBTI, enneagram
- ✅ All writers assigned to moodboards (no orphans)
- ✅ All 116+ blog posts have author_slug (no unattributed content)

**Analytics:**
- 109 GA users in first 15 days (21 from organic search)
- 29 sign-ups (26.6% conversion — strong)
- 52 pricing page views (buying intent)
- Thunderstruck is #1 recipe by views

### 🔴 Blocking "Operational"

- [ ] **Switch Stripe to live keys** — test mode works, need to flip `sk_test_` → `sk_live_`
- [ ] **Customer Portal (Click-to-Cancel)** — FTC requirement before accepting real payments
- [ ] **Audio previews on top 10 recipes** — biggest trust gap. Can't tell if you want the preset without hearing it.

### 🟠 Critical Gaps (Next 2 Weeks)

- [ ] **Email welcome sequence** — 29 sign-ups with no follow-up. Resend is configured for transactional; need Cloudflare Email Routing for inbound.
- [ ] **Retention fix** — 1.7% week-over-week retention on the March 29 cohort. Need the newsletter ("Tone of the Week") and audio previews to give people a reason to come back.
- [ ] **Budget brand recipe support** — Valeton GP-200 presets are technically viable (PRSTDecoder exists, JSON round-trip proven). Harley Benton DNAfx GiT also viable (open-source editor). Zero competition in these markets.

### 🟡 Catalog Depth (Weeks 2-4)

50 recipes is thin. Target: **100 recipes** before marketing push.

- [ ] 20 worship recipes (highest-value ICP)
- [ ] 15 classic rock recipes
- [ ] 10 blues recipes
- [ ] 5 country recipes

### 🟢 Nice To Have (Parked)

- Landing page v3 → promote to `/` (currently at `/v3`, noindex)
- Card stack for modelers (React Bits card-swap) — blocked on platform hero art
- Signal chain as hero background element
- Set Pack expansion (Classic Rock, 90s)
- Fractal Axe-FX preset support (blocked — requires hardware or partnership)
- Valeton GP-200 preset generation (tooling exists, need effect code mapping with hardware)
- Harley Benton DNAfx GiT presets (open-source editor available)
- Planning Center integration for worship setlists

---

## Platform Preset Viability

| Platform | Format | Status |
|---|---|---|
| **Line 6 Helix** | `.hlx` (JSON) | ✅ Shipping — 10 presets, proven on hardware |
| **Boss Katana** | `.tsl` (XML) | ✅ Generator exists |
| **Line 6 POD Go** | `.pgp` (JSON) | Likely — fork Helix generator |
| **Boss GT-1000/GX-100** | `.tsl` (XML) | Likely — same Boss Tone Studio |
| **Quad Cortex** | `.json` | Likely — generator stub exists |
| **Valeton GP-200** | `.prst` | Maybe — PRSTDecoder works, need effect code map |
| **Harley Benton DNAfx GiT** | `.bhb`/`.phb` | Maybe — open-source editor available |
| **Fractal Axe-FX** | `.syx` (binary) | ❌ Blocked — proprietary, requires hardware |
| **Kemper** | `.kipr` | ❌ Blocked — profiles are amp captures |
| **TONEX** | Cloud | ❌ Blocked — AI captures, no file format |

---

## Post-MVP: Growth Engine

Only start once MVP is verified operational.

### Growth Loops
1. **SEO content** — 5 blog posts/week (automated), pillar pages, long-tail queries
2. **Email list** — "Tone of the Week" weekly email
3. **YouTube** — faceless "60-Second Tone Recipe" Shorts
4. **Community** — forum moderation, tone challenges, user preset uploads
5. **Affiliate revenue** — gear database links (Sweetwater, zZounds, Plugin Boutique)
6. **Budget brand expansion** — Valeton/Harley Benton presets (zero competition)

### Revenue Targets
| Timeframe | MRR Target | Drivers |
|-----------|-----------|---------|
| Month 3 | $200-500 | First paying subscribers + affiliates |
| Month 6 | $800-1,500 | Tone Pass + Set Packs + 1,000 email subs |
| Month 12 | $2,000-4,000 | 200 recipes + worship vertical + 10K emails |

---

## Research Library

All strategic research in `docs/research/`. Key docs:
- `IMAGE_API_ALTERNATIVES.md` — Flux 2 Pro + Google AI Studio + fal.ai cost stack
- `EMAIL_INFRASTRUCTURE.md` — Resend (outbound) + Cloudflare Email Routing (inbound)
- `CONTENT_PIPELINE_UPDATE.md` — moodboard system + image generation handoff
- `NICE_TO_HAVE_IDEAS.md` — React Bits card-swap, signal-chain-as-background
- `news-strategy.md` — 13 modeler brands + 11 pedal brands + editorial rules
- `TONE_ENGINEERING_BIBLE.md` — preset quality standards
- 7 worship guitar deep-dive docs (70s-90s, 00s-20s, rigs, Lincoln Brewster, etc.)

---

*This document is the source of truth for the core service. Updated April 13, 2026.*
