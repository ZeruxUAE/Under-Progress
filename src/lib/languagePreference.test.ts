import { describe, expect, it } from "vitest";
import { languageStorageKey, saveLanguagePreference } from "./languagePreference";

describe("language preference persistence", () => {
  it("stores the selected language under the shared preference key", () => {
    const stored = new Map<string, string>();
    const storage = {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => stored.set(key, value),
    };

    expect(saveLanguagePreference(storage, "ar-AE")).toBe("ar-AE");
    expect(storage.getItem(languageStorageKey)).toBe("ar-AE");
  });

  it("uses English when an empty value is supplied", () => {
    const storage = { getItem: () => null, setItem: () => undefined };
    expect(saveLanguagePreference(storage, "  ")).toBe("en");
  });
});
