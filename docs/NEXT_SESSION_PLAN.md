# Next Coding Session — Plan

**Drafted:** 2026-05-10
**Role taken:** Senior product engineer, growth focus
**Reviewer to brief:** the next agent / engineer working on faderandknob.com
**Estimated work:** one focused session, ~4-6 hours

---

## Why this role

Two compounding pieces of infrastructure now run on autopilot:

- **`daily-content-production`** ships 5 blog posts/day with hero images, SERP analysis, and writer-persona velocity tracking.
- **`daily-recipe-production`** (new, started 2026-05-10) ships 5 tone recipes/day from a 60-song prioritized backlog, gated by an audit suite that prevents drift.

Content velocity isn't the bottleneck anymore. The bottleneck is what happens when traffic lands on the site. That's a product/funnel problem. So the lens for this session is **"where is the conversion funnel leaking?"** not **"what should we write next?"**

---

## State of play (as of 2026-05-10)

### What's built and working

| System | State | Evidence |
|---|---|---|
| Recipe catalog | 50 recipes, 0 errors, 38/50 fully clean | `npx tsx scripts/audit-recipes.ts` |
| Blog | 236 published MDX posts | `ls content/blog/*.mdx \| wc -l` |
| Schema markup | Recipe pages emit HowTo + MusicRecording + Breadcrumb JSON-LD; blog emits Article | `src/lib/seo/jsonld.ts`, `src/app/recipe/[slug]/page.tsx:148-165`, `src/app/blog/[slug]/page.tsx:181-202` |
| Sitemap | 250+ URLs (recipes, artists, gear, blog, news, pillar guides, static) | `src/app/sitemap.ts` |
| Analytics | Vercel Analytics + GA4 (`G-PZLWYT7VMP`) + Microsoft Clarity all loaded | `src/app/layout.tsx:125-138` |
| Auth | Supabase auth with login + signup flows | `src/app/(auth)/` |
| Newsletter | Wired to Supabase `newsletter_subscribers` table, rate-limited, dedup on unique constraint | `src/app/api/newsletter/route.ts` |
| Stripe | Checkout API + webhook routes implemented | `src/app/api/checkout/route.ts`, `src/app/api/webhooks/stripe/` |
| Pricing | Free / $7 Tone Pass / $12 Pro tiers | `src/app/pricing/page.tsx` |
| Set Packs | Worship pack live with 8 snapshots + Setlist Mapper + DownloadSetPackButton | `src/app/set-packs/worship/page.tsx` |
| Comments + ratings | Wired with `RecipeInteractions` + `CommentSection` per recipe | `src/app/recipe/[slug]/RecipeInteractions.tsx` |
| Daily routines | content + news + recipe production all on cron | `~/.claude/scheduled-tasks/` |

### Where the funnel is leaking — three concrete diagnoses

**1. 159 of 236 blog posts have no SaveThisTone CTA.**

Reproduce: `grep -L "SaveThisTone" content/blog/*.mdx | wc -l` → 159.

Those posts attract search traffic, the user reads, then — nothing. No prompt to /browse, no email capture, no link to a relevant recipe. `SaveThisTone` is the sanctioned conversion component (`src/components/mdx/SaveThisTone.tsx`) and it works either as a recipe-linked card (pulls live recipe data) or freeform pointing at `/browse?tag=...`. We're missing it on 67% of the blog.

**2. Set Packs "Notify me when available" is plain text.**

`src/app/set-packs/page.tsx:78` literally renders `<p>Notify me when available</p>` for the three coming-soon packs (Classic Rock, 90s/Alternative, Blues). No email capture. Visitors who clearly want a Classic Rock pack can't tell us they want it. With 50 recipes now in the catalog, the data is there to actually ship Classic Rock — but we have zero list of who's waiting for it.

**3. Free-tier recipe pages have no in-flow upgrade prompt.**

`src/app/recipe/[slug]/page.tsx` renders the full chain for free with no friction. That's correct (we want it indexed and linkable) — but there's no soft prompt like "Save this recipe to your library" or "Download the .hlx preset (Tone Pass)" inline with the platform tabs. Users hit the page, find their tone, leave. The pricing page exists at `/pricing` but it's a separate destination, not an in-flow upsell.

### Where instrumentation is in place but probably not firing

