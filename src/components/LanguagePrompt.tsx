/** Under Progress language prompt — browser-led, privacy-conscious website and extension language control. */
import { Globe2, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { languageStorageKey } from "../lib/languagePreference";
import { speechLanguageOptions, useLanguage } from "../lib/i18n";

export function LanguagePrompt() {
  const { speechLanguage, languageLabel, setLanguage, t, isTranslating, translationProgress, translationError } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(speechLanguage);
  const [savedLanguage, setSavedLanguage] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<"idle" | "saved" | "error">("idle");
  const selectedLabel = useMemo(() => languageLabel(selectedLanguage), [languageLabel, selectedLanguage]);

  useEffect(() => {
    const saved = window.localStorage.getItem(languageStorageKey);
    const detected = navigator.languages?.[0] || navigator.language || "en";
    setSelectedLanguage(saved || detected);
    setSavedLanguage(saved || null);
    const timer = saved ? undefined : window.setTimeout(() => setOpen(true), 5000);
    return () => { if (timer) window.clearTimeout(timer); };
  }, []);

  useEffect(() => { setSelectedLanguage(speechLanguage); }, [speechLanguage]);
  const applyLanguage = (next: string) => {
    try {
      const saved = setLanguage(next);
      setSelectedLanguage(saved);
      setSavedLanguage(saved);
      setSaveFeedback("saved");
    } catch { setSaveFeedback("error"); }
  };

  return <>
    {!open && <button type="button" onClick={() => { setSaveFeedback("idle"); setOpen(true); }} className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm font-bold shadow-[0_12px_30px_rgba(16,42,67,.16)]"><Globe2 className="h-4 w-4 text-[#0F8B7B]" />{savedLanguage ? `${t("languageFloating")}: ${languageLabel(savedLanguage)}` : t("languageFloating")}</button>}
    {open && <section role="dialog" aria-modal="true" aria-labelledby="language-prompt-title" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[500px] rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_24px_70px_rgba(16,42,67,.28)] sm:p-6"><button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="light-button absolute right-4 top-4 rounded-full p-2"><X className="h-4 w-4" /></button><div className="flex items-start gap-3 pr-8"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9F3ED]"><Globe2 className="h-5 w-5 text-[#0F8B7B]" /></span><div><p className="field-label">{t("languageKicker")}</p><h2 id="language-prompt-title" className="mt-2 font-serif text-2xl font-semibold">{t("languagePromptTitle", { language: selectedLabel })}</h2></div></div><p className="theme-muted mt-4 text-sm">{t("languagePromptBody")}</p><p className="mt-3 rounded-xl bg-[#FCF1CF] px-4 py-3 text-sm font-bold text-[#5D4200]">{t("languageNotice")}</p><p className="theme-muted mt-3 text-xs">{t("languageCoverage")}</p><label className="mt-5 block text-sm font-bold">{t("languageLabel")}<select value={selectedLanguage} onChange={event => applyLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-sm font-semibold">{speechLanguageOptions.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}</select></label>{isTranslating && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-[#E5F0FE] px-4 py-3 text-sm font-semibold text-[#102A43]">{t("translationLoading", { completed: String(translationProgress.completed), total: String(translationProgress.total) })}</p>}{translationError && <p role="alert" className="mt-4 rounded-xl bg-[#FBE9E7] px-4 py-3 text-sm font-semibold text-[#9F2D20]">{t("translationError")}</p>}{saveFeedback === "saved" && !isTranslating && !translationError && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-[#D9F3ED] px-4 py-3 text-sm font-semibold text-[#102A43]">{t("languageSaved", { language: selectedLabel })}</p>}{saveFeedback === "error" && <p role="alert" className="mt-4 rounded-xl bg-[#FBE9E7] px-4 py-3 text-sm font-semibold text-[#9F2D20]">{t("languageError")}</p>}<div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => applyLanguage(selectedLanguage)} className="rounded-full bg-[#0F8B7B] px-5 py-3 text-sm font-bold text-white"><Volume2 className="mr-1 inline h-4 w-4" />{saveFeedback === "saved" ? t("saved", { language: selectedLabel }) : t("useLanguage", { language: selectedLabel })}</button><button type="button" onClick={() => setOpen(false)} className="light-button rounded-full border border-[var(--line)] px-5 py-3 text-sm font-bold">{saveFeedback === "saved" ? t("close") : t("notNow")}</button></div></section>}
  </>;
}
