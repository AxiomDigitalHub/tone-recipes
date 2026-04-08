"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

/* ── Snapshot color map ── */
const SNAP_COLORS: Record<string, string> = {
  CLEAN: "#4ade80",
  DRIVE: "#eab308",
  "DRIVE+": "#f97316",
  LEAD: "#ef4444",
  "CLN AMBI": "#3b82f6",
  "AMB DRV": "#06b6d4",
  ROCK: "#8b5cf6",
  SWELLS: "#ec4899",
};

const SNAP_BG: Record<string, string> = {
  CLEAN: "rgba(74,222,128,0.12)",
  DRIVE: "rgba(234,179,8,0.12)",
  "DRIVE+": "rgba(249,115,22,0.12)",
  LEAD: "rgba(239,68,68,0.12)",
  "CLN AMBI": "rgba(59,130,246,0.12)",
  "AMB DRV": "rgba(6,182,212,0.12)",
  ROCK: "rgba(139,92,246,0.12)",
  SWELLS: "rgba(236,72,153,0.12)",
};

/* ── Song data ── */
interface SongRow {
  song: string;
  artist: string;
  verse: string;
  preChorus: string;
  chorus: string;
  bridge: string;
  solo: string;
}

const SONGS: SongRow[] = [
  { song: "Holy Forever", artist: "Chris Tomlin", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "CLN AMBI", solo: "LEAD" },
  { song: "Goodness of God", artist: "Bethel Music", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "AMB DRV", solo: "LEAD" },
  { song: "Praise", artist: "Elevation Worship", verse: "DRIVE", preChorus: "DRIVE+", chorus: "ROCK", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Gratitude", artist: "Brandon Lake", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "CLN AMBI", solo: "DRIVE+" },
  { song: "Trust In God", artist: "Elevation Worship", verse: "CLN AMBI", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "Firm Foundation", artist: "Cody Carnes", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "Great Are You Lord", artist: "All Sons & Daughters", verse: "CLN AMBI", preChorus: "AMB DRV", chorus: "DRIVE+", bridge: "CLN AMBI", solo: "LEAD" },
  { song: "Build My Life", artist: "Housefires", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Way Maker", artist: "Leeland", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "What A Beautiful Name", artist: "Hillsong", verse: "CLN AMBI", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "Blessed Be Your Name", artist: "Matt Redman", verse: "DRIVE", preChorus: "DRIVE+", chorus: "ROCK", bridge: "DRIVE+", solo: "LEAD" },
  { song: "How Great Is Our God", artist: "Chris Tomlin", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "DRIVE+", solo: "LEAD" },
  { song: "10,000 Reasons", artist: "Matt Redman", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "CLEAN", solo: "DRIVE" },
  { song: "King of Kings", artist: "Hillsong", verse: "CLN AMBI", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "Reckless Love", artist: "Cory Asbury", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "Living Hope", artist: "Phil Wickham", verse: "CLN AMBI", preChorus: "AMB DRV", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "Great Things", artist: "Phil Wickham", verse: "DRIVE", preChorus: "DRIVE+", chorus: "ROCK", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Who You Say I Am", artist: "Hillsong", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "DRIVE+", solo: "LEAD" },
  { song: "O Come to the Altar", artist: "Elevation Worship", verse: "CLN AMBI", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Battle Belongs", artist: "Phil Wickham", verse: "DRIVE", preChorus: "DRIVE+", chorus: "ROCK", bridge: "ROCK", solo: "LEAD" },
  { song: "This Is Amazing Grace", artist: "Phil Wickham", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Oceans", artist: "Hillsong UNITED", verse: "CLN AMBI", preChorus: "AMB DRV", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "Evidence", artist: "Josh Baldwin", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "CLN AMBI", solo: "DRIVE+" },
  { song: "Thank You Jesus", artist: "Charity Gayle", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Worthy of It All", artist: "David Brymer", verse: "SWELLS", preChorus: "CLN AMBI", chorus: "DRIVE", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Graves Into Gardens", artist: "Elevation Worship", verse: "CLN AMBI", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
  { song: "See A Victory", artist: "Elevation Worship", verse: "DRIVE", preChorus: "DRIVE+", chorus: "ROCK", bridge: "ROCK", solo: "LEAD" },
  { song: "Yes I Will", artist: "Vertical Worship", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "DRIVE+", solo: "LEAD" },
  { song: "Raise A Hallelujah", artist: "Bethel Music", verse: "DRIVE", preChorus: "DRIVE+", chorus: "ROCK", bridge: "ROCK", solo: "LEAD" },
  { song: "Do It Again", artist: "Elevation Worship", verse: "CLEAN", preChorus: "DRIVE", chorus: "DRIVE+", bridge: "ROCK", solo: "LEAD" },
];

/* ── Snapshot pill ── */
function SnapPill({ name }: { name: string }) {
  const color = SNAP_COLORS[name] || "#94a3b8";
  const bg = SNAP_BG[name] || "rgba(148,163,184,0.12)";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 8px",
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        color,
        background: bg,
        border: `1px solid ${color}25`,
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </span>
  );
}

/* ── Main component ── */
export default function SetlistMapper() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return SONGS;
    const q = query.toLowerCase();
    return SONGS.filter(
      (s) => s.song.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    );
  }, [query]);

  const sections: (keyof SongRow)[] = ["verse", "preChorus", "chorus", "bridge", "solo"];
  const sectionLabels: Record<string, string> = {
    verse: "Verse",
    preChorus: "Pre",
    chorus: "Chorus",
    bridge: "Bridge",
    solo: "Solo",
  };

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {Object.entries(SNAP_COLORS).map(([name]) => (
          <SnapPill key={name} name={name} />
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search
          style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            width: 16, height: 16, color: "#4a5e78",
          }}
        />
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px 10px 36px",
            borderRadius: 10, border: "1.5px solid #1e2840",
            background: "#0d1220", color: "#c8d8e8",
            fontSize: 13, outline: "none",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          borderRadius: 14, border: "1.5px solid #1e2840",
          background: "#0b0f1a", overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #1e2840" }}>
                <th style={{
                  textAlign: "left", padding: "12px 16px",
                  fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                  textTransform: "uppercase", color: "#3a4a60",
                  position: "sticky", left: 0, background: "#0b0f1a", zIndex: 2,
                  minWidth: 180,
                }}>
                  Song
                </th>
                {sections.map((sec) => (
                  <th
                    key={sec}
                    style={{
                      textAlign: "center", padding: "12px 8px",
                      fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                      textTransform: "uppercase", color: "#3a4a60",
                    }}
                  >
                    {sectionLabels[sec]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.song}
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid #141c2e" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <td style={{
                    padding: "10px 16px",
                    position: "sticky", left: 0, background: "#0b0f1a", zIndex: 1,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3 }}>
                      {row.song}
                    </div>
                    <div style={{ fontSize: 11, color: "#4a5e78", marginTop: 1 }}>
                      {row.artist}
                    </div>
                  </td>
                  {sections.map((sec) => (
                    <td key={sec} style={{ padding: "10px 8px", textAlign: "center" }}>
                      <SnapPill name={row[sec]} />
                    </td>
                  ))}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#3a4a60", fontSize: 13 }}>
                    No songs match &ldquo;{query}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Count */}
      <div style={{ marginTop: 12, fontSize: 11, color: "#3a4a60", textAlign: "right" }}>
        {filtered.length} of {SONGS.length} songs
      </div>
    </div>
  );
}
