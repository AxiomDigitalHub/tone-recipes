import { describe, it, expect } from "vitest";
import { slugifyPresetName } from "@/lib/slug";

describe("slugifyPresetName", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyPresetName("SRV Pride and Joy")).toBe("srv-pride-and-joy");
  });

  it("collapses punctuation runs into a single hyphen", () => {
    expect(slugifyPresetName("Gilmour — Comfortably Numb (solo #2)")).toBe(
      "gilmour-comfortably-numb-solo-2",
    );
  });

  it("strips leading/trailing separators", () => {
    expect(slugifyPresetName("...Tone!")).toBe("tone");
  });

  it("is stable for already-clean slugs", () => {
    expect(slugifyPresetName("jcm800-crunch")).toBe("jcm800-crunch");
  });
});
