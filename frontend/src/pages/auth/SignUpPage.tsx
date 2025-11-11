import { signUpApi } from '@api/authApi';
import Button from '@components/buttons/Button';
import InputFieldWithLabel from '@components/inputs/InputFieldWithLabel';
import LabelTermsConditions from '@components/labels/LabelTermsConditions';
import PasswordHint from '@components/PasswordHint';
import Spinner from '@components/Spinner';
import GlobalLayout from '@layouts/GlobalLayout';
import ROUTES from '@routes/constants';
import { sanitizeInput, validateEmail } from '@utils/inputUtil';
import logger from '@utils/loggerUtil';
import { sanitizeBadCharacters, validatePassword } from '@utils/passwordUtil';
import { LockKeyhole, LockKeyholeOpen, UserPlus } from 'lucide-react';
import type { JSX } from 'react';
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

    const handleSignUp = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await signUpApi(email, password);
            setLoading(false);

            if (!response.ok) {
                toast.error(response.error);

                return;
            }

            toast.success(`Verification email sent to ${email}`);
            navigate(ROUTES.SIGN_IN, { replace: true });
        } catch (error) {
            logger.error('failed to sign up', error);
            toast.error(`Failed to sign up ${email}`);
        }
    };

    const inputHint = (): JSX.Element | null => {
        if (!email && !password && !confirmPassword) {
            return null;
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
            return (
                <span className='flex items-center gap-2'>
                    <LockKeyhole size={18} />
                    All checks passed
                </span>
            );
        }

        return (
            <span className='flex items-center gap-2'>
                <LockKeyholeOpen size={18} />
                {errors.join(', ')}
            </span>
        );
    };

    const hint = inputHint();

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

                        <div className='relative'>
                            <InputFieldWithLabel
                                id='password'
                                label='Password'
                                onBlur={() => setShowPasswordHint(false)}
                                onChange={(e) => setPassword(sanitizeBadCharacters(e.target.value))}
                                onFocus={() => setShowPasswordHint(true)}
                                placeholder='••••••••••••'
                                required
                                type='password'
                                value={password}
                            />
                            <div className={`transition-style ${showPasswordHint ? 'opacity-100' : 'opacity-0'}`}>
                                <PasswordHint password={password} />
                            </div>
                        </div>

                        <InputFieldWithLabel
                            id='confirmPassword'
                            label='Confirm Password'
                            onChange={(e) => setConfirmPassword(sanitizeBadCharacters(e.target.value))}
                            placeholder='••••••••••••'
                            required
                            type='password'
                            value={confirmPassword}
                        />

                        <div
                            className={`transition-all duration-400 ease overflow-hidden text-sm label-style mb-4 ${
                                hint ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0 pointer-events-none'
                            }`}>
                            {hint}
                        </div>

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
