/**
 * HTML templates for social cards. v3 tokens copied from src/app/v3.css
 * (.fk-preview scope): paper/ink/amber/panel/tape. Fonts: Fraunces (display),
 * Geist (body), Geist Mono (values), Oswald (condensed labels).
 *
 * Rule (Mara #4): templates contain NO numbers in visible copy. Every visible
 * string arrives through a SlideSpec TextItem, which the gate checks.
 */
import type { ChainNode, KnobCell, SlideGroup, SlideSpec, TextItem } from "../types";

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Geist:wght@400;600&family=Geist+Mono:wght@500&family=Oswald:wght@500;600&display=block";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tx = (i?: TextItem) => (i ? esc(i.text) : "");

const CSS = `
:root{--paper:#EDEAE4;--paper-2:#E2DED6;--paper-line:rgba(10,9,8,.12);--ink:#0A0908;--ink-2:#1C1A17;--ink-muted:#5F5A52;--ink-faint:#8F897E;
--panel:#0A0908;--panel-2:#141210;--panel-3:#1F1C18;--panel-line:rgba(237,234,228,.10);--tape:#D8342B;--amber:#E4A235;--amber-2:#B37A1D;--spec-green:#5F7A4C}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--paper)}
.slide{width:var(--w);height:var(--h);background:var(--paper);color:var(--ink);position:relative;overflow:hidden;font-family:'Geist',system-ui,sans-serif;display:flex;flex-direction:column}
.pad{padding:76px 76px 0}
.kicker{font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.14em;font-size:28px;display:inline-block;background:var(--tape);color:var(--paper);padding:8px 16px 6px;align-self:flex-start}
.headline{font-family:'Fraunces',serif;font-weight:620;font-size:96px;line-height:1.0;letter-spacing:-.02em;margin-top:48px;font-variation-settings:'opsz' 144}
.facts{display:flex;flex-wrap:wrap;gap:16px;margin-top:56px}
.fact{font-family:'Geist Mono',monospace;font-size:42px;background:var(--panel);color:var(--amber);padding:14px 22px}
.sub{font-family:'Fraunces',serif;font-style:italic;font-size:40px;color:var(--ink-muted);margin-top:40px}
.cover-cue{margin-top:auto;margin-bottom:150px;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.12em;font-size:30px;color:var(--amber-2)}
.bar{background:var(--panel);color:var(--paper);padding:64px 76px 44px}
.bar .kicker{margin-bottom:24px}
.bar h2{font-family:'Fraunces',serif;font-weight:600;font-size:68px;line-height:1.02;letter-spacing:-.01em}
.body{padding:44px 76px 0;flex:1;display:flex;flex-direction:column;gap:34px;min-height:0;overflow:hidden}
.group h3{font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:34px;display:flex;align-items:baseline;gap:18px}
.group h3 small{font-family:'Geist',sans-serif;font-weight:400;text-transform:none;letter-spacing:0;font-size:24px;color:var(--ink-muted)}
.group.off h3{color:var(--ink-muted)}
.group.off h3 small{color:var(--tape)}
.knobs{display:grid;grid-template-columns:repeat(4,1fr);gap:22px 18px;margin-top:20px}
.cell{display:flex;flex-direction:column;align-items:center;gap:8px}
.cell .lab{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:22px;color:var(--ink-muted)}
.cell .val{font-family:'Geist Mono',monospace;font-size:36px}
.tile{min-width:118px;height:118px;padding:0 14px;border:3px solid var(--ink);display:flex;align-items:center;justify-content:center;white-space:nowrap}
.tile .val{font-size:34px}
.chips{display:flex;flex-wrap:wrap;gap:10px 12px;margin-top:14px}
.chip{border:2px solid var(--ink);padding:6px 12px;font-size:26px;display:flex;gap:10px;align-items:baseline}
.chip b{font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.06em;font-size:20px;color:var(--ink-muted)}
.chip span{font-family:'Geist Mono',monospace}
.group.off .chip{border-style:dashed;color:var(--ink-muted)}
.note{font-family:'Fraunces',serif;font-style:italic;font-size:36px;line-height:1.2;color:var(--ink-2);border-left:6px solid var(--amber);padding-left:22px}
table{width:100%;border-collapse:collapse}
th{font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.08em;font-size:24px;color:var(--ink-muted);text-align:left;padding:0 12px 14px 0;border-bottom:3px solid var(--ink)}
td{font-size:34px;padding:22px 20px 22px 0;border-bottom:1px solid var(--paper-line);vertical-align:top;line-height:1.15;font-variant-numeric:tabular-nums}
td:not(:first-child){font-weight:400}
td:first-child{font-weight:600}
.tnote{font-size:24px;color:var(--ink-muted)}
.rule{font-family:'Fraunces',serif;font-weight:500;font-size:56px;line-height:1.12;letter-spacing:-.01em;margin-top:56px}
.close-cta{font-family:'Fraunces',serif;font-weight:620;font-size:84px;line-height:1.02;letter-spacing:-.02em;margin-top:48px}
.close-lines{margin-top:48px;display:flex;flex-direction:column;gap:22px;font-size:32px;line-height:1.3}
.close-lines .disc{font-size:24px;color:var(--ink-muted);border-top:1px solid var(--paper-line);padding-top:22px}
.footer{position:absolute;left:76px;right:76px;bottom:46px;display:flex;justify-content:space-between;align-items:center;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.16em;font-size:24px}
.footer .idx{background:var(--ink);color:var(--paper);padding:6px 12px 4px;letter-spacing:.08em}
.pin .headline{font-size:76px;margin-top:36px}
.pin .facts{margin-top:32px}
.pin .sub{margin-top:24px;font-size:34px}
.pin td{font-size:30px;padding:14px 16px 14px 0}
.pin .body{padding-top:36px}
/* ── new_tone: recipe-page look (src/app/v3.css .chain-* / hero) ── */
.eyebrow{display:flex;gap:18px;align-items:center;margin-top:44px;font-family:'Geist Mono',monospace;font-size:24px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-muted)}
.eyebrow span+span::before{content:"·";margin-right:18px}
.song-title{font-family:'Fraunces',serif;font-weight:500;font-size:132px;line-height:.96;letter-spacing:-.025em;margin-top:22px;font-variation-settings:'opsz' 144}
.credit{font-family:'Fraunces',serif;font-style:italic;font-size:40px;line-height:1.3;color:var(--ink-2);margin-top:26px}
.credit p:first-child{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:6px;text-decoration-color:var(--ink-faint)}
.hook{font-family:'Fraunces',serif;font-weight:500;font-size:50px;line-height:1.1;letter-spacing:-.01em;margin-top:44px;padding-top:30px;border-top:3px solid var(--ink)}
.strip{margin-top:auto;margin-bottom:130px;display:flex;flex-wrap:wrap;align-items:center;row-gap:14px}
.strip .tile-s{width:84px;height:84px;border:1.5px solid var(--ink);background:var(--paper);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:var(--ink)}
.strip .tile-s svg{width:34px;height:34px}
.strip .tile-s b{font-family:'Oswald',sans-serif;font-weight:600;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted)}
.strip .tile-s.off{border-style:dashed;background:var(--paper-2);color:var(--ink-muted)}
.strip .dash{width:20px;border-top:2px dashed var(--ink);opacity:.35}
.cmeta{display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:20px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-muted);border-top:4px solid var(--ink);padding-top:18px;margin-top:34px}
.cmeta span+span{margin-left:auto}
.cmeta span:nth-child(2){margin-left:18px}
.cmeta span:nth-child(2)::before{content:"·";margin-right:18px}
.gcard{display:flex;gap:26px;align-items:flex-start;padding:26px 28px;border:1.5px solid var(--ink);box-shadow:0 4px 0 0 var(--ink);background:var(--paper);margin-top:30px}
.gcard .gi{width:96px;height:96px;flex-shrink:0;border:1px solid var(--paper-line);background:var(--paper-2);display:flex;align-items:center;justify-content:center;overflow:hidden}
.gcard .gi img{height:88px;transform:rotate(35deg)}
.gcard .k{font-family:'Geist Mono',monospace;font-size:16px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:6px}
.gcard .gn{font-family:'Fraunces',serif;font-size:38px;line-height:1.08;letter-spacing:-.01em;margin-bottom:16px}
.gcard .specs{display:flex;gap:34px}
.gcard .specs .v{font-family:'Oswald',sans-serif;font-weight:500;font-size:24px}
.nodes{display:grid;grid-template-columns:repeat(4,1fr);row-gap:30px;margin-top:40px}
.node{display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;padding:0 6px}
.node .tile-l{width:132px;height:132px;border:1.5px solid var(--ink);background:var(--paper);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--ink);position:relative;z-index:1}
.node .tile-l svg{width:50px;height:50px}
.node .tile-l b{font-family:'Oswald',sans-serif;font-weight:600;font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted)}
.node.off .tile-l{border-style:dashed;background:var(--paper-2);color:var(--ink-muted)}
.node:not(:nth-child(4n))::after{content:"";position:absolute;top:66px;left:calc(50% + 66px);width:calc(100% - 132px);border-top:2px dashed var(--ink);opacity:.35}
.node:last-child::after{display:none}
.node .nm{font-family:'Geist',sans-serif;font-weight:600;font-size:23px;line-height:1.15;margin-top:14px}
.node .og{font-family:'Fraunces',serif;font-style:italic;font-size:20px;line-height:1.2;color:var(--ink-muted);margin-top:6px}
.node .offl{font-family:'Oswald',sans-serif;font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:var(--tape);margin-top:4px}
.node.col-silver .tile-l{background:var(--ink);color:var(--paper)} .node.col-silver .tile-l b{color:var(--paper)}
.attr{font-size:22px;line-height:1.35;color:var(--ink-muted);margin-top:34px}
.bcard{border:1.5px solid var(--ink);padding:24px 26px 26px;background:var(--paper)}
.bcard .bh{display:flex;align-items:flex-start;gap:20px;border-bottom:1px solid var(--paper-line);padding-bottom:18px}
.bcard .bh .ic{width:46px;height:46px;flex-shrink:0;color:var(--ink)} .bcard .bh .ic svg{width:46px;height:46px}
.bcard .bh h3{font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:32px;line-height:1.1}
.bcard .bh .og{font-family:'Geist Mono',monospace;font-size:18px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-muted);margin-top:6px}
.bcard .bh .tag{margin-left:auto;font-family:'Oswald',sans-serif;font-weight:600;font-size:17px;letter-spacing:.14em;text-transform:uppercase;border:1.5px solid var(--ink);padding:6px 12px;white-space:nowrap}
.bcard.off{border-style:dashed} .bcard.off .tag{color:var(--tape);border-color:var(--tape)}
.bcard .knobs{margin-top:22px} .bcard .chips{margin-top:18px}
.pin .song-title{font-size:104px}
.pin .strip{margin:40px 0 0}
.pin .hook{font-size:42px}
.song .facts{margin-top:40px}
.pin .facts{margin-top:28px}
`;

