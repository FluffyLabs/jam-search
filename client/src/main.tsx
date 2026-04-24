import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fluffylabs/shared-ui/style.css";
import "./index.css";

import { SupabaseProvider } from "@fluffylabs/shared-ui/supabase";
import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import { EmbeddedViewerProvider } from "./providers/EmbeddedResultsContext.tsx";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

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

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl && "VITE_SUPABASE_URL",
    !supabaseAnonKey && "VITE_SUPABASE_ANON_KEY",
  ]
    .filter(Boolean)
    .join(", ");

  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:system-ui,-apple-system,sans-serif;background:#fff;color:#111;">
      <style>@media (prefers-color-scheme: dark){.cfg-err{background:#0a0a0a !important;color:#fafafa !important;}.cfg-err pre{background:#1a1a1a !important;color:#fafafa !important;}.cfg-err code{background:#1a1a1a !important;}}</style>
      <div class="cfg-err" style="max-width:640px;border:1px solid #e11d48;border-radius:8px;padding:1.5rem 2rem;background:#fff;color:#111;">
        <h1 style="margin:0 0 0.75rem;font-size:1.5rem;color:#e11d48;">Configuration error</h1>
        <p style="margin:0 0 1rem;line-height:1.5;">
          Missing required environment variable${missing.includes(",") ? "s" : ""}:
        </p>
        <pre style="margin:0 0 1rem;padding:0.75rem 1rem;background:#f5f5f5;border-radius:4px;overflow-x:auto;font-size:0.875rem;">${missing}</pre>
        <p style="margin:0;line-height:1.5;">
          Copy <code style="padding:0.1rem 0.35rem;background:#f5f5f5;border-radius:3px;font-size:0.875rem;">client/.env.example</code> to <code style="padding:0.1rem 0.35rem;background:#f5f5f5;border-radius:3px;font-size:0.875rem;">client/.env</code> and fill in your Supabase project URL and anon key, then restart the dev server.
        </p>
      </div>
    </div>
  `;
  throw new Error(`Missing required environment variables: ${missing}`);
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
