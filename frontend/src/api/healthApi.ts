import api from '@api/axiosInstance';
import { API_HEALTH } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import logger from '@utils/loggerUtil';
import { HttpStatusCode } from 'axios';

export const pingApi = async (): Promise<ApiResponse<string>> => {
    try {
        const response = await api.get(`${API_HEALTH}/ping`);

        if (response.status != HttpStatusCode.Ok) {
            logger.warn('failed to ping server. bad response code');

            return { error: 'Failed to ping server', ok: false };
        }

        logger.info('successfully connected to server');

        return { data: 'Connected to server', ok: true };
    } catch (error) {
        logger.error('failed to ping server', error);

        return handleApiError(error);
    }
};
