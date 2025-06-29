"use client";

import { FC, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";

interface HeaderSearchProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const HeaderSearch: FC<HeaderSearchProps> = ({
  className,
  onSearch,
  placeholder = "Buscar eventos, artistas, venues...",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsExpanded(false);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      {/* Search Button (Collapsed) */}
      {!isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Buscar eventos"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}

      {/* Search Form (Expanded) */}
      {isExpanded && (
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={cn(
                "h-9 w-64 pl-10 pr-10 rounded-md border border-input",
                "bg-background/50 backdrop-blur-sm",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "transition-all duration-200"
              )}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
