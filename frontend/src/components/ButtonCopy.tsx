import { Copy } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

interface ButtonCopyProps {
    textToCopy: string;
}

const ButtonCopy: React.FC<ButtonCopyProps> = ({ textToCopy }) => {
    const disabled = !textToCopy?.trim();

    const handleCopy = async () => {
        if (disabled) {
            return;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success('Copied');
        } catch (error) {
            console.error('failed to copy to clipboard');
            toast.error('Failed to copy');
        }
    };

    return (
        <button
            className={`p-1 rounded transition ${disabled ? 'text-gray-400' : 'cursor-pointer hover:bg-gray-200'}`}
            disabled={disabled}
            onClick={handleCopy}
            type='button'>
            <Copy size={18} />
        </button>
    );
};

export default ButtonCopy;
