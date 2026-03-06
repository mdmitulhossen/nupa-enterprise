

export type ProductStatus = 'IN_STOCK' | 'UPCOMING' | 'OUT_OF_STOCK' | string;
export type ProductType = 'BUY_ONLINE' | 'QUOTATION' | string;

export interface ProductVariation {
    depth?: number;
    width?: number;
    height?: number;
    price: number;
    stock: number;
    sku: string;
}

export interface CategorySummary {
    id: string;
    name: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IndustrySummary {
    id: string;
    name: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Rating {
    average: number;
    total: number;
}

export interface SearchableProduct {
    id: string;
    p_id?: string;
    name: string;
}

export interface Product {
    id: string;
    p_id?: string;
    name: string;
    categoryId: string;
    industryId: string;
    productType?: ProductType;
    shortDescription?: string;
    detailedDescription?: string;
    mainProductImage?: string;
    galleryProductImages?: string[];
    minimumOrderQuantity?: number;
    productVariations?: ProductVariation[];
    status?: ProductStatus;
    isActive?: boolean;
    isFeature?: boolean;
    isShowInSearch?: boolean;
    offer?: number;
    createdAt?: string;
    updatedAt?: string;
    category?: CategorySummary;
    industry?: IndustrySummary;
    rating?: Rating;
    relatedProducts?: Product[];
}

export interface Meta {
    page: number;
    limit: number;
    total: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message?: string;
    meta: Meta;
    data: T[];
}

export interface SingleResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface ProductListParams {
    page?: number | string;
    limit?: number | string;
    searchTerm?: string;
    name?: string | string[]; // comma-separated or multiple
    categoryId?: string | string[];
    industryId?: string | string[];
    status?: string | string[]; // e.g. IN_STOCK,UPCOMING
    productType?: string;
    minPrice?: number | string;
    maxPrice?: number | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc' | string;
    isActive?: boolean | string;
    isFeature?: boolean | string;
}

export interface CreateProductPayload {
    name?: string;
    categoryId?: string;
    industryId?: string;
    productType?: ProductType;
    shortDescription?: string;
    detailedDescription?: string;
    mainProductImage?: string;
    galleryProductImages?: string[];
    minimumOrderQuantity?: number;
    productVariations?: ProductVariation[];
    status?: ProductStatus;
    isActive?: boolean;
    isFeature?: boolean;
    isShowInSearch?: boolean;
    offer?: number;
}


export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  district: string;
  thana: string;
  division: string;
  postalCode: string;
  deliveryNote: string;
}