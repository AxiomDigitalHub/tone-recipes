# Core Service MVP Checklist

**Goal:** The service works. A paying customer can sign up, find a recipe, trust it, download a working preset, and pay us money. Every preset loads. Every checkout completes.

Nothing here is "nice to have." Everything is required to be operational.

---

## 🔴 Blocker 1: Payment Flow Doesn't Actually Work Yet

We wired up Stripe but never verified a dollar can flow through it.

- [ ] Run Supabase migration 015 (adds `stripe_customer_id` and `stripe_subscription_id` columns to profiles table). Without this, the webhook will fail when a customer completes checkout.
- [ ] Verify `STRIPE_SECRET_KEY` in Vercel is set to a test key (`sk_test_...`)
- [ ] Verify `STRIPE_WEBHOOK_SECRET` is set and matches the registered endpoint
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- [ ] Create a test account on faderandknob.com
- [ ] Click "Start Tone Pass" on the pricing page
- [ ] Complete checkout with Stripe test card `4242 4242 4242 4242`
- [ ] Verify user role updates to `premium` in the database
- [ ] Verify the user can download presets without hitting the 10-download limit
- [ ] Trigger a subscription cancellation in Stripe dashboard
- [ ] Verify the webhook downgrades the user to `free`
- [ ] Only after all above pass: switch to live keys

**Time estimate:** 1-2 hours including debugging.

---

## 🔴 Blocker 2: Catalog Looks Unfinished

54 out of ~60 blog posts have no hero image. This looks broken.

- [ ] Regenerate Replicate API token at replicate.com/account/api-tokens
- [ ] Fund Replicate account (~$5 covers everything)
- [ ] Store new token in `.env.local` (never in a script file — GitHub push protection caught it last time)
- [ ] Run `scripts/gen-images-simple.sh` to generate all missing hero images ($1.35 total)
- [ ] Verify images appear on blog index and individual post pages

**Time estimate:** 30 minutes once token is regenerated.

---

## 🔴 Blocker 3: Nothing Verifies Presets Still Work

We trimmed the displayed platforms to Physical/Helix/Katana but never re-verified the 50 existing recipes render correctly on recipe pages.

- [ ] Spot-check 5 random recipe pages on faderandknob.com
- [ ] Verify the signal chain animates
- [ ] Verify the Helix tab shows translation
- [ ] Verify the Katana tab shows translation (where present)
- [ ] Click "Download .hlx" on 3 different recipes
- [ ] Load each .hlx into HX Edit on the Helix LT
- [ ] Confirm the preset loads without errors, sounds reasonable, and matches the recipe

**Time estimate:** 1 hour.

---

## 🟠 Trust Gap 1: No One Can Hear the Tones

This is the single biggest reason someone won't pay. They can't tell if the preset gets them what they want.

**Minimum operational:** Audio previews on the 10 most-trafficked recipe pages. Not all 50. Just the ones that drive the most value.

- [ ] Define recording standard and document it (one page, in `docs/`)
- [ ] Set up Cloudflare R2 bucket (free tier, no egress fees)
- [ ] Record 10 reference clips using the Helix LT, DI-only, 10-15 seconds each
- [ ] Upload to R2
- [ ] Add an `audio_reference_url` field to recipe data (optional, backwards compatible)
- [ ] Build a simple `<AudioPreview />` component with a play button (Howler.js or plain HTML5 audio)
- [ ] Render the audio preview on recipe pages when `audio_reference_url` is set

**Time estimate:** 1 full day for the recording session + 4 hours to ship the component. This is the highest-leverage work you can do.

**Bonus: this is ToneTrace Phase 1 critical path data.** Every clip you record for audio previews is also training data for ToneTrace's retrieval engine later.

---

## 🟠 Trust Gap 2: No Welcome Email

A user signs up → gets a confirmation from Supabase → hears nothing from us. Broken loop.

- [ ] Set up Buttondown ($9/mo, 1K subs) or Resend (free tier for transactional)
- [ ] Connect newsletter signup form on homepage/blog/pricing to the ESP
- [ ] Write a 1-email welcome that:
  - Thanks them for signing up
  - Points them to the 5 most popular recipes
  - Mentions the worship set pack if they expressed interest
  - Sets expectations for what they'll get (1 email/week, new recipes)
- [ ] Trigger the welcome email via ESP webhook or Supabase function
- [ ] Test with a real signup

**Time estimate:** 3-4 hours.

**The 5-email sequence, "Sunday Setlist" concept, and all the other email research can come later.** We just need the welcome email for now.

---

## 🟡 Catalog Depth: 50 Recipes Is Too Thin

A single paying customer will exhaust the catalog in a session. We need ~100 before any real marketing push.

**Operational minimum: 75 recipes.** That's a stretch goal, not a blocker.

- [ ] 10 new worship recipes (Elevation, Hillsong, Bethel, Maverick City, Phil Wickham — top CCLI songs)
- [ ] 10 new classic rock recipes
- [ ] 5 new blues recipes

Every new recipe needs:
- Full signal chain with settings
- Helix translation (tested on real hardware)
- Katana translation (where feasible)

**Time estimate:** Automated content pipeline + manual QA. A few days for 25 recipes if AI-assisted.

---

## ✅ Done — Already Operational

These are already working and don't need action:

- Recipe browse + search + detail pages
- Helix .hlx preset generation (tested)
- Boss Katana .tsl preset generation
- Google OAuth + user auth
- Security hardening (webhooks, rate limiting, admin guard, headers)
- AI Transparency page + footer disclosure
- Pricing page with $7/$12 tiers
- Worship Set Pack with Setlist Mapper
- Signal chain visualization
- 60+ blog posts (just need images)

---

## Definition of "Operational"

When you can truthfully say all of these:

1. ✅ **"A stranger can pay us money."** Stripe end-to-end tested.
2. ✅ **"Every recipe loads and every preset works."** Spot-checked.
3. ✅ **"The site doesn't look broken."** Blog images generated.
4. ✅ **"A guitarist can hear at least some of our tones before buying."** Audio on top 10 recipes.
5. ✅ **"A new signup gets a welcome email."** Basic ESP wired up.

That's the MVP. Everything past that is growth.

---

## What NOT to Work On Until MVP Is Done

- ToneTrace (separate roadmap, blocked by MVP)
- YouTube channel
- Affiliate programs
- Mobile/PWA
- Set Pack expansion beyond worship
- Fractal/QC/Kemper/TONEX exports
- Pillar pages / SEO content beyond normal blog cadence
- Community features (forum, comments, tone challenges)
- Planning Center integration

All of those are in `ROADMAP.md` as post-MVP. They're valuable. They're just not blockers.

---

*Update this checklist as items complete. When every checkbox is checked, the core service is operational and we can start growth work.*
