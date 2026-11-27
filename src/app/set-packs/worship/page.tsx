import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Music, Zap, Clock } from "lucide-react";
import SetlistMapper from "@/components/set-packs/SetlistMapper";
import SetPackAccess from "@/components/set-packs/SetPackAccess";
import { ContactEmailText } from "@/components/ui/ContactEmail";
import ChainStrip from "@/app/_pages/ChainStrip";
import type { PreviewBlockData } from "@/components/v3/preview-helpers";

export const metadata: Metadata = {
  title: "Worship Set Pack: Helix Preset with 8 Snapshots",
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
  { name: "CLEAN", desc: "Pure clean, subtle reverb + quarter note delay", use: "Verses, intros, quiet moments" },
  { name: "DRIVE", desc: "Light Klon overdrive, amp pushed slightly", use: "Pre-chorus, building sections" },
  { name: "DRIVE+", desc: "Klon + 808 stacked, medium gain", use: "Choruses, driving sections" },
  { name: "LEAD", desc: "Full drive + solo delay, level boost", use: "Solos, melodic lines" },
  { name: "CLN AMBI", desc: "Clean + chorus + dotted eighth + shimmer", use: "Ambient pads, prayer time" },
  { name: "AMB DRV", desc: "Light drive + full ambient effects", use: "Ethereal drive sections" },
  { name: "ROCK", desc: "Heavier crunch, AC30 pushed hard", use: "Rock-influenced worship" },
  { name: "SWELLS", desc: "Max reverb + delay + shimmer", use: "Volume swells, pad textures" },
];

// The pack's own Helix chain with its base settings (generate-set-pack.ts),
// drawn as gear like the recipe pages. Snapshots switch blocks on and off.
const chainBlocks: PreviewBlockData[] = [
  {
    name: "Deluxe Comp", sub: "Always on", variant: "pedal", category: "Dynamics",
    controls: ["Threshold", "Ratio", "Mix", "Level"],
    values: { Threshold: -36, Ratio: 2, Mix: 0.74, Level: 0 },
    ranges: { Threshold: { min: -60, max: 0, unit: "dB" }, Level: { min: -12, max: 12, unit: "dB" } },
  },
  {
    name: "Minotaur (Klon)", sub: "Drive 1", variant: "pedal", category: "Distortion",
    controls: ["Gain", "Tone", "Level"], values: { Gain: 0.3, Tone: 0.55, Level: 0.5 },
  },
  {
    name: "Scream 808", sub: "Drive 2", variant: "pedal", category: "Distortion",
    controls: ["Gain", "Tone", "Level"], values: { Gain: 0.35, Tone: 0.5, Level: 0.5 },
  },
  {
    name: "Essex A30", sub: "Vox AC30 combo", variant: "amp", category: "Amp",
    controls: ["Drive", "Bass", "Mid", "Treble", "Presence", "Ch Vol"],
    values: { Drive: 0.35, Bass: 0.5, Mid: 0.55, Treble: 0.6, Presence: 0.5, "Ch Vol": 0.6 },
  },
  { name: "2x12 Blue Bell", sub: "Cabinet", variant: "cab", category: "Cab", controls: [], values: {} },
  {
    name: "70s Chorus", sub: "Modulation", variant: "pedal", category: "Modulation",
    controls: ["Speed", "Depth", "Mix"], values: { Speed: 0.3, Depth: 0.4, Mix: 0.35 },
  },
  {
    name: "Transistor Tape (1/4)", sub: "Delay", variant: "pedal", category: "Delay",
    controls: ["Time", "Feedback", "Mix"], values: { Time: 0.5, Feedback: 0.35, Mix: 0.25 },
  },
  {
    name: "Vintage Digital (dotted 1/8)", sub: "Delay", variant: "pedal", category: "Delay",
    controls: ["Time", "Feedback", "Mix"], values: { Time: 0.375, Feedback: 0.4, Mix: 0.3 },
  },
  {
    name: "Plate Reverb", sub: "Reverb", variant: "pedal", category: "Reverb",
    controls: ["Mix", "Decay", "Predelay"], values: { Mix: 0.23, Decay: 0.43, Predelay: 0.07 },
  },
  {
    name: "Glitz (shimmer)", sub: "Reverb", variant: "pedal", category: "Reverb",
    controls: ["Mix", "Decay", "Predelay"], values: { Mix: 0.4, Decay: 0.7, Predelay: 0.05 },
  },
];

