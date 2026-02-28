/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import {
    CreateProductPayload,
    PaginatedResponse,
    Product,
    ProductListParams,
    SearchableProduct,
    SingleResponse,
} from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAxios, getAxios, postAxios, putAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';

const PRODUCTS_ENDPOINT = '/product';

/**
 * Hook to fetch a paginated list of products.
 * Accepts an optional params object which will be forwarded as query params.
 */
export function useFetchProducts(params: ProductListParams = {}, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<PaginatedResponse<Product>, unknown>({
        queryFn: async ({ signal }) => {
            try {
                setLoading(true);
                const response = await getAxios<PaginatedResponse<Product>>(PRODUCTS_ENDPOINT, params, signal);
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                // toast.error(msg);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['products', params],
        enabled,
    });
}

export function useFetchSearchAbleProducts() {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<PaginatedResponse<SearchableProduct>, unknown>({
        queryFn: async ({ signal }) => {
            try {
                setLoading(true);
                const response = await getAxios<PaginatedResponse<Product>>(`${PRODUCTS_ENDPOINT}/searchable`, signal);
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                // toast.error(msg);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['products', 'searchable'],
    });
}
/**
 * Hook to fetch a single product by id.
 */
export function useFetchProduct(id: string | undefined, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<SingleResponse<Product>, unknown>({
        queryFn: async () => {
            if (!id) return Promise.reject(new Error('Missing product id'));
            try {
                setLoading(true);
                const response = await getAxios<SingleResponse<Product>>(`${PRODUCTS_ENDPOINT}/${id}`);
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                // toast.error(msg);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['product', id],
        enabled: Boolean(id) && enabled,
    });
}

/**
 * Hook to create a new product.
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Product>, unknown, CreateProductPayload>({
        mutationFn: async (payload: CreateProductPayload) => {
            const response = await postAxios<SingleResponse<Product>, CreateProductPayload>(PRODUCTS_ENDPOINT, payload);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to create product');
                return;
            }

            toast.success(data.message || 'Product created successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                logoutFunc(msg);
            }
            // toast.error(msg);
            return Promise.reject(err);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
}

/**
 * Hook to update an existing product by id.
 * Expects variables: { id: string, payload: Partial<any> }
 */
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Product>, unknown, { id: string; payload: Partial<CreateProductPayload> }>({
        mutationFn: async ({ id, payload }) => {
            const response = await putAxios<SingleResponse<Product>, Partial<CreateProductPayload>>(`${PRODUCTS_ENDPOINT}/${id}`, payload);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, variables) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to update product');
                return;
            }

            toast.success(data.message || 'Product updated successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
            }
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                logoutFunc(msg);
            }
            // toast.error(msg);
            return Promise.reject(err);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
}

/**
 * Hook to delete a product by id.
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Product>, unknown, string>({
        mutationFn: async (id: string) => {
            const response = await deleteAxios<SingleResponse<Product>>(`${PRODUCTS_ENDPOINT}/${id}`);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, id) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to delete product');
                return;
            }

            toast.success(data.message || 'Product deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['product', id] });
            }
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                logoutFunc(msg);
            }
            toast.error(msg);
            return Promise.reject(err);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
}


