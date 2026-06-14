import ErrorBoundary from '@contexts/ErrorBoundary';
import PasswordResetPage from '@pages/auth/PasswordResetPage';
import RequestResetPage from '@pages/auth/RequestResetPage';
import SignInPage from '@pages/auth/SignInPage';
import SignUpPage from '@pages/auth/SignUpPage';
import DashboardPage from '@pages/DashboardPage';
import CancellationPage from '@pages/message/CancellationPage';
import ErrorPage from '@pages/message/ErrorPage';
import NotFoundPage from '@pages/message/NotFoundPage';
import VerifyPage from '@pages/message/VerifyPage';
import WelcomePage from '@pages/WelcomePage';
import ROUTES from '@routes/constants';
import ProtectedRoute from '@routes/ProtectedRoute';
import { fadeMotionProps } from '@utils/motionUtil';
import { motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

export const AppRoutes = () => {
    const location = useLocation();

    return (
        <Routes
            key={location.pathname}
            location={location}>
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <WelcomePage />
                    </motion.div>
                }
                path={ROUTES.WELCOME}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <SignInPage />
                    </motion.div>
                }
                path={ROUTES.SIGN_IN}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <SignUpPage />
                    </motion.div>
                }
                path={ROUTES.SIGN_UP}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <VerifyPage />
                    </motion.div>
                }
                path={ROUTES.VERIFY}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <RequestResetPage />
                    </motion.div>
                }
                path={ROUTES.REQUEST_RESET}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <PasswordResetPage />
                    </motion.div>
                }
                path={ROUTES.PASSWORD_RESET}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <CancellationPage />
                    </motion.div>
                }
                path={ROUTES.GOODBYE}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <ErrorPage />
                    </motion.div>
                }
                path={ROUTES.ERROR}
            />
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <ErrorBoundary fallback={<ErrorPage />}>
                            <ProtectedRoute />
                        </ErrorBoundary>
                    </motion.div>
                }>
                <Route
                    element={
                        <motion.div {...fadeMotionProps}>
                            <DashboardPage />
                        </motion.div>
                    }
                    path={ROUTES.DASHBOARD}
                />
            </Route>
            <Route
                element={
                    <motion.div {...fadeMotionProps}>
                        <NotFoundPage />
                    </motion.div>
                }
                path='*'
            />
        </Routes>
    );
};

export default AppRoutes;
