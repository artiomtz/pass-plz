import api from '@api/axiosInstance';
import { API_HEALTH } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import logger from '@utils/loggerUtil';

export const pingApi = async (): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.get(`${API_HEALTH}/ping`);

        if (response.status != 200) {
            logger.warn('failed to ping server. bad response code');

            return { data: false, ok: true };
        }

        return { data: true, ok: true };
    } catch (error) {
        logger.error('failed to ping server', error);

        return handleApiError(error);
    }
};
