/**
 * Shared node icon set used by the signal chain showcase, the v2 hero's
 * floating tiles, and the v3 hero's orbital composition.
 *
 * Categories follow the gear blocks on a real signal chain:
 * GUITAR, COMPRESSION, OVERDRIVE, CHORUS, PREAMP, DELAY, CABINET, MIC.
 * Each has a distinct silhouette so a stranger scanning the page can
 * tell "this is a pedal category, not decoration."
 */
export type NodeLabel =
  | "GUITAR"
  | "COMPRESSION"
  | "OVERDRIVE"
  | "CHORUS"
  | "PREAMP"
  | "DELAY"
  | "CABINET"
  | "MIC";

export const NODE_COLORS: Record<NodeLabel, { fill: string; border: string }> = {
  GUITAR: { fill: "#d4a853", border: "#d4a853" },
  COMPRESSION: { fill: "#f472b6", border: "#ec4899" },
  OVERDRIVE: { fill: "#4ade80", border: "#16a34a" },
  CHORUS: { fill: "#a78bfa", border: "#7c3aed" },
  PREAMP: { fill: "#f87171", border: "#dc2626" },
  DELAY: { fill: "#60a5fa", border: "#2563eb" },
  CABINET: { fill: "#f87171", border: "#dc2626" },
  MIC: { fill: "#94a3b8", border: "#475569" },
};

export default function NodeIcon({
  label,
  color,
  size = 28,
}: {
  label: NodeLabel;
  color: string;
  size?: number;
}) {
  switch (label) {
    case "GUITAR":
      return (
        <svg viewBox="0 0 74.92 233.01" width={size * 0.45} height={size * 0.7}>
          <path
            fill={color}
            d="M.37,204.6c3.14-18.41,13.73-26.05,10.83-38l-4.7-19.39c-2.57-10.61-.13-23.54,8.66-21.95.68,8.66,2.55,18.19,9.21,18.21,2.21,0,5.97-2.33,6.01-4.84l1.59-94.89-6.28-7.9c-.75-.94,1.64-2.89,3.14-3.45l-1.55-3.24c-.37-.78,2.8-1.59,3.74-1.8l-2.04-3.64c-.53-.94,2.5-1.92,4.27-2.2l-1.73-2.09c-.47-.57-.77-2.54-.05-2.74l3.91-1.08-2.78-2.72c-.54-.53.56-2.38,1.32-2.48l3.66-.48-2.69-2.5c-.45-.42-.62-2.13-.05-2.35l3.02-1.14c1.78-2.43,4.19-4.35,7.26-3.86s5.21,2.68,6.12,5.7c.86,2.84-1.56,6.1-4.43,7.96-1.59,5.21,5.48,12.35,3.93,22.34-5.13.41-8.84,3.51-8.76,8.56l1.59,106.88c2.22,2.67,6.34,3.9,9.79,3.25,5.97-1.13,5.58-9.95,9.75-15.32,9.4,3.94,7.69,16.1,3.13,26.32-6.96,15.61,5.91,22.54,8.45,40.71,1.63,11.63-4.91,21.48-16.65,24.29-13.58,3.25-28.78,2.99-42.16-1.03-11.48-3.46-17.45-13.67-15.5-25.14ZM54.2,201.03c6.64,1.57,12.21,10.87,16.07,8.33,7.45-4.9-12.05-28.59-9.71-36.42l4.57-15.3c1.4-4.69,1.7-9.23-.84-13.65l-2.73,6.47c-1.21,2.86-3.64,6.4-6.16,7.11-10.64,3.03-15.83-8.97-31.38-8.67,2.83,11.53,2.19,20.74-2.2,30.65-2.37,5.34-3.38,12.78.67,17.7s19,.78,31.71,3.78Z"
          />
        </svg>
      );

    case "COMPRESSION":
      // Two arrows converging to the center — classic compressor visual
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
          <path
            d="M5 9 L11 15 L5 21"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M25 9 L19 15 L25 21"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line
            x1="13"
            y1="15"
            x2="17"
            y2="15"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "OVERDRIVE":
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
          <path d="M15 3L20 14H16.5L20 27L10 13H13.5Z" fill={color} />
        </svg>
      );

    case "CHORUS":
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
          <path
            d="M4 15Q8 7 12 15Q16 23 20 15Q24 7 28 15"
            stroke={color}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M4 20Q8 12 12 20Q16 28 20 20Q24 12 28 20"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M4 10Q8 2 12 10Q16 18 20 10Q24 2 28 10"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      );

    case "PREAMP":
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
          <rect
            x="3"
            y="5"
            width="24"
            height="20"
            rx="3.5"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="15"
            cy="15"
            r="7"
            stroke={color}
            strokeWidth="1.4"
            fill="none"
          />
          <circle cx="15" cy="15" r="3.5" fill={color} opacity="0.3" />
          <path
            d="M8.5 15Q12 8 15 15Q18 22 21.5 15"
            stroke={color}
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );

    case "DELAY":
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="11" stroke={color} strokeWidth="1.5" fill="none" />
          <line
            x1="15"
            y1="8"
            x2="15"
            y2="15"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="15"
            y1="15"
            x2="20"
            y2="18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="15" cy="15" r="1.5" fill={color} />
        </svg>
      );

    case "CABINET":
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
          <rect
            x="3"
            y="3"
            width="24"
            height="24"
            rx="3.5"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="15" cy="15" r="9" stroke={color} strokeWidth="1.3" fill="none" />
          <circle cx="15" cy="15" r="5.5" stroke={color} strokeWidth="1.1" fill="none" />
          <circle cx="15" cy="15" r="1.8" fill={color} />
          <line x1="15" y1="6" x2="15" y2="9" stroke={color} strokeWidth="1.2" />
          <line x1="15" y1="21" x2="15" y2="24" stroke={color} strokeWidth="1.2" />
          <line x1="6" y1="15" x2="9" y2="15" stroke={color} strokeWidth="1.2" />
          <line x1="21" y1="15" x2="24" y2="15" stroke={color} strokeWidth="1.2" />
        </svg>
      );

    case "MIC":
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
          <rect
            x="11.5"
            y="3"
            width="7"
            height="14"
            rx="3.5"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M7 14Q7 23 15 23Q23 23 23 14"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <line
            x1="15"
            y1="23"
            x2="15"
            y2="27"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <line
            x1="10"
            y1="27"
            x2="20"
            y2="27"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <line x1="11.5" y1="8" x2="18.5" y2="8" stroke={color} strokeWidth="1.1" />
          <line x1="11.5" y1="11" x2="18.5" y2="11" stroke={color} strokeWidth="1.1" />
          <line x1="11.5" y1="14" x2="18.5" y2="14" stroke={color} strokeWidth="1.1" />
        </svg>
      );

    default:
      return null;
  }
}
