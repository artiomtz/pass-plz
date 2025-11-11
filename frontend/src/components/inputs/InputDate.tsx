import { isExpired, toUtcIsoDate } from '@utils/dateUtil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface InputDateProps {
    onChange: (_value: string | null) => void;
    placeholder: string;
    value: string | null;
}

const InputDate: React.FC<InputDateProps> = ({ onChange, placeholder, value }) => {
    const selectedDate = value ? new Date(value) : null;

    return (
        <div className='w-full lg:w-auto'>
            <DatePicker
                className={`input-style p-2 rounded-xl shadow-xl w-full lg:w-[26rem] ${
                    isExpired(value) ? 'warning-style' : ''
                }`}
                dateFormat='dd-MMM-yyyy'
                onChange={(date) => onChange(toUtcIsoDate(date))}
                placeholderText={placeholder}
                selected={selectedDate}
            />
        </div>
    );
};

export default InputDate;
