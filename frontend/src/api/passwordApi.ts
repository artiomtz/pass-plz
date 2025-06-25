import api from '@api/axiosInstance';
import { API_PASSWORDS, API_PASSWORDS_USER } from '@api/constants';
import { PasswordEntry } from '@models/passwordEntry';
import { User } from '@models/user';

export const createPasswordApi = async (newEntry: PasswordEntry): Promise<PasswordEntry> => {
    const { data } = await api.post(API_PASSWORDS, newEntry); //add try catch
    return data;
};

export const getPasswordsApi = async (user: User): Promise<PasswordEntry[]> => {
    console.log(`getPasswords ${user.id}`);
    const { data } = await api.get(`${API_PASSWORDS_USER}/${user.id}`); //add try catch
    // console.log(`received passwords: ${data}`);
    return data;
};

export const updatePasswordApi = async (updatedEntry: PasswordEntry): Promise<PasswordEntry> => {
    const { data } = await api.put(`${API_PASSWORDS}/${updatedEntry.id}`, updatedEntry); //add try catch
    return data;
};

export const deletePasswordApi = async (entry: PasswordEntry): Promise<boolean> => {
    const response = await api.delete(`${API_PASSWORDS}/${entry.id}`); //add try catch .. return true if good
    if (response.status != 200) {
        console.error('Logout failed');
        return false;
    }
    return true;
};
