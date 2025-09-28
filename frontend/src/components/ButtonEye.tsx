import { Eye, EyeOff } from 'lucide-react';

interface ButtonEyeProps {
    isVisible: boolean;
    onToggle: () => void;
}

const ButtonEye: React.FC<ButtonEyeProps> = ({ isVisible, onToggle }) => {
    return (
        <button
            className='p-2 hover:bg-gray-100 rounded cursor-pointer'
            onClick={onToggle}
            type='button'>
            {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
    );
};

export default ButtonEye;
