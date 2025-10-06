import api from '@api/axiosInstance';
import { API_HEALTH } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import HttpStatus from '@api/httpStatus';
import logger from '@utils/loggerUtil';

export const pingApi = async (): Promise<ApiResponse<string>> => {
    try {
        const response = await api.get(`${API_HEALTH}/ping`);

        if (response.status != HttpStatus.OK) {
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
