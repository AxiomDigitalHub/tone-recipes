import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead */
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get products() { return getStripe().products; },
  get prices() { return getStripe().prices; },
  get webhooks() { return getStripe().webhooks; },
};

/**
 * Price IDs for each plan. These are created on first use via
 * ensureProducts() and cached in memory for the process lifetime.
 */
let PRICE_CACHE: { premium: string; creator: string } | null = null;

/**
 * Ensure Stripe products and prices exist. Creates them if missing.
 * Returns the price IDs for premium and creator plans.
 */
export async function ensureProducts(): Promise<{
  premium: string;
  creator: string;
}> {
  if (PRICE_CACHE) return PRICE_CACHE;

  // Search for existing products by metadata
  const products = await stripe.products.list({ limit: 10, active: true });

  let premiumPriceId: string | null = null;
  let creatorPriceId: string | null = null;

  for (const product of products.data) {
    if (product.metadata.fk_plan === "premium") {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1,
      });
      if (prices.data[0]) premiumPriceId = prices.data[0].id;
    }
    if (product.metadata.fk_plan === "creator") {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1,
      });
      if (prices.data[0]) creatorPriceId = prices.data[0].id;
    }
  }

  // Create missing products
  if (!premiumPriceId) {
    const product = await stripe.products.create({
      name: "Fader & Knob Tone Pass",
      description:
        "Unlimited preset downloads, unlimited saved recipes, ad-free experience.",
      metadata: { fk_plan: "premium" },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 700, // $7.00
      currency: "usd",
      recurring: { interval: "month" },
    });
    premiumPriceId = price.id;
  }

  if (!creatorPriceId) {
    const product = await stripe.products.create({
      name: "Fader & Knob Pro",
      description:
        "Everything in Tone Pass plus Set Packs, priority access, and Pro badge.",
      metadata: { fk_plan: "creator" },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1200, // $12.00
      currency: "usd",
      recurring: { interval: "month" },
    });
    creatorPriceId = price.id;
  }

  PRICE_CACHE = { premium: premiumPriceId, creator: creatorPriceId };
  return PRICE_CACHE;
}
