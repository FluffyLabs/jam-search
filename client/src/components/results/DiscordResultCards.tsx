import { SearchResult } from "@/lib/api";
import { getTextToDisplay, SearchMode } from "@/lib/utils";
import { DISCORD_CHANNELS } from "@/consts";
import { formatDate } from "@/lib/utils";
import { ViewEmbedded } from "../ViewEmbedded";
import { NoResults } from "./NoResults";
import { useResults } from "@/hooks/useResults";
import { ResultCard } from "./ResultCard";

interface DiscordResultCardsProps {
  channel: (typeof DISCORD_CHANNELS)[0];
  queryResult: ReturnType<typeof useResults>["implementersDiscord"];
  searchQuery: string;
  searchMode: SearchMode;
}

export const DiscordResultCards = ({
  channel,
  queryResult,
  searchQuery,
  searchMode,
}: DiscordResultCardsProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return <NoResults isError={isError} />;
  }

  const getUrl = () => {
    return `${channel.discordUrl}`;
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
            key={result.messageid ?? result.id}
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
              <ViewEmbedded
                label="View on Discord"
                url={getUrl()}
                searchQuery={searchQuery}
                searchMode={searchMode}
                results={results}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};
