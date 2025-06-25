import { signInApi } from '@api/authApi';
import { updateLoginTimeApi } from '@api/userApi';
import AuthForm from '@components/AuthForm';
import { useAuth } from '@hooks/useAuth';
import type { User } from '@models/user';
import { ROUTES } from '@routes/constants';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    // const [user, setUser] = useState<User | null>(null);

    const handleSignIn = async (email: string, password: string) => {
        try {
            console.log('Signing in.......');
            // validate input
            const response = await signInApi(email, password);

            const user: User = {
                email,
                id: response.userId,
                lastVisited: response.lastVisited,
            };
            console.log('Signed in:', user);

            login(user);
            // try {
            const responseLoginTime = await updateLoginTimeApi(user);
            if (!responseLoginTime) {
                console.error('update failed... toast');
            }
            // toast
            navigate(ROUTES.DASHBOARD);
        } catch (error) {
            console.error('Sign-in failed:', error);
        }
    };

    const handleForgotPassword = async () => {
        try {
            // toast
            console.warn('navigating to reset request');
            navigate(ROUTES.REQUEST_RESET);
        } catch (error) {
            console.error('reset request failed:', error);
        }
    };

    return (
        <>
            <AuthForm onSubmit={handleSignIn} buttonText='Sign In' />
            <button
                className='mt-4 bg-red-500 text-white px-4 py-2 rounded'
                onClick={handleForgotPassword}>
                Forgot Password
            </button>
            <button className='mt-4 bg-red-500 text-white px-4 py-2 rounded' onClick={logout}>
                Logout (test)
            </button>
        </>
    );
};

export default SignInPage;
