import { signInApi } from '@api/authApi';
import { updateLoginTimeApi } from '@api/userApi';
import Button from '@components/Button';
import InputFieldWithLabel from '@components/InputFieldWithLabel';
import { useAuth } from '@hooks/useAuth';
import PageLayout from '@layouts/GlobalLayout';
import type { User } from '@models/user';
import { ROUTES } from '@routes/constants';
import { sanitizeInput, validateEmail } from '@utils/inputUtil';
import { sanitizePassword } from '@utils/passwordUtil';
import { LockKeyholeOpen, UserLock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const { login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    // const [user, setUser] = useState<User | null>(null);

    const handleSignIn = async () => {
        try {
            console.log('Signing in.......');
            // validate input
            const response = await signInApi(email, password);

            if (!response) {
                console.error('get failed... toast');
                // toast
                // navigate(ROUTES.SIGN_IN,{ replace: true }); // 404
                return null;
            }

            const user: User = {
                email,
                id: response.userId,
                lastVisited: response.lastVisited,
            };
            console.log('Signed in:', user);

            login(user);
            // toast
            const responseLoginTime = await updateLoginTimeApi(user);
            if (!responseLoginTime) {
                console.error('update failed... toast');
                // toast
            }
            navigate(ROUTES.DASHBOARD, { replace: true });
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

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
    }, [email]);

    return (
        // <PageLayout title='Sign In To Your Account'>
        //     <AuthForm onSubmit={handleSignIn} buttonText='Sign In' />
        //     <button
        //         className='mt-4 bg-red-500 text-white px-4 py-2 rounded'
        //         onClick={handleForgotPassword}>
        //         Forgot Password
        //     </button>
        //     <button className='mt-4 bg-red-500 text-white px-4 py-2 rounded' onClick={logout}>
        //         Logout (test)
        //     </button>
        // </PageLayout>
        <PageLayout title='Sign In To Your Account'>
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
                            // onChange={(e) => setEmail(e.target.value)}
                            // onChange={(e) => sanitizeInput(e, setEmail)}
                            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                            required
                        />
                        {/* <div>
                                <label htmlFor='email' className='block mb-2 text-gray-900'>
                                    Email
                                </label>
                                <input
                                    placeholder='me@email.com'
                                    className='bg-gray-50 border border-gray-300 text-gray-500 rounded-2xl block w-full p-3 shadow-lg focus:outline-zinc-400'
                                    id='email'
                                    type='text'></input>
                            </div> */}

                        <InputFieldWithLabel
                            id='password'
                            label='Password'
                            type='password'
                            placeholder='••••••••••••'
                            value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            onChange={(e) => sanitizePassword(e, setPassword)}
                            required
                        />
                        {/* <div>
                                <label htmlFor='password' className='block mb-2 text-gray-900'>
                                    Password
                                </label>
                                <input
                                    className='bg-gray-50 border border-gray-300 text-gray-500 rounded-2xl block w-full p-3 shadow-lg focus:outline-zinc-400'
                                    placeholder='••••••••••••'
                                    id='password'
                                    type='password'></input>
                            </div> */}

                        <div className='flex flex-col items-center gap-y-4 px-6 py-6 mx-auto space-y-6'>
                            <Button
                                disabled={!isEmailValid || password.trim() === ''}
                                onClick={handleSignIn}>
                                <LockKeyholeOpen size={18} />
                                Sign In
                                {/* {loading ? <Spinner /> : <><LogIn /> Sign In</>} */}
                            </Button>
                            <Button onClick={handleForgotPassword}>
                                <UserLock size={18} />
                                Forgot Password
                            </Button>
                        </div>

                        {/* <div className='flex justify-center px-6 py-6 mx-auto'>
                                <Button onClick={handleSignIn}>Sign In</Button>
                                <Button onClick={handleForgotPassword}>ForgotPassword</Button>
                            </div> */}
                    </div>
                </div>
            </div>
            {/* </form> */}
        </PageLayout>
    );
};

export default SignInPage;
