import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return <button type="button" onClick={onToggle} aria-pressed={dark} className="theme-toggle" aria-label={dark ? "Use light mode" : "Use dark mode"}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}<span>{dark ? "Light" : "Dark"}</span></button>;
}