function knobSvg(c: KnobCell): string {
  if (c.pos === undefined) return `<div class="tile"><span class="val">${esc(c.value)}</span></div>`;
  const r = 52;
  const cx = 60;
  const cy = 60;
  const a0 = (-225 * Math.PI) / 180;
  const sweep = (270 * Math.PI) / 180;
  const pt = (a: number, rr = r) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  const aEnd = a0 + sweep * c.pos;
  const large = sweep * c.pos > Math.PI ? 1 : 0;
  const largeTrack = 1;
  return `<svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
<path d="M ${pt(a0)} A ${r} ${r} 0 ${largeTrack} 1 ${pt(a0 + sweep)}" fill="none" stroke="var(--paper-2)" stroke-width="10"/>
<path d="M ${pt(a0)} A ${r} ${r} 0 ${large} 1 ${pt(aEnd)}" fill="none" stroke="var(--amber)" stroke-width="10"/>
<circle cx="${cx}" cy="${cy}" r="36" fill="var(--ink)"/>
<line x1="${cx}" y1="${cy}" x2="${pt(aEnd, 32).split(" ")[0]}" y2="${pt(aEnd, 32).split(" ")[1]}" stroke="var(--paper)" stroke-width="5" stroke-linecap="square"/>
</svg>`;
}

