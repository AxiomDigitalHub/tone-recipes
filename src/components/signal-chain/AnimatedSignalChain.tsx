"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Zap, Volume2, Speaker, Mic, Clock, Waves, Guitar, type LucideIcon } from "lucide-react";

interface AnimatedSignalChainProps {
  nodes: { name: string; category: string; color: string }[];
  guitarType?: "strat" | "tele" | "lp" | "sg" | "explorer" | "flying-v";
}

const categoryIcons: Record<string, LucideIcon> = {
  overdrive: Zap, distortion: Zap, drive: Zap, boost: Zap, compressor: Zap,
  amp: Volume2, preamp: Volume2,
  cab: Speaker, cabinet: Speaker,
  mic: Mic, microphone: Mic,
  delay: Clock,
  reverb: Waves, modulation: Waves, chorus: Waves, tremolo: Waves, phaser: Waves, flanger: Waves,
};

const categoryLabels: Record<string, string> = {
  overdrive: "Overdrive", distortion: "Distortion", drive: "Drive", boost: "Boost", compressor: "Comp",
  amp: "Amp", preamp: "Preamp",
  cab: "Cabinet", cabinet: "Cabinet",
  mic: "Mic", microphone: "Mic",
  delay: "Delay",
  reverb: "Reverb", modulation: "Mod", chorus: "Chorus", tremolo: "Trem", phaser: "Phaser", flanger: "Flanger",
};

function getIcon(category: string): LucideIcon {
  return categoryIcons[category.toLowerCase()] ?? Zap;
}

function getLabel(category: string): string {
  return categoryLabels[category.toLowerCase()] ?? category;
}

/** Dashed connector with optional traveling dot */
function Connector({ active, showDot }: { active: boolean; showDot: boolean }) {
  return (
    <div className="relative flex w-10 flex-shrink-0 items-center sm:w-14">
      {/* Dashed line */}
      <div
        className="h-px w-full transition-colors duration-500"
        style={{
          backgroundImage: active
            ? "repeating-linear-gradient(90deg, #3a4a60 0, #3a4a60 4px, transparent 4px, transparent 8px)"
            : "repeating-linear-gradient(90deg, #1e2840 0, #1e2840 4px, transparent 4px, transparent 8px)",
        }}
      />
      {/* Question mark circle */}
      <div
        className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[9px] font-bold transition-all duration-500"
        style={{
          borderColor: active ? "#3a4a60" : "#1e2840",
          color: active ? "#3a4a60" : "#1e2840",
          backgroundColor: "#0b0f1a",
        }}
      >
        ?
      </div>
      {/* Traveling dot */}
      {showDot && (
        <div
          className="animate-connector-dot absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 10, height: 10,
            background: "radial-gradient(circle, #fff 0%, #a5f3fc 30%, #22d3ee 100%)",
            boxShadow: "0 0 6px 3px rgba(34,211,238,0.8), 0 0 16px 6px rgba(34,211,238,0.3)",
          }}
        />
      )}
    </div>
  );
}

export default function AnimatedSignalChain({ nodes, guitarType }: AnimatedSignalChainProps) {
  const [activeStep, setActiveStep] = useState(-1); // -1=not started, 0=guitar, 1..N=nodes
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const totalSteps = nodes.length + 1; // guitar + nodes

  const runAnimation = useCallback(() => {
    let step = 0;
    const stepDuration = 800; // ms per step

    function advance() {
      setActiveStep(step);
      step++;
      if (step <= totalSteps) {
        timerRef.current = setTimeout(advance, stepDuration);
      } else {
        setIsComplete(true);
      }
    }

    // Start after a brief pause so user sees the unlit state
    timerRef.current = setTimeout(advance, 600);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [totalSteps]);

  useEffect(() => {
    const cleanup = runAnimation();
    return cleanup;
  }, [runAnimation]);

  const guitarLit = activeStep >= 0;
  const guitarColor = "#f59e0b";

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-[#0b0f1a] p-5 sm:p-8">
      {/* Guitar type label */}
      {guitarType && (
        <div className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[3px] text-[#3a4a60]">
          {guitarType.replace("-", " ")} signal path
        </div>
      )}

      {/* Signal chain */}
      <div className="flex items-start justify-center">
        {/* Guitar node */}
        <div className="flex flex-col items-center">
          <div
            className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-2 transition-all duration-500 sm:h-20 sm:w-20"
            style={{
              borderColor: guitarLit ? guitarColor : "#1e2840",
              backgroundColor: guitarLit ? `${guitarColor}10` : "#0b0f1a",
              boxShadow: guitarLit
                ? `0 0 0 1px ${guitarColor}15, 0 8px 24px ${guitarColor}${isComplete ? "30" : activeStep === 0 ? "60" : "30"}`
                : "none",
              transform: activeStep === 0 && !isComplete ? "translateY(-6px)" : "none",
            }}
          >
            <Guitar
              className="h-7 w-7 transition-colors duration-500 sm:h-8 sm:w-8"
              style={{ color: guitarLit ? guitarColor : "#2a3a55" }}
              strokeWidth={1.5}
            />
          </div>
          <div
            className="mt-2.5 text-[9px] font-bold uppercase tracking-[2px] transition-colors duration-500"
            style={{ color: guitarLit ? "#5a7090" : "#2a3a55" }}
          >
            Guitar
          </div>
        </div>

        {/* Connector: guitar → first node */}
        <Connector active={activeStep >= 1} showDot={activeStep === 1 && !isComplete} />

        {/* Chain nodes with connectors */}
        {nodes.map((node, i) => {
          const Icon = getIcon(node.category);
          const stepIndex = i + 1; // step 0 = guitar, step 1+ = nodes
          const isLit = isComplete || activeStep >= stepIndex;
          const isCurrent = !isComplete && activeStep === stepIndex;

          return (
            <div key={`${node.name}-${i}`} className="contents">
              {/* Node */}
              <div className="flex flex-col items-center">
                <div
                  className="flex h-[72px] w-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 transition-all duration-500 sm:h-20 sm:w-20"
                  style={{
                    borderColor: isLit ? node.color : "#1e2840",
                    backgroundColor: isLit ? `${node.color}10` : "#0b0f1a",
                    boxShadow: isLit
                      ? `0 0 0 1px ${node.color}15, 0 8px 24px ${node.color}${isComplete ? "30" : isCurrent ? "60" : "30"}`
                      : "none",
                    transform: isCurrent ? "translateY(-6px)" : "none",
                  }}
                >
                  <Icon
                    className="h-6 w-6 transition-colors duration-500 sm:h-7 sm:w-7"
                    style={{ color: isLit ? node.color : "#2a3a55" }}
                    strokeWidth={1.5}
                  />
                  <div
                    className="text-[8px] font-bold uppercase tracking-[1.5px] transition-colors duration-500"
                    style={{ color: isLit ? `${node.color}90` : "#2a3a55" }}
                  >
                    {getLabel(node.category)}
                  </div>
                </div>
                {/* Name label below */}
                <div
                  className="mt-2.5 max-w-[80px] text-center text-[10px] font-medium leading-tight transition-colors duration-500 sm:max-w-[100px] sm:text-[11px]"
                  style={{ color: isLit ? "#7a8fa8" : "#253040" }}
                >
                  {node.name}
                </div>
              </div>

              {/* Connector to next node (if not last) */}
              {i < nodes.length - 1 && (
                <Connector
                  active={activeStep >= stepIndex + 1}
                  showDot={activeStep === stepIndex + 1 && !isComplete}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
