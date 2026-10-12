import { describe, it, expect } from "vitest";
import { parsePageParam, pageWindow, paginate } from "@/lib/pagination";

describe("parsePageParam", () => {
  it("parses a normal page number", () => {
    expect(parsePageParam("3")).toBe(3);
  });

  it("defaults to 1 when absent", () => {
    expect(parsePageParam(undefined)).toBe(1);
  });

  it("defaults to 1 for junk, zero and negatives", () => {
    expect(parsePageParam("banana")).toBe(1);
    expect(parsePageParam("")).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-4")).toBe(1);
    expect(parsePageParam("NaN")).toBe(1);
    expect(parsePageParam("Infinity")).toBe(1);
  });

  it("floors floats rather than producing a fractional page", () => {
    expect(parsePageParam("2.9")).toBe(2);
  });
});

describe("pageWindow", () => {
  it("lists every page when the run is short", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the tail when near the start", () => {
    expect(pageWindow(1, 12)).toEqual([1, 2, "gap", 12]);
  });

  it("collapses both sides when in the middle", () => {
    expect(pageWindow(6, 12)).toEqual([1, "gap", 5, 6, 7, "gap", 12]);
  });

  it("collapses the head when near the end", () => {
    expect(pageWindow(12, 12)).toEqual([1, "gap", 11, 12]);
  });

  it("never emits a gap standing in for a single page", () => {
    // A gap hiding exactly one page is worse than just showing it.
    for (let total = 8; total <= 20; total++) {
      for (let cur = 1; cur <= total; cur++) {
        const w = pageWindow(cur, total);
        const nums = w.filter((p): p is number => p !== "gap");
        w.forEach((p, i) => {
          if (p !== "gap") return;
          const before = w[i - 1] as number;
          const after = w[i + 1] as number;
          expect(after - before).toBeGreaterThan(2);
        });
        // Always anchored on first and last, always ascending, no dupes.
        expect(nums[0]).toBe(1);
        expect(nums[nums.length - 1]).toBe(total);
        expect([...nums]).toEqual([...new Set(nums)]);
        expect([...nums]).toEqual([...nums].sort((a, b) => a - b));
        expect(nums).toContain(cur);
      }
    }
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 245 }, (_, i) => i + 1);

  it("slices the first page and reports a 1-based range", () => {
    const r = paginate(items, 1, 48);
    expect(r.page).toBe(1);
    expect(r.totalPages).toBe(6);
    expect(r.pageItems).toHaveLength(48);
    expect(r.pageItems[0]).toBe(1);
    expect(r.rangeFrom).toBe(1);
    expect(r.rangeTo).toBe(48);
  });

  it("slices a middle page without dropping or repeating items", () => {
    const r = paginate(items, 3, 48);
    expect(r.pageItems[0]).toBe(97);
    expect(r.rangeFrom).toBe(97);
    expect(r.rangeTo).toBe(144);
  });

  it("handles a short final page", () => {
    const r = paginate(items, 6, 48);
    expect(r.pageItems).toHaveLength(5);
    expect(r.rangeFrom).toBe(241);
    expect(r.rangeTo).toBe(245);
  });

  it("clamps a page past the end to the last page", () => {
    const r = paginate(items, 99, 48);
    expect(r.page).toBe(6);
    expect(r.rangeTo).toBe(245);
  });

  it("clamps a page below 1 up to the first page", () => {
    expect(paginate(items, 0, 48).page).toBe(1);
    expect(paginate(items, -5, 48).page).toBe(1);
  });

  it("reports one empty page for an empty result set", () => {
    const r = paginate([], 1, 48);
    expect(r.totalPages).toBe(1);
    expect(r.page).toBe(1);
    expect(r.pageItems).toEqual([]);
    expect(r.rangeFrom).toBe(0);
    expect(r.rangeTo).toBe(0);
  });

  it("covers the whole list exactly once across all pages", () => {
    const seen: number[] = [];
    const { totalPages } = paginate(items, 1, 48);
    for (let p = 1; p <= totalPages; p++) {
      seen.push(...paginate(items, p, 48).pageItems);
    }
    expect(seen).toEqual(items);
  });
});
