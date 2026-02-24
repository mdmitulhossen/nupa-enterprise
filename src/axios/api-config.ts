/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
//   headers: {
//     'ngrok-skip-browser-warning': 'true',
//   },
});


export interface IApiResponse<T = any> {
  status: boolean; // success flag returned by some APIs
  message: string;
  data?: T;
  result?: T; // some endpoints use result instead of data
}

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
