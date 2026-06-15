# Stripe Live Mode + Cancellation Compliance — Implementation Spec

**Status:** Ready to implement
**Estimated effort:** 1 to 2 focused days
**Blocking:** Customer revenue (every dollar past due to ship)

## Why this exists

The roadmap flags three items blocking "Operational":

1. Switch Stripe to live keys
2. Customer Portal (Click-to-Cancel)
3. Audio previews on top 10 recipes

Audio previews are a content task with separate scope. This spec covers the first two. They are coupled: you cannot responsibly flip live keys until the cancellation experience is wired up end-to-end and the webhook handler persists subscription state, because the moment you charge a real card a real user can ask to cancel, and the system needs to handle that without your manual intervention.

## What's already built (good news, more than I expected)

A pre-implementation read of the codebase shows you've already shipped most of this. Confirmed working:

- `src/app/api/checkout/route.ts`: auth-gated checkout session, supabase_user_id metadata, plan metadata, rate limiting, success/cancel URLs.
- `src/app/api/billing/portal/route.ts`: auth-gated portal session, `return_url` set to `/dashboard/settings?billing_updated=true`, rate limited at 5/min.
- `src/app/api/webhooks/stripe/route.ts`: signature verification, supabase admin client with role-claim diagnostic logging, three event handlers (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`).
- `src/components/checkout/CheckoutButton.tsx` and `ManageBillingButton.tsx`: both wired through Bearer auth.
- `src/app/dashboard/settings/page.tsx`: polls `refreshProfile()` on `?billing_updated=true` return.
- `src/lib/stripe.ts`: lazy Stripe client init, `ensureProducts()` auto-creates the Tone Pass ($7) and Pro ($12) products.
- `supabase/migrations/015_stripe_columns.sql`: `stripe_customer_id` and `stripe_subscription_id` columns on profiles, indexed.
- `src/app/api/health-check/stripe/route.ts`: health probe.
- `src/app/pricing/page.tsx`: published with cancel-anytime language.
- `src/app/terms/page.tsx`: subscriptions section accurate (cancel from dashboard, no partial-month refunds).

The architectural shape is correct. What's missing is state persistence for cancellation, schema for subscription status, Stripe Dashboard configuration, and the test pass.

## What's missing

### Gap 1: Subscription state isn't persisted

The webhook handler logs `cancel_at_period_end` but doesn't write it to the database. The subscription cancellation flow goes:

1. User clicks Manage Subscription on settings page
2. Stripe Portal opens, user clicks Cancel
3. Stripe fires `customer.subscription.updated` with `cancel_at_period_end: true`
4. Your webhook logs it and does nothing else
5. User returns to settings page, polls `refreshProfile()`, sees the same tier label as before
6. User has no idea their cancel actually went through

This is the single most damaging UX bug in the system. The fix is a schema addition plus webhook handler updates plus a settings page string.

### Gap 2: No `subscription_status` column

When a payment fails, when a subscription is `incomplete`, when a card is declined mid-renewal, the app has no way to represent any of those states. Today the only states are "`role` is free" or "`role` is premium/creator." Real subscription billing has more states than that, and silently dropping a `past_due` user to `free` is the kind of thing that creates support tickets and churn surprises.

### Gap 3: Two webhook events you'll need in live mode

- `invoice.payment_failed`: card declined on renewal. Should mark `subscription_status = past_due` and trigger a notification. Stripe will retry per Smart Retry settings.
- `invoice.payment_succeeded`: confirms a successful renewal. Useful for analytics and for confirming `subscription_status = active`.

These don't exist in test mode much because nobody's actually being charged. They will fire constantly in live mode.

### Gap 4: Stripe Customer Portal isn't configured

The portal route works, but the portal itself is a configuration in the Stripe Dashboard that has to be set up separately for test mode and live mode. If you opened the live-mode portal today, it'd be empty defaults.

### Gap 5: FTC and California compliance state

Honest read on the regulatory state as of May 2026:

- The FTC Click-to-Cancel rule was vacated by the 8th Circuit on July 8, 2025, on procedural grounds. It is currently not in force. The FTC filed an Advance Notice of Proposed Rulemaking on March 11, 2026 to revive it. A new rule is likely years away.
- ROSCA (Restore Online Shoppers' Confidence Act) and FTC Section 5 are still in effect and still cover deceptive negative-option billing. Enforcement continues.
- California SB 313 is firm and applies to anyone selling to California residents (which is everyone with a public site).

Practical implication: the right move is to build to the spirit of Click-to-Cancel even though the federal rule is vacated, because (a) California requires most of it anyway, (b) the federal revival is in motion, and (c) it's good UX. Stripe Customer Portal, configured correctly, satisfies all of this.

## Implementation plan

### Step 1: Schema migration

Create `supabase/migrations/017_subscription_state.sql`:

```sql
-- =============================================================================
-- 017: Persist subscription state from Stripe webhooks
-- =============================================================================
-- Adds the columns needed to represent every state a Stripe subscription can be in,
-- so the UI can show "Subscription cancels [date]" or "Payment failed" correctly.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT
    CHECK (subscription_status IN (
      'active', 'past_due', 'canceled', 'incomplete', 'trialing', 'unpaid'
    )),
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status
  ON profiles(subscription_status)
  WHERE subscription_status IS NOT NULL;

-- Backfill: existing premium/creator users get 'active' status.
UPDATE profiles
SET subscription_status = 'active'
WHERE role IN ('premium', 'creator')
  AND subscription_status IS NULL;
```

Run with `supabase migration up` against both your dev project and your production project.

### Step 2: Update the webhook handler

The current handler is at `src/app/api/webhooks/stripe/route.ts`. Add and update event handlers:

```typescript
// Add to the switch/case in POST handler:

case "customer.subscription.updated": {
  const subscription = event.data.object as Stripe.Subscription;
  const userId =
    subscription.metadata?.supabase_user_id ??
    (await lookupUserByCustomerId(supabase, subscription.customer as string));

  if (!userId) {
    console.error(
      "[stripe-webhook] subscription.updated: no userId resolvable",
      subscription.customer,
    );
    break;
  }

  // Persist the full state so the UI can render it accurately.
  const updateRes = await supabase
    .from("profiles")
    .update({
      subscription_status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      stripe_price_id: subscription.items.data[0]?.price.id ?? null,
      // Important: do NOT flip role to free here. Role stays paid until
      // customer.subscription.deleted fires at period end.
    })
    .eq("id", userId)
    .select();

  console.log(
    "[stripe-webhook] subscription.updated persisted:",
    "status=", subscription.status,
    "cancel_at_period_end=", subscription.cancel_at_period_end,
    "current_period_end=", subscription.current_period_end,
    "rows_updated=", updateRes.data?.length ?? 0,
  );
  break;
}

case "invoice.payment_failed": {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;
  const userId = await lookupUserByCustomerId(supabase, customerId);

  if (!userId) break;

  await supabase
    .from("profiles")
    .update({ subscription_status: "past_due" })
    .eq("id", userId);

  console.log(
    "[stripe-webhook] invoice.payment_failed: marked past_due for",
    userId,
  );
  // TODO (separate task): trigger Resend transactional email
  // "Your card was declined. Update payment method to keep access."
  break;
}

case "invoice.payment_succeeded": {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;
  const userId = await lookupUserByCustomerId(supabase, customerId);

  if (!userId) break;

  await supabase
    .from("profiles")
    .update({ subscription_status: "active" })
    .eq("id", userId);

  console.log(
    "[stripe-webhook] invoice.payment_succeeded: confirmed active for",
    userId,
  );
  break;
}
```

Update the existing `customer.subscription.deleted` handler to also clear the cancellation state columns:

```typescript
case "customer.subscription.deleted": {
  // ... existing user lookup ...

  const updateRes = await supabase
    .from("profiles")
    .update({
      role: "free",
      subscription_status: "canceled",
      cancel_at_period_end: false,
      current_period_end: null,
      stripe_subscription_id: null,
      stripe_price_id: null,
      // stripe_customer_id stays so they can reactivate without
      // re-creating a customer record.
    })
    .eq("id", userId)
    .select();

  // ... rest unchanged ...
}
```

### Step 3: Update the profile fetch

Whatever query backs `getProfile()` needs to include the new columns. Find and update `src/lib/db/profile.ts` (or wherever the select is defined) to fetch:

```
id, role, display_name, primary_platform,
stripe_customer_id, stripe_subscription_id, stripe_price_id,
subscription_status, cancel_at_period_end, current_period_end
```

### Step 4: Settings page UX for cancellation state

In `src/app/dashboard/settings/page.tsx`, near where `tierLabel` is computed, add cancellation-aware state:

```typescript
const profile = /* the profile object from useAuth or getProfile */;
const isCanceling =
  profile?.cancel_at_period_end === true &&
  profile?.subscription_status === "active";
const isPastDue = profile?.subscription_status === "past_due";
const periodEnd = profile?.current_period_end
  ? new Date(profile.current_period_end)
  : null;

const subscriptionLine = (() => {
  if (isPastDue) {
    return {
      tone: "warning",
      text: "Payment failed. Update your card in the billing portal to keep access.",
    };
  }
  if (isCanceling && periodEnd) {
    return {
      tone: "neutral",
      text: `Subscription canceled. You keep access through ${periodEnd.toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" },
      )}.`,
    };
  }
  if (isPaid && periodEnd) {
    return {
      tone: "neutral",
      text: `Renews ${periodEnd.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}.`,
    };
  }
  return null;
})();
```

Then render `subscriptionLine.text` under the tier label. This is the single highest-leverage UX change in this whole spec. Right now a user who cancels has no idea anything happened. After this, they see the date and they know.

### Step 5: Stripe Customer Portal configuration

This is in the Stripe Dashboard, not in code. You configure it twice (once for test mode, once for live mode). The configurations are independent.

**Settings → Billing → Customer Portal**, in this order:

1. **Functionality:**
   - Customers can update payment methods: ON
   - Customers can update billing addresses: ON
   - Customers can view their invoices and payment history: ON
   - Customers can update their email address: ON
   - Customers can update their name: ON

2. **Cancellation:**
   - Cancellation: ON
   - Mode: "Cancel at end of billing period" (this is the right choice for Tone Pass and Pro; matches your Terms which already say users keep access through the end of the period)
   - Cancellation reason survey: optional, set to ON with a short list of reasons (got what I needed, too expensive, missing feature I needed, taking a break). Make sure "skip" is available; do not require an answer.
   - Retention offer: OFF. This is the part that gets companies in trouble with California SB 313 and the spirit of Click-to-Cancel. Do not put a "would you take 50% off to stay" wall in front of cancel. The cancel button is the cancel button.

3. **Subscriptions:**
   - Customers can switch plans: ON (lets a Pro user downgrade to Tone Pass without contacting you)
   - Proration behavior: "Create prorations" (Stripe default; fair to user)

4. **Branding:** Upload your logo, set the primary color to your brand color, set the headline to "Manage your Fader & Knob subscription."

5. **Privacy policy and Terms URLs:** Add `https://faderandknob.com/privacy` and `https://faderandknob.com/terms`. These are required and they should already exist.

6. **Save the configuration.**

Repeat the entire flow once in test mode, once in live mode. They are independent configurations.

### Step 6: Live mode environment variables

In Vercel project settings, **Production** environment:

```
STRIPE_SECRET_KEY=sk_live_...        # NEW: from Stripe Dashboard, Live Mode, Developers → API keys
STRIPE_WEBHOOK_SECRET=whsec_...      # NEW: Stripe Dashboard, Live Mode, Webhooks → endpoint secret
                                     # NOTE: this is a different secret than test mode
```

Keep test keys in **Preview** and **Development** environments. Vercel's three-environment split makes this easy: live keys never touch a preview deployment.

### Step 7: Live mode webhook endpoint

In Stripe Dashboard, Live Mode, Developers → Webhooks → Add endpoint:

- **URL:** `https://faderandknob.com/api/webhooks/stripe`
- **Events to send:**
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
  - `invoice.payment_succeeded`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel Production env (Step 6).

Note: I added `customer.subscription.created` to the list. The current handler doesn't handle it explicitly (it relies on `checkout.session.completed` for the upgrade path), and that's fine; the events are duplicates from your perspective. Subscribe to it anyway because it's the canonical "subscription exists" signal and gives you a fallback if `checkout.session.completed` ever misfires.

### Step 8: Live mode product creation

`ensureProducts()` will auto-create Tone Pass and Pro on first call in live mode, exactly as it did in test mode. No manual product setup needed. The metadata fields (`fk_plan: premium`, `fk_plan: creator`) ensure the price-cache lookup works.

If you want belt-and-suspenders: hit `https://faderandknob.com/api/health-check/stripe` after the live key flip; that endpoint should call `ensureProducts()` and confirm clean creation.

## Test plan before announcing live mode

Run this in order. Do not announce or share the live URL until every box is checked.

1. **Settings persisted in dashboard:** Confirm Customer Portal config is saved in live mode (Step 5).
2. **Webhook signing secret matches:** Trigger a test webhook from the Stripe Dashboard live mode webhook page. Confirm 200 OK in the response. If you see "Invalid signature," the env var is wrong.
3. **End-to-end live charge:**
   - Create a personal account on the production site
   - Click Start Tone Pass with a real card (use your own; you'll refund yourself)
   - Confirm the dashboard shows "Tone Pass" and "Renews [date]"
   - Confirm a `.hlx` download works
4. **Cancel through portal:**
   - Click Manage Subscription
   - Click Cancel
   - Confirm the cancellation completed without a retention wall
   - Return to settings page
   - Confirm the page shows "Subscription canceled. You keep access through [date]."
5. **Refund (cleanup):**
   - In Stripe Dashboard, refund the charge
   - Confirm the refund completes
6. **Past-due simulation (optional but useful):**
   - Stripe Dashboard → Customers → your test customer → Subscriptions → Update
   - Force a past-due state via the test clock or by changing the card to `4000000000000341` (declines on renewal) before triggering the next renewal
   - Confirm the dashboard shows the past-due banner
7. **Period-end simulation:**
   - On the canceled subscription, fast-forward Stripe's test clock to the period end date (or wait if you're patient)
   - Confirm the user's role flips to `free` and access is gated correctly

This test plan is also your post-deploy smoke test for any future Stripe schema changes. Save it.

## What to update in your existing roadmap

Cross off these items in `docs/ROADMAP.md` once steps 1 to 8 ship:

- [ ] **Switch Stripe to live keys** → covered by Step 6
- [ ] **Customer Portal (Click-to-Cancel)** → covered by Steps 1 to 5

Note that "Click-to-Cancel" as a federal rule is currently vacated; what your roadmap is actually requiring (and rightly so) is the user-facing cancellation experience that California SB 313 and basic decency demand. The label is fine. The implementation is what matters.

## What this does NOT cover

Two things deliberately scoped out:

1. **Audio previews on top 10 recipes.** Separate roadmap item, separate creative process. The three options I sketched in chat (AI music gen via Suno or Udio, DI-recording the .hlx through your own playing, embedding the original recording as a target reference) all stand and any of them ships in less than a week, but they're not Stripe.

2. **The email welcome sequence.** Also flagged in the ROADMAP as critical-gap. Resend is already a dep in `package.json` and you've configured it for transactional. The welcome sequence is roughly 1 day of work with the existing infrastructure, but it's a separate scope and not gated on Stripe live mode (technically you can send a welcome email today; it just doesn't have anywhere good to land users).

The order I'd suggest, if I were running it:

1. This Stripe spec (1 to 2 days)
2. Email welcome sequence + first "Tone of the Week" send (1 day)
3. Audio previews on top 10 recipes (3 to 5 days, varies by approach)
4. Then announce, then Reddit / Discord push, then keep shipping recipes

That sequence flips the site from "good content with no business model attached" to "good content with a working subscription product and a reason to come back," in 6 to 8 working days. Every other growth lever multiplies more once that's done.
