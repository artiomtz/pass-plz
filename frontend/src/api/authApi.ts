import api from '@api/axiosInstance';
import { API_AUTH_AUTHENTICATE, API_AUTH_LOGOUT, API_AUTH_REFRESH, API_AUTH_REGISTER } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import Authentication from '@models/authentication';
import { getBearerHeader } from '@utils/authUtil';
import { clearStoredUser, clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from '@utils/storageUtil';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const signUpApi = async (email: string, password: string): Promise<ApiResponse<Authentication>> => {
    try {
        console.log(`requesting ${API_AUTH_REGISTER}`);
        const { data } = await api.post<Authentication>(
            API_AUTH_REGISTER,
            { email, password },
            { auth: { password, username: email } }
        );

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return { data: data, ok: true };
    } catch (error) {
        console.error('failed to sign up');

        return handleApiError(error);
    }
};

export const signInApi = async (email: string, password: string): Promise<ApiResponse<Authentication>> => {
    try {
        console.log(`requesting ${API_AUTH_AUTHENTICATE}`);
        const { data } = await api.post<Authentication>(
            API_AUTH_AUTHENTICATE,
            { email, password },
            { auth: { password, username: email } }
        );

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return { data: data, ok: true };
    } catch (error) {
        console.error('failed to sign in');

        return handleApiError(error);
    }
};

export const refreshApi = async (): Promise<string | null> => {
    console.log('refreshing access token');
    if (isRefreshing && refreshPromise) {
        console.log('already refreshing. returning shared promise');

        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                console.warn('failed to refresh access token. no refresh token found in storage');

                return null;
            }

            console.log(`requesting ${API_AUTH_REFRESH}`);
            const response = await api.get(API_AUTH_REFRESH, {
                headers: {
                    Authorization: getBearerHeader(refreshToken),
                },
            });

            const { accessToken } = response.data;
            if (!accessToken) {
                console.error('failed to refresh access token. did not receive new token');

                return null;
            }

            setAccessToken(accessToken);
            console.log('new access token set');

            return accessToken;
        } catch {
            console.error('failed to refresh access token');
            clearTokens();
            clearStoredUser();

            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

export const logoutApi = async (): Promise<void> => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            console.warn('failed to logout. no refresh token found in storage');

            return;
        }

        console.log(`requesting ${API_AUTH_LOGOUT}`);
        const response = await api.post(API_AUTH_LOGOUT, null, {
            headers: {
                Authorization: getBearerHeader(refreshToken),
            },
        });

        if (response.status != 200) {
            console.warn('failed to logout. bad response code');
        }
    } catch (error) {
        console.warn('failed to logout');
    }
};
