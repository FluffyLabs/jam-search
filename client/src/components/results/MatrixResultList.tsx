import type * as matrix from "@shared/matrix";
import type { useResults } from "@/hooks/useResults";
import type { SearchResult } from "@/lib/api";
import { formatDate, getTextToDisplay } from "@/lib/utils";
import { ViewEmbedded } from "../ViewEmbedded";
import { NoResults } from "./NoResults";
import { ResultCard } from "./ResultCard";

interface MatrixResultListProps {
  channel: (typeof matrix.ROOMS)[0];
  queryResult: ReturnType<typeof useResults>["matrixResults"][0]["results"];
  searchQuery: string;
}

export const MatrixResultList = ({
  channel,
  queryResult,
  searchQuery,
}: MatrixResultListProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return <NoResults isError={isError} />;
  }

  const getUrl = (result: SearchResult) => {
    return `${channel.archiveUrl}#${result.messageId}`;
  };

  return (
    <div className="space-y-6">
      {isLoading && results.length === 0 ? (
        <div className="text-center p-8">Loading results...</div>
      ) : null}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result: SearchResult) => (
          <ResultCard
            lightBorder
            key={result.messageId ?? result.id}
            header={
              <>
                <span className="font-medium text-foreground">
                  {result.sender}{" "}
                </span>
                {result.timestamp && (
                  <span className="text-muted-foreground ml-2">
                    {formatDate(result.timestamp)}
                  </span>
                )}
              </>
            }
            content={
              <p className="text-muted-foreground font-light mb-2">
                {getTextToDisplay(result.content || "", searchQuery, 400)}
              </p>
            }
            footer={
              <ViewEmbedded
                label="View message"
                url={getUrl(result)}
                searchQuery={searchQuery}
                results={results}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};
