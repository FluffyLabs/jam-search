import type { useSearchCommon } from "@/hooks/useSearchCommon";
import type { RefObject } from "react";
import { Button } from "./ui/button";

type PagingProps = {
  queryResult: Pick<ReturnType<typeof useSearchCommon>, "pagination">;
  scrollTo: RefObject<HTMLElement | null>;
};

export const Paging = ({ queryResult, scrollTo }: PagingProps) => {
  const { pagination } = queryResult;

  const handlePrev = () => {
    scrollTo.current?.scrollIntoView();
    pagination.previousPage();
  };

  const handleNext = () => {
    scrollTo.current?.scrollIntoView();
    pagination.nextPage();
  };

  return (
    <div className="flex justify-center items-center mt-6 mb-8 space-x-2 font-light">
      <Button
        size="sm"
        onClick={handlePrev}
        disabled={!pagination.hasPreviousPage}
        className="px-3 py-1 bg-accent rounded disabled:opacity-50 text-muted-foreground text-xs font-light"
      >
        Previous
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {pagination.currentPage} of {pagination.totalPages || 1}
      </span>
      <Button
        size="sm"
        onMouseEnter={pagination.prefetchNextPage}
        onClick={handleNext}
        disabled={!pagination.hasNextPage}
        className="px-3 py-1 bg-accent rounded disabled:opacity-50 text-muted-foreground text-xs font-light"
      >
        Next
      </Button>
    </div>
  );
};
