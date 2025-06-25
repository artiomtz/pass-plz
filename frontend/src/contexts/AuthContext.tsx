import { refreshApi } from '@api/authApi';
import { User } from '@models/user';
import { ROUTES, UNPROTECTED_ROUTES } from '@routes/constants';
import {
    clearStoredUser,
    clearTokens,
    getAccessToken,
    getStoredUser,
    setStoredUser,
} from '@utils/storageUtil';
import { isTokenExpired } from '@utils/tokenUtil';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // const value = useMemo(() => ({ user, login, logout, isLoading }), [user, isLoading]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('useAuth.......');

        const checkAuth = async () => {
            if (UNPROTECTED_ROUTES.includes(location.pathname)) {
                console.log('useAuth unprotected route.......');
                setIsLoading(false);
                return;
            }

            const storedUser = getStoredUser();
            const storedToken = getAccessToken();

            if (!storedUser || !storedToken) {
                console.log('No stored user. logging out.....');
                logout();
                return;
            }

            if (isTokenExpired(storedToken)) {
                console.warn('useAuth RE-FRESHING token........');
                const newAccessToken = await refreshApi();
                if (!newAccessToken) {
                    // later save user draft + toast
                    console.warn('refresh Token expired. Logging out....');
                    logout();
                    return;
                }
                // setAccessToken(newAccessToken); // done in ts file
                console.warn('silently REFRESHED access token!');
            }
            setUser(storedUser); ////////////
            setIsLoading(false);
            console.log(`useAuth has user ::::: ${storedUser.email}`);
        };

        checkAuth();
    }, [location.pathname]);

    const login = (userData: User) => {
        setUser(userData);
        setStoredUser(userData);
        setIsLoading(false);
        console.log('useAuth login!!!!');
    };

    const logout = () => {
        setUser(null);
        clearTokens();
        clearStoredUser();
        setIsLoading(false);
        navigate(ROUTES.SIGN_IN, { replace: true });
        console.log('useAuth logout!!!!');
    };

    return (
        //   <AuthContext.Provider value={value}>
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
