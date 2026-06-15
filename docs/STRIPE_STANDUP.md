# Stripe Standup — Get Money Flowing

**Verified against live config 2026-06-12.** Every claim below was checked today against the repo, the Vercel project env, and the code — not the April research notes.

**Total time: ~45 minutes of dashboard clicking. Zero code changes required** — checkout, webhook, billing portal, and Set Pack code are all shipped and waiting on configuration.

---

## What exists in code (ready to go)

| Flow | Route | Status |
|---|---|---|
| Pass subscription — $39/yr or $4.99/mo | `src/app/api/checkout/route.ts` | ✅ Shipped. Reads price IDs from env (see Gap 2) |
| Set Packs one-time — Worship $19 | `src/app/api/set-packs/` | ✅ Shipped. Auto-creates the Stripe product on first checkout |
| Webhook (role upgrades, cancellations) | `src/app/api/webhooks/stripe/route.ts` | ✅ Handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` |
| Billing portal | `src/app/api/billing/portal/route.ts` | ✅ Shipped |
| DB migrations | `015_stripe_columns`, `018_set_pack_purchases`, `019_pass_subscription` | In repo — **verify applied** (Step 4) |

## The gaps (why checkout fails today)

1. **`STRIPE_SECRET_KEY` is (probably) still a publishable key.** The local `.env.local` copy is `pk_live_…` — a *publishable* key in the *secret* key slot. Every Stripe API call fails with it. The Vercel Production value is marked sensitive (can't be read back) and was created 68 days ago — same era the bad key was found — so assume it's wrong until verified.
2. **`STRIPE_PASS_PRICE_ID_ANNUAL` / `STRIPE_PASS_PRICE_ID_MONTHLY` don't exist anywhere** — not in Vercel, not locally. The checkout route returns "Pricing not configured" without them. The Stripe product + prices have never been created.
3. **Webhook registration unverified.** `STRIPE_WEBHOOK_SECRET` exists in Vercel (68d old), but it's unknown whether a webhook endpoint is actually registered in the Stripe dashboard, pointed at the right URL, with the right events.
4. **Migrations may not be applied** to the live Supabase project.
5. **Local dev env is broken** — `.env.local` has no Supabase vars at all (auth-dependent pages can't run locally) and carries the bad Stripe key.

---

## Step 1 — Fix the secret key (10 min)

1. [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys) (live mode).
2. Best practice: **Create restricted key** instead of using the master secret. Name it `tone-recipes-vercel`, grant **Write** on: Checkout Sessions, Customers, Subscriptions, Products, Prices, Billing Portal (Customer portal). Everything else None. (The master `sk_live_` works too if you want to skip this.)
3. Update Vercel — paste the `rk_live_…` / `sk_live_…` value when prompted:
   ```sh
   npx vercel env rm STRIPE_SECRET_KEY production && npx vercel env add STRIPE_SECRET_KEY production
   npx vercel env rm STRIPE_SECRET_KEY preview    && npx vercel env add STRIPE_SECRET_KEY preview
   ```
4. Grab your **test-mode** key (`sk_test_…`) and put it in `.env.local`, replacing the `pk_live_` line — local dev should never touch live mode.

## Step 2 — Create the Pass product + prices (10 min)

1. [Dashboard → Product catalog → Add product](https://dashboard.stripe.com/products?create=product) (live mode):
   - Name: **Fader & Knob Pass**
   - Price 1: **$39.00 USD / year** (recurring)
   - Price 2 (add on same product): **$4.99 USD / month** (recurring)
2. Copy both price IDs (`price_…`) from the product page.
3. Add to Vercel (production + preview):
   ```sh
   npx vercel env add STRIPE_PASS_PRICE_ID_ANNUAL production
   npx vercel env add STRIPE_PASS_PRICE_ID_MONTHLY production
   npx vercel env add STRIPE_PASS_PRICE_ID_ANNUAL preview
   npx vercel env add STRIPE_PASS_PRICE_ID_MONTHLY preview
   ```
4. Optional but recommended: repeat product creation in **test mode**, put those test price IDs in `.env.local`.

> Set Packs need no price setup — `ensureSetPackPrice()` creates the product on first checkout automatically.

## Step 3 — Register the webhook (5 min)

1. [Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks) (live mode). Check if an endpoint for `faderandknob.com` already exists.
2. If not (or if it's wrong), **Add endpoint**:
   - URL: `https://faderandknob.com/api/webhooks/stripe`
   - Events (exactly these three):
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
3. Copy the signing secret (`whsec_…`) and update Vercel:
   ```sh
   npx vercel env rm STRIPE_WEBHOOK_SECRET production && npx vercel env add STRIPE_WEBHOOK_SECRET production
   ```

## Step 4 — Verify DB migrations applied (5 min)

Supabase Dashboard → SQL Editor, run:

```sql
-- All three should return rows. If any comes back empty, paste the
-- matching file from supabase/migrations/ into the SQL editor and run it.
SELECT column_name FROM information_schema.columns
  WHERE table_name = 'profiles' AND column_name IN ('stripe_customer_id', 'stripe_subscription_id');   -- 015
SELECT 1 FROM information_schema.tables WHERE table_name = 'set_pack_purchases';                        -- 018
SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'profiles_role_check';              -- 019: must include 'pass'
```

## Step 5 — Redeploy + live smoke test (10 min)

Env changes only apply to new deployments:

```sh
npx vercel redeploy --prod   # or: git commit --allow-empty -m "redeploy for stripe env" && git push
```

Then the real-money test (cheapest path — monthly, then refund):

1. Log in to faderandknob.com with a personal (non-admin) account → Pricing → subscribe **monthly ($4.99)** with a real card.
2. Watch it land:
   - Stripe Dashboard → Payments: payment succeeded
   - Stripe → Webhooks → endpoint: `checkout.session.completed` delivered, **200 response**
   - Supabase → `profiles` row: `role = 'pass'`, `stripe_customer_id` + `stripe_subscription_id` set
   - Site: Pass-gated content unlocked; "Manage billing" opens the Stripe portal
3. Cancel via the billing portal → confirm webhook fires `customer.subscription.updated/deleted` and the role behavior matches expectations.
4. Refund yourself in the Stripe dashboard.

If the webhook shows non-200 responses: Vercel → Project → Logs, filter `/api/webhooks/stripe` — the route logs every event type and parse step.

## Step 6 — Cleanup (5 min, optional but do it)

- [ ] `.env.local`: `sk_test_` key in `STRIPE_SECRET_KEY`, test price IDs, plus `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (copy from Supabase dashboard → Settings → API) so auth works in local dev.
- [ ] `src/lib/stripe.ts` has a stale comment block (~line 28) claiming subscriptions were retired and `/api/checkout` was removed — both untrue since the Pass relaunch. Delete or update the comment.
- [ ] For local webhook testing later: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` (Stripe CLI prints a temporary `whsec_` for `.env.local`).

---

## Done = 

A stranger can go from `/pricing` → pay $4.99 → `role='pass'` in Supabase → gated content unlocked → cancel themselves in the portal, with every webhook delivery showing 200. Once that's true, Set Packs work automatically with zero additional config.
