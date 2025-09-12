import { MessageLayout } from '@layouts/MessageLayout';
import { ServerCrash } from 'lucide-react';

const ErrorPage = () => {
    // const { logout } = useAuth();
    // const navigate = useNavigate();

    // const handleBack = () => {
    //     logout();
    //     navigate(ROUTES.WELCOME, { replace: true });
    // };

    return (
        <MessageLayout
            title='Something Went Wrong'
            message='An error has occurred.'
            icon={<ServerCrash size={60} className='text-gray-500' />}
        />
        // <div className='flex flex-col items-center justify-center h-screen text-center gap-6'>
        //     <ServerCrash size={60} className='text-gray-400' />
        //     <h1 className='text-2xl font-bold'>Something went wrong</h1>
        //     <p className='text-gray-500'>An error has occurred.</p>
        //     <Button onClick={handleBack}>Go to Welcome</Button>
        // </div>
    );
};

export default ErrorPage;
