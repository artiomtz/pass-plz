import api from '@api/axiosInstance';
import { API_PASSWORDS, API_PASSWORDS_USER } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import PasswordEntry from '@models/passwordEntry';
import User from '@models/user';
import logger from '@utils/loggerUtil';

export const createPasswordApi = async (newEntry: PasswordEntry): Promise<ApiResponse<PasswordEntry>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS}`);
        const { data } = await api.post(API_PASSWORDS, newEntry);

        return { data: data, ok: true };
    } catch (error) {
        logger.error('failed to create password', error);

        return handleApiError(error);
    }
};

export const getPasswordsApi = async (user: User): Promise<ApiResponse<PasswordEntry[]>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS_USER}`);
        const { data, status } = await api.get(`${API_PASSWORDS_USER}/${user.id}`);

        if (status === 204 || !data) {
            return { data: [], ok: true };
        }

        return { data: Array.isArray(data) ? data : [], ok: true };
    } catch (error) {
        logger.error('failed to get passwords', error);

        return handleApiError(error);
    }
};

export const updatePasswordApi = async (updatedEntry: PasswordEntry): Promise<ApiResponse<PasswordEntry>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS}`);
        const { data } = await api.put(`${API_PASSWORDS}/${updatedEntry.id}`, updatedEntry);

        return { data: data, ok: true };
    } catch (error) {
        logger.error('failed to update password', error);

        return handleApiError(error);
    }
};

export const deletePasswordApi = async (entry: PasswordEntry): Promise<ApiResponse<boolean>> => {
    try {
        logger.info(`requesting ${API_PASSWORDS}`);
        const response = await api.delete(`${API_PASSWORDS}/${entry.id}`);

        if (response.status != 200) {
            logger.warn('failed to delete password. bad response code');

            return { data: false, ok: true };
        }

        return { data: true, ok: true };
    } catch (error) {
        logger.error('failed to delete password', error);

        return handleApiError(error);
    }
};
