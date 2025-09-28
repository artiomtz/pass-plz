import { refreshApi } from '@api/authApi';
import { isBasicAuthRoute, isNoAuthRoute, isUserAuthRoute } from '@api/constants';
import { getBasicAuthHeader, getBearerHeader } from '@utils/authUtil';
import { getRefreshToken } from '@utils/storageUtil';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import decamelizeKeys from 'decamelize-keys';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];

api.interceptors.request.use(
    (config) => {
        if (config.data && typeof config.data === 'object') {
            config.data = decamelizeKeys(config.data, { deep: true });
        }

        if (config.params && typeof config.params === 'object') {
            config.params = decamelizeKeys(config.params, { deep: true });
        }

        if (isNoAuthRoute(config.url)) {
            console.debug('using no authentication for the request');
        } else if (isBasicAuthRoute(config.url) && config.auth) {
            const { password, username } = config.auth;
            config.headers.Authorization = getBasicAuthHeader(username, password);
            console.debug('using basic authentication for the request', `${config.headers.Authorization}`);
        } else {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                config.headers.Authorization = getBearerHeader(refreshToken);
                console.debug('using jwt authentication for the request', `Bearer ${refreshToken}`);
            }
        }

        return config;
    },
    (error) => {
        console.error('failed to intercept request');
        if (error instanceof Error) {
            Promise.reject(error);
        } else {
            Promise.reject(new Error(String(error)));
        }
    }
);

api.interceptors.response.use(
    (response) => {
        if (response.data && typeof response.data === 'object') {
            response.data = camelcaseKeys(response.data, { deep: true });
        }

        return response;
    },
    async (error) => {
        const original = error.config;
        if (!original || original._retry) {
            return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        }

        const { response } = error;
        if (response?.status === 403 && !isNoAuthRoute(original.url) && !isUserAuthRoute(original.url)) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ reject, resolve });
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    console.log('signing in again', `Bearer ${token}`);

                    return api(original);
                });
            }

            original._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshApi();
                if (!newAccessToken) {
                    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
                }
                processQueue(null, newAccessToken);
                original.headers.Authorization = `Bearer ${newAccessToken}`;
                console.debug('refreshing access token:', `Bearer ${newAccessToken}`);

                return api(original);
            } catch (err) {
                processQueue(err, null);

                console.error('failed to intercept response. error while refreshing access token');

                return Promise.reject(error instanceof Error ? error : new Error(String(error)));
            } finally {
                isRefreshing = false;
            }
        }

        console.error('failed to intercept response');

        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
);

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export default api;
