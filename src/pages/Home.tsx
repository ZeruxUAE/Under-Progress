/**
 * Under Progress — Adaptive Field Notes
 * Editorial landing page with tangible “reading lens” demonstrations and user-controlled preference entry points.
 */
import { ArrowRight, Check, CircleHelp, Eye, Focus, Headphones, Menu, MoveRight, PanelTop, Sparkles, Type, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const heroAsset = "/assets/under-progress-hero.png";
const profileAsset = "/assets/under-progress-profile.png";
const extensionAsset = "/assets/under-progress-extension.png";
const logoAsset = "/assets/under-progress-logo.png";

type Profile = {
  needs: string[];
  textSize: string;
  spacing: string;
  contrast: boolean;
  focus: boolean;
};

const defaultProfile: Profile = { needs: [], textSize: "Comfortable", spacing: "Relaxed", contrast: false, focus: false };

function BrandMark() {
  return <div className="flex items-center gap-3"><img src={logoAsset} alt="Under Progress mark" className="h-11 w-11 object-contain" /><span className="font-serif text-[1.43rem] font-semibold tracking-[-0.05em] text-[#102A43]">Under Progress</span></div>;
}

function PreferencePreview({ profile }: { profile: Profile }) {
  const fontSize = profile.textSize === "Large" ? "text-[19px]" : profile.textSize === "Compact" ? "text-[14px]" : "text-[16px]";
  const leading = profile.spacing === "Relaxed" ? "leading-8" : profile.spacing === "Tight" ? "leading-5" : "leading-7";
  return (
    <div className={`relative overflow-hidden rounded-[26px] border border-[#102A43]/15 bg-[#FBF8F0] p-6 shadow-[0_18px_42px_rgba(16,42,67,0.13)] transition-colors ${profile.contrast ? "bg-[#102A43] text-white" : ""}`}>
      <div className="mb-6 flex items-center justify-between border-b border-current/15 pb-4"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#E97C6C]" /><span className="h-2.5 w-2.5 rounded-full bg-[#F3B945]" /><span className="h-2.5 w-2.5 rounded-full bg-[#0F8B7B]" /></div><span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-65">Page preview</span></div>
      {profile.focus && <div className="absolute inset-x-5 top-[72px] h-32 rounded-[22px] border-2 border-[#0F8B7B] bg-[#D9F3ED]/30" />}
      <div className="relative">
        <div className="mb-3 h-3 w-24 rounded-full bg-[#0F8B7B]" />
        <div className="mb-4 h-7 w-[82%] rounded-md bg-current/90" />
        <p className={`${fontSize} ${leading} max-w-[32ch] font-medium ${profile.contrast ? "text-white/85" : "text-[#486581]"}`}>A website can be easier to meet when you have a clearer way to read, focus, and move through what matters.</p>
        <div className="mt-5 flex gap-2"><span className="rounded-full bg-[#F3B945] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#102A43]">Read</span><span className="rounded-full bg-[#D9F3ED] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#102A43]">Focus</span></div>
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <div className="relative grid grid-cols-[46px_1fr] gap-5 border-t border-[#102A43]/15 py-6"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D9F3ED] font-mono text-xs font-medium text-[#0F8B7B]">{number}</div><div><h3 className="mb-2 text-lg font-bold tracking-[-0.03em] text-[#102A43]">{title}</h3><p className="max-w-[38ch] text-sm leading-6 text-[#486581]">{children}</p></div></div>;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    const saved = window.localStorage.getItem("under-progress-profile");
    if (saved) setProfile({ ...defaultProfile, ...JSON.parse(saved) });
  }, []);

  const startSetup = () => setLocation("/setup");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="overflow-x-hidden bg-[#FBF8F0] text-[#102A43]">
      <header className="sticky top-0 z-40 border-b border-[#102A43]/10 bg-[#FBF8F0]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12"><BrandMark /><nav className="hidden items-center gap-7 text-sm font-semibold text-[#486581] lg:flex"><button onClick={() => scrollTo("how-it-works")} className="hover:text-[#0F8B7B]">How it works</button><button onClick={() => scrollTo("extension")} className="hover:text-[#0F8B7B]">Extension</button><button onClick={() => scrollTo("principles")} className="hover:text-[#0F8B7B]">Our principles</button></nav><div className="hidden lg:block"><button onClick={startSetup} className="rounded-full bg-[#102A43] px-5 py-2.5 text-sm font-bold text-white transition-transform active:scale-[0.97]">Choose your tools <ArrowRight className="ml-1 inline h-4 w-4" /></button></div><button aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-[#102A43]/15 p-2 lg:hidden">{menuOpen ? <X /> : <Menu />}</button></div>
        {menuOpen && <div className="border-t border-[#102A43]/10 bg-[#FBF8F0] px-5 py-5 lg:hidden"><div className="flex flex-col gap-4 text-sm font-bold"><button onClick={() => { scrollTo("how-it-works"); setMenuOpen(false); }} className="text-left">How it works</button><button onClick={() => { scrollTo("extension"); setMenuOpen(false); }} className="text-left">Extension</button><button onClick={startSetup} className="rounded-full bg-[#102A43] px-5 py-3 text-white">Choose your tools</button></div></div>}
      </header>

      <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:pb-28 lg:pt-20">
        <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-[#D9F3ED] blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center"><div className="field-label mb-7 flex items-center gap-2"><span className="h-2 w-2 bg-[#F3B945]" />Personal accessibility companion</div><h1 className="display-title max-w-[10ch] text-[3.4rem] leading-[0.92] sm:text-[4.7rem] lg:text-[5.65rem]">Make the web easier to meet.</h1><p className="mt-8 max-w-[49ch] text-base leading-7 text-[#486581] sm:text-lg">Under Progress helps you choose the reading, focus, and navigation tools that make a website work better for you—without asking you to fit one “default” way of using the web.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={startSetup} className="rounded-full bg-[#0F8B7B] px-6 py-3.5 text-sm font-bold text-white shadow-[0_11px_20px_rgba(15,139,123,0.22)] transition-transform hover:-translate-y-0.5 active:scale-[0.97]">Set up your preferences <MoveRight className="ml-1 inline h-4 w-4" /></button><button onClick={() => scrollTo("preview")} className="pill-control px-6 py-3.5 text-sm font-bold text-[#102A43]">See an example</button></div><p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#486581]">No diagnosis required · You can change your choices anytime</p></div>
        <div className="relative flex min-h-[400px] items-center justify-center lg:min-h-[540px]"><div className="absolute inset-4 rounded-[42px] bg-[#F0E9D9] dot-grid" /><div className="absolute left-[13%] top-[11%] z-20 h-28 w-28 rounded-full border-2 border-[#0F8B7B] bg-[#D9F3ED]/80 shadow-[inset_0_0_0_12px_rgba(255,255,255,0.35)]" /><img src={heroAsset} alt="A person using a laptop with a web page adapting to their reading preferences" className="relative z-10 w-full max-w-[700px] rounded-[34px] object-cover shadow-[0_28px_72px_rgba(16,42,67,0.19)]" /><div className="absolute bottom-2 right-[7%] z-20 rounded-2xl border border-[#102A43]/10 bg-[#FBF8F0] px-4 py-3 shadow-lg"><div className="field-label mb-1">Under progress tools</div><div className="flex gap-2 text-xs font-bold"><span className="rounded-full bg-[#D9F3ED] px-2.5 py-1 text-[#0F8B7B]">Read</span><span className="rounded-full bg-[#FCE9B7] px-2.5 py-1">Focus</span></div></div></div>
      </section>

      <section id="preview" className="border-y border-[#102A43]/10 bg-[#F0E9D9] py-16 sm:py-20"><div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-12"><div><div className="field-label mb-5">A preference-led preview</div><h2 className="display-title max-w-[13ch] text-4xl leading-[0.98] sm:text-5xl">One page. More than one way to read it.</h2><p className="mt-6 max-w-[46ch] text-base leading-7 text-[#486581]">Your choices can make the same content feel calmer, clearer, and more comfortable. This demo uses your saved setup choices when you create a profile.</p><div className="mt-8 space-y-3"><div className="flex items-center gap-3 text-sm font-semibold"><Check className="h-5 w-5 text-[#0F8B7B]" />Text size and spacing that fit today</div><div className="flex items-center gap-3 text-sm font-semibold"><Check className="h-5 w-5 text-[#0F8B7B]" />Focus support that keeps the task visible</div><div className="flex items-center gap-3 text-sm font-semibold"><Check className="h-5 w-5 text-[#0F8B7B]" />A clear way to reset and revise choices</div></div></div><PreferencePreview profile={profile} /></div></section>

      <section id="how-it-works" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"><div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]"><div><div className="field-label mb-5">How it works</div><h2 className="display-title max-w-[8ch] text-5xl leading-[0.96]">Your preferences travel with you.</h2><p className="mt-6 max-w-[31ch] text-base leading-7 text-[#486581]">Set up a personal profile once. Then use the extension to make the websites you visit easier to use.</p><img src={profileAsset} alt="An abstract browser page and extension panel connected by accessibility preference markers" className="mt-10 w-full max-w-[430px] rounded-[28px] shadow-[0_20px_50px_rgba(16,42,67,0.13)]" /></div><div className="grid gap-x-10 lg:grid-cols-2"><div><Step number="01" title="Choose what helps">Select more than one support need or simply choose the tools you want to use. There is no single “accessibility mode.”</Step><Step number="02" title="Preview your changes">See text, spacing, contrast, and focus choices in a clear, reversible preview.</Step></div><div className="lg:pt-16"><Step number="03" title="Use the extension">The companion extension gives you these controls while you browse websites.</Step><Step number="04" title="Refine as you go">Needs can change. Every setting can be updated or switched off in seconds.</Step></div></div></div></section>

      <section id="extension" className="bg-[#102A43] py-20 text-white sm:py-28"><div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12"><div><div className="field-label mb-5 !text-[#F3B945]">Chrome + Edge extension</div><h2 className="display-title max-w-[13ch] text-5xl leading-[0.98] !text-white">Small controls. A real difference in how a page feels.</h2><p className="mt-6 max-w-[52ch] text-base leading-7 text-white/70">The first extension MVP gives you direct, reversible controls for readable text, comfortable spacing, wider contrast, reading width, a focus mode, and optional text-to-speech.</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/15 bg-white/5 p-4"><Type className="mb-5 h-6 w-6 text-[#F3B945]" /><p className="text-sm font-bold">Read</p><p className="mt-1 text-xs leading-5 text-white/60">Scale and space text.</p></div><div className="rounded-2xl border border-white/15 bg-white/5 p-4"><Focus className="mb-5 h-6 w-6 text-[#F3B945]" /><p className="text-sm font-bold">Focus</p><p className="mt-1 text-xs leading-5 text-white/60">Dim distractions.</p></div><div className="rounded-2xl border border-white/15 bg-white/5 p-4"><Headphones className="mb-5 h-6 w-6 text-[#F3B945]" /><p className="text-sm font-bold">Listen</p><p className="mt-1 text-xs leading-5 text-white/60">Read selected text aloud.</p></div></div><button onClick={() => document.getElementById("extension-guide")?.scrollIntoView({ behavior: "smooth" })} className="mt-8 rounded-full bg-[#F3B945] px-6 py-3.5 text-sm font-bold text-[#102A43] transition-transform hover:-translate-y-0.5 active:scale-[0.97]">Get the extension source <ArrowRight className="ml-1 inline h-4 w-4" /></button></div><div className="relative"><div className="absolute -right-8 top-8 h-36 w-36 rounded-full bg-[#0F8B7B]/35 blur-3xl" /><img src={extensionAsset} alt="An abstract webpage changing from cluttered to readable through a teal focus lens" className="relative w-full rounded-[30px] border border-white/10 shadow-[0_26px_70px_rgba(0,0,0,0.33)]" /></div></div></section>

      <section id="principles" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"><div className="max-w-[720px]"><div className="field-label mb-5">What we build around</div><h2 className="display-title text-5xl leading-[0.96]">Support should feel like choice, not a compromise.</h2></div><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4"><div className="border-t-4 border-[#0F8B7B] pt-5"><Eye className="mb-6 h-7 w-7 text-[#0F8B7B]" /><h3 className="text-lg font-bold">Understandable</h3><p className="mt-2 text-sm leading-6 text-[#486581]">Make information easier to follow, without taking away the original page.</p></div><div className="border-t-4 border-[#F3B945] pt-5"><CircleHelp className="mb-6 h-7 w-7 text-[#B97800]" /><h3 className="text-lg font-bold">User-led</h3><p className="mt-2 text-sm leading-6 text-[#486581]">The user chooses supports, decides when to use them, and can reset them anytime.</p></div><div className="border-t-4 border-[#E97C6C] pt-5"><PanelTop className="mb-6 h-7 w-7 text-[#C65E50]" /><h3 className="text-lg font-bold">Adaptable</h3><p className="mt-2 text-sm leading-6 text-[#486581]">Different days and different tasks can need different reading environments.</p></div><div className="border-t-4 border-[#102A43] pt-5"><Sparkles className="mb-6 h-7 w-7 text-[#102A43]" /><h3 className="text-lg font-bold">Evidence-informed</h3><p className="mt-2 text-sm leading-6 text-[#486581]">The product starts with WCAG principles and improves through inclusive testing.</p></div></div></section>

      <section id="extension-guide" className="mx-5 mb-8 rounded-[30px] bg-[#D9F3ED] px-6 py-12 sm:mx-8 sm:px-12 lg:mx-12 lg:px-16"><div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"><div><div className="field-label mb-5">Extension installation</div><h2 className="display-title max-w-[16ch] text-4xl leading-[0.98]">Load the Under Progress extension from the project source.</h2><p className="mt-5 max-w-[55ch] text-sm leading-6 text-[#486581]">The browser extension source is included in this project’s <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">extension/</code> folder. In Chrome or Edge, open the extensions page, turn on Developer mode, choose “Load unpacked,” and select that folder.</p></div><Link href="/setup" className="rounded-full bg-[#102A43] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97]">Create a local profile</Link></div></section>

      <footer className="border-t border-[#102A43]/10 px-5 py-9 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 text-sm text-[#486581] sm:flex-row"><div className="flex items-center gap-3"><img src={logoAsset} alt="" className="h-7 w-7" /><span>Under Progress · An early accessibility concept</span></div><span>Built around user agency and WCAG-aligned principles.</span></div></footer>
    </main>
  );
}
