/**
 * AuditHistoryChart — "the robot grades the robot", plotted.
 *
 * Replaces a hardcoded "185 / 185 clean" that had gone stale on the system
 * map. Every point is read back out of git by
 * scripts/generate-audit-history.mts (each committed revision of
 * docs/RECIPE_AUDIT_REPORT.md), so this cannot drift from the record.
 *
 * Form: stacked area, one axis, two classes — recipes that pass every audit
 * rule (amber) and the ones that don't yet (gray). The gap between them IS
 * the story: new recipes land dirty and get cleaned, over and over.
 *
 * Colors: --amber #E4A235 against --ink-faint #8F897E. Validated for
 * colorblind separation (worst adjacent ΔE 15.3 protan / 17.7 normal vision).
 * The gray deliberately sits below the chroma floor — it is the de-emphasis
 * context color, not a peer series. Neither fill clears 3:1 against the
 * paper surface, so identity never rests on color alone: both regions are
 * directly labeled, the legend is always present, and the full table ships
 * underneath.
 *
 * Pure server markup — no "use client", no hooks, no chart library. Hover
 * readouts use native SVG <title>, so they work with JavaScript disabled.
 */
import auditHistory from "@/data/experiment-audit-history.json";

type Point = { date: string; recipes: number; clean: number };

