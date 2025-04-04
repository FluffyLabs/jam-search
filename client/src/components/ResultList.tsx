import { SearchResult } from "@/lib/api";

interface ResultListProps {
  results: SearchResult[];
}

export const ResultList = ({ results }: ResultListProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No results found for your search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result: SearchResult, index) => (
        <div key={index} className="border-b border-border pb-6">
          <div className="mb-2">
            <div className="flex items-center mb-1">
              <span className="font-medium text-foreground">
                Matrix Chat: {result.title}
              </span>
              {result.timestamp && (
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(result.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              "{result.content}"
            </p>
            {result.link && (
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand flex items-center w-fit hover:text-brand-dark"
              >
                <svg
                  className="w-3 h-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View thread
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
