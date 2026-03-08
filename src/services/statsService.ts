/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAxios } from "@/axios/generic-api-calls";
import { useUiStore } from "@/store/useUiStore";
import { SingleResponse } from "@/types/product";
import { extractErrorMsg, formatResponse, logoutFunc } from "@/utils/commonUtils";
import { useQuery } from "@tanstack/react-query";

// types/stats.types.ts
export interface MonthlyEarning {
  month: string;
  revenue: number;
}

export interface MonthlyOrdersVsQuotes {
  month: string;
  orders: number;
  quotes: number;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalQuotes: number;
  totalActiveOrders: number;
  totalCompletedOrders: number;
  totalRevenue: number;
  monthlyEarnings: MonthlyEarning[];
  monthlyOrdersVsQuotes: MonthlyOrdersVsQuotes[];
}

// services/stats.service.ts
const STATS_ENDPOINT = "/stats/admin";

export function useFetchAdminStats(enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<SingleResponse<AdminStats>, unknown>({
    queryFn: async () => {
      try {
        setLoading(true);
        const response = await getAxios<SingleResponse<AdminStats>>(
          STATS_ENDPOINT
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
    queryKey: ['admin-stats'],
    enabled,
  });
}