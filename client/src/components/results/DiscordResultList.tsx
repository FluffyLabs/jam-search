import { DiscordSearchResult } from "@/lib/api";
import { getTextToDisplay, SearchMode } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { NoResults } from "./NoResults";
import { useResults } from "@/hooks/useResults";
import { ResultCard } from "./ResultCard";

interface DiscordResultListProps {
  queryResult: ReturnType<typeof useResults>["implementersDiscord"];
  searchQuery: string;
  searchMode: SearchMode;
}

export const DiscordResultList = ({
  queryResult,
  searchQuery,
  searchMode,
}: DiscordResultListProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return <NoResults isError={isError} />;
  }

  const getUrl = (result: DiscordSearchResult) => {
    return `https://discord.com/channels/${result.serverId}/${result.channelId}/${result.messageId}`;
  };

  return (
    <div className="space-y-6">
      {isLoading && results.length === 0 ? (
        <div className="text-center p-8">Loading results...</div>
      ) : null}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result: DiscordSearchResult) => (
          <ResultCard
            lightBorder
            key={result.id}
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
                {getTextToDisplay(
                  result.content || "",
                  searchQuery,
                  searchMode,
                  400
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
        ))}
      </div>
    </div>
  );
};
