import Link from "next/link";
import type { Metadata } from "next";
import PlanCards from "@/components/pricing/PlanCards";
import { ContactEmailText } from "@/components/ui/ContactEmail";
import { Check } from "lucide-react";
import Thumb from "@/components/gear/Thumb";

/**
 * JSON-LD: a Product + multi-Offer entry for each subscription tier
 * (Pass, Pro). Each tier carries two billing cadences (annual / monthly)
 * as two `Offer` entries — Google reads either depending on query
 * intent. Both link back to /pricing as the point-of-sale; checkout
 * itself happens via the embedded CheckoutButton, which Google doesn't
 * need to know about for the Product card.
 *
 * Pricing per docs/PRICING_MODEL.md (locked 2026-06-15).
 */
function subscriptionProduct(
  name: string,
  description: string,
  annual: string,
  monthly: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    category: "Subscription",
    brand: { "@type": "Brand", name: "Fader & Knob" },
    url: "https://faderandknob.com/pricing",
    offers: [
      {
        "@type": "Offer",
        name: `${name}, annual`,
        priceCurrency: "USD",
        price: annual,
        availability: "https://schema.org/InStock",
        url: "https://faderandknob.com/pricing",
        seller: { "@type": "Organization", name: "Fader & Knob" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: annual,
          priceCurrency: "USD",
          billingDuration: "P1Y",
          unitCode: "ANN",
        },
      },
      {
        "@type": "Offer",
        name: `${name}, monthly`,
        priceCurrency: "USD",
        price: monthly,
        availability: "https://schema.org/InStock",
        url: "https://faderandknob.com/pricing",
        seller: { "@type": "Organization", name: "Fader & Knob" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: monthly,
          priceCurrency: "USD",
          billingDuration: "P1M",
          unitCode: "MON",
        },
      },
    ],
  };
}

const PRICING_JSON_LD = [
  subscriptionProduct(
    "Fader & Knob Pass",
    "Unlimited preset downloads and recipe PDFs.",
    "49.00",
    "4.99",
  ),
  subscriptionProduct(
    "Fader & Knob Pro",
    "Everything in Pass, plus every Set Pack included while subscribed, and a commercial-use license.",
    "79.00",
    "7.99",
  ),
];

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free to browse every recipe. Pass ($49/yr) for unlimited downloads; Pro ($79/yr) bundles every Set Pack. Set Packs are also one-time purchases you keep forever.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | Fader & Knob",
    description:
      "Free to browse. Pass for unlimited downloads. Pro bundles every Set Pack.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*  Set Packs: one-time purchases                                              */
/* -------------------------------------------------------------------------- */

const SET_PACK = {
  name: "Worship Set Pack",
  price: "$19",
  blurb: "One Helix preset with 8 snapshots, and 30 worship songs mapped to them.",
  features: [
    "FK-Worship.hlx preset",
    "8 snapshots, from clean to rock crunch",
    "30-song setlist mapper",
    "Lifetime updates as the pack improves",
  ],
  cta: "Buy the Worship Set Pack",
  href: "/set-packs/worship",
};

/* -------------------------------------------------------------------------- */
/*  Compare the plans                                                          */
/* -------------------------------------------------------------------------- */

/** true = included, false = not included, a string prints as is. */
type Cell = boolean | string;
const COMPARE: [string, Cell, Cell, Cell][] = [
  ["Browse every recipe", true, true, true],
  ["Preset downloads", "5 a month", "Unlimited", "Unlimited"],
  ["Recipe PDFs", "10 a month", "Unlimited", "Unlimited"],
  ["Saved recipes", "Unlimited", "Unlimited", "Unlimited"],
  ["Set Packs", "$19 each", "$19 each", "Included"],
  ["Commercial-use license", false, false, true],
];

function CompareCell({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="fk-compare-yes" role="img" aria-label="Included">
        <Check size={20} strokeWidth={1.75} aria-hidden />
      </span>
    );
  }
  if (value === false) return <span className="fk-compare-no">Not included</span>;
  return <>{value}</>;
}

/* -------------------------------------------------------------------------- */
/*  Questions                                                                  */
/* -------------------------------------------------------------------------- */

