import type { useResults } from "@/hooks/useResults";
import { type SearchMode, cn, formatDate } from "@/lib/utils";
import { PageResultHighlighter } from "../PageResultHighlighter";
import { ViewEmbedded } from "../ViewEmbedded";
import { NoResults } from "./NoResults";
import { ResultCard } from "./ResultCard";

interface PageResultCardsProps {
  queryResult: ReturnType<typeof useResults>["jamchain"];
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
    return <NoResults isError={isError} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isLoading && queryResult.results.length === 0 ? (
        <>
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
        </>
      ) : null}
      {results.map((result) => {
        const isGithub = result.site.includes("github");
        const githubNumber = Number(result.url.split("/").pop());
        const githubId =
          isGithub && Number.isFinite(githubNumber) ? `#${githubNumber}` : "";

        return (
          <ResultCard
            key={result.id}
            header={
              <>
                <span>
                  {result.title}{" "}
                  <span className="text-muted-foreground">{githubId}</span>
                </span>
                <span
                  className={cn(
                    "text-xs text-muted-foreground ml-2",
                    !isGithub ? "font-mono" : ""
                  )}
                >
                  {isGithub ? (
                    <>
                      {result.url.includes("/pull/") ||
                      result.url.includes("/issues/") ? (
                        <>
                          {result.url.includes("/pull/") ? "PR" : "Issue"}
                          {githubId}
                          {" - "}
                        </>
                      ) : (
                        <></>
                      )}
                      {formatDate(result.createdAt)}
                    </>
                  ) : (
                    result.url
                      .replace(/http[s]:\/\//, "")
                      .replace(result.site, "")
                  )}
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
                options={{ maxLength: 250, contextLength: 75 }}
              />
            }
          />
        );
      })}
    </div>
  );
};
