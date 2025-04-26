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
  const navigate = useNavigate();

  const searchOptions = [
    { label: "from", description: "Messages from a specific user" },
    {
      label: "graypaper",
      description: "Find messages from a specific graypaper version",
    },
  ];

  // Update the search input when initialQuery changes
  useEffect(() => {
    setSearchQuery(initialQuery);
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

  const parseSearchQuery = (
    query: string
  ): { rawQuery: string; filters: SearchFilter[] } => {
    const filters: SearchFilter[] = [];
    const regex = /(from|graypaper):([^\s]+)/g;
    let match;
    let rawQuery = query;

    while ((match = regex.exec(query)) !== null) {
      filters.push({ key: match[1], value: match[2] });
      rawQuery = rawQuery.replace(match[0], "").trim();
    }

    return { rawQuery, filters };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Parse the query to extract filters
      const { filters } = parseSearchQuery(searchQuery);

      // Pass both the full query string (for display/navigation) and the parsed filters
      search(searchQuery, { filters });
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const addSearchOption = (option: string) => {
    setSearchQuery((prev) => `${prev} ${option}:`);
    // Keep focus on input after adding option
    const inputElement = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full mb-12 mt-4">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          type="text"
          placeholder='Example : "How does the consensus mechanism work in JAM?"'
          className="pr-12 h-[58px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <Button
          variant="default"
          size="icon"
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0 bg-brand h-10 w-10"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-10">
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
