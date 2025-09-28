import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    onClick: (..._args: any[]) => void;
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, className, disabled = false, onClick, variant = 'primary' }) => {
    const baseClassNameShape = 'flex items-center justify-center border w-auto h-12 min-w-[125px]';
    const baseClassNameStyle = 'gap-2 px-4 py-2 rounded-4xl shadow-xl font-medium transition '; // w-full?
    const baseClassName = `${baseClassNameShape} + ${baseClassNameStyle}`;

    const variants: Record<typeof variant, string> = {
        danger: 'bg-red-500 text-white hover:bg-red-600',
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-green-200 text-gray-800 hover:bg-gray-300',
    };

    return (
        <button
            className={`${baseClassName} ${variants[variant]} ${
                disabled ? 'bg-gray-400 hover:bg-gray-400 text-white opacity-50' : 'cursor-pointer'
            } ${className || ''}`}
            disabled={disabled}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
