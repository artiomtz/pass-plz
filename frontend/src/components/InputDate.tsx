interface InputDateProps {
    value: string | null;
    // isExpired: boolean | null;
    onChange: (value: string | null) => void;
}

export const InputDate: React.FC<InputDateProps> = ({ value, onChange }) => {
    const localValue = value ? new Date(value).toISOString().slice(0, 10) : '';

    const isExpired =
        value && new Date(value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

    return (
        <input
            type='date'
            className={`border p-2 rounded shadow-lg w-full lg:w-[26rem] ${
                isExpired ? 'border-red-500' : ''
            }`}
            value={localValue}
            onChange={(e) => {
                if (!e.target.value) return onChange(null);
                const utcDate = new Date(e.target.value + 'T00:00:00');
                onChange(utcDate.toISOString());
            }}
        />
    );
};
