import { Container } from "@/components/Container";
import { Paging } from "@/components/Paging";
import { ViewEmbedded } from "@/components/ViewEmbedded";
import { ResultHeader } from "@/components/results/ResultHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchGraypaper } from "@/hooks/useSearchGraypaper";
import { getTextToDisplay } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const GraypaperResultsAll = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const topRef = useRef(null);

  const queryResult = useSearchGraypaper({
    query,
    pageSize: 20,
  });

  const { results, totalResults, isLoading, isError } = queryResult;

  const pages = <Paging queryResult={queryResult} scrollTo={topRef} />;

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <div ref={topRef} />
      <ResultHeader
        left={
          <Button
            variant="ghost"
            size="icon"
            className="mt-0 w-auto h-8"
            asChild
          >
            <Link to={`/results${location.search}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline mx-2 text-xs">All sources</span>
            </Link>
          </Button>
        }
      />

      <Container>
        <h1 className="text-md font-medium text-white mb-2">{query}</h1>
        <span className="text-muted-foreground text-sm font-light">
          Found {totalResults.toLocaleString()} matches in{" "}
          <span className="text-white">Gray Paper</span>
        </span>

        <div className="mt-8">
          <div className="flex flex-col gap-4">
            {isLoading && results.length === 0 ? (
              <>
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
              </>
            ) : isError ? (
              <div className="text-center p-8 text-destructive">
                Error loading graypaper results
              </div>
            ) : !results || results.length === 0 ? (
              <div className="text-center p-8">
                No graypaper results found for your search.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {results.map((section) => (
                    <SectionResult
                      key={section.text}
                      title={section.title}
                      text={section.text}
                      query={query}
                      url={`https://graypaper.fluffylabs.dev/#/?search=${query}&section=${section.title}`}
                    />
                  ))}
                </div>

                {pages}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

const SectionResult = ({
  text,
  title,
  query,
  url,
}: {
  text: string;
  title: string;
  query: string;
  url: string;
}) => {
  return (
    <Card className="relative bg-card border-border border-0 border-b rounded-none hover:bg-accent">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm text-white font-normal truncate">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-3 pt-0">
        <div className="text-sm font-light">
          {getTextToDisplay(text, query, 700)}
        </div>
        <div className="flex justify-end">
          <ViewEmbedded
            label="Open reader"
            url={url}
            results={[]}
            searchQuery={query}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GraypaperResultsAll;
