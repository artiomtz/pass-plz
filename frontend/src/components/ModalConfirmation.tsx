import Button from '@components/Button';

interface ModalConfirmationProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    return (
        <div
            onClick={onCancel}
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-10'>
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full'>
                <h2 className='text-lg font-semibold mb-2'>{title}</h2>
                <p className='text-sm text-gray-600 mb-4'>{message}</p>
                <div className='flex flex-col sm:flex-row justify-center gap-2'>
                    <Button variant='danger' onClick={onConfirm}>
                        Delete
                    </Button>
                    <Button variant='secondary' onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmation;
