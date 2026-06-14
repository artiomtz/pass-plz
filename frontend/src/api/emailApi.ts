import api from '@api/axiosInstance';
import { API_VERIFY_CANCELLATION, API_VERIFY_RESET, API_VERIFY_USER } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import Verification from '@models/verification';
import logger from '@utils/loggerUtil';
import { HttpStatusCode } from 'axios';

export const verifyUser = async (verification: Verification): Promise<ApiResponse<string>> => {
    try {
        logger.info(`requesting ${API_VERIFY_USER}`);
        const response = await api.post(API_VERIFY_USER, verification);

        if (response.status !== HttpStatusCode.Ok) {
            logger.warn('failed to verify user. bad response code');
            return { error: 'Failed to verify user', ok: false };
        }

        logger.info('successfully verified user');
        return { data: 'User verified successfully', ok: true };
    } catch (error) {
        logger.error('failed to verify user', error);
        return handleApiError(error);
    }
};

export const verifyResetPassword = async (verification: Verification): Promise<ApiResponse<string>> => {
    try {
        logger.info(`requesting ${API_VERIFY_RESET}`);
        const response = await api.post(API_VERIFY_RESET, verification);

        if (response.status !== HttpStatusCode.Ok) {
            logger.warn('failed to verify reset password token. bad response code');
            return { error: 'Failed to verify reset password token', ok: false };
        }

        logger.info('successfully verified reset password token');
        return { data: 'Reset password token verified', ok: true };
    } catch (error) {
        logger.error('failed to verify reset password token', error);
        return handleApiError(error);
    }
};

export const verifyCancellation = async (verification: Verification): Promise<ApiResponse<string>> => {
    try {
        logger.info(`requesting ${API_VERIFY_CANCELLATION}`);
        const response = await api.post(API_VERIFY_CANCELLATION, verification);

        if (response.status !== HttpStatusCode.Ok) {
            logger.warn('failed to verify cancellation token. bad response code');
            return { error: 'Failed to verify cancellation token', ok: false };
        }

        logger.info('successfully verified cancellation token');
        return { data: 'Cancellation token verified', ok: true };
    } catch (error) {
        logger.error('failed to verify cancellation token', error);
        return handleApiError(error);
    }
};
