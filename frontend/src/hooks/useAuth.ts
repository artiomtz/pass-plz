import { AuthContext, AuthContextType } from '@contexts/AuthContext';
import logger from '@utils/loggerUtil';
import { useContext } from 'react';
import toast from 'react-hot-toast';

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        logger.error('failed to fetch authentication context');
        toast.error('Failed to fetch authentication');
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;
