import { Dropdown } from '@components/Dropdown';
import InputField from '@components/InputField';
import { handleSuggestionKeyDown } from '@utils/keyboardUtil';
import React, { useState } from 'react';

interface InputCategoryProps {
    value: string;
    onChange: (val: string) => void;
    suggestions?: string[];
}

export const InputCategory: React.FC<InputCategoryProps> = ({
    value,
    onChange,
    suggestions = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const filtered = value
        ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
        : [];

    const handleSelect = (value: string) => {
        // setValue(value);
        onChange(value);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { newIndex, action } = handleSuggestionKeyDown(e, highlightedIndex, filtered.length);
        setHighlightedIndex(newIndex);

        if (action === 'select') {
            handleSelect(filtered[newIndex]);
        } else if (action === 'close') {
            setIsOpen(false);
        }
    };

    return (
        <div>
            <InputField
                maxLength={16}
                value={value}
                placeholder='i.e. Work, Travel'
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                onChange={(val) => {
                    onChange(val);
                    setIsOpen(true);
                    setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                // onKeyDown={(e) => {
                //     if (e.key === 'Escape') setIsOpen(false);
                // }}
            />

            {/* <div className='relative'> */}
            <Dropdown
                isOpen={isOpen}
                // inputValue={value}
                suggestions={filtered}
                onSelect={handleSelect}
                highlightedIndex={highlightedIndex}
            />
            {/* </div> */}

            {/* {open && filtered.length > 0 && (
                <ul
                    role='listbox'
                    className='absolute left-0 right-0 bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg z-10'>
                    {filtered.map((s) => (
                        <li
                            key={s}
                            role='option'
                            onMouseDown={() => {
                                onChange(s);
                                setOpen(false);
                            }}
                            className='px-3 py-2 hover:bg-gray-100 cursor-pointer'>
                            {s}
                        </li>
                    ))}
                </ul>
            )} */}
        </div>
    );
};
