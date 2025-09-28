export const API_PASSWORDS = '/api/passwords';
export const API_PASSWORDS_USER = '/api/passwords/user';

export const API_AUTH_REGISTER = '/api/auth/register';
export const API_AUTH_AUTHENTICATE = '/api/auth/authenticate';
export const API_AUTH_REFRESH = '/api/auth/refresh-token';
export const API_AUTH_LOGOUT = '/api/auth/logout';

export const API_USERS = '/api/users';
export const API_USERS_RESET_PASSWORD = '/api/users/reset-password';
export const API_USERS_REQUEST_RESET_PASSWORD = '/api/users/request-reset-password';
export const API_USERS_REQUEST_CANCELLATION = '/api/users/request-cancellation';

export const API_HEALTH = '/api/health';
export const LOGIN_TIME = '/login-time';

export const BASIC_AUTH_ENDPOINTS = [API_AUTH_REGISTER, API_AUTH_AUTHENTICATE];
export const NO_AUTH_ENDPOINTS = [API_USERS_RESET_PASSWORD, API_USERS_REQUEST_RESET_PASSWORD];
export const USER_AUTH_ENDPOINTS = [API_AUTH_REGISTER, API_AUTH_AUTHENTICATE, API_AUTH_REFRESH, API_AUTH_LOGOUT];

export const isBasicAuthRoute = (url: string = '') => {
    return BASIC_AUTH_ENDPOINTS.some((endpoint) => {
        return url.includes(endpoint);
    });
};

export const isNoAuthRoute = (url: string = '') => {
    return NO_AUTH_ENDPOINTS.some((endpoint) => {
        return url.includes(endpoint);
    });
};

export const isUserAuthRoute = (url: string = '') => {
    return USER_AUTH_ENDPOINTS.some((endpoint) => {
        return url.includes(endpoint);
    });
};
