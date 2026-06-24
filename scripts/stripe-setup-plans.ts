/**
 * Stripe: verify the secret key + create the subscription plans.
 *
 * Implements docs/PRICING_MODEL.md "Build order" step 1. Runs locally so
 * the secret key never leaves your machine:
 *   - [S1] Verifies STRIPE_SECRET_KEY authenticates and reports its type
 *     (sk_live / rk_live / sk_test) and mode (live/test). Aborts if it's a
 *     publishable key in the secret slot.
 *   - Idempotently creates the Pass and Pro products, each with a monthly
 *     and an annual recurring USD price, and prints the price IDs the
 *     checkout route reads. Safe to re-run: products are matched by name and
 *     prices by lookup_key, so nothing duplicates.
 *
 * Plans (PRICING_MODEL.md):
 *   Pass — $4.99/mo · $49/yr     Pro — $7.99/mo · $79/yr
 *   (Team ships later; add it here when it does.)
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-setup-plans.ts
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-setup-plans.ts --write-vercel
 *
 * --write-vercel pushes every price ID to Vercel (production + preview) via
 * the Vercel CLI. Price IDs are not secret. Rehearse with a sk_test_ key
 * first to build the plans harmlessly in test mode.
 */

import Stripe from "stripe";
import { execSync } from "node:child_process";

type PlanPrice = {
  lookupKey: string;
  envVar: string;
  amount: number; // cents
  interval: "month" | "year";
  label: string;
};
type Plan = { product: string; prices: PlanPrice[] };

const PLANS: Plan[] = [
  {
    product: "Fader & Knob Pass",
    prices: [
      { lookupKey: "fk_pass_monthly", envVar: "STRIPE_PASS_PRICE_ID_MONTHLY", amount: 499, interval: "month", label: "$4.99/mo" },
      { lookupKey: "fk_pass_annual", envVar: "STRIPE_PASS_PRICE_ID_ANNUAL", amount: 4900, interval: "year", label: "$49/yr" },
    ],
  },
  {
    product: "Fader & Knob Pro",
    prices: [
      { lookupKey: "fk_pro_monthly", envVar: "STRIPE_PRO_PRICE_ID_MONTHLY", amount: 799, interval: "month", label: "$7.99/mo" },
      { lookupKey: "fk_pro_annual", envVar: "STRIPE_PRO_PRICE_ID_ANNUAL", amount: 7900, interval: "year", label: "$79/yr" },
    ],
  },
];

function fail(msg: string): never {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

async function main() {
  const writeVercel = process.argv.includes("--write-vercel");
  const key = process.env.STRIPE_SECRET_KEY?.trim();

  if (!key) {
    fail(
      "STRIPE_SECRET_KEY is not set. Run as:\n" +
        "  STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-setup-plans.ts\n" +
        "Get a key (ideally restricted with Write on Products + Prices) at\n" +
        "  https://dashboard.stripe.com/apikeys",
    );
  }
  if (key.startsWith("pk_")) {
    fail("That's a PUBLISHABLE key (pk_…) in the secret slot — use a secret (sk_…) or restricted (rk_…) key.");
  }
  const keyType = key.startsWith("rk_") ? "restricted" : key.startsWith("sk_") ? "secret" : "unknown";
  const keyMode = key.includes("_live_") ? "LIVE" : key.includes("_test_") ? "TEST" : "unknown";

  const stripe = new Stripe(key);
  try {
    const balance = await stripe.balance.retrieve();
    console.log(`✓ Key authenticates. Type: ${keyType}, mode: ${keyMode} (balance livemode=${balance.livemode}).`);
  } catch (err) {
    fail(`Key did NOT authenticate: ${(err as Error).message}`);
  }
  if (keyMode === "LIVE") console.log("  → LIVE mode: this creates real, purchasable products.\n");

  const results: Record<string, string> = {};

  for (const plan of PLANS) {
    const existing = (await stripe.products.list({ active: true, limit: 100 })).data.find(
      (p) => p.name === plan.product,
    );
    const product = existing ?? (await stripe.products.create({ name: plan.product }));
    console.log(`✓ Product ${existing ? "reused" : "created"}: ${product.id} ("${plan.product}")`);

    for (const pr of plan.prices) {
      const found = (await stripe.prices.list({ lookup_keys: [pr.lookupKey], active: true, limit: 1 })).data[0];
      const price =
        found ??
        (await stripe.prices.create({
          product: product.id,
          currency: "usd",
          unit_amount: pr.amount,
          recurring: { interval: pr.interval },
          lookup_key: pr.lookupKey,
          transfer_lookup_key: true,
        }));
      results[pr.envVar] = price.id;
      console.log(`    ${found ? "reused" : "created"} ${pr.label}: ${price.id}`);
    }
  }

  console.log("\nPrice IDs (not secret):");
  for (const [envVar, id] of Object.entries(results)) console.log(`  ${envVar}=${id}`);

  if (writeVercel) {
    console.log("\nWriting to Vercel (production + preview)…");
    for (const [envVar, id] of Object.entries(results)) {
      for (const target of ["production", "preview"]) {
        try {
          try { execSync(`npx vercel env rm ${envVar} ${target} -y`, { stdio: "ignore" }); } catch {}
          execSync(`npx vercel env add ${envVar} ${target}`, { input: id, stdio: ["pipe", "ignore", "inherit"] });
          console.log(`  ✓ ${envVar} → ${target}`);
        } catch (err) {
          console.error(`  ✖ ${envVar} → ${target}: ${(err as Error).message}`);
        }
      }
    }
    console.log("\nRedeploy for the env to take effect:  npx vercel redeploy --prod");
  } else {
    console.log("\nTo wire these into Vercel, re-run with --write-vercel, or run manually:");
    for (const [envVar, id] of Object.entries(results)) {
      console.log(`  echo "${id}" | npx vercel env add ${envVar} production`);
      console.log(`  echo "${id}" | npx vercel env add ${envVar} preview`);
    }
    console.log("Then: npx vercel redeploy --prod");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
