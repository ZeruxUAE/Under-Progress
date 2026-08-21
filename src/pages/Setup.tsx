/**
 * Under Progress — Adaptive Field Notes
 * Preference setup with an explicit, on-device bridge to the installed browser extension.
 */
import { ArrowLeft, Check, ChevronRight, Contrast, Focus, PlugZap, RotateCcw, Send, Type } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

const logoAsset = "/assets/under-progress-logo.png";
const supportNeeds = ["Reading and comprehension", "Attention and focus", "Vision and contrast", "Hearing and audio support", "Motor and keyboard access", "I prefer to choose tools myself"];
type Profile = { needs: string[]; textSize: "Compact" | "Comfortable" | "Large"; spacing: "Tight" | "Balanced" | "Relaxed"; contrast: boolean; focus: boolean; };
type ExtensionSettings = { textScale: number; lineSpacing: number; readingWidth: number; contrast: boolean; focus: boolean; };
const initialProfile: Profile = { needs: [], textSize: "Comfortable", spacing: "Balanced", contrast: false, focus: false };

const profileToExtension = (profile: Profile): ExtensionSettings => ({
  textScale: { Compact: 90, Comfortable: 100, Large: 120 }[profile.textSize],
  lineSpacing: { Tight: 1.2, Balanced: 1.5, Relaxed: 1.8 }[profile.spacing],
  readingWidth: 70,
  contrast: profile.contrast,
  focus: profile.focus,
});

const extensionToProfile = (settings: ExtensionSettings, current: Profile): Profile => ({
  ...current,
  textSize: settings.textScale >= 115 ? "Large" : settings.textScale <= 95 ? "Compact" : "Comfortable",
  spacing: settings.lineSpacing >= 1.7 ? "Relaxed" : settings.lineSpacing <= 1.3 ? "Tight" : "Balanced",
  contrast: Boolean(settings.contrast),
  focus: Boolean(settings.focus),
});

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} aria-pressed={selected} className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${selected ? "border-[#0F8B7B] bg-[#D9F3ED] shadow-[0_7px_17px_rgba(15,139,123,0.12)]" : "border-[#102A43]/14 bg-white/60 hover:border-[#0F8B7B]/50 hover:bg-white"}`}><span className="text-sm font-bold leading-5 text-[#102A43]">{children}</span><span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border ${selected ? "border-[#0F8B7B] bg-[#0F8B7B] text-white" : "border-[#102A43]/25"}`}>{selected && <Check className="h-3.5 w-3.5" />}</span></button>;
}

