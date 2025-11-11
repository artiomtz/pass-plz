import { Plus } from 'lucide-react';

interface ButtonAddProps {
    disabled: boolean;
    onClick: () => void;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({ disabled = false, onClick }) => (
    <button
        className={`p-2 rounded-lg transition icon-style ${disabled ? 'disabled-style' : 'hover-style'}`}
        disabled={disabled}
        onClick={onClick}
        type='button'>
        <Plus size={18} />
    </button>
);

export default ButtonAdd;
