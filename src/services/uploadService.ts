/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/lib/toast';
import { useUiStore } from '@/store/useUiStore';
import { useMutation } from '@tanstack/react-query';
import { postAxios } from '../axios/generic-api-calls';
import { extractErrorMsg, logoutFunc } from '../utils/commonUtils';

interface UploadResponse {
	success: boolean;
	url: string;
	message?: string;
}

const UPLOAD_ENDPOINT = '/upload';

export function useUploadFile() {
	const setLoading = useUiStore((s) => s.setLoading);

	return useMutation<string, unknown, File>({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append('file', file);
			const data = await postAxios<UploadResponse, FormData>(UPLOAD_ENDPOINT, formData);
			// const data = formatResponse(response);

			if (!data?.success || !data?.url) {
				throw new Error(data?.message || 'Failed to upload file');
			}

			return data.url;
		},
		onMutate: () => {
			setLoading(true);
		},
		onSuccess: () => {
			toast.success('Image uploaded successfully');
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
