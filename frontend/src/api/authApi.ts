import api from '@api/axiosInstance';
import { API_AUTH_AUTHENTICATE, API_AUTH_LOGOUT, API_AUTH_REFRESH, API_AUTH_REGISTER } from '@api/constants';
import { ApiResponse, handleApiError } from '@api/handleApiError';
import Authentication from '@models/authentication';
import { getBearerHeader } from '@utils/authUtil';
import logger from '@utils/loggerUtil';
import { clearStoredUser, clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from '@utils/storageUtil';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const signUpApi = async (email: string, password: string): Promise<ApiResponse<Authentication>> => {
    try {
        logger.info(`requesting ${API_AUTH_REGISTER}`);
        const { data } = await api.post<Authentication>(
            API_AUTH_REGISTER,
            { email, password },
            { auth: { password, username: email } }
        );

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return { data: data, ok: true };
    } catch (error) {
        logger.error('failed to sign up', error);

        return handleApiError(error);
    }
};

export const signInApi = async (email: string, password: string): Promise<ApiResponse<Authentication>> => {
    try {
        logger.info(`requesting ${API_AUTH_AUTHENTICATE}`);
        const { data } = await api.post<Authentication>(
            API_AUTH_AUTHENTICATE,
            { email, password },
            { auth: { password, username: email } }
        );

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

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
            const refreshToken = getRefreshToken();
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

            setAccessToken(accessToken);
            logger.info('new access token set');

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
        const refreshToken = getRefreshToken();
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

        if (response.status != 200) {
            logger.warn('failed to logout. bad response code');
        }
    } catch (error) {
        logger.warn('failed to logout');
    }
};
