const MAX_BYTES = 430;
const CACHE_PREFIX = "under-progress-interface-language-v4-";

type TranslationCache = {
  messages: Record<string, string>;
  complete: boolean;
};

function byteLength(value: string) { return new TextEncoder().encode(value).length; }

function splitText(value: string) {
  const parts: string[] = [];
  let current = "";
  for (const word of value.split(/(\s+)/)) {
    if (byteLength(current + word) > MAX_BYTES && current) { parts.push(current); current = word; } else current += word;
  }
  if (current) parts.push(current);
  return parts;
}

function protect(value: string) {
  const protectedValues: string[] = [];
  const pattern = /\{\w+\}|Under Progress|SAS|Chrome|Edge|GitHub|Read Aloud/g;
  const text = value.replace(pattern, match => { const token = `__UP${protectedValues.length}__`; protectedValues.push(match); return token; });
  return { text, restore: (translated: string) => translated.replace(/__\s*up\s*(\d+)\s*__/gi, (_match, index) => protectedValues[Number(index)] || "") };
}

async function translateText(value: string, target: string) {
  const { text, restore } = protect(value);
  const translated = await Promise.all(splitText(text).map(async part => {
    const query = new URLSearchParams({ q: part, langpair: `en|${target}`, mt: "1" });
    const response = await fetch(`https://api.mymemory.translated.net/get?${query}`);
    const data = await response.json();
    if (!response.ok || data.responseStatus !== 200 || !data.responseData?.translatedText) throw new Error(data.responseDetails || "The free translation service could not translate this interface.");
    return data.responseData.translatedText as string;
  }));
  return restore(translated.join(""));
}

async function mapWithLimit<T>(items: T[], limit: number, map: (item: T, index: number) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) { const index = next++; await map(items[index], index); }
  }));
}

export async function loadOrTranslateInterface(source: Record<string, string>, language: string, onProgress?: (completed: number, total: number) => void) {
  const target = language.toLowerCase().startsWith("zh-") ? language : language.split("-")[0];
  const cacheKey = `${CACHE_PREFIX}${language}`;
  let cache: TranslationCache = { messages: {}, complete: false };
  try {
    const cached = window.localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as TranslationCache;
      if (parsed?.messages && typeof parsed.messages === "object") cache = parsed;
    }
  } catch {}
  const entries = Object.entries(source);
  const translated: Record<string, string> = { ...cache.messages };
  let completed = entries.filter(([key]) => typeof translated[key] === "string").length;
  const persist = (complete: boolean) => {
    try { window.localStorage.setItem(cacheKey, JSON.stringify({ messages: translated, complete } satisfies TranslationCache)); } catch {}
  };
  onProgress?.(completed, entries.length);
  if (completed === entries.length && cache.complete) return translated;
  try {
    await mapWithLimit(entries.filter(([key]) => typeof translated[key] !== "string"), 2, async ([key, value]) => {
      translated[key] = await translateText(value, target);
      completed += 1;
      persist(false);
      onProgress?.(completed, entries.length);
    });
  } catch (error) {
    persist(false);
    throw error;
  }
  persist(true);
  return translated;
}
