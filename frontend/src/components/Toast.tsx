import { Toaster } from 'react-hot-toast';

const Toast: React.FC = () => (
    <Toaster
        position='bottom-right'
        toastOptions={{
            duration: 3000,
            error: {
                className: 'toast-style-error',
            },
            loading: {
                className: 'toast-style-loading',
            },
            style: {
                borderRadius: '10px',
                fontSize: '1rem',
                padding: '12px 16px',
            },
            success: {
                className: 'toast-style-success',
            },
        }}
    />
);

export default Toast;
