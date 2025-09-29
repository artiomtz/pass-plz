import Button from '@components/buttons/Button';
import useAuth from '@hooks/useAuth';
import { AlertTriangle, Home } from 'lucide-react';

type MessageLayoutProps = {
    icon?: React.ReactNode;
    title: string;
    message: string;
};

const MessageLayout = ({
    icon = (
        <AlertTriangle
            className='text-gray-500'
            size={60}
        />
    ),
    message = 'An error has occurred.',
    title = 'Something Went Wrong',
}: MessageLayoutProps) => {
    const { logout } = useAuth();

    const onButtonClick = () => {
        logout();
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen text-center gap-6'>
            {icon}
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className='text-gray-600'>{message}</p>

            <Button
                className='mt-8'
                onClick={onButtonClick}
                variant='primary'>
                <Home
                    className='mr-2'
                    size={18}
                />
                Back to Welcome
            </Button>
        </div>
    );
};

export default MessageLayout;
