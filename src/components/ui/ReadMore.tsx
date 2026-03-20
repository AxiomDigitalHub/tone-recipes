"use client";

import { useState } from "react";

interface ReadMoreProps {
  text: string;
  lines?: number;
}

export default function ReadMore({ text, lines = 3 }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`leading-relaxed text-foreground/90 ${
          expanded ? "" : "md:line-clamp-none"
        }`}
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {text}
      </p>
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 text-sm font-medium text-accent hover:underline md:hidden"
        >
          Read more
        </button>
      )}
    </div>
  );
}
