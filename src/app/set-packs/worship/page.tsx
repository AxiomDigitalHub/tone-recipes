import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Music, Zap, Clock } from "lucide-react";
import SetlistMapper from "@/components/set-packs/SetlistMapper";
import SetPackAccess from "@/components/set-packs/SetPackAccess";
import { ContactEmailText } from "@/components/ui/ContactEmail";

export const metadata: Metadata = {
  title: "Worship Set Pack — Helix Preset with 8 Snapshots",
  alternates: { canonical: "/set-packs/worship" },
  description:
    "One Helix preset with 8 snapshots that covers your entire worship setlist. AC30 + Klon + delays + shimmer reverb. Includes Setlist Mapper for 30 top worship songs.",
  openGraph: {
    title: "Worship Set Pack | Fader & Knob",
    description:
      "One preset, 8 snapshots, your entire worship setlist covered. AC30 + Klon + delays + shimmer. Includes Setlist Mapper.",
    type: "website",
  },
};

const snapshots = [
  { name: "CLEAN", desc: "Pure clean, subtle reverb + quarter note delay", color: "#4ade80", use: "Verses, intros, quiet moments" },
  { name: "DRIVE", desc: "Light Klon overdrive, amp pushed slightly", color: "#eab308", use: "Pre-chorus, building sections" },
  { name: "DRIVE+", desc: "Klon + 808 stacked, medium gain", color: "#f97316", use: "Choruses, driving sections" },
  { name: "LEAD", desc: "Full drive + solo delay, level boost", color: "#ef4444", use: "Solos, melodic lines" },
  { name: "CLN AMBI", desc: "Clean + chorus + dotted eighth + shimmer", color: "#3b82f6", use: "Ambient pads, prayer time" },
  { name: "AMB DRV", desc: "Light drive + full ambient effects", color: "#06b6d4", use: "Ethereal drive sections" },
  { name: "ROCK", desc: "Heavier crunch, AC30 pushed hard", color: "#8b5cf6", use: "Rock-influenced worship" },
  { name: "SWELLS", desc: "Max reverb + delay + shimmer", color: "#ec4899", use: "Volume swells, pad textures" },
];

const chainBlocks = [
  { name: "Deluxe Comp", cat: "Always on" },
  { name: "Minotaur (Klon)", cat: "Drive 1" },
  { name: "Scream 808", cat: "Drive 2" },
  { name: "Essex A30", cat: "Amp (AC30)" },
  { name: "2x12 Blue Bell", cat: "Cabinet" },
  { name: "70s Chorus", cat: "Modulation" },
  { name: "Transistor Tape", cat: "Delay (1/4)" },
  { name: "Vintage Digital", cat: "Delay (dotted 1/8)" },
  { name: "Plate Reverb", cat: "Reverb" },
  { name: "Glitz Reverb", cat: "Shimmer" },
];

/**
 * Product + Offer JSON-LD. Lists the public $19 price (the Pass 30%
 * discount is a member benefit, not a public list price, so it doesn't
 * belong in the schema). Adding this makes the page eligible for the
 * SERP shopping/product rich result — the single highest-CTR rich
 * result format for paid content.
 */
const PRODUCT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Worship Set Pack",
  description:
    "One Line 6 Helix preset with 8 snapshots covering clean ambient through rock crunch, plus a 30-song Setlist Mapper. AC30 + Klon + delays + shimmer reverb, dialed and ready for Sunday morning.",
  category: "Music software / preset pack",
  brand: { "@type": "Brand", name: "Fader & Knob" },
  url: "https://faderandknob.com/set-packs/worship",
  // Reuse the existing worship-guitar editorial image as the product
  // image until a dedicated 1200×630 product hero ships.
  image: "https://faderandknob.com/images/blog/worship-guitar-tone-helix.jpg",
  offers: {
    "@type": "Offer",
    price: "19.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://faderandknob.com/set-packs/worship",
    seller: { "@type": "Organization", name: "Fader & Knob" },
    // Refund window matches the on-page copy ("30-day refund if it
    // doesn't work for your rig").
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "US",
      returnPolicyCategory:
        "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  },
};

