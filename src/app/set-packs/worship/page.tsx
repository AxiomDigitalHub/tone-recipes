import type { Metadata } from "next";
import Link from "next/link";
import { Check, Download, Music, Zap, Clock, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Worship Set Pack — Helix Preset with 8 Snapshots",
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

export default function WorshipSetPackPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Link href="/set-packs" className="hover:text-accent">Set Packs</Link>
        <span>/</span>
        <span>Worship</span>
      </div>

      <h1 className="text-3xl font-bold md:text-5xl">
        Worship Set Pack
      </h1>
      <p className="mt-4 text-lg text-muted">
        One preset. 8 snapshots. Your entire Sunday morning covered.
      </p>

      {/* Key selling points */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <Music className="mb-2 h-5 w-5 text-accent" />
          <h3 className="text-sm font-bold">30 Songs Mapped</h3>
          <p className="mt-1 text-xs text-muted">Know exactly which snapshot for every section of every song.</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <Zap className="mb-2 h-5 w-5 text-accent" />
          <h3 className="text-sm font-bold">Gapless Switching</h3>
          <p className="mt-1 text-xs text-muted">Snapshots switch instantly. Trails enabled on all delays and reverbs.</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <Clock className="mb-2 h-5 w-5 text-accent" />
          <h3 className="text-sm font-bold">Sunday Ready</h3>
          <p className="mt-1 text-xs text-muted">Load it, check the mapper, play. No tweaking required.</p>
        </div>
      </div>

      {/* Snapshot grid */}
      <h2 className="mb-6 mt-16 text-2xl font-bold">8 Snapshots</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {snapshots.map((snap) => (
          <div
            key={snap.name}
            className="rounded-xl border border-border bg-surface p-4"
            style={{ borderLeftColor: snap.color, borderLeftWidth: 3 }}
          >
            <h3 className="text-sm font-bold" style={{ color: snap.color }}>{snap.name}</h3>
            <p className="mt-1 text-xs text-muted">{snap.desc}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-muted/60">{snap.use}</p>
          </div>
        ))}
      </div>

      {/* Signal chain */}
      <h2 className="mb-6 mt-16 text-2xl font-bold">Signal Chain</h2>
      <div className="flex flex-wrap gap-2">
        {chainBlocks.map((block, i) => (
          <div key={block.name} className="flex items-center gap-2">
            <div className="rounded-lg border border-border bg-[#0b0f1a] px-3 py-2">
              <p className="text-xs font-bold text-foreground">{block.name}</p>
              <p className="text-[10px] text-muted">{block.cat}</p>
            </div>
            {i < chainBlocks.length - 1 && (
              <span className="text-muted/30">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Download section */}
      <div className="mt-16 rounded-2xl border border-accent/30 bg-accent/5 p-8">
        <h2 className="text-xl font-bold">Download the Worship Set Pack</h2>
        <p className="mt-2 text-sm text-muted">
          Includes the .hlx preset file and the Setlist Mapper (PDF with snapshot-per-song for 30 top worship songs).
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="/api/set-packs/worship"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            <Download className="h-4 w-4" />
            Download .hlx Preset
          </a>
          <a
            href="/set-packs/worship-setlist-mapper.md"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-surface"
          >
            <Waves className="h-4 w-4" />
            View Setlist Mapper
          </a>
        </div>
        <p className="mt-4 text-xs text-muted">
          Compatible with Helix Floor, Helix LT, Helix Rack, and HX Stomp (firmware 3.80+).
        </p>
      </div>

      {/* Quick start */}
      <h2 className="mb-6 mt-16 text-2xl font-bold">Quick Start</h2>
      <ol className="space-y-3 text-sm text-muted">
        <li className="flex gap-3">
          <span className="shrink-0 font-bold text-accent">1.</span>
          Load <code className="rounded bg-surface px-1.5 py-0.5 text-foreground">FK-Worship.hlx</code> into HX Edit
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-bold text-accent">2.</span>
          Set your Helix to Snapshot mode (or Snap/Stomp hybrid)
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-bold text-accent">3.</span>
          Look up your setlist in the Setlist Mapper above
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-bold text-accent">4.</span>
          Start on the Verse snapshot for each song — switch as you go
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-bold text-accent">5.</span>
          Use your guitar volume knob to clean up any snapshot further
        </li>
      </ol>
    </div>
  );
}
