import AnimatedSignalChain from "@/components/signal-chain/AnimatedSignalChain";

export default function AnimatedSignalChainPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Animated Signal Chain
        </h1>
        <p className="mb-12 text-muted">
          Interactive signal flow visualization — watch the signal travel through the chain.
        </p>

        <div className="mb-16">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            SRV — Pride and Joy
          </h2>
          <AnimatedSignalChain
            nodes={[
              { name: "Tube Screamer TS808", category: "overdrive", color: "#4ade80" },
              { name: "Fender Vibroverb", category: "amp", color: "#f87171" },
              { name: "1x15 JBL D130F", category: "cab", color: "#f87171" },
              { name: "Shure SM57", category: "mic", color: "#94a3b8" },
            ]}
            guitarType="strat"
          />
        </div>

        <div className="mb-16">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            The Edge — Where the Streets Have No Name
          </h2>
          <AnimatedSignalChain
            nodes={[
              { name: "Vox AC30", category: "amp", color: "#f87171" },
              { name: "Korg SDD-3000", category: "delay", color: "#60a5fa" },
              { name: "Memory Man", category: "delay", color: "#60a5fa" },
              { name: "Hall Reverb", category: "reverb", color: "#a78bfa" },
              { name: "2x12 Blue Bell", category: "cab", color: "#f87171" },
            ]}
            guitarType="explorer"
          />
        </div>

        <div className="mb-16">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Slash — Sweet Child O' Mine
          </h2>
          <AnimatedSignalChain
            nodes={[
              { name: "Marshall JCM800", category: "amp", color: "#f87171" },
              { name: "4x12 Greenback", category: "cab", color: "#f87171" },
              { name: "SM57", category: "mic", color: "#94a3b8" },
            ]}
            guitarType="lp"
          />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Worship — Ambient Clean
          </h2>
          <AnimatedSignalChain
            nodes={[
              { name: "Deluxe Comp", category: "compressor", color: "#94a3b8" },
              { name: "Klon Drive", category: "overdrive", color: "#4ade80" },
              { name: "Line 6 Clarity", category: "amp", color: "#f87171" },
              { name: "1x12 Open Cream", category: "cab", color: "#f87171" },
              { name: "Vintage Digital", category: "delay", color: "#60a5fa" },
              { name: "Plate Reverb", category: "reverb", color: "#a78bfa" },
            ]}
            guitarType="tele"
          />
        </div>
      </div>
    </div>
  );
}
