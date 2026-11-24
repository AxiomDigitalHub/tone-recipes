import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { drawGear, drawDial, type GearKind, type GearOptions } from "../src/lib/gear/draw";

/**
 * The gear drawings are a port of the redesign handoff's Python generator
 * (generator/gear.py). The brief: "Keep the geometry and colours exactly."
 * tests/fixtures/gear-golden.json holds that generator's output for every
 * kind, with and without cables, with custom values, titles and colours.
 * This test fails if the TypeScript port drifts from it.
 *
 * Numbers are compared by value, not by spelling: Python prints 92.0 where
 * JavaScript prints 92.
 */

// The fonts the Python generator writes into the SVG.
const PY_FONTS = {
  sans: "Geist, Arial, sans-serif",
  mono: "'Geist Mono', ui-monospace, Menlo, monospace",
};

interface Out { vw: number; vh: number; inner: string }
const golden = JSON.parse(
  fs.readFileSync(path.join(__dirname, "fixtures", "gear-golden.json"), "utf-8"),
) as {
  cases: { kind: GearKind; opts: GearOptions; out: Out }[];
  dials: { frac: number; track: string; out: Out }[];
};

const norm = (s: string) =>
  s.replace(/-?\d*\.\d+/g, (n) => String(Number(parseFloat(n).toFixed(6))));

describe("gear drawings match the handoff generator", () => {
  for (const c of golden.cases) {
    it(`${c.kind} ${JSON.stringify(c.opts)}`, () => {
      const got = drawGear(c.kind, "u", { ...c.opts, fonts: PY_FONTS });
      expect(got.vw).toBe(c.out.vw);
      expect(got.vh).toBe(c.out.vh);
      expect(norm(got.inner)).toBe(norm(c.out.inner));
    });
  }
  for (const d of golden.dials) {
    it(`dial ${d.frac} on ${d.track}`, () => {
      const got = drawDial("u", d.frac, undefined, d.track);
      expect(got.vw).toBe(64);
      expect(norm(got.inner)).toBe(norm(d.out.inner));
    });
  }
});
