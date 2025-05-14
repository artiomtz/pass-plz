import { api } from '@api/axiosInstance';
import { getBearerHeader } from '@utils/authUtil';
import {
    clearStoredUser,
    clearTokens,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from '@utils/storageUtil';

export const signIn = async (email: string, password: string) => {
    try {
        // const headers = getAuthHeader(AUTH_TYPE.BASIC, { email, password });
        const { data } = await api.post(
            // <{ accessToken: string; refreshToken: string }> // create dto type
            '/api/auth/authenticate', ///// move to constants
            { email, password },
            {
                auth: { username: email, password },
            }
        );

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return {
            userId: data.userId,
            lastVisited: data.lastVisited,
            email, // include email to create user object
        };
    } catch (error) {
        console.error('Sign-in failed:', error);
        throw error;
    }
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
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

            const response = await api.get('/api/auth/refresh-token', {
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
