import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

interface FilterCategory {
  id: string;
  name: string;
  count?: number;
}

interface FilterSidebarProps {
  categories: FilterCategory[];
  industries: FilterCategory[];
  availability: FilterCategory[];
  selectedCategories: string[];
  selectedIndustries: string[];
  selectedAvailability: string;
  priceRange: [number, number];
  maxPrice: number;
  onCategoryChange: (ids: string[]) => void;
  onIndustryChange: (ids: string[]) => void;
  onAvailabilityChange: (id: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FilterSidebar = ({
  categories,
  industries,
  availability,
  selectedCategories,
  selectedIndustries,
  selectedAvailability,
  priceRange,
  maxPrice,
  onCategoryChange,
  onIndustryChange,
  onAvailabilityChange,
  onPriceRangeChange,
  searchQuery,
  onSearchChange,
}: FilterSidebarProps) => {
  return (
    <div className="w-full lg:w-64 space-y-6">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-primary" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Categories</h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  if (selectedCategories.includes(cat.id)) {
                    onCategoryChange(selectedCategories.filter(id => id !== cat.id));
                  } else {
                    onCategoryChange([...selectedCategories, cat.id]);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategories.includes(cat.id)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
                  }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Industries */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Industries</h3>
        <ul className="space-y-1">
          {industries.map((ind) => (
            <li key={ind.id}>
              <button
                onClick={() => {
                  if (selectedIndustries.includes(ind.id)) {
                    onIndustryChange(selectedIndustries.filter(id => id !== ind.id));
                  } else {
                    onIndustryChange([...selectedIndustries, ind.id]);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedIndustries.includes(ind.id)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
                  }`}
              >
                {ind.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Availability</h3>
        <ul className="space-y-1">
          {availability.map((avail) => (
            <li key={avail.id}>
              <button
                onClick={() => {
                  onAvailabilityChange(selectedAvailability === avail.id ? '' : avail.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedAvailability === avail.id
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
                  }`}
              >
                {avail.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          max={maxPrice}
          step={1000}
          onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
          className="mb-4"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm text-center">
            {priceRange[0].toLocaleString()}
          </div>
          <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm text-center">
            {priceRange[1].toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
