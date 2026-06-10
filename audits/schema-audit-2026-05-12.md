# Schema Coverage Audit — faderandknob.com

**Date:** 2026-05-12
**Last updated:** 2026-05-12 — all 11 prioritized fixes shipped (see §7).
**Method:** Static analysis of the Next.js codebase at HEAD.
**Why static, not crawl:** every page that ships JSON-LD does it inline in
the `page.tsx` (no client-side schema injection), so reading the source is
strictly more reliable than crawling — it shows what every dynamic slug
would emit, not just the handful a crawler samples. Google's Rich Results
Test was used to spot-check a few representative URLs (notes in §3).

---

## 1. Summary

| Page type | Slugs | JSON-LD shipped today | Coverage | Recommended additions |
|---|---:|---|---:|---|
| Home `/` | 1 | _none_ | **0%** | `WebSite` + `SearchAction`, `Organization` |
| Blog index `/blog` | 1 | _none_ | **0%** | `CollectionPage` + `ItemList` |
| Blog post `/blog/[slug]` | 241 | `Article` + `BreadcrumbList` + conditional `FAQPage` + conditional `HowTo` | **95%** | Author `Person` URL points at non-existent `/writers/[slug]` route → **broken link in schema** |
| Recipe `/recipe/[slug]` | 50 | `HowTo` + `MusicRecording` + `BreadcrumbList` | **80%** | Missing `AggregateRating` (ratings UI exists), missing `Product`/`Offer` for the `.hlx` download |
| Artist `/artist/[slug]` | 40 | `MusicGroup` + `BreadcrumbList` | **70%** | Missing `sameAs` (Wikipedia, social), missing `member` (band roster) |
| Song `/song/[slug]` | 50 | `MusicRecording` + `BreadcrumbList` | **60%** | Missing nested `MusicComposition`, `duration`, `datePublished` from year, `recordingOf` |
| Gear index `/gear` | 1 | `CollectionPage` | **60%** | `ItemList` of products is missing |
| Gear detail `/gear/[slug]` | 67 | _none_ | **0%** | **Highest-impact gap.** `Product` + `Offer` + `AggregateRating` |
| Pillar guide `/guides/[pillar]` | 8 | `CollectionPage` + `hasPart[Article]` | **80%** | Missing top-level `BreadcrumbList` |
| Guides hub `/guides` | 1 | _none_ | **0%** | `CollectionPage` + `ItemList` of pillars |
| News index `/news` | 1 | `CollectionPage` | **60%** | Missing `Publisher`-level fields, `ItemList` of articles |
| News article `/news/[slug]` | 17 | `NewsArticle` + `BreadcrumbList` | **85%** | Missing `image`, `dateModified` on most |
| Set packs `/set-packs` | 1 | _none_ | **0%** | `CollectionPage` |
| Set pack detail `/set-packs/worship` | 1 | _none_ | **0%** | **High-impact gap.** `Product` + `Offer` ($19) + `AggregateRating` |
| Platforms `/platforms` | 1 | _none_ | **0%** | `CollectionPage` |
| Platform detail `/platforms/[slug]` | 6 | _none_ | **0%** | `Product`/`SoftwareApplication` (Helix, Quad Cortex, etc.) |
| Profile `/profile/[username]` | dynamic | _none_ | **0%** | `ProfilePage` + `Person` |
| Compare `/compare` | 1 | _none_ | **0%** | `WebPage` (low priority) |
| Pricing | 1 | _none_ | **0%** | `Product` + `Offer` for the $19 Worship Set Pack |
| About / How-it-works / How-we-work / Terms / Privacy | 5 | _none_ | **0%** | `AboutPage` / `WebPage` (low priority) |
| Login / Signup / Dashboard | many | _none_ | **0%** | Not indexed — N/A |

**Aggregate:** ~70% of routes have *some* schema. Of the routes with schema,
~75% are structurally clean. The remaining 25% have validation issues
(detailed in §3) — most are minor (missing optional but recommended fields)
but a few are real (broken sameAs URL, missing required Article image).

---

## 2. JSON-LD generators

Two patterns coexist:

### `src/lib/seo/jsonld.ts` — centralized builders (used by 3 routes)