GA4, Clarity, and Vercel Analytics all load. But there's no evidence of explicit `gtag('event', ...)` calls for the conversion events that matter most:
- Blog SaveThisTone click → /browse
- Recipe page → "Save this tone" / "Download preset"
- /pricing → /signup → Stripe checkout completion
- Set Pack "Notify me" submit (once it's real)

Without events fired at each step, you can't compute conversion rate per step. Heatmaps from Clarity will tell you where users click; events tell you what they did. Both are needed to do anything informed about funnel optimization.

---

## Proposed session plan

**One session, three big wins, in this order.** Each step has acceptance criteria so you'll know it's done.

### Step 1 — Wire up conversion-event firing (60 min)

The smallest possible wedge. Without events, every other change in this plan is unmeasurable.

Create `src/lib/analytics.ts`:

```ts
type EventName =
  | "save_this_tone_click"        // SaveThisTone CTA on blog
  | "browse_card_click"           // browse card → recipe
  | "recipe_save_click"           // recipe page → save
  | "recipe_download_click"       // recipe page → preset download
  | "set_pack_notify_submit"      // Step 2's new flow
  | "set_pack_purchase_click"     // worship pack download / buy
  | "newsletter_submit"           // already exists, instrument it
  | "signup_start"                // /signup page view
  | "checkout_start"              // POST /api/checkout
  | "checkout_complete";          // Stripe webhook

export function track(event: EventName, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  // GA4
  (window as any).gtag?.("event", event, params ?? {});
  // Vercel Analytics custom event
  (window as any).va?.track(event, params ?? {});
}
```

Then add `track()` calls to:
- `src/components/mdx/SaveThisTone.tsx` — fire `save_this_tone_click` on the primary `<Link>`
- `src/app/browse/page.tsx` — fire `browse_card_click` on each card link
- `src/app/recipe/[slug]/RecipeInteractions.tsx` — fire `recipe_save_click` on the save button
- `src/components/recipe/SaveButton.tsx` and any preset-download buttons — fire `recipe_download_click`
- `src/components/newsletter/...` — fire `newsletter_submit` on success
- `src/app/api/webhooks/stripe/.../route.ts` — server-side: log `checkout_complete` to a Supabase `events` table OR call Measurement Protocol API server-side. (Either works; Supabase is simpler and we can replay.)

**Acceptance criteria:**
- `track("save_this_tone_click", { recipe_slug, source: "blog" })` fires from the SaveThisTone component on blog posts
- GA Realtime view shows the event within 60 seconds of clicking
- Vercel Analytics "Custom Events" tab also shows it
- No console errors when `gtag` or `va` aren't loaded (e.g. local dev)

### Step 2 — Bulk-add SaveThisTone to the 159 missing blog posts (90-120 min)

Largest single-session conversion win available. Two-phase approach:

**Phase 2a — write a script that classifies which posts get which CTA.** Each blog post has tags. Map tags to a recipe slug or a /browse filter:

| Blog post tag | CTA target |
|---|---|
| Mentions a specific song we have a recipe for | `<SaveThisTone recipeSlug="..." />` (recipe-linked variant) |
| Tagged with a guitarist who has multiple recipes | `<SaveThisTone href="/browse?artist=..." />` |
| Pedal/gear comparison post | `<SaveThisTone href="/browse?tag=<gear>" />` |
| General modeler / amp guide | `<SaveThisTone href="/browse" />` (default) |

Run the classifier once, generate a CSV of `slug,cta_type,target`, hand-review, then a second script writes the CTA in. Place: just before the closing of the post's main content, after the FAQ block.

**Phase 2b — preflight via the existing MDX validator.** `npx tsx scripts/validate-mdx.mts` — must exit 0 before commit. The `daily-content-production` task already established this preflight as load-bearing; reuse it.

**Acceptance criteria:**
- `grep -L "SaveThisTone" content/blog/*.mdx | wc -l` returns 0 (or close to 0; some posts may not warrant a CTA — make those exceptions explicit by adding a `cta: "none"` frontmatter field rather than just leaving them out)
- All 236 posts compile through validate-mdx
- Spot-check 5 modified posts to confirm the CTA target is contextually relevant, not generic
- Commit message lists how many got recipe-linked vs freeform CTAs

### Step 3 — Real "Notify me" capture on Set Packs (45 min)

Small change, real signal. `src/app/set-packs/page.tsx:78` becomes a small inline form posting to a new `/api/set-packs/interest` endpoint that writes to a Supabase `set_pack_interest` table:

```sql
create table set_pack_interest (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  pack_slug text not null,
  source text default 'set_packs_page',
  created_at timestamp with time zone default now(),
  unique (email, pack_slug)
);
```

The form should:
- Collect email + (implicit) `pack_slug`
- Rate-limit 5 submits per minute per IP (mirror the newsletter route's pattern)
- Auto-confirm (no double opt-in for now, this is interest signal not a marketing list)
- Fire `track("set_pack_notify_submit", { pack_slug })` on success
- Show a success state inline ("We'll email you when Classic Rock ships")

**Acceptance criteria:**
- All 3 coming-soon packs have a working email-capture form
- Submitting the form writes a row to `set_pack_interest`
- Resubmitting same email + pack returns 200 idempotently (no error to the user)
- The first time we run `select pack_slug, count(*) from set_pack_interest group by pack_slug` we get our priority order for which pack to ship next

### Stretch — In-flow upgrade prompt on recipe pages (30 min if time)

In `src/app/recipe/[slug]/page.tsx`, just below the `platform-switcher`, add a soft upsell visible only to non-paying users:

> "Get the .hlx preset → **Tone Pass · $7/mo**" linking to `/pricing?from=recipe&recipe=<slug>`

The recipe page is already free — the prompt just makes the path to upgrade visible without forcing it. Track impressions and clicks separately.

**Acceptance criteria:**
- Visible only when `useUser()` hook returns a user without an active Tone Pass / Pro plan
- Hidden for anonymous users (don't pre-paywall before they've engaged)
- Fires `track("upgrade_prompt_view", { recipe_slug })` on impression and `track("upgrade_prompt_click")` on click

---

## Out of scope for this session — flag and defer

These are real opportunities but each is its own session:

1. **ToneTrace MVP scaffold** — the planned 10x product (audio in → matched signal chain). The audit-rule infrastructure I built (`scripts/audit-recipes.ts`, canonical knob orders, mirror exemptions) is the structured-data foundation it needs. Treat as a separate multi-day project.

2. **Performance / Core Web Vitals audit** — likely fine given Next.js + image optimization defaults, but no one has actually measured. Worth a separate session with WebPageTest + Lighthouse CI on the top 5 traffic pages.

3. **Set Pack expansion** — Classic Rock pack should ship next based on (likely) interest-list signal once Step 3 collects data for a couple weeks. The recipes are now in the catalog (Slash, Page, EVH, Gibbons, etc.), so the underlying content exists; just needs the per-pack snapshots assembled and a Setlist Mapper.

4. **Polish remaining 12 warn-only recipes** — low impact; they render fine, just have stylistic warns. The weekly-recipe-audit task will chew through these on its own cadence.

5. **/community/forum activity** — hasn't seen meaningful engagement. Either build it up or quietly retire it. Either way, a product call, not a code call.

---

## Gotchas the next engineer will hit

- **Recipe count grows daily.** When the daily-recipe-production task fires (11:13 AM daily), the catalog adds 5 recipes. By next session it'll likely be 55-65. Don't hardcode "50" anywhere.
- **MDX parser is real.** `<0.1%`, inch-mark `"`, and `{ note }` in prose break the build (~6 min after push). Always run `npx tsx scripts/validate-mdx.mts --changed` before committing blog-post edits.
- **`.fk-preview` button reset is global.** `src/app/v3.css:53` zeros padding/border on every button inside `.fk-preview`. Any Tailwind button styling won't survive the reset. Override with explicit padding in v3.css scoped to the parent context (this is how the comment Post button got fixed on 2026-05-10 — see commit `1a29236`).
- **Apple Music URLs drift.** Twice now (Morello, Dimebag) Apple has matched the wrong release to a song's `album_art_url`. The weekly-recipe-audit task re-verifies, but if you're adding new songs by hand, **always download the URL and visually inspect with the Read tool** before committing. The audit script `scripts/audit-album-art.ts` has 5 known-false-positive cases (Layla, Tom Sawyer, How Soon Is Now, Creep, No One Knows) that are *correct* — don't "fix" those.
- **Working tree assumption.** Every routine starts with `git pull --rebase` and verifies a clean tree. Same expectation for human sessions.
- **Cron times are off-:00/:30.** Existing schedule: 9:09 AM blog, 9:24 AM news, 11:13 AM recipes, 8:47 AM Sun audit. If you add another, pick a non-round minute.

---

## How to verify this plan worked

A week after Step 1+2 ship:
- GA Realtime → "Events" should show `save_this_tone_click` accumulating from blog traffic. Pick the 3 highest-volume blog posts and check those specifically.
- Compare 7-day signup count before vs. after the SaveThisTone bulk-add. If we land 1-2% more signups per blog session, that's the conversion lift we're betting on.
- `select pack_slug, count(*) from set_pack_interest` should have actual numbers.

If none of those move, the bottleneck is upstream of conversion (e.g. people aren't even reading to the bottom of posts) or downstream (the /browse page doesn't convert browsers to savers/signups). That's the next session's investigation.

---

## File reference for the session

| What you're touching | Path |
|---|---|
| New: analytics shim | `src/lib/analytics.ts` |
| Modify: SaveThisTone | `src/components/mdx/SaveThisTone.tsx` |
| Modify: browse cards | `src/app/browse/page.tsx`, `src/app/page.tsx` (audition shelf) |
| Modify: recipe interactions | `src/app/recipe/[slug]/RecipeInteractions.tsx` |
| Modify: newsletter form | wherever `"website"` source is captured (`src/components/newsletter/` or inline on `src/app/page.tsx:222`) |
| Modify: stripe webhook | `src/app/api/webhooks/stripe/route.ts` |
| New: set pack interest API | `src/app/api/set-packs/interest/route.ts` |
| New: set pack interest schema | Supabase migration `set_pack_interest` table |
| Modify: set packs page | `src/app/set-packs/page.tsx` (the "Notify me" plaintext at line 78) |
| Bulk: 159 blog posts | `content/blog/*.mdx` (use a script + hand-review) |
| Validation: MDX preflight | `npx tsx scripts/validate-mdx.mts` |
| Validation: TS compile | `npx tsc --noEmit -p tsconfig.json` |
| Validation: recipe audit | `npx tsx scripts/audit-recipes.ts` |
