import { Plus } from 'lucide-react';

interface ButtonAddProps {
    onClick: () => void;
}

export const ButtonAdd: React.FC<ButtonAddProps> = ({ onClick }) => (
    <button
        type='button'
        onClick={onClick}
        className='cursor-pointer w-6 h-6 flex items-center justify-center hover:bg-gray-200'>
        {/* className='w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer'> */}
        <Plus size={18} />
    </button>
);
