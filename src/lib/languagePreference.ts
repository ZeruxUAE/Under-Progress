export const languageStorageKey = "under-progress-language";

export type LanguageStorage = Pick<Storage, "getItem" | "setItem">;

export function saveLanguagePreference(storage: LanguageStorage, language: string) {
  const normalized = language.trim() || "en";
  storage.setItem(languageStorageKey, normalized);
  return normalized;
}
