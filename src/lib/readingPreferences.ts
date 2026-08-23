export type TextSize = "Comfortable" | "Large" | "Extra large";
export type Spacing = "Balanced" | "Relaxed";

export type ReadingPreferences = {
  textSize: TextSize;
  spacing: Spacing;
  contrast: boolean;
  focus: boolean;
};

export const defaultReadingPreferences: ReadingPreferences = {
  textSize: "Comfortable",
  spacing: "Balanced",
  contrast: false,
  focus: false,
};

const textSizes: TextSize[] = ["Comfortable", "Large", "Extra large"];
const spacings: Spacing[] = ["Balanced", "Relaxed"];

export function normalizeReadingPreferences(value: unknown): ReadingPreferences {
  if (!value || typeof value !== "object") return defaultReadingPreferences;
  const candidate = value as Partial<ReadingPreferences>;
  return {
    textSize: textSizes.includes(candidate.textSize as TextSize) ? candidate.textSize as TextSize : defaultReadingPreferences.textSize,
    spacing: spacings.includes(candidate.spacing as Spacing) ? candidate.spacing as Spacing : defaultReadingPreferences.spacing,
    contrast: candidate.contrast === true,
    focus: candidate.focus === true,
  };
}

export function textScaleClass(size: TextSize) {
  if (size === "Extra large") return "text-[1.3rem] sm:text-[1.5rem]";
  if (size === "Large") return "text-[1.13rem] sm:text-[1.28rem]";
  return "text-base sm:text-lg";
}

export function lineHeightFor(spacing: Spacing) {
  return spacing === "Relaxed" ? 2 : 1.55;
}
