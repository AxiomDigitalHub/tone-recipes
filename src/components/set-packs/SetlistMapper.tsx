"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

/* ── Snapshot names, in preset order ── */
const SNAPSHOTS = ["CLEAN", "DRIVE", "DRIVE+", "LEAD", "CLN AMBI", "AMB DRV", "ROCK", "SWELLS"];

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
  return <span className="fkp-snappill fk-data">{name}</span>;
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
    <div className="fkp-mapper">
      {/* Legend */}
      <div className="fkp-mapper-legend" aria-label="Snapshots">
        {SNAPSHOTS.map((name) => (
          <SnapPill key={name} name={name} />
        ))}
      </div>

      {/* Search */}
      <label className="fkp-mapper-search">
        <span className="sr-only">Search songs or artists</span>
        <Search size={16} strokeWidth={1.75} aria-hidden className="fkp-mapper-search-icon" />
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="fk-input"
        />
      </label>

      {/* Table */}
      <div className="fkp-mapper-table r-lg">
        <table>
          <thead>
            <tr>
              <th scope="col">Song</th>
              {sections.map((sec) => (
                <th key={sec} scope="col" className="is-center">
                  {sectionLabels[sec]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.song}>
                <td className="fkp-mapper-song">
                  <div className="fk-label">{row.song}</div>
                  <div className="fk-caption">{row.artist}</div>
                </td>
                {sections.map((sec) => (
                  <td key={sec} className="is-center" data-label={sectionLabels[sec]}>
                    <SnapPill name={row[sec]} />
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="is-center fk-body-sm fkp-muted">
                  No songs match &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Count */}
      <p className="fk-caption fkp-mapper-count">
        {filtered.length} of {SONGS.length} songs
      </p>
    </div>
  );
}
