export const ROUTES = {
    WELCOME: '/',
    SIGN_UP: '/sign-up',
    SIGN_IN: '/sign-in',
    DASHBOARD: '/dashboard',
    // PASSWORD_DETAIL: '/passwords/:id',
    // ...
};

export const BASIC_AUTH_ENDPOINTS = ['/auth/authenticate', '/auth/register'];

export const isBasicAuthRoute = (url: string = '') =>
    BASIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
