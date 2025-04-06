import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@krystian5011/shared-ui/style.css";

import App from "./App.tsx";
import { HashRouter } from "react-router";
import { isDarkMode, setColorMode } from "@krystian5011/shared-ui";

setColorMode(isDarkMode());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
