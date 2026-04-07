# Email Marketing Strategy for Fader & Knob

> Research compiled April 2026. faderandknob.com — 50 tone recipes, 60+ blog posts, Next.js.

---

## 1. ESP Comparison for Our Size

### Pricing Matrix (monthly cost, USD)

| ESP | Free Tier | 1K subs | 5K subs | 10K subs | 50K subs |
|-----|-----------|---------|---------|----------|----------|
| **Buttondown** | 100 subs | $9 | ~$19 | $29 | ~$79 |
| **Beehiiv** | 2,500 subs | $43 (Scale) | $69 (Scale) | ~$96 (Max) | Custom |
| **Kit (ConvertKit)** | 10K subs (limited) | $39 (Creator) | $89 | $139 | ~$300+ |
| **Mailchimp** | 500 subs / 1K emails | $75 (Essentials) | $75-100 | $110-135 | $350+ (Premium) |
| **Resend** | 1K contacts / 3K transactional | $40 (Pro Marketing) | $40 | Custom | Custom |
| **Loops** | 1K subs / 4K sends | $79 | ~$89 | $99 | High |

### Feature Comparison

**Buttondown**
- Best for: Developer-friendly markdown newsletters with clean API
- API: REST API on all plans including free. API-first design — everything in the UI is available via API
- Automations: Basic sequences, tag-based flows
- Deliverability: Good; small scale means less spam reputation risk
- Next.js fit: Excellent. Simple REST API, easy to integrate subscribe forms
- Standout: Markdown-native editor, 100% revenue on paid subscriptions (no cut), GDPR-compliant by default, multiple newsletters on one account
- Weakness: Smaller ecosystem, limited analytics compared to larger players

**Beehiiv**
- Best for: Newsletter-first businesses focused on growth
- API: Full API access even on free tier
- Automations: Sequences, referral programs, recommendation networks
- Deliverability: Strong; purpose-built for newsletter delivery
- Next.js fit: Good API, though more opinionated about hosting landing pages
- Standout: Built-in ad network, referral program, recommendation swaps, no revenue cut on paid subs
- Weakness: Pricing has increased 3-4x in past two years. Scale plan required for most growth features

**Kit (formerly ConvertKit)**
- Best for: Creators selling digital products with complex automations
- API: Solid REST API
- Automations: Best-in-class visual automation builder with branching logic
- Deliverability: Strong reputation, creator-focused
- Next.js fit: Good API, well-documented
- Standout: 10K free subscriber tier (though limited to 1 automation), powerful tagging and segmentation, visual automation editor, built-in commerce for selling digital products
- Weakness: Expensive once you need Creator plan features. Free tier is very limited on automations

**Mailchimp**
- Best for: Legacy choice, broad feature set
- API: Mature REST API
- Automations: Customer journeys, A/B testing, multivariate testing
- Deliverability: Mixed — large shared IP pools mean variable results
- Next.js fit: Well-documented API, many community libraries
- Standout: Most templates, most integrations, broadest feature set
- Weakness: Expensive. Charges for unsubscribed contacts. Hidden costs add 20-40% above listed price. Owned by Intuit, product direction has shifted toward e-commerce

**Resend**
- Best for: Developers who want transactional + marketing in one API
- API: Best-in-class developer experience, React Email for templating
- Automations: Minimal — focused on sending, not sequences
- Deliverability: Strong; built by the team that made React Email
- Next.js fit: Exceptional. Built for the Next.js ecosystem. React components for email templates
- Standout: Beautiful DX, React Email integration, simple pricing, transactional + marketing unified
- Weakness: Marketing features are young. Limited automation/sequence builder. No built-in landing pages, referral programs, or growth tools. Marketing contacts cap at 5K on Pro ($40/mo), then Enterprise pricing

**Loops**
- Best for: SaaS product emails (onboarding, feature announcements)
- API: Event-based API designed for SaaS
- Automations: Event-triggered flows (signup, upgrade, feature use)
- Deliverability: Good
- Next.js fit: Good API, event-driven model works well
- Standout: Notion-style editor, event-based segmentation, unified transactional/marketing
- Weakness: Expensive at scale. SaaS-focused — not designed for newsletter content businesses. Pricing grows fast above 10K subscribers

### Recommendation

**For faderandknob.com, the top three choices are:**

