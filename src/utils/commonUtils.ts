/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

/**
 * Pull a user-friendly message out of an Axios error object.
 */
export function extractErrorMsg(error: any): string {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong, please try again."
  );
}

/**
 * Basic response formatter that mirrors the behaviour from the other project.
 * For now it just returns the incoming payload unchanged, but the name keeps
 * the calling code consistent with that sample.
 */
export function formatResponse<T>(response: T): T {
  return response;
}

/**
 * Perform a logout by clearing stores, tokens and navigating to the login page.
 * An optional message is shown as an error toast.
 */
export function logoutFunc(message?: string) {
  if (message) {
    toast.error(message);
  }

  // clear zustand stores directly
  useAuthStore.getState().setToken(null);
  if (useUserStore.getState().clearUser) {
    useUserStore.getState().clearUser();
  }

  // redirect to login route
  window.location.href = "/login";
}
