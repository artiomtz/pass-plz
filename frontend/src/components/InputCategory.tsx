import Dropdown from '@components/Dropdown';
import InputField from '@components/InputField';
import { handleSuggestionKeyDown } from '@utils/keyboardUtil';
import React, { useState } from 'react';

interface InputCategoryProps {
    onChange: (_val: string) => void;
    suggestions?: string[];
    value: string;
}

const InputCategory: React.FC<InputCategoryProps> = ({ onChange, suggestions = [], value }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const filtered = value
        ? suggestions.filter((s) => {
              return s.toLowerCase().includes(value.toLowerCase());
          })
        : [];

    const handleSelect = (value: string) => {
        onChange(value);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { action, newIndex } = handleSuggestionKeyDown(e, highlightedIndex, filtered.length);
        setHighlightedIndex(newIndex);

        if (action === 'select') {
            handleSelect(filtered[newIndex]);
        } else if (action === 'close') {
            setIsOpen(false);
        }
    };

    return (
        <div className='w-full'>
            <InputField
                maxLength={16}
                onBlur={() => {
                    return setTimeout(() => {
                        return setIsOpen(false);
                    }, 200);
                }}
                onChange={(val) => {
                    onChange(val);
                    setIsOpen(true);
                    setHighlightedIndex(0);
                }}
                onFocus={() => {
                    return setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder='i.e. Work, Travel'
                value={value}
            />

            <Dropdown
                highlightedIndex={highlightedIndex}
                isOpen={isOpen}
                onSelect={handleSelect}
                suggestions={filtered}
            />
        </div>
    );
};
export default InputCategory;
