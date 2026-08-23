/** Under Progress language prompt — browser-led, privacy-conscious preference control that never uses IP geolocation. */
import { Globe2, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { languageStorageKey, saveLanguagePreference } from "../lib/languagePreference";

type LanguageOption = { code: string; label: string };

const languageOptions: LanguageOption[] = [
  { code: "ar-AE", label: "العربية — Arabic (UAE)" },
  { code: "ar-SA", label: "العربية — Arabic" },
  { code: "am-ET", label: "አማርኛ — Amharic" },
  { code: "bn-BD", label: "বাংলা — Bangla" },
  { code: "zh-CN", label: "中文（简体）— Chinese, Simplified" },
  { code: "zh-TW", label: "中文（繁體）— Chinese, Traditional" },
  { code: "en", label: "English" },
  { code: "fa-IR", label: "فارسی — Persian" },
  { code: "fr", label: "Français — French" },
  { code: "de", label: "Deutsch — German" },
  { code: "el", label: "Ελληνικά — Greek" },
  { code: "gu-IN", label: "ગુજરાતી — Gujarati" },
  { code: "he-IL", label: "עברית — Hebrew" },
  { code: "hi-IN", label: "हिन्दी — Hindi" },
  { code: "id-ID", label: "Bahasa Indonesia — Indonesian" },
  { code: "it-IT", label: "Italiano — Italian" },
  { code: "ja-JP", label: "日本語 — Japanese" },
  { code: "ko-KR", label: "한국어 — Korean" },
  { code: "ml-IN", label: "മലയാളം — Malayalam" },
  { code: "mr-IN", label: "मराठी — Marathi" },
  { code: "ne-NP", label: "नेपाली — Nepali" },
  { code: "pl-PL", label: "Polski — Polish" },
  { code: "pt", label: "Português — Portuguese" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ — Punjabi" },
  { code: "ro-RO", label: "Română — Romanian" },
  { code: "ru-RU", label: "Русский — Russian" },
  { code: "so-SO", label: "Soomaali — Somali" },
  { code: "es", label: "Español — Spanish" },
  { code: "sw", label: "Kiswahili — Swahili" },
  { code: "ta-IN", label: "தமிழ் — Tamil" },
  { code: "te-IN", label: "తెలుగు — Telugu" },
  { code: "th-TH", label: "ไทย — Thai" },
  { code: "tr-TR", label: "Türkçe — Turkish" },
  { code: "uk-UA", label: "Українська — Ukrainian" },
  { code: "ur-PK", label: "اردو — Urdu" },
  { code: "vi-VN", label: "Tiếng Việt — Vietnamese" },
  { code: "tl-PH", label: "Filipino" },
];

function languageLabel(code: string) {
  try { return new Intl.DisplayNames([navigator.language || "en"], { type: "language" }).of(code.split("-")[0]) || code; } catch { return code; }
}

function matchLanguage(language: string, choices = languageOptions) {
  const normalised = language.toLowerCase();
  return choices.find(({ code }) => code.toLowerCase() === normalised)
    ?? choices.find(({ code }) => code.split("-")[0] === normalised.split("-")[0])
    ?? { code: language || "en", label: language || "English" };
}

export function LanguagePrompt() {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [browserLanguage, setBrowserLanguage] = useState("en");
  const [voiceLanguages, setVoiceLanguages] = useState<LanguageOption[]>([]);
  const [savedLanguage, setSavedLanguage] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<"idle" | "saved" | "error">("idle");
  const languageChoices = useMemo(() => {
    const byCode = new Map(languageOptions.map(option => [option.code.toLowerCase(), option]));
    voiceLanguages.forEach(option => byCode.set(option.code.toLowerCase(), option));
    return [...byCode.values()].sort((first, second) => first.label.localeCompare(second.label));
  }, [voiceLanguages]);
  const selected = useMemo(() => matchLanguage(selectedLanguage, languageChoices), [languageChoices, selectedLanguage]);
  const browserSuggested = useMemo(() => matchLanguage(browserLanguage, languageChoices), [browserLanguage, languageChoices]);

  useEffect(() => {
    const saved = window.localStorage.getItem(languageStorageKey);
    const detected = navigator.languages?.[0] || navigator.language || "en";
    const initialLanguage = saved || detected;
    setBrowserLanguage(detected);
    setSelectedLanguage(initialLanguage);
    setSavedLanguage(saved);
    document.documentElement.lang = initialLanguage;
    const updateVoiceLanguages = () => {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      const unique = new Map<string, LanguageOption>();
      voices.forEach(voice => { if (voice.lang) unique.set(voice.lang.toLowerCase(), { code: voice.lang, label: `${languageLabel(voice.lang)} — ${voice.lang}` }); });
      setVoiceLanguages([...unique.values()]);
    };
    updateVoiceLanguages();
    window.speechSynthesis?.addEventListener?.("voiceschanged", updateVoiceLanguages);
    const timer = saved ? undefined : window.setTimeout(() => setOpen(true), 5000);
    return () => { if (timer) window.clearTimeout(timer); window.speechSynthesis?.removeEventListener?.("voiceschanged", updateVoiceLanguages); };
  }, []);

  const saveLanguage = () => {
    try {
      const saved = saveLanguagePreference(window.localStorage, selectedLanguage);
      document.documentElement.lang = saved;
      window.dispatchEvent(new CustomEvent("under-progress-language-change", { detail: saved }));
      window.postMessage({ source: "under-progress-website", type: "set-language", language: saved }, window.location.origin);
      setSavedLanguage(saved);
      setSaveFeedback("saved");
    } catch {
      setSaveFeedback("error");
    }
  };

  return <>
    {!open && <button type="button" onClick={() => { setSaveFeedback("idle"); setOpen(true); }} className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm font-bold shadow-[0_12px_30px_rgba(16,42,67,.16)]"><Globe2 className="h-4 w-4 text-[#0F8B7B]" />{savedLanguage ? `Language: ${matchLanguage(savedLanguage, languageChoices).label}` : "Language"}</button>}
    {open && <section role="dialog" aria-modal="true" aria-labelledby="language-prompt-title" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[500px] rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_24px_70px_rgba(16,42,67,.28)] sm:p-6"><button type="button" aria-label="Close language chooser" onClick={() => setOpen(false)} className="light-button absolute right-4 top-4 rounded-full p-2"><X className="h-4 w-4" /></button><div className="flex items-start gap-3 pr-8"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9F3ED]"><Globe2 className="h-5 w-5 text-[#0F8B7B]" /></span><div><p className="field-label">Language and listening</p><h2 id="language-prompt-title" className="mt-2 font-serif text-2xl font-semibold">Is {browserSuggested.label} your language?</h2></div></div><p className="theme-muted mt-4 text-sm">Choose the language you want Under Progress to remember for read-aloud. This uses your browser language as a hint, not your IP address or location. Any additional speech languages installed in your browser appear in this list.</p><p className="mt-3 rounded-xl bg-[#FCF1CF] px-4 py-3 text-sm font-bold text-[#5D4200]"><strong>This choice controls the Read Aloud voice in the Under Progress Chrome and Edge extension.</strong> Read Aloud uses only a matching installed voice for the selected language. If your device has no matching voice, it shows an instruction to add one instead of silently switching to English or your browser default.</p><label className="mt-5 block text-sm font-bold">Not your language?<select value={selectedLanguage} onChange={event => { setSelectedLanguage(event.target.value); setSaveFeedback("idle"); }} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-sm font-semibold"><option value={selected.code}>{selected.label}</option>{languageChoices.filter(({ code }) => code !== selected.code).map(({ code, label }) => <option key={code} value={code}>{label}</option>)}</select></label>{saveFeedback === "saved" && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-[#D9F3ED] px-4 py-3 text-sm font-semibold text-[#102A43]">{selected.label} saved for extension Read Aloud. You can close this panel or choose another language.</p>}{saveFeedback === "error" && <p role="alert" className="mt-4 rounded-xl bg-[#FBE9E7] px-4 py-3 text-sm font-semibold text-[#9F2D20]">Your browser could not save this language. Please allow local storage and try again.</p>}<div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={saveLanguage} className="rounded-full bg-[#0F8B7B] px-5 py-3 text-sm font-bold text-white"><Volume2 className="mr-1 inline h-4 w-4" />{saveFeedback === "saved" ? `${selected.label} saved` : `Use ${selected.label}`}</button><button type="button" onClick={() => setOpen(false)} className="light-button rounded-full border border-[var(--line)] px-5 py-3 text-sm font-bold">{saveFeedback === "saved" ? "Close" : "Not now"}</button></div></section>}
  </>;
}
