import Button from '@components/buttons/Button';
import { fadeMotionProps, scaleMotionProps } from '@utils/motionUtil';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalConfirmationProps {
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    show: boolean;
    title: string;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({ message, onCancel, onConfirm, show = false, title }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                className='fixed inset-0 bg-black/30 flex items-center justify-center z-20 backdrop-blur-xs'
                key='modal-background'
                onClick={onCancel}
                {...fadeMotionProps}>
                <motion.div
                    className='card-style rounded-xl shadow-xl p-6 w-xs sm:w-sm'
                    key='modal'
                    onClick={(e) => e.stopPropagation()}
                    {...scaleMotionProps}>
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
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default ModalConfirmation;
