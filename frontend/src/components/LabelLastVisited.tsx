import { useAuth } from '@hooks/useAuth';
// import { ROUTES } from '@routes/constants';
import { formatDisplayDateTime } from '@utils/dateUtil';
// import { useNavigate } from 'react-router-dom';

export default function LabelLastVisited() {
    // const navigate = useNavigate();
    // const authContext = useAuth();
    // if (!authContext) {
    //     // log
    //     // toast
    //     // navigate(ROUTES.SIGN_IN, { replace: true }); // no need
    //     return null;
    // }
    // const { user, logout } = authContext;
    const { user, logout } = useAuth();

    if (!user?.lastVisited) return null;

    return (
        <span className='absolute right-4 bottom-2 text-xs text-gray-300'>
            Last visited: {formatDisplayDateTime(user.lastVisited)}
        </span>
    );
}
