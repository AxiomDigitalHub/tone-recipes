/**
 * Dev-only: render AuditHistoryChart to a standalone HTML file so the chart
 * can be eyeballed (label collisions, geometry, overflow) without booting the
 * whole app. Not imported by anything that ships.
 *
 * Run: npx tsx scripts/preview-audit-chart.mts && open /tmp/audit-chart.html
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import AuditHistoryChart from "../src/components/experiment/AuditHistoryChart";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.argv[2] ?? "/tmp/audit-chart.html";

// Pull the real token block out of v3.css so the preview isn't lying about
// color. The tokens are scoped under `.fk-preview` (NOT :root) — /experiment
// renders inside that scope, so the preview wrapper has to carry the class
// too or every var() falls back to nothing and the chart renders gray.
const css = readFileSync(resolve(ROOT, "src/app/v3.css"), "utf8");
const start = css.indexOf(".fk-preview {");
const tokens = css.slice(start, css.indexOf("}", start) + 1);
if (!tokens.includes("--amber")) throw new Error("token block not found in v3.css");

// tsx's CJS interop can hand back the module namespace rather than the fn.
const Chart = ((AuditHistoryChart as unknown as { default?: unknown }).default ??
  AuditHistoryChart) as Parameters<typeof createElement>[0];

const body = renderToStaticMarkup(createElement(Chart));

writeFileSync(
  OUT,
  `<!doctype html><meta charset="utf-8"><title>AuditHistoryChart preview</title>
<style>
${tokens}
body { background: var(--paper); color: var(--ink); margin: 0; padding: 40px 24px;
       font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; }
.wrap { max-width: 760px; margin: 0 auto; background: var(--paper-2); padding: 24px; }
/* .fk-preview on <body> so the scoped tokens above actually apply. */
h1 { font-size: 20px; margin: 0 0 4px; }
p.note { font-size: 13px; color: var(--ink-muted); margin: 0 0 20px; }
</style>
<body class="fk-preview">
<div class="wrap">
<h1>The inspector's record</h1>
<p class="note">Standalone render — checking geometry and label collisions.</p>
${body}
</div>
`,
);
console.log(`✓ ${OUT}`);
