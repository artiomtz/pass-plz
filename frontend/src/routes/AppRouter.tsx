// import DashTest from '@pages/dashboard/DashTest';
import ErrorBoundary from '@contexts/ErrorBoundary';
// import ConfirmEmail from '@pages/Auth/ConfirmEmail';
// import { SuggestionsProvider } from '@contexts/SuggestionsContext';
// import SignUp from '@pages/Auth/SignUp';
// import PasswordDetail from '@pages/Dashboard/PasswordDetail';
import PasswordResetPage from '@pages/auth/PasswordResetPage';
import RequestResetPage from '@pages/auth/RequestResetPage';
import SignInPage from '@pages/auth/SignInPage';
import SignUpPage from '@pages/auth/SignUpPage';
import DashboardPage from '@pages/DashboardPage';
import CancellationPage from '@pages/message/CancellationPage';
import ErrorPage from '@pages/message/ErrorPage';
import NotFoundPage from '@pages/message/NotFoundPage';
import WelcomePage from '@pages/WelcomePage';
import ROUTES from '@routes/constants';
import ProtectedRoute from '@routes/ProtectedRoute';
import { Route, Routes } from 'react-router-dom';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route
                element={<WelcomePage />}
                path={ROUTES.WELCOME}
            />
            <Route
                element={<SignInPage />}
                path={ROUTES.SIGN_IN}
            />
            <Route
                element={<SignUpPage />}
                path={ROUTES.SIGN_UP}
            />
            <Route
                element={<RequestResetPage />}
                path={ROUTES.REQUEST_RESET}
            />
            <Route
                element={<PasswordResetPage />}
                path={ROUTES.PASSWORD_RESET}
            />
            <Route
                element={<CancellationPage />}
                path={ROUTES.GOODBYE}
            />
            <Route
                element={<ErrorPage />}
                path={ROUTES.ERROR}
            />
            <Route
                element={
                    <ErrorBoundary fallback={<ErrorPage />}>
                        <ProtectedRoute />
                    </ErrorBoundary>
                }>
                <Route
                    element={<DashboardPage />}
                    path={ROUTES.DASHBOARD}
                />
            </Route>
            <Route
                element={<NotFoundPage />}
                path='*'
            />
        </Routes>
    );
};

export default AppRoutes;

// logger
// set ts types for functions and return types


export default AppRoutes;
