import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fluffylabs/shared-ui/style.css";
import "./index.css";

import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import { EmbeddedViewerProvider } from "./providers/EmbeddedResultsContext.tsx";

// Initialize dark mode from system preference (toggled via sidebar)
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
document.documentElement.classList.toggle("dark", darkModeQuery.matches);
darkModeQuery.addEventListener("change", (e) => {
  document.documentElement.classList.toggle("dark", e.matches);
});

const root = document.getElementById("root");
if (root === null) {
  throw new Error("Root not found!");
}
createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <EmbeddedViewerProvider>
        <App />
      </EmbeddedViewerProvider>
    </HashRouter>
  </StrictMode>
);
