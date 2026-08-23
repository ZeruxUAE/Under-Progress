import { describe, expect, it } from "vitest";
import { defaultReadingPreferences, lineHeightFor, normalizeReadingPreferences, textScaleClass } from "./readingPreferences";

describe("reading preferences", () => {
  it("returns safe defaults for missing or malformed browser storage", () => {
    expect(normalizeReadingPreferences(null)).toEqual(defaultReadingPreferences);
    expect(normalizeReadingPreferences({ textSize: "Huge", spacing: "Wide", contrast: "yes" })).toEqual(defaultReadingPreferences);
  });

  it("preserves valid saved preferences", () => {
    expect(normalizeReadingPreferences({ textSize: "Extra large", spacing: "Relaxed", contrast: true, focus: true })).toEqual({
      textSize: "Extra large", spacing: "Relaxed", contrast: true, focus: true,
    });
  });

  it("maps each visual preference to a visible reading change", () => {
    expect(textScaleClass("Comfortable")).toContain("text-base");
    expect(textScaleClass("Extra large")).toContain("1.5rem");
    expect(lineHeightFor("Balanced")).toBe(1.55);
    expect(lineHeightFor("Relaxed")).toBe(2);
  });
});
