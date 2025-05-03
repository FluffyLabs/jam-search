import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const searchOptions = [
  { label: "from", description: "Messages from a specific user" },
  {
    label: "since_gp",
    description: "Find messages since a specific graypaper version",
  },
  { label: "before", description: "Find messages before a specific date" },
  { label: "after", description: "Find messages after a specific date" },
];

// Function to highlight filter names in the input
const highlightFilters = (query: string) => {
  if (!query) {
    return "";
  }

  // Create a highlighted version of the query with filter keys wrapped in spans
  let highlightedQuery = query;
  const filterKeys = searchOptions.map((option) => option.label);

  // Regex to find filter patterns (filter_name: value)
  const filterRegex = new RegExp(`(${filterKeys.join("|")}):([^\\s]+)`, "g");

  // Replace filter patterns with highlighted versions
  highlightedQuery = highlightedQuery.replace(
    filterRegex,
    (_match, filterName, filterValue) => {
      return `<span class="text-primary">${filterName}</span>:${filterValue}`;
    }
  );

  return highlightedQuery;
};

/**
 * SearchForm component
 *
 * This component provides a search form with a dropdown of search options.
 * It allows users to input a search query and select from a list of options
 * to filter the search results.
 * It sets the search query in the URL when the form is submitted. For now this is the only global state we have.
 */
export const SearchForm = () => {
  const location = useLocation();
  const richQuery = new URLSearchParams(location.search).get("q") || "";
  const [searchQuery, setSearchQuery] = useState(richQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [fuzzySearch, setFuzzySearch] = useState(
    new URLSearchParams(location.search).get("fuzzySearch") === "true"
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayedValue, setDisplayedValue] = useState(
    highlightFilters(richQuery)
  );
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Get current URL parameters and update only the search-related ones
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("q", searchQuery);

      // Only include fuzzySearch when enabled
      if (fuzzySearch) {
        queryParams.set("fuzzySearch", "true");
      } else {
        queryParams.delete("fuzzySearch");
      }

      // Navigate to current path with updated query params
      navigate(`${location.pathname}?${queryParams.toString()}`);
    }
  };

  const addSearchOption = (option: string) => {
    if (!inputRef.current) return;

    const cursorPos = inputRef.current.selectionStart || searchQuery.length;
    const textBefore = searchQuery.substring(0, cursorPos);
    const textAfter = searchQuery.substring(cursorPos);

    // Add a space before the filter if the cursor is not at the beginning and
    // there isn't already a space
    const space =
      cursorPos > 0 && textBefore.charAt(textBefore.length - 1) !== " "
        ? " "
        : "";

    // Insert the filter at the cursor position
    const newQuery = `${textBefore}${space}${option}: ${textAfter}`;
    setSearchQuery(newQuery);
    setDisplayedValue(highlightFilters(newQuery));

    // Focus the input and set cursor after the inserted filter
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = cursorPos + space.length + option.length + 2; // +2 for ": "
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setDisplayedValue(highlightFilters(value));
  };

  const toggleFuzzySearch = () => {
    setFuzzySearch(!fuzzySearch);
  };

  return (
    <div ref={searchRef} className="relative w-full mb-7 mt-4">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          {/* Fuzzy search icon on the left */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 flex items-center gap-2 justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    type="button"
                    className={`h-9 w-9 my-auto border border-border`}
                    disabled
                  >
                    <div>
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-card text-foreground border border-border">
                  <p>Enable semantic search (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={fuzzySearch ? "default" : "ghost"}
                    size="icon"
                    type="button"
                    onClick={toggleFuzzySearch}
                    className={`h-9 w-9 my-auto ${
                      fuzzySearch ? "bg-brand" : "border border-border"
                    }`}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-card text-foreground border border-border">
                  <p>Enable fuzzy search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Hidden actual input field for form handling */}
          <Input
            ref={inputRef}
            type="text"
            className="pr-12 pl-26 py-0 h-[58px] absolute inset-0 z-10 bg-transparent text-transparent caret-foreground"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
          />

          {/* Visible styled display with highlighted filters */}
          <div
            className="pr-12 pl-26 h-[58px] flex items-center pointer-events-none border border-input rounded-md bg-background text-foreground"
            aria-hidden="true"
          >
            {displayedValue ? (
              <div dangerouslySetInnerHTML={{ __html: displayedValue }} />
            ) : (
              <span className="text-muted-foreground">
                Examples: grandpa, contest, pvm
              </span>
            )}
          </div>
        </div>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 flex items-center justify-center">
          <Button
            variant="default"
            size="icon"
            type="submit"
            className="bg-brand h-9 w-9 my-auto"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {isFocused && searchQuery.trim() === "" && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-input bg-card rounded-md shadow-lg z-10">
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-200">
              Search Options
            </h3>
          </div>
          <div className="p-2 max-h-[300px] overflow-y-auto">
            {searchOptions.map((option) => (
              <div
                key={option.label}
                className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded cursor-pointer"
                onClick={() => addSearchOption(option.label)}
              >
                <div className="flex flex-col">
                  <span className="text-zinc-200 font-medium">
                    {option.label}:
                  </span>
                  <span className="text-zinc-400 text-sm">
                    {option.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