/** Block card with the site icon + category tag (new_tone "Every knob" slides). */
function blockCardHtml(g: SlideGroup, layout: "knobs" | "rows"): string {
  const inner = groupHtml({ ...g, iconSvg: undefined }, layout, false).replace(/^<section class="group[^"]*">|<\/section>$/g, "");
  return `<section class="bcard${g.off ? " off" : ""}"><div class="bh"><span class="ic">${g.iconSvg ?? ""}</span><div><h3>${tx(g.title)}</h3>${g.subtitle ? `<div class="og">${tx(g.subtitle)}</div>` : ""}</div>${g.tag ? `<span class="tag">${tx(g.tag)}</span>` : ""}</div>${inner}</section>`;
}

function stripHtml(nodes: ChainNode[]): string {
  return `<div class="strip">${nodes
    .map((n, i) => `${i ? '<span class="dash"></span>' : ""}<span class="tile-s${n.off ? " off" : ""}">${n.iconSvg}<b>${tx(n.kind)}</b></span>`)
    .join("")}</div>`;
}

function nodesHtml(nodes: ChainNode[]): string {
  return `<div class="nodes">${nodes
    .map(
      (n) => `<div class="node${n.off ? " off" : ""}${n.color ? ` col-${n.color}` : ""}"><div class="tile-l">${n.iconSvg}<b>${tx(n.kind)}</b></div>
<div class="nm">${tx(n.name)}</div>${n.gear ? `<div class="og">${tx(n.gear)}</div>` : ""}${n.off ? `<div class="offl">Off by default</div>` : ""}</div>`,
    )
    .join("")}</div>`;
}