1. **Buttondown** — Best value, best API simplicity, markdown-friendly, cheapest at scale. Ideal if content quality is the focus over growth hacking.
2. **Beehiiv** — Best growth toolkit (referral programs, recommendations, ad network). Ideal if aggressive subscriber growth and eventual sponsorship revenue are priorities.
3. **Kit** — Best automations for complex sequences (welcome series, upgrade nudges, segment-based flows). Ideal if selling preset packs and driving conversions is the priority.

Resend is tempting for the DX but lacks the marketing automation layer we need. Mailchimp is overpriced. Loops is wrong fit (SaaS-oriented).

---

## 2. What Guitar/Music Newsletters Do Well

### Major Players

**Reverb.com**
- Sends weekly deal roundups with curated gear picks
- "Deals signup" page offers: best deals, featured blog content, exclusive giveaways
- Strategy: Product-led email (marketplace listings) + editorial content
- Strength: Massive audience, personalized based on gear browsing history

**Sweetwater**
- Known for aggressive email frequency (multiple per week)
- Monthly gear giveaway drives signups (sweetwater.com/giveaway)
- Sales engineer personal emails are a differentiator — feels 1:1
- Strategy: Sale alerts + educational content + personal touch from assigned sales engineer

**PremierGuitar**
- Editorial newsletter with gear reviews, rig rundowns, tutorials
- Strength: Authority positioning through long-form journalism
- Content style: Deep-dive articles, video embeds, not just sales

**Guitar World / Guitar Player**
- Standard media newsletter: news roundup, reviews, deals
- Multiple sends per week, often product announcement focused
- Heavy affiliate content

**Worship Tutorials (worshiptutorials.com)**
- Directly relevant competitor — sells Helix and Fractal presets for worship
- Free resources page drives email signups
- Sends preset announcements, tutorial links, song-specific content

### Industry Benchmarks

- Average open rate for hobbies/music industry: 27-32%
- Click-through rate: 2-4%
- Musicians see 2-3x more engagement from email vs. social media
- Email converts better for launches (new presets, merch, premium content)

### What Works in This Niche

1. **Gear-specific content** — Not generic "guitar news" but targeted to what the reader owns
2. **Song-specific utility** — "Here's how to nail the tone for [specific song]"
3. **Behind-the-scenes** — Pedalboard breakdowns, amp settings, signal chain deep dives
4. **Exclusive first access** — New presets/recipes emailed before they go on the site
5. **Curated, not comprehensive** — 3-5 items, not 20-item link dumps

---

## 3. Lead Magnet Strategy

### What Converts for Guitarists

**Tier 1 — Highest conversion (estimated 10-15% signup rate)**

1. **Free preset download** — We already have the 10-free counter mechanism. This is the strongest lead magnet because it gives immediate, tangible value. A guitarist lands on a Helix recipe page, sees "Download this preset free — enter your email," and the value exchange is crystal clear.

2. **"Starter Pack" bundle** — A curated set of 5-10 presets covering common tones (clean, crunch, lead, ambient, worship). Higher perceived value than a single preset. Can be platform-specific (Helix Starter Pack, QC Starter Pack).

**Tier 2 — Strong conversion (estimated 5-10%)**

3. **PDF tone guide** — "The Complete Guide to Dialing In Worship Tones on Helix" or "5 Settings Most Guitarists Get Wrong." Evergreen, shareable, positions as authority.

4. **"Weekly Tone Recipe" email promise** — Subscribe and get one new tone recipe per week, delivered to your inbox before it goes live on the site. The exclusivity + utility combo works well.

**Tier 3 — Moderate conversion (estimated 3-5%)**

5. **Exclusive settings not on the site** — "Members-only" recipes that never appear on the public site. Creates FOMO and perceived insider access.

6. **Video tutorial access** — A free mini-course: "3 Videos: Zero to Worship Tone on Helix in 30 Minutes."

### Recommended Lead Magnet Stack

- **Primary (sitewide):** Free preset starter pack (5 presets) for email signup
- **Content upgrade (per blog post):** "Download the preset for this recipe" on each recipe page
- **Exit intent (all pages):** "Get our weekly tone recipe — free, every Tuesday"
- **Specific landing pages:** Platform-specific guides (Helix guide, QC guide) for SEO-driven signups

### Key Principle

The lead magnet must be **instantly usable**. Guitarists are practical — they want to plug in and play. A downloadable preset they can load in 60 seconds beats a 30-page PDF every time.

---

## 4. Email Sequences and Automations

### Welcome Sequence (5 emails over 10 days)

