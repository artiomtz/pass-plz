import { requestResetPassword } from '@api/userApi';
import AuthForm from '@components/AuthForm';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@routes/constants';
import { useNavigate } from 'react-router-dom';

const RequestResetPage = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleResetRequest = async (email: string) => {
        try {
            // validate input
            const response = await requestResetPassword(email);

            if (!response) {
                console.error('request failed');
            }
            // toast
            navigate(ROUTES.SIGN_IN);
        } catch (error) {
            console.error('request failed:', error);
        }
    };

    return <AuthForm onSubmit={handleResetRequest} buttonText='send confirmation' />;
};

export default RequestResetPage;
