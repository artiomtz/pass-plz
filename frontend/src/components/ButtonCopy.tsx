import { Copy } from 'lucide-react';
import React from 'react';

interface ButtonCopyProps {
    textToCopy: string;
}

const ButtonCopy: React.FC<ButtonCopyProps> = ({ textToCopy }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).catch((err) => {
            console.error('Copy failed', err);
        });
    };

    return (
        <button
            type='button'
            onClick={handleCopy}
            className='p-1 hover:bg-gray-200 rounded cursor-pointer'>
            <Copy size={18} />
        </button>
    );
};

export default ButtonCopy;
