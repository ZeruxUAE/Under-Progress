import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("under-progress-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("under-progress-theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggleTheme: () => setDark((current) => !current) };
}
