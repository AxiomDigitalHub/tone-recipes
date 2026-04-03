# Fader & Knob — Launch Plan

## Where We Are (April 2, 2026)

**Built:**
- 50 tone recipes with translations for 6 modeler platforms
- 57 blog posts (settings guides, comparison posts, artist tones, buyer's guides)
- 5 news articles
- 38 artist pages with tone bios and signature gear
- 67 gear item pages
- PDF download system with email capture
- Preset download system with 10-free counter
- Google Auth, user tiers, community features (comments, ratings, forum)
- Search Console verified, sitemap submitted, 130+ internal links
- GA4 with key events, Clarity, Contentsquare, Speed Insights

**Traffic:** 54 users in 28 days, almost all direct. 1 page indexed in Google. Zero organic search traffic yet.

**Revenue:** $0. No payment processing. No content gating active.

---

## The Honest Assessment

The site is technically impressive but commercially dormant. We have a content engine with no distribution, a freemium model with no payment processing, and an email capture system with no email service. The product is 90% built and 0% monetized.

The gap isn't features — it's go-to-market. Here's the path.

---

## Phase 1: Get Ready to Make Money (This Week)

### What Daniel Needs to Do

| Task | Time | Why |
|------|------|-----|
| **Sign up for Stripe** | 15 min | Payment processing. Without this, nothing makes money. |
| **Sign up for Resend** | 5 min | Email delivery for PDF downloads + newsletter. resend.com, free tier = 3,000 emails/mo |
| **Get a working Replicate token** | 5 min | AI image generation for blog posts. replicate.com/account/api-tokens |
| **Add all 3 API keys to Vercel env vars** | 5 min | STRIPE_SECRET_KEY, RESEND_API_KEY, REPLICATE_API_TOKEN |
| **Submit 9 URLs for indexing in Search Console** | 10 min | Paste each URL, click "Request Indexing" — list provided below |

### What Claude Builds (no Daniel needed)

| Task | What |
|------|------|
| Stripe checkout integration | Connect pricing page → Stripe checkout → role upgrade |
| Resend email integration | PDF delivery emails + welcome email + newsletter sends |
| Generate 54 remaining AI blog images | Run image batch once token works |
| Newsletter "Tone of the Week" template | Automated weekly email with featured recipe + blog post |

---

## Phase 2: Launch Distribution (Week 1-2)

### Content Cadence Recommendation

**Daily news: No.** Here's why:
- There isn't enough real guitar modeler news to sustain daily publishing
- Firmware updates happen 4-6 times per year per platform
- New gear launches are monthly at best
- Fabricating daily news destroys credibility in a niche community

**What to do instead:**

| Frequency | Content Type | How |
|-----------|-------------|-----|
| **3x/week** | Blog posts | Claude writes, you review headlines. Settings guides, artist tones, and comparison posts perform best. |
| **When it happens** | News articles | Firmware drops, gear launches, industry data. Publish within 24 hours. Claude monitors and drafts. |
| **Weekly (Fridays)** | Newsletter — "Tone of the Week" | 1 featured recipe + 1 blog post + 1 quick tip. Sent to email list. |
| **Daily** | Social sharing | Share one existing recipe or blog post to Reddit, forums, Discord. This is the #1 distribution lever. |

### The Distribution Channels That Matter

**Reddit (highest ROI, free):**
- r/guitarpedals (760K members) — share settings guides, answer tone questions with links
- r/Line6Helix (50K) — share Helix-specific recipes and comparison posts
- r/NeuralDSP (25K) — QC content
- r/ToobAmps (40K) — modeler vs tube content
- r/Guitar (3.7M) — broader reach

**Discord servers:**
- The Gear Page Discord
- Worship Keys + Guitar
- Various modeler-specific servers

**Key rule:** Don't spam links. Answer questions genuinely, and link to your content when it's actually the best answer. One genuine helpful post per day in the right subreddit will do more than 10 link drops.

### Scheduled Tasks for Claude

```
Daily (weekday mornings):
- Check for firmware/gear news from Line 6, Neural DSP, Kemper, Fractal, Boss, IK
- If news found: draft article, notify Daniel for review
- Generate a "Reddit-ready" answer for a common tone question with a link to relevant F&K content

3x/week (Mon, Wed, Fri):
- Write 1 new blog post following the content calendar
- Generate AI hero image for the post
- Add internal links to/from existing content
- Commit and push

Weekly (Friday afternoon):
- Compile "Tone of the Week" newsletter
- Pull the week's best-performing recipe (by page views)
- Include the week's new blog posts
- Queue for send via Resend

Weekly (Sunday night):
- Check Search Console for new query data
- Report which keywords are gaining impressions
- Suggest content optimizations based on the data
```

---

## Phase 3: First Revenue (Week 2-4)

### Revenue Model

**Tier 1 — Free (lead generation)**
- All recipes, all platforms, all content visible
- PDF download with email capture
- 10 free preset downloads

**Tier 2 — Premium ($9/month or $79/year)**
- Unlimited preset downloads
- Unlimited saved recipes
- Ad-free experience
- Priority community support
- "Premium" badge on profile

**Tier 3 — Creator ($15/month)**
- Everything in Premium
- Submit and publish recipes
- Analytics on published recipes
- Creator badge

### Revenue Targets

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Email list | 200 | 1,000 | 5,000 |
| Organic traffic (monthly) | 500 | 5,000 | 20,000 |
| Premium subscribers | 5 | 50 | 200 |
| Monthly revenue | $45 | $450 | $1,800 |

These are conservative. The comparison posts alone ("best modeler under $500") could drive 1,000+ monthly visits once indexed.

### Affiliate Revenue (Passive)

The gear comparison posts and settings guides are natural affiliate content:
- "Best Guitar Modeler Under $500" → Sweetwater/Amazon affiliate links
- "Best FRFR Speakers" → direct product links
- Every gear page → "Buy on Sweetwater" button

FlexOffers integration was started in a prior session. Once activated:
- 4-8% commission on gear purchases
- Average order: $300-500
- 1% conversion rate on affiliate clicks → meaningful passive income at scale

---

## Phase 4: Growth Engine (Month 2-6)

### The Flywheel

```
Content → SEO traffic → Email capture → Newsletter → Return visits → More content engagement → More SEO signals → More traffic
```

Each piece reinforces the others:
1. Blog posts bring organic traffic
2. Recipe PDF downloads capture emails
3. Newsletter brings people back weekly
4. Return visits + engagement improve SEO signals
5. Higher rankings bring more traffic
6. Repeat

### What Makes This Win

**The moat is the recipe database.** Anyone can write a blog post about "how to get the SRV tone." But a structured, platform-translated recipe with exact block names, knob positions, and downloadable presets — that's a product, not a blog post. The combination of editorial content + structured data + platform translations is unique in this space.

**The comparison posts are the tip of the spear.** "Helix vs Quad Cortex vs Kemper" is the #1 search a guitarist makes before a $1,500 purchase. If F&K owns that search result, everything downstream follows — they trust the site, explore recipes, capture email, convert to premium.

---

## URLs to Submit for Indexing (Daniel's 10-minute task)

Go to Search Console → URL Inspection → paste each, click "Request Indexing":

1. https://faderandknob.com/blog/helix-vs-quad-cortex-vs-kemper
2. https://faderandknob.com/blog/best-modeler-under-500
3. https://faderandknob.com/blog/best-frfr-speakers-for-modelers
4. https://faderandknob.com/blog/line-6-helix-family-compared
5. https://faderandknob.com/blog/tube-screamer-settings-guide
6. https://faderandknob.com/blog/signal-chain-order-guide
7. https://faderandknob.com/blog/jcm800-settings-guide
8. https://faderandknob.com/blog/impulse-response-ir-guide
9. https://faderandknob.com/blog/guitar-eq-guide

---

## Tomorrow Night's Agenda (Daniel + Claude Working Session)

| Priority | Task | Who | Time |
|----------|------|-----|------|
| 1 | Set up Stripe account + add keys to Vercel | Daniel | 15 min |
| 2 | Claude builds Stripe checkout flow | Claude | 30 min |
| 3 | Set up Resend account + add key to Vercel | Daniel | 5 min |
| 4 | Claude builds email delivery + newsletter system | Claude | 30 min |
| 5 | Get fresh Replicate token + add to Vercel | Daniel | 5 min |
| 6 | Claude generates 54 blog images | Claude | 15 min (background) |
| 7 | Submit 9 URLs for Search Console indexing | Daniel | 10 min |
| 8 | Set up Claude scheduled tasks for content automation | Together | 15 min |
| 9 | Write first Reddit post sharing the Helix vs QC vs Kemper comparison | Daniel | 10 min |
| 10 | Listen to 3-5 patches on your modeler | Daniel | Your pace |

**Total Daniel time: ~1 hour of account setup + 10 min Reddit + patches at your leisure**
**Total Claude time: ~1.5 hours of building + background image generation**

---

## The One Thing That Matters Most

**Distribution > Features.**

The site is ready. The content is strong. The freemium model is smart. What's missing is people seeing it. One genuine, helpful Reddit post in r/Line6Helix sharing the "Helix vs Quad Cortex vs Kemper" comparison — with a real perspective, not a link drop — could bring 500 visitors in a day. That's more than the site has had in its entire existence.

Features don't matter if nobody sees them. Tomorrow night we wire up payments and email. Then we start telling people about it.
