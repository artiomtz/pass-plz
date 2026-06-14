const ROUTES = {
    DASHBOARD: '/dashboard',
    ERROR: '/error',
    GOODBYE: '/goodbye',
    PASSWORD_RESET: '/password-reset',
    REQUEST_RESET: '/request-reset',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    VERIFY: '/verify',
    WELCOME: '/',
};

export const UNPROTECTED_ROUTES = [
    ROUTES.ERROR,
    ROUTES.GOODBYE,
    ROUTES.PASSWORD_RESET,
    ROUTES.REQUEST_RESET,
    ROUTES.SIGN_IN,
    ROUTES.SIGN_UP,
    ROUTES.VERIFY,
    ROUTES.WELCOME,
];

export default ROUTES;
