import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isConnectionError = !error?.response;

    if (isConnectionError || status === 502 || status === 503 || status === 504) {
      window.dispatchEvent(
        new CustomEvent('api-error', {
          detail: { status: status ?? 0 },
        }),
      );
    }

    return Promise.reject(error);
  },
);
