import { ArrowRight, Target, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const IndexPage = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl w-full h-full bg-card text-foreground dark:text-white p-4 relative overflow-hidden">
      <div className="max-w-3xl w-full flex flex-col items-center mt-16 relative z-10">
        <h1 className="text-4xl font-bold mb-2 flex items-center">
          Search in{" "}
          <span className="bg-gradient-to-r from-[#0d7277] to-[#032c2f] px-3 py-1 ml-2 rounded">
            JAM knowledge base
          </span>
        </h1>

        <p className="text-center text-muted-foreground mb-8">
          Connecting you to the right answers from GrayPaper, JAM Chat, JAM0 and
          others sources
        </p>

        <div className="relative w-full mb-12 mt-4">
          <Input
            type="text"
            placeholder='Example : "How does the consensus mechanism work in JAM?"'
            className="pr-12 h-[58px]"
          />
          <Button
            variant="default"
            size="icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0 bg-brand h-10 w-10"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

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
            <h3 className="text-lg font-semibold mb-2">
              Code-driven efficiency
            </h3>
            <p className="text-muted-foreground text-sm">
              Debug and implement faster with AI-powered search.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent opacity-90"></div>
    </div>
  );
};
