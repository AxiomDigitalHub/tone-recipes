import AnimatedSignalChain from "@/components/signal-chain/AnimatedSignalChain";

export default function AnimatedSignalChainPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-5xl">

        {/* ── SRV Demo ── */}
        <div className="mb-6 text-sm text-muted">
          Browse / <span className="font-medium text-foreground">Stevie Ray Vaughan</span> / Pride and Joy
        </div>
        <h1 className="mb-1 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          SRV&apos;s Pride and Joy Rhythm Tone
        </h1>
        <p className="mb-6 text-sm text-accent">
          Stevie Ray Vaughan · Pride and Joy (1983)
        </p>

        <div className="mb-4 flex gap-2">
          <button className="rounded-lg border border-border bg-transparent px-4 py-2 text-xs font-medium text-muted">Compare</button>
          <button className="rounded-lg border border-border bg-transparent px-4 py-2 text-xs text-muted">♡</button>
          <button className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-xs font-bold text-background">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v7M4 5.5l2.5 2.5 2.5-2.5M1.5 11h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Download PDF
          </button>
        </div>

        {/* The Card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-[#161d2f]">

          {/* Platform tabs — above everything */}
          <div className="flex gap-2 overflow-x-auto border-b border-[#1a2235] bg-[#131829] px-5 py-3 scrollbar-hide">
            <button className="shrink-0 rounded-full border border-accent/50 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">Physical</button>
            <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-4 py-1.5 text-xs font-semibold text-[#4a5e78]">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />Helix
            </button>
            <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-4 py-1.5 text-xs font-semibold text-[#4a5e78]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Quad Cortex
            </button>
            <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-4 py-1.5 text-xs font-semibold text-[#4a5e78]">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />TONEX
            </button>
            <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-4 py-1.5 text-xs font-semibold text-[#4a5e78]">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />Boss Katana
            </button>
            <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-4 py-1.5 text-xs font-semibold text-[#4a5e78]">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />Kemper
            </button>
            <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-4 py-1.5 text-xs font-semibold text-[#4a5e78]">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />Fractal
            </button>
          </div>

          {/* Guitar section */}
          <div className="flex items-start gap-5 border-b border-[#1a2235] px-6 py-5">
            {/* Guitar SVG box */}
            <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-xl border-2 border-accent bg-[#0b0f1a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/guitars/Strat.svg" alt="Stratocaster" className="h-12 w-auto opacity-60" style={{ filter: "brightness(0.6) sepia(1) hue-rotate(10deg) saturate(3)" }} />
            </div>
            {/* Specs */}
            <div className="flex-1">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#5a7090]">Guitar</div>
              <div className="mt-1 text-lg font-bold text-[#f0eadf]">Fender Stratocaster (#1 / &apos;Number One&apos;)</div>
              <div className="mt-3 flex gap-8">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a4a60]">Pickups</div>
                  <div className="mt-0.5 text-sm font-semibold text-[#c8d8e8]">SSS (bridge)</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a4a60]">Tuning</div>
                  <div className="mt-0.5 text-sm font-semibold text-[#c8d8e8]">Eb Standard</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a4a60]">Strings</div>
                  <div className="mt-0.5 text-sm font-semibold text-[#c8d8e8]">.013–.058</div>
                </div>
              </div>
            </div>
            {/* Expand button */}
            <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e2840]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 2h3v3M5 11H2V8M11 2 7.5 5.5M2 11l3.5-3.5" stroke="#5a6880" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Animated chain */}
          <div className="px-2 py-6 sm:px-4">
            <AnimatedSignalChain
              hideGuitar
              nodes={[
                { name: "Ibanez Tube Screamer TS808", category: "overdrive", color: "#4ade80" },
                { name: "Fender Vibroverb (1964 Blackface)", category: "amp", color: "#f87171" },
                { name: "Built-in 1×15 JBL D130F", category: "cab", color: "#f87171" },
                { name: "Shure SM57", category: "mic", color: "#94a3b8" },
              ]}
            />
          </div>

          <div className="border-t border-[#1a2235] px-6 py-4 text-center text-xs text-[#253040]">
            Tap any node to see settings ↓
          </div>
        </div>

      </div>
    </div>
  );
}
