// types/rating.types.ts
export interface RatingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

export interface RatingProduct {
  id: string;
  p_id: string;
  name: string;
}

export interface Rating {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  description: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  user: RatingUser;
  product: RatingProduct;
}

export interface RatingListParams {
  page?: number;
  limit?: number;
  productId?: string;
  isFeatured?:boolean
}

export interface CreateRatingPayload {
  productId: string;
  rating: number;
  description: string;
}

export interface UpdateRatingPayload {
  rating?: number;
  description?: string;
  isFeatured?: boolean;
}

// services/ratingService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import { PaginatedResponse, SingleResponse } from '@/types/industry';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAxios, getAxios, patchAxios, postAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';

const RATINGS_ENDPOINT = '/rating';

export function useFetchRatings(params: RatingListParams = {}, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<PaginatedResponse<Rating>, unknown>({
        queryFn: async ({ signal }) => {
            try {
                setLoading(true);
                const response = await getAxios<PaginatedResponse<Rating>>(
                    RATINGS_ENDPOINT,
                    params,
                    signal
                );
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                setLoading(false);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['ratings', params],
        enabled,
    });
}

export function useFetchRating(id: string | undefined, enabled: boolean = true) {
    const setLoading = useUiStore((s) => s.setLoading);

    return useQuery<SingleResponse<Rating>, unknown>({
        queryFn: async () => {
            if (!id) return Promise.reject(new Error('Missing rating id'));
            try {
                setLoading(true);
                const response = await getAxios<SingleResponse<Rating>>(
                    `${RATINGS_ENDPOINT}/${id}`
                );
                return formatResponse(response);
            } catch (error: unknown) {
                const msg = extractErrorMsg(error);
                if ((error as any)?.response?.status === 401) {
                    logoutFunc(msg);
                    return await Promise.reject(new Error(msg));
                }
                setLoading(false);
                return await Promise.reject(new Error(msg));
            } finally {
                setLoading(false);
            }
        },
        queryKey: ['rating', id],
        enabled: Boolean(id) && enabled,
    });
}

export function useCreateRating() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Rating>, unknown, CreateRatingPayload>({
        mutationFn: async (payload) => {
            const response = await postAxios<SingleResponse<Rating>, CreateRatingPayload>(
                RATINGS_ENDPOINT,
                payload
            );
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to create rating');
                return;
            }
            toast.success(data.message || 'Rating created successfully');
            queryClient.invalidateQueries({ queryKey: ['ratings'] });
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

export function useUpdateRating() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Rating>,
        unknown,
        { id: string; payload: UpdateRatingPayload }
    >({
        mutationFn: async ({ id, payload }) => {
            const response = await patchAxios<SingleResponse<Rating>, UpdateRatingPayload>(
                `${RATINGS_ENDPOINT}/${id}`,
                payload
            );
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, variables) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to update rating');
                return;
            }
            toast.success(data.message || 'Rating updated successfully');
            queryClient.invalidateQueries({ queryKey: ['ratings'] });
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ['rating', variables.id] });
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

export function useDeleteRating() {
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<Rating>, unknown, string>({
        mutationFn: async (id: string) => {
            const response = await deleteAxios<SingleResponse<Rating>>(
                `${RATINGS_ENDPOINT}/${id}`
            );
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data, id) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to delete rating');
                return;
            }
            toast.success(data.message || 'Rating deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['ratings'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['rating', id] });
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