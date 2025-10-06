import api from '@api/axiosInstance';
import { API_PASSWORDS, API_PASSWORDS_USER } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import HttpStatus from '@api/httpStatus';
import PasswordEntry from '@models/passwordEntry';
import User from '@models/user';
import logger from '@utils/loggerUtil';

export const createPasswordApi = async (newEntry: PasswordEntry): Promise<ApiResponse<PasswordEntry>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS}`);
        const response = await api.post(API_PASSWORDS, newEntry);

        const { data, status } = response;
        if (status != HttpStatus.OK || !data) {
            logger.warn('failed to create password. bad response code');

            return { error: 'Failed to create password', ok: false };
        }

        logger.info('successfully created the new password');

        return { data: data, ok: true };
    } catch (error) {
        logger.error('failed to create password', error);

        return handleApiError(error);
    }
};

export const getPasswordsApi = async (user: User): Promise<ApiResponse<PasswordEntry[]>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS_USER}`);
        const response = await api.get(`${API_PASSWORDS_USER}/${user.id}`);

        const { data, status } = response;
        if (status != HttpStatus.OK && status != HttpStatus.NO_CONTENT) {
            logger.warn('failed to get passwords. bad response code');

            return { error: 'Failed to get passwords', ok: false };
        }

        if (status === HttpStatus.NO_CONTENT || !data) {
            return { data: [], ok: true };
        }

        logger.info('successfully got passwords');

        return { data: Array.isArray(data) ? data : [], ok: true };
    } catch (error) {
        logger.error('failed to get passwords', error);

        return handleApiError(error);
    }
};

export const updatePasswordApi = async (updatedEntry: PasswordEntry): Promise<ApiResponse<PasswordEntry>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS}`);
        const response = await api.put(`${API_PASSWORDS}/${updatedEntry.id}`, updatedEntry);

        const { data, status } = response;
        if (status != HttpStatus.OK || !data) {
            logger.warn('failed to update password. bad response code');

            return { error: 'Failed to update password', ok: false };
        }

        logger.info('successfully updated the password');

        return { data: data, ok: true };
    } catch (error) {
        logger.error('failed to update password', error);

        return handleApiError(error);
    }
};

export const deletePasswordApi = async (entry: PasswordEntry): Promise<ApiResponse<string>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS}`);
        const response = await api.delete(`${API_PASSWORDS}/${entry.id}`);

        if (response.status != HttpStatus.OK) {
            logger.warn('failed to delete password. bad response code');

            return { error: 'Failed to delete password', ok: false };
        }

        logger.info('successfully deleted the password');

        return { data: 'Password was deleted', ok: true };
    } catch (error) {
        logger.error('failed to delete password', error);

        return handleApiError(error);
    }
};
