import { Target, Sparkles, Star } from "lucide-react";
import { SearchForm } from "@/components/SearchForm";

const Header = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 flex items-center flex-col sm:flex-row">
        Search in{" "}
        <span className="bg-gradient-to-r from-[#0d7277] to-[#032c2f] px-3 py-1 ml-2 rounded">
          JAM knowledge base
        </span>
      </h1>

      <p className="text-center text-muted-foreground mb-8">
        Connecting you to the right answers from Gray Paper, JAM Chat, JAM0 and
        others sources
      </p>
    </>
  );
};
const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 bg-card p-3 rounded-md">
          <Star className="h-6 w-6 text-brand" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Clear and precise</h3>
        <p className="text-muted-foreground text-sm">
          Get direct code references and docs without endless searching.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 bg-card p-3 rounded-md">
          <Target className="h-6 w-6 text-brand" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Targeted solutions</h3>
        <p className="text-muted-foreground text-sm">
          Relevant answers based on your query and context.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 bg-card p-3 rounded-md">
          <Sparkles className="h-6 w-6 text-brand" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Code-driven efficiency</h3>
        <p className="text-muted-foreground text-sm">
          Debug and implement faster with AI-powered search.
        </p>
      </div>
    </div>
  );
};

export const IndexPage = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl w-full bg-card text-foreground dark:text-white p-4 relative overflow-hidden min-h-full">
      <div className="max-w-3xl w-full flex flex-col items-center mt-16 relative z-10">
        <Header />

        <SearchForm
          redirectToResults
          instantSearch={false}
          showSearchOptions={false}
        />

        <Features />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent opacity-90"></div>
    </div>
  );
};
