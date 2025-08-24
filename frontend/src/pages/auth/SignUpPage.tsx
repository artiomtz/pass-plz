import { signUpApi } from '@api/authApi';
import Button from '@components/Button';
import InputFieldWithLabel from '@components/InputFieldWithLabel';
import PasswordHint from '@components/PasswordHint';
import { useAuth } from '@hooks/useAuth';
import PageLayout from '@layouts/GlobalLayout';
import { User } from '@models/user';
import { ROUTES } from '@routes/constants';
import { sanitizeInput, validateEmail } from '@utils/inputUtil';
import { sanitizePassword, validatePassword } from '@utils/passwordUtil';
import { UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    // const [user, setUser] = useState<User | null>(null);

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [passwordFocus, setPasswordFocus] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showPasswordHint, setShowPasswordHint] = useState(false);

    // const validatePassword = (pwd: string) => {
    //     //////////////////////// import
    //     return (
    //         pwd.length >= 12 &&
    //         /[a-z]/.test(pwd) &&
    //         /[A-Z]/.test(pwd) &&
    //         /[0-9]/.test(pwd) &&
    //         /[!@#$%^&+=(){}[\]:;<>,.?/~_\-]/.test(pwd)
    //     );
    // };

    const handleSignUp = async () =>
        // email: string, password: string
        {
            try {
                console.log('Signing up.......');
                console.log('email: ' + email);
                console.log('isEmailValid: ' + isEmailValid + ' ' + validateEmail(email));
                console.log('Password:', `"${password}"`, 'Confirm:', `"${confirmPassword}"`);
                console.log('isPasswordValid: ' + isPasswordValid);
                console.log('passwordsMatch: ' + passwordsMatch);

                // validate input

                const response = await signUpApi(email, password);

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
                console.log('Signed up:', user);

                // toast about email confirmation
                login(user);
                navigate(ROUTES.SIGN_IN, { replace: true });
            } catch (error) {
                console.error('Sign-up failed:', error);
            }
        };

    const inputHint = () => {
        if (!email && !password && !confirmPassword) return '';

        const errors = [];
        if (!isEmailValid) errors.push('Invalid email');
        if (!isPasswordValid) errors.push('Weak password');
        if (!passwordsMatch) errors.push('Passwords do not match');

        if (errors.length === 0) return '✅ All checks passed';
        return `❌ ${errors.join(', ')}`;
    };

    useEffect(() => {
        const trimmedPassword = password.trim();
        const trimmedConfirm = confirmPassword.trim();
        // const passwordChecks = validatePassword(password);
        setIsEmailValid(validateEmail(email));
        setIsPasswordValid(validatePassword(password).isValid);
        setPasswordsMatch(trimmedPassword.length > 0 && trimmedPassword === trimmedConfirm);
        // setPasswordsMatch(password !== '' && confirmPassword !== '' && password === confirmPassword);
    }, [email, password, confirmPassword]);

    return (
        <PageLayout title='Create A New Account'>
            {/* <form onSubmit={(e) => e.preventDefault()}> */}
            <div className='flex flex-col items-center justify-center mx-auto'>
                <div className='w-full rounded-2xl shadow-xl border sm:max-w-md border-gray-500'>
                    <div className='p-6 space-y-6 sm:p-8'>
                        {/* <p class='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
                                Create an account
                            </p> */}
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

                        <div className='relative'>
                            <InputFieldWithLabel
                                id='password'
                                label='Password'
                                type='password'
                                placeholder='••••••••••••'
                                value={password}
                                // onChange={(e) => setPassword(e.target.value)}
                                onChange={(e) => sanitizePassword(e, setPassword)}
                                onFocus={() => setShowPasswordHint(true)}
                                onBlur={() => setShowPasswordHint(false)}
                                // onFocus={() => setPasswordFocus(true)}
                                // onBlur={() => setPasswordFocus(false)}
                                required
                            />
                            {showPasswordHint && <PasswordHint password={password} />}
                            {/* {passwordFocus && (
                                    <div className='absolute top-full mt-2 w-full rounded bg-gray-800 p-3 text-xs text-white shadow-lg space-y-1 z-10'>
                                        <div
                                            className={
                                                password.length >= 12 ? 'text-green-400' : ''
                                            }>
                                            • At least 12 characters
                                        </div>
                                        <div
                                            className={
                                                /[A-Z]/.test(password) ? 'text-green-400' : ''
                                            }>
                                            • One uppercase letter
                                        </div>
                                        <div
                                            className={
                                                /[a-z]/.test(password) ? 'text-green-400' : ''
                                            }>
                                            • One lowercase letter
                                        </div>
                                        <div
                                            className={
                                                /[0-9]/.test(password) ? 'text-green-400' : ''
                                            }>
                                            • One number
                                        </div>
                                        <div
                                            className={
                                                /[!@#$%^&+=(){}[\]:;<>,.?/~_\-]/.test(password)
                                                    ? 'text-green-400'
                                                    : ''
                                            }>
                                            • One special character
                                        </div>
                                    </div>
                                )} */}

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
                        </div>

                        <InputFieldWithLabel
                            id='confirmPassword'
                            label='Confirm Password'
                            type='password'
                            placeholder='••••••••••••'
                            value={confirmPassword}
                            onChange={(e) => sanitizePassword(e, setConfirmPassword)}
                            // onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <p className='text-sm text-gray-500 mb-4' aria-live='polite'>
                            {inputHint()}
                            {/* {confirmPassword && (
                                    <>
                                        {isEmailValid && isPasswordValid && passwordsMatch ? (
                                            '✅ All checks passed'
                                        ) : (
                                            <>
                                                ❌{' '}
                                                {[
                                                    !isEmailValid && 'Invalid email',
                                                    !isPasswordValid && 'Weak password',
                                                    !passwordsMatch && 'Passwords do not match',
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </>
                                        )}
                                    </>
                                )} */}
                        </p>

                        {/* <p
                                className={`text-sm mb-3 ${
                                    passwordsMatch ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {confirmPassword
                                    ? passwordsMatch
                                        ? '✅ Passwords match'
                                        : '❌ Passwords do not match'
                                    : ''}
                            </p> */}

                        {/* <div>
                                <label
                                    htmlFor='confirmPassword'
                                    className='block mb-2 text-gray-900'>
                                    Confirm Password
                                </label>
                                <input
                                    className='bg-gray-50 border border-gray-300 text-gray-500 rounded-2xl block w-full p-3 shadow-lg focus:outline-zinc-400'
                                    placeholder='••••••••••••'
                                    id='confirmPassword'
                                    type='password'></input>
                            </div> */}

                        <div className='flex items-start'>
                            {/* <div className='flex items-center h-5'>
                                    <input
                                        className='w-4 h-4 border border-gray-300 rounded bg-gray-50 bg-gray-700 border-gray-600'
                                        // className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring focus:ring-primary-300 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800'
                                        // id='terms'
                                        aria-describedby='terms'
                                        type='checkbox'></input>
                                </div> */}
                            <div className='ml-3 text-sm'>
                                <label htmlFor='terms' className='text-gray-500 text-gray-300'>
                                    By using the Pass Plz
                                    <br />
                                    you agree to the the{' '}
                                    <a
                                        // href='#'    ////////////////////////////// separate component
                                        id='terms'
                                        className='font-semibold group relative text-zinc-400'
                                        // className='relative font-medium hover:underline text-blue-600 group'
                                    >
                                        Terms and Conditions
                                        <span className='font-medium absolute z-10 hidden group-hover:block top-full mt-1 w-64 p-2 text-xs rounded bg-gray-800 text-white shadow-lg'>
                                            By using this service, you agree that Pass Plz is not
                                            liable for any damages, losses, or data breaches. Use at
                                            your own risk. No warranties are implied.
                                        </span>
                                    </a>
                                </label>
                            </div>
                        </div>

                        <div className='flex justify-center px-6 py-6 mx-auto'>
                            <Button
                                onClick={handleSignUp}
                                disabled={!isEmailValid || !isPasswordValid || !passwordsMatch}
                                //   disabled={!emailValid || !passwordValid || password !== confirmPassword}
                                // onClick={handleSignUp}
                            >
                                <UserPlus size={18} />
                                Create Account
                            </Button>
                        </div>
                        {/* <button
                                className='w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white'
                                type='submit'>
                                Create an account
                            </button> */}
                    </div>
                </div>
            </div>
            {/* </form> */}
            {/* <AuthForm onSubmit={handleSignUp} buttonText='Sign Up' /> */}
        </PageLayout>
    );
};

export default SignUpPage;
