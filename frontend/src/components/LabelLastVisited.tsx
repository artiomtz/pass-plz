import useAuth from '@hooks/useAuth';
import { formatDisplayDateTime } from '@utils/dateUtil';

const LabelLastVisited: React.FC = () => {
    const { user } = useAuth();

    if (!user?.lastVisited) {
        return null;
    }

    return (
        <span className='absolute right-4 bottom-2 text-xs text-gray-300'>
            Last visited: {formatDisplayDateTime(user.lastVisited)}
        </span>
    );
};

export default LabelLastVisited;
