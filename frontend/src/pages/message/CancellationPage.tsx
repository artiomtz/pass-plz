import MessageLayout from '@layouts/MessageLayout';
import { UserMinus } from 'lucide-react';

const CancellationPage = () => (
    <MessageLayout
        icon={
            <UserMinus
                className='text-gray-500'
                size={60}
            />
        }
        message='Your account and all its data were deleted.'
        title='Account Cancelled'
    />
);

export default CancellationPage;