**Email 1 — Immediate (Day 0): "Welcome + Your Free Presets"**
- Deliver the promised lead magnet (preset download link)
- Brief intro: what Fader & Knob is, what to expect
- Ask: "What platform are you on? Helix / QC / Other" (click to tag)
- CTA: Download your presets now

**Email 2 — Day 2: "Get the Most Out of Your Presets"**
- Quick tips for loading and tweaking the free presets
- Link to 2-3 most popular recipe pages matching their platform
- Social proof: "Join 5,000+ guitarists dialing in better tones"

**Email 3 — Day 5: "The #1 Mistake with [Platform] Tones"**
- Educational content that establishes expertise
- Common EQ/gain staging mistakes specific to their platform
- Links to relevant blog posts
- Soft mention: "We publish new recipes weekly"

**Email 4 — Day 7: "What Are You Playing This Week?"**
- Song-specific content: "Here are tones for 3 songs trending right now"
- Introduces the recipe catalog browsing experience
- If worship-tagged: worship-specific songs with snapshot breakdowns

**Email 5 — Day 10: "Unlock the Full Library"**
- Upgrade nudge for premium/paid tier (if applicable)
- Recap what free includes vs. paid
- Testimonial from a satisfied user
- CTA: View pricing or start free trial

### New Recipe Notification

- Triggered when a new recipe is published
- Segmented by platform (Helix users only get Helix recipes)
- Subject: "[Song Name] — [Artist] Tone Recipe"
- Content: Preview image, key settings, link to full recipe
- Frequency: As published, max 2-3 per week

### Weekly Digest: "This Week in Tone"

- Sent every Tuesday (optimal mid-week engagement)
- Contents:
  - 1 featured new recipe
  - 2-3 popular recipes from the archive
  - 1 blog post or tip
  - 1 community highlight or user-submitted tone
- Keep it scannable — 3-minute read max

### Re-engagement Sequence (for 60+ days inactive)

**Email 1:** "We miss you — here's what's new" (3 best recipes since they went quiet)
**Email 2 (Day 5):** "Free preset drop" — an exclusive preset only for re-engagement
**Email 3 (Day 10):** "Should we keep sending?" — explicit opt-out to clean the list

### Upgrade Nudge Sequence (free to paid)

- Triggered after user has consumed 10+ free recipes or been subscribed 30+ days
- 3-email sequence over 7 days:
  1. "You've used [X] free recipes — here's what's behind the curtain"
  2. Social proof + feature comparison (free vs. premium)
  3. Limited-time offer or bonus preset pack with upgrade

### Worship-Specific: "Sunday Setlist" Sequence

(See Section 7 for full breakdown)

---

## 5. Newsletter Content Strategy

### Frequency

**Recommended: 1x per week (Tuesday morning) + occasional bonus sends**

- Weekly is the sweet spot for niche content. 65% of newsletter creators send weekly.
- Tuesday/Wednesday/Thursday mornings get highest open rates (9-11 AM)
- Supplement with triggered emails (new recipe notifications, welcome series) that are separate from the newsletter cadence
- Never exceed 3 total emails per week (newsletter + triggered combined)

### Format: "The Tone Report" (working title)

Each weekly issue follows this template:

```
HEADER: Fader & Knob — The Tone Report
DATE + ISSUE NUMBER

[1] RECIPE OF THE WEEK
    Featured tone recipe with preview image + key settings
    Link to full recipe

[2] QUICK TIP
    One actionable tip in 2-3 sentences
    (e.g., "Try rolling your guitar volume to 7 for cleaner Helix patches")

[3] FROM THE BLOG
    Latest or most relevant blog post link with 1-sentence teaser

[4] COMMUNITY SPOTLIGHT (optional)
    User-submitted tone, question answered, or social media highlight

[5] FOOTER
    Platform preference link (update your preferences)
    Social links
    Unsubscribe
```

Keep total length under 500 words. Aim for a 2-3 minute read.

### Subject Line Patterns That Work

Based on research, these patterns get higher open rates for guitar content:

**Song/Artist name leads:**
- "Nailing the Gravity tone — John Mayer"
- "How Hillsong gets THAT ambient sound"

**Curiosity gap:**
- "The one Helix block most players ignore"
- "Why your clean tone sounds thin (and the fix)"

**Direct utility:**
- "3 presets for Sunday's worship set"
- "This week's tone recipe: [Song Name]"

