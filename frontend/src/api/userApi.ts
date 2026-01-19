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
import { HttpStatusCode } from 'axios';

export const updateLoginTimeApi = async (user: User): Promise<ApiResponse<boolean>> => {
    try {
        logger.info(`requesting ${API_USERS}`);
        const response = await api.patch(`${API_USERS}/${user.id}${LOGIN_TIME}`);

        if (response.status != HttpStatusCode.Ok) {
            logger.warn('failed to update login time. bad response code');

            return { error: 'Failed to update login time', ok: false };
        }

        logger.info('successfully updated login time');

        return { data: true, ok: true };
    } catch (error) {
        logger.error('failed to update login time', error);

        return handleApiError(error);
    }
};

export const requestResetPassword = async (email: string): Promise<ApiResponse<string>> => {
    try {
        logger.info(`requesting ${API_USERS_REQUEST_RESET_PASSWORD}`);
        const response = await api.post(`${API_USERS_REQUEST_RESET_PASSWORD}/${email}`);

        if (response.status == HttpStatusCode.TooManyRequests) {
            logger.warn('failed to request password reset. too many requests');

            return { error: 'Already requested a password reset', ok: false };
        }

        if (response.status != HttpStatusCode.Ok) {
            logger.warn('failed to request password reset. bad response code');

            return { error: 'Failed to request password reset', ok: false };
        }

        logger.info('successfully requested password reset');

        return { data: 'Password reset request sent via email', ok: true };
    } catch (error) {
        logger.error('failed to request password reset', error);

        return handleApiError(error);
    }
};

export const resetPassword = async (passwordReset: PasswordReset): Promise<ApiResponse<string>> => {
    try {
        logger.info(`requesting ${API_USERS_RESET_PASSWORD}`);
        const response = await api.post(`${API_USERS_RESET_PASSWORD}`, passwordReset);

        if (response.status != HttpStatusCode.Ok) {
            logger.warn('failed to reset password. bad response code');

            return { error: 'Failed to reset password', ok: false };
        }

        logger.info('successfully reset password');

        return { data: 'Successfully reset password', ok: true };
    } catch (error) {
        logger.error('failed to reset password', error);

        return handleApiError(error);
    }
};

export const requestCancellation = async (user: User): Promise<ApiResponse<string>> => {
    try {
        logger.info(`requesting ${API_USERS_REQUEST_CANCELLATION}`);
        const response = await api.post(`${API_USERS_REQUEST_CANCELLATION}/${user.id}`);

        if (response.status == HttpStatusCode.TooManyRequests) {
            logger.warn('failed to cancel account. too many requests');

            return { error: 'Already requested a cancellation', ok: false };
        }

        if (response.status != HttpStatusCode.Ok) {
            logger.warn('failed to cancel account. bad response code');

            return { error: 'Failed to cancel account', ok: false };
        }

        logger.info('successfully requested cancellation');

        return { data: 'Deletion confirmation sent via email', ok: true };
    } catch (error) {
        logger.error('failed to cancel account', error);

        return handleApiError(error);
    }
};
