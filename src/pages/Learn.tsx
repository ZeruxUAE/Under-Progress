import { ArrowLeft, Contrast, Focus, Headphones, Pause, Play, RotateCcw, Settings2, Type } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../lib/useTheme";

const logoAsset = "/assets/under-progress-logo.png";

type TextSize = "Comfortable" | "Large" | "Extra large";
type Spacing = "Balanced" | "Relaxed";

const readingText = {
  title: "A calm place to begin",
  paragraphs: [
    "Under Progress gives you a reading space that works directly in your browser. You can make the text larger, create more breathing room, increase contrast, or listen instead of reading alone.",
    "Your preferences stay on this device. You can return to your profile at any time and change what helps. There is no test to pass and no diagnosis required.",
    "If you are using a phone or tablet, this web space is your main experience. On a desktop computer, the optional Chrome or Edge extension can carry selected tools to other webpages too.",
  ],
};

function preferredVoice(language: string) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const normalized = language.toLowerCase();
  const base = normalized.split("-")[0];
  return voices.find(voice => voice.lang.toLowerCase() === normalized)
    ?? voices.find(voice => voice.lang.toLowerCase().split("-")[0] === base);
}

export default function Learn() {
  const { dark, toggleTheme } = useTheme();
  const [textSize, setTextSize] = useState<TextSize>("Comfortable");
  const [spacing, setSpacing] = useState<Spacing>("Balanced");
  const [contrast, setContrast] = useState(false);
  const [focus, setFocus] = useState(false);
  const [speechState, setSpeechState] = useState<"idle" | "speaking" | "paused">("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const language = useMemo(() => window.localStorage.getItem("under-progress-language") || navigator.language || "en", []);
  const fullText = `${readingText.title}. ${readingText.paragraphs.join(" ")}`;

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = language;
    const voice = preferredVoice(language);
    if (voice) utterance.voice = voice;
    utterance.onend = () => setSpeechState("idle");
    utterance.onerror = () => setSpeechState("idle");
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeechState("speaking");
  };
  const pauseOrResume = () => {
    if (!window.speechSynthesis) return;
    if (speechState === "speaking") { window.speechSynthesis.pause(); setSpeechState("paused"); }
    else if (speechState === "paused") { window.speechSynthesis.resume(); setSpeechState("speaking"); }
  };
  const reset = () => { window.speechSynthesis?.cancel(); setTextSize("Comfortable"); setSpacing("Balanced"); setContrast(false); setFocus(false); setSpeechState("idle"); };
  const textClass = textSize === "Extra large" ? "text-[1.3rem] sm:text-[1.5rem]" : textSize === "Large" ? "text-[1.13rem] sm:text-[1.28rem]" : "text-base sm:text-lg";
  const lineHeight = spacing === "Relaxed" ? 2 : 1.55;

  return <main className={`theme-shell profile-shell min-h-screen ${contrast ? "bg-[#101820] !text-white" : ""}`}>
    <header className={`border-b ${contrast ? "border-white/40 bg-[#101820]" : "border-[var(--line)] bg-[var(--paper)]/94"} sticky top-0 z-30 backdrop-blur`}>
      <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2"><img src={logoAsset} alt="Under Progress mark" className="h-9 w-9 shrink-0 object-contain" /><span className="brand-ink truncate font-serif text-lg font-semibold">Under Progress</span></Link>
        <div className="flex items-center gap-2"><ThemeToggle dark={dark} onToggle={toggleTheme} /><Link href="/setup" className="light-button inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-2 text-xs font-bold"><Settings2 className="h-4 w-4" /><span className="hidden sm:inline">Profile</span></Link></div>
      </div>
    </header>
    <section className="mx-auto max-w-[1000px] px-4 py-8 sm:px-8 sm:py-12">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className={`theme-panel rounded-[24px] p-5 ${contrast ? "!border-white !bg-[#101820]" : ""}`}>
          <div className="field-label mb-3">Browser reading space</div>
          <h1 className="display-title text-4xl leading-[.94]">Tools that work here, now.</h1>
          <p className="theme-muted mt-4 text-sm">No download and no ZIP file. These controls work in mobile browsers, tablets, and desktop browsers.</p>
          <div className="mt-6 space-y-4">
            <div><p className="mb-2 flex items-center gap-2 text-sm font-bold"><Type className="h-4 w-4 text-[#0F8B7B]" />Text size</p><div className="flex flex-wrap gap-2">{(["Comfortable", "Large", "Extra large"] as TextSize[]).map(value => <button key={value} onClick={() => setTextSize(value)} className={`rounded-full px-3 py-2 text-xs font-bold ${textSize === value ? "bg-[#0F8B7B] text-white" : "light-button border border-[var(--line)]"}`}>{value}</button>)}</div></div>
            <div><p className="mb-2 text-sm font-bold">Line spacing</p><div className="flex gap-2">{(["Balanced", "Relaxed"] as Spacing[]).map(value => <button key={value} onClick={() => setSpacing(value)} className={`rounded-full px-3 py-2 text-xs font-bold ${spacing === value ? "bg-[#0F8B7B] text-white" : "light-button border border-[var(--line)]"}`}>{value}</button>)}</div></div>
            <button onClick={() => setContrast(current => !current)} aria-pressed={contrast} className="light-button flex w-full items-center justify-between rounded-xl border border-[var(--line)] p-3 text-left text-sm font-bold"><span><Contrast className="mr-2 inline h-4 w-4 text-[#0F8B7B]" />High contrast</span><span>{contrast ? "On" : "Off"}</span></button>
            <button onClick={() => setFocus(current => !current)} aria-pressed={focus} className="light-button flex w-full items-center justify-between rounded-xl border border-[var(--line)] p-3 text-left text-sm font-bold"><span><Focus className="mr-2 inline h-4 w-4 text-[#0F8B7B]" />Focus reading</span><span>{focus ? "On" : "Off"}</span></button>
          </div>
          <div className="mt-6 border-t border-[var(--line)] pt-5"><p className="text-sm font-bold">Listen in your chosen language</p><p className="theme-muted mt-1 text-xs">Uses a matching browser voice when your device provides one.</p><div className="mt-3 flex flex-wrap gap-2"><button onClick={speak} className="rounded-full bg-[#102A43] px-4 py-2.5 text-xs font-bold text-white"><Headphones className="mr-1 inline h-4 w-4" />Read aloud</button>{speechState !== "idle" && <button onClick={pauseOrResume} className="light-button rounded-full border border-[var(--line)] px-4 py-2.5 text-xs font-bold">{speechState === "speaking" ? <><Pause className="mr-1 inline h-4 w-4" />Pause</> : <><Play className="mr-1 inline h-4 w-4" />Resume</>}</button>}</div></div>
        </aside>
        <article className={`relative rounded-[28px] border p-6 sm:p-10 ${contrast ? "border-white bg-[#101820] text-white" : "border-[var(--line)] bg-[var(--paper-deep)]"}`}>
          {focus && <div className="pointer-events-none absolute inset-3 rounded-[20px] border-2 border-[#0F8B7B]" />}
          <div className="relative"><div className={`field-label mb-5 ${contrast ? "!text-[#F3B945]" : ""}`}>Mobile-first learning space</div><h2 className={`display-title ${textSize === "Extra large" ? "text-5xl" : "text-4xl sm:text-5xl"} leading-[.95]`}>{readingText.title}</h2>{readingText.paragraphs.map(paragraph => <p key={paragraph} className={`mt-6 max-w-[65ch] ${textClass} ${contrast ? "text-white" : "theme-muted"}`} style={{ lineHeight }}>{paragraph}</p>)}</div>
          <div className="relative mt-10 flex flex-col gap-3 border-t border-current/20 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-semibold">Your device, your preference, your pace.</p><button onClick={reset} className="light-button w-fit rounded-full border border-[var(--line)] px-4 py-2 text-xs font-bold"><RotateCcw className="mr-1 inline h-4 w-4" />Reset reading tools</button></div>
        </article>
      </div>
      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#0F8B7B]"><ArrowLeft className="h-4 w-4" /><Link href="/">Back to the overview</Link></div>
    </section>
  </main>;
}
