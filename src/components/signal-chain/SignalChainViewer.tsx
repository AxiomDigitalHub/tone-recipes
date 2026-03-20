"use client";

import type { SignalChainNode as NodeType, GuitarSpecs } from "@/types/recipe";
import SignalChainNode from "./SignalChainNode";
import ChainTooltip from "./ChainTooltip";
import { getChainTip } from "@/lib/chain-tips";

interface SignalChainViewerProps {
  guitarSpecs: GuitarSpecs;
  signalChain: NodeType[];
}

export default function SignalChainViewer({ guitarSpecs, signalChain }: SignalChainViewerProps) {
  // Get the tip between guitar and first chain node (if any)
  const firstNode = signalChain[0];
  const guitarToFirstTip = firstNode
    ? getChainTip("guitar", firstNode.category, null, firstNode.subcategory)
    : null;

  return (
    <div className="w-full md:overflow-x-auto">
      <div className="flex flex-col items-center gap-2 px-4 py-6 md:flex-row md:items-start md:justify-center">
        {/* Guitar node — same expandable style as pedals/amps */}
        <SignalChainNode guitarSpecs={guitarSpecs} />

        {/* Signal flow line + optional tooltip between guitar and first node */}
        <div className="flex flex-col items-center gap-1 md:mt-8 md:flex-row">
          <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
          {guitarToFirstTip && <ChainTooltip tip={guitarToFirstTip} />}
          <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
        </div>

        {/* Chain nodes */}
        {signalChain.map((node, i) => {
          const nextNode = signalChain[i + 1];
          const tip = nextNode
            ? getChainTip(node.category, nextNode.category, node.subcategory, nextNode.subcategory)
            : null;

          return (
            <div key={node.position} className="flex flex-col items-center md:flex-row md:items-start">
              <SignalChainNode node={node} />
              {i < signalChain.length - 1 && (
                <div className="flex flex-col items-center gap-1 md:mt-8 md:flex-row">
                  <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
                  {tip && <ChainTooltip tip={tip} />}
                  <div className="signal-line h-3 w-0.5 rounded-full md:h-0.5 md:w-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
