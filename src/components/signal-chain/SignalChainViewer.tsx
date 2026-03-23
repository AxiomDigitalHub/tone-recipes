"use client";

import type { SignalChainNode as NodeType, GuitarSpecs } from "@/types/recipe";
import SignalChainNode from "./SignalChainNode";
import ChainTooltip from "./ChainTooltip";
import { getChainTip } from "@/lib/chain-tips";

interface SignalChainViewerProps {
  signalChain: NodeType[];
}

/** Standalone chain viewer (without guitar header or platform tabs). */
export default function SignalChainViewer({ signalChain }: SignalChainViewerProps) {
  return (
    <div className="w-full md:overflow-x-auto">
      <div className="flex flex-col items-center gap-2 px-4 py-6 md:flex-row md:items-start md:justify-center">
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
