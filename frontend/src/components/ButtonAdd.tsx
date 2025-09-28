import { Plus } from 'lucide-react';

interface ButtonAddProps {
    disabled: boolean;
    onClick: () => void;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({ disabled = false, onClick }) => {
    return (
        <button
            className={`${
                disabled ? 'text-gray-400' : 'cursor-pointer flex items-center justify-center hover:bg-gray-200'
            }`}
            disabled={disabled}
            onClick={onClick}
            type='button'>
            <Plus size={18} />
        </button>
    );
};

export default ButtonAdd;
