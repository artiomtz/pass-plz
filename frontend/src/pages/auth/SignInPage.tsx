import { signInApi } from '@api/authApi';
import { updateLoginTimeApi } from '@api/userApi';
import Button from '@components/Button';
import InputFieldWithLabel from '@components/InputFieldWithLabel';
import Spinner from '@components/Spinner';
import useAuth from '@hooks/useAuth';
import GlobalLayout from '@layouts/GlobalLayout';
import type User from '@models/user';
import ROUTES from '@routes/constants';
import { sanitizeInput, validateEmail } from '@utils/inputUtil';
import { sanitizeBadCharacters } from '@utils/passwordUtil';
import { LockKeyholeOpen, UserLock } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const response = await signInApi(email, password);
            setLoading(false);

            if (!response.ok) {
                toast.error(`Failed to sign in ${email}`);

                return null;
            }

            const user: User = {
                email,
                id: response.data.userId,
                lastVisited: response.data.lastVisited,
            };

            login(user);
            const responseLoginTime = await updateLoginTimeApi(user);
            if (!responseLoginTime.ok) {
                toast.error('Failed to update login time');
            }

            toast.success(`${email} signed in`);
            navigate(ROUTES.DASHBOARD, { replace: true });
        } catch (error) {
            console.error('failed to sign in', error);
            toast.error(`Error occurred while signing in ${email}`);
        }
    };

    const handleForgotPassword = async () => {
        navigate(ROUTES.REQUEST_RESET);
    };

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
    }, [email]);

    return (
        <GlobalLayout title='Sign In To Your Account'>
            <div className='flex flex-col items-center justify-center mx-auto'>
                <div className='w-full rounded-2xl shadow-xl border sm:max-w-md border-gray-500'>
                    <div className='p-6 space-y-6 sm:p-8'>
                        <InputFieldWithLabel
                            id='email'
                            label='Email'
                            onChange={(e) => {
                                return setEmail(sanitizeInput(e.target.value));
                            }}
                            placeholder='me@email.com'
                            required
                            type='email'
                            value={email}
                        />

                        <InputFieldWithLabel
                            id='password'
                            label='Password'
                            onChange={(e) => {
                                return setPassword(sanitizeBadCharacters(e.target.value));
                            }}
                            placeholder='••••••••••••'
                            required
                            type='password'
                            value={password}
                        />

                        <div className='flex flex-col items-center gap-y-4 px-6 py-6 mx-auto space-y-6'>
                            <Button
                                disabled={!isEmailValid || password?.trim() === ''}
                                onClick={handleSignIn}>
                                <>
                                    {loading ? <Spinner /> : <LockKeyholeOpen size={18} />}
                                    Sign In
                                </>
                            </Button>
                            <Button onClick={handleForgotPassword}>
                                <UserLock size={18} />
                                Forgot Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default SignInPage;
