import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@routes/constants';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectTo = ROUTES.SIGN_IN }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <>Loading</>; // or null
    }
    return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
