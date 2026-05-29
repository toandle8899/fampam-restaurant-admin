import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Catch Vite dynamic import failures and force a hard reload
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

window.addEventListener('error', (e) => {
  if (e.message?.includes('Failed to fetch dynamically imported module')) {
    window.location.reload();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
