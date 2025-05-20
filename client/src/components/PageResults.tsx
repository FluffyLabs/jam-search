import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import { highlightText, SearchMode } from "@/lib/utils";

interface PageResult {
  id: number;
  url: string;
  title: string;
  content: string;
  lastModified: string;
  similarity?: number;
  score?: number;
}

interface PageResultsProps {
  results: PageResult[];
  searchQuery: string;
  searchMode?: SearchMode;
}

export const PageResults = ({
  results,
  searchQuery,
  searchMode,
}: PageResultsProps) => {
  if (!results.length) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No results found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                {highlightText(
                  result.title,
                  [searchQuery],
                  searchMode || "strict"
                )}
                <Link className="h-4 w-4" />
              </a>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last modified:{" "}
              {new Date(result.lastModified).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {highlightText(
                result.content,
                [searchQuery],
                searchMode || "strict"
              )}
            </div>
            {result.similarity && (
              <div className="text-xs text-muted-foreground mt-2">
                Similarity: {(result.similarity * 100).toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
