import { refreshApi } from '@api/authApi';
import User from '@models/user';
import ROUTES, { UNPROTECTED_ROUTES } from '@routes/constants';
import logger from '@utils/loggerUtil';
import {
    clearStoredUser,
    clearTheme,
    clearTokens,
    getAccessToken,
    getStoredUser,
    setStoredUser,
} from '@utils/storageUtil';
import { isTokenExpired } from '@utils/tokenUtil';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthContextType {
    isLoading: boolean;
    login: (_userData: User) => void;
    logout: () => void;
    user: User | null;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async (): Promise<void> => {
            if (UNPROTECTED_ROUTES.includes(location.pathname)) {
                logger.info('navigating to an unprotected route');
                setIsLoading(false);

                return;
            }

            const storedUser = getStoredUser();
            const storedToken = getAccessToken();
            if (!storedUser || !storedToken) {
                logger.warn('failed to authenticate. no user or access token found in storage');
                logout();

                return;
            }

            if (isTokenExpired(storedToken)) {
                const newAccessToken = await refreshApi();

                if (!newAccessToken) {
                    toast.error('Authentication expired');
                    logout();

                    return;
                }

                logger.info('successfully refreshed access token');
            }

            setUser(storedUser);
            setIsLoading(false);
        };

        checkAuth();
    }, [location.pathname]);

    const login = (userData: User): void => {
        setUser(userData);
        setStoredUser(userData);
        setIsLoading(false);
        logger.info('successfully logged in');
    };

    const logout = (): void => {
        setUser(null);
        clearTheme();
        clearTokens();
        clearStoredUser();
        setIsLoading(false);
        navigate(ROUTES.WELCOME, { replace: true });
        logger.info('successfully logged out');
    };

    const authState = useMemo(() => ({ isLoading, login, logout, user }), [user, isLoading]);

    return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
