import api from '@api/axiosInstance';
import { API_PASSWORDS, API_PASSWORDS_USER } from '@api/constants';
import { PasswordEntry } from '@models/passwordEntry';
import { User } from '@models/user';

export const createPasswordApi = async (newEntry: PasswordEntry): Promise<PasswordEntry | null> => {
    try {
        const { data } = await api.post(API_PASSWORDS, newEntry);
        return data;
    } catch (err) {
        console.error('createPasswordApi error:', err);
        return null;
    }
};

export const getPasswordsApi = async (user: User): Promise<PasswordEntry[] | null> => {
    try {
        const { data, status } = await api.get(`${API_PASSWORDS_USER}/${user.id}`);

        if (status === 204 || !data) {
            return []; // no content → empty array
        }

        return Array.isArray(data) ? data : []; // ensure array
    } catch (err) {
        console.error('getPasswordsApi error:', err);
        return null; // error → null
    }
};

export const updatePasswordApi = async (
    updatedEntry: PasswordEntry
): Promise<PasswordEntry | null> => {
    try {
        const { data } = await api.put(`${API_PASSWORDS}/${updatedEntry.id}`, updatedEntry);
        return data;
    } catch (err) {
        console.error('getPasswordsApi error:', err);
        return null;
    }
};

export const deletePasswordApi = async (entry: PasswordEntry): Promise<boolean | null> => {
    try {
        const response = await api.delete(`${API_PASSWORDS}/${entry.id}`);
        if (response.status != 200) {
            console.error('Logout failed');
            return false;
        }
        return true;
    } catch (err) {
        console.error('getPasswordsApi error:', err);
        return null;
    }
};
