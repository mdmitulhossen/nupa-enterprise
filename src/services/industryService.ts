/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import {
    CreateIndustryPayload,
    Industry,
    IndustryListParams,
    PaginatedResponse,
    SingleResponse,
} from '@/types/industry';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAxios, getAxios, patchAxios, postAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';

const INDUSTRIES_ENDPOINT = '/industry';

export function useFetchIndustries(params: IndustryListParams = {}, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<PaginatedResponse<Industry>, unknown>({
        queryFn: async ({ signal }) => {
            try {
                setLoading(true);
                const response = await getAxios<PaginatedResponse<Industry>>(INDUSTRIES_ENDPOINT, params, signal);
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                // toast.error(msg);
                setLoading(false);
                return await Promise.reject(new Error(msg));

            } finally {
                setLoading(false);
            }
        },
        queryKey: ['industries', params],
        enabled,
    });
}

export function useFetchIndustry(id: string | undefined, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<SingleResponse<Industry>, unknown>({
        queryFn: async () => {
            if (!id) return Promise.reject(new Error('Missing industry id'));
            try {
                setLoading(true);
                const response = await getAxios<SingleResponse<Industry>>(`${INDUSTRIES_ENDPOINT}/${id}`);
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                // toast.error(msg);
                setLoading(false);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['industry', id],
        enabled: Boolean(id) && enabled,
    });
}

export function useCreateIndustry() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Industry>, unknown, CreateIndustryPayload | FormData>({
        mutationFn: async (payload) => {
            const response = await postAxios<SingleResponse<Industry>, any>(INDUSTRIES_ENDPOINT, payload as any);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to create industry');
                return;
            }

            toast.success(data.message || 'Industry created successfully');
            queryClient.invalidateQueries({ queryKey: ['industries'] });
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                logoutFunc(msg);
            }
            toast.error(msg);
            setLoading(false);
            return Promise.reject(err);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
}

export function useUpdateIndustry() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Industry>, unknown, { id: string; payload: Partial<CreateIndustryPayload> | FormData }>({
        mutationFn: async ({ id, payload }) => {
            const response = await patchAxios<SingleResponse<Industry>, any>(`${INDUSTRIES_ENDPOINT}/${id}`, payload as any);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, variables) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to update industry');
                return;
            }

            toast.success(data.message || 'Industry updated successfully');
            queryClient.invalidateQueries({ queryKey: ['industries'] });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ['industry', variables.id] });
            }
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                logoutFunc(msg);
            }
            toast.error(msg);
            setLoading(false);
            return Promise.reject(err);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
}

export function useDeleteIndustry() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Industry>, unknown, string>({
        mutationFn: async (id: string) => {
            const response = await deleteAxios<SingleResponse<Industry>>(`${INDUSTRIES_ENDPOINT}/${id}`);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, id) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to delete industry');
                return;
            }

            toast.success(data.message || 'Industry deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['industries'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['industry', id] });
            }
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                logoutFunc(msg);
            }
            toast.error(msg);
            setLoading(false);
            return Promise.reject(err);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
}
