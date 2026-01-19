interface InputTextboxProps {
    maxLength?: number;
    maxRows?: number;
    minRows?: number;
    onChange: (_value: string) => void;
    placeholder?: string;
    value: string;
}

const InputTextbox: React.FC<InputTextboxProps> = ({
    maxLength,
    maxRows = 10,
    minRows = 4,
    onChange,
    placeholder,
    value,
}) => (
    <textarea
        className='w-full lg:w-[26rem] p-2 px-3 rounded-xl shadow-xl input-style'
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        style={{
            height: `${Math.floor((minRows + maxRows) / 2)}em`,
            maxHeight: `${maxRows}em`,
            minHeight: `${minRows}em`,
            resize: 'vertical',
        }}
        value={value}
    />
);

export default InputTextbox;
