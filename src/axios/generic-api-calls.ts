/* eslint-disable @typescript-eslint/no-explicit-any */

import { StorageKeys } from '@/types/generalTypes';
import { api } from './api-config';

export async function getAxios<T>(endpoint: string, params?: any, signal?: any) {
  const token = localStorage.getItem(StorageKeys.token);
  const response = await api.get<T>(`${endpoint}`, {
    signal,
    headers: {
      Authorization: `${token}`,
    },
    params,
  });
  return response.data;
}

export async function postAxios<RT, BT>(endpoint: string, arg: BT, timeout?: number) {
  const token = localStorage.getItem(StorageKeys.token);
  const response = await api.post<RT>(`${endpoint}`, arg, {
    headers: {
      Authorization: `${token}`,
    },
    timeout: timeout,
  });

  return response.data;
}

export async function putAxios<RT, BT>(endpoint: string, arg: BT) {
  const token = localStorage.getItem(StorageKeys.token);
  const response = await api.put<RT>(`${endpoint}`, arg, {
    headers: {
      Authorization: `${token}`,
    },
  });

  return response.data;
}

export async function deleteAxios<RT>(endpoint: string, params?: any, timeout?: number) {
  const token = localStorage.getItem(StorageKeys.token);
  const response = await api.delete<RT>(`${endpoint}`, {
    headers: {
      Authorization: `${token}`,
    },
    params,
    timeout,
  });

  return response.data;
}

export async function patchAxios<RT, BT>(endpoint: string, arg: BT) {
  const token = localStorage.getItem(StorageKeys.token);
  const response = await api.patch<RT>(`${endpoint}`, arg, {
    headers: {
      Authorization: `${token}`,
    },
  });

  return response.data;
}
