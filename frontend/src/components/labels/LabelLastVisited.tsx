import useAuth from '@hooks/useAuth';
import { formatDisplayDateTime } from '@utils/dateUtil';

const LabelLastVisited: React.FC = () => {
    const { user } = useAuth();

    if (!user?.lastVisited) {
        return null;
    }

    return (
        <span className='absolute right-4 bottom-2 text-xs'>
            Last visited: {formatDisplayDateTime(user.lastVisited)}
        </span>
    );
};

export default LabelLastVisited;
