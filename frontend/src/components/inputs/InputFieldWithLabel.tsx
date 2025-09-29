import { InputHTMLAttributes } from 'react';

interface InputFieldWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
}

const InputFieldWithLabel: React.FC<InputFieldWithLabelProps> = ({ id, label, ...props }) => {
    return (
        <div>
            <label
                className='mb-2 block text-gray-900'
                htmlFor={id}>
                {label}
            </label>
            <input
                className='block w-full rounded-2xl border border-gray-300 bg-gray-50 p-3 text-gray-500 shadow-lg focus:outline-zinc-400'
                id={id}
                maxLength={36}
                {...props}
            />
        </div>
    );
};

export default InputFieldWithLabel;