**Avoid:**
- Numbers in subject lines (decrease open rates in music niche specifically)
- ALL CAPS or excessive punctuation
- Generic subjects like "Newsletter #47" or "Monthly Update"

### Segmentation Strategy

**By platform:**
- Line 6 Helix / HX Stomp / HX Effects
- Neural DSP Quad Cortex
- Other / Multi-platform

**By genre/use case:**
- Worship / Church
- Rock / Blues
- Ambient / Experimental
- General / All genres

**By engagement level:**
- Active (opened in last 30 days)
- Warm (opened in last 60 days)
- Cold (no opens in 60+ days)

**By customer status:**
- Free subscriber
- Premium subscriber / Paying customer
- Power user (10+ recipe views)

Capture platform and genre at signup (Email 1 of welcome sequence) via click-to-tag.

---

## 6. Revenue from Email

### Revenue Streams

**1. Driving Preset Pack / Subscription Sales**
- Primary revenue channel for our model
- Email converts 3-5x better than social for digital product sales
- Welcome sequence upgrade nudge + periodic launch emails
- Realistic: $2-5 per subscriber per year in direct product revenue at early stage

**2. Affiliate Revenue from Gear Recommendations**
- Sweetwater, Amazon, Reverb, Plugin Boutique affiliate programs
- Embed contextual affiliate links in recipes: "This tone uses the [Pedal Name] — get it here"
- Guitar gear affiliate commissions: typically 4-8% (Amazon), up to 10% (Sweetwater)
- Realistic at 5K subs: $200-500/month from affiliate links in emails

**3. Sponsored Newsletter Slots**
- Once you reach 5-10K engaged subscribers, sponsors become viable
- Guitar gear brands, plugin companies, string makers, pickup manufacturers
- CPM for niche music audiences: $25-50 per 1,000 opens
- At 5K subs with 40% open rate (2,000 opens): $50-100 per sponsored slot
- At 10K subs: $100-200 per sponsored slot
- Weekly sponsorship at 10K subs: $400-800/month

**4. Beehiiv Ad Network (if using Beehiiv)**
- Passive income from programmatic ads
- Lower RPM than direct sponsors but zero sales effort
- Realistic: $5-15 per 1,000 subscribers per month

### Revenue Per 1,000 Subscribers (RPM) Projections

| Subscriber Count | Monthly Revenue Range | Primary Sources |
|------------------|-----------------------|-----------------|
| 1,000 | $50-200/mo | Product sales, affiliate |
| 5,000 | $500-1,500/mo | Product sales, affiliate, first sponsors |
| 10,000 | $1,500-4,000/mo | All channels active |
| 50,000 | $10,000-25,000/mo | Sponsorship-heavy, product launches |

**Key insight:** At our stage, email's biggest revenue impact is not direct newsletter monetization — it's driving conversions on the existing product (preset packs, premium access). A 1,000-person email list that converts at 5% on a $20 preset pack = $1,000 per launch. That math scales linearly.

---

## 7. The "Sunday Setlist" Email Concept

### The Idea

A weekly email sent every **Wednesday or Thursday** to worship guitarists containing:
- The 3-5 most popular worship songs being played this Sunday (sourced from CCLI Top 100, which now updates weekly)
- For each song: which Fader & Knob preset/snapshot to use, key settings, and a link to the full recipe
- Quick notes: suggested capo positions, tuning, key the song is commonly played in

### Why This Could Be a Killer Acquisition Tool

1. **Solves a real weekly problem.** Every worship guitarist faces the same question on Wednesday: "What tones do I need for Sunday?" This email answers it.

2. **Built-in recurring value.** Unlike a one-time download, this provides fresh utility every single week. The unsubscribe rate will be extremely low because the content is perpetually relevant.

3. **Natural viral loop.** Worship teams are 3-5 guitarists. One subscribes, forwards to the team. Band directors and worship leaders forward to their whole team.

