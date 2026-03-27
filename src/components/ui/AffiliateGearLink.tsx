"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { getAffiliateLinks } from "@/lib/affiliate";

interface AffiliateGearLinkProps {
  name: string;
  manufacturer?: string;
  className?: string;
}

export default function AffiliateGearLink({
  name,
  manufacturer,
  className = "",
}: AffiliateGearLinkProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const links = getAffiliateLinks(name, manufacturer);

  const partners: { label: string; url: string | undefined }[] = [
    { label: "Sweetwater", url: links.sweetwater },
    { label: "Reverb", url: links.reverb },
    { label: "Amazon", url: links.amazon },
  ];

  return (
    <span className={`relative inline-flex items-center gap-1.5 ${className}`} ref={ref}>
      <span>{name}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
        aria-label={`Buy ${name}`}
      >
        Buy
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-border bg-surface p-1 shadow-lg">
          {partners.map(
            (p) =>
              p.url && (
                <a
                  key={p.label}
                  href={p.url}
                  target="_blank"
                  rel="nofollow sponsored"
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-background"
                  onClick={() => setOpen(false)}
                >
                  {p.label}
                  <ExternalLink className="ml-auto h-3 w-3 text-muted" />
                </a>
              )
          )}
        </div>
      )}
    </span>
  );
}
