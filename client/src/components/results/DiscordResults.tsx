import DiscordLogo from "@/assets/logos/discord.svg";
import type { useResults } from "@/hooks/useResults";
import type * as discord from "@shared/discord";
import { Link, useLocation } from "react-router-dom";
import { ShowAll } from "../ShowAll";
import { DiscordResultCards } from "./DiscordResultCards";
import { Section } from "./Section";

export const DiscordResults = ({
  channel,
  queryResult,
  query,
}: {
  channel: (typeof discord.CHANNELS)[0];
  queryResult: ReturnType<typeof useResults>["discordResults"][0]["results"];
  query: string;
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
                params.set("channelId", channel.channelId);
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
      <DiscordResultCards queryResult={queryResult} searchQuery={query} />
    </div>
  );
};
