import {ArrowRight} from "lucide-react";
import {Button} from "./ui/button";

export const ShowAll = ({
  hasNextPage,
  totalResults,
}: {
  hasNextPage: boolean,
  totalResults: number,
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-primary flex items-center text-xs"
    >
      {hasNextPage && (<>
        <span className="hidden sm:inline">Show all {totalResults} results</span>
        <span className="inline sm:hidden">{totalResults} more</span>
        <ArrowRight className="size-3.5 ml-1" />
      </>)}
    </Button>
  );
};
