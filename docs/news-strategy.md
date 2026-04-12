# Fader & Knob: News Feature Strategy

**Date:** March 29, 2026 (updated April 12, 2026)
**Status:** Active — daily-news-check task runs against this
**Audience:** Guitar players who own digital modelers at ANY price point

## April 2026 Update: Expanded Scope

The news scope was expanded from 6 premium modeler brands to 13+
brands across all price points, plus pedal and amp launches. Key
additions:

**Budget modeler brands added:**
- Mooer (GE300, GE200, Preamp Live)
- Valeton (GP-200, GP-100)
- Hotone (Ampero II, Ampero Mini)
- NUX (MG-30, MG-400)
- Donner (Arena 2000)
- Harley Benton (DNAfx GiT)
- HeadRush (MX5, Pedalboard, Gigboard)

**Pedal brands added for launch coverage:**
JHS, Walrus Audio, Strymon, Boss, EHX, MXR, Wampler, Chase Bliss,
Eventide, Source Audio, TC Electronic

**Editorial rules:**
- ALWAYS cover: firmware updates + new product launches (any price)
- SOMETIMES cover: creator findings that affect gear (cover the
  finding, not the video), price drops, industry events
- NEVER cover: other creators' content as news, gear drama, anything
  where F&K is just a middleman to someone else's traffic

**Writer assignments by topic:** see daily-news-check scheduled task

---

---

## Table of Contents

