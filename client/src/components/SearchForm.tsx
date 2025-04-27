import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

interface SearchFormProps {
  initialQuery?: string;
}

type SearchFilter = {
  key: string;
  value: string;
};

export const SearchForm = ({ initialQuery = "" }: SearchFormProps) => {
  const { search } = useSearch();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayedValue, setDisplayedValue] = useState("");
  const navigate = useNavigate();

  const searchOptions = [
    { label: "from", description: "Messages from a specific user" },
    {
      label: "since_gp",
      description: "Find messages since a specific graypaper version",
    },
    { label: "before", description: "Find messages before a specific date" },
    { label: "after", description: "Find messages after a specific date" },
  ];

  // Update the search input when initialQuery changes
  useEffect(() => {
    setSearchQuery(initialQuery);
    highlightFilters(initialQuery);
  }, [initialQuery]);

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

  // Function to highlight filter names in the input
  const highlightFilters = (query: string) => {
    if (!query) {
      setDisplayedValue("");
      return;
    }

    // Create a highlighted version of the query with filter keys wrapped in spans
    let highlightedQuery = query;
    const filterKeys = searchOptions.map((option) => option.label);

    // Regex to find filter patterns (filter_name: value)
    const filterRegex = new RegExp(`(${filterKeys.join("|")}):([^\\s]+)`, "g");

    // Replace filter patterns with highlighted versions
    highlightedQuery = highlightedQuery.replace(
      filterRegex,
      (match, filterName, filterValue) => {
        return `<span class="text-primary font-medium">${filterName}</span>:${filterValue}`;
      }
    );

    setDisplayedValue(highlightedQuery);
  };

  const parseSearchQuery = (
    query: string
  ): { rawQuery: string; filters: SearchFilter[] } => {
    const filters: SearchFilter[] = [];
    const regex = /(from|since_gp|before|after):([^\s]+)/g;
    let match;
    let rawQuery = query;

    while ((match = regex.exec(query)) !== null) {
      filters.push({ key: match[1], value: match[2] });
      // We don't remove the filters from rawQuery anymore
    }

    // Filter out the filter patterns from the raw query
    searchOptions.forEach((option) => {
      const filterPattern = new RegExp(`${option.label}:[^\\s]+`, "g");
      rawQuery = rawQuery.replace(filterPattern, "");
    });

    // Clean up extra spaces
    rawQuery = rawQuery.replace(/\s+/g, " ").trim();

    return { rawQuery, filters };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Parse the query to extract filters AND the raw query (without filters)
      const { rawQuery, filters } = parseSearchQuery(searchQuery);

      // Pass the raw query (without filters) and the parsed filters separately
      search(rawQuery, { filters });

      // Still navigate with the full query for display purposes
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
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
    highlightFilters(newQuery);

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
    highlightFilters(value);
  };

  return (
    <div ref={searchRef} className="relative w-full mb-12 mt-4">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          {/* Hidden actual input field for form handling */}
          <Input
            ref={inputRef}
            type="text"
            className="pr-12 h-[58px] absolute inset-0 z-10 bg-transparent text-transparent caret-foreground"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder='Example: "JAM consensus" from: user before: 2023-10'
          />

          {/* Visible styled display with highlighted filters */}
          <div
            className="pr-12 h-[58px] px-2 py-2 flex items-center pointer-events-none border border-input rounded-md bg-background text-foreground"
            aria-hidden="true"
          >
            {displayedValue ? (
              <div dangerouslySetInnerHTML={{ __html: displayedValue }} />
            ) : (
              <span className="text-muted-foreground">
                Example: "JAM consensus" from: user before: 2023-10
              </span>
            )}
          </div>
        </div>

        <Button
          variant="default"
          size="icon"
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0 bg-brand h-10 w-10 z-20"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
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