// The old "difference between Free, Pass and Pro" question is the
// "Compare the plans" table above.
const FAQ = [
  {
    q: "Pass or Pro?",
    a: "Start with Pass if you mostly want unlimited downloads. Pick Pro if you'd buy Set Packs: each one is $19 on its own and Pro costs $30 a year more than Pass, so it pays off at two packs, and you get every later pack while you're subscribed.",
  },
  {
    q: "Is there a free trial?",
    a: "The free plan is the trial. You get 5 downloads a month, every feature is visible, and no card is needed. If you keep hitting the limit, upgrade; if you don't, you didn't need a subscription.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes, from your dashboard, without emailing us. You keep your paid features until the period you paid for ends, then your account goes back to Free. We don't refund unused time.",
  },
  {
    q: "Why are Set Packs a one-time price?",
    a: "A Set Pack covers one kind of gig with a single preset, eight snapshots and 30 songs mapped to them. You'll use it for years, so you pay for it once. Pro includes every pack while you're subscribed.",
  },
  {
    q: "Will there be more Set Packs?",
    a: "Yes. Classic Rock, 90s and Alternative, and Blues are next. Buy them one at a time for $19 each, or get every pack with Pro.",
  },
  {
    q: "What about the old 2026 Tone Pass and Pro plans?",
    // {EMAIL} is substituted for <ContactEmailText/> at render. A raw
    // address in this string gets rewritten by Cloudflare into a link to
    // its 404ing /cdn-cgi/l/email-protection endpoint.
    a: "Those plans are retired and are separate from the current Pass and Pro. If you subscribed then, you keep full access and billing has stopped. Email {EMAIL} if you want a prorated refund on the time left.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  return (
    <div className="fk-pricing">
      {PRICING_JSON_LD.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      {/* Heading, Yearly / Monthly toggle and the Free / Pass / Pro cards.
          A client component owns the toggle that drives both paid cards. */}
      <section className="fk-wrap fk-pricing-top">
        <PlanCards />
      </section>

      <section className="fk-wrap fk-pricing-compare">
        <h2 className="fk-t2">Compare the plans</h2>
        <div className="fk-tablewrap r-md">
          <table className="fk-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="fk-sr">Feature</span>
                </th>
                <th scope="col">Free</th>
                <th scope="col">Pass</th>
                <th scope="col">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([feature, free, pass, pro]) => (
                <tr key={feature}>
                  <th scope="row">{feature}</th>
                  <td><CompareCell value={free} /></td>
                  <td><CompareCell value={pass} /></td>
                  <td><CompareCell value={pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Set Packs sit below the plans so the main story is Free to Pass.
          They are a second kind of purchase: one time, one problem. */}
      <section className="fk-pricing-packs">
        <div className="fk-pricing-wash">
          <div className="fk-wrap fk-pricing-packs-grid">
            <div className="fk-pricing-packs-copy">
              <h2 className="fk-t1">Set Packs</h2>
              <p className="fk-lead">
                One preset, eight snapshots and a map of which snapshot fits which song. You buy it
                once and keep it.
              </p>
              <p className="fk-body fk-muted">
                On Pro, every Set Pack is included while you&apos;re subscribed.
              </p>
              <ul className="fk-pricing-next">
                <li>
                  <Thumb pattern="wave" color="amber" frame="tilt" gear={[{ kind: "head" }]} gearHeight={46} ratio="1 / 1" radius="r-md" />
                  <div>
                    <span className="fk-pricing-next-name">Classic Rock</span>
                    <span className="fk-caption">Coming next</span>
                  </div>
                </li>
                <li>
                  <Thumb pattern="stripes" color="lilac" frame="close" gear={[{ kind: "fuzz" }]} gearHeight={58} ratio="1 / 1" radius="r-md" />
                  <div>
                    <span className="fk-pricing-next-name">90s and Alternative</span>
                    <span className="fk-caption">Coming next</span>
                  </div>
                </li>
                <li>
                  <Thumb pattern="dots" color="blue" frame="tiltR" gear={[{ kind: "drive" }]} gearHeight={58} ratio="1 / 1" radius="r-md" />
                  <div>
                    <span className="fk-pricing-next-name">Blues</span>
                    <span className="fk-caption">Coming next</span>
                  </div>
                </li>
              </ul>
            </div>

            <article className="fk-packcard r-lg">
              <Thumb
                pattern="ripple"
                color="teal"
                gear={[{ kind: "preamp" }, { kind: "delay" }, { kind: "reverb" }]}
                gearHeight={150}
                ratio="16 / 9"
                radius="r-md"
              />
              <div className="fk-packcard-body">
                <div className="fk-packcard-head">
                  <h3 className="fk-t2">{SET_PACK.name}</h3>
                  <p className="fk-packcard-price">
                    <span>{SET_PACK.price}</span>
                    <span className="fk-body-sm">one time</span>
                  </p>
                </div>
                <p className="fk-body fk-muted">{SET_PACK.blurb}</p>
                <ul className="fk-checklist">
                  {SET_PACK.features.map((f) => (
                    <li key={f}>
                      <Check size={20} strokeWidth={1.75} aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={SET_PACK.href} className="fk-btn fk-plan-cta">
                  {SET_PACK.cta}
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="fk-wrap fk-pricing-faq">
        <h2 className="fk-t2">Questions</h2>
        <dl>
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt className="fk-t3">{f.q}</dt>
              <dd className="fk-body fk-muted">
                {f.a.split("{EMAIL}").map((part, i, parts) => (
                  <span key={i}>
                    {part}
                    {i < parts.length - 1 && <ContactEmailText />}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