export default function WorshipSetPackPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSON_LD) }}
      />

      {/* Header */}
      <div
        className="mb-4 flex items-center gap-2 text-sm"
        style={{ color: "var(--ink-muted)" }}
      >
        <Link href="/set-packs" style={{ color: "var(--amber-2)" }}>
          Set Packs
        </Link>
        <span>/</span>
        <span>Worship</span>
      </div>

      <h1
        className="display text-4xl md:text-5xl"
        style={{ color: "var(--ink)", lineHeight: 1.1 }}
      >
        Worship Set Pack
      </h1>
      <p
        className="mt-4 text-lg"
        style={{ color: "var(--ink-muted)" }}
      >
        One preset. 8 snapshots. Your entire Sunday morning covered.
      </p>

      {/* Key selling points */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Music, title: "30 Songs Mapped", desc: "Know exactly which snapshot for every section of every song." },
          { icon: Zap, title: "Gapless Switching", desc: "Snapshots switch instantly. Trails enabled on all delays and reverbs." },
          { icon: Clock, title: "Sunday Ready", desc: "Load it, check the mapper, play. No tweaking required." },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl p-5"
            style={{
              background: "var(--paper-2)",
              border: "1px solid rgba(10,9,8,0.12)",
            }}
          >
            <Icon className="mb-2 h-5 w-5" style={{ color: "var(--amber-2)" }} />
            <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>
              {title}
            </h3>
            <p className="mt-1 text-xs" style={{ color: "var(--ink-muted)" }}>
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* Snapshot grid */}
      <h2
        className="mb-6 mt-16 text-2xl font-bold"
        style={{ color: "var(--ink)" }}
      >
        8 Snapshots
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {snapshots.map((snap) => (
          <div
            key={snap.name}
            className="rounded-xl p-4"
            style={{
              background: "var(--paper-2)",
              border: "1px solid rgba(10,9,8,0.12)",
              borderLeft: `3px solid ${snap.color}`,
            }}
          >
            <h3 className="text-sm font-bold" style={{ color: snap.color }}>
              {snap.name}
            </h3>
            <p className="mt-1 text-xs" style={{ color: "var(--ink-muted)" }}>
              {snap.desc}
            </p>
            <p
              className="mt-2 text-[10px] uppercase tracking-wider"
              style={{ color: "var(--ink-faint)" }}
            >
              {snap.use}
            </p>
          </div>
        ))}
      </div>

      {/* Signal chain */}
      <h2
        className="mb-6 mt-16 text-2xl font-bold"
        style={{ color: "var(--ink)" }}
      >
        Signal Chain
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {chainBlocks.map((block, i) => (
          <div key={block.name} className="flex items-center gap-2">
            <div
              className="rounded-lg px-3 py-2"
              style={{
                background: "var(--paper-2)",
                border: "1px solid var(--ink)",
              }}
            >
              <p className="text-xs font-bold" style={{ color: "var(--ink)" }}>
                {block.name}
              </p>
              <p className="text-[10px]" style={{ color: "var(--ink-muted)" }}>
                {block.cat}
              </p>
            </div>
            {i < chainBlocks.length - 1 && (
              <span style={{ color: "var(--ink-faint)" }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Setlist Mapper */}
      <h2
        className="mb-2 mt-16 text-2xl font-bold"
        style={{ color: "var(--ink)" }}
      >
        Setlist Mapper
      </h2>
      <p className="mb-6 text-sm" style={{ color: "var(--ink-muted)" }}>
        Which snapshot for which section of which song. Search your setlist
        below.
      </p>
      <SetlistMapper />

      {/* Buy / download section */}
      <div
        className="mt-16 rounded-2xl p-8"
        style={{
          background: "rgba(228, 162, 53, 0.08)",
          border: "1px solid rgba(228, 162, 53, 0.4)",
        }}
      >
        <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
          Get the Worship Set Pack
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
          One .hlx file with all 8 snapshots, plus the Setlist Mapper. Load
          it into HX Edit and you&apos;re Sunday-ready. One-time $19, yours to
          keep — no subscription.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {/* Wrapped in Suspense because SetPackAccess reads
              `useSearchParams()` (for the ?purchased=true success-return
              flag). Without the boundary the whole page bails out of
              static rendering and the build fails. */}
          <Suspense
            fallback={
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
                style={{
                  background: "var(--paper-2)",
                  color: "var(--ink-muted)",
                  border: "1px solid rgba(10,9,8,0.15)",
                }}
              >
                Loading…
              </button>
            }
          >
            <SetPackAccess
              packSlug="worship"
              packName="Worship"
              priceDisplay="$19"
              format="hlx"
            />
          </Suspense>
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--ink-muted)" }}>
          Compatible with Line 6 Helix and HX Stomp on recent firmware.
          30-day refund if it doesn&apos;t work for your rig — just email{" "}
          <ContactEmailText />.
        </p>
      </div>

      {/* Quick start */}
      <h2
        className="mb-6 mt-16 text-2xl font-bold"
        style={{ color: "var(--ink)" }}
      >
        Quick Start
      </h2>
      <ol className="space-y-3 text-sm" style={{ color: "var(--ink-muted)" }}>
        {[
          ["1.", <>Load <code style={{ background: "var(--paper-2)", border: "1px solid rgba(10,9,8,0.12)", color: "var(--ink)", padding: "2px 6px", borderRadius: 4 }}>FK-Worship.hlx</code> into HX Edit</>],
          ["2.", "Set your Helix to Snapshot mode (or Snap/Stomp hybrid)"],
          ["3.", "Look up your setlist in the Setlist Mapper above"],
          ["4.", "Start on the Verse snapshot for each song — switch as you go"],
          ["5.", "Use your guitar volume knob to clean up any snapshot further"],
        ].map(([n, text], i) => (
          <li key={i} className="flex gap-3">
            <span
              className="shrink-0 font-bold"
              style={{ color: "var(--amber-2)" }}
            >
              {n}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
