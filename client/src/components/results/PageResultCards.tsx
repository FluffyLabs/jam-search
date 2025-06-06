import { formatDate, SearchMode } from "@/lib/utils";
import { ViewEmbedded } from "../ViewEmbedded";
import {PageResultHighlighter} from "../PageResultHighlighter";
import {NoResults} from "./NoResults";
import {useResults} from "@/hooks/useResults";
import {ResultCard} from "./ResultCard";

interface PageResultCardsProps {
  queryResult: ReturnType<typeof useResults>['jamchain'],
  searchQuery: string;
  searchMode?: SearchMode;
}

export const PageResultCards = ({
  queryResult,
  searchQuery,
  searchMode = "strict",
}: PageResultCardsProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return (
      <NoResults isError={isError} />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isLoading && queryResult.results.length === 0 ? (<>
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
      </>): null}
      {results.map((result) => {
        const isGithub = result.site.includes("github");
        const githubNumber = result.url.split('/').pop();
        const githubId = (isGithub && githubNumber) ? `#${githubNumber}` : '';

        return (
          <ResultCard
            lightBorder
            key={result.id}
            header={<>
              {githubId} {result.title}
              <span className="text-xs text-muted-foreground ml-2">
                {isGithub ? (
                <>
                  {result.url.includes("/pull/") ? "PR" : "Issue"}
                  {githubId}
                  {" - "}
                  {formatDate(result.createdAt)}
                </>
                ) : result.url.replace(/http[s]:\/\//, '').replace(result.site, '') }
              </span>
            </>
            }
            footer={
              <ViewEmbedded
                noEmbed={isGithub}
                label={isGithub ? "Open Github" : "Open page"}
                url={result.url}
                results={results}
                searchQuery={searchQuery}
                searchMode={searchMode}
              />
            }
            content={
              <PageResultHighlighter
                result={result}
                searchQuery={searchQuery}
                searchMode={searchMode}
                options={{maxLength: 250, contextLength: 75}}
              />
            }
          />
        )})}
    </div>
  );
};
