import { Route, Routes } from "react-router";
import "./App.css";
import { AppsSidebar } from "@krystian5011/shared-ui";
import { Header } from "./components/Header";
import { IndexPage } from "./pages";
import SearchResults from "./pages/results";
import GraypaperResultsAll from "./pages/viewall/graypaper";
import MatrixResultsAll from "./pages/viewall/matrix";
import PagesResultsAll from "./pages/viewall/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {useEmbeddedViewer} from "./providers/EmbeddedResultsContext";
import {cn} from "./lib/utils";
import {EmbeddedViewer} from "./components/EmbeddedViewer";

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

function App() {
  const isUsingEmbeddedViewer = useEmbeddedViewer().isVisible;

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
              enableDarkModeToggle={false}
            />
          </div>

          <div className={cn(
            "w-full bg-background h-[calc(100dvh-77px)]",
            { 
              "relative": isUsingEmbeddedViewer,
            }
          )}>
            <EmbeddedViewer />
            <div className={cn("p-4 h-full overflow-y-auto", { invisible: isUsingEmbeddedViewer })}>
              <Routes>
                <Route index element={<IndexPage />} />
                <Route path="/results" element={<SearchResults />} />
                <Route path="/results/graypaper" element={<GraypaperResultsAll />} />
                <Route path="/results/matrix" element={<MatrixResultsAll />} />
                <Route path="/results/pages" element={<PagesResultsAll />} />
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
