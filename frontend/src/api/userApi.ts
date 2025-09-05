import api from '@api/axiosInstance';
import {
    API_USERS,
    API_USERS_REQUEST_CANCELLATION,
    API_USERS_REQUEST_RESET_PASSWORD,
    API_USERS_RESET_PASSWORD,
    LOGIN_TIME,
} from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import { PasswordReset } from '@models/passwordReset';
import { User } from '@models/user';

export const updateLoginTimeApi = async (user: User): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.patch(`${API_USERS}/${user.id}${LOGIN_TIME}`);

        if (response.status != 200) {
            console.error('Logout failed');
            return { ok: true, data: false };
        }
        return { ok: true, data: true };
    } catch (error) {
        console.error('updateLoginTimeApi error:', error);
        return handleApiError(error);
    }
};

export const requestResetPassword = async (email: string): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.post(`${API_USERS_REQUEST_RESET_PASSWORD}/${email}`);

        if (response.status != 200) {
            console.error('reset request failed');
            return { ok: true, data: false };
        }
        return { ok: true, data: true };
    } catch (error) {
        console.error('requestResetPassword error:', error);
        return handleApiError(error);
    }
};

export const resetPassword = async (
    passwordReset: PasswordReset
): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.post(`${API_USERS_RESET_PASSWORD}`, passwordReset);

        if (response.status != 200) {
            console.error('reset failed');
            return { ok: true, data: false };
        }
        return { ok: true, data: true };
    } catch (error) {
        console.error('resetPassword error:', error);
        return handleApiError(error);
    }
};

export const requestCancellation = async (user: User): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.post(`${API_USERS_REQUEST_CANCELLATION}/${user.id}`);

        if (response.status != 200) {
            console.error('cancellation reset failed');
            return { ok: true, data: false };
        }
        return { ok: true, data: true };
    } catch (error) {
        console.error('requestCancellation error:', error);
        return handleApiError(error);
    }
};
