import { pingApi } from '@api/healthApi';
import Button from '@components/buttons/Button';
import GlobalLayout from '@layouts/GlobalLayout';
import ROUTES from '@routes/constants';
import logger from '@utils/loggerUtil';
import { LockKeyholeOpen, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const pingServer = async () => {
            const response = await pingApi();
            if (!response.ok) {
                toast.error(`${response.error}. Try again shortly`);
            } else {
                logger.info('connected to server');
                toast.success('Connected to server');
            }
        };

        pingServer();
    }, []);

    const handleSignUp = async () => {
        navigate(ROUTES.SIGN_UP);
    };

    const handleSignIn = async () => {
        navigate(ROUTES.SIGN_IN);
    };

    return (
        <GlobalLayout title='Welcome To Pass Plz'>
            <div className='md:mt-[-5vh] text-center max-w-3xl mx-auto'>
                <div className='space-y-10 text-center mx-auto'>
                    <p>
                        Pass Plz is a modern password manager designed to make security effortless. It works seamlessly
                        on both web and mobile, so your passwords are always with you.
                    </p>

                    <p>
                        The app is fast, styled, and intuitive to use. You can store much more than just logins. Pass
                        Plz supports various fields per password and gives you tools to organize, sort, search, and tag
                        your entries.
                    </p>

                    <p>
                        Your privacy is priority: Pass Plz handles all data securely, avoids storing anything
                        unnecessary, and comes with email confirmation for added safety.
                    </p>

                    <p>
                        Built with the latest technologies, Pass Plz offers a smooth, modern experience with no
                        compromises on privacy, speed, or simplicity.
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row justify-center items-center w-full gap-10 sm:gap-16 p-2 mt-10 sm:mt-20'>
                    <Button onClick={handleSignUp}>
                        <UserPlus size={18} />
                        Sign Up
                    </Button>
                    <Button onClick={handleSignIn}>
                        <LockKeyholeOpen size={18} />
                        Sign In
                    </Button>
                </div>
            </div>
        </GlobalLayout>
    );
};

export default WelcomePage;
