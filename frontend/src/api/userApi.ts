import api from '@api/axiosInstance';
import {
    API_USERS,
    API_USERS_REQUEST_CANCELLATION,
    API_USERS_REQUEST_RESET_PASSWORD,
    API_USERS_RESET_PASSWORD,
    LOGIN_TIME,
} from '@api/constants';
import { PasswordReset } from '@models/passwordReset';
import { User } from '@models/user';

export const updateLoginTimeApi = async (user: User): Promise<boolean> => {
    try {
        const response = await api.patch(`${API_USERS}/${user.id}${LOGIN_TIME}`);

        if (response.status != 200) {
            console.error('Logout failed');
            return false;
        }
        return true;
    } catch (err) {
        console.error('updateLoginTimeApi error:', err);
        return false;
    }
};

export const requestResetPassword = async (email: string): Promise<boolean> => {
    try {
        const response = await api.post(`${API_USERS_REQUEST_RESET_PASSWORD}/${email}`);

        if (response.status != 200) {
            console.error('reset request failed');
            return false;
        }
        return true;
    } catch (err) {
        console.error('requestResetPassword error:', err);
        return false;
    }
};

export const resetPassword = async (passwordReset: PasswordReset): Promise<boolean> => {
    try {
        const response = await api.post(`${API_USERS_RESET_PASSWORD}`, passwordReset);

        if (response.status != 200) {
            console.error('reset failed');
            return false;
        }
        return true;
    } catch (err) {
        console.error('resetPassword error:', err);
        return false;
    }
};

export const requestCancellation = async (user: User): Promise<boolean> => {
    try {
        const response = await api.post(`${API_USERS_REQUEST_CANCELLATION}/${user.id}`);

        if (response.status != 200) {
            console.error('cancellation reset failed');
            return false;
        }
        return true;
    } catch (err) {
        console.error('requestCancellation error:', err);
        return false;
    }
};
