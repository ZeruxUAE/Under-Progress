import { afterEach, describe, expect, it, vi } from "vitest";
import { loadOrTranslateInterface } from "./freeInterfaceTranslation";

const cacheKey = "under-progress-interface-language-v4-tl-PH";

describe("free interface translation cache", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("resumes an incomplete cached pack without translating messages that were already saved", async () => {
    const stored = new Map<string, string>([[cacheKey, JSON.stringify({ messages: { title: "Pamagat" }, complete: false })]]);
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => stored.set(key, value),
      },
    });
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ responseStatus: 200, responseData: { translatedText: "Katawan" } }),
    });
    vi.stubGlobal("fetch", fetch);
    const progress: number[] = [];

    await expect(loadOrTranslateInterface({ title: "Title", body: "Body" }, "tl-PH", completed => progress.push(completed))).resolves.toEqual({ title: "Pamagat", body: "Katawan" });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(progress).toEqual([1, 2]);
    expect(JSON.parse(stored.get(cacheKey) || "{}")).toEqual({ messages: { title: "Pamagat", body: "Katawan" }, complete: true });
  });
});
