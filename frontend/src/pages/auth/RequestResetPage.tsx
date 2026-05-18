import { requestResetPassword } from '@api/userApi';
import Button from '@components/buttons/Button';
import InputFieldWithLabel from '@components/inputs/InputFieldWithLabel';
import Spinner from '@components/Spinner';
import GlobalLayout from '@layouts/GlobalLayout';
import ROUTES from '@routes/constants';
import { sanitizeInput, validateEmail } from '@utils/inputUtil';
import { Link } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RequestResetPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleResetRequest = async (): Promise<void> => {
        setLoading(true);
        const response = await requestResetPassword(email);
        setLoading(false);

        if (response.ok) {
            toast.success(response.data);
        } else {
            toast.error(response.error);
        }
        navigate(ROUTES.SIGN_IN, { replace: true });
    };

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
    }, [email]);

    return (
        <GlobalLayout title='Reset Password Request'>
            <div className='flex flex-col items-center justify-center mx-auto'>
                <div className='w-full sm:max-w-md'>
                    <div className='p-6 space-y-6 sm:p-8 shadow-xl rounded-2xl login-style'>
                        <InputFieldWithLabel
                            id='email'
                            label='Email'
                            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                            placeholder='me@email.com'
                            required
                            type='email'
                            value={email}
                        />

                        <div className='flex flex-col items-center gap-y-4 px-6 py-6 mx-auto space-y-6'>
                            <Button
                                disabled={!isEmailValid}
                                onClick={handleResetRequest}>
                                <>
                                    {loading ? <Spinner /> : <Link size={18} />}
                                    Send A Reset Link
                                </>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default RequestResetPage;
