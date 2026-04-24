import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { AppsSidebar } from "@fluffylabs/shared-ui";
import { AuthCallback, AuthFlow } from "@fluffylabs/shared-ui/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AskLayout } from "@/components/ask/AskLayout";
import { peekForkPending } from "@/lib/forkPending";
import { EmbeddedViewer } from "./components/EmbeddedViewer";
import { Header } from "./components/Header";
import { cn } from "./lib/utils";
import { IndexPage } from "./pages";
import { AskPage } from "./pages/ask";
import { AskSharedPage } from "./pages/askShared";
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

/** Resolves the post-auth destination:
 *  1. pending fork (if any) → the shared-view route to complete the fork
 *  2. `location.state.from` passed through by AuthGate
 *  3. fallback to `/`
 */
function usePostAuthRedirect(): () => string {
  const location = useLocation();
  return () => {
    const pending = peekForkPending();
    if (pending) return `/ask/s/${pending}`;
    const from = (location.state as { from?: string } | null)?.from;
    return from || "/";
  };
}

function LoginRoute() {
  const navigate = useNavigate();
  const resolve = usePostAuthRedirect();
  return (
    <AuthFlow
      onSuccess={() => navigate(resolve())}
      redirectTo={`${window.location.origin}${window.location.pathname}`}
    />
  );
}

function AuthCallbackRoute() {
  const navigate = useNavigate();
  const resolve = usePostAuthRedirect();
  return (
    <AuthCallback
      onSuccess={() => navigate(resolve())}
      onError={() => navigate("/login")}
    />
  );
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
            className={cn(
              "w-full bg-background h-[calc(100dvh-77px)] border-l-1 border-l-white dark:border-l-1 dark:border-l-[#353535]",
              {
                relative: isUsingEmbeddedViewer,
              }
            )}
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
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/auth/callback" element={<AuthCallbackRoute />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/ask" element={<AskLayout />}>
                  <Route index element={<AskPage />} />
                  <Route path=":sessionId" element={<AskPage />} />
                </Route>
                <Route path="/ask/s/:sessionId" element={<AskSharedPage />} />
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
