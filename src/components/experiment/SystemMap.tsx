/**
 * SystemMap — "Everyone here is a machine."
 *
 * A portrait, top→down system diagram of every AI component the Fader & Knob
 * experiment has actually built. Rendered as inline SVG (no "use client", no
 * hooks — pure server markup) so it themes via the site's real CSS variables
 * instead of hardcoded hex.
 *
 * HONESTY RULE: every box on this map is a real thing in this repository.
 * Nothing here is invented or aspirational. Verified against:
 *   - src/lib/writers.ts .................. the 10 named AI writers + fk-staff
 *   - .claude/agents/recipe-author.md ..... the Recipe Author agent
 *   - src/app/api/recipes/[slug]/download/route.ts + docs/RECIPE_STANDARD.md
 *                                           six platform translations; only
 *                                           helix/quad_cortex/katana emit a
 *                                           downloadable file; tonex = a
 *                                           ToneNET search by design
 *   - src/lib/downloads/sidecar.ts ........ the Download Pack (notes/install/
 *                                           troubleshooter)
 *   - scripts/audit-recipes.ts ............ the Recipe Audit
 *   - .claude/agents/helix-preset-qc.md ... the Helix-only Preset QC
 *   - src/data/experiment-log.ts .......... the overnight fact-check pass,
 *                                           the $6/Cloudflare host, the
 *                                           public-corrections count
 *   - src/lib/tone-chat/retrieval.ts ...... Axl, reading the recipe corpus
 */
import auditHistory from "@/data/experiment-audit-history.json";

