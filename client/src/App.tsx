import { Route, Routes } from "react-router";
import "./App.css";
import { AppsSidebar } from "@krystian5011/shared-ui";
import { Header } from "./components/Header";
import { IndexPage } from "./pages";
import SearchResults from "./pages/results";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col overflow-hidden h-[100dvh]">
        <Header />
        <div className="flex h-full">
          <div className="max-sm:hidden">
            <AppsSidebar activeLink="website" className="h-full" />
          </div>

          <div className="w-full bg-background p-4 h-[calc(100dvh-77px)] sm:h-[calc(100dvh-87px)] overflow-y-auto">
            <Routes>
              <Route index element={<IndexPage />} />
              <Route path="/results" element={<SearchResults />} />
            </Routes>
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
