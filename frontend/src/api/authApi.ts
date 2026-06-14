import api from '@api/axiosInstance';
import { API_AUTH_AUTHENTICATE, API_AUTH_LOGOUT, API_AUTH_REFRESH, API_AUTH_REGISTER } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import Authentication from '@models/authentication';
import { getBearerHeader } from '@utils/authUtil';
import logger from '@utils/loggerUtil';
import {
    ACCESS_TOKEN_KEY,
    clearStoredUser,
    clearTokens,
    getToken,
    REFRESH_TOKEN_KEY,
    setToken,
} from '@utils/storageUtil';
import { HttpStatusCode } from 'axios';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const signUpApi = async (email: string, password: string): Promise<ApiResponse<Authentication>> => {
    try {
        logger.info(`requesting ${API_AUTH_REGISTER}`);
        const response = await api.post<Authentication>(
            API_AUTH_REGISTER,
            { email, password },
            { auth: { password, username: email } }
        );

        const { data, status } = response;
        if (status != HttpStatusCode.Ok || !data) {
            logger.warn('failed to sign up. bad response code');

            return { error: 'Failed to sign up', ok: false };
        }

        setToken(ACCESS_TOKEN_KEY, data.accessToken);
        setToken(REFRESH_TOKEN_KEY, data.refreshToken);
        logger.info(`successfully signed up ${email}`);

        return { data: data, ok: true };
    } catch (error) {
        logger.error('failed to sign up', error);

        return handleApiError(error);
    }
};

export const signInApi = async (email: string, password: string): Promise<ApiResponse<Authentication>> => {
    try {
        logger.info(`requesting ${API_AUTH_AUTHENTICATE}`);
        const response = await api.post<Authentication>(
            API_AUTH_AUTHENTICATE,
            { email, password },
            { auth: { password, username: email } }
        );

        const { data, status } = response;
        if (status != HttpStatusCode.Ok || !data) {
            logger.warn('failed to sign in. bad response code');

            return { error: 'Failed to sign in', ok: false };
        }

        setToken(ACCESS_TOKEN_KEY, data.accessToken);
        setToken(REFRESH_TOKEN_KEY, data.refreshToken);
        logger.info(`successfully signed in ${email}`);

        return { data: data, ok: true };
    } catch (error) {
        logger.error('failed to sign in', error);

        return handleApiError(error);
    }
};

export const refreshApi = async (): Promise<string | null> => {
    logger.info('refreshing access token');
    if (isRefreshing && refreshPromise) {
        logger.info('already refreshing. returning shared promise');

        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const refreshToken = getToken(REFRESH_TOKEN_KEY);
            if (!refreshToken) {
                logger.warn('failed to refresh access token. no refresh token found in storage');

                return null;
            }

            logger.info(`requesting ${API_AUTH_REFRESH}`);
            const response = await api.get(API_AUTH_REFRESH, {
                headers: {
                    Authorization: getBearerHeader(refreshToken),
                },
            });

            const { accessToken } = response.data;
            if (!accessToken) {
                logger.warn('failed to refresh access token. did not receive new token');

                return null;
            }

            setToken(ACCESS_TOKEN_KEY, accessToken);
            logger.info('successfully refreshed access token');

            return accessToken;
        } catch (error) {
            logger.error('failed to refresh access token', error);
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
        const refreshToken = getToken(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            logger.warn('failed to logout. no refresh token found in storage');

            return;
        }

        logger.info(`requesting ${API_AUTH_LOGOUT}`);
        const response = await api.post(API_AUTH_LOGOUT, null, {
            headers: {
                Authorization: getBearerHeader(refreshToken),
            },
        });

        if (response.status != HttpStatusCode.Ok) {
            logger.warn('failed to logout. bad response code');
        }

        logger.info('successfully logged out');
    } catch (error) {
        logger.error('failed to logout', error);
    }
};
