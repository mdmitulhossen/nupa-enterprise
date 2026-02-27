import { useState } from "react";

const PAGE_SIZE = 10;

export interface ProductFilters {
    searchTerm: string;
    categoryId: string;
    status: string;
    productType: string;
    isActive: string;   // "all" | "true" | "false"
    isFeature: string;  // "all" | "true" | "false"
    page: number;
}

const initialFilters: ProductFilters = {
    searchTerm: "",
    categoryId: "all",
    status: "all",
    productType: "all",
    isActive: "all",
    isFeature: "all",
    page: 1,
};

export function useProductFilters() {
    const [filters, setFilters] = useState<ProductFilters>(initialFilters);

    const setFilter = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            // reset page on filter change
            ...(key !== "page" ? { page: 1 } : {}),
        }));
    };

    const reset = () => setFilters(initialFilters);

    const toQueryParams = () => ({
        page: filters.page,
        limit: PAGE_SIZE,
        searchTerm: filters.searchTerm || undefined,
        categoryId: filters.categoryId !== "all" ? filters.categoryId : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        productType: filters.productType !== "all" ? filters.productType : undefined,
        isActive: filters.isActive !== "all" ? filters.isActive === "true" : undefined,
        isFeature: filters.isFeature !== "all" ? filters.isFeature === "true" : undefined,
    });

    return { filters, setFilter, reset, toQueryParams, pageSize: PAGE_SIZE };
}
