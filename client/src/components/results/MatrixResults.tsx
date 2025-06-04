import {MATRIX_CHANNELS} from "@/consts";
import {useResults} from "@/hooks/useResults";
import {SearchMode} from "@/lib/utils";
import {Section} from "./Section";
import MatrixArchiverLogo from "@/assets/logos/matrix.svg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {MatrixResultList} from "./MatrixResultList";

export const MatrixResults = ({
  channel,
  queryResult,
  query,
  searchMode
}: {
  channel: typeof MATRIX_CHANNELS[0],
  queryResult: ReturnType<typeof useResults>['graypaperChat'],
  query: string;
  searchMode: SearchMode;
}) => {
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
              <Button
                variant="ghost"
                size="sm"
                className="text-primary flex items-center text-xs"
              >
                {queryResult.pagination.hasNextPage && (<>
                  View all {queryResult.totalResults} results
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </>)}
              </Button>
            </Link>
          }
        />
      </div>
      {queryResult.isLoading && !queryResult.results.length ? (
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
      ) : (
        <MatrixResultList
          results={queryResult.results}
          searchQuery={query}
          searchMode={searchMode}
        />
      )}
    </div>
  );
};
