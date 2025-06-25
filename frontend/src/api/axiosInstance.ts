import { refreshApi } from '@api/authApi';
import { isBasicAuthRoute, isNoAuthRoute, isUserAuthRoute } from '@api/constants';
import { getBasicAuthHeader, getBearerHeader } from '@utils/authUtil';
import { getRefreshToken } from '@utils/storageUtil';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import decamelizeKeys from 'decamelize-keys';
// import { useNavigate } from 'react-router-dom'; // no

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];
// const BASIC_AUTH_ENDPOINTS = ['/auth/authenticate', '/auth/register'];

api.interceptors.request.use(
    (config) => {
        // const url = config.url ?? '';
        // const isBasic = BASIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
        // console.log(`converting........ ${config.data}`);

        if (config.data && typeof config.data === 'object') {
            config.data = decamelizeKeys(config.data, { deep: true });
        }

        if (config.params && typeof config.params === 'object') {
            config.params = decamelizeKeys(config.params, { deep: true });
        }
        // console.log(`converted........ ${config.data}`);
        if (isNoAuthRoute(config.url)) {
            console.log('using no auth');
        } else if (isBasicAuthRoute(config.url) && config.auth) {
            const { username, password } = config.auth;
            config.headers.Authorization = getBasicAuthHeader(username, password);
            console.log('Basic auth:', `${config.headers.Authorization}`);
        } else {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                config.headers.Authorization = getBearerHeader(refreshToken);
                console.log('setting:', `Bearer ${refreshToken}`);
            }
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // console.log(`converting........ ${response.data}`);
        if (response.data && typeof response.data === 'object') {
            response.data = camelcaseKeys(response.data, { deep: true });
        }
        // console.log(`converted........ ${response.data}`);
        return response;
    },
    async (error) => {
        const original = error.config;

        if (!original || original._retry) {
            return Promise.reject(error);
        }

        const { response } = error;

        if (
            response?.status === 403 &&
            !isNoAuthRoute(original.url) &&
            !isUserAuthRoute(original.url)
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    console.log('signing in again:', `Bearer ${token}`);
                    return api(original);
                });
            }

            original._retry = true;
            isRefreshing = true;
            // const navigate = useNavigate();

            try {
                const newAccessToken = await refreshApi();
                if (!newAccessToken) {
                    throw new Error('Refresh failed');
                }
                processQueue(null, newAccessToken);
                original.headers.Authorization = `Bearer ${newAccessToken}`;
                console.log('refreshing access token:', `Bearer ${newAccessToken}`);
                return api(original);
            } catch (err) {
                processQueue(err, null);
                // clearTokens(); // in refreshAccessToken
                // clearStoredUser(); // in refreshAccessToken
                // navigate(ROUTES.SIGN_IN); // only components!
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        switch (
            response?.status // later make 1 line with toast?
        ) {
            case 401:
                console.error(`401 API Error ${response.status}:`, response.data);
                break;
            case 404:
                console.error(`404 API Error ${response.status}:`, response.data);
                break;
            case 406:
                console.error(`406 API Error ${response.status}:`, response.data);
                break;
            case 500:
                console.error(`500 API Error ${response.status}:`, response.data);
                break;
            default:
                console.log(`API ERROR ${response.status}:`, response.data);
                break;
        }

        // if ([401, 404, 406, 500].includes(response?.status)) {
        //     console.error(`API Error ${response.status}:`, response.data);
        // }

        return Promise.reject(error);
    }
);

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            console.log('prom.reject(error):', `${error}`);
            prom.reject(error);
        } else {
            console.log('prom.resolve(error):', `${token}`);
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export default api;
