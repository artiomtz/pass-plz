import { isExpired } from '@utils/dateUtil';

interface InputDateProps {
    onChange: (_value: string | null) => void;
    value: string | null;
}

const InputDate: React.FC<InputDateProps> = ({ onChange, value }) => {
    const localValue = value ? new Date(value).toISOString().slice(0, 10) : '';

    return (
        <input
            className={`border p-2 rounded shadow-lg w-full lg:w-[26rem]
                ${isExpired(value) ? 'border-red-500' : ''} ${!value ? 'text-gray-500' : ''}`}
            onChange={(e) => {
                if (!e.target.value) {
                    return onChange(null);
                }
                const utcDate = new Date(e.target.value + 'T00:00:00');
                onChange(utcDate.toISOString());
            }}
            type='date'
            value={localValue}
        />
    );
};

export default InputDate;