const W = 720;
// bottom leaves room for the month ticks AND the legend beneath them — at 40
// the legend sat 10px off the tick row and read as one crowded strip.
const H = 320;
const PAD = { top: 28, right: 16, bottom: 60, left: 44 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const fmtDay = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const fmtMonth = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

export default function AuditHistoryChart() {
  const series = auditHistory.series as Point[];
  const first = series[0];
  const last = series[series.length - 1];

  // ---- scales ------------------------------------------------------------
  // x is real elapsed time, not point index — the audit didn't run on an even
  // cadence, and evenly spacing the points would lie about when things moved.
  const t = (iso: string) => new Date(iso + "T00:00:00Z").getTime();
  const t0 = t(first.date);
  const t1 = t(last.date);
  const x = (iso: string) => PAD.left + ((t(iso) - t0) / (t1 - t0)) * PLOT_W;

  const yMax = Math.ceil(Math.max(...series.map((p) => p.recipes)) / 50) * 50;
  const y = (v: number) => PAD.top + PLOT_H - (v / yMax) * PLOT_H;

  const line = (get: (p: Point) => number) =>
    series.map((p, i) => `${i ? "L" : "M"} ${x(p.date)} ${y(get(p))}`).join(" ");

  const baseline = `L ${x(last.date)} ${y(0)} L ${x(first.date)} ${y(0)} Z`;
  const cleanArea = `${line((p) => p.clean)} ${baseline}`;
  // The "not clean yet" band: the total boundary out, the clean boundary back.
  const gapArea =
    line((p) => p.recipes) +
    " " +
    series
      .slice()
      .reverse()
      .map((p) => `L ${x(p.date)} ${y(p.clean)}`)
      .join(" ") +
    " Z";

  const gridVals = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);

  // First of each month, for the x axis — one tick per month beats 38 dates.
  const monthTicks = series.filter(
    (p, i) => i === 0 || p.date.slice(0, 7) !== series[i - 1].date.slice(0, 7),
  );

  // The moment the gap first closed — the point of the whole chart.
  const parity = series.find((p) => p.clean === p.recipes && p.recipes > 100);

  return (
    <figure style={{ margin: "28px 0 0" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="audit-chart-title audit-chart-desc"
        style={{ maxWidth: W, display: "block", margin: "0 auto" }}
        fontFamily="-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif"
      >
        {/* Single template string: React requires <title> children to be one
            text node, and an array here warns at render time. */}
        <title id="audit-chart-title">
          {`Recipes passing every audit rule, ${fmtDay(first.date)} to ${fmtDay(last.date)}`}
        </title>
        <desc id="audit-chart-desc">
          A stacked area chart of the recipe audit over time. The library grew
          from {first.recipes} recipes to {last.recipes}. Recipes passing every
          rule went from {first.clean} to {last.clean}
          {parity
            ? `, first reaching a fully clean library on ${fmtDay(parity.date)}`
            : ""}
          . The gray band above the amber is recipes that had not yet passed;
          it reappears each time a batch of new recipes lands and closes again
          as they are fixed.
        </desc>

        <style>{`
          .ah-grid { stroke: var(--paper-line); stroke-width: 1; fill: none; }
          .ah-axis { fill: var(--ink-faint); font-size: 11px; }
          .ah-clean-fill { fill: var(--amber); fill-opacity: 0.38; }
          .ah-clean-line { stroke: var(--amber); stroke-width: 2; fill: none;
                           stroke-linejoin: round; stroke-linecap: round; }
          .ah-gap-fill { fill: var(--ink-faint); fill-opacity: 0.28; }
          .ah-total-line { stroke: var(--ink-faint); stroke-width: 1.25; fill: none;
                           stroke-linejoin: round; }
          /* Halo: labels sit over the fills and the total line, so paint a
             surface-colored stroke behind the glyphs instead of hunting for
             empty space that moves every time the data does. */
          .ah-label, .ah-sublabel {
            paint-order: stroke;
            stroke: var(--paper-2);
            stroke-width: 3px;
            stroke-linejoin: round;
          }
          .ah-label { fill: var(--ink); font-size: 12px; font-weight: 600; }
          .ah-sublabel { fill: var(--ink-muted); font-size: 11px; }
          .ah-legend { fill: var(--ink); font-size: 12px; }
          .ah-dot { fill: var(--amber); stroke: var(--paper-2); stroke-width: 2; }
        `}</style>

        {/* horizontal grid + y labels */}
        {gridVals.map((v) => (
          <g key={v}>
            <line
              className="ah-grid"
              x1={PAD.left}
              y1={y(v)}
              x2={W - PAD.right}
              y2={y(v)}
            />
            <text className="ah-axis" x={PAD.left - 8} y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}

        {/* the two regions: clean, then the not-yet-clean band on top */}
        <path className="ah-clean-fill" d={cleanArea} />
        <path className="ah-gap-fill" d={gapArea} />
        <path className="ah-total-line" d={line((p) => p.recipes)} />
        <path className="ah-clean-line" d={line((p) => p.clean)} />

        {/* invisible hover targets — native tooltips, no JavaScript */}
        {series.map((p) => (
          <rect
            key={p.date}
            x={x(p.date) - 5}
            y={PAD.top}
            width={10}
            height={PLOT_H}
            fill="transparent"
          >
            <title>{`${fmtDay(p.date)} — ${p.clean} of ${p.recipes} clean`}</title>
          </rect>
        ))}

        {/* x axis: one tick per month */}
        {monthTicks.map((p) => (
          <text
            key={p.date}
            className="ah-axis"
            x={x(p.date)}
            y={H - PAD.bottom + 18}
            textAnchor="middle"
          >
            {fmtMonth(p.date)}
          </text>
        ))}

        {/* direct labels — the two ends and the moment the gap closed */}
        <circle className="ah-dot" cx={x(first.date)} cy={y(first.clean)} r={3.5} />
        {/* Above the point, not below: below put it on top of the "May" tick. */}
        <text
          className="ah-sublabel"
          x={x(first.date) + 8}
          y={y(first.clean) - 10}
        >
          {first.clean} of {first.recipes} clean
        </text>

        {parity && (
          <>
            <circle
              className="ah-dot"
              cx={x(parity.date)}
              cy={y(parity.clean)}
              r={3.5}
            />
            <text
              className="ah-sublabel"
              x={x(parity.date)}
              y={y(parity.clean) - 12}
              textAnchor="middle"
            >
              first fully clean · {fmtDay(parity.date)}
            </text>
          </>
        )}

        <circle className="ah-dot" cx={x(last.date)} cy={y(last.clean)} r={3.5} />
        <text
          className="ah-label"
          x={x(last.date)}
          y={y(last.clean) - 12}
          textAnchor="end"
        >
          {last.clean} of {last.recipes}
        </text>

        {/* legend — always present; identity never rests on color alone */}
        <g transform={`translate(${PAD.left}, ${H - 8})`}>
          <rect className="ah-clean-fill" x="0" y="-9" width="12" height="12" />
          <rect
            x="0"
            y="-9"
            width="12"
            height="12"
            fill="none"
            stroke="var(--amber)"
            strokeWidth="2"
          />
          <text className="ah-legend" x="18" y="1">
            passes every rule
          </text>
          <rect className="ah-gap-fill" x="150" y="-9" width="12" height="12" />
          <rect
            x="150"
            y="-9"
            width="12"
            height="12"
            fill="none"
            stroke="var(--ink-faint)"
            strokeWidth="1.25"
          />
          <text className="ah-legend" x="168" y="1">
            not yet
          </text>
        </g>
      </svg>

      <figcaption
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.06em",
          color: "var(--ink-faint)",
          marginTop: 10,
        }}
      >
        Every point read back out of the git history of{" "}
        {auditHistory.source} — {series.length} audit runs since{" "}
        {fmtDay(first.date)}. The gray reappears whenever a batch of new
        recipes lands; that is the inspector doing its job, not a failure.
      </figcaption>

      <details style={{ marginTop: 12 }}>
        <summary
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--amber-2)",
            cursor: "pointer",
          }}
        >
          See the numbers
        </summary>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table
            style={{
              borderCollapse: "collapse",
              fontSize: 13,
              minWidth: 320,
            }}
          >
            <caption
              style={{
                textAlign: "left",
                fontSize: 12,
                color: "var(--ink-muted)",
                paddingBottom: 8,
              }}
            >
              Recipe audit runs, {fmtDay(first.date)} – {fmtDay(last.date)}
            </caption>
            <thead>
              <tr>
                {["Date", "Audited", "Clean", "Not yet"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    style={{
                      textAlign: h === "Date" ? "left" : "right",
                      padding: "6px 14px 6px 0",
                      borderBottom: "1px solid var(--paper-line)",
                      color: "var(--ink-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series.map((p) => (
                <tr key={p.date}>
                  <td style={{ padding: "5px 14px 5px 0" }}>{fmtDay(p.date)}</td>
                  <td style={{ padding: "5px 14px 5px 0", textAlign: "right" }}>
                    {p.recipes}
                  </td>
                  <td style={{ padding: "5px 14px 5px 0", textAlign: "right" }}>
                    {p.clean}
                  </td>
                  <td
                    style={{
                      padding: "5px 14px 5px 0",
                      textAlign: "right",
                      color:
                        p.recipes - p.clean > 0
                          ? "var(--ink)"
                          : "var(--ink-faint)",
                    }}
                  >
                    {p.recipes - p.clean}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
