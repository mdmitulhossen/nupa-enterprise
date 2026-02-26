/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import {
    Category,
    CategoryListParams,
    CreateCategoryPayload,
    PaginatedResponse,
    SingleResponse,
} from '@/types/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAxios, getAxios, patchAxios, postAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';

const CATEGORIES_ENDPOINT = '/category';

export function useFetchCategories(params: CategoryListParams = {}, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<PaginatedResponse<Category>, unknown>({
        queryFn: async ({ signal }) => {
            try {
                setLoading(true);
                const response = await getAxios<PaginatedResponse<Category>>(CATEGORIES_ENDPOINT, params, signal);
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                toast.error(msg);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['categories', params],
        enabled,
    });
}

export function useFetchCategory(id: string | undefined, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<SingleResponse<Category>, unknown>({
        queryFn: async () => {
            if (!id) return Promise.reject(new Error('Missing category id'));
            try {
                setLoading(true);
                const response = await getAxios<SingleResponse<Category>>(`${CATEGORIES_ENDPOINT}/${id}`);
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                toast.error(msg);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['category', id],
        enabled: Boolean(id) && enabled,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Category>, unknown, CreateCategoryPayload | FormData>({
        mutationFn: async (payload) => {
            const response = await postAxios<SingleResponse<Category>, any>(CATEGORIES_ENDPOINT, payload as any);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to create category');
                return;
            }

            toast.success(data.message || 'Category created successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
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

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Category>, unknown, { id: string; payload: Partial<CreateCategoryPayload> | FormData }>({
        mutationFn: async ({ id, payload }) => {
            const response = await patchAxios<SingleResponse<Category>, any>(`${CATEGORIES_ENDPOINT}/${id}`, payload as any);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, variables) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to update category');
                return;
            }

            toast.success(data.message || 'Category updated successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
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

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Category>, unknown, string>({
        mutationFn: async (id: string) => {
            const response = await deleteAxios<SingleResponse<Category>>(`${CATEGORIES_ENDPOINT}/${id}`);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, id) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to delete category');
                return;
            }

            toast.success(data.message || 'Category deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['category', id] });
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
