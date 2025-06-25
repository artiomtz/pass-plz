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
    const response = await api.patch(`${API_USERS}/${user.id}${LOGIN_TIME}`); //add try catch

    if (response.status != 200) {
        console.error('Logout failed');
        return false;
    }
    return true;
};

export const requestResetPassword = async (email: string): Promise<boolean> => {
    const response = await api.post(`${API_USERS_REQUEST_RESET_PASSWORD}/${email}`); //add try catch

    if (response.status != 200) {
        console.error('reset request failed');
        return false;
    }
    return true;
};

export const resetPassword = async (passwordReset: PasswordReset): Promise<boolean> => {
    const response = await api.post(`${API_USERS_RESET_PASSWORD}`, passwordReset); //add try catch

    if (response.status != 200) {
        console.error('reset failed');
        return false;
    }
    return true;
};

export const requestCancellation = async (user: User): Promise<boolean> => {
    const response = await api.post(`${API_USERS_REQUEST_CANCELLATION}/${user.id}`); //add try catch

    if (response.status != 200) {
        console.error('cancellation reset failed');
        return false;
    }
    return true;
};
