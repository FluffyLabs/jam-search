import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchForm = () => {
  const { search } = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full mb-12 mt-4">
      <Input
        type="text"
        placeholder='Example : "How does the consensus mechanism work in JAM?"'
        className="pr-12 h-[58px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
  );
};
