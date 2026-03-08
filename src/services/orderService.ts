/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import { PaginatedResponse, ShippingAddress, SingleResponse } from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAxios, patchAxios, postAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum PaymentMethod {
  SEND_MONEY = 'SEND_MONEY',
  COD = 'CASH_ON_DELIVERY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VariationDetails {
  depth: number | string;
  width: number | string;
  height: number | string;
  price: number;
  stock: number;
  sku: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  variationDetails: VariationDetails;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    p_id: string;
    name: string;
    mainProductImage: string;
  };
}

export interface AccountInfo {
  transactionId: string;
  transactionScreenshot: string;
  accountNumber: string;
  accountName: string;
}

export interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}

export interface Order {
  id: string;
  order_id: string;
  userId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  accountInfo: AccountInfo | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user: OrderUser;
}

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
  price: number;
  variationDetails: VariationDetails;
}

export interface CreateOrderPayload {
  orderItems: CreateOrderItemPayload[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  accountInfo?: AccountInfo;
}

export interface MyOrdersParams {
  page?: number;
  limit?: number;
}

export interface AllOrdersParams {
  page?: number;
  limit?: number;
  order_id?: string;
  userId?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface VerifyPaymentPayload {
  status: PaymentStatus;
}

export interface CancelOrderPayload {
  reason: string;
}

// ─── Endpoint ─────────────────────────────────────────────────────────────────

const ORDERS_ENDPOINT = '/order';

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Hook to create a new order (POST /order)
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<SingleResponse<Order>, unknown, CreateOrderPayload>({
    mutationFn: async (payload: CreateOrderPayload) => {
      const response = await postAxios<SingleResponse<Order>, CreateOrderPayload>(
        ORDERS_ENDPOINT,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to place order');
        return;
      }
      toast.success(data.message || 'Order placed successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
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
 * Hook to fetch current user's orders (GET /order/my-orders)
 */
export function useFetchMyOrders(params: MyOrdersParams = {}, enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<PaginatedResponse<Order>, unknown>({
    queryFn: async ({ signal }) => {
      try {
        setLoading(true);
        const response = await getAxios<PaginatedResponse<Order>>(
          `${ORDERS_ENDPOINT}/my-orders`,
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
    queryKey: ['my-orders', params],
    enabled,
  });
}

/**
 * Hook to fetch all orders — admin (GET /order/all)
 */
export function useFetchAllOrders(params: AllOrdersParams = {}, enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<PaginatedResponse<Order>, unknown>({
    queryFn: async ({ signal }) => {
      try {
        setLoading(true);
        const response = await getAxios<PaginatedResponse<Order>>(
          `${ORDERS_ENDPOINT}/all`,
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
    queryKey: ['orders', params],
    enabled,
  });
}

/**
 * Hook to fetch a single order by id (GET /order/:id)
 */
export function useFetchOrder(id: string | undefined, enabled: boolean = true) {
  const setLoading = useUiStore((s) => s.setLoading);

  return useQuery<SingleResponse<Order>, unknown>({
    queryFn: async () => {
      if (!id) return Promise.reject(new Error('Missing order id'));
      try {
        setLoading(true);
        const response = await getAxios<SingleResponse<Order>>(
          `${ORDERS_ENDPOINT}/${id}`
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
    queryKey: ['order', id],
    enabled: Boolean(id) && enabled,
  });
}

/**
 * Hook to update order status — admin (PATCH /order/:id/status)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<
    SingleResponse<Order>,
    unknown,
    { id: string; payload: UpdateOrderStatusPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Order>, UpdateOrderStatusPayload>(
        `${ORDERS_ENDPOINT}/${id}/status`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to update order status');
        return;
      }
      toast.success(data.message || 'Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      }
    },
    onError: (err: unknown) => {
      const msg = extractErrorMsg(err);
      if ((err as any)?.response?.status === 401) {
        logoutFunc(msg);
      }
      setLoading(false);
      toast.error(msg);
      return Promise.reject(err);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

/**
 * Hook to verify payment — admin (PATCH /order/:id/verify-payment)
 */
export function useVerifyPayment() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<
    SingleResponse<Order>,
    unknown,
    { id: string; payload: VerifyPaymentPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Order>, VerifyPaymentPayload>(
        `${ORDERS_ENDPOINT}/${id}/verify-payment`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to verify payment');
        return;
      }
      toast.success(data.message || 'Payment verified successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
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

/**
 * Hook to cancel an order (PATCH /order/:id/cancel)
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();
  const setLoading = useUiStore((s) => s.setLoading);

  return useMutation<
    SingleResponse<Order>,
    unknown,
    { id: string; payload: CancelOrderPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await patchAxios<SingleResponse<Order>, CancelOrderPayload>(
        `${ORDERS_ENDPOINT}/${id}/cancel`,
        payload
      );
      return formatResponse(response);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message || 'Failed to cancel order');
        return;
      }
      toast.success(data.message || 'Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
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