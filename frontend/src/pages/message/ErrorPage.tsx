import MessageLayout from '@layouts/MessageLayout';
import { ServerCrash } from 'lucide-react';

const ErrorPage = () => (
    <MessageLayout
        icon={
            <ServerCrash
                className='label-style'
                size={60}
            />
        }
        message='An error has occurred.'
        title='Something Went Wrong'
    />
);

export default ErrorPage;
