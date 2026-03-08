/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAxios } from "@/axios/generic-api-calls";
import { useUiStore } from "@/store/useUiStore";
import { PaginatedResponse } from "@/types/product";
import { extractErrorMsg, formatResponse, logoutFunc } from "@/utils/commonUtils";
import { useQuery } from "@tanstack/react-query";

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