4. **CCLI data is public.** The CCLI Top 100 is publicly available and updates weekly. We can build content around trending songs without licensing issues (we're providing guitar settings, not lyrics or sheet music).

5. **Positions Fader & Knob as essential infrastructure.** Just as worship teams rely on Planning Center for scheduling and CCLI for lyrics, this email makes F&K the go-to for tones.

### Implementation

**Data source:** CCLI Top 100 (songselect.ccli.com) updates weekly. Cross-reference with our existing recipe catalog.

**Email structure:**
```
SUBJECT: Sunday Setlist — April 12 Tones

"Here are the tones trending in churches this week."

SONG 1: "Goodness of God" — Bethel Music
  Platform: Helix | Snapshot: Clean Shimmer → Drive Swell
  Quick tip: Roll volume knob to 6 for verse, full for chorus
  [View Full Recipe →]

SONG 2: "Great Things" — Phil Wickham
  Platform: Helix | Snapshot: Edge of Breakup
  [View Full Recipe →]

SONG 3: "Build My Life" — Housefires
  Platform: QC | Scene: Ambient Pad
  [View Full Recipe →]

---
BONUS: "Song we're watching" — a rising song not yet in Top 10
---
FOOTER: Update your platform preference | Full recipe catalog
```

**Send schedule:** Wednesday at 10 AM (gives guitarists 3-4 days to prep)

**Growth strategy for Sunday Setlist specifically:**
- Dedicated landing page: faderandknob.com/sunday-setlist
- Promote in worship guitarist Facebook groups, Reddit r/worshipleaders, r/guitar
- Partner with worship leader blogs/podcasts for cross-promotion
- SEO page targeting "worship guitar tones this week" and "Sunday setlist guitar presets"

### Monetization Angle

- Free tier: Top 3 songs with basic settings
- Premium tier: Full 5-song setlist with detailed snapshots, alternate voicings, acoustic settings, and downloadable presets
- This becomes a natural upgrade funnel from free email to paid subscription

---

## 8. Growth Tactics: 0 to 1,000 to 10,000

### Phase 1: 0 to 500 Subscribers (Months 1-2)

**On-site optimization (biggest lever):**
- Exit-intent popup on all pages: "Get the free starter preset pack"
- Inline signup on every recipe page: "Download this preset — enter your email"
- Dedicated /subscribe landing page optimized for SEO
- Blog post CTAs: every post ends with email signup
- Sticky banner or footer bar sitewide

**Existing traffic conversion:**
- With 60+ blog posts already driving SEO traffic, even a 2% conversion rate on existing visitors gets you to 500 fast
- A/B test popup timing (5 seconds vs. 15 seconds vs. exit intent)

**Community seeding:**
- Post in r/Line6Helix, r/guitarpedals, r/worshipleaders with genuinely helpful content that links to recipes (not spam — value first)
- Participate in Fractal Audio forums, Line6 forums, TGP (The Gear Page)
- Facebook groups: Helix users groups, worship guitar groups

**Personal network:**
- Email existing contacts, social followers
- Ask early subscribers to forward to one friend

### Phase 2: 500 to 2,500 Subscribers (Months 3-6)

**Content-driven SEO signups:**
- Publish blog posts targeting "how to get [artist] tone on Helix" — these rank well and have high email conversion intent
- Each post has a relevant lead magnet (the preset for that specific tone)
- Target long-tail worship keywords: "worship ambient guitar helix preset"

**Cross-promotion:**
- Newsletter swaps with complementary creators (worship tech blogs, guitar YouTube channels, pedalboard communities)
- Guest posts on worship leader sites with email CTA
- YouTube presence: even short-form videos ("60-second tone recipe") that drive to email signup

**Launch the Sunday Setlist:**
- This becomes its own growth engine — a viral-friendly, highly shareable product
- Promote it as a standalone offering on a dedicated landing page

### Phase 3: 2,500 to 10,000 Subscribers (Months 6-18)

**Referral program:**
- "Refer 3 friends, get an exclusive preset pack"
- If using Beehiiv: built-in referral program with milestone rewards
- If using other ESP: use SparkLoop or similar referral tool

**Paid acquisition (when unit economics justify it):**
- Newsletter sponsorships in adjacent newsletters ($1-3 per subscriber acquisition)
- Facebook/Instagram ads to lead magnet landing page
- Target: worship guitarists, Helix owners, QC owners

**YouTube + SEO flywheel:**
- Blog posts drive organic traffic → email signups
- Email list drives engagement on new content → better SEO signals
- YouTube videos reference email list → cross-platform growth

**Partnerships:**
- Collaborate with Line 6, Neural DSP for co-branded content
- Get featured in worship tech roundups
- Podcast guest appearances on worship leader and guitar gear podcasts

### Growth Timeline (Realistic Targets)

| Milestone | Target Date | Strategy Focus |
|-----------|-------------|----------------|
| 100 subs | Month 1 | On-site popups, personal network |
| 500 subs | Month 2 | SEO content + lead magnets on every page |
| 1,000 subs | Month 4 | Sunday Setlist launch, community engagement |
| 2,500 subs | Month 8 | Cross-promotion, referral program |
| 5,000 subs | Month 12 | Paid acquisition begins, partnerships |
| 10,000 subs | Month 18 | Full flywheel: SEO + referral + paid + YouTube |

---

## EMAIL LAUNCH PLAN

### Recommended ESP: Buttondown

**Why Buttondown wins for Fader & Knob:**
- Free up to 100 subs while we build the system, $9/mo at 1K — cheapest path to 10K+
- API-first design integrates cleanly with our Next.js stack
- Markdown-native editor matches our developer workflow
- No revenue cut on any future paid subscriptions
- Simple, honest pricing that won't surprise us at scale ($29/mo at 10K subs vs. $139 for Kit or $135 for Mailchimp)
- We don't need Beehiiv's growth tools yet — our SEO + recipe content is our growth engine

**If growth tools become priority later:** Migrate to Beehiiv when we hit 2,500 subs and want the referral program + ad network. Buttondown's API makes export/migration straightforward.

### Sequences to Build First (Priority Order)

1. **Welcome Sequence** (5 emails, 10 days) — Build this before anything else. This is where subscribers become fans.
2. **Sunday Setlist** weekly email — This is the unique value prop. Launch within first month.
3. **New Recipe Notification** automation — Segmented by platform. Set up webhook from CMS.
4. **Weekly Digest: "The Tone Report"** — Start this once we have 200+ subscribers and a rhythm.
5. **Re-engagement Sequence** — Build at 1,000+ subs when churn matters.
6. **Upgrade Nudge Sequence** — Build when premium/paid tier is ready.

### Content Calendar: Month 1

| Week | Newsletter | Automation | Growth Action |
|------|-----------|------------|---------------|
| Week 1 | -- | Launch welcome sequence (test with first 50 subs) | Add signup popups to all pages. Announce in social channels. |
| Week 2 | Sunday Setlist #1 (soft launch to early subs) | Refine welcome emails based on open/click data | Post in 3 worship guitar communities |
| Week 3 | The Tone Report #1 (first weekly newsletter) | Set up new recipe notification trigger | Publish lead magnet landing page. Start SEO targeting. |
| Week 4 | Sunday Setlist #2 + The Tone Report #2 | A/B test welcome Email 1 subject line | Cross-promote with 1 complementary newsletter |

### Key Metrics to Track

- **Signup rate:** % of site visitors who subscribe (target: 3-5%)
- **Welcome sequence completion rate:** % who open all 5 emails (target: 40%+)
- **Weekly open rate:** Target 40%+ (niche audiences outperform average)
- **Click-through rate:** Target 4-6%
- **Unsubscribe rate:** Keep below 0.5% per send
- **List growth rate:** Target 10-15% month-over-month
- **Revenue per subscriber:** Track from Month 3 onward

### Budget: Month 1-6

| Item | Monthly Cost |
|------|-------------|
| Buttondown (up to 1K subs) | $9/mo |
| Custom domain for email sending | $0 (use existing domain) |
| DNS setup (SPF, DKIM, DMARC) | $0 (one-time config) |
| **Total** | **$9/mo** |

At 5K subs (estimated Month 10-12): $19/mo. At 10K subs: $29/mo.

Compare this to Kit at $139/mo or Mailchimp at $135/mo for the same 10K subscribers.

### Day 1 Checklist

- [ ] Create Buttondown account
- [ ] Configure custom sending domain (mail.faderandknob.com)
- [ ] Set up SPF, DKIM, DMARC DNS records
- [ ] Connect Buttondown API to Next.js signup components
- [ ] Write and schedule Welcome Email 1 (deliver lead magnet)
- [ ] Draft Welcome Emails 2-5
- [ ] Create "Sunday Setlist" landing page at /sunday-setlist
- [ ] Add exit-intent popup sitewide
- [ ] Add inline signup CTA to all recipe pages
- [ ] Import any existing email contacts (if applicable)
- [ ] Send announcement to existing social audience

---

*This strategy prioritizes getting to 1,000 engaged subscribers fast with minimal cost, then scaling through content-driven growth and the Sunday Setlist viral loop. The guitar tone niche is underserved by email — most competitors rely on social media and forums. Email gives us a direct, owned channel that compounds over time.*
