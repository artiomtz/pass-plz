import { logoutApi } from '@api/authApi';
import { requestCancellation } from '@api/userApi';
import Button from '@components/buttons/Button';
import ModalConfirmation from '@components/ModalConfirmation';
import Spinner from '@components/Spinner';
import useAuth from '@hooks/useAuth';
import ROUTES from '@routes/constants';
import logger from '@utils/loggerUtil';
import { CircleX, Menu, Trash2, UserX } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingLogOut, setLoadingLogOut] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const { logout, user } = useAuth();

    const handleLogout = async (): Promise<void> => {
        setLoadingLogOut(true);
        await logoutApi();
        setLoadingLogOut(false);

        toast.success(`${user?.email} logged out`);
        setOpen(false);
        logout();
    };

    const handleDeleteConfirm = async (): Promise<void> => {
        if (!user) {
            logger.warn('failed to delete account. user not found');
            toast.error('User not found');

            return;
        }

        setLoadingDelete(true);
        const response = await requestCancellation(user);
        setLoadingDelete(false);

        if (!response.ok) {
            toast.error(response.error);
        } else {
            toast.success(response.data);
            logout();
            navigate(ROUTES.WELCOME, { replace: true });
        }

        setShowConfirm(false);
    };

    const handleRequestCancellation = (): void => {
        setOpen(false);
        setShowConfirm(true);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <button
                className='absolute bottom-2 left-2 sm:p-2 rounded-md hover:bg-gray-200 cursor-pointer'
                onClick={() => {
                    return setOpen(!open);
                }}>
                <Menu size={22} />
            </button>

            {open && (
                <div
                    className='fixed inset-0 bg-black/30 z-20'
                    onClick={() => {
                        return setOpen(false);
                    }}>
                    <div
                        className='absolute top-0 left-0 w-70 h-full bg-white shadow-lg flex flex-col p-8 gap-8'
                        onClick={(e) => {
                            return e.stopPropagation();
                        }}>
                        <Button
                            onClick={handleLogout}
                            variant='secondary'>
                            <>
                                {loadingLogOut ? <Spinner /> : <UserX size={18} />}
                                Logout
                            </>
                        </Button>
                        <Button
                            onClick={handleRequestCancellation}
                            variant='danger'>
                            <>
                                {loadingDelete ? <Spinner /> : <Trash2 size={18} />}
                                Delete Account
                            </>
                        </Button>

                        <div className='flex justify-start items-end h-full'>
                            <button
                                className='cursor-pointer'
                                onClick={() => {
                                    return setOpen(false);
                                }}>
                                <CircleX size={26} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirm && (
                <ModalConfirmation
                    message='Are you sure you want to permanently delete your account?'
                    onCancel={() => {
                        return setShowConfirm(false);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title='Delete Account'
                />
            )}
        </>
    );
};

export default Navbar;
