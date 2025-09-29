import { signUpApi } from '@api/authApi';
import Button from '@components/buttons/Button';
import InputFieldWithLabel from '@components/inputs/InputFieldWithLabel';
import LabelTermsConditions from '@components/labels/LabelTermsConditions';
import PasswordHint from '@components/PasswordHint';
import Spinner from '@components/Spinner';
import GlobalLayout from '@layouts/GlobalLayout';
import ROUTES from '@routes/constants';
import { sanitizeInput, validateEmail } from '@utils/inputUtil';
import { sanitizeBadCharacters, validatePassword } from '@utils/passwordUtil';
import { UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showPasswordHint, setShowPasswordHint] = useState(false);

    const handleSignUp = async () => {
        try {
            setLoading(true);
            const response = await signUpApi(email, password);

            setLoading(false);
            if (!response.ok) {
                toast.error(`Failed to sign up ${email}`);

                return null;
            }

            toast.success(`Verification email sent to ${email}`);
            navigate(ROUTES.SIGN_IN, { replace: true });
        } catch (error) {
            console.error('failed to sign up', error);
            toast.error(`Error occurred while signing up ${email}`);
        }
    };

    const inputHint = () => {
        if (!email && !password && !confirmPassword) {
            return '';
        }

        const errors = [];
        if (!isEmailValid) {
            errors.push('Invalid email');
        }

        if (!isPasswordValid) {
            errors.push('Weak password');
        }

        if (!passwordsMatch) {
            errors.push('Passwords do not match');
        }

        if (errors.length === 0) {
            return '✅ All checks passed';
        }

        return `❌ ${errors.join(', ')}`;
    };

    useEffect(() => {
        const trimmedPassword = password?.trim();
        const trimmedConfirm = confirmPassword?.trim();
        setIsEmailValid(validateEmail(email));
        setIsPasswordValid(validatePassword(password).isValid);
        setPasswordsMatch(trimmedPassword.length > 0 && trimmedPassword === trimmedConfirm);
    }, [email, password, confirmPassword]);

    return (
        <GlobalLayout title='Create A New Account'>
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

                        <div className='relative'>
                            <InputFieldWithLabel
                                id='password'
                                label='Password'
                                onBlur={() => {
                                    return setShowPasswordHint(false);
                                }}
                                onChange={(e) => {
                                    return setPassword(sanitizeBadCharacters(e.target.value));
                                }}
                                onFocus={() => {
                                    return setShowPasswordHint(true);
                                }}
                                placeholder='••••••••••••'
                                required
                                type='password'
                                value={password}
                            />
                            {showPasswordHint && <PasswordHint password={password} />}
                        </div>

                        <InputFieldWithLabel
                            id='confirmPassword'
                            label='Confirm Password'
                            onChange={(e) => {
                                return setConfirmPassword(sanitizeBadCharacters(e.target.value));
                            }}
                            placeholder='••••••••••••'
                            required
                            type='password'
                            value={confirmPassword}
                        />

                        <p
                            aria-live='polite'
                            className='text-sm text-gray-500 mb-4'>
                            {inputHint()}
                        </p>

                        <div className='flex items-start'>
                            <div className='ml-3 text-sm'>
                                <LabelTermsConditions />
                            </div>
                        </div>

                        <div className='flex justify-center px-6 py-6 mx-auto'>
                            <Button
                                disabled={!isEmailValid || !isPasswordValid || !passwordsMatch}
                                onClick={handleSignUp}>
                                <>
                                    {loading ? <Spinner /> : <UserPlus size={18} />}
                                    Create Account
                                </>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default SignUpPage;
