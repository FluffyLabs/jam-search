import { Route, Routes } from "react-router";
import "./App.css";
import { AppsSidebar } from "./packages/ui-kit/AppsSidebar";
import { Header } from "./components/Header";
import { IndexPage } from "./pages";
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
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex h-full grow">
          <AppsSidebar />

          <div className="w-full bg-background p-4 ">
            <Routes>
              <Route index element={<IndexPage />} />
            </Routes>
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
