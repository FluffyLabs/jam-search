import { Route, Routes } from "react-router";
import "./App.css";
import { AppsSidebar } from "./packages/ui-kit/AppsSidebar";
import { Header } from "./components/Header";
import { IndexPage } from "./pages";

function App() {
  return (
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
  );
}

export default App;
