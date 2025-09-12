import { logoutApi } from '@api/authApi';
import { requestCancellation } from '@api/userApi';
import ModalConfirmation from '@components/ModalConfirmation';
// import Navbar from '@components/Navbar';
import Button from '@components/Button';
import Spinner from '@components/Spinner';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@routes/constants';
import { CircleX, Menu, Trash2, UserX } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// interface NavbarProps {
//     user: User | null;
//     onLogout: () => void;
//     onDeleteAccount: () => Promise<void>;
// }

// const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onDeleteAccount }) => {
const Navbar: React.FC = () => {
    const navigate = useNavigate();
    // const authContext = useAuth();
    // if (!authContext) {
    //     // log
    //     // toast
    //     // navigate(ROUTES.SIGN_IN, { replace: true });
    //     return null;
    // }
    // const { user, logout } = authContext;

    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingLogOut, setLoadingLogOut] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    // const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        console.log(`logging out...`);
        setLoadingLogOut(true);
        // try {
        await logoutApi();
        // const response = await logoutApi();
        setLoadingLogOut(false);
        // loading?
        // toast
        // if (!response) {
        //     console.error('get failed... toast'); /////////////////// less logs in components
        // setLoadingLogOut(false); // close more stuff here? other similar places?
        // no need toast
        // return null;
        // }
        // } catch (err) {
        //     console.error('logout failed:', err);
        // } finally {
        // }

        // navigate(ROUTES.WELCOME,{ replace: true });

        toast.success(`${user?.email} logged out`);
        setOpen(false);
        logout();
        // navigate(ROUTES.WELCOME, { replace: true });
    };

    const handleDeleteConfirm = async () => {
        // try {
        if (!user) {
            return;
        }
        setLoadingDelete(true);
        //toast
        console.log(`requesting cancellation...`);
        const response = await requestCancellation(user);
        setLoadingDelete(false);
        // loading
        if (!response.ok) {
            console.error('logout failed... toast');
            toast.error('Failed to request cancellation');
        }
        // } catch (err) {
        //     console.error('logout failed:', err);
        // } finally {
        logout();
        // success toast - no
        // navigate(ROUTES.WELCOME, { replace: true });
        // loading done
        // }

        setShowConfirm(false);
        // await onDeleteAccount(); // check / toast
        toast.success('Deletion confirmation sent via email');
        navigate(ROUTES.WELCOME, { replace: true });
    };

    const handleRequestCancellation = async () => {
        setOpen(false);
        setShowConfirm(true);
    };

    if (!user) return null;

    return (
        <>
            {/* Thin menu button */}
            <button
                onClick={() => setOpen(!open)}
                className='absolute bottom-2 left-2 sm:p-2 rounded-md hover:bg-gray-200 cursor-pointer'>
                <Menu size={22} />
            </button>

            {/* Side menu */}
            {open && (
                <div className='fixed inset-0 bg-black/30 z-20' onClick={() => setOpen(false)}>
                    <div
                        className='absolute top-0 left-0 w-70 h-full bg-white shadow-lg flex flex-col p-8 gap-8'
                        onClick={(e) => e.stopPropagation()}>
                        <Button variant='secondary' onClick={handleLogout}>
                            {loadingLogOut ? (
                                <>
                                    <Spinner /> Logout
                                </>
                            ) : (
                                <>
                                    <UserX size={18} />
                                    Logout
                                </>
                            )}
                        </Button>
                        <Button variant='danger' onClick={handleRequestCancellation}>
                            {loadingDelete ? (
                                <>
                                    <Spinner /> Delete Account
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete Account
                                </>
                            )}
                        </Button>

                        <div className='flex justify-start items-end h-full'>
                            {/* <span className='font-bold text-lg'>Menu</span> */}
                            <button className='cursor-pointer' onClick={() => setOpen(false)}>
                                <CircleX size={26} />
                            </button>
                        </div>

                        {/* <button
                            onClick={() => {
                                handleLogout;
                                // setOpen(false);
                                // onLogout();
                                // navigate(ROUTES.WELCOME, { replace: true });
                            }}
                            className='text-left hover:text-red-500'>
                            Logout
                        </button> */}

                        {/* <button
                            onClick={() => {
                                handleRequestCancellation;
                                // setOpen(false);
                                // setShowConfirm(true);
                            }}
                            className='text-left hover:text-red-500 cursor-pointer'>
                            Delete Account
                        </button> */}
                    </div>
                </div>
            )}

            {showConfirm && (
                <ModalConfirmation
                    title='Delete Account'
                    message='Are you sure you want to permanently delete your account?'
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default Navbar;
