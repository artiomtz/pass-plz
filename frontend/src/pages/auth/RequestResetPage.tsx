import { requestResetPassword } from '@api/userApi';
import Button from '@components/Button';
import InputFieldWithLabel from '@components/InputFieldWithLabel';
import { useAuth } from '@hooks/useAuth';
import PageLayout from '@layouts/GlobalLayout';
import { ROUTES } from '@routes/constants';
import { sanitizeInput, validateEmail } from '@utils/inputUtil';
import { Link } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequestResetPage = () => {
    const { login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const navigate = useNavigate();

    const handleResetRequest = async () => {
        // try {
        // validate input
        const response = await requestResetPassword(email);

        // toast
        if (!response) {
            // toast
            console.error('request failed');
        }
        navigate(ROUTES.SIGN_IN, { replace: true });
        // } catch (error) {
        //     console.error('request failed:', error);
        // }
    };

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
    }, [email]);

    return (
        <PageLayout title='Reset Password Request'>
            {/* <form> */}
            <div className='flex flex-col items-center justify-center mx-auto'>
                <div className='w-full rounded-2xl shadow-xl border sm:max-w-md border-gray-500'>
                    <div className='p-6 space-y-6 sm:p-8'>
                        <InputFieldWithLabel
                            id='email'
                            label='Email'
                            type='email'
                            placeholder='me@email.com'
                            value={email}
                            // onChange={(e) => sanitizeInput(e, setEmail)}
                            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                            required
                        />

                        <div className='flex flex-col items-center gap-y-4 px-6 py-6 mx-auto space-y-6'>
                            <Button disabled={!isEmailValid} onClick={handleResetRequest}>
                                <Link size={18} />
                                Send A Reset Link
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* </form> */}
        </PageLayout>
    );
};

export default RequestResetPage;
