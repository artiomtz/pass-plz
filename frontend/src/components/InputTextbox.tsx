interface InputTextboxProps {
    value: string;
    placeholder?: string;
    maxLength?: number;
    minRows?: number;
    maxRows?: number;
    onChange: (value: string) => void;
}

export const InputTextbox: React.FC<InputTextboxProps> = ({
    value,
    placeholder,
    maxLength,
    minRows = 4,
    maxRows = 10,
    onChange,
}) => {
    return (
        <textarea
            value={value}
            rows={minRows}
            maxLength={maxLength}
            placeholder={placeholder}
            className='border p-2 rounded shadow-lg w-full lg:w-[26rem]'
            onChange={(e) => onChange(e.target.value)}
            style={{
                resize: 'vertical',
                minHeight: `${minRows}em`,
                maxHeight: `${maxRows}em`,
                height: `${Math.floor((minRows + maxRows) / 2)}em`,
            }}
        />
    );
};
