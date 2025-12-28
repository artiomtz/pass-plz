import { logoutApi } from '@api/authApi';
import { requestCancellation } from '@api/userApi';
import Button from '@components/buttons/Button';
import ModalConfirmation from '@components/ModalConfirmation';
import Spinner from '@components/Spinner';
import useAuth from '@hooks/useAuth';
import useTheme from '@hooks/useTheme';
import ROUTES from '@routes/constants';
import logger from '@utils/loggerUtil';
import { fadeMotionProps, slideMotionProps } from '@utils/motionUtil';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleX, Menu, Moon, Sun, Trash2, UserX } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { appTheme, toggleTheme } = useTheme();
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
                className='absolute bottom-2 left-2 sm:p-2 rounded-xl cursor-pointer'
                onClick={() => setOpen(!open)}>
                <Menu size={26} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className='fixed inset-0 z-20 backdrop-blur-xs'
                        key='navbar-background'
                        onClick={() => setOpen(false)}
                        {...fadeMotionProps}>
                        <div className='absolute inset-0 bg-black/30' />

                        <motion.div
                            className='absolute top-0 left-0 w-70 h-full shadow-xl flex flex-col p-8 gap-8 navbar-style'
                            key='navbar'
                            onClick={(e) => e.stopPropagation()}
                            {...slideMotionProps}>
                            <Button
                                onClick={toggleTheme}
                                variant='secondary'>
                                {appTheme === 'light' ? (
                                    <>
                                        <Moon size={18} /> Dark Mode
                                    </>
                                ) : (
                                    <>
                                        <Sun size={18} /> Light Mode
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant='primary'>
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
                                    className='icon-style hover-style'
                                    onClick={() => setOpen(false)}>
                                    <CircleX size={26} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ModalConfirmation
                message='Are you sure you want to permanently delete your account and all its data?'
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleDeleteConfirm}
                show={showConfirm}
                title='Delete Account'
            />
        </>
    );
};

export default Navbar;
