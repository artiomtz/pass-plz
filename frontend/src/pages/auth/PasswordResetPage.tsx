import { resetPassword } from '@api/userApi';
import { PasswordReset } from '@models/passwordReset';
import { ROUTES } from '@routes/constants';
import { getResetToken, setResetToken } from '@utils/storageUtil';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        console.warn(`searchParams token: ${token}`);
        if (token) {
            setResetToken(token);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // prevent reload?
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const token = getResetToken();
        if (!token) {
            setError('Reset token is missing. Please use the reset link again.');
            return;
        }

        try {
            const passwordReset: PasswordReset = {
                token: token,
                newPassword: newPassword,
            };
            const response = await resetPassword(passwordReset);
            if (!response) {
                console.error('reset failed');
            }
            setSuccess(true);
            // optionally navigate to login or success screen
            // navigate('/sign-in');
        } catch (err) {
            console.error('Reset failed:', err);
            setError('Reset failed. Please try again or request a new reset link.');
        }

        navigate(ROUTES.SIGN_IN);
    };

    return (
        <div className='reset-password-container'>
            <h2>Reset Password</h2>
            {success ? (
                <p>
                    Your password has been reset successfully. You can now{' '}
                    <a href='/sign-in'>sign in</a>.
                </p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='newPassword'>New Password:</label>
                        <input
                            type='password'
                            id='newPassword'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='confirmPassword'>Confirm Password:</label>
                        <input
                            type='password'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className='error'>{error}</p>}
                    <button type='submit'>Reset Password</button>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordPage;