/**
 * Product + Offer JSON-LD. Lists the public $19 price (the Pass 30%
 * discount is a member benefit, not a public list price, so it doesn't
 * belong in the schema). Adding this makes the page eligible for the
 * SERP shopping/product rich result, the single highest-CTR rich
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
    <div className="fk-wrap fkp-page">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSON_LD) }}
      />

      <nav aria-label="Breadcrumb" className="fk-crumbs fk-caption">
        <Link href="/set-packs">Set packs</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Worship</span>
      </nav>

      <header className="fkp-head">
        <h1 className="fk-display">Worship Set Pack</h1>
        <p className="fk-lead fkp-measure">
          One preset. 8 snapshots. Your entire Sunday morning covered.
        </p>
      </header>

      {/* Key selling points */}
      <div className="fkp-tiles fkp-pad-top">
        {[
          { icon: Music, title: "30 songs mapped", desc: "Know exactly which snapshot for every section of every song." },
          { icon: Zap, title: "Gapless switching", desc: "Snapshots switch instantly. Trails enabled on all delays and reverbs." },
          { icon: Clock, title: "Sunday ready", desc: "Load it, check the mapper, play. No tweaking required." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="fk-tile fkp-linktile">
            <Icon size={20} strokeWidth={1.75} aria-hidden className="fkp-muted" />
            <h2 className="fk-t3">{title}</h2>
            <p className="fk-body-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* Snapshot grid */}
      <section className="fkp-section">
        <h2 className="fk-t2">8 snapshots</h2>
        <div className="fkp-snaps">
          {snapshots.map((snap) => (
            <div key={snap.name} className="fk-tile fkp-snap">
              <p className="fk-data fkp-snap-name">{snap.name}</p>
              <p className="fk-body-sm">{snap.desc}</p>
              <p className="fk-caption">{snap.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signal chain */}
      <section className="fkp-section">
        <h2 className="fk-t2">Signal chain</h2>
        <ChainStrip blocks={chainBlocks} height={96} wrap label="Signal chain, input to output" />
      </section>

      {/* Setlist Mapper */}
      <section className="fkp-section">
        <div className="fkp-stack">
          <h2 className="fk-t2">Setlist Mapper</h2>
          <p className="fk-body fkp-muted">
            Which snapshot for which section of which song. Search your setlist
            below.
          </p>
        </div>
        <SetlistMapper />
      </section>

      {/* Buy / download section */}
      <section className="fkp-section">
        <div className="fk-tile fkp-buy">
          <h2 className="fk-t2">Get the Worship Set Pack</h2>
          <p className="fk-body fkp-measure">
            One .hlx file with all 8 snapshots, plus the Setlist Mapper. Load
            it into HX Edit and you&apos;re Sunday-ready. One-time $19, yours to
            keep, no subscription.
          </p>
          <div className="fkp-ctas">
            {/* Wrapped in Suspense because SetPackAccess reads
                `useSearchParams()` (for the ?purchased=true success-return
                flag). Without the boundary the whole page bails out of
                static rendering and the build fails. */}
            <Suspense
              fallback={
                <button type="button" disabled className="fk-btn fk-btn-secondary">
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
          <p className="fk-caption">
            Compatible with Line 6 Helix and HX Stomp on recent firmware.
            30-day refund if it doesn&apos;t work for your rig. Just email{" "}
            <ContactEmailText />.
          </p>
        </div>
      </section>

      {/* Quick start */}
      <section className="fkp-section">
        <h2 className="fk-t2">Quick start</h2>
        <ol className="fkp-numlist fkp-measure">
          {[
            <>Load <code className="fk-data fkp-code">FK-Worship.hlx</code> into HX Edit</>,
            "Set your Helix to Snapshot mode (or Snap/Stomp hybrid)",
            "Look up your setlist in the Setlist Mapper above",
            "Start on the Verse snapshot for each song, then switch as you go",
            "Use your guitar volume knob to clean up any snapshot further",
          ].map((text, i) => (
            <li key={i}>
              <span className="fkp-numlist-n" aria-hidden="true">
                {i + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
