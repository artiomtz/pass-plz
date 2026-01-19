import { isExpired, toUtcIsoDate } from '@utils/dateUtil';
import { scaleMotionProps } from '@utils/motionUtil';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
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
                calendarContainer={({ children, className }) => (
                    <AnimatePresence mode='wait'>
                        <motion.div
                            className={className}
                            key='datepicker'
                            {...scaleMotionProps}>
                            {children}
                        </motion.div>
                    </AnimatePresence>
                )}
                className={`w-full lg:w-[26rem] p-2 rounded-xl shadow-xl input-style ${
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
