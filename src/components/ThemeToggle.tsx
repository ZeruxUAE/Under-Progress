import { Moon, Sun } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const { t } = useLanguage();
  return <button type="button" onClick={onToggle} aria-pressed={dark} className="theme-toggle" aria-label={dark ? t("useLight") : t("useDark")}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}<span>{dark ? t("light") : t("dark")}</span></button>;
}
