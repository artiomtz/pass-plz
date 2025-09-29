import React from 'react';

interface EntryFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange: (_value: string) => void;
    value: string;
}

const InputField: React.FC<EntryFieldProps> = ({ className = '', onChange, value, ...props }) => {
    return (
        <input
            {...props}
            className={`border rounded shadow-lg p-2 px-3 w-full lg:w-[26rem] ${className}`}
            onChange={(e) => {
                return onChange(e.target.value);
            }}
            value={value}
        />
    );
};

export default InputField;
