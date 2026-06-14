import { verifyCancellation, verifyResetPassword, verifyUser } from '@api/emailApi';
import { ApiResponse } from '@api/handleApiError';
import Spinner from '@components/Spinner';
import GlobalLayout from '@layouts/GlobalLayout';
import Verification from '@models/verification';
import ROUTES from '@routes/constants';
import logger from '@utils/loggerUtil';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const userVerification = 'verify-user';
    const passwordResetVerification = 'verify-reset-password';
    const cancellationVerification = 'cancel-user';

    useEffect(() => {
        const type = searchParams.get('type');
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (!type || !email || !token) {
            logger.error('failed to get verification parameters');
            toast.error('Invalid verification link');
            navigate(ROUTES.ERROR, { replace: true });
            return;
        }

        const verify = async () => {
            let response: ApiResponse<string>;
            const verification: Verification = {
                email: email,
                token: token,
            };

            try {
                switch (type) {
                    case userVerification:
                        response = await verifyUser(verification);
                        break;

                    case passwordResetVerification:
                        response = await verifyResetPassword(verification);
                        break;

                    case cancellationVerification:
                        response = await verifyCancellation(verification);
                        break;

                    default:
                        logger.error(`failed to determine verification type: ${type}`);
                        toast.error('Failed to determine verification type');
                        navigate(ROUTES.ERROR, { replace: true });
                        return;
                }

                if (response.ok) {
                    logger.info(`successfully verified ${email}`);
                    toast.success(response.data);

                    switch (type) {
                        case userVerification:
                            navigate(ROUTES.WELCOME, { replace: true });
                            break;

                        case passwordResetVerification:
                            navigate(`${ROUTES.PASSWORD_RESET}?token=${token}`, { replace: true });
                            break;

                        case cancellationVerification:
                            navigate(ROUTES.GOODBYE, { replace: true });
                            break;
                    }
                } else {
                    logger.warn(`failed to verify ${email}`);
                    toast.error(response.error);
                    navigate(ROUTES.ERROR, { replace: true });
                }
            } catch (error) {
                logger.error('failed to verify', error);
                toast.error('Failed to verify');
                navigate(ROUTES.ERROR, { replace: true });
            }
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <GlobalLayout title='Verifying Request'>
            <div className='flex flex-col items-center justify-center h-[60vh]'>
                <div className='flex flex-col items-center space-y-6'>
                    <Spinner size={60} />
                    <p>Verifying your request...</p>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default VerifyPage;
