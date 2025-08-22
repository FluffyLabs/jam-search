import { scan } from "react-scan"; // must be imported before React and React DOM
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fluffylabs/shared-ui/style.css";
import "./index.css";

scan({
  enabled: process.env.NODE_ENV !== "production",
});

import App from "./App.tsx";
import { HashRouter } from "react-router";
import {EmbeddedViewerProvider} from "./providers/EmbeddedResultsContext.tsx";

document.documentElement.classList.toggle("dark", true);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <EmbeddedViewerProvider>
        <App />
      </EmbeddedViewerProvider>
    </HashRouter>
  </StrictMode>
);
