"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap, Volume2, Speaker, Mic, Clock, Waves, type LucideIcon } from "lucide-react";

interface AnimatedSignalChainProps {
  nodes: { name: string; category: string; color: string }[];
  guitarType?: "strat" | "tele" | "lp" | "sg" | "explorer" | "flying-v";
}

const categoryIcons: Record<string, LucideIcon> = {
  overdrive: Zap,
  distortion: Zap,
  drive: Zap,
  boost: Zap,
  amp: Volume2,
  preamp: Volume2,
  cab: Speaker,
  cabinet: Speaker,
  mic: Mic,
  microphone: Mic,
  delay: Clock,
  reverb: Waves,
  modulation: Waves,
  chorus: Waves,
  tremolo: Waves,
  phaser: Waves,
  flanger: Waves,
};

function getIcon(category: string): LucideIcon {
  const key = category.toLowerCase();
  return categoryIcons[key] ?? Zap;
}

export default function AnimatedSignalChain({
  nodes,
  guitarType,
}: AnimatedSignalChainProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dotProgress, setDotProgress] = useState(0);

  const totalNodes = nodes.length;
  const cycleDuration = 4000; // ms for full cycle
  const pausePerNode = cycleDuration / totalNodes;

  const animate = useCallback(() => {
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = (now - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;
      const nodeFloat = progress * totalNodes;
      const currentNode = Math.min(Math.floor(nodeFloat), totalNodes - 1);

      setActiveIndex(currentNode);
      setDotProgress(progress);

      requestAnimationFrame(tick);
    }

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [cycleDuration, totalNodes]);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  // Calculate dot position as a percentage across the full chain
  const dotLeft = totalNodes > 1 ? (dotProgress * 100) : 0;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-[#0b0f1a] p-4 sm:p-6">
      {/* Guitar type label */}
      {guitarType && (
        <div className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted">
          {guitarType.replace("-", " ")} signal path
        </div>
      )}

      {/* Node chain */}
      <div className="relative flex items-center justify-between gap-1 sm:gap-2">
        {/* Traveling dot */}
        <div
          className="pointer-events-none absolute top-1/2 z-10 h-3 w-3 -translate-y-1/2 rounded-full transition-none"
          style={{
            left: `${dotLeft}%`,
            transform: "translate(-50%, -50%)",
            background: "#22d3ee",
            boxShadow:
              "0 0 8px #22d3ee, 0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(34, 211, 238, 0.2)",
          }}
        />

        {/* Connection lines behind nodes */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 items-center px-6 sm:px-8">
          <div className="h-px w-full bg-border" />
        </div>

        {nodes.map((node, i) => {
          const Icon = getIcon(node.category);
          const isActive = i <= activeIndex;
          const isCurrentNode = i === activeIndex;

          return (
            <div
              key={`${node.name}-${i}`}
              className="relative z-[1] flex flex-1 flex-col items-center"
            >
              {/* Node box */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 sm:h-14 sm:w-14"
                style={{
                  borderColor: isActive ? node.color : "rgba(42, 42, 62, 0.8)",
                  backgroundColor: isCurrentNode
                    ? `${node.color}15`
                    : "rgba(26, 26, 46, 0.9)",
                  boxShadow: isCurrentNode
                    ? `0 0 12px ${node.color}40, 0 0 24px ${node.color}20`
                    : "none",
                }}
              >
                <Icon
                  className="h-5 w-5 transition-colors duration-300 sm:h-6 sm:w-6"
                  style={{
                    color: isActive ? node.color : "rgba(176, 176, 186, 0.4)",
                  }}
                  strokeWidth={1.5}
                />
              </div>

              {/* Node label */}
              <span
                className="mt-2 text-[9px] font-medium uppercase tracking-wider transition-colors duration-300 sm:text-[10px]"
                style={{
                  color: isActive ? node.color : "rgba(176, 176, 186, 0.4)",
                }}
              >
                {node.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
