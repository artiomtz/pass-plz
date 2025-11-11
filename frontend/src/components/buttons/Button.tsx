import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    onClick: (..._args: any[]) => void;
    variant?: 'primary' | 'secondary' | 'info' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, className, disabled = false, onClick, variant = 'primary' }) => {
    const baseClassNameShape = 'flex items-center justify-center input-style w-auto h-12 min-w-[125px]';
    const baseClassNameStyle = 'gap-2 px-4 py-2 rounded-2xl shadow-xl font-medium transition';
    const baseClassName = `${baseClassNameShape} + ${baseClassNameStyle}`;

    const variants: Record<typeof variant, string> = {
        danger: 'button-danger-style',
        info: 'button-info-style',
        primary: 'button-primary-style',
        secondary: 'button-secondary-style',
    };

    return (
        <button
            className={`${baseClassName} ${className || ''} ${variants[variant]}
                ${disabled ? 'disabled-style' : 'cursor-pointer'}`}
            disabled={disabled}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
