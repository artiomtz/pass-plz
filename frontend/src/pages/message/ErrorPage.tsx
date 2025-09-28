import MessageLayout from '@layouts/MessageLayout';
import { ServerCrash } from 'lucide-react';

const ErrorPage = () => {
    return (
        <MessageLayout
            icon={
                <ServerCrash
                    className='text-gray-500'
                    size={60}
                />
            }
            message='An error has occurred.'
            title='Something Went Wrong'
        />
    );
};

export default ErrorPage;
