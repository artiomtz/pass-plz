import BackgroundAnimation from '@components/BackgroundAnimation';
import Toast from '@components/Toast';
import AuthProvider from '@contexts/AuthContext';
import ErrorBoundary from '@contexts/ErrorBoundary';
import ThemeProvider from '@contexts/ThemeContext';
import AppRoutes from '@routes/AppRouter';
import ROUTES from '@routes/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();

const App = () => (
    <Router>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <BackgroundAnimation />
                    <ErrorBoundary
                        fallback={
                            <Navigate
                                replace
                                to={ROUTES.ERROR}
                            />
                        }>
                        <AppRoutes />
                    </ErrorBoundary>
                    <Toast />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    </Router>
);

export default App;
