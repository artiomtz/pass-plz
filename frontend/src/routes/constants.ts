const ROUTES = {
    DASHBOARD: '/dashboard',
    ERROR: '/error',
    GOODBYE: '/goodbye',
    PASSWORD_RESET: '/password-reset',
    REQUEST_RESET: '/request-reset',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    WELCOME: '/',
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

export default ROUTES;
