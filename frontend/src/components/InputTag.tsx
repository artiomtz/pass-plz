import { Dropdown } from '@components/Dropdown';
import InputField from '@components/InputField';
import { handleSuggestionKeyDown } from '@utils/keyboardUtil';
import React, { useState } from 'react';

interface InputTagProps {
    value: string;
    onChange: (value: string) => void;
    // onAdd: () => void;
    suggestions?: string[];
    limit?: number;
}

export const InputTag: React.FC<InputTagProps> = ({
    value,
    onChange,
    // onAdd,
    suggestions = [],
    limit = 5,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    // const listRefs = useRef<(HTMLLIElement | null)[]>([]);

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
        // const el = listRefs.current[newIndex];
        // if (el) {
        //     el.scrollIntoView({ block: 'nearest' });
        // }
    };

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (!isOpen || filtered.length === 0) return;

    //     if (e.key === 'ArrowDown') {
    //         e.preventDefault();
    //         setHighlightedIndex((prev) => (prev + 1) % filtered.length);
    //     } else if (e.key === 'ArrowUp') {
    //         e.preventDefault();
    //         setHighlightedIndex((prev) => (prev === 0 ? filtered.length - 1 : prev - 1));
    //     } else if (e.key === 'Enter') {
    //         e.preventDefault();
    //         handleSelect(filtered[highlightedIndex]);
    //     } else if (e.key === 'Escape') {
    //         setIsOpen(false);
    //     }
    // };

    return (
        <div
        // className='relative w-full'
        >
            <InputField
                maxLength={16}
                value={value}
                placeholder={`Add up to ${limit} tags`}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                onChange={(value) => {
                    onChange(value);
                    setIsOpen(true);
                    setHighlightedIndex(0);
                }}
                // onKeyDown={(e) => {
                //     if (e.key === 'Escape') setIsOpen(false);
                // }}
                onKeyDown={handleKeyDown}
                // className='w-full border rounded px-3 py-2'
                // onKeyDown={(e) => {
                //     if (e.key === 'Enter') {
                //         e.preventDefault();
                //         onAdd();
                //     }
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
            {/* </div> */}
        </div>
    );
};
// export default InputWithSuggestions;
