/**
 * Stripe: verify the secret key + create the "Fader & Knob Pass" product.
 *
 * Does STRIPE_STANDUP.md Steps 1-check and 2 in one command, locally, so the
 * secret key never leaves your machine:
 *   - [S1] Verifies STRIPE_SECRET_KEY authenticates, and reports its type
 *     (sk_live / rk_live / sk_test / publishable) and mode (live/test).
 *     Aborts loudly if it's a publishable key in the secret slot (the bug).
 *   - [S2] Idempotently creates the "Fader & Knob Pass" product with two
 *     recurring USD prices — $39/year and $4.99/month — and prints the
 *     price IDs the checkout route reads (STRIPE_PASS_PRICE_ID_ANNUAL /
 *     _MONTHLY). Safe to re-run: it reuses an existing product and prices
 *     (matched by lookup_key) instead of duplicating.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-create-pass-product.ts
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-create-pass-product.ts --write-vercel
 *
 * --write-vercel also pushes the two price IDs to Vercel (production +
 * preview) via the Vercel CLI. Price IDs are not secret. Without the flag,
 * the script just prints the exact commands for you to run.
 *
 * Run with a TEST key first (sk_test_...) if you want to rehearse — it
 * creates the product in test mode, harmlessly.
 */

import Stripe from "stripe";
import { execSync } from "node:child_process";

const PRODUCT_NAME = "Fader & Knob Pass";
const PRICES = [
  { lookupKey: "fk_pass_annual", envVar: "STRIPE_PASS_PRICE_ID_ANNUAL", amount: 3900, interval: "year" as const, label: "$39.00/year" },
  { lookupKey: "fk_pass_monthly", envVar: "STRIPE_PASS_PRICE_ID_MONTHLY", amount: 499, interval: "month" as const, label: "$4.99/month" },
];

function fail(msg: string): never {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

async function main() {
  const writeVercel = process.argv.includes("--write-vercel");
  const key = process.env.STRIPE_SECRET_KEY?.trim();

  // ── S1: validate the key shape before spending an API call ──────────────
  if (!key) {
    fail(
      "STRIPE_SECRET_KEY is not set. Run as:\n" +
        "  STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-create-pass-product.ts\n" +
        "Get a key (ideally a restricted key with Write on Products + Prices) at\n" +
        "  https://dashboard.stripe.com/apikeys",
    );
  }
  if (key.startsWith("pk_")) {
    fail(
      "That's a PUBLISHABLE key (pk_…) in the secret slot — this is exactly the\n" +
        "bug STRIPE_STANDUP.md warned about. Grab a secret (sk_…) or restricted\n" +
        "(rk_…) key from https://dashboard.stripe.com/apikeys instead.",
    );
  }
  const keyType = key.startsWith("rk_") ? "restricted" : key.startsWith("sk_") ? "secret" : "unknown";
  const keyMode = key.includes("_live_") ? "LIVE" : key.includes("_test_") ? "TEST" : "unknown";

  const stripe = new Stripe(key);

  // ── S1: prove it actually authenticates ─────────────────────────────────
  try {
    const balance = await stripe.balance.retrieve();
    console.log(`✓ Key authenticates. Type: ${keyType}, mode: ${keyMode} (balance livemode=${balance.livemode}).`);
  } catch (err) {
    fail(`Key did NOT authenticate: ${(err as Error).message}`);
  }
  if (keyMode === "LIVE") {
    console.log("  → Operating in LIVE mode: this creates a real, purchasable product.");
  }

  // ── S2: find or create the product ──────────────────────────────────────
  const existing = (await stripe.products.list({ active: true, limit: 100 })).data.find(
    (p) => p.name === PRODUCT_NAME,
  );
  const product = existing ?? (await stripe.products.create({ name: PRODUCT_NAME }));
  console.log(`✓ Product ${existing ? "reused" : "created"}: ${product.id} ("${PRODUCT_NAME}")`);

  // ── S2: find or create each price (idempotent via lookup_key) ───────────
  const results: Record<string, string> = {};
  for (const p of PRICES) {
    const found = (await stripe.prices.list({ lookup_keys: [p.lookupKey], active: true, limit: 1 })).data[0];
    const price =
      found ??
      (await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: p.amount,
        recurring: { interval: p.interval },
        lookup_key: p.lookupKey,
        transfer_lookup_key: true,
      }));
    results[p.envVar] = price.id;
    console.log(`✓ Price ${found ? "reused" : "created"} (${p.label}): ${price.id}`);
  }

  // ── Output: env vars + Vercel wiring ────────────────────────────────────
  console.log("\nPrice IDs (these are not secret):");
  for (const [envVar, id] of Object.entries(results)) console.log(`  ${envVar}=${id}`);

  if (writeVercel) {
    console.log("\nWriting to Vercel (production + preview)…");
    for (const [envVar, id] of Object.entries(results)) {
      for (const target of ["production", "preview"]) {
        try {
          // remove any existing value first so add doesn't conflict
          try { execSync(`npx vercel env rm ${envVar} ${target} -y`, { stdio: "ignore" }); } catch {}
          execSync(`npx vercel env add ${envVar} ${target}`, { input: id, stdio: ["pipe", "ignore", "inherit"] });
          console.log(`  ✓ ${envVar} → ${target}`);
        } catch (err) {
          console.error(`  ✖ ${envVar} → ${target}: ${(err as Error).message}`);
        }
      }
    }
    console.log("\nNow redeploy for the env to take effect:  npx vercel redeploy --prod");
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
