/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAxios, patchAxios, postAxios } from "@/axios/generic-api-calls";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useUiStore } from "@/store/useUiStore";
import { PaginatedResponse, SingleResponse } from "@/types/product";
import { extractErrorMsg, formatResponse, logoutFunc } from "@/utils/commonUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// types/auth.types.ts
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: string;
  image: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface CreateSocialUserPayload {
  name: string;
  email: string;
  image?: string;
  provider: string;
  privacyPolicyAccepted: boolean;
}

// types/user.types.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  image: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  status: UserStatus;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // phoneNumber?: string;
  // address?: string;
  privacyPolicyAccepted: boolean;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  address?: string | null;
}


// services/user.service.ts
const USERS_ENDPOINT = "/user";

export function useFetchUsers(
  params: UserQueryParams = {},
  enabled: boolean = true
) {
  const setLoading = useUiStore((s) => s.setLoading);
  const { page = 1, limit = 10, searchTerm } = params;

  return useQuery<PaginatedResponse<User>, unknown>({
    queryFn: async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          ...(searchTerm && { searchTerm }),
        });

        const response = await getAxios<PaginatedResponse<User>>(
          `${USERS_ENDPOINT}?${queryParams.toString()}`
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
    queryKey: ["users", page, limit, searchTerm],
    enabled,
  });
}

export function useCreateSocialUser() {
    const setLoading = useUiStore((s) => s.setLoading);
        const authStore = useAuthStore();
        const userStore = useUserStore();
        const queryClient = useQueryClient();

    return useMutation<SingleResponse<AuthTokenResponse>, unknown, CreateSocialUserPayload>({
        mutationFn: async (payload) => {
            const response = await postAxios<SingleResponse<AuthTokenResponse>,
                CreateSocialUserPayload
            >(`${USERS_ENDPOINT}/create-social-user`, payload);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to authenticate');
                return;
            }
           authStore.setToken(data.data.accessToken);
                       userStore.setUser({
                           id: data.data.user.id,
                           name: `${data.data.user.firstName} ${data.data.user.lastName}`,
                           email: data.data.user.email,
                           image: data.data.user.image,
                           role: data.data.user.role as 'USER' | 'ADMIN'
                       });
                       toast.success(data.message || 'Login successful');
            queryClient.invalidateQueries({ queryKey: ['profile'] });
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

// services/authService.ts — এ add করো
export function useCreateUser() {
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<SingleResponse<AuthTokenResponse>, unknown, CreateUserPayload>({
        mutationFn: async (payload) => {
            const response = await postAxios<SingleResponse<AuthTokenResponse>, CreateUserPayload>(
                `${USERS_ENDPOINT}/create-user`,
                payload
            );
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            if (!data.success) {
                toast.error(data.message || 'Failed to create account');
                return;
            }
            toast.success(data.message || 'Account created successfully');
            window.location.href = '/login';
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

// update
export function useUpdateUser() {
  const setLoading = useUiStore((s) => s.setLoading);
  const queryClient = useQueryClient();

  return useMutation<SingleResponse<User>, unknown, UpdateUserPayload>({
    mutationFn: async (payload) => {
      const response = await patchAxios<SingleResponse<User>, UpdateUserPayload>(
        `${USERS_ENDPOINT}/update-user`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => setLoading(true),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to update profile");
        return;
      }
      toast.success(res.message || "Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: unknown) => {
      const msg = extractErrorMsg(err);
      if ((err as any)?.response?.status === 401) {
        logoutFunc(msg);
      }
      toast.error(msg);
      return Promise.reject(err);
    },
    onSettled: () => setLoading(false),
  });
}