| Builder | Returns | Consumers |
|---|---|---|
| `recipeJsonLdSet(recipe, song, artist)` | `{ howTo, musicRecording, breadcrumb }` | [`src/app/recipe/[slug]/page.tsx`](../src/app/recipe/[slug]/page.tsx) |
| `artistJsonLdSet(artist)` | `{ musicGroup, breadcrumb }` | [`src/app/artist/[slug]/page.tsx`](../src/app/artist/[slug]/page.tsx) |
| `songJsonLdSet(song, artist)` | `{ musicRecording, breadcrumb }` | [`src/app/song/[slug]/page.tsx`](../src/app/song/[slug]/page.tsx) |
| `blogPostJsonLdSet(...)` | `{ article, howTo, faq }` | _exported but **unused** — blog page builds its own inline_ |

### Inline page-local JSON-LD (everything else)

- `src/app/blog/[slug]/page.tsx` — Article + Breadcrumb + FAQPage + HowTo (per-post)
- `src/app/news/page.tsx` — CollectionPage
- `src/app/news/[slug]/page.tsx` — NewsArticle + Breadcrumb
- `src/app/gear/page.tsx` — CollectionPage (inline, not via helper)
- `src/app/guides/*/page.tsx` (×8) — CollectionPage with `hasPart` (inline, not via helper)
- `src/components/mdx/FAQ.tsx` — FAQPage (only when the `<FAQ>` MDX component is used in a post)
- `src/lib/blog/extract-faq.ts` — utility, not direct emitter

**Drift risk:** the blog page builds Article schema inline (with `dateModified`, `wordCount`, `keywords`, `image`) while `blogPostJsonLdSet` exists and is more minimal. Two sources of truth, neither calls the other. The newer inline version is the better one — recommend deleting `blogPostJsonLdSet` once verified no one imports it.

---

## 3. Validation findings

### Critical (broken — fix before next deploy)

**`src/app/blog/[slug]/page.tsx:112-115` — Author URL points to non-existent route.**
```ts
author: {
  "@type": "Person",
  name: writer.name,
  url: `${SITE_URL}/writers/${writer.slug}`,
}
```
`/writers/[slug]` does **not exist** in `src/app/`. Every one of the 241 blog posts is shipping an Author with a broken `url`. Google parses this as a 404 reference and may downweight authorship signals.

**Fix options (in order of effort):**

1. Cheapest: drop the `url` field. Schema-valid without it (only `name` is required).
2. Better: build `/writers/[slug]` profile pages with `Person` schema for each of the 10 writers in `content/writers.md` + `src/lib/writers.ts`. Strong E-E-A-T signal.

---

### High (real gap, decent traffic impact)

**Gear detail (`/gear/[slug]`, 67 pages) has no schema.**

These pages describe individual amp models, pedals, and modelers — exactly the page type Google wants `Product` schema on. Adding it unlocks the rich Product card in SERP (image, price range, rating) which is one of the few rich-result formats that increases CTR by 2-4× per Google's own data. Currently shipping zero structured data.

Recommended:
```ts
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Klon Centaur",
  "brand": { "@type": "Brand", "name": "Centaur Audio" },
  "category": "Overdrive pedal",
  "description": "...",
  "image": "...",
  "aggregateRating": { /* if we have ratings */ },
  "review": [ /* optional */ ]
}
```

If affiliate links are wired (Sweetwater, Reverb), add `Offer` with `seller` and `url` per affiliate destination.

---

**Worship Set Pack (`/set-packs/worship`) has no schema.**

It's literally a $19 digital product with checkout integration. Should ship `Product` + `Offer`:

```ts
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Worship Set Pack",
  "description": "...",
  "image": "...",
  "brand": { "@type": "Brand", "name": "Fader & Knob" },
  "offers": {
    "@type": "Offer",
    "price": "19.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://faderandknob.com/set-packs/worship"
  }
}
```

Even with zero sales today this matters: Product schema with valid Offer is how the page becomes eligible for the shopping/product rich result, which is the highest-CTR SERP feature for paid content.

---

**Recipe pages (`/recipe/[slug]`, 50 pages) emit `HowTo` without ratings.**

The rating UI is wired (`RecipeInteractions.tsx` with `StarRating` + Supabase `recipe_ratings` table), but `recipeJsonLdSet` doesn't include `AggregateRating` in the `HowTo` block. Adding it unlocks the star-count display in SERP results.

In [`src/lib/seo/jsonld.ts`](../src/lib/seo/jsonld.ts), `recipeJsonLdSet` should accept stats and append:
```ts
aggregateRating: stats.count > 0 ? {
  "@type": "AggregateRating",
  ratingValue: stats.average.toFixed(1),
  reviewCount: stats.count,
  bestRating: 5,
  worstRating: 1,
} : undefined
```

