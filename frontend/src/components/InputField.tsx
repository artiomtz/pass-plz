import React from 'react';

interface EntryFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

const InputField: React.FC<EntryFieldProps> = ({ value, onChange, className = '', ...props }) => {
    return (
        <input
            {...props} // supports maxLength, placeholder, type="password", etc.
            // className='border rounded p-2 min-w-[160px] flex-grow'
            // className='border p-2 rounded w-110'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`border rounded shadow-lg p-2 w-full lg:w-[26rem] ${className}`}
        />
    );
};

export default InputField;
