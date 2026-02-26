export interface Category {
    id: string;
    name: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
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

export interface CategoryListParams {
    page?: number | string;
    limit?: number | string;
    searchTerm?: string;
}

export interface CreateCategoryPayload {
    name: string;
    image?: string | File;
}
