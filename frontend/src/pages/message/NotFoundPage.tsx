import MessageLayout from '@layouts/MessageLayout';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => (
    <MessageLayout
        icon={
            <AlertTriangle
                className='label-style'
                size={60}
            />
        }
        message="The page you're looking for doesn't exist."
        title='Page Not Found'
    />
);

export default NotFoundPage;
