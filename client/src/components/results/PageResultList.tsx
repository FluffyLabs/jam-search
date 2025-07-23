import { formatDate, SearchMode } from "@/lib/utils";
import { ViewEmbedded } from "../ViewEmbedded";
import { PageResultHighlighter } from "../PageResultHighlighter";
import { NoResults } from "./NoResults";
import { useResults } from "@/hooks/useResults";
import { Skeleton } from "../ui/skeleton";
import { ResultCard } from "./ResultCard";

interface PageResultListProps {
  queryResult: ReturnType<typeof useResults>["jamchain"];
  searchQuery: string;
  searchMode?: SearchMode;
}

export const PageResultList = ({
  queryResult,
  searchQuery,
  searchMode = "strict",
}: PageResultListProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return <NoResults isError={isError} />;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-border pb-6">
            <Skeleton className="h-4 w-[160px] my-1" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-[80px] mt-1" />
          </div>
          <div className="flex flex-col gap-2 border-b border-border pb-6">
            <Skeleton className="h-4 w-[160px] my-1" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-[80px] mt-1" />
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result) => {
          const isGithub = result.site.includes("github");
          const githubNumber = Number(result.url.split("/").pop());
          const githubId =
            isGithub && Number.isFinite(githubNumber) ? `#${githubNumber}` : "";

          return (
            <ResultCard
              lightBorder
              key={result.id}
              header={
                <>
                  <div className="font-normal text-foreground mr-2">
                    {githubId} {result.title}
                  </div>
                  <span className="text-muted-foreground">
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
              content={
                <PageResultHighlighter
                  result={result}
                  searchQuery={searchQuery}
                  searchMode={searchMode}
                  options={{ maxLength: 500, contextLength: 300 }}
                />
              }
              footer={
                <ViewEmbedded
                  label={isGithub ? "Open Github" : "Open page"}
                  noEmbed={isGithub}
                  url={result.url}
                  results={results}
                  searchQuery={searchQuery}
                  searchMode={searchMode}
                />
              }
            />
          );
        })}
      </div>
    </div>
  );
};
