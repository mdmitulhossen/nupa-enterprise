
import MainLayout from "@/components/layout/MainLayout";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductCard from "@/components/products/ProductCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Badge } from "@/components/ui/badge";
import {
  productAvailability
} from "@/data/products";
import { useTitle } from '@/hooks/useTitle';
import { useFetchCategories } from '@/services/categoryService';
import { useFetchIndustries } from '@/services/industryService';
import { useFetchProducts, useFetchSearchAbleProducts } from '@/services/productService';
import { ProductListParams } from '@/types/product';
import { debounce } from 'lodash';
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const Products = () => {
  useTitle("NUPA Enterprise - Products");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilters, setDebouncedFilters] = useState<ProductListParams>({});

  // Fetch dynamic data
  const { data: categoriesData } = useFetchCategories();
  const { data: industriesData } = useFetchIndustries();
  const { data: searchableData } = useFetchSearchAbleProducts();

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedIndustries, selectedAvailability, priceRange, searchQuery, sortBy]);

  // Debounce filter changes
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedFilters({
        page: currentPage,
        limit: 12,
        searchTerm: searchQuery || undefined,
        categoryId: selectedCategories.length > 0 ? selectedCategories : undefined,
        industryId: selectedIndustries.length > 0 ? selectedIndustries : undefined,
        status: selectedAvailability || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 300000 ? priceRange[1] : undefined,
        sortBy: sortBy !== 'default' ? sortBy : undefined,
        sortOrder: sortBy === 'price-high' ? 'desc' : 'asc',
      });
    }, 300);

    handler();

    return () => handler.cancel();
  }, [currentPage, selectedCategories, selectedIndustries, selectedAvailability, priceRange, searchQuery, sortBy]);

  const { data: productsData, isLoading } = useFetchProducts(debouncedFilters);

  // Prepare filter data
  const categories = categoriesData?.data?.map(cat => ({ id: cat.id, name: cat.name })) || [];
  const industries = industriesData?.data?.map(ind => ({ id: ind.id, name: ind.name })) || [];
  const filterTags = searchableData?.data?.map(item => item.name) || [];

  // Pagination logic
  const totalPages = Math.ceil((productsData?.meta?.total || 0) / (productsData?.meta?.limit || 12));
  const generatePages = (current: number, total: number) => {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 4) pages.push("...");
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 3) pages.push("...");
      pages.push(total);
    }
    return pages;
  };
  const pages = generatePages(currentPage, totalPages);


  return (
    <MainLayout>
      <PageBanner title="All Products" subtitle={`${productsData?.meta?.total || 0} Products Found`} />

      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Products" }]} />

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterTags.map((tag, index) => (
            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted transition-colors" onClick={() => setSearchQuery(tag)}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar
            categories={categories}
            industries={industries}
            availability={productAvailability}
            selectedCategories={selectedCategories}
            selectedIndustries={selectedIndustries}
            selectedAvailability={selectedAvailability}
            priceRange={priceRange}
            maxPrice={300000}
            onCategoryChange={setSelectedCategories}
            onIndustryChange={setSelectedIndustries}
            onAvailabilityChange={setSelectedAvailability}
            onPriceRangeChange={setPriceRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {productsData?.data?.length || 0} products
              </p>
              {/* <div className="flex items-center gap-2">
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
              </div> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {!productsData?.data || productsData?.data?.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                </div>
              ) : (
                productsData.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  ←
                </button>
                {pages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={typeof page !== 'number'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${page === currentPage
                      ? "bg-foreground text-background"
                      : typeof page === 'number'
                        ? "bg-muted hover:bg-muted-foreground/20"
                        : "cursor-default"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CTASection />
    </MainLayout>
  );
};

export default Products;
