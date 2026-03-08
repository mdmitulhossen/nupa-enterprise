/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAxios, putAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';

const CMS_ENDPOINT = '/cms';

export interface Faq {
  question: string;
  answer: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
}

export interface SocialLink {
  name: string;
  key: string;
  url: string;
}

export interface CmsData {
  id?: string;
  faqs?: Faq[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Fetch CMS (GET /cms)
 */
export function useFetchCms(enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<SingleResponse<CmsData>, unknown>({
    queryFn: async ({ signal }) => {
      try {
        setLoading(true);
        const resp = await getAxios<SingleResponse<CmsData>>(CMS_ENDPOINT, {}, signal);
        return formatResponse(resp);
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
    queryKey: ['cms'],
    enabled,
  });
}

/**
 * Update CMS (PUT /cms)
 * payload should include the editable cms fields (faqs, contactInfo, socialLinks, policies...)
 */
export function useUpdateCms() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<SingleResponse<CmsData>, unknown, Partial<CmsData>>({
    mutationFn: async (payload) => {
      const resp = await putAxios<SingleResponse<CmsData>, any>(CMS_ENDPOINT, payload as any);
      return formatResponse(resp);
    },
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to update CMS');
        return;
      }
      toast.success(data.message || 'CMS updated successfully');
      queryClient.invalidateQueries({ queryKey: ['cms'] });
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