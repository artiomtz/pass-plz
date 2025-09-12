import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { AlertTriangle, Home } from 'lucide-react'; // XCircle
// import { useNavigate } from 'react-router-dom';

type MessageLayoutProps = {
    icon?: React.ReactNode;
    title: string;
    message: string;
    // buttonLabel?: string;
    //   onButtonClick?: () => void;
};

export const MessageLayout = ({
    icon = <AlertTriangle size={60} className='text-gray-500' />,
    title = 'Something Went Wrong',
    message = 'An error has occurred.',
}: // buttonLabel = 'Back to Welcome',
//   onButtonClick,
MessageLayoutProps) => {
    const { logout } = useAuth();
    // const navigate = useNavigate();

    const onButtonClick = () => {
        logout();
        // navigate(ROUTES.WELCOME, { replace: true }); -- in logout
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen text-center gap-6'>
            {/* <div className='flex flex-col items-center justify-center min-h-screen text-center px-6'> */}
            {/* <div className='flex flex-col items-center gap-4 max-w-md'> */}
            {/* <div className='flex items-center justify-center w-16 h-16 rounded-full bg-gray-100'> */}
            {icon}
            {/* </div> */}
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className='text-gray-600'>{message}</p>

            <Button className='mt-8' onClick={onButtonClick} variant='primary'>
                <Home size={18} className='mr-2' />
                Back to Welcome
            </Button>
            {/* </div> */}
        </div>
    );
};
