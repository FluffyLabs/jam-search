import * as matrix from "@shared/matrix";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/Container";
import { Paging } from "@/components/Paging";
import { MatrixResultList } from "@/components/results/MatrixResultList";
import { ResultHeader } from "@/components/results/ResultHeader";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEmbedding } from "@/hooks/useEmbedding";
import { useSearchMatrix } from "@/hooks/useSearchMatrix";
import { SearchMode } from "@/lib/mode";
import { parseSearchQuery } from "@/lib/utils";

const MatrixResultsAll = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const richQuery = searchParams.get("q") || "";
  const searchMode = searchParams.get("searchMode") || SearchMode.Regular;
  const channelId = searchParams.get("channelId") || matrix.ROOMS[0].id;
  useDocumentTitle(richQuery || null);
  // Find the channel name based on the channelId
  const channel =
    matrix.ROOMS.find((ch) => ch.id === channelId) || matrix.ROOMS[0];

  const topRef = useRef(null);
  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);
  const embedding = useEmbedding(query, searchMode !== SearchMode.Regular).data;

  // Use our search hook with the extracted query and filters
  const queryResult = useSearchMatrix({
    query,
    embedding,
    channelId,
    pageSize: 20,
    filters,
  });

  const backParams = new URLSearchParams(location.search);
  backParams.delete("channelId");

  const pages = <Paging queryResult={queryResult} scrollTo={topRef} />;

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl text-card-foreground">
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
        showSearchOptions
      />

      <Container>
        <h1 className="text-md font-medium text-foreground mb-2">{query}</h1>

        {/* Display active filters as tags */}
        {query && filters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.map((filter) => (
                <div
                  key={`${filter.key}-${filter.value}`}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
                >
                  <span className="font-semibold mr-1">{filter.key}:</span>
                  <span>{filter.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <span className="text-muted-foreground text-sm font-light">
          Found {queryResult.totalResults.toLocaleString()} matches in{" "}
          <span className="text-foreground">{channel.name} @ Matrix</span>
        </span>

        <div className="my-8">
          <MatrixResultList
            channel={channel}
            queryResult={queryResult}
            searchQuery={query}
          />

          {pages}
        </div>
      </Container>
    </div>
  );
};

export default MatrixResultsAll;
