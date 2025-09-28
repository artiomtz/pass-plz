import Spinner from '@components/Spinner';
import useAuth from '@hooks/useAuth';
import ROUTES from '@routes/constants';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectTo = ROUTES.WELCOME }) => {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-100'>
                <Spinner size={60} />
            </div>
        );
    }

    return user ? (
        <Outlet />
    ) : (
        <Navigate
            replace
            to={redirectTo}
        />
    );
};

export default ProtectedRoute;
