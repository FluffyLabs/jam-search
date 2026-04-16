import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fluffylabs/shared-ui/style.css";
import "./index.css";

import { SupabaseProvider } from "@fluffylabs/shared-ui/supabase";
import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import { EmbeddedViewerProvider } from "./providers/EmbeddedResultsContext.tsx";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not configured. Auth features will be disabled."
  );
}

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
      <SupabaseProvider
        supabaseUrl={supabaseUrl}
        supabaseAnonKey={supabaseAnonKey}
        appId="jam-search"
      >
        <EmbeddedViewerProvider>
          <App />
        </EmbeddedViewerProvider>
      </SupabaseProvider>
    </HashRouter>
  </StrictMode>
);
