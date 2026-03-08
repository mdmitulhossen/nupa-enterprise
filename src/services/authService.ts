/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useUiStore } from '@/store/useUiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAxios, postAxios } from '../axios/generic-api-calls';
import { ILoginRequest, ILoginResponse, IProfileResponse } from '../types/auth';
import { extractErrorMsg, formatResponse, logoutFunc } from '../utils/commonUtils';

const AUTH_LOGIN_ENDPOINT = '/auth/login';
const AUTH_ME_ENDPOINT = '/auth/me';

/**
 * Hook that performs a login mutation and stores the resulting token.
 */
export function useLogin() {
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const queryClient = useQueryClient();
    const setLoading = useUiStore((s) => s.setLoading);

    return useMutation<ILoginResponse, unknown, ILoginRequest>({
        mutationFn: async (credentials: ILoginRequest) => {
            const response = await postAxios<ILoginResponse, ILoginRequest>(AUTH_LOGIN_ENDPOINT, credentials);
            return formatResponse(response);
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {

            if (!data.success) {
                toast.error(data.message || 'Login failed');
                return;
            }


            authStore.setToken(data.data.accessToken);
            userStore.setUser({
                id: data.data.user.id,
                name: `${data.data.user.firstName} ${data.data.user.lastName}`,
                email: data.data.user.email,
                role: data.data.user.role as 'USER' | 'ADMIN',
                image: data.data.user.image,
            });
            toast.success(data.message || 'Login successful');
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (err: unknown) => {
            const msg = extractErrorMsg(err);
            if ((err as any)?.response?.status === 401) {
                authStore.setToken(null);
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
 * Hook that fetches the currently authenticated user's profile.
 * Automatically updates the user store on success and handles 401 errors.
 */
export function useFetchProfile(enabled: boolean = true) {

    return useQuery({
        queryFn: async () => {
            try {
                const response = await getAxios<IProfileResponse>(AUTH_ME_ENDPOINT);


                return formatResponse(response);
            } catch (error: unknown) {
                const errorMsg = extractErrorMsg(error);

                if ((error as { response?: { status?: number } })?.response?.status === 401) {
                    logoutFunc(errorMsg);
                    return await Promise.reject(new Error(errorMsg));
                } else {
                    toast.error(errorMsg);
                }

                return await Promise.reject(new Error(errorMsg));
            }
        },
        queryKey: ['profile'],
        enabled,
    });
}
