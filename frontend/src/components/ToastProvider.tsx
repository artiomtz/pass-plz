import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    return (
        <Toaster
            position='bottom-right'
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#fff',
                    color: '#333',
                    // background: theme === 'dark' ? '#1f2937' : '#fff',
                    // color: theme === 'dark' ? '#f9fafb' : '#333',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                },
                success: {
                    style: { background: '#dcfce7', color: '#166534' },
                },
                error: {
                    style: { background: '#fee2e2', color: '#991b1b' },
                },
            }}
        />
    );
};

export default ToastProvider;