/** Song header: credit lines are display facts (d…), chips are setting facts, the hook is the one line with no fact. */
function songHeadHtml(s: SlideSpec): string {
  const eyebrow = (s.eyebrow ?? []).map((e) => `<span>${tx(e)}</span>`).join("");
  const credit = s.lines.filter((l) => l.factId?.startsWith("d")).map((l) => `<p>${tx(l)}</p>`).join("");
  const chips = s.lines.filter((l) => l.factId && !l.factId.startsWith("d")).map((l) => `<span class="fact">${tx(l)}</span>`).join("");
  const hook = s.lines.find((l) => !l.factId);
  return `<span class="kicker">${tx(s.kicker)}</span>${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
<h1 class="song-title" data-fit>${tx(s.title)}</h1>${credit ? `<div class="credit">${credit}</div>` : ""}${hook ? `<p class="hook">${tx(hook)}</p>` : ""}${chips ? `<div class="facts">${chips}</div>` : ""}`;
}

function groupHtml(g: SlideGroup, layout: "knobs" | "rows", showHead = true): string {
  if (g.iconSvg) return blockCardHtml(g, layout);
  const head = !showHead ? "" : `<h3>${tx(g.title)}${g.subtitle ? ` <small>${tx(g.subtitle)}</small>` : ""}</h3>`;
  if (layout === "knobs") {
    // Arcs only when EVERY knob in the group has a verified range; otherwise all tiles (no mixed styles).
    const allArcs = g.cells.every((c) => c.pos !== undefined);
    const cellsIn = allArcs ? g.cells : g.cells.map((c) => ({ ...c, pos: undefined }));
    const cells = cellsIn
      .map((c) => `<div class="cell">${knobSvg(c)}<div class="lab">${esc(c.label)}</div>${c.pos === undefined ? "" : `<div class="val">${esc(c.value)}</div>`}</div>`)
      .join("");
    return `<section class="group${g.off ? " off" : ""}">${head}<div class="knobs">${cells}</div></section>`;
  }
  const chips = g.cells.map((c) => `<div class="chip"><b>${esc(c.label)}</b><span>${esc(c.value)}</span></div>`).join("");
  return `<section class="group${g.off ? " off" : ""}">${head}<div class="chips">${chips}</div></section>`;
}

function footer(s: SlideSpec): string {
  const [brand, idx] = s.footer;
  return `<div class="footer"><span>${tx(brand)}</span>${idx ? `<span class="${idx.structural ? "idx" : ""}">${tx(idx)}</span>` : ""}</div>`;
}

function page(inner: string, w: number, h: number, extraClass = ""): string {
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT_HREF}"><style>${CSS}</style></head>
<body><div class="slide ${extraClass}" style="--w:${w}px;--h:${h}px">${inner}</div></body></html>`;
}

export function slideHtml(s: SlideSpec, w: number, h: number): string {
  switch (s.kind) {
    case "cover": {
      const isName = (l: TextItem) => !l.factId || l.factId.startsWith("d");
      const chips = s.lines.filter((l) => !isName(l)).map((l) => `<span class="fact">${tx(l)}</span>`).join("");
      const names = s.lines.filter(isName).map(tx).join(" · ");
      return page(
        `<div class="pad" style="display:flex;flex-direction:column;height:100%"><span class="kicker">${tx(s.kicker)}</span>
