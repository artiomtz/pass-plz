import api from '@api/axiosInstance';
import {
    API_USERS,
    API_USERS_REQUEST_CANCELLATION,
    API_USERS_REQUEST_RESET_PASSWORD,
    API_USERS_RESET_PASSWORD,
    LOGIN_TIME,
} from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import PasswordReset from '@models/passwordReset';
import User from '@models/user';
import logger from '@utils/loggerUtil';

export const updateLoginTimeApi = async (user: User): Promise<ApiResponse<boolean>> => {
    try {
        logger.info(`requesting ${API_USERS}`);
        const response = await api.patch(`${API_USERS}/${user.id}${LOGIN_TIME}`);

        if (response.status != 200) {
            logger.warn('failed to update login time. bad response code');

            return { data: false, ok: true };
        }

        return { data: true, ok: true };
    } catch (error) {
        logger.error('failed to update login time', error);

        return handleApiError(error);
    }
};

export const requestResetPassword = async (email: string): Promise<ApiResponse<boolean>> => {
    try {
        logger.info(`requesting ${API_USERS_REQUEST_RESET_PASSWORD}`);
        const response = await api.post(`${API_USERS_REQUEST_RESET_PASSWORD}/${email}`);

        if (response.status != 200) {
            logger.warn('failed to request password reset. bad response code');

            return { data: false, ok: true };
        }

        return { data: true, ok: true };
    } catch (error) {
        logger.error('failed to request password reset', error);

        return handleApiError(error);
    }
};

export const resetPassword = async (passwordReset: PasswordReset): Promise<ApiResponse<boolean>> => {
    try {
        logger.info(`requesting ${API_USERS_RESET_PASSWORD}`);
        const response = await api.post(`${API_USERS_RESET_PASSWORD}`, passwordReset);

        if (response.status != 200) {
            logger.warn('failed to reset password. bad response code');

            return { data: false, ok: true };
        }

        return { data: true, ok: true };
    } catch (error) {
        logger.error('failed to reset password', error);

        return handleApiError(error);
    }
};

export const requestCancellation = async (user: User): Promise<ApiResponse<boolean>> => {
    try {
        logger.info(`requesting ${API_USERS_REQUEST_CANCELLATION}`);
        const response = await api.post(`${API_USERS_REQUEST_CANCELLATION}/${user.id}`);

        if (response.status != 200) {
            logger.warn('failed to cancel account. bad response code');

            return { data: false, ok: true };
        }

        return { data: true, ok: true };
    } catch (error) {
        logger.error('failed to cancel account', error);

        return handleApiError(error);
    }
};
