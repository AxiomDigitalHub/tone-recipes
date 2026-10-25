import { describe, it, expect } from "vitest";
import { formatPickups, formatTuning, guitarModelName } from "../src/lib/guitar-specs";
import { chainKindLabel, type PreviewBlockData } from "../src/components/v3/preview-helpers";

describe("formatTuning", () => {
  it("maps admin enums", () => {
    expect(formatTuning({ tuning: "eb_standard" })).toBe("Eb standard");
    expect(formatTuning({ tuning: "drop_c_sharp" })).toBe("Drop C#");
    expect(formatTuning({ tuning: "a_standard_7" })).toBe("A standard (7-string)");
  });
  it("shortens hand-written values to the tuning name", () => {
    expect(formatTuning({ tuning: "Drop D (D-A-D-G-B-E)" })).toBe("Drop D");
    expect(formatTuning({ tuning: "D standard (D-G-C-F-A-D), whole step down" })).toBe("D standard");
    expect(formatTuning({ tuning: "C standard (C-F-A#-D#-G-C) -- 2 whole steps down" })).toBe("C standard");
  });
  it("uses tuning_custom for custom", () => {
    expect(formatTuning({ tuning: "custom", tuning_custom: "Open G (D-G-D-G-B-D, low E removed)" })).toBe("Open G");
  });
});

describe("guitarModelName", () => {
  it("drops a hedged provenance note", () => {
    expect(guitarModelName({ model_name: "Gibson Les Paul Junior (likely his 1956, 'Floyd')" })).toBe("Gibson Les Paul Junior");
  });
  it("keeps a descriptive note", () => {
    expect(guitarModelName({ model_name: "Fender Stratocaster (Black Strat)" })).toBe("Fender Stratocaster (Black Strat)");
    expect(guitarModelName({ model_name: "Fender Stratocaster (#1 / 'Number One')" })).toBe("Fender Stratocaster (#1 / 'Number One')");
  });
});

describe("formatPickups", () => {
  it("is one token so the spec line splits cleanly", () => {
    expect(formatPickups({ pickup_config: "P90", pickup_position: "bridge" })).toBe("P90 (bridge)");
  });
});

describe("chainKindLabel", () => {
  const b = (over: Partial<PreviewBlockData>): PreviewBlockData => ({ name: "", sub: "", variant: "pedal", controls: [], values: {}, ...over });
  it("labels gates and room reverbs from the block category", () => {
    expect(chainKindLabel(b({ name: "Noise Gate", sub: "← Gain-structure housekeeping", category: "Dynamics" }))).toBe("Gate");
    expect(chainKindLabel(b({ name: "Room", sub: "← Studio room", category: "Reverb" }))).toBe("Verb");
  });
});
