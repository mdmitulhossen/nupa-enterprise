/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import { PaginatedResponse, ShippingAddress, SingleResponse } from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAxios, patchAxios, postAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';
import { AccountInfo, OrderUser } from './orderService';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum QuoteStatus {
  PENDING    = 'PENDING',
  RESPONDED  = 'RESPONDED',
  ACCEPTED   = 'ACCEPTED',
  REJECTED   = 'REJECTED',
  PROCESSING = 'PROCESSING',
  SHIPPED    = 'SHIPPED',
  DELIVERED  = 'DELIVERED',
  CANCELLED  = 'CANCELLED',
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuoteItemSpecifications {
  [key: string]: string | number;
}

export interface QuoteItem {
  productId: string;
  quantity: number;
    name: string;
  specifications: QuoteItemSpecifications;
}

export interface Quote {
  id: string;
  quote_id: string;
  userId: string;
  message: string;
  phoneNumber: string;
  email: string;
  status: QuoteStatus;
  adminResponse: string | null;
  quotedPrice: number | null;
  shippingAddress: ShippingAddress | null;
  accountInfo: AccountInfo | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  quoteItems: QuoteItem[];
  user: OrderUser;
}

export interface CreateQuoteItemPayload {
  productId: string;
  quantity: number;
  name?: string;
  specifications: QuoteItemSpecifications;
}

export interface CreateQuotePayload {
  quoteItems: CreateQuoteItemPayload[];
  message: string;
  phoneNumber: string;
  email: string;
}

export interface MyQuotesParams {
  page?: number;
  limit?: number;
  status?: QuoteStatus;
}

export interface AllQuotesParams {
  page?: number;
  limit?: number;
  quote_id?: string;
  productId?: string;
  userId?: string;
  status?: QuoteStatus;
  startDate?: string;
  endDate?: string;
}

export interface RespondQuotePayload {
  adminResponse: string;
  quotedPrice: number;
}

export interface AcceptQuotePayload {
  shippingAddress: ShippingAddress;
  accountInfo: AccountInfo;
}

export interface UpdateQuoteStatusPayload {
  status: QuoteStatus;
}

export interface CancelQuotePayload {
  reason: string;
}

// ─── Endpoint ─────────────────────────────────────────────────────────────────

const QUOTES_ENDPOINT = '/quote';

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Hook to create a new quote request (POST /quote)
 */
export function useCreateQuote() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<SingleResponse<Quote>, unknown, CreateQuotePayload>({
    mutationFn: async (payload: CreateQuotePayload) => {
      const response = await postAxios<SingleResponse<Quote>, CreateQuotePayload>(
        QUOTES_ENDPOINT,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to submit quote request');
        return;
      }
      toast.success(data.message || 'Quote request submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
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

/**
 * Hook to fetch current user's quotes (GET /quote/my-quotes)
 */
export function useFetchMyQuotes(params: MyQuotesParams = {}, enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<PaginatedResponse<Quote>, unknown>({
    queryFn: async ({ signal }) => {
      try {
        setLoading(true);
        const response = await getAxios<PaginatedResponse<Quote>>(
          `${QUOTES_ENDPOINT}/my-quotes`,
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
        return await Promise.reject(new Error(msg));
      } finally {
        setLoading(false);
      }
    },
    queryKey: ['my-quotes', params],
    enabled,
  });
}

/**
 * Hook to fetch all quotes — admin (GET /quote/all)
 */
export function useFetchAllQuotes(params: AllQuotesParams = {}, enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<PaginatedResponse<Quote>, unknown>({
    queryFn: async ({ signal }) => {
      try {
        setLoading(true);
        const response = await getAxios<PaginatedResponse<Quote>>(
          `${QUOTES_ENDPOINT}/all`,
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
        return await Promise.reject(new Error(msg));
      } finally {
        setLoading(false);
      }
    },
    queryKey: ['quotes', params],
    enabled,
  });
}

/**
 * Hook to fetch a single quote by id (GET /quote/:id)
 */
export function useFetchQuote(id: string | undefined, enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<SingleResponse<Quote>, unknown>({
    queryFn: async () => {
      if (!id) return Promise.reject(new Error('Missing quote id'));
      try {
        setLoading(true);
        const response = await getAxios<SingleResponse<Quote>>(
          `${QUOTES_ENDPOINT}/${id}`
        );
        return formatResponse(response);
      } catch (error: unknown) {
        const msg = extractErrorMsg(error);
        if ((error as any)?.response?.status === 401) {
          logoutFunc(msg);
          return await Promise.reject(new Error(msg));
        }
        return await Promise.reject(new Error(msg));
      } finally {
        setLoading(false);
      }
    },
    queryKey: ['quote', id],
    enabled: Boolean(id) && enabled,
  });
}

/**
 * Hook to respond to a quote — admin (PATCH /quote/:id/respond)
 */
export function useRespondToQuote() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<
    SingleResponse<Quote>,
    unknown,
    { id: string; payload: RespondQuotePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Quote>, RespondQuotePayload>(
        `${QUOTES_ENDPOINT}/${id}/respond`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to respond to quote');
        return;
      }
      toast.success(data.message || 'Quote response sent successfully');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
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

/**
 * Hook to accept a quote — user (PATCH /quote/:id/accept)
 */
export function useAcceptQuote() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<
    SingleResponse<Quote>,
    unknown,
    { id: string; payload: AcceptQuotePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Quote>, AcceptQuotePayload>(
        `${QUOTES_ENDPOINT}/${id}/accept`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to accept quote');
        return;
      }
      toast.success(data.message || 'Quote accepted successfully');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
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

/**
 * Hook to update quote status — admin (PATCH /quote/:id/status)
 */
export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<
    SingleResponse<Quote>,
    unknown,
    { id: string; payload: UpdateQuoteStatusPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Quote>, UpdateQuoteStatusPayload>(
        `${QUOTES_ENDPOINT}/${id}/status`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to update quote status');
        return;
      }
      toast.success(data.message || 'Quote status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
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

/**
 * Hook to cancel a quote (PATCH /quote/:id/cancel)
 */
export function useCancelQuote() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<
    SingleResponse<Quote>,
    unknown,
    { id: string; payload: CancelQuotePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Quote>, CancelQuotePayload>(
        `${QUOTES_ENDPOINT}/${id}/cancel`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to cancel quote');
        return;
      }
      toast.success(data.message || 'Quote cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
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