import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
    return (
        <Toaster
            position='bottom-right'
            toastOptions={{
                duration: 3000,
                error: {
                    style: { background: '#fee2e2', color: '#991b1b' },
                },
                style: {
                    background: '#fff',
                    // background: theme === 'dark' ? '#1f2937' : '#fff',
                    // color: theme === 'dark' ? '#f9fafb' : '#333',
                    borderRadius: '8px',
                    color: '#333',
                    fontSize: '0.9rem',
                    padding: '12px 16px',
                },
                success: {
                    style: { background: '#dcfce7', color: '#166534' },
                },
            }}
        />
    );
};

export default ToastProvider;
