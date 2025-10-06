import React, { useEffect, useRef } from 'react';

interface DropdownProps {
    highlightedIndex: number;
    isOpen: boolean;
    onSelect: (_value: string) => void;
    suggestions: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ highlightedIndex, isOpen, onSelect, suggestions }) => {
    const listRefs = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        const el = listRefs.current[highlightedIndex];
        if (el) {
            el.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    if (!isOpen || suggestions.length === 0) {
        return null;
    }

    return (
        <div className='relative'>
            <ul
                className='absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto'
                role='listbox'>
                {suggestions.map((s, idx) => {
                    return (
                        <li
                            className={`px-3 py-2 cursor-pointer ${
                                idx === highlightedIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                            }`}
                            key={s}
                            onMouseDown={() => {
                                return onSelect(s);
                            }}
                            ref={(el) => {
                                listRefs.current[idx] = el;
                            }}
                            role='option'
                            tabIndex={-1}>
                            {s}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Dropdown;
