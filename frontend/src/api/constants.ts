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

export const API_VERIFY_USER = '/api/email/verify-user';
export const API_VERIFY_RESET = '/api/email/verify-reset-password';
export const API_VERIFY_CANCELLATION = '/api/email/cancel-user';

export const API_HEALTH = '/api/health';
export const LOGIN_TIME = '/login-time';

export const BASIC_AUTH_ENDPOINTS = [API_AUTH_REGISTER, API_AUTH_AUTHENTICATE];
export const USER_AUTH_ENDPOINTS = [API_AUTH_REGISTER, API_AUTH_AUTHENTICATE, API_AUTH_REFRESH, API_AUTH_LOGOUT];
export const NO_AUTH_ENDPOINTS = [
    API_USERS_RESET_PASSWORD,
    API_USERS_REQUEST_RESET_PASSWORD,
    API_VERIFY_USER,
    API_VERIFY_RESET,
    API_VERIFY_CANCELLATION,
];

export const isBasicAuthRoute = (url: string = ''): boolean =>
    BASIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

export const isNoAuthRoute = (url: string = ''): boolean =>
    NO_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

export const isUserAuthRoute = (url: string = ''): boolean =>
    USER_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