<h1 class="headline" data-fit>${tx(s.title)}</h1><div class="facts">${chips}</div>${names ? `<p class="sub">${names}</p>` : ""}
<div class="cover-cue">Swipe for every setting &rarr;</div></div>${footer(s)}`,
        w,
        h,
      );
    }
    case "block":
      return page(
        `<div class="bar"><span class="kicker">${tx(s.kicker)}</span><h2>${tx(s.title)}</h2></div>
<div class="body" data-fit>${(s.groups ?? []).map((g, _i, all) => groupHtml(g, s.layout ?? "knobs", !(all.length === 1 && g.title.text === s.title.text))).join("")}${s.lines.map((l) => `<p class="note">${tx(l)}</p>`).join("")}</div>${footer(s)}`,
        w,
        h,
      );
    case "table": {
      const t = s.table!;
      return page(
        `<div class="bar"><span class="kicker">${tx(s.kicker)}</span><h2>${tx(s.title)}</h2></div>
<div class="body" data-fit><table><thead><tr>${t.header.map((x) => `<th>${tx(x)}</th>`).join("")}</tr></thead><tbody>${t.rows
          .map((r) => `<tr>${r.cells.map((c) => `<td>${tx(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>${t.notes.map((n) => `<p class="tnote">${tx(n)}</p>`).join("")}</div>${footer(s)}`,
        w,
        h,
      );
    }
    case "song":
      return page(`<div class="pad" style="display:flex;flex-direction:column;height:100%">${songHeadHtml(s)}${s.chain ? stripHtml(s.chain.nodes) : ""}</div>${footer(s)}`, w, h, "song");
    case "chain": {
      const c = s.chain!;
      const g = c.guitar;
      const guitar = g
        ? `<div class="gcard"><div class="gi">${g.iconSvg}</div><div><div class="k">Guitar</div><div class="gn">${tx(g.name)}</div><div class="specs">${g.specs
            .map((x) => `<div><div class="k">${tx(x.label)}</div><div class="v">${tx(x.value)}</div></div>`)
            .join("")}</div></div></div>`
        : "";
      return page(
        `<div class="pad"><span class="kicker">${tx(s.kicker)}</span><div class="cmeta">${c.meta.map((m) => `<span>${tx(m)}</span>`).join("")}</div>
<div data-fit>${guitar}${nodesHtml(c.nodes)}${s.lines.map((l) => `<p class="attr">${tx(l)}</p>`).join("")}</div></div>${footer(s)}`,
        w,
        h,
      );
    }
    case "rule":
      return page(`<div class="pad"><span class="kicker">${tx(s.kicker)}</span><p class="rule" data-fit>${tx(s.title)}</p></div>${footer(s)}`, w, h);
    case "close": {
      const lines = s.lines.map((l) => (l.text.startsWith("Settings researched") ? `<p class="disc">${tx(l)}</p>` : `<p>${tx(l)}</p>`)).join("");
      return page(`<div class="pad"><span class="kicker">${tx(s.kicker)}</span><h1 class="close-cta">${tx(s.title)}</h1><div class="close-lines" data-fit>${lines}</div></div>${footer(s)}`, w, h);
    }
    case "pin": {
      if (s.chain) {
        return page(`<div class="pad">${songHeadHtml(s)}${nodesHtml(s.chain.nodes)}</div>${footer(s)}`, w, h, "pin");
      }
      const chips = s.lines.filter((l) => l.factId && !l.factId.startsWith("d")).map((l) => `<span class="fact">${tx(l)}</span>`).join("");
      const names = s.lines.filter((l) => l.factId?.startsWith("d")).map(tx).join(" · ");
      const body = s.groups
        ? s.groups.map((g) => groupHtml(g, "rows")).join("")
        : s.table
          ? `<table><thead><tr>${s.table.header.map((x) => `<th>${tx(x)}</th>`).join("")}</tr></thead><tbody>${s.table.rows
              .map((r) => `<tr>${r.cells.map((c) => `<td>${tx(c)}</td>`).join("")}</tr>`)
              .join("")}</tbody></table>`
          : "";
      return page(
        `<div class="pad"><span class="kicker">${tx(s.kicker)}</span><h1 class="headline" data-fit>${tx(s.title)}</h1><div class="facts">${chips}</div>${names ? `<p class="sub">${names}</p>` : ""}</div>
<div class="body" data-fit>${body}</div>${footer(s)}`,
        w,
        h,
        "pin",
      );
    }
  }
}
