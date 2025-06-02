import { ArrowRight, Search, Sparkles, ScanSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDebouncedCallback } from "use-debounce";
import {useResults} from "@/hooks/useResults";
import {initialSources} from "@/lib/sources";

const searchOptions = [
  { label: "from", description: "Messages from a specific user" },
  {
    label: "since_gp",
    description: "Find messages since a specific graypaper version",
  },
  { label: "before", description: "Find messages before a specific date" },
  { label: "after", description: "Find messages after a specific date" },
];

// Search modes available in the dropdown
const searchModes = [
  {
    id: "strict",
    label: "Strict Search",
    icon: Search,
    description: "Exact matching for phrases",
  },
  {
    id: "fuzzy",
    label: "Fuzzy Search",
    icon: ScanSearch,
    description: "Matching for words with OR logic",
  },
  {
    id: "semantic",
    label: "Semantic Search",
    icon: Sparkles,
    description: "Find similar concepts using AI",
  },
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

const isInstantSearch = (searchMode: string, enabled: boolean) => {
  return (searchMode === "strict" || searchMode === "fuzzy") && enabled;
};

/**
 * SearchForm component
 *
 * This component provides a search form with a dropdown of search options.
 * It allows users to input a search query and select from a list of options
 * to filter the search results.
 * It sets the search query in the URL when the form is submitted. For now this is the only global state we have.
 */
export const SearchForm = ({
  redirectToResults = false,
  instantSearch = true,
  showSearchOptions = true,
}: {
  redirectToResults?: boolean;
  instantSearch?: boolean;
  showSearchOptions?: boolean;
}) => {
  const location = useLocation();
  const richQuery = new URLSearchParams(location.search).get("q") || "";
  const searchModeParam =
    new URLSearchParams(location.search).get("searchMode") || "strict";

  const [searchQuery, setSearchQuery] = useState(richQuery);
  const [prefetchingQuery, setPrefetchingQuery] = useState(richQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [searchMode, setSearchMode] = useState(searchModeParam);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  // prefetch the results
  useResults(prefetchingQuery, searchModeParam, initialSources)

  const getQueryParams = () => {
    // Get current URL parameters and update only the search-related ones
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("q", searchQuery);

    // Add search mode parameter (only if not strict, which is the default)
    if (searchMode !== "strict") {
      queryParams.set("searchMode", searchMode);
    } else {
      queryParams.delete("searchMode");
    }
    return queryParams;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const queryParams = getQueryParams();
      // Navigate to current path with updated query params
      navigate(
        `${
          redirectToResults ? "/results" : location.pathname
        }?${queryParams.toString()}`
      );
    }
  };

  const handlePrefetch = () => {
    setPrefetchingQuery(searchQuery);
  };

  const debouncedSubmit = useDebouncedCallback(handleSubmit, 300);
  const debouncedPrefetch = useDebouncedCallback(handlePrefetch, 100, { leading: true, trailing: true });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setDisplayedValue(highlightFilters(value));
    debouncedPrefetch();

    if (isInstantSearch(searchMode, instantSearch)) {
      debouncedSubmit(e);
    }
  };

  // Add a ref for the displayed value div
  const displayedValueRef = useRef<HTMLDivElement>(null);

  // Sync scroll on key events (arrow keys, etc)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent new lines when pressing Enter
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();

      // Submit form on Enter if not in instant search mode
      if (!isInstantSearch(searchMode, instantSearch)) {
        handleSubmit(e);
      }
    }
  };

  // Get the current search mode configuration
  const currentModeConfig =
    searchModes.find((mode) => mode.id === searchMode) || searchModes[0];
  const ModeIcon = currentModeConfig.icon;

  const handleClearSearch = () => {
    setSearchQuery("");
    setDisplayedValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full mb-7 mt-4">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          {/* Search mode dropdown on the left */}
          <div className="absolute left-3 top-0 h-full z-20 flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 my-auto border border-border flex items-center justify-center"
                >
                  <ModeIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-card text-foreground border border-border"
              >
                <DropdownMenuLabel>Search Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {searchModes.map((mode) => (
                  <DropdownMenuItem
                    key={mode.id}
                    onClick={() => {
                      setSearchMode(mode.id);

                      if (!instantSearch) {
                        return;
                      }

                      const searchMode = mode.id;
                      const queryParams = new URLSearchParams(location.search);
                      queryParams.set("q", searchQuery);

                      // Add search mode parameter (only if not strict, which is the default)
                      if (searchMode !== "strict") {
                        queryParams.set("searchMode", searchMode);
                      } else {
                        queryParams.delete("searchMode");
                      }

                      // Navigate to current path with updated query params
                      navigate(
                        `${
                          redirectToResults ? "/results" : location.pathname
                        }?${queryParams.toString()}`
                      );
                    }}
                    className={`flex items-center gap-2 ${
                      searchMode === mode.id ? "bg-primary/20" : ""
                    }`}
                  >
                    <mode.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{mode.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {mode.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Hidden actual textarea field for form handling */}
          {/* padding top is 16px to align with the visible display - this is a hack to make the textarea look centered */}
          <Textarea
            ref={inputRef}
            className="pr-12 pl-14 pt-4 pb-2 min-h-[58px] h-auto absolute inset-0 z-10 bg-transparent text-transparent caret-foreground resize-none font-sans text-base leading-normal"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            maxLength={170}
          />

          {/* Visible styled display with highlighted filters */}
          <div
            className="pr-12 pl-14 pt-2 pb-2 min-h-[58px] h-auto flex pointer-events-none border border-input rounded-md bg-background text-foreground overflow-auto font-sans text-base leading-normal"
            aria-hidden="true"
            ref={displayedValueRef}
          >
            {displayedValue ? (
              <div
                className="w-full whitespace-pre-wrap break-words py-2"
                dangerouslySetInnerHTML={{ __html: displayedValue }}
              />
            ) : (
              <span className="text-muted-foreground py-2">
                Examples: grandpa, contest, pvm
              </span>
            )}
          </div>
        </div>

        {/* Clear button */}
        {searchQuery.trim() !== "" && (
          <div
            className={`absolute ${
              !isInstantSearch(searchMode, instantSearch)
                ? "right-14"
                : "right-3"
            } top-0 z-20 h-full flex items-center justify-center`}
          >
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleClearSearch}
              className="h-9 w-9 my-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Only show submit button for non-strict search modes */}
        {!isInstantSearch(searchMode, instantSearch) && (
          <div className="absolute right-3 top-0 z-20 h-full flex items-center justify-center">
            <Button
              variant="default"
              size="icon"
              type="submit"
              className="bg-brand h-9 w-9 my-auto"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </form>

      {isFocused && showSearchOptions && searchQuery.trim() === "" && (
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
