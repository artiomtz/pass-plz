import { resetPassword } from '@api/userApi';
import Button from '@components/Button';
import InputFieldWithLabel from '@components/InputFieldWithLabel';
import PasswordHint from '@components/PasswordHint';
import Spinner from '@components/Spinner';
import PageLayout from '@layouts/GlobalLayout';
import { PasswordReset } from '@models/passwordReset';
import { ROUTES } from '@routes/constants';
import { sanitizeBadCharacters, validatePassword } from '@utils/passwordUtil';
import { getResetToken, setResetToken } from '@utils/storageUtil';

import { LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showPasswordHint, setShowPasswordHint] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    // const [success, setSuccess] = useState(false);

    const handlePasswordReset = async () => {
        // const handlePasswordReset = async (e: React.FormEvent) => {
        // e.preventDefault(); // prevent reload?
        // setError(null);

        if (newPassword !== confirmNewPassword) {
            ///// make global checks?
            // setError('Passwords do not match.');
            return;
        }

        const token = getResetToken();
        if (!token) {
            // console
            toast.error('Failed to fetch reset token');
            // navigate?
            // setError('Reset token is missing. Please use the reset link again.');
            return;
        }

        try {
            setLoading(true);
            const passwordReset: PasswordReset = {
                token: token,
                newPassword: newPassword,
            };

            const response = await resetPassword(passwordReset);
            setLoading(false);
            if (!response.ok) {
                toast.error('Failed to reset password');
                console.error('reset failed');
            }

            toast.success('Successfully reset password');
            navigate(ROUTES.SIGN_IN, { replace: true });
        } catch (err) {
            toast.error('Error occurred while resetting password');
            console.error('Reset failed:', err);
            // setError('Reset failed. Please try again or request a new reset link.');
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');
        console.warn(`searchParams token: ${token}`);
        if (token) {
            setResetToken(token);
        }
    }, [searchParams]);

    useEffect(() => {
        const trimmedPassword = newPassword.trim();
        const trimmedConfirm = confirmNewPassword.trim();
        setIsPasswordValid(validatePassword(newPassword).isValid);
        setPasswordsMatch(trimmedPassword.length > 0 && trimmedPassword === trimmedConfirm);
    }, [newPassword, confirmNewPassword]);

    return (
        <PageLayout title='Create A New Password'>
            {/* <form onSubmit={(e) => e.preventDefault()}> */}
            <div className='flex flex-col items-center justify-center mx-auto'>
                <div className='w-full rounded-2xl shadow-xl border sm:max-w-md border-gray-500'>
                    <div className='p-6 space-y-6 sm:p-8'>
                        <div className='relative'>
                            <InputFieldWithLabel
                                id='password'
                                label='Password'
                                type='password'
                                placeholder='••••••••••••'
                                value={newPassword}
                                required
                                onFocus={() => setShowPasswordHint(true)}
                                onBlur={() => setShowPasswordHint(false)}
                                onChange={(e) =>
                                    setNewPassword(sanitizeBadCharacters(e.target.value))
                                }
                                // onChange={(e) => sanitizePassword(e, setNewPassword)}
                            />
                            {showPasswordHint && <PasswordHint password={newPassword} />}
                        </div>

                        <InputFieldWithLabel
                            id='confirmNewPassword'
                            label='Confirm Password'
                            type='password'
                            placeholder='••••••••••••'
                            value={confirmNewPassword}
                            required
                            // onChange={(e) => sanitizePassword(e, setConfirmNewPassword)}
                            onChange={(e) =>
                                setConfirmNewPassword(sanitizeBadCharacters(e.target.value))
                            }
                        />

                        <div className='flex justify-center px-6 py-6 mx-auto'>
                            <Button
                                onClick={handlePasswordReset}
                                disabled={!isPasswordValid || !passwordsMatch}>
                                {loading ? (
                                    <>
                                        <Spinner /> Set New Password
                                    </>
                                ) : (
                                    <>
                                        <LockKeyhole size={18} />
                                        Set New Password
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* </form> */}
        </PageLayout>
    );
};

export default ResetPasswordPage;