1. [News Sources Audit](#1-news-sources-audit)
2. [Content Types That Work](#2-content-types-that-work)
3. [Implementation Options](#3-implementation-options)
4. [Technical Implementation for Next.js](#4-technical-implementation-for-nextjs)
5. [SEO & Traffic Opportunity](#5-seo--traffic-opportunity)
6. [Recommended MVP](#6-recommended-mvp)

---

## 1. News Sources Audit

### Manufacturer Official Sources

These are the primary sources for firmware updates, new product announcements, and official feature additions. They should be the backbone of any news aggregation system.

| Manufacturer | News/Blog URL | RSS Available | Update Frequency | Notes |
|---|---|---|---|---|
| **Line 6** | line6.com/news, line6.com/support | No native RSS | Every 2-4 months (firmware) | Helix Stadium is the new flagship. HX 3.80 was the last update for original Helix family. Line 6 Community forums are where firmware release notes are posted first. |
| **Neural DSP** | neuraldsp.com/news, neuraldsp.com/quad-cortex-updates | No native RSS | Monthly dev updates, quarterly firmware | Numbered "Development Update" posts (currently at #56). CorOS 4.0.0 shipped Jan 2026. Also has Unity community forum (unity.neuraldsp.com). |
| **Fractal Audio** | fractalaudio.com/axe-fx-iii-downloads, forum.fractalaudio.com | No native RSS (forum has feeds) | Very frequent (monthly betas) | Cliff Chase posts firmware threads directly in the forum. Currently at firmware 32.03 beta. The forum is the official news channel. Wiki at wiki.fractalaudio.com has full release notes. |
| **Kemper** | kemper-amps.com/news, kemper-amps.com/downloads | No native RSS | Quarterly major releases | OS 14.0 "Profiling 2.0" is in public beta (March 2026). Forum at forum.kemper-amps.com is active. |
| **IK Multimedia** | ikmultimedia.com/news, ikmultimedia.com/products/tonex | No native RSS | Quarterly feature updates | TONEX Modeler update (v1.10.0) was a major milestone. ToneNET (tone.net) is their sharing platform. |
| **Boss/Roland** | boss.info/global/support | No native RSS | Infrequent | Katana Gen 3 is at firmware v1.06. Updates are less frequent and less newsworthy than the big modelers. Boss Tone Studio is the companion software. |

### Guitar Gear News Publications

These are the editorial sources that cover the modeler space with reviews, first looks, and analysis.

| Publication | URL | RSS Feed | Relevance |
|---|---|---|---|
| **Guitar World** | guitarworld.com/news, guitarworld.com/gear | Yes (guitarworld.com/feeds/all) | Top-tier. Covers every major firmware update, NAMM, product launches. Weekly gear roundup column. |
| **MusicRadar** | musicradar.com/news | Yes | Owned by same parent as Guitar World. Strong modeler coverage. |
| **Premier Guitar** | premierguitar.com | Yes | Has a dedicated "digital modelers" tag. Rig Rundown video series is best-in-class for artist gear breakdowns. |
| **Reverb News** | reverb.com/news | Yes | Market data (modelers outsold tube amps in 2025), product launches, Sound Recipes series. |
| **Gearnews** | gearnews.com | Yes | Fast-turnaround news. Has manufacturer-specific tag pages (e.g., gearnews.com/manufacturer/kemper). Good for rumors and leaks. |
| **Sweetwater inSync** | sweetwater.com/insync | Yes | 28,000+ articles. Detailed firmware update guides. Their comparison videos (Fluff + Steve Sterlacci) get high views. |
| **Guitar.com** | guitar.com/news/gear-news | Yes | Strong NAMM live blog coverage. Gear news section is well-organized. |
| **Sound On Sound** | soundonsound.com/news | Yes | More in-depth, studio-oriented coverage. |
| **The Music Zoo** | themusiczoo.com/blogs/news | Yes (Shopify blog) | NAMM coverage, new product launches. |

### YouTube Channels Worth Monitoring

These creators drive community conversation and often break news or provide the most accessible explanations of firmware updates.

| Channel | Focus | Subscribers (approx.) | Why It Matters |
|---|---|---|---|
| **Jason Sadites** | Line 6 Helix, TONEX | 100K+ | Official Line 6 tutorial partner. Premier Guitar contributor. Preset creator. |
| **Leon Todd (G66)** | Fractal Audio | 50K+ | Go-to Fractal resource. IR/cab advice. Preset seller via Gumroad. |
| **Rhett Shull** | General gear, modelers | 1M+ | One of YouTube's most trusted guitar gear voices. |
| **Fluff (Riffs, Beards & Gear)** | High-gain, modelers | 700K+ | Gear shootouts, amp comparisons. |
| **Worship Tutorials** | Church/worship tones | 200K+ | Huge in the worship guitar niche. Sells Helix/QC presets. |
| **Justin Muncy** | Neural Amp Modeler (NAM) | 50K+ | Covers the free/open-source NAM ecosystem. |
| **Sweetwater** | All gear | 1M+ | Studio-quality comparisons. Fluff + Sterlacci modeler shootout series. |
| **Andertons** | All gear, UK market | 1M+ | Entertaining comparisons, strong UK audience. |
| **Darkglass Electronics** | NAM, bass | 100K+ | First manufacturer to build a NAM hardware pedal. |

### Reddit Communities

| Subreddit | Members (approx.) | Focus |
|---|---|---|
| **r/Line6Helix** | 30K+ | Helix/HX ecosystem. Firmware discussion, preset sharing, troubleshooting. |
| **r/QuadCortex** | 15K+ | Neural DSP Quad Cortex. CorOS updates, captures, tone tips. |
| **r/guitarpedals** | 500K+ | Broad pedal community. Modeler content gets high engagement. |
| **r/guitars** | 300K+ | General guitar community. Modeler vs. tube amp debates are evergreen. |
| **r/GuitarAmps** | 100K+ | Amp-focused. Modeling discussions are common. |
| **r/FractalAudio** | 5K+ | Axe-FX, FM9, FM3 community. |

### Forums

| Forum | URL | Notes |
|---|---|---|
| **Fractal Audio Forum** | forum.fractalaudio.com | Official. Cliff Chase posts firmware directly here. Very technical community. |
| **Kemper Profiler Forum** | forum.kemper-amps.com | Official. OS betas announced here first. |
| **Line 6 Community** | line6.com/support | Official. Release notes and tutorials posted here. |
| **Neural DSP Unity** | unity.neuraldsp.com | Official. Development updates and community discussion. |
| **The Gear Page (TGP)** | thegearpage.net | Largest general gear forum. Digital Modeling Gear subforum. |
| **The Gear Forum** | thegearforum.com | Active Digital & Modeling section. Cross-platform comparison threads with millions of views. |
| **VGuitar Forums** | vguitarforums.com | Boss/Roland focused. Katana firmware discussion hub. |
| **Rig-Talk** | rig-talk.com | Successor to Harmony Central. Power amp and modeler discussions. |

### Social Media Accounts

- **Line 6 Official**: Twitter/X, Instagram, Facebook (major launch announcements)
- **Neural DSP**: Twitter/X, Instagram (product teasers, artist content)
- **Fractal Audio**: Facebook group is very active (Cliff Chase occasionally posts)
- **IK Multimedia**: Instagram, Facebook (TONEX promotions, Tone Marathon series)
- **Kemper**: Instagram, Facebook (OS update announcements)

---

## 2. Content Types That Work

### What Gets Engagement in This Niche

Based on analysis of the publications and communities above, these content types consistently generate the most engagement:

**Tier 1 -- Highest Engagement:**
1. **Firmware update summaries** -- "What's new in CorOS 4.0" or "Helix 3.80: Every new amp and effect explained." These are the single highest-traffic events in the modeler news cycle. Players need to know what changed and whether to update.
2. **New product launches** -- NAMM coverage, new modeler announcements (Quad Cortex Mini, Helix Stadium). These drive massive spikes.
3. **Head-to-head comparisons** -- "Helix Stadium vs. Quad Cortex" drives endless debate and sharing.

**Tier 2 -- Steady Engagement:**
4. **Artist rig rundowns** -- "What does [artist] use live?" Premier Guitar's Rig Rundown series is the gold standard.
5. **Tips and tricks** -- "5 ways to get better high-gain tones on your Helix." Practical, evergreen, shareable.
6. **New amp/effect model deep dives** -- When a firmware adds a Dumble model, players want to know how it compares to the real thing.

**Tier 3 -- Community Building:**
7. **Deals and price drops** -- Reverb market data, holiday sales.
8. **Community events** -- NAMM previews/recaps, local meetups, online tone challenges.
9. **Capture/profile spotlights** -- Highlighting great community-made captures on ToneNET, Rig Manager, Axe-Change.

### How Competitors Handle News

| Competitor | Approach | Strengths | Weaknesses |
|---|---|---|---|
| **ToneDB** | Database of tone recipes with gear breakdowns. No dedicated news section. | Deep content, good SEO for song-specific queries. | No news = no freshness signals, no reason to return daily. |
| **TONE3000** (formerly ToneHunt) | Community platform for NAM captures. Blog covers NAM-specific news. | 275K tones. Strong community. | NAM-only. No coverage of commercial modelers. |
| **Guitar World** | Full editorial team. Daily news, reviews, buying guides. | Best coverage breadth. High domain authority. | Not modeler-specific. Guitar players must filter through non-modeler content. |
| **HelixHelp.com** | Helix-specific reference site. Release notes archive. | Comprehensive Helix resource. | Single-platform only. No editorial voice. |
| **Sweetwater inSync** | Editorial + commerce. Firmware guides, comparisons. | Trust, depth, video content. | Commerce-driven. Not a news destination. |

**The gap Fader & Knob can fill:** No single site aggregates modeler-specific news across all platforms with an editorial voice tailored to the tone-recipe audience. Guitar World is too broad. HelixHelp is too narrow. ToneDB has no news. There is a clear opening for a curated, multi-platform modeler news hub.

### Recommended Cadence

- **Real-time**: Firmware updates and major product launches (push notifications, email alerts)
- **Weekly**: Curated digest of the week's modeler news (email newsletter + /news page)
- **Monthly**: Deeper analysis pieces (e.g., "State of the Modeler Market: March 2026")

---

## 3. Implementation Options

### Option A: RSS Aggregation (Automated Foundation)

**How it works:** Pull RSS/Atom feeds from guitar news publications, parse them, filter for modeler-relevant content, and display on the /news page.

**Tools and APIs:**
- `rss-parser` (npm) -- The standard Node.js library for parsing RSS/Atom feeds into JavaScript objects. Works well with Next.js.
- `@rowanmanning/feed-parser` -- More resilient alternative, tested against 40+ real-world feeds.
- **RSS.app** -- SaaS tool that can generate RSS feeds from sites that don't have them (useful for manufacturer pages). Can combine multiple feeds into one aggregated feed. Offers keyword filtering and deduplication.
- **Apify RSS Feed Aggregator** -- Serverless aggregation with deduplication and field selection.
- **Feedly API** -- Feedly's API can provide pre-categorized feeds with AI-powered topic detection.

**RSS feeds available from key sources:**
- Guitar World, MusicRadar, Premier Guitar, Reverb News, Gearnews, Sweetwater inSync, Sound On Sound all have RSS feeds.
- Manufacturer sites (Line 6, Neural DSP, Kemper, Fractal, IK Multimedia, Boss) do NOT have RSS feeds. These require scraping or manual monitoring.

**Pros:** Low effort to set up. Automated. Covers editorial sources well.
**Cons:** No RSS from manufacturers (the most important sources). Raw feeds need filtering -- most guitar news is irrelevant to modeler users. No editorial voice.

### Option B: AI-Assisted Curation (Recommended Layer)

**How it works:** Use Claude or another LLM to process raw feed items and manufacturer page changes, then generate summaries, categorize by platform, and add editorial context.

**Workflow:**
1. Cron job fetches RSS feeds + scrapes manufacturer update pages daily
2. Claude processes each item:
   - Classifies relevance (is this about a modeler?)
   - Tags by platform (Helix, QC, Fractal, Kemper, TONEX, Boss)
   - Generates a 2-3 sentence summary
   - Assigns category (firmware, product launch, tip, artist, deal)
   - Extracts key data (firmware version number, new model names, prices)
3. Results stored in Supabase
4. Human editor reviews and approves (or auto-publishes low-risk items like firmware summaries)

**What can be automated vs. editorial:**

| Content Type | Automation Level | Notes |
|---|---|---|
| Firmware release notes | 90% automated | Claude can summarize changelogs accurately. Human reviews for accuracy. |
| Product launch summaries | 70% automated | Claude summarizes, human adds opinion/context. |
| Weekly digest compilation | 80% automated | Claude ranks and formats. Human writes intro paragraph. |
| Tips and tricks | 20% automated | Mostly editorial. Claude can help draft from forum/YouTube sources. |
| Artist rig rundowns | 10% automated | Requires research and original writing. |
| Opinion/analysis | 0% automated | Pure editorial. This is the brand voice. |

### Option C: Weekly Digest Format

**How it works:** A curated weekly email and web page summarizing the week's modeler news.

**Format example:**
```
MODELER NEWS WEEKLY -- March 29, 2026

FIRMWARE UPDATES
- Fractal Axe-FX III 32.03 beta: New chorus models (CE-1, CH-1, Small Clone)
- Kemper OS 14.0 beta: Profiling 2.0 with 100K+ frequency analysis

PRODUCT NEWS
- Neural DSP Quad Cortex Mini shipping to pre-orders
- Line 6 retiring Line 6 Monkey and License Manager (April 10)

TIPS & TONES
- Jason Sadites: Studio compressor trick for polished Helix patches
- Leon Todd: New SPX90 preset for Fractal FM9

COMMUNITY
- Modelers officially outsold tube amps on Reverb in 2025
```

**Pros:** Low overhead. Builds email list. Creates weekly traffic spike. Easy to produce with AI assistance.
**Cons:** Not real-time. Misses the immediacy of firmware drop excitement. Weekly cadence may feel slow for power users.

### Option D: Real-Time Feed (Twitter-Style Stream)

**How it works:** A continuously updating feed on the /news page showing modeler news as it happens.

**Pros:** Destination-worthy. Power users would bookmark it. Freshness signals for Google.
**Cons:** Highest effort. Requires constant monitoring. Risk of low-quality or irrelevant items polluting the feed.

### Recommended Approach: Hybrid (B + C)

Combine AI-assisted curation with a weekly digest as the anchor format, plus real-time alerts for major events (firmware drops, NAMM). This gives you:
- Daily automated ingestion and classification
- Human-quality weekly digest (email + web)
- Push alerts for high-impact events
- A growing archive of modeler news that builds SEO value

---

## 4. Technical Implementation for Next.js

### Architecture Overview

```
[RSS Feeds] ──┐
               ├──> [Cron Job / Edge Function] ──> [Claude API] ──> [Supabase]
[Scrapers]  ──┘                                                         │
                                                                         ├──> /news (page)
[Manual CMS] ─────────────────────────────────────────────────────────────┤
                                                                         ├──> /news/[slug] (detail)
                                                                         ├──> /news/weekly (digest)
                                                                         └──> RSS feed out (/news/feed.xml)
```

### Data Model (Supabase)

```sql
-- News items table
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,           -- 2-3 sentence AI-generated summary
  body TEXT,                       -- Full editorial content (for manual posts)
  source_url TEXT,                 -- Link to original article
  source_name TEXT,                -- "Guitar World", "Neural DSP", etc.
  category TEXT NOT NULL,          -- firmware, product, tip, artist, deal, event
  platforms TEXT[],                -- ['helix', 'quad-cortex', 'fractal', etc.]
  image_url TEXT,
  is_major BOOLEAN DEFAULT false,  -- Flag for push-worthy news
  is_published BOOLEAN DEFAULT false,
  is_auto_generated BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Weekly digests
CREATE TABLE news_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  intro TEXT,                      -- Human-written intro
  body TEXT NOT NULL,              -- Compiled digest content
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_news_items_published ON news_items(is_published, published_at DESC);
CREATE INDEX idx_news_items_category ON news_items(category);
CREATE INDEX idx_news_items_platforms ON news_items USING GIN(platforms);
```

### Key Files and Routes

```
app/
  news/
    page.tsx              -- Main news feed with filters (by platform, category)
    [slug]/
      page.tsx            -- Individual news item detail page
    weekly/
      page.tsx            -- Latest weekly digest
      [slug]/
        page.tsx          -- Archived weekly digests
    feed.xml/
      route.ts            -- RSS feed output for the news section
lib/
  news/
    rss-fetcher.ts        -- RSS parsing logic using rss-parser
    scraper.ts            -- Manufacturer page scraping (Cheerio or Playwright)
    classifier.ts         -- Claude API call to classify and summarize
    digest-builder.ts     -- Compiles weekly digest from news_items
```

### RSS Feed Ingestion (rss-fetcher.ts)

Use `rss-parser` to consume feeds:

```typescript
import Parser from 'rss-parser';

const FEEDS = [
  { name: 'Guitar World', url: 'https://www.guitarworld.com/feeds/all', priority: 'high' },
  { name: 'MusicRadar', url: 'https://www.musicradar.com/rss', priority: 'high' },
  { name: 'Premier Guitar', url: 'https://www.premierguitar.com/rss', priority: 'high' },
  { name: 'Reverb News', url: 'https://reverb.com/news/feed', priority: 'medium' },
  { name: 'Gearnews', url: 'https://www.gearnews.com/feed/', priority: 'high' },
  { name: 'Sweetwater inSync', url: 'https://www.sweetwater.com/insync/feed/', priority: 'medium' },
];

const MODELER_KEYWORDS = [
  'helix', 'quad cortex', 'coros', 'axe-fx', 'fm9', 'fm3',
  'kemper', 'profiler', 'tonex', 'katana', 'modeler', 'modeller',
  'firmware', 'amp model', 'neural dsp', 'fractal audio', 'line 6',
  'ik multimedia', 'neural capture', 'tone model', 'impulse response',
  'nam', 'neural amp modeler', 'helix stadium', 'nano cortex',
];
```

### Manufacturer Page Monitoring

Since manufacturers don't provide RSS feeds, use one of these approaches:

1. **Scheduled scraping** with Cheerio (lightweight HTML parsing) for update/download pages
2. **RSS.app** to generate RSS feeds from manufacturer pages (SaaS, no maintenance)
3. **Visualping or ChangeTower** for page-change detection with webhook notifications

Priority scrape targets:
- `neuraldsp.com/quad-cortex-updates` (structured update posts)
- `fractalaudio.com/axe-fx-iii-downloads/` (firmware version numbers)
- `kemper-amps.com/downloads/6/Operating-System-Updates` (OS versions)
- `line6.com/software/` (software releases)
- `ikmultimedia.com/news/` (product announcements)

### AI Classification (classifier.ts)

Use the Claude API to filter and enrich raw feed items:

```typescript
const SYSTEM_PROMPT = `You are a news classifier for a guitar tone recipe website.
Given a news article title and description, determine:
1. Is this relevant to digital guitar modelers? (yes/no)
2. Category: firmware | product | tip | artist | deal | event
3. Platforms mentioned: helix | quad-cortex | fractal | kemper | tonex | katana | general
4. Summary: 2-3 sentences for modeler enthusiasts
5. Is this major news? (worthy of a push notification)
Return JSON.`;
```

### Newsletter Integration

If the site already has newsletter infrastructure, the weekly digest can be:
1. Auto-compiled from the week's `news_items` via `digest-builder.ts`
2. Formatted as both a web page (`/news/weekly`) and an email template
3. Sent via existing newsletter system (Resend, ConvertKit, Mailchimp, etc.)
4. The web version serves as an SEO-optimized archive

### Generating an Outbound RSS Feed

Use the `feed` npm package to generate `/news/feed.xml` so other aggregators and readers can subscribe to Fader & Knob's curated modeler news:

```typescript
import { Feed } from 'feed';

// Generate from published news_items in Supabase
// This makes Fader & Knob itself a news source others subscribe to
```

---

## 5. SEO & Traffic Opportunity

### High-Intent Keyword Opportunities

These are the types of queries modeler owners search for regularly. Exact volume data requires tools like Ahrefs or SEMrush, but the pattern is clear from the content landscape:

**Firmware update queries (event-driven spikes):**
- "helix firmware update" / "helix 3.80 update" / "helix stadium firmware"
- "quad cortex update" / "coros 4.0" / "coros update"
- "axe-fx firmware" / "axe-fx 32.03"
- "kemper os update" / "kemper profiling 2.0"
- "tonex update" / "tonex firmware"
- "katana gen 3 firmware"

These queries spike every time a new firmware drops. Guitar World, Sweetwater, and MusicRadar currently dominate these SERPs. A dedicated modeler news site that publishes quickly could capture a portion of this traffic.

**Evergreen queries:**
- "best helix presets" / "best quad cortex presets"
- "helix vs quad cortex" / "kemper vs fractal"
- "helix new amps" / "quad cortex new models"
- "NAMM [year] modeler announcements"
- "best amp modeler [year]"
- "[artist name] guitar rig" / "[artist] helix preset"

**Long-tail opportunities (lower competition):**
- "helix stadium vs helix floor differences"
- "coros 4.0 new effects list"
- "kemper profiling 2.0 how it works"
- "fractal axe-fx chorus models list"
- "tonex vs quad cortex capture comparison"
- "neural amp modeler vs tonex"

### Why News Content Drives Organic Traffic

1. **Freshness signals**: Google rewards recently-published content for queries about current events. Firmware updates are time-sensitive queries where recency matters enormously in ranking.

2. **Topical authority**: A site that consistently covers modeler news builds topical authority in Google's eyes, which lifts rankings for all related content (including tone recipes).

3. **Internal linking flywheel**: A news post about "Helix 3.80 adds Dumble model" can link to the site's existing Dumble tone recipe. News drives traffic to core content.

4. **Backlink magnet**: Original firmware summaries and weekly digests get linked from forums, Reddit, and social media. This builds domain authority.

5. **Repeat visitors**: News gives users a reason to return daily/weekly, increasing session frequency and building brand loyalty.

### Traffic Projection Estimate

Based on the competitive landscape:
- Firmware update posts: 2,000-10,000 pageviews per major firmware drop (6-10 per year across all platforms)
- Weekly digest: 500-2,000 pageviews per week once established
- Evergreen comparison/analysis: 200-1,000 monthly pageviews per article (compounds over time)
- NAMM coverage: 5,000-20,000 pageviews during NAMM week

Conservative year-one estimate: 50,000-150,000 additional annual pageviews from news content, growing as topical authority builds.

---

## 6. Recommended MVP

### The Simplest Version Worth Shipping

**"Modeler News" -- A curated feed of what matters to modeler players**

#### MVP Scope

1. **A `/news` page** showing a reverse-chronological feed of modeler news items
2. **Platform filter tabs**: All | Helix | Quad Cortex | Fractal | Kemper | TONEX | Katana
3. **Category badges**: Firmware | Product | Tip | Artist | Deal
4. **Each item shows**: Title, 2-3 sentence summary, source attribution with link, platform tags, date
5. **Weekly digest page** at `/news/weekly` compiling the week's highlights
6. **RSS output** at `/news/feed.xml`

#### What Can Be Automated From Day 1

| Component | Automation | Human Effort |
|---|---|---|
| RSS feed ingestion from 6+ publications | Fully automated (cron) | None |
| Keyword filtering for modeler relevance | Fully automated | None |
| AI summary generation via Claude | Fully automated | Quick review (2 min per item) |
| Platform and category tagging | Fully automated | Spot-check |
| Weekly digest compilation | 80% automated | Write intro paragraph, review order |
| Manufacturer firmware monitoring | Semi-automated (page change alerts) | Write the firmware summary post (or let Claude draft it) |
| Newsletter send | Automated (scheduled) | Approve before send |

**Estimated ongoing time commitment:** 30-60 minutes per week for curation and review. Major firmware drops may require 1-2 hours for a thorough summary post.

#### MVP Page Layout

```
/news
---------------------------------------------------------
MODELER NEWS                              [Subscribe]

[All] [Helix] [Quad Cortex] [Fractal] [Kemper] [TONEX]

---------------------------------------------------------
[FIRMWARE]  Fractal Axe-FX III 32.03 Beta Adds
            New Chorus Models
            The latest beta brings CE-1, CH-1, and Small
            Clone chorus models plus oversampling for the
            Drive block. -- via Guitar World
            Mar 28, 2026  |  #fractal

[PRODUCT]   Kemper Profiling 2.0 Enters Public Beta
            OS 14.0 analyzes over 100,000 frequency points
            per profile. Available for MK2 and Player
            owners. -- via Kemper
            Mar 4, 2026  |  #kemper

[TIP]       Studio Compressor Trick for Polished
            Helix Patches
            Jason Sadites shares his end-of-chain
            compressor technique for studio-quality
            tones. -- via Sweetwater inSync
            Feb 15, 2026  |  #helix

... [Load More]
---------------------------------------------------------
```

#### MVP Tech Stack

- **Data store**: Supabase table (`news_items`) -- fits the existing stack
- **RSS parsing**: `rss-parser` npm package
- **AI classification**: Claude API (Haiku for speed/cost on classification tasks)
- **Scheduling**: Vercel Cron Jobs or Supabase Edge Functions on a schedule
- **Page**: Next.js App Router with server components, ISR (revalidate every 15 minutes)
- **Newsletter**: Hook into existing newsletter infrastructure for weekly digest

#### Build Phases

**Phase 1 (MVP -- 1-2 weeks):**
- Supabase table for news items
- RSS ingestion cron job with keyword filtering
- Claude API classification and summarization
- `/news` page with platform filters
- Manual admin interface for review/publish (can be Supabase dashboard initially)

**Phase 2 (Month 2):**
- Weekly digest page and email integration
- Manufacturer page monitoring (scraping or change detection)
- `/news/feed.xml` RSS output
- Individual news item pages with full content and related tone recipes

**Phase 3 (Month 3+):**
- Push notifications for firmware updates (web push or email alerts)
- "Follow a platform" feature (users choose which platforms they care about)
- Community submissions (users can submit news tips)
- NAMM live coverage page
- News archive with search

#### Success Metrics

- **Traffic**: Pageviews to /news section (target: 5,000/month within 3 months)
- **Email**: Newsletter subscriber growth rate
- **Engagement**: Click-through from news items to tone recipes (the internal linking flywheel)
- **SEO**: Rankings for "[platform] firmware update" queries
- **Return visits**: Percentage of users visiting /news more than once per week

---

## Appendix: Key Market Context (March 2026)

The modeler market is at an inflection point:

- **Modelers have outsold traditional amps** on Reverb for the first time (2025 data).
- **Line 6 Helix Stadium** launched with new "Agoura" modeling engine and "Proxy" cloning, representing the biggest Helix update in a decade.
- **Neural DSP Quad Cortex Mini** debuted at NAMM 2026, bringing flagship QC power to a smaller form factor at EUR 1,299.
- **Kemper Profiling 2.0** (OS 14.0 beta) is the most significant Kemper update in years, analyzing 100K+ frequency points per profile.
- **Fractal Audio** continues its rapid firmware cadence with 32.xx series updates, adding new models monthly.
- **Neural Amp Modeler (NAM)** is growing as a free, open-source alternative, with TONE3000 hosting 275K+ community captures.
- **IK Multimedia TONEX** continues expanding with effects updates and the Tone Marathon series.

This is the most competitive and fast-moving period in the modeler space's history. A news hub serving this audience has strong timing.
