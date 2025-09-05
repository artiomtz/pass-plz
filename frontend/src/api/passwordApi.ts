import api from '@api/axiosInstance';
import { API_PASSWORDS, API_PASSWORDS_USER } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import { PasswordEntry } from '@models/passwordEntry';
import { User } from '@models/user';

export const createPasswordApi = async (
    newEntry: PasswordEntry
): Promise<ApiResponse<PasswordEntry>> => {
    try {
        const { data } = await api.post(API_PASSWORDS, newEntry);
        return { ok: true, data: data };
    } catch (error) {
        console.error('createPasswordApi error:', error);
        return handleApiError(error);
        // return null;
    }
};

export const getPasswordsApi = async (user: User): Promise<ApiResponse<PasswordEntry[]>> => {
    try {
        const { data, status } = await api.get(`${API_PASSWORDS_USER}/${user.id}`);

        if (status === 204 || !data) {
            return { ok: true, data: [] }; // no content → empty array
        }

        return { ok: true, data: Array.isArray(data) ? data : [] }; // ensure array
    } catch (error) {
        console.error('getPasswordsApi error:', error);
        return handleApiError(error);
    }
};

export const updatePasswordApi = async (
    updatedEntry: PasswordEntry
): Promise<ApiResponse<PasswordEntry>> => {
    try {
        const { data } = await api.put(`${API_PASSWORDS}/${updatedEntry.id}`, updatedEntry);
        return { ok: true, data: data };
    } catch (error) {
        console.error('updatePasswordApi error:', error);
        return handleApiError(error);
    }
};

export const deletePasswordApi = async (entry: PasswordEntry): Promise<ApiResponse<boolean>> => {
    try {
        const response = await api.delete(`${API_PASSWORDS}/${entry.id}`);
        if (response.status != 200) {
            console.error('delete failed');
            return { ok: true, data: false };
        }
        return { ok: true, data: true };
    } catch (error) {
        console.error('deletePasswordApi error:', error);
        return handleApiError(error);
    }
};
