import { signUpApi } from '@api/authApi';
import AuthForm from '@components/AuthForm';
import type { User } from '@models/user';
import { ROUTES } from '@routes/constants';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    // const { login } = useAuth();
    const navigate = useNavigate();
    // const [user, setUser] = useState<User | null>(null);

    const handleSignUp = async (email: string, password: string) => {
        try {
            console.log('Signing up.......');
            // validate input
            const response = await signUpApi(email, password);

            const user: User = {
                email,
                id: response.userId,
                lastVisited: response.lastVisited,
            };
            console.log('Signed up:', user);

            // toast about email confirmation
            // login(user);
            navigate(ROUTES.SIGN_IN);
        } catch (error) {
            console.error('Sign-up failed:', error);
        }
    };

    return <AuthForm onSubmit={handleSignUp} buttonText='Sign Up' />;
};

export default SignUpPage;