export default function Setup() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saved, setSaved] = useState(false);
  const [extensionConnected, setExtensionConnected] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("Install the extension, then choose Connect extension.");

  useEffect(() => {
    const stored = window.localStorage.getItem("under-progress-profile");
    if (stored) setProfile({ ...initialProfile, ...JSON.parse(stored) });
  }, []);

  useEffect(() => {
    const receiveExtensionMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window) return;
      const message = event.data;
      if (!message || message.source !== "under-progress-extension") return;
      if (message.type === "connection-status") {
        setExtensionConnected(true);
        setConnectionMessage("Extension connected. Preferences stay on this browser and sync when you choose to save.");
      }
      if (message.type === "extension-profile" && message.settings) {
        setExtensionConnected(true);
        setProfile(current => {
          const next = extensionToProfile(message.settings as ExtensionSettings, current);
          window.localStorage.setItem("under-progress-profile", JSON.stringify(next));
          return next;
        });
        setConnectionMessage("Extension settings imported into this local profile.");
      }
    };
    const requestProfile = () => window.postMessage({ source: "under-progress-website", type: "request-profile" }, window.location.origin);
    window.addEventListener("message", receiveExtensionMessage);
    requestProfile();
    const retry = window.setTimeout(requestProfile, 500);
    return () => { window.clearTimeout(retry); window.removeEventListener("message", receiveExtensionMessage); };
  }, []);

  const textClass = profile.textSize === "Large" ? "text-[19px]" : profile.textSize === "Compact" ? "text-[14px]" : "text-[16px]";
  const leadingClass = profile.spacing === "Relaxed" ? "leading-8" : profile.spacing === "Tight" ? "leading-5" : "leading-7";
  const completedCount = useMemo(() => Number(profile.needs.length > 0) + Number(profile.textSize !== "Comfortable") + Number(profile.spacing !== "Balanced") + Number(profile.contrast) + Number(profile.focus), [profile]);
  const publishToExtension = (nextProfile = profile) => window.postMessage({ source: "under-progress-website", type: "save-profile", settings: profileToExtension(nextProfile) }, window.location.origin);
  const requestExtension = () => {
    setConnectionMessage("Looking for the Under Progress extension in this browser…");
    window.postMessage({ source: "under-progress-website", type: "request-profile" }, window.location.origin);
    window.setTimeout(() => setConnectionMessage(current => current.startsWith("Looking") ? "Extension not detected yet. Install or reload the extension, then try again." : current), 1200);
  };
  const save = () => {
    window.localStorage.setItem("under-progress-profile", JSON.stringify(profile));
    publishToExtension();
    setSaved(true);
    setConnectionMessage(extensionConnected ? "Profile saved locally and sent to your connected extension." : "Profile saved locally. Connect the extension to use these display settings on other websites.");
    window.setTimeout(() => setSaved(false), 3000);
  };
  const reset = () => { setProfile(initialProfile); window.localStorage.removeItem("under-progress-profile"); publishToExtension(initialProfile); setConnectionMessage(extensionConnected ? "Local profile and connected extension reset to their default controls." : "Local profile reset."); };
  const toggleNeed = (need: string) => setProfile(p => ({ ...p, needs: p.needs.includes(need) ? p.needs.filter(item => item !== need) : [...p.needs, need] }));

  return <main className="min-h-screen bg-[#FBF8F0] text-[#102A43]"><header className="border-b border-[#102A43]/10 bg-[#FBF8F0]/90 backdrop-blur"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-3"><img src={logoAsset} alt="Under Progress mark" className="h-10 w-10" /><span className="font-serif text-xl font-semibold tracking-[-0.045em]">Under Progress</span></Link><button onClick={() => setLocation("/")} className="inline-flex items-center gap-2 text-sm font-bold text-[#486581] hover:text-[#0F8B7B]"><ArrowLeft className="h-4 w-4" />Back to site</button></div></header>
    <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12 lg:py-16"><aside className="lg:sticky lg:top-28 lg:self-start"><div className="field-label mb-5">Your local profile</div><h1 className="display-title max-w-[9ch] text-5xl leading-[0.94]">Choose what helps today.</h1><p className="mt-6 max-w-[34ch] text-sm leading-7 text-[#486581]">This profile stays in your browser. You can update, reset, or change every choice later.</p><div className="mt-9 rounded-2xl border border-[#102A43]/12 bg-[#F0E9D9] p-5"><div className="flex items-center justify-between"><span className="field-label">Tools adjusted</span><span className="font-mono text-2xl text-[#0F8B7B]">{String(completedCount).padStart(2, "0")}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80"><div className="h-full rounded-full bg-[#0F8B7B] transition-all" style={{ width: `${Math.min((completedCount / 5) * 100, 100)}%` }} /></div><p className="mt-4 text-xs leading-5 text-[#486581]">You do not need to complete every option to use the extension.</p></div></aside>
      <div className="space-y-8"><section className="paper-panel rounded-[26px] p-6 sm:p-8"><div className="mb-6 flex items-start gap-4"><span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#D9F3ED] font-mono text-sm text-[#0F8B7B]">01</span><div><h2 className="text-xl font-bold tracking-[-0.03em]">Start with your support needs</h2><p className="mt-1 text-sm leading-6 text-[#486581]">Select any that describe what you want support with—or choose tools directly below.</p></div></div><div className="grid gap-3 sm:grid-cols-2">{supportNeeds.map(need => <Choice key={need} selected={profile.needs.includes(need)} onClick={() => toggleNeed(need)}>{need}</Choice>)}</div></section>
        <section className="paper-panel rounded-[26px] p-6 sm:p-8"><div className="mb-7 flex items-start gap-4"><span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#FCE9B7] font-mono text-sm text-[#9B6600]">02</span><div><h2 className="text-xl font-bold tracking-[-0.03em]">Tune your reading surface</h2><p className="mt-1 text-sm leading-6 text-[#486581]">Pick the settings that make a page more comfortable to read and stay with.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><div><div className="mb-3 flex items-center gap-2 text-sm font-bold"><Type className="h-4 w-4 text-[#0F8B7B]" />Text size</div><div className="flex gap-2">{(["Compact", "Comfortable", "Large"] as const).map(value => <button key={value} type="button" onClick={() => setProfile(p => ({ ...p, textSize: value }))} className={`rounded-full px-4 py-2 text-xs font-bold ${profile.textSize === value ? "bg-[#102A43] text-white" : "border border-[#102A43]/15 bg-white text-[#486581]"}`}>{value}</button>)}</div></div><div><div className="mb-3 flex items-center gap-2 text-sm font-bold"><ChevronRight className="h-4 w-4 text-[#0F8B7B]" />Line spacing</div><div className="flex gap-2">{(["Tight", "Balanced", "Relaxed"] as const).map(value => <button key={value} type="button" onClick={() => setProfile(p => ({ ...p, spacing: value }))} className={`rounded-full px-4 py-2 text-xs font-bold ${profile.spacing === value ? "bg-[#102A43] text-white" : "border border-[#102A43]/15 bg-white text-[#486581]"}`}>{value}</button>)}</div></div><button type="button" onClick={() => setProfile(p => ({ ...p, contrast: !p.contrast }))} className={`flex items-center justify-between rounded-2xl border p-4 text-left ${profile.contrast ? "border-[#0F8B7B] bg-[#D9F3ED]" : "border-[#102A43]/15 bg-white/60"}`}><span><span className="mb-1 flex items-center gap-2 text-sm font-bold"><Contrast className="h-4 w-4 text-[#0F8B7B]" />High contrast</span><span className="block text-xs leading-5 text-[#486581]">Increase the difference between foreground and background.</span></span><span className={`h-6 w-11 rounded-full p-1 ${profile.contrast ? "bg-[#0F8B7B]" : "bg-[#C9D2D9]"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${profile.contrast ? "translate-x-5" : ""}`} /></span></button><button type="button" onClick={() => setProfile(p => ({ ...p, focus: !p.focus }))} className={`flex items-center justify-between rounded-2xl border p-4 text-left ${profile.focus ? "border-[#0F8B7B] bg-[#D9F3ED]" : "border-[#102A43]/15 bg-white/60"}`}><span><span className="mb-1 flex items-center gap-2 text-sm font-bold"><Focus className="h-4 w-4 text-[#0F8B7B]" />Focus support</span><span className="block text-xs leading-5 text-[#486581]">Make the active reading area easier to find.</span></span><span className={`h-6 w-11 rounded-full p-1 ${profile.focus ? "bg-[#0F8B7B]" : "bg-[#C9D2D9]"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${profile.focus ? "translate-x-5" : ""}`} /></span></button></div></section>
        <section className="paper-panel rounded-[26px] p-6 sm:p-8"><div className="mb-6 flex items-start gap-4"><span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#FCE9B7] font-mono text-sm text-[#9B6600]">03</span><div><h2 className="text-xl font-bold tracking-[-0.03em]">Connect your extension</h2><p className="mt-1 text-sm leading-6 text-[#486581]">With the Under Progress extension installed, your reading controls can move between this profile and the pages you visit in this browser.</p></div></div><div className={`rounded-2xl border p-4 ${extensionConnected ? "border-[#0F8B7B]/40 bg-[#D9F3ED]/50" : "border-[#102A43]/12 bg-[#FBF8F0]"}`}><div className="flex gap-3"><PlugZap className={`mt-0.5 h-5 w-5 flex-none ${extensionConnected ? "text-[#0F8B7B]" : "text-[#486581]"}`} /><p className="text-sm leading-6 text-[#486581]">{connectionMessage}</p></div></div><button onClick={requestExtension} className="mt-5 rounded-full border border-[#102A43]/20 bg-white px-5 py-3 text-sm font-bold text-[#102A43] transition-transform hover:-translate-y-0.5 active:scale-[0.97]">{extensionConnected ? "Refresh extension connection" : "Connect extension"}</button></section>
        <section className={`rounded-[26px] border p-6 shadow-[0_16px_44px_rgba(16,42,67,0.09)] sm:p-8 ${profile.contrast ? "border-[#102A43] bg-[#102A43] text-white" : "border-[#102A43]/15 bg-white"}`}><div className="mb-5 flex items-center justify-between"><div><div className="field-label mb-2">Live reading preview</div><h2 className={`text-xl font-bold tracking-[-0.03em] ${profile.contrast ? "text-white" : ""}`}>See what your choices change</h2></div><span className="rounded-full bg-[#F3B945] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#102A43]">Preview</span></div><div className={`relative max-w-[45ch] rounded-2xl border p-5 ${profile.contrast ? "border-white/20 bg-white/5" : "border-[#102A43]/10 bg-[#FBF8F0]"}`}>{profile.focus && <span className="absolute inset-x-3 top-3 h-28 rounded-xl border-2 border-[#0F8B7B] bg-[#D9F3ED]/20" />}<div className="relative"><div className="mb-3 h-3 w-20 rounded-full bg-[#0F8B7B]" /><h3 className={`mb-4 text-2xl font-bold tracking-[-0.04em] ${profile.contrast ? "text-white" : ""}`}>A clearer way through a page.</h3><p className={`${textClass} ${leadingClass} ${profile.contrast ? "text-white/80" : "text-[#486581]"}`}>Under Progress is designed to give you visible, reversible choices. Start with what feels useful now, and refine it when your needs change.</p></div></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={save} className="rounded-full bg-[#0F8B7B] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97]">{saved ? "Profile saved" : "Save profile"} <Check className="ml-1 inline h-4 w-4" /></button><button onClick={() => { publishToExtension(); setConnectionMessage(extensionConnected ? "Current profile sent to the extension." : "Connect the extension first, then send this profile."); }} className={`rounded-full border px-5 py-3 text-sm font-bold ${profile.contrast ? "border-white/25 text-white" : "border-[#102A43]/20 text-[#102A43]"}`}><Send className="mr-1 inline h-4 w-4" />Send to extension</button><button onClick={reset} className={`rounded-full border px-5 py-3 text-sm font-bold ${profile.contrast ? "border-white/25 text-white" : "border-[#102A43]/20 text-[#102A43]"}`}><RotateCcw className="mr-1 inline h-4 w-4" />Reset</button></div></section></div>
    </section></main>;
}
