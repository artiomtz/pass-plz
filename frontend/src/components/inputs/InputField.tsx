import React from 'react';

interface EntryFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange: (_value: string) => void;
    value: string;
}

const InputField: React.FC<EntryFieldProps> = ({ className = '', onChange, value, ...props }) => (
    <input
        {...props}
        className={`w-full lg:w-[26rem] p-2 px-3 rounded-xl shadow-xl input-style ${className}`}
        onChange={(e) => onChange(e.target.value)}
        value={value}
    />
);

export default InputField;
