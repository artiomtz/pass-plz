import { InputHTMLAttributes } from 'react';

interface InputFieldWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
}

const InputFieldWithLabel: React.FC<InputFieldWithLabelProps> = ({ id, label, ...props }) => (
    <div>
        <label
            className='mb-2 block'
            htmlFor={id}>
            {label}
        </label>
        <input
            className='block w-full p-3 shadow-xl rounded-xl input-style'
            id={id}
            maxLength={36}
            {...props}
        />
    </div>
);

export default InputFieldWithLabel;
