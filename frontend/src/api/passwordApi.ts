import api from '@api/axiosInstance';
import { PasswordEntry } from '@models/passwordEntry';

export const getPasswords = async (userId: number): Promise<PasswordEntry[]> => {
    console.log(`getPasswords ${userId}`);
    const { data } = await api.get(`/api/passwords/user/${userId}`);
    // console.log(`received passwords: ${data}`);
    return data;
};

export const updatePassword = async (id: string, newPassword: string) => {
    const { data } = await api.put(`/passwords/${id}`, { newPassword });
    return data;
};
