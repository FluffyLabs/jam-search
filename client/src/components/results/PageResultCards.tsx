import type { useResults } from "@/hooks/useResults";
import { cn, formatDate } from "@/lib/utils";
import { PageResultHighlighter } from "../PageResultHighlighter";
import { ViewEmbedded } from "../ViewEmbedded";
import { NoResults } from "./NoResults";
import { ResultCard } from "./ResultCard";

interface PageResultCardsProps {
  queryResult: ReturnType<typeof useResults>["pagesResults"][0]["results"];
  searchQuery: string;
}

export const PageResultCards = ({
  queryResult,
  searchQuery,
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
        const isCode = result.contentKind === "code";
        const isGithub = result.site.includes("github");
        const githubNumber = Number(result.url.split("/").pop());
        const githubId =
          isGithub && !isCode && Number.isFinite(githubNumber)
            ? `#${githubNumber}`
            : "";

        const header = isCode ? (
          <>
            <span className="font-mono text-sm truncate">{result.title}</span>
            {result.language ? (
              <span className="text-xs text-muted-foreground ml-2 uppercase tracking-wide">
                {result.language}
              </span>
            ) : null}
          </>
        ) : (
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
                  ) : null}
                  {formatDate(result.createdAt)}
                </>
              ) : (
                result.url.replace(/http[s]:\/\//, "").replace(result.site, "")
              )}
            </span>
          </>
        );

        const content = isCode ? (
          <PageResultHighlighter
            result={result}
            searchQuery={searchQuery}
            options={{
              maxLength: 400,
              contextLength: 120,
              preserveWhitespace: true,
            }}
          />
        ) : (
          <PageResultHighlighter
            result={result}
            searchQuery={searchQuery}
            options={{ maxLength: 250, contextLength: 75 }}
          />
        );

        return (
          <ResultCard
            key={result.id}
            header={header}
            footer={
              <ViewEmbedded
                noEmbed={isGithub}
                label={
                  isCode
                    ? "Open on GitHub"
                    : isGithub
                      ? "Open Github"
                      : "Open page"
                }
                url={result.url}
                results={results}
                searchQuery={searchQuery}
              />
            }
            content={content}
          />
        );
      })}
    </div>
  );
};
