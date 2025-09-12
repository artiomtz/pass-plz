// import { useAuth } from '@hooks/useAuth';
// import Button from '@components/Button';
// import { AlertTriangle } from 'lucide-react'; // XCircle
// import { useAuth } from '@hooks/useAuth';
import { MessageLayout } from '@layouts/MessageLayout';
import { AlertTriangle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    // const { logout } = useAuth();
    // const navigate = useNavigate();

    // const handleBack = () => {
    //     logout();
    //     navigate(ROUTES.WELCOME, { replace: true });
    // };

    return (
        <MessageLayout
            title='Page Not Found'
            message="The page you're looking for doesn't exist."
            icon={<AlertTriangle size={60} className='text-gray-500' />}
            //   onButtonClick={() => {
            //     logout();
            //     navigate(ROUTES.WELCOME, { replace: true });
            //   }}
        />
        // <div className='flex flex-col items-center justify-center h-screen text-center gap-6'>
        //     <AlertTriangle size={60} className='text-gray-400' />
        //     <h1 className='text-2xl font-bold'>Page not found</h1>
        //     <p className='text-gray-500'>The page you're looking for doesn't exist.</p>
        //     <Button onClick={handleBack}>Go to Welcome</Button>
        // </div>
    );
};

export default NotFoundPage;
