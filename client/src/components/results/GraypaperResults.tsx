import { BookOpenText } from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import GraypaperReaderLogo from "@/assets/logos/graypaper.png";
import type { useResults } from "@/hooks/useResults";
import { getTextToDisplay } from "@/lib/utils";
import { withMathRendering } from "../InlineMath";
import { ShowAll } from "../ShowAll";
import { ViewEmbedded } from "../ViewEmbedded";
import { NoResults } from "./NoResults";
import { ResultCard } from "./ResultCard";
import { Section } from "./Section";

interface GraypaperResultsProps {
  queryResult: ReturnType<typeof useResults>["graypaperResults"];
  query: string;
}

export const GraypaperResults = ({
  queryResult,
  query,
}: GraypaperResultsProps) => {
  const location = useLocation();
  const { isLoading, isError, results } = queryResult;

  const graypaperReader = {
    title: "Gray Paper",
    url: "https://graypaper.fluffylabs.dev",
    logo: GraypaperReaderLogo,
  };

  return (
    <div className="flex flex-col gap-4 mb-7">
      <Section
        logo={
          <img
            src={graypaperReader.logo}
            className="size-4"
            alt={`${graypaperReader.title} logo`}
          />
        }
        url={graypaperReader.url}
        title={graypaperReader.title}
        endBlock={
          <RouterLink to={`/results/graypaper${location.search}`}>
            <ShowAll
              hasNextPage={queryResult.pagination.hasNextPage}
              totalResults={queryResult.totalResults}
            />
          </RouterLink>
        }
      />
      {isError || (results.length === 0 && !isLoading) ? (
        <NoResults isError={isError} />
      ) : null}
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
        {results.map((section) => (
          <ResultCard
            key={section.id}
            header={section.title}
            footer={
              <ViewEmbedded
                label={
                  <>
                    <BookOpenText className="h-3 -mr-1" /> Open reader
                  </>
                }
                url={`https://graypaper.fluffylabs.dev/#/?search=${query}&section=${section.title}`}
                results={[]}
                searchQuery={query}
              />
            }
            content={
              <div className="text-xs font-light">
                {withMathRendering(getTextToDisplay(section.text, query))}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};
