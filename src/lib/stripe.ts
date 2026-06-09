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
  get billingPortal() { return getStripe().billingPortal; },
};

/* -------------------------------------------------------------------------- */
/*  Set Pack one-time purchases                                                */
/* -------------------------------------------------------------------------- */
/*                                                                             */
/*  Subscription products (Tone Pass / Pro) were retired in 2026-04 — the      */
/*  pricing page explicitly says so. The old ensureProducts() helper that      */
/*  auto-created them on first /api/checkout request was removed in the        */
/*  same pass so a stray call can't materialise dead products in live          */
/*  Stripe. If you ever bring subscriptions back, restore the helper from      */
/*  git history (commit "Perf: size guitar silhouette imgs…" was the last      */
/*  commit before this cleanup) and re-add the /api/checkout route.            */
/*                                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Registry of Set Packs sold as one-time purchases. Each pack maps to a
 * Stripe product (auto-created on first checkout) and is granted via the
 * `set_pack_purchases` table on `checkout.session.completed`.
 *
 * To add a new pack: add an entry here, then ship the pack page + the
 * Stripe product is created on first checkout request.
 */
export const SET_PACKS = {
  worship: {
    slug: "worship",
    name: "Worship Set Pack",
    description:
      "AC30 + Klon + delays + shimmer. 8 snapshots from clean ambient to rock crunch. 30 worship songs mapped to snapshots.",
    priceCents: 1900,
    currency: "usd",
  },
} as const;

export type SetPackSlug = keyof typeof SET_PACKS;

const SET_PACK_PRICE_CACHE = new Map<string, string>();

/**
 * Resolve or create the Stripe price ID for a Set Pack. Idempotent —
 * the first call per pack creates the product + price in Stripe; later
 * calls return the cached ID from memory or look up the existing
 * product by `fk_set_pack` metadata.
 */
export async function ensureSetPackPrice(slug: SetPackSlug): Promise<string> {
  const cached = SET_PACK_PRICE_CACHE.get(slug);
  if (cached) return cached;

  const pack = SET_PACKS[slug];
  if (!pack) throw new Error(`Unknown set pack: ${slug}`);

  const s = getStripe();

  // Find an existing product tagged with this slug.
  const products = await s.products.list({ limit: 100, active: true });
  for (const product of products.data) {
    if (product.metadata.fk_set_pack === slug) {
      const prices = await s.prices.list({
        product: product.id,
        active: true,
        limit: 10,
      });
      const oneOff = prices.data.find((p) => p.recurring === null);
      if (oneOff) {
        SET_PACK_PRICE_CACHE.set(slug, oneOff.id);
        return oneOff.id;
      }
    }
  }

  // Create product + price.
  const product = await s.products.create({
    name: pack.name,
    description: pack.description,
    metadata: { fk_set_pack: slug },
  });
  const price = await s.prices.create({
    product: product.id,
    unit_amount: pack.priceCents,
    currency: pack.currency,
    // No `recurring` field → one-time price.
  });
  SET_PACK_PRICE_CACHE.set(slug, price.id);
  return price.id;
}
