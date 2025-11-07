import { Container } from "@/components/Container";
import { Paging } from "@/components/Paging";
import { PageResultList } from "@/components/results/PageResultList";
import { ResultHeader } from "@/components/results/ResultHeader";
import { Button } from "@/components/ui/button";
import { useSearchPages } from "@/hooks/useSearchPages";
import { type SearchMode, parseSearchQuery } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

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
      <div ref={topRef} />
      <ResultHeader
        left={
          <Button
            variant="ghost"
            size="icon"
            className="mt-0 w-auto h-8"
            asChild
          >
            <Link to={`/results?${backParams.toString()}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline mx-2 text-xs">All sources</span>
            </Link>
          </Button>
        }
      />

      <Container>
        <h1 className="text-md font-medium text-white mb-2">{query}</h1>
        <span className="text-muted-foreground text-sm font-light">
          Found {queryResult.totalResults.toLocaleString()} matches at{" "}
          <span className="text-white">{site}</span>
        </span>

        <div className="my-8">
          <PageResultList
            queryResult={queryResult}
            searchQuery={query}
            searchMode={searchMode as SearchMode}
          />

          <Paging queryResult={queryResult} scrollTo={topRef} />
        </div>
      </Container>
    </div>
  );
};

export default PagesResultsAll;
