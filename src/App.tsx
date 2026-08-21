import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Setup from "./pages/Setup";

function NotFound() {
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><div><p style={{ fontFamily: "ui-monospace, monospace", color: "#0F8B7B", fontSize: 12 }}>404</p><h1 style={{ fontFamily: "Georgia, serif", fontSize: 44, margin: "8px 0" }}>This page is not here.</h1><a href="/" style={{ color: "#0F8B7B", fontWeight: 700 }}>Return to Under Progress</a></div></main>;
}

export default function App() {
  return <Switch><Route path="/" component={Home} /><Route path="/setup" component={Setup} /><Route component={NotFound} /></Switch>;
}
