import type { useResults } from "@/hooks/useResults";
import type { DiscordSearchResult } from "@/lib/api";
import { type SearchMode, getTextToDisplay } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { NoResults } from "./NoResults";
import { ResultCard } from "./ResultCard";

interface DiscordResultCardsProps {
  queryResult: ReturnType<typeof useResults>["implementersDiscord"];
  searchQuery: string;
  searchMode: SearchMode;
}

export const DiscordResultCards = ({
  queryResult,
  searchQuery,
  searchMode,
}: DiscordResultCardsProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return <NoResults isError={isError} />;
  }

  const getUrl = (result: DiscordSearchResult) => {
    // For thread messages, use threadId as the channel part
    const channelPart = result.threadId || result.channelId;
    return `https://discord.com/channels/${result.serverId}/${channelPart}/${result.messageId}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {isLoading && results.length === 0 ? (
        <>
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
        </>
      ) : null}
      {results.map((result: DiscordSearchResult) => (
        <div key={result.messageId} data-key={result.messageId}>
          <ResultCard
            header={
              <>
                {result.sender}{" "}
                {result.threadId && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded ml-2">
                    Thread
                  </span>
                )}
                {result.timestamp && (
                  <span className="text-muted-foreground ml-2">
                    {formatDate(result.timestamp)}
                  </span>
                )}
              </>
            }
            content={
              <p className="text-muted-foreground font-light">
                {getTextToDisplay(
                  result.content || "",
                  searchQuery,
                  searchMode
                )}
              </p>
            }
            footer={
              <a
                href={getUrl(result)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-xs gap-1 after:absolute after:inset-0 hover:text-accent-foreground transition-colors"
              >
                Open Discord
              </a>
            }
          />
        </div>
      ))}
    </div>
  );
};
