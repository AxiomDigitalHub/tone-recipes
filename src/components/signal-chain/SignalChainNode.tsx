"use client";

import type { SignalChainNode as NodeType } from "@/types/recipe";
import { getChainIcon, getChainIconLabel } from "@/lib/chain-icons";

interface SignalChainNodeProps {
  node: NodeType;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function SignalChainNode({
  node,
  isSelected,
  onSelect,
}: SignalChainNodeProps) {
  const Icon = getChainIcon(node.category, node.subcategory);
  const label = getChainIconLabel(node.category, node.subcategory);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onSelect}
        aria-label={`${node.gear_name} – ${node.category}${node.subcategory ? ` / ${node.subcategory}` : ""} settings`}
        aria-pressed={!!isSelected}
        className={`node-glow group flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 bg-surface transition-all hover:bg-surface-hover hover:scale-105 ${
          isSelected ? "ring-2 ring-offset-2 ring-offset-background scale-105" : ""
        }`}
        style={{
          borderColor: isSelected ? node.icon_color : node.icon_color + "80",
          ...(isSelected ? { ringColor: node.icon_color } : {}),
        }}
      >
        <Icon
          className="h-6 w-6"
          style={{ color: node.icon_color }}
          strokeWidth={1.5}
        />
        <span className="mt-1 text-[10px] font-medium uppercase text-muted">
          {label}
        </span>
      </button>

      <p className="mt-2 max-w-[110px] text-center text-[11px] font-medium leading-tight text-foreground line-clamp-2">
        {node.gear_name}
      </p>
    </div>
  );
}
