import MatrixArchiverLogo from "@/assets/logos/matrix.svg";
import type { MATRIX_CHANNELS } from "@/consts";
import type { useResults } from "@/hooks/useResults";
import type { SearchMode } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ShowAll } from "../ShowAll";
import { MatrixResultCards } from "./MatrixResultCards";
import { Section } from "./Section";

export const MatrixResults = ({
  channel,
  queryResult,
  query,
  searchMode,
}: {
  channel: (typeof MATRIX_CHANNELS)[0];
  queryResult: ReturnType<typeof useResults>["graypaperChat"];
  query: string;
  searchMode: SearchMode;
}) => {
  const location = useLocation();

  return (
    <div className="mt-6">
      <div className="mb-4">
        <Section
          title={channel.name}
          url={channel.archiveUrl}
          logo={
            <img
              src={MatrixArchiverLogo}
              className="size-4 p-0.5"
              alt="Matrix Archiver Logo"
            />
          }
          endBlock={
            <Link
              to={(() => {
                const params = new URLSearchParams(location.search);
                params.set("channelId", channel.id);
                return `/results/matrix?${params.toString()}`;
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
      <MatrixResultCards
        channel={channel}
        queryResult={queryResult}
        searchQuery={query}
        searchMode={searchMode}
      />
    </div>
  );
};
