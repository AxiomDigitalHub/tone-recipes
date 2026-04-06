"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Zap, Volume2, Speaker, Mic, Clock, Waves, Guitar, type LucideIcon } from "lucide-react";

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
  // -1 = guitar phase, 0..N-1 = node phases
  const [activeIndex, setActiveIndex] = useState(-2); // -2 = not started
  const [dotProgress, setDotProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [guitarLit, setGuitarLit] = useState(false);
  const animFrameRef = useRef<number>(0);

  const totalNodes = nodes.length;
  // Total steps: guitar (index -1) + each node (0..N-1)
  const totalSteps = totalNodes + 1; // +1 for guitar
  const cycleDuration = 4000; // ms for the single pass

  const animate = useCallback(() => {
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / cycleDuration, 1);

      // Map progress to steps: step 0 = guitar, steps 1..N = nodes
      const stepFloat = progress * totalSteps;
      const currentStep = Math.min(Math.floor(stepFloat), totalSteps - 1);

      // Step 0 = guitar, steps 1+ = chain nodes
      if (currentStep === 0) {
        setGuitarLit(true);
        setActiveIndex(-1); // guitar phase, no chain node active yet
      } else {
        setGuitarLit(true);
        setActiveIndex(currentStep - 1); // 0-indexed chain node
      }

      // Dot progress: 0 = at guitar, 1 = past last node
      // Offset so dot starts at guitar position and ends at last node
      setDotProgress(progress);

      if (progress >= 1) {
        // Animation complete — light everything and stop
        setIsComplete(true);
        setGuitarLit(true);
        setActiveIndex(totalNodes - 1);
        return; // stop the loop
      }

      animFrameRef.current = requestAnimationFrame(tick);
    }

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [cycleDuration, totalNodes, totalSteps]);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  // Guitar color
  const guitarColor = "#f59e0b"; // amber

  // Dot position: spans from the guitar box (start) to the last node (end)
  // Guitar occupies the first "slot", nodes occupy the rest
  // When complete, hide the dot
  const dotLeft = isComplete ? -100 : (dotProgress * 100);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-[#0b0f1a] p-4 sm:p-6">
      {/* Guitar type label */}
      {guitarType && (
        <div className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted">
          {guitarType.replace("-", " ")} signal path
        </div>
      )}

      {/* Node chain with guitar */}
      <div className="relative flex items-center justify-between gap-1 sm:gap-2">
        {/* Traveling dot — hidden when animation is complete */}
        {!isComplete && (
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
        )}

        {/* Connection line behind everything */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 items-center px-6 sm:px-8">
          <div className="h-px w-full bg-border" />
        </div>

        {/* Guitar box — first in the chain */}
        <div className="relative z-[1] flex flex-1 flex-col items-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 sm:h-14 sm:w-14"
            style={{
              borderColor: guitarLit ? guitarColor : "rgba(42, 42, 62, 0.8)",
              backgroundColor: (guitarLit && !isComplete && activeIndex === -1)
                ? `${guitarColor}15`
                : guitarLit
                  ? `${guitarColor}08`
                  : "rgba(26, 26, 46, 0.9)",
              boxShadow: guitarLit
                ? isComplete
                  ? `0 0 8px ${guitarColor}30, 0 0 16px ${guitarColor}15`
                  : activeIndex === -1
                    ? `0 0 12px ${guitarColor}40, 0 0 24px ${guitarColor}20`
                    : `0 0 8px ${guitarColor}30, 0 0 16px ${guitarColor}15`
                : "none",
            }}
          >
            <Guitar
              className="h-5 w-5 transition-colors duration-300 sm:h-6 sm:w-6"
              style={{
                color: guitarLit ? guitarColor : "rgba(176, 176, 186, 0.4)",
              }}
              strokeWidth={1.5}
            />
          </div>
          <span
            className="mt-2 text-[9px] font-medium uppercase tracking-wider transition-colors duration-300 sm:text-[10px]"
            style={{
              color: guitarLit ? guitarColor : "rgba(176, 176, 186, 0.4)",
            }}
          >
            Guitar
          </span>
        </div>

        {/* Chain nodes */}
        {nodes.map((node, i) => {
          const Icon = getIcon(node.category);
          const isActive = isComplete || i <= activeIndex;
          const isCurrentNode = !isComplete && i === activeIndex;

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
                    : isActive
                      ? `${node.color}08`
                      : "rgba(26, 26, 46, 0.9)",
                  boxShadow: isCurrentNode
                    ? `0 0 12px ${node.color}40, 0 0 24px ${node.color}20`
                    : isActive
                      ? `0 0 8px ${node.color}30, 0 0 16px ${node.color}15`
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
