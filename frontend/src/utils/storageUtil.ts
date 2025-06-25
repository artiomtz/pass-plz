import { User } from '@models/user';

const ACCESS_TOKEN_KEY = 'pass_plz_access_token';
const REFRESH_TOKEN_KEY = 'pass_plz_refresh_token';
const RESET_TOKEN_KEY = 'pass_plz_reset_token';
const USER_KEY = 'pass_plz_user';

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getResetToken = (): string | null => {
    return localStorage.getItem(RESET_TOKEN_KEY);
};

export const setResetToken = (token: string) => {
    localStorage.setItem(RESET_TOKEN_KEY, token);
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(RESET_TOKEN_KEY);
};

export const getStoredUser = (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
};

export const setStoredUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
    localStorage.removeItem(USER_KEY);
};
