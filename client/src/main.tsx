import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { scan } from "react-scan"; // must be imported before React and React DOM
import "@fluffylabs/shared-ui/style.css";
import "./index.css";

scan({
  enabled: process.env.NODE_ENV !== "production",
});

import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import { EmbeddedViewerProvider } from "./providers/EmbeddedResultsContext.tsx";

document.documentElement.classList.toggle("dark", true);

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
