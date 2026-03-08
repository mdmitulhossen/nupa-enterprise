/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import { extractErrorMsg, formatResponse, logoutFunc } from '@/utils/commonUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAxios, getAxios, patchAxios, postAxios } from '../axios/generic-api-calls';

const CONTACTS_ENDPOINT = '/contact';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED' | string;
  adminResponse?: string | null;
  resolvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateContactPayload {
  name?: string;
  phone?: string;
  status?: string;
  adminResponse?: string | null;
  // other updatable fields...
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    meta: { page: number; limit: number; total: number };
    data: T[];
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Fetch contacts (GET /contact)
 */
export function useFetchContacts(params: ContactListParams = {}, enabled = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<PaginatedResponse<Contact>, unknown>({
    queryFn: async ({ signal }) => {
      try {
        setLoading(true);
        const response = await getAxios<PaginatedResponse<Contact>>(CONTACTS_ENDPOINT, params, signal);
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
    queryKey: ['contacts', params],
    enabled,
  });
}

/**
 * Fetch single contact (GET /contact/:id)
 */
export function useFetchContact(id: string | undefined, enabled = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<SingleResponse<Contact>, unknown>({
    queryFn: async () => {
      if (!id) return Promise.reject(new Error('Missing contact id'));
      try {
        setLoading(true);
        const response = await getAxios<SingleResponse<Contact>>(`${CONTACTS_ENDPOINT}/${id}`);
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
    queryKey: ['contact', id],
    enabled: Boolean(id) && enabled,
  });
}

/**
 * Create contact (POST /contact)
 */
export function useCreateContact() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<SingleResponse<Contact>, unknown, CreateContactPayload>({
    mutationFn: async (payload) => {
      const response = await postAxios<SingleResponse<Contact>, CreateContactPayload>(CONTACTS_ENDPOINT, payload);
      return formatResponse(response);
    },
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to submit contact');
        return;
      }
      toast.success('Your message has been sent. We will get back to you soon!');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
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
    onSettled: () => setLoading(false),
  });
}

/**
 * Update contact (PATCH /contact/:id)
 */
export function useUpdateContact() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<SingleResponse<Contact>, unknown, { id: string; payload: UpdateContactPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Contact>, any>(`${CONTACTS_ENDPOINT}/${id}`, payload as any);
      return formatResponse(response);
    },
    onMutate: () => setLoading(true),
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to update contact');
        return;
      }
      toast.success(data.message || 'Contact updated');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      if (variables?.id) queryClient.invalidateQueries({ queryKey: ['contact', variables.id] });
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
    onSettled: () => setLoading(false),
  });
}

/**
 * Delete contact (DELETE /contact/:id)
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<SingleResponse<Contact>, unknown, string>({
    mutationFn: async (id: string) => {
      const response = await deleteAxios<SingleResponse<Contact>>(`${CONTACTS_ENDPOINT}/${id}`);
      return formatResponse(response);
    },
    onMutate: () => setLoading(true),
    onSuccess: (data, id) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to delete contact');
        return;
      }
      toast.success(data.message || 'Contact deleted');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['contact', id] });
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
    onSettled: () => setLoading(false),
  });
}