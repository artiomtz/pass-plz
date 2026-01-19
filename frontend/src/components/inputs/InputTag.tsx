import Dropdown from '@components/Dropdown';
import InputField from '@components/inputs/InputField';
import { handleSuggestionKeyDown } from '@utils/keyboardUtil';
import { descendMotionProps } from '@utils/motionUtil';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

interface InputTagProps {
    limit?: number;
    onChange: (_value: string) => void;
    suggestions?: string[];
    value: string;
}

const InputTag: React.FC<InputTagProps> = ({ limit = 5, onChange, suggestions = [], value }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const filtered = value ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())) : [];

    const handleSelect = (value: string): void => {
        onChange(value);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        const { action, newIndex } = handleSuggestionKeyDown(e, highlightedIndex, filtered.length);
        setHighlightedIndex(newIndex);

        if (action === 'select') {
            handleSelect(filtered[newIndex]);
        } else if (action === 'close') {
            setIsOpen(false);
        }
    };

    return (
        <div className='w-full lg:w-auto'>
            <InputField
                maxLength={16}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                onChange={(value) => {
                    onChange(value);
                    setIsOpen(value.length > 0);
                    setHighlightedIndex(0);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={`Add up to ${limit} tags`}
                value={value}
            />
            <AnimatePresence initial={false}>
                {isOpen && filtered.length > 0 && (
                    <motion.div
                        key='dropdown-tags'
                        {...descendMotionProps}>
                        <Dropdown
                            highlightedIndex={highlightedIndex}
                            isOpen={isOpen}
                            onSelect={handleSelect}
                            suggestions={filtered}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InputTag;
