import api from '@api/axiosInstance';
import { API_HEALTH } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';

export const pingApi = async (): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.get(`${API_HEALTH}/ping`);

        if (response.status != 200) {
            console.error('ping failed');
            return { ok: true, data: false };
        }

        return { ok: true, data: true };
    } catch (error) {
        console.error('ping error:', error);
        return handleApiError(error);
    }
};
