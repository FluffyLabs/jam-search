import { SearchResult } from "@/lib/api";
import { getTextToDisplay, SearchMode } from "@/lib/utils";
import { MATRIX_CHANNELS } from "@/consts";
import { formatDate } from "@/lib/utils";
import { ViewEmbedded } from "../ViewEmbedded";
import { NoResults } from "./NoResults";
import { useResults } from "@/hooks/useResults";
import { ResultCard } from "./ResultCard";

interface MatrixResultCardsProps {
  channel: (typeof MATRIX_CHANNELS)[0];
  queryResult: ReturnType<typeof useResults>["jamChat"];
  searchQuery: string;
  searchMode: SearchMode;
}

export const MatrixResultCards = ({
  channel,
  queryResult,
  searchQuery,
  searchMode,
}: MatrixResultCardsProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return <NoResults isError={isError} />;
  }

  const getUrl = (result: SearchResult) => {
    return `${channel.archiveUrl}#${result.messageId}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {isLoading && queryResult.results.length === 0 ? (
        <>
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
        </>
      ) : null}
      {results.map((result: SearchResult) => (
        <ResultCard
          key={result.messageId ?? result.id}
          header={
            <>
              {result.sender}{" "}
              {result.timestamp && (
                <span className="text-muted-foreground ml-2">
                  {formatDate(result.timestamp)}
                </span>
              )}
            </>
          }
          footer={
            result.messageId && (
              <ViewEmbedded
                label={
                  <>
                    <MessageIco /> View message
                  </>
                }
                url={getUrl(result)}
                searchQuery={searchQuery}
                searchMode={searchMode}
                results={results}
              />
            )
          }
          content={
            <span className="text-muted-foreground font-light">
              {getTextToDisplay(result.content || "", searchQuery, searchMode)}
            </span>
          }
        />
      ))}
    </div>
  );
};

const MessageIco = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_1402_7590"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="16"
      height="16"
    >
      <rect x="0.5" y="0.5" width="15" height="15" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_1402_7590)">
      <path
        d="M7.375 13.625H3.625C3.28125 13.625 2.98698 13.5026 2.74219 13.2578C2.4974 13.013 2.375 12.7188 2.375 12.375V3.625C2.375 3.28125 2.4974 2.98698 2.74219 2.74219C2.98698 2.4974 3.28125 2.375 3.625 2.375H7.375V13.625ZM6.125 12.375V3.625H3.625V12.375H6.125ZM8.625 7.375V2.375H12.375C12.7188 2.375 13.013 2.4974 13.2578 2.74219C13.5026 2.98698 13.625 3.28125 13.625 3.625V7.375H8.625ZM9.875 6.125H12.375V3.625H9.875V6.125ZM8.625 13.625V8.625H13.625V12.375C13.625 12.7188 13.5026 13.013 13.2578 13.2578C13.013 13.5026 12.7188 13.625 12.375 13.625H8.625ZM9.875 12.375H12.375V9.875H9.875V12.375Z"
        fill="#61EDE2"
      />
    </g>
  </svg>
);
