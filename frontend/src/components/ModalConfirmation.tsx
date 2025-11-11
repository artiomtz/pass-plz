import Button from '@components/buttons/Button';

interface ModalConfirmationProps {
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({ message, onCancel, onConfirm, title }) => (
    <div
        className='fixed inset-0 bg-black/30 flex items-center justify-center z-10'
        onClick={onCancel}>
        <div
            className='card-style rounded-xl shadow-xl p-6 w-xs sm:w-sm w-full'
            onClick={(e) => e.stopPropagation()}>
            <h2 className='text-lg font-semibold mb-2'>{title}</h2>
            <p className='text-sm mb-8'>{message}</p>
            <div className='flex flex-col sm:flex-row justify-center gap-6'>
                <Button
                    onClick={onConfirm}
                    variant='danger'>
                    Delete
                </Button>
                <Button
                    onClick={onCancel}
                    variant='primary'>
                    Cancel
                </Button>
            </div>
        </div>
    </div>
);

export default ModalConfirmation;
