import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { AppsSidebar } from "@fluffylabs/shared-ui";
import { AuthCallback, AuthFlow } from "@fluffylabs/shared-ui/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { EmbeddedViewer } from "./components/EmbeddedViewer";
import { Header } from "./components/Header";
import { cn } from "./lib/utils";
import { IndexPage } from "./pages";
import { AskPage } from "./pages/ask";
import SearchResults from "./pages/results";
import { SettingsPage } from "./pages/settings";
import DiscordResultsAll from "./pages/viewall/discord";
import GraypaperResultsAll from "./pages/viewall/graypaper";
import MatrixResultsAll from "./pages/viewall/matrix";
import PagesResultsAll from "./pages/viewall/pages";
import { useEmbeddedViewer } from "./providers/EmbeddedResultsContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AuthCallbackCatchAll({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) {
  const { pathname } = useLocation();
  const params = new URLSearchParams(pathname.replace(/^\//, ""));
  const hasError = params.has("error");
  const hasToken = params.has("access_token");

  if (hasError || hasToken) {
    return <AuthCallback onSuccess={onSuccess} onError={onError} />;
  }
  return <div className="p-4">Page not found.</div>;
}

function App() {
  const isUsingEmbeddedViewer = useEmbeddedViewer().isVisible;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // /ask manages its own scroll/padding so the section/aside border can
  // span the full available height.
  const fullBleed = pathname === "/ask";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col overflow-hidden h-[100dvh]">
        <div className="h-[87px]">
          <Header />
        </div>
        <div className="flex h-full">
          <div className="max-sm:hidden">
            <AppsSidebar
              activeLink="search"
              className="h-full"
              enableDarkModeToggle
            />
          </div>

          <div
            className={cn("w-full bg-background h-[calc(100dvh-77px)]", {
              relative: isUsingEmbeddedViewer,
            })}
          >
            <EmbeddedViewer />
            <div
              className={cn("h-full", fullBleed ? "" : "p-4 overflow-y-auto", {
                invisible: isUsingEmbeddedViewer,
              })}
            >
              <Routes>
                <Route index element={<IndexPage />} />
                <Route path="/results" element={<SearchResults />} />
                <Route
                  path="/results/graypaper"
                  element={<GraypaperResultsAll />}
                />
                <Route path="/results/matrix" element={<MatrixResultsAll />} />
                <Route path="/results/pages" element={<PagesResultsAll />} />
                <Route
                  path="/results/discord"
                  element={<DiscordResultsAll />}
                />
                <Route
                  path="/login"
                  element={
                    <AuthFlow
                      onSuccess={() => navigate("/")}
                      redirectTo={`${window.location.origin}${window.location.pathname}`}
                    />
                  }
                />
                <Route
                  path="/auth/callback"
                  element={
                    <AuthCallback
                      onSuccess={() => navigate("/")}
                      onError={() => navigate("/login")}
                    />
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/ask" element={<AskPage />} />
                <Route
                  path="*"
                  element={
                    <AuthCallbackCatchAll
                      onSuccess={() => navigate("/")}
                      onError={() => navigate("/login")}
                    />
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
