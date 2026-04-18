/* eslint-disable react-hooks/exhaustive-deps */

import MainLayout from "@/components/layout/MainLayout";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductCard from "@/components/products/ProductCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Badge } from "@/components/ui/badge";
import { productAvailability } from "@/data/products";
import { useTitle } from '@/hooks/useTitle';
import { useFetchCategories } from '@/services/categoryService';
import { useFetchIndustries } from '@/services/industryService';
import { useFetchProducts, useFetchSearchAbleProducts } from '@/services/productService';
import { ProductListParams } from '@/types/product';
import { debounce } from 'lodash';
import { Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  useTitle("NUPA Enterprise - Products");
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999999]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilters, setDebouncedFilters] = useState<ProductListParams>({});

  // flag: true after we've done the initial seed from URL
  const initialised = useRef(false);

  // Fetch dynamic data
  const { data: categoriesData } = useFetchCategories();
  const { data: industriesData } = useFetchIndustries();
  const { data: searchableData } = useFetchSearchAbleProducts();

  // ── 1. seed state from URL (runs once on mount + if the user uses back/forward) ──
  useEffect(() => {
    const q   = searchParams.get("searchTerm") ?? "";
    const cat = searchParams.get("cat") ?? "";

    setSearchQuery(q);
    setSelectedCategories(cat ? cat.split(",").filter(Boolean) : []);

    // mark as ready so effect #2 can start writing
    initialised.current = true;
  }, []); // intentionally only on mount

  // ── 2. keep URL in sync whenever filters change (skips the very first render) ──
  useEffect(() => {
    if (!initialised.current) return;

    const params: Record<string, string> = {};
    if (searchQuery)              params.searchTerm = searchQuery;
    if (selectedCategories.length) params.cat       = selectedCategories.join(",");

    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategories]);



  // ── 3. reset page on any filter change ──
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedIndustries, selectedAvailability, priceRange, searchQuery, sortBy]);

  // ── 4. debounce → build API params ──
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedFilters({
        page: currentPage,
        limit: 12,
        isActive: true,
        searchTerm:  searchQuery || undefined,
        categoryId:  selectedCategories.length ? selectedCategories : undefined,
        industryId:  selectedIndustries.length  ? selectedIndustries  : undefined,
        status:      selectedAvailability || undefined,
        minPrice:    priceRange[0] > 0       ? priceRange[0] : undefined,
        maxPrice:    priceRange[1] < 300000  ? priceRange[1] : undefined,
        sortBy:      sortBy !== 'default'    ? sortBy        : undefined,
        sortOrder:   sortBy === 'price-high' ? 'desc'        : 'asc',
        productType: ["ALL","BUY_ONLINE"],
      });
    }, 300);

    handler();
    return () => handler.cancel();
  }, [currentPage, selectedCategories, selectedIndustries, selectedAvailability, priceRange, searchQuery, sortBy]);

  const { data: productsData, isLoading } = useFetchProducts(debouncedFilters);

  // Prepare filter data
  const categories  = categoriesData?.data?.map(c => ({ id: c.id, name: c.name })) || [];
  const industries  = industriesData?.data?.map(i => ({ id: i.id, name: i.name })) || [];
  const filterTags  = searchableData?.data?.map(item => item.name) || [];

  // Pagination
  const totalPages = Math.ceil((productsData?.meta?.total || 0) / (productsData?.meta?.limit || 12));
  const generatePages = (current: number, total: number) => {
    const pages: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 4) pages.push("...");
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
      if (current < total - 3) pages.push("...");
      pages.push(total);
    }
    return pages;
  };
  const pages = generatePages(currentPage, totalPages);

    // clear all filters helper
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedIndustries([]);
    setSelectedAvailability("");
    setPriceRange([0, 99999999]);
    setSortBy("default");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedIndustries.length > 0 ||
    selectedAvailability ||
    priceRange[0] > 0 ||
    priceRange[1] < 99999999 ||
    sortBy !== "default";

  return (
    <MainLayout>
      <PageBanner title="All Products" subtitle={`${productsData?.meta?.total || 0} Products Found`} />

      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Products" }]} />

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filterTags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setSearchQuery(tag)}
            >
              {tag}
            </Badge>
          ))}

        </div>
        <div className="mb-4">
                           {/* Clear Filters button — only visible when at least one filter is active */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto text-sm text-destructive hover:underline underline-offset-2 transition-colors underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <FilterSidebar
            categories={categories}
            industries={industries}
            availability={productAvailability}
            selectedCategories={selectedCategories}
            selectedIndustries={selectedIndustries}
            selectedAvailability={selectedAvailability}
            priceRange={priceRange}
            maxPrice={99999999}
            onCategoryChange={setSelectedCategories}
            onIndustryChange={setSelectedIndustries}
            onAvailabilityChange={setSelectedAvailability}
            onPriceRangeChange={setPriceRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {productsData?.data?.length || 0} products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {
              isLoading ? (
                <div className="col-span-full text-center py-16 text-muted-foreground w-full flex justify-center">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                </div>
              ) :
               !productsData?.data?.length ? (
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
                >←</button>

                {pages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={typeof page !== 'number'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      page === currentPage
                        ? "bg-foreground text-background"
                        : typeof page === 'number'
                          ? "bg-muted hover:bg-muted-foreground/20"
                          : "cursor-default"
                    }`}
                  >{page}</button>
                ))}

                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >→</button>
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