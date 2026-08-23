import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

const isLocalDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

if ("serviceWorker" in navigator && !isLocalDevelopment) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => undefined));
}
