# Content Syndication

Automated republishing of F&K blog posts to outside platforms, with credit
pointing back to faderandknob.com. Shipped 2026-11-19.

**Code:** `src/app/api/cron/syndicate/route.ts` (runner),
`src/lib/syndication/content.ts` (HTML extraction + article shapes),
`src/lib/syndication/platforms.ts` (adapters),
`supabase/migrations/029_syndication_ledger.sql` (ledger),
`.github/workflows/syndicate-cron.yml` (daily trigger, 15:30 UTC),
`tests/syndication-content.test.ts`.

## Why it's built this way

The old web 2.0 play (full copies on many free blogs, all linking home) is a
link scheme under Google's spam policies. It also backfires on a young domain:
a Medium or Blogger copy can outrank the original, and on Bing it can be the
page ChatGPT cites. That runs against `AI_SEARCH_PLAYBOOK.md`. So every
platform gets one of two treatments, fixed per platform in code:

| Mode | What goes out | Platforms | Why |
|---|---|---|---|
| **full** | Whole article, "Originally published on F&K" at top and bottom, cross-domain `rel=canonical` to our URL | Medium, Hashnode | Their APIs set the canonical for us (`canonicalUrl` / `originalArticleURL`) |
| **excerpt** | Hero, description, up to 4 takeaways, "Read the full guide" link | Blogger, WordPress.com | No per-post cross-domain canonical, so a full copy would compete with the original |

Timing guards:
- **Full copies wait 7 days** (`SYNDICATE_DELAY_DAYS`) after our publish date
  so Google indexes the original first. Excerpts wait 1 day.
- **2 posts per platform per run** (`SYNDICATE_PER_RUN`). A backlog goes out
  slowly, not all at once.
- **Window:** only posts dated after `SYNDICATE_SINCE` (default: 30 days back).
  Turning this on does not dump all 450+ posts. Move the date back to
  backfill on purpose.
- **Drafts first:** `SYNDICATE_DRAFT` defaults to `true`, so remote posts are
  created as drafts. Check a few, then set it to `false`.

Body source: the cron fetches its own rendered `/blog/<slug>` page over
loopback and cuts out `.post-body`. The MDX can't be used directly because
290+ posts use custom components. Knob and SettingsGrid readings become plain
lists. In-body CTAs (`<aside>`), SVG, classes and styles are stripped, and
all links and images become absolute faderandknob.com URLs. Medium has no
tables, so tables become "Header: value" lists there. The FAQ, related posts
and the site chrome are left out. A cleaned body under 500 characters is
refused, which guards against a markup change silently shipping empty posts.

Ledger: one row per (platform, slug). Each slot is claimed as `pending`
before the API call, so overlapping runs can't double-post. Failures retry up
to 3 times. A `pending` row older than an hour means a run died mid-publish.
It is reported (the workflow fails and files an issue) and never retried
automatically, because the remote post may already exist. Check the platform,
then set the row to `published` or delete it.

## One-time setup

1. **Apply migration 029** to production Supabase (`syndication_ledger`).
   Real runs return 500 until it exists. Dry runs work without it.
2. **Create the accounts.** Brand them "Fader & Knob" with the bio linking to
   faderandknob.com. Then put each platform's env vars in `.env.production`
   on the droplet (`/opt/faderandknob`) and `docker compose up -d app`. A
   platform switches on only when all of its vars are set.

   | Platform | Env vars | How to get them |
   |---|---|---|
   | Medium | `MEDIUM_TOKEN` | Settings → Security and apps → Integration tokens. **Medium stopped issuing new tokens in 2023.** If the account has none, skip this and use Medium's manual "Import a story" (it also sets the canonical). |
   | Hashnode | `HASHNODE_TOKEN`, `HASHNODE_PUBLICATION_ID` | Create a blog (custom domain optional), then Settings → Developer → Personal Access Token. The publication id is in the blog dashboard URL. |
   | Blogger | `BLOGGER_BLOG_ID`, `BLOGGER_CLIENT_ID`, `BLOGGER_CLIENT_SECRET`, `BLOGGER_REFRESH_TOKEN` | Google Cloud OAuth client (Desktop type) with the Blogger API enabled. Get a refresh token once for scope `https://www.googleapis.com/auth/blogger` (OAuth Playground with "use your own credentials" works). **Set the OAuth consent screen to "In production"**, or Google expires the refresh token after 7 days. The blog id is in the Blogger dashboard URL. |
   | WordPress.com | `WORDPRESS_TOKEN`, `WORDPRESS_SITE` | Register an app at developer.wordpress.com/apps and run the OAuth flow once for a token (they don't expire). `WORDPRESS_SITE` is the site domain, e.g. `faderandknob.wordpress.com`. |

   Optional tuning: `SYNDICATE_DRAFT`, `SYNDICATE_DELAY_DAYS`,
   `SYNDICATE_PER_RUN`, `SYNDICATE_SINCE`.
3. **Preview** with Actions → Syndication cron → Run workflow (dry run is
   ticked by default). To see the exact article a platform would get, run
   this inside the app container:
   `fetch("http://localhost:3000/api/cron/syndicate?dry=1&platform=medium&slug=<slug>")`
   with the CRON_SECRET bearer (add `&format=md` for Markdown).
4. **Go live:** set the repo variable `SYNDICATE_ENABLED=true` (starts the
   daily schedule). Leave `SYNDICATE_DRAFT` at `true` for the first few runs,
   check the drafts, then set it to `false` in `.env.production`.

## Not included, on purpose

- **Tumblr:** OAuth2 refresh tokens rotate on every use, so the token would
  have to live in the database. Add it if the other platforms pay off.
- **dev.to:** supports a canonical, but it's a developer community. Guitar
  posts there would be off-topic and get flagged.
- **LinkedIn articles, Substack:** no publishing API.
- **Re-syncing edits:** a post is syndicated once. Later edits to the
  original don't propagate, which is fine because the canonical/link sends
  readers to the current version.

## Measuring it

Referral sessions from medium.com, hashnode.dev, blogspot.com and
wordpress.com in GA4. Check Bing Webmaster AI Performance
(`BING_AI_CITATIONS.md`) for syndicated copies being cited instead of the
original. If that happens, switch that platform to excerpt mode.
