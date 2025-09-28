import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        const now = Date.now() / 1000;

        return exp < now;
    } catch {
        return true;
    }
};