export default function SystemMap() {
  // Palette bound to the real site tokens (see src/app/v3.css). All fills,
  // strokes and text below use these classes — no hex anywhere.
  return (
    <svg
      viewBox="0 0 720 1580"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="sysmap-title sysmap-desc"
      style={{ maxWidth: 720, display: "block", margin: "0 auto" }}
      fontFamily="-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    >
      <title id="sysmap-title">
        Who works at Fader &amp; Knob — every worker is a piece of software
      </title>
      <desc id="sysmap-desc">
        A top-to-bottom map of the operation. Department one, the Writers&apos;
        Room: ten named AI writer personas — Rick Dalton, Jess Kowalski, Sean
        Nakamura, Margot Thiessen, Carl Beckett, Dev Okonkwo, Nathan Cross,
        Viktor Kessler, Hank Presswood and Elena Ruiz, plus a Fader &amp; Knob
        Staff byline — run autonomously every day to produce the articles and
        news. Department two, the Recipe Bench: a Recipe Author agent researches
        each real rig and translates the tone to six platforms. Three of those
        produce a downloadable file — Helix as a .hlx, Boss Katana as a .tsl,
        and Quad Cortex as a build-sheet JSON — and feed a Download Pack of
        preset plus notes, install guide and troubleshooter. Kemper and Fractal
        are given as on-page settings only, and TONEX is a single ToneNET
        capture-search query by design. Department three, the Inspectors: a
        Recipe Audit checks every rule on every recipe, a Helix Preset QC agent
        inspects the generated .hlx file, and an overnight Fact-Checker checks
        the most-read guides against outside sources; together they produce
        corrections that are counted in the open, and their findings feed back
        into writing and building. Off to the side, Axl the tone chatbot reads
        the whole recipe library to answer players&apos; questions. The whole
        thing publishes itself every day on a six-dollar server behind
        Cloudflare.
      </desc>

      <defs>
        <marker
          id="sm-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path className="sm-arrowhead" d="M 0 1 L 9 5 L 0 9 z" />
        </marker>
        <marker
          id="sm-arrow-amber"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path className="sm-arrowhead-amber" d="M 0 1 L 9 5 L 0 9 z" />
        </marker>
      </defs>

      <style>{`
        .sm-page { fill: var(--paper); }
        .sm-panel { fill: var(--paper-2); stroke: var(--paper-line); stroke-width: 1; }
        .sm-box { fill: var(--paper); stroke: var(--ink); stroke-width: 1.25; }
        .sm-box-amber { fill: color-mix(in srgb, var(--amber) 12%, var(--paper)); stroke: var(--amber-2); stroke-width: 1.5; }
        .sm-chip { fill: var(--paper); stroke: var(--paper-line); stroke-width: 1; }
        .sm-hair { stroke: var(--paper-line); stroke-width: 1; fill: none; }
        .sm-flow { stroke: var(--ink); stroke-width: 1.5; fill: none; }
        .sm-flow-amber { stroke: var(--amber-2); stroke-width: 1.5; fill: none; }
        .sm-feedback { stroke: var(--ink-muted); stroke-width: 1.25; fill: none; stroke-dasharray: 4 4; }
        .sm-arrowhead { fill: var(--ink); }
        .sm-arrowhead-amber { fill: var(--amber-2); }
        .sm-node { fill: var(--ink); }
        .sm-kicker { fill: var(--amber-2); font-size: 11px; letter-spacing: 2px; }
        .sm-dept { fill: var(--ink); font-size: 20px; font-weight: 600; }
        .sm-title { fill: var(--ink); font-size: 14px; font-weight: 600; }
        .sm-title-amber { fill: var(--amber-2); font-size: 14px; font-weight: 600; }
        .sm-body { fill: var(--ink-muted); font-size: 12px; }
        .sm-chiptext { fill: var(--ink); font-size: 12px; }
        .sm-tag { fill: var(--ink-muted); font-size: 11px; letter-spacing: 1px; }
        .sm-tag-amber { fill: var(--amber-2); font-size: 11px; letter-spacing: 1px; }
        .sm-flowlabel { fill: var(--ink-muted); font-size: 11px; letter-spacing: 1.5px; }
        .sm-footer { fill: var(--ink); font-size: 13px; font-weight: 600; }
        .sm-footersub { fill: var(--ink-muted); font-size: 12px; }
      `}</style>

      {/* ===================== page ===================== */}
      <rect className="sm-page" x="0" y="0" width="720" height="1580" />

      {/* ============================================================= */}
      {/* DEPT 1 — THE WRITERS' ROOM                                    */}
      {/* ============================================================= */}
      <g>
        {/* department panel */}
        <rect className="sm-panel" x="24" y="24" width="672" height="296" rx="6" />

        <text className="sm-kicker" x="44" y="56">DEPT 01</text>
        <text className="sm-dept" x="44" y="82">The writers&apos; room</text>
        <text className="sm-body" x="44" y="104">
          Ten AI writers. Each one is a persona with its own bio, rig and voice — they write the articles and news.
        </text>

        {/* autonomy badge */}
        <rect className="sm-box-amber" x="44" y="118" width="446" height="30" rx="15" />
        <text className="sm-tag-amber" x="64" y="137">
          RUNS ON ITS OWN, EVERY DAY — NO ONE PRESSES A BUTTON
        </text>

        {/* name-chip grid: 10 writers + staff overflow. 4 columns. */}
        {/* chip: w=152 h=30, x starts 44, gap 12 => col x: 44,208,372,536 */}
        {/* row y: 162, 200, 238 (chip top); text baseline = top+20 */}
        {[
          "Rick Dalton",
          "Jess Kowalski",
          "Sean Nakamura",
          "Margot Thiessen",
          "Carl Beckett",
          "Dev Okonkwo",
          "Nathan Cross",
          "Viktor Kessler",
          "Hank Presswood",
          "Elena Ruiz",
        ].map((name, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 44 + col * 164;
          const y = 162 + row * 38;
          return (
            <g key={name}>
              <rect className="sm-chip" x={x} y={y} width="152" height="30" rx="4" />
              <text className="sm-chiptext" x={x + 12} y={y + 20}>
                {name}
              </text>
            </g>
          );
        })}
        {/* faded "+ Staff" overflow byline in the 11th slot (row 2, col 2) */}
        <rect
          className="sm-chip"
          x={44 + 2 * 164}
          y={162 + 2 * 38}
          width="152"
          height="30"
          rx="4"
          strokeDasharray="4 3"
          opacity="0.6"
        />
        <text
          className="sm-tag"
          x={44 + 2 * 164 + 12}
          y={162 + 2 * 38 + 20}
          opacity="0.75"
        >
          + Fader &amp; Knob Staff
        </text>
      </g>

      {/* flow: writers -> Articles & News */}
      <line className="sm-flow" x1="360" y1="320" x2="360" y2="352" markerEnd="url(#sm-arrow)" />

      {/* output: Articles & News */}
      <rect className="sm-box" x="256" y="356" width="208" height="46" rx="6" />
      <text className="sm-title" x="360" y="378" textAnchor="middle">Articles &amp; News</text>
      <text className="sm-body" x="360" y="394" textAnchor="middle">the AI masthead, published</text>

      {/* section divider down to Dept 2 */}
      <line className="sm-flow" x1="360" y1="402" x2="360" y2="436" markerEnd="url(#sm-arrow)" />

      {/* ============================================================= */}
      {/* DEPT 2 — THE RECIPE BENCH                                     */}
      {/* ============================================================= */}
      <g>
        <rect className="sm-panel" x="24" y="440" width="672" height="474" rx="6" />

        <text className="sm-kicker" x="44" y="472">DEPT 02</text>
        <text className="sm-dept" x="44" y="498">The recipe bench</text>
        <text className="sm-body" x="44" y="520">
          Tones and presets. One agent researches the real rig, cites its sources, and writes the settings.
        </text>

        {/* Recipe Author box */}
        <rect className="sm-box" x="200" y="536" width="320" height="52" rx="6" />
        <text className="sm-title" x="360" y="559" textAnchor="middle">The Recipe Author</text>
        <text className="sm-body" x="360" y="577" textAnchor="middle">
          a real agent — researches, cites, writes the tone
        </text>

        {/* fan-out to platforms */}
        <line className="sm-flow" x1="360" y1="588" x2="360" y2="606" />
        <text className="sm-flowlabel" x="376" y="602">TRANSLATED TO SIX PLATFORMS</text>

        {/* six platform tiles: 3 amber (downloadable) top row, 3 muted bottom row */}
        {/* tile w=200 h=64, 3 cols x: 44, 260, 476 (gap 16) */}
        {/* row1 y=616, row2 y=692 */}

        {/* --- Row 1: DOWNLOADABLE FILES (amber) --- */}
        {[
          { name: "Line 6 Helix", tag: ".hlx file" },
          { name: "Boss Katana", tag: ".tsl file" },
          { name: "Quad Cortex", tag: "build sheet (.json)" },
        ].map((p, i) => {
          const x = 44 + i * 216;
          const y = 616;
          return (
            <g key={p.name}>
              <rect className="sm-box-amber" x={x} y={y} width="200" height="64" rx="6" />
              <text className="sm-title-amber" x={x + 100} y={y + 28} textAnchor="middle">
                {p.name}
              </text>
              <text className="sm-tag-amber" x={x + 100} y={y + 48} textAnchor="middle">
                {p.tag.toUpperCase()}
              </text>
            </g>
          );
        })}
        <text className="sm-tag-amber" x="44" y="608">DOWNLOADABLE — A FILE YOU LOAD</text>

        {/* --- Row 2: on-page settings only / search (muted) --- */}
        {[
          { name: "Kemper", tag: "on-page settings" },
          { name: "Fractal", tag: "on-page settings" },
          { name: "TONEX", tag: "one ToneNET search" },
        ].map((p, i) => {
          const x = 44 + i * 216;
          const y = 700;
          return (
            <g key={p.name}>
              <rect className="sm-box" x={x} y={y} width="200" height="64" rx="6" opacity="0.72" />
              <text className="sm-title" x={x + 100} y={y + 28} textAnchor="middle" opacity="0.8">
                {p.name}
              </text>
              <text className="sm-tag" x={x + 100} y={y + 48} textAnchor="middle">
                {p.tag.toUpperCase()}
              </text>
            </g>
          );
        })}
        <text className="sm-tag" x="44" y="692">READ ON THE PAGE — NO FILE, BY DESIGN</text>

        {/* the three file-makers feed the Download Pack. To avoid stabbing
            through the muted on-page row below, the amber tiles drop to a short
            collector bus just under their row, then the merged line runs down
            the clean column gaps (x=252 / x=468) — never over a muted box —
            into the pack. */}
        <line className="sm-flow-amber" x1="144" y1="680" x2="144" y2="688" />
        <line className="sm-flow-amber" x1="360" y1="680" x2="360" y2="688" />
        <line className="sm-flow-amber" x1="576" y1="680" x2="576" y2="688" />
        {/* collector bus + the two side drops down the tile-column gaps */}
        <line className="sm-flow-amber" x1="144" y1="688" x2="576" y2="688" />
        <line className="sm-flow-amber" x1="252" y1="688" x2="252" y2="820" />
        <line className="sm-flow-amber" x1="468" y1="688" x2="468" y2="820" />
        <line className="sm-flow-amber" x1="252" y1="820" x2="468" y2="820" />
        <line className="sm-flow-amber" x1="360" y1="820" x2="360" y2="838" markerEnd="url(#sm-arrow-amber)" />

        {/* Download Pack box */}
        <rect className="sm-box-amber" x="180" y="842" width="360" height="60" rx="6" />
        <text className="sm-title-amber" x="360" y="866" textAnchor="middle">The Download Pack</text>
        <text className="sm-body" x="360" y="886" textAnchor="middle">
          preset + why-each-block notes + install guide + troubleshooter
        </text>
      </g>

      {/* divider down to Dept 3 */}
      <line className="sm-flow" x1="360" y1="914" x2="360" y2="948" markerEnd="url(#sm-arrow)" />

      {/* ============================================================= */}
      {/* DEPT 3 — THE INSPECTORS                                       */}
      {/* ============================================================= */}
      <g>
        <rect className="sm-panel" x="24" y="952" width="672" height="356" rx="6" />

        <text className="sm-kicker" x="44" y="984">DEPT 03</text>
        <text className="sm-dept" x="44" y="1010">The inspectors</text>
        <text className="sm-body" x="44" y="1032">
          Quality control — the robot grades the robot. Nothing reaches you ungraded.
        </text>

        {/* three inspector boxes side by side */}
        {/* tile w=200 h=92, x: 44, 260, 476 */}
        {[
          {
            name: "Recipe Audit",
            l1: "every rule, every recipe",
            // Read from the latest committed audit report — this used to be a
            // typed-in "185 / 185" that went stale as the corpus grew.
            l2: `${auditHistory.latest.clean} / ${auditHistory.latest.recipes} clean`,
          },
          {
            name: "Preset QC",
            l1: "an agent inspects the",
            l2: "generated .hlx (Helix only)",
          },
          {
            name: "Fact-Checker",
            l1: "overnight pass against",
            l2: "outside sources",
          },
        ].map((p, i) => {
          const x = 44 + i * 216;
          const y = 1048;
          return (
            <g key={p.name}>
              <rect className="sm-box" x={x} y={y} width="200" height="92" rx="6" />
              <text className="sm-title" x={x + 100} y={y + 30} textAnchor="middle">
                {p.name}
              </text>
              <text className="sm-body" x={x + 100} y={y + 54} textAnchor="middle">
                {p.l1}
              </text>
              <text className="sm-body" x={x + 100} y={y + 72} textAnchor="middle">
                {p.l2}
              </text>
            </g>
          );
        })}

        {/* three feed into Corrections */}
        <line className="sm-flow" x1="144" y1="1140" x2="144" y2="1176" />
        <line className="sm-flow" x1="360" y1="1140" x2="360" y2="1176" />
        <line className="sm-flow" x1="576" y1="1140" x2="576" y2="1176" />
        <line className="sm-flow" x1="144" y1="1176" x2="576" y2="1176" />
        <line className="sm-flow" x1="360" y1="1176" x2="360" y2="1194" markerEnd="url(#sm-arrow)" />

        {/* Corrections box */}
        <rect className="sm-box" x="200" y="1198" width="320" height="56" rx="6" />
        <text className="sm-title" x="360" y="1222" textAnchor="middle">Corrections</text>
        <text className="sm-body" x="360" y="1240" textAnchor="middle">
          counted in the open, on this page
        </text>
      </g>

      {/* dashed feedback arrow: inspectors -> back up to WRITE / BUILD.
          Runs up the far-left gutter, from the inspector panel to Dept 1. */}
      <path
        className="sm-feedback"
        d="M 40 1080 L 16 1080 L 16 240 L 40 240"
        markerEnd="url(#sm-arrow)"
      />
      <text className="sm-tag" x="24" y="670" transform="rotate(-90 24 670)" textAnchor="middle">
        EVERYTHING IS GRADED BEFORE YOU SEE IT
      </text>

      {/* ============================================================= */}
      {/* SIDECAR — AXL                                                 */}
      {/* ============================================================= */}
      <g>
        {/* Axl panel on the right, beside the stack, fed by the corpus */}
        <rect className="sm-panel" x="560" y="356" width="136" height="46" rx="6" strokeDasharray="0" />
        {/* corpus -> Axl arrow (Articles + recipes = the library Axl reads) */}
        <line className="sm-flow" x1="464" y1="379" x2="558" y2="379" markerEnd="url(#sm-arrow)" />
        <text className="sm-title" x="628" y="376" textAnchor="middle">Axl</text>
        <text className="sm-body" x="628" y="393" textAnchor="middle">the tone chatbot</text>
        <text className="sm-tag" x="628" y="420" textAnchor="middle">READS THE WHOLE LIBRARY,</text>
        <text className="sm-tag" x="628" y="434" textAnchor="middle">ANSWERS YOUR QUESTIONS</text>
      </g>

      {/* ============================================================= */}
      {/* BASE STRIP — THE HOUSE                                        */}
      {/* ============================================================= */}
      <line className="sm-flow" x1="360" y1="1308" x2="360" y2="1344" markerEnd="url(#sm-arrow)" />
      <rect className="sm-box-amber" x="24" y="1348" width="672" height="72" rx="6" />
      <text className="sm-footer" x="360" y="1382" textAnchor="middle">
        And the house publishes itself.
      </text>
      <text className="sm-footersub" x="360" y="1404" textAnchor="middle">
        Every day, on a $6 server of its own, behind Cloudflare — the page you&apos;re reading is served from that box.
      </text>
    </svg>
  );
}
