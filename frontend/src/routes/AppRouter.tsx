// import ConfirmEmail from '@pages/Auth/ConfirmEmail';
import DashboardPage from '@pages/dashboard/DashboardPage';
import ProtectedRoute from '@routes/ProtectedRoute';
// import SignUp from '@pages/Auth/SignUp';
// import PasswordDetail from '@pages/Dashboard/PasswordDetail';
import SignInPage from '@pages/auth/SignInPage';
import DashTest from '@pages/dashboard/DashTest';
import NotFoundPage from '@pages/NotFoundPage';
import { WelcomePage } from '@pages/WelcomePage';
import { ROUTES } from '@routes/constants';
import { Route, Routes } from 'react-router-dom';

export const AppRoutes = () => (
    <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        {/* <Route path='/sign-up' element={<SignUp />} /> */}
        {/* <Route path='/confirm-email' element={<ConfirmEmail />} /> */}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path='/test' element={<DashTest />} />
        </Route>

        {/* <Route path='/passwords' element={<Passwords />} /> */}
        {/* <Route path='/passwords/:id' element={<PasswordDetail />} /> */}
        {/* <Route path='/profile' element={<Profile />} /> */}

        {/* 404 */}
        <Route path='*' element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;
