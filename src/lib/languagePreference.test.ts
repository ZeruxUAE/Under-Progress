import { describe, expect, it } from "vitest";
import { extensionLanguageMessage, resolveLanguage } from "./i18n";
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

  it("maps browser language hints to translated website languages", () => {
    expect(resolveLanguage("zh-CN")).toBe("zh-CN");
    expect(resolveLanguage("zh-HK")).toBe("zh-TW");
    expect(resolveLanguage("ar-AE")).toBe("ar");
    expect(resolveLanguage("de-DE")).toBe("en");
  });

  it("preserves the localized choice in the website-to-extension language message", () => {
    expect(extensionLanguageMessage("zh-CN")).toEqual({ source: "under-progress-website", type: "set-language", language: "zh-CN" });
    expect(extensionLanguageMessage("ar-AE")).toEqual({ source: "under-progress-website", type: "set-language", language: "ar" });
  });
});
