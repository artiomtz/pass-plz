import { AuthContext, AuthContextType } from '@contexts/AuthContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        console.error('failed to fetch authentication context');
        toast.error('Failed to fetch authentication context');
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;
