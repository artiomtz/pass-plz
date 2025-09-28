import Button from '@components/Button';

interface ModalConfirmationProps {
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({ message, onCancel, onConfirm, title }) => {
    return (
        <div
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-10'
            onClick={onCancel}>
            <div
                className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full'
                onClick={(e) => {
                    return e.stopPropagation();
                }}>
                <h2 className='text-lg font-semibold mb-2'>{title}</h2>
                <p className='text-sm text-gray-600 mb-4'>{message}</p>
                <div className='flex flex-col sm:flex-row justify-center gap-2'>
                    <Button
                        onClick={onConfirm}
                        variant='danger'>
                        Delete
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant='secondary'>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmation;
