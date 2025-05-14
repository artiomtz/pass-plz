// import React from 'react';
// import './App.css';
import { AuthProvider } from '@contexts/AuthContext';
import { AppRoutes } from '@routes/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();

const App = () => (
    <Router>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {/* <ThemeProvider> */}
                <AppRoutes />
                {/* </ThemeProvider> */}
            </AuthProvider>
        </QueryClientProvider>
    </Router>
);

export default App;
