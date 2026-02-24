import MainLayout from "@/components/layout/MainLayout";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductCard from "@/components/products/ProductCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Badge } from "@/components/ui/badge";
import {
  demoProducts,
  filterTags,
  productAvailability,
  productCategories,
  productIndustries,
} from "@/data/products";
import { useTitle } from '@/hooks/useTitle';
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Products = () => {
  useTitle("NUPA Enterprise - Products");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("supershop");
  const [selectedAvailability, setSelectedAvailability] = useState("instock");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  return (
    <MainLayout>
      <PageBanner title="All Products" subtitle="10 Products Found" />

      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Products" }]} />

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterTags.map((tag, index) => (
            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar
            categories={productCategories}
            industries={productIndustries}
            availability={productAvailability}
            selectedCategory={selectedCategory}
            selectedIndustry={selectedIndustry}
            selectedAvailability={selectedAvailability}
            priceRange={priceRange}
            maxPrice={300000}
            onCategoryChange={setSelectedCategory}
            onIndustryChange={setSelectedIndustry}
            onAvailabilityChange={setSelectedAvailability}
            onPriceRangeChange={setPriceRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {demoProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-muted rounded-lg text-sm outline-none appearance-none pr-8"
                  style={{ backgroundImage: "none" }}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
                <ChevronDown className="w-4 h-4 -ml-6 pointer-events-none text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {demoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button className="w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors">
                ←
              </button>
              {[1, 2, 3, 4, "...", 10].map((page, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    page === 1
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted-foreground/20"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </MainLayout>
  );
};

export default Products;
