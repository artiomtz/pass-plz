import logger from '@utils/loggerUtil';
import { Copy } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

interface ButtonCopyProps {
    textToCopy: string;
}

const ButtonCopy: React.FC<ButtonCopyProps> = ({ textToCopy }) => {
    const disabled = !textToCopy?.trim();

    const handleCopy = async (): Promise<void> => {
        if (disabled) {
            return;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success('Text copied');
        } catch (error) {
            logger.error('failed to copy to clipboard', error);
            toast.error('Failed to copy');
        }
    };

    return (
        <button
            className={`p-2 rounded-lg transition icon-style ${disabled ? 'disabled-style' : 'hover-style'}`}
            disabled={disabled}
            onClick={handleCopy}
            type='button'>
            <Copy size={18} />
        </button>
    );
};

export default ButtonCopy;
