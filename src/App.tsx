import { Route, Switch } from "wouter";
import { LanguagePrompt } from "./components/LanguagePrompt";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import { LanguageProvider, useLanguage } from "./lib/i18n";

function NotFound() {
  const { t } = useLanguage();
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><div><p style={{ fontFamily: "ui-monospace, monospace", color: "#0F8B7B", fontSize: 12 }}>404</p><h1 style={{ fontFamily: "Georgia, serif", fontSize: 44, margin: "8px 0" }}>{t("notFound")}</h1><a href="/" style={{ color: "#0F8B7B", fontWeight: 700 }}>{t("returnHome")}</a></div></main>;
}

function RoutedApp() {
  return <><Switch><Route path="/" component={Home} /><Route path="/setup" component={Setup} /><Route component={NotFound} /></Switch><LanguagePrompt /></>;
}

export default function App() { return <LanguageProvider><RoutedApp /></LanguageProvider>; }
