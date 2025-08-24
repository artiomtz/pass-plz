import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    // variant?: 'primary' | 'secondary' | 'danger' | 'disabled';
    onClick: (...args: any[]) => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    disabled = false,
    variant = 'primary',
    className,
}) => {
    const baseClassName =
        'flex items-center border gap-2 px-4 py-2 rounded-4xl shadow-xl font-medium transition w-auto h-12'; // w-full?
    const variants: Record<typeof variant, string> = {
        primary: 'cursor-pointer bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'cursor-pointer bg-green-200 text-gray-800 hover:bg-gray-300',
        danger: 'cursor-pointer bg-red-500 text-white hover:bg-red-600',
        // disabled: 'cursor-not-allowed bg-gray-400 text-white opacity-50',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClassName} ${variants[variant]} ${
                disabled ? 'cursor-not-allowed bg-gray-400 text-white opacity-50 ' : ''
            } ${className || ''}`}
            // className={`flex items-center gap-2 rounded-4xl px-6 py-3 shadow-xl transition ${
            //     disabled
            //         ? 'cursor-not-allowed bg-gray-400 text-white'
            //         : 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700'
            // } w-full sm:w-auto`}
            // className='w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-2xl border shadow-xl transition cursor-pointer hover:bg-gray-200 border-zinc-400'
        >
            {children}
        </button>
        // <button className='bg-blue-500 text-white p-2 rounded-md' onClick={onClick}>
        //     {children}
        // </button>
    );
};

export default Button;
