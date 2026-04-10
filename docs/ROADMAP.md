# Fader & Knob — Core Service Roadmap

**Last updated:** April 9, 2026
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

## MVP Definition — What Must Work for "Operational"

A customer can sign up, find a recipe, trust it, download a working preset, and pay us money. Every recipe loads. Every preset works. Every checkout completes.

### ✅ Already Working
- Recipe browse + search + detail pages (50 recipes)
- Helix .hlx preset generation (tested on real Helix LT)
- Boss Katana .tsl preset generation
- Google OAuth + Supabase auth + user dashboard
- Security hardening (webhook verification, rate limiting, admin auth, headers)
- AI Transparency page + footer disclosure
- Pricing page with new tier structure ($7/$12)
- Worship Set Pack with Setlist Mapper
- Signal chain visualization (animated nodes with cable)
- 60+ blog posts across 5 editorial voices

### 🔴 Blocking "Operational" (Must Fix This Week)
- [ ] **Test Stripe checkout end-to-end with real test card** — we set the keys but haven't verified a dollar can flow through the system
- [ ] **Run Supabase migration 015** — the `stripe_customer_id` and `stripe_subscription_id` columns don't exist on the profiles table yet, which means webhook writes will fail
- [ ] **Regenerate Replicate API token and run blog image generation** — 54 blog posts have no hero images, making the site look unfinished
- [ ] **Verify all 50 recipes actually load and display correctly** — spot-check after all the platform filter changes

### 🟠 Critical Gaps to Trust (Week 2)
- [ ] **Audio previews on recipe pages** — the single biggest trust gap. A guitarist can't tell if they want the preset without hearing it. Recording standard: same guitar, DI-only, 10-15 seconds. Host on Cloudflare R2 (free tier). MVP: just an audio element + play button. Start with the top 10 recipes.
- [ ] **Email welcome sequence** — a customer who signs up should get confirmation + 5-day onboarding drip. Use Buttondown ($9/mo) or Resend (transactional).
- [ ] **Error handling on download failures** — what happens if the preset generation throws? Right now it probably 500s.

### 🟡 Catalog Depth (Weeks 2-4)
The core service is weak at 50 recipes. Each paying customer will exhaust the catalog in a single session. Target: **100 recipes** before heavy marketing.

- [ ] 20 worship recipes (highest-value ICP per research — Planning Center integration deferred)
- [ ] 15 classic rock recipes
- [ ] 10 blues recipes
- [ ] 5 country recipes

Every new recipe must include:
- Verified signal chain
- Helix translation (tested)
- Katana translation (tested)
- At minimum: text description of the tone

### 🟢 Nice To Have (Weeks 4-8)
Things that make the service better but aren't required for "operational":
- Set Pack expansion (Classic Rock, 90s)
- "Helix vs Quad Cortex" comparison page
- Pillar page: "Complete Guide to Helix Tone"
- Affiliate program setup (Sweetwater, zZounds, Plugin Boutique)
- Newsletter "Sunday Setlist" concept
- 10 additional blog posts per week via automation

---

## Post-MVP: Growth Engine

Only start this once the MVP is verified operational — customer can sign up, pay, and get value.

### Growth Loops
1. **SEO content** — 5 blog posts/week, pillar pages, long-tail song/artist queries
2. **Email list** — "Sunday Setlist" weekly email to worship guitarists
3. **YouTube** — faceless "60-Second Tone Recipe" Shorts with animated signal chain
4. **Community** — forum moderation, tone challenges, user preset uploads
5. **Affiliate revenue** — add affiliate links to gear database

### Revenue Targets (Core Service Only — Does Not Include ToneTrace)
| Timeframe | MRR Target | Drivers |
|-----------|-----------|---------|
| Month 3 | $200-500 | First paying subscribers + affiliates |
| Month 6 | $800-1,500 | Tone Pass + Set Packs + 1,000 email subs |
| Month 12 | $2,000-4,000 | 200 recipes + worship vertical + 10K emails |

---

## Core Service Principles

1. **The database is the product.** Quality over quantity — but not too little quantity.
2. **Every preset must work.** We test on real hardware before publishing.
3. **The volunteer guitarist is our customer.** $500-700 budget, setlist Tuesday, play Sunday.
4. **Recipe, not preset.** We teach the *why*, not just the *what*.
5. **Human-verified, AI-powered.** Transparent about AI use, grounded in real testing.

---

## Research Library

All strategic research in `docs/research/`. Roadmap decisions reference these docs.

### Business Strategy (13 docs)
Competitive teardown, SEO, monetization, blog images, set patches, AI transparency, worship market, audio preview system, email marketing, YouTube, affiliates, community, mobile.

### Worship Guitar Deep Dive (7 docs)
70s-90s history, 00s-20s history, 15 guitarist rigs, Lincoln Brewster, production notes, cultural history, lesser-known scenes.

### Product Vision
ToneTrace project brief (`ToneTrace_ProjectBrief.docx`)

---

## What This Roadmap Does NOT Include

- **ToneTrace** — separate product, separate roadmap (`TONETRACE_ROADMAP.md`)
- **Mobile app** — PWA can come later; not required for operational
- **Multi-platform exports** (Fractal, QC, Kemper, TONEX) — Helix + Katana is enough for MVP
- **Planning Center integration** — huge differentiator but not required for MVP
- **Generative AI preset creation** — that's ToneTrace territory

---

*This document is the source of truth for the core service. Update it as MVP items complete.*
