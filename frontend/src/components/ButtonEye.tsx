import { Eye, EyeOff } from 'lucide-react';

interface ButtonEyeProps {
    isVisible: boolean;
    onToggle: () => void;
}

const ButtonEye: React.FC<ButtonEyeProps> = ({ isVisible, onToggle }) => (
    <button
        type='button'
        onClick={onToggle}
        className='p-2 hover:bg-gray-100 rounded cursor-pointer'>
        {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
);

export default ButtonEye;
