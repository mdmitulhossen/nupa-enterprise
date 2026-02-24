import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { StorageKeys } from '@/types/generalTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type UseLogoutOptions = {
    redirectTo?: string;
    replace?: boolean;
    showToast?: boolean;
    clearQueries?: boolean;
};

export default function useLogout() {
    const setToken = useAuthStore((s) => s.setToken);
    const clearUser = useUserStore((s) => s.clearUser);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useCallback(
        (opts: UseLogoutOptions = {}) => {
            const { redirectTo = '/', replace = true, showToast = false, clearQueries = false } = opts;

            // clear auth + user
            setToken(null);
            clearUser();

            localStorage.removeItem(StorageKeys.token);
            localStorage.removeItem(StorageKeys.user);

            // clear or invalidate queries
            if (clearQueries) queryClient.clear();
            else queryClient.invalidateQueries({ queryKey: ['profile'] });

            if (showToast) toast.success('Logged out');

            navigate(redirectTo, { replace });
        },
        [setToken, clearUser, navigate, queryClient],
    );
}