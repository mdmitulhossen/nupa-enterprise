import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import { useCallback, useMemo } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  debounceMs?: number;
}

const SearchFilter = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  filterPlaceholder = "All Status",
  debounceMs = 300,
}: SearchFilterProps) => {
  const debouncedSearch = useMemo(
    () => debounce(onSearchChange, debounceMs),
    [onSearchChange, debounceMs]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      debouncedSearch(newValue);
    },
    [debouncedSearch]
  );

  return (
    <div className="bg-background rounded-xl border border-border p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            defaultValue={searchValue}
            onChange={handleSearchChange}
            className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Dropdown */}
        {filterOptions && onFilterChange && (
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={filterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
