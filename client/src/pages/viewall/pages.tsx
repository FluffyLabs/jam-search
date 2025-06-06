import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PageResultList } from "@/components/results/PageResultList";
import { useSearchPages } from "@/hooks/useSearchPages";
import { parseSearchQuery, SearchMode } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import {ResultHeader} from "@/components/results/ResultHeader";
import {Paging} from "@/components/Paging";
import {useRef} from "react";

const PagesResultsAll = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const richQuery = searchParams.get("q") || "";
  const searchMode = searchParams.get("searchMode") || "strict";
  const site = searchParams.get("site") || undefined;

  const topRef = useRef(null);

  // Parse the query to extract filters
  const { query } = parseSearchQuery(richQuery);

  const queryResult = useSearchPages({
    query,
    pageSize: 20,
    searchMode,
    site,
  });

  const backParams = new URLSearchParams(location.search);
  backParams.delete("site");

  return (
    <div className="flex flex-col items-center w-full bg-card rounded-xl text-card-foreground">
      <div ref={topRef}></div>
      <ResultHeader 
        left={
          <Button variant="ghost" size="icon" className="mt-0 w-10 h-8" asChild>
            <Link to={`/results?${backParams.toString()}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="w-full max-w-4xl px-8">
        <h1 className="text-md font-medium text-white mb-2">{query}</h1>
        <span className="text-muted-foreground text-sm font-light">
          Found {queryResult.totalResults.toLocaleString()} matches at <span className="text-white">{site}</span>
        </span>

        <div className="my-8">
          <PageResultList
            queryResult={queryResult}
            searchQuery={query}
            searchMode={searchMode as SearchMode}
          />

          <Paging queryResult={queryResult} scrollTo={topRef} />
        </div>
      </div>
    </div>
  );
};

export default PagesResultsAll;
