import Button from '@components/Button';

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full'>
                <h2 className='text-lg font-semibold mb-2'>{title}</h2>
                <p className='text-sm text-gray-600 mb-4'>{message}</p>
                <div className='flex justify-end gap-2'>
                    <Button variant='secondary' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant='danger' onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
