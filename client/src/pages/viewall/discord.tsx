import { Container } from "@/components/Container";
import { Paging } from "@/components/Paging";
import { DiscordResultList } from "@/components/results/DiscordResultList";
import { ResultHeader } from "@/components/results/ResultHeader";
import { Button } from "@/components/ui/button";
import { useSearchDiscord } from "@/hooks/useSearchDiscord";
import {  parseSearchQuery } from "@/lib/utils";
import * as discord from "@shared/discord";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const DiscordResultsAll = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const richQuery = searchParams.get("q") || "";
  const channelId =
    searchParams.get("channelId") || discord.CHANNELS[0].channelId;
  // Find the channel name based on the channelId
  const channel =
    discord.CHANNELS.find((ch) => ch.channelId === channelId) ||
    discord.CHANNELS[0];

  const topRef = useRef(null);
  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);

  // Use our search hook with the extracted query and filters
  const queryResult = useSearchDiscord({
    query,
    channelId,
    pageSize: 20,
    filters,
  });

  const backParams = new URLSearchParams(location.search);
  backParams.delete("channelId");

  const pages = <Paging queryResult={queryResult} scrollTo={topRef} />;

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl text-card-foreground">
      <div ref={topRef} />
      <ResultHeader
        left={
          <Button
            variant="ghost"
            size="icon"
            className="mt-0 w-auto h-8"
            asChild
          >
            <Link to={`/results?${backParams.toString()}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline mx-2 text-xs">All sources</span>
            </Link>
          </Button>
        }
        showSearchOptions
      />

      <Container>
        <h1 className="text-md font-medium text-white mb-2">{query}</h1>

        {/* Display active filters as tags */}
        {query && filters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.map((filter) => (
                <div
                  key={`${filter.key}-${filter.value}`}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
                >
                  <span className="font-semibold mr-1">{filter.key}:</span>
                  <span>{filter.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <span className="text-muted-foreground text-sm font-light">
          Found {queryResult.totalResults.toLocaleString()} matches in{" "}
          <span className="text-white">
            {channel.name} @ {channel.serverName}
          </span>
        </span>

        <div className="my-8">
          <DiscordResultList
            queryResult={queryResult}
            searchQuery={query}
          />
          {pages}
        </div>
      </Container>
    </div>
  );
};

export default DiscordResultsAll;
