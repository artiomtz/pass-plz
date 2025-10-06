import { resetPassword } from '@api/userApi';
import Button from '@components/buttons/Button';
import InputFieldWithLabel from '@components/inputs/InputFieldWithLabel';
import PasswordHint from '@components/PasswordHint';
import Spinner from '@components/Spinner';
import GlobalLayout from '@layouts/GlobalLayout';
import PasswordReset from '@models/passwordReset';
import ROUTES from '@routes/constants';
import logger from '@utils/loggerUtil';
import { sanitizeBadCharacters, validatePassword } from '@utils/passwordUtil';
import { getResetToken, setResetToken } from '@utils/storageUtil';
import { LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showPasswordHint, setShowPasswordHint] = useState(false);

    const handlePasswordReset = async (): Promise<void> => {
        if (newPassword !== confirmNewPassword) {
            logger.error('failed to reset password. passwords do not match');
            toast.error('Passwords do not match');

            return;
        }

        const token = getResetToken();
        if (!token) {
            logger.error('failed to reset password. no reset token found in storage');
            toast.error('Failed to fetch reset token');

            return;
        }

        try {
            const passwordReset: PasswordReset = {
                newPassword: newPassword,
                token: token,
            };

            setLoading(true);
            const response = await resetPassword(passwordReset);
            setLoading(false);

            if (!response.ok) {
                toast.error(response.error);
            } else {
                toast.success(response.data);
            }

            navigate(ROUTES.SIGN_IN, { replace: true });
        } catch (error) {
            logger.error('failed to reset password', error);
            toast.error('Failed to reset password');
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            setResetToken(token);
        } else {
            logger.warn('failed to fetch token from search parameters');
            toast.error('Failed to fetch reset token');
        }
    }, [searchParams]);

    useEffect(() => {
        const trimmedPassword = newPassword?.trim();
        const trimmedConfirm = confirmNewPassword?.trim();
        setIsPasswordValid(validatePassword(newPassword).isValid);
        setPasswordsMatch(trimmedPassword.length > 0 && trimmedPassword === trimmedConfirm);
    }, [newPassword, confirmNewPassword]);

    return (
        <GlobalLayout title='Create A New Password'>
            <div className='flex flex-col items-center justify-center mx-auto'>
                <div className='w-full rounded-2xl shadow-xl border sm:max-w-md border-gray-500'>
                    <div className='p-6 space-y-6 sm:p-8'>
                        <div className='relative'>
                            <InputFieldWithLabel
                                id='password'
                                label='Password'
                                onBlur={() => {
                                    return setShowPasswordHint(false);
                                }}
                                onChange={(e) => {
                                    return setNewPassword(sanitizeBadCharacters(e.target.value));
                                }}
                                onFocus={() => {
                                    return setShowPasswordHint(true);
                                }}
                                placeholder='••••••••••••'
                                required
                                type='password'
                                value={newPassword}
                            />
                            {showPasswordHint && <PasswordHint password={newPassword} />}
                        </div>

                        <InputFieldWithLabel
                            id='confirmNewPassword'
                            label='Confirm Password'
                            onChange={(e) => {
                                return setConfirmNewPassword(sanitizeBadCharacters(e.target.value));
                            }}
                            placeholder='••••••••••••'
                            required
                            type='password'
                            value={confirmNewPassword}
                        />

                        <div className='flex justify-center px-6 py-6 mx-auto'>
                            <Button
                                disabled={!isPasswordValid || !passwordsMatch}
                                onClick={handlePasswordReset}>
                                <>
                                    {loading ? <Spinner /> : <LockKeyhole size={18} />}
                                    Set New Password
                                </>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default ResetPasswordPage;
