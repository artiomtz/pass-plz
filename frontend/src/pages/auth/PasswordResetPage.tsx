import { resetPassword } from '@api/userApi';
import Button from '@components/Button';
import InputFieldWithLabel from '@components/InputFieldWithLabel';
import PasswordHint from '@components/PasswordHint';
import PageLayout from '@layouts/GlobalLayout';
import { PasswordReset } from '@models/passwordReset';
import { ROUTES } from '@routes/constants';
import { sanitizePassword, validatePassword } from '@utils/passwordUtil';
import { getResetToken, setResetToken } from '@utils/storageUtil';

import { LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

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
            // toast
            // navigate?
            // setError('Reset token is missing. Please use the reset link again.');
            return;
        }

        try {
            const passwordReset: PasswordReset = {
                token: token,
                newPassword: newPassword,
            };

            const response = await resetPassword(passwordReset);
            if (!response) {
                // toast
                console.error('reset failed');
            }
            // setSuccess(true);
        } catch (err) {
            // toast
            console.error('Reset failed:', err);
            // setError('Reset failed. Please try again or request a new reset link.');
        }

        navigate(ROUTES.SIGN_IN, { replace: true });
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
                                // onChange={(e) => setNewPassword(e.target.value)}
                                onChange={(e) => sanitizePassword(e, setNewPassword)}
                                onFocus={() => setShowPasswordHint(true)}
                                onBlur={() => setShowPasswordHint(false)}
                                required
                            />
                            {showPasswordHint && <PasswordHint password={newPassword} />}
                        </div>

                        <InputFieldWithLabel
                            id='confirmNewPassword'
                            label='Confirm Password'
                            type='password'
                            placeholder='••••••••••••'
                            value={confirmNewPassword}
                            onChange={(e) => sanitizePassword(e, setConfirmNewPassword)}
                            // onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />

                        <div className='flex justify-center px-6 py-6 mx-auto'>
                            <Button
                                onClick={handlePasswordReset}
                                disabled={!isPasswordValid || !passwordsMatch}>
                                <LockKeyhole size={18} />
                                Set New Password
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