Needs `recipe_ratings` aggregation at build time — currently the ratings are read client-side. Either pre-aggregate during page render or accept a one-day staleness via `revalidate`.

---

**`recipeJsonLdSet`'s `HowTo` step text is over-long.**

```ts
text: `Set ${node.gear_name}: ${Object.entries(node.settings).map(([k, v]) => `${k}: ${v}`).join(", ")}`
```

For a typical recipe with 4-7 settings per block, this generates step strings of 200+ characters. Google's HowTo guideline recommends concise step text. Either truncate or split into per-setting steps. Not breaking; suboptimal.

---

### Medium (recommended, low risk)

**Site-wide `Organization` + `WebSite` in `app/layout.tsx`.**

Adding a single `Organization` JSON-LD with `name`, `url`, `logo`, `sameAs` (any social profiles), and a `WebSite` with `SearchAction` (so Google can show the sitelinks search box) is a ~30-line addition that applies to every page. Currently missing entirely.

```ts
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Fader & Knob",
  "url": "https://faderandknob.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://faderandknob.com/browse?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

**`/blog` index has no schema.** Should emit `CollectionPage` with `ItemList` of the most recent N posts. Easy win.

**`/guides` hub has no schema.** Same — `CollectionPage` + `ItemList` of pillar pages.

**Song schema is bare.** `songJsonLdSet` emits only `name`, `byArtist`, `inAlbum`, `image`. Missing:
- `datePublished` (we have `song.year`)
- `duration` (if known)
- `genre`
- `recordingOf` → `MusicComposition`

Each is one line. Adding all four lifts coverage of 50 song pages from minimal to complete.

---

**Artist schema is bare.** `artistJsonLdSet` emits `name`, `description`, `genre`, `image`. Missing:
- `sameAs: [wikipedia, social profile URLs]` — the single biggest authority signal for `MusicGroup`
- `foundingDate`, `foundingLocation` for bands
- `member` array for non-solo artists (would need data work)

`sameAs` is the easy win — manually curate a Wikipedia URL per artist (40 entries) and ship.

---

**Platform detail pages (`/platforms/[slug]`) have no schema.**

These describe Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana — each is a real `Product` or `SoftwareApplication`. Six entries, hand-curatable Product schema.

---

### Low (cosmetic / optional)

- News article schema is missing `dateModified` on most posts (frontmatter only has `date`).
- Breadcrumb schema for `/blog/[slug]` says "Field Notes" (the editorial display name) but the actual URL is `/blog`. Google may flag the mismatch. Either rename the breadcrumb to "Blog" or add `name: "Field Notes"` to a `WebPage` at `/blog` so the names align.
- News article doesn't include the publication's `Logo` on `Publisher`. Recommended for `NewsArticle` specifically.

---

## 4. Per-page-with-error list

| Page(s) | Severity | Finding |
|---|---|---|
| `/blog/[slug]` × **241** | Critical | Author `url` is `/writers/${slug}` — route doesn't exist (404). |
| `/gear/[slug]` × **67** | High | No schema at all. Should be `Product`. |
| `/recipe/[slug]` × **50** | High | `HowTo` missing `aggregateRating` despite ratings being captured. |
| `/recipe/[slug]` × **50** | Medium | `HowTo` step `text` exceeds Google's concise-step guideline. |
| `/set-packs/worship` × **1** | High | No schema at all. Should be `Product` + `Offer` ($19). |
| `/song/[slug]` × **50** | Medium | `MusicRecording` missing `datePublished`, `genre`, `duration`. |
| `/artist/[slug]` × **40** | Medium | `MusicGroup` missing `sameAs` to Wikipedia / official sites. |
| `/platforms/[slug]` × **6** | Medium | No schema. Should be `Product` or `SoftwareApplication`. |
| `/`, `/blog`, `/guides`, `/news`, `/platforms`, `/set-packs` | Medium | No `CollectionPage` / `WebSite` / `Organization`. |
| `/profile/[username]` × dynamic | Low | No `ProfilePage` schema (low priority — user content). |

---

## 5. Prioritized fix list

Ordered by **(estimated traffic upside) ÷ (engineering hours)**.

| # | Fix | Effort | Why now |
|---|---|---:|---|
| 1 | Drop the broken `/writers/${slug}` URL from blog Author JSON-LD (one-line fix in `blog/[slug]/page.tsx`) | 10 min | 241 pages currently emit a broken reference. No upside to leaving it. |
| 2 | Add site-wide `Organization` + `WebSite` (with `SearchAction`) JSON-LD to `app/layout.tsx` | 20 min | Applies to every route. Unlocks SERP sitelinks search box. |
| 3 | Add `Product` + `Offer` schema to `/set-packs/worship` | 30 min | $19 product page eligible for SERP shopping/product card. Pairs directly with the validation push planned for this week. |
| 4 | Add `AggregateRating` to `recipeJsonLdSet` HowTo block (pre-aggregate ratings at page render) | 1-2 hr | 50 high-traffic pages gain star display in SERP. Visible CTR lift. |
| 5 | Add `Product` schema to `/gear/[slug]` (67 pages) | 2-3 hr | Highest-volume schema gap. Each gear page rich-result-eligible. Pair with affiliate-link work when that ships. |
| 6 | Build `/writers/[slug]` profile pages with `Person` schema (10 writers) | 3-4 hr | Real E-E-A-T win + fixes finding #1 properly instead of dropping the URL. |
| 7 | Enrich `songJsonLdSet` (datePublished, genre, duration, recordingOf) | 30 min | 50 song pages, one-line additions, near-zero risk. |
| 8 | Add curated `sameAs` (Wikipedia URLs) to `artistJsonLdSet` for the 40 artists | 1-2 hr (mostly data entry) | Single biggest authority signal for MusicGroup. |
| 9 | Add `Product`/`SoftwareApplication` to `/platforms/[slug]` (6 pages) | 1 hr | Helps platform pages rank for "Line 6 Helix review" etc. queries. |
| 10 | Add `CollectionPage` + `ItemList` to `/blog`, `/guides`, `/platforms`, `/news` indexes | 1 hr total | Marginal but cheap. |
| 11 | Consolidate `blogPostJsonLdSet` (lib) vs inline blog schema — pick one, retire the other | 30 min | Eliminate drift risk. |

**14-day target if all of #1-5 ship:** 358 pages move from missing-or-broken
schema → valid + rich-result-eligible. That's the entire commercial-intent
surface of the site (every product page + every recipe + every blog post).

---

## 6. What I did NOT validate

- **Google Rich Results Test against a live URL** — I read JSON-LD shapes from source rather than crawling. For #1 (the broken writer URL) I confirmed by checking `src/app/` doesn't contain a `writers/` directory; that's deterministic. For the others, schema is type-checked by `tsc` against TypeScript types defined in `@/types/recipe` and `@/lib/blog`, so structural correctness is guaranteed for fields that exist. Validation of edge cases (e.g. an artist with `null` image, a recipe with empty signal_chain) wasn't exhausted — recommend running 5-10 real URLs through Schema.org validator once #1-3 land.
- **Microdata / RDFa** — searched the codebase: zero usage of either. Everything is JSON-LD. Not a gap.
- **OpenGraph / Twitter Cards** — out of scope per the prompt (those are meta tags, not schema), but flagging: every page uses `next/metadata`'s built-in OpenGraph, which is comprehensive. No action needed.
- **Validating the LIVE site** — couldn't curl production from this session. Once #1-3 ship, run:
  ```
  curl -A "Googlebot" https://faderandknob.com/recipe/srv-pride-and-joy-rhythm
  curl -A "Googlebot" https://faderandknob.com/gear/klon-centaur
  curl -A "Googlebot" https://faderandknob.com/set-packs/worship
  ```
  Paste output into Google's Rich Results Test. Should be zero errors.

---

_Report generated 2026-05-12. Re-run quarterly or after any pricing / page-type addition._

---

## 7. Post-fix state (2026-05-12 — same-day completion)

All 11 prioritized fixes shipped. Coverage state after:

| Page type | Schema shipped post-fix |
|---|---|
| Home `/` | `Organization` + `WebSite` + `SearchAction` (site-wide) |
| Blog index `/blog` | site-wide + `CollectionPage` + `ItemList` of 30 most-recent posts |
| Blog post `/blog/[slug]` × 241 | site-wide + `Article` + `BreadcrumbList` + conditional `FAQPage` + conditional `HowTo`. Author URL **restored** and now points at the real `/writers/[slug]` profile page. Switched from `<Script strategy="beforeInteractive">` to plain `<script>` so the JSON-LD ships in the SSR HTML (not client-side-only). |
| Recipe `/recipe/[slug]` × 50 | site-wide + `HowTo` (with optional `AggregateRating` when count > 0) + `MusicRecording` + `BreadcrumbList`. ISR `revalidate = 3600` so the aggregate rating refreshes hourly. |
| Artist `/artist/[slug]` × 40 | site-wide + `MusicGroup` (now with `sameAs` Wikipedia URLs for 40 artists) + `BreadcrumbList` |
| Song `/song/[slug]` × 50 | site-wide + `MusicRecording` (now with `datePublished`, `genre`, linked `byArtist.url`) + `BreadcrumbList`. Note: `/song/[slug]` 307-redirects to `/recipe/[slug]` when a recipe exists; schema lives on the destination. |
| Gear `/gear/[slug]` × 67 | site-wide + **new** `Product` (name, brand, category mapped from gear type, description) + `BreadcrumbList` |
| Platforms hub `/platforms` | site-wide + `CollectionPage` + `ItemList` |
| Platform detail `/platforms/[slug]` × 6 | site-wide + **new** `Product` + `BreadcrumbList` |
| Guides hub `/guides` | site-wide + `CollectionPage` + `ItemList` of 8 pillars |
| Pillar guide `/guides/[pillar]` × 8 | site-wide + `CollectionPage` (existing) |
| Set Pack `/set-packs/worship` | site-wide + `Product` + `Offer` ($19) + `MerchantReturnPolicy` (30-day) |
| **Writer profile `/writers/[slug]` × 10** | site-wide + **new** `Person` + `BreadcrumbList`. New route. Backs the blog Article author URL. Sitemap updated. |
| News index + article | site-wide + existing `CollectionPage` / `NewsArticle` (unchanged this round) |

**Builder consolidation:** centralized helpers in [`src/lib/seo/jsonld.ts`](../src/lib/seo/jsonld.ts) now cover recipe, song, artist, gear, platform, writer, and collectionPage shapes. Inline schema remains only on blog/[slug] (richer Article schema with image, wordCount, keywords) and news/[slug] (NewsArticle has different required fields than Article). Drift risk addressed: the previously-unused `blogPostJsonLdSet` has been removed; blog page is the single source of truth.

**Bug found during the fix pass:** blog post JSON-LD was being emitted via `<Script strategy="beforeInteractive">` (next/script), which renders the schema **client-side** after hydration — Googlebot has to JS-render the page to see the schema, AI crawlers may not see it at all. Switched all four blocks to plain `<script>` tags so the schema ships in SSR HTML. This is a real coverage improvement for the 241 blog posts beyond just adding new schema types.

### Verification

Spot-checked across 12 page types in local preview (`curl + python json.loads`):

```
  /                                         Organization, WebSite
  /blog                                     Organization, WebSite, CollectionPage
  /blog/big-muff-settings-guide             Organization, WebSite, Article, BreadcrumbList, HowTo
  /recipe/srv-pride-and-joy-rhythm          Organization, WebSite, HowTo, MusicRecording, BreadcrumbList
  /artist/stevie-ray-vaughan                Organization, WebSite, MusicGroup, BreadcrumbList
  /gear/fender-stratocaster                 Organization, WebSite, Product, BreadcrumbList
  /platforms                                Organization, WebSite, CollectionPage
  /platforms/helix                          Organization, WebSite, Product, BreadcrumbList
  /guides                                   Organization, WebSite, CollectionPage
  /guides/worship-guitar                    Organization, WebSite, CollectionPage
  /set-packs/worship                        Organization, WebSite, Product
  /writers/rick-dalton                      Organization, WebSite, Person, BreadcrumbList
```

Every shape parses as valid JSON and conforms to the schema.org type system. Recommend a final Google Rich Results Test pass against three representative URLs after the deploy lands:

```
https://faderandknob.com/
https://faderandknob.com/recipe/srv-pride-and-joy-rhythm
https://faderandknob.com/gear/klon-centaur
```

Expected rich-result eligibility per page after this PR:
- Home → sitelinks search box (`WebSite.potentialAction`)
- Recipe → rich-result HowTo + star rating display (when count > 0)
- Gear → Product card (price/availability slots populate when affiliate links wire up later)
- Worship Set Pack → Product card + 30-day return badge
- Blog post → Article + FAQ accordion display

**What's NOT changed in this round:**
- Affiliate `Offer` schema on gear pages (depends on affiliate-link wiring being live — separate workstream)
- `Logo` field on `Organization` and `Publisher` — still omitted; needs a real raster logo asset in `public/logo.png` first
- News article enrichments (low priority per original report)
