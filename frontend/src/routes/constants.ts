export const ROUTES = {
    WELCOME: '/',
    SIGN_UP: '/sign-up',
    SIGN_IN: '/sign-in',
    REQUEST_RESET: '/request-reset',
    PASSWORD_RESET: '/password-reset',
    DASHBOARD: '/dashboard',
    GOODBYE: '/goodbye',
    ERROR: '/error',
    // PASSWORD_DETAIL: '/passwords/:id',
    // ...
};
export const UNPROTECTED_ROUTES = [
    ROUTES.WELCOME,
    ROUTES.SIGN_IN,
    ROUTES.SIGN_UP,
    ROUTES.REQUEST_RESET,
    ROUTES.PASSWORD_RESET,
    ROUTES.GOODBYE,
    ROUTES.ERROR,
];
