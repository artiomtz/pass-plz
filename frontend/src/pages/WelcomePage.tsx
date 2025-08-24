import Button from '@components/Button';
import PageLayout from '@layouts/GlobalLayout';
import { ROUTES } from '@routes/constants';
import { LockKeyholeOpen, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WelcomePage = () => {
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            // toast
            navigate(ROUTES.SIGN_UP);
        } catch {
            console.error('failed to navigate');
        }
    };

    const handleSignIn = async () => {
        try {
            // toast
            navigate(ROUTES.SIGN_IN);
        } catch {
            console.error('failed to navigate');
        }
    };

    return (
        <PageLayout title='Welcome To Pass Plz'>
            <p className='flex text-center mt-30'>
                Pass Plz is a modern password manager designed to make security effortless. It helps
                you generate strong, unique passwords, stores them safely using end-to-end
                encryption, and lets you log in quickly with one click — no compromises on privacy,
                speed, or simplicity.
            </p>

            <div className='flex flex-col sm:flex-row justify-center items-center w-full gap-10 mt-20'>
                <Button onClick={handleSignUp}>
                    <UserPlus size={18} />
                    Sign Up
                </Button>
                <Button onClick={handleSignIn}>
                    <LockKeyholeOpen size={18} />
                    Sign In
                </Button>
            </div>
        </PageLayout>
    );
};

// <PageLayout title='Welcome to Pass Plz'>
//     <p className='mt-26 text-center '>
//         Pass Plz is a secure and fast password manager built for privacy and ease of use. Create
//         strong passwords, store them safely, and log in with one click.
//     </p>

//     <div className='mt-20 flex w-full flex-col items-center gap-14 sm:flex-row sm:justify-center '>
//         <button className='w-full min-w-[180px] rounded-4xl border border-blue-600 px-2 py-2 shadow-xl text-blue-600 transition hover:bg-blue-50 sm:w-auto'>
//             Sign Up
//         </button>
//         <button className='w-full min-w-[180px] rounded-4xl bg-blue-600 px-6 py-3 text-white shadow-xl transition hover:bg-blue-700 sm:w-auto'>
//             Sign In
//         </button>
//     </div>
// </PageLayout>
