import { api } from '@api/axiosInstance';
import {
    API_AUTH_AUTHENTICATE,
    API_AUTH_LOGOUT,
    API_AUTH_REFRESH,
    API_AUTH_REGISTER,
} from '@api/constants';
import { Authentication } from '@models/auth';
import { getBearerHeader } from '@utils/authUtil';
import {
    clearStoredUser,
    clearTokens,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from '@utils/storageUtil';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const signUpApi = async (email: string, password: string): Promise<Authentication> => {
    try {
        const { data } = await api.post<Authentication>(
            API_AUTH_REGISTER,
            { email, password },
            { auth: { username: email, password } }
        );

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return data;
    } catch (error) {
        console.error('Sign-up failed:', error);
        throw error;
    }
};

export const signInApi = async (email: string, password: string): Promise<Authentication> => {
    try {
        // const headers = getAuthHeader(AUTH_TYPE.BASIC, { email, password });
        const { data } = await api.post<Authentication>(
            // <{ accessToken: string; refreshToken: string }> // create dto type
            API_AUTH_AUTHENTICATE,
            { email, password },
            { auth: { username: email, password } }
        );

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return data;
    } catch (error) {
        console.error('Sign-in failed:', error);
        throw error;
    }
};

export const refreshApi = async (): Promise<string | null> => {
    console.warn('refreshAccessToken........');
    if (isRefreshing && refreshPromise) {
        console.warn('Already refreshing. Returning shared promise.');
        return refreshPromise;
    }

    isRefreshing = true;

    refreshPromise = (async () => {
        try {
            const refreshToken = getRefreshToken();
            console.log('refreshToken value:', refreshToken);
            if (!refreshToken) {
                console.error('NO refresh token!!');
                return null;
            }

            const response = await api.get(API_AUTH_REFRESH, {
                headers: {
                    Authorization: getBearerHeader(refreshToken),
                },
            });

            console.warn('refresh response:', response);

            const { accessToken } = response.data;
            if (!accessToken) {
                console.error('NO new access token!!');
                return null;
            }

            setAccessToken(accessToken);
            console.warn('silently REFRESHED access token!');
            return accessToken;
        } catch (err) {
            console.error('refreshAccessToken CATCH:', err);
            clearTokens();
            clearStoredUser();
            return null;
        } finally {
            console.log('refreshAccessToken finally running...');
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

export const logoutApi = async (): Promise<boolean> => {
    try {
        const refreshToken = getRefreshToken();
        console.log('refreshToken value:', refreshToken);
        if (!refreshToken) {
            console.log('NO refresh token');
            return false;
        }

        const response = await api.post(API_AUTH_LOGOUT, null, {
            headers: {
                Authorization: getBearerHeader(refreshToken),
            },
        });

        if (response.status != 200) {
            console.error('Logout failed');
            return false;
        }
        return true;
    } catch (error) {
        console.error('logout failed:', error);
        throw error;
    }
};
