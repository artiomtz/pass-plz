// import Button from '@components/Button';
// import { useAuth } from '@hooks/useAuth';
// import { ROUTES } from '@routes/constants';
// import { useNavigate } from 'react-router-dom';
import { MessageLayout } from '@layouts/MessageLayout';
import { UserMinus } from 'lucide-react';

const CancellationPage = () => {
    // const { logout } = useAuth();
    // const navigate = useNavigate();

    // const handleBack = () => {
    //     logout();
    //     navigate(ROUTES.WELCOME, { replace: true });
    // };

    return (
        <MessageLayout
            title='Account Cancelled'
            message='Your account and all its data were deleted.'
            icon={<UserMinus size={60} className='text-gray-500' />}
        />
        // <div className='flex flex-col items-center justify-center h-screen text-center gap-6'>
        //     <UserMinus size={60} className='text-gray-400' />
        //     <h1 className='text-2xl font-bold'>Account Cancelled</h1>
        //     <p className='text-gray-500'>Your account and all its data were deleted.</p>
        //     <Button onClick={handleBack}>Go to Welcome</Button>
        // </div>
    );
};

export default CancellationPage;
