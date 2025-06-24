import { DISCORD_CHANNELS } from "@/consts";
import { useResults } from "@/hooks/useResults";
import { SearchMode } from "@/lib/utils";
import { Section } from "./Section";
import { Link, useLocation } from "react-router-dom";
import { DiscordResultCards } from "./DiscordResultCards";
import { ShowAll } from "../ShowAll";
import DiscordLogo from "@/assets/logos/discord.svg";

export const DiscordResults = ({
  channel,
  queryResult,
  query,
  searchMode,
}: {
  channel: (typeof DISCORD_CHANNELS)[0];
  queryResult: ReturnType<typeof useResults>["implementersDiscord"];
  query: string;
  searchMode: SearchMode;
}) => {
  const location = useLocation();

  return (
    <div className="mt-6">
      <div className="mb-4">
        <Section
          title={`${channel.name} @ ${channel.serverName}`}
          url={channel.discordUrl}
          logo={
            <img
              src={DiscordLogo}
              className="size-6 p-0.5"
              alt="Discord Logo"
            />
          }
          endBlock={
            <Link
              to={(() => {
                const params = new URLSearchParams(location.search);
                params.set("channelId", channel.id);
                return `/results/discord?${params.toString()}`;
              })()}
            >
              <ShowAll
                hasNextPage={queryResult.pagination.hasNextPage}
                totalResults={queryResult.totalResults}
              />
            </Link>
          }
        />
      </div>
      <DiscordResultCards
        queryResult={queryResult}
        searchQuery={query}
        searchMode={searchMode}
      />
    </div>
  );
};
