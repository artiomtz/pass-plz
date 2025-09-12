// import React from 'react';
import React, { useEffect, useRef } from 'react';

interface DropdownProps {
    suggestions: string[];
    highlightedIndex: number;
    onSelect: (value: string) => void;
    // inputValue: string;
    isOpen: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    suggestions,
    highlightedIndex,
    onSelect,
    // inputValue,
    isOpen,
}) => {
    const listRefs = useRef<(HTMLLIElement | null)[]>([]);

    // Auto-scroll highlighted item into view
    useEffect(() => {
        const el = listRefs.current[highlightedIndex];
        if (el) {
            el.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);
    if (!isOpen || suggestions.length === 0) return null;
    return (
        // const [highlightedIndex, setHighlightedIndex] = useState(0);
        // const listRef = useRef<HTMLUListElement>(null);

        // useEffect(() => {
        //     // setHighlightedIndex(0); // reset highlight when input changes
        // }, [inputValue]);

        // const handleKeyDown = (e: React.KeyboardEvent) => {
        //     if (!isOpen || suggestions.length === 0) return;

        //     if (e.key === 'ArrowDown') {
        //         e.preventDefault();
        //         setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
        //     } else if (e.key === 'ArrowUp') {
        //         e.preventDefault();
        //         setHighlightedIndex((prev) => (prev === 0 ? suggestions.length - 1 : prev - 1));
        //     } else if (e.key === 'Enter') {
        //         e.preventDefault();
        //         onSelect(suggestions[highlightedIndex]);
        //     }
        // };

        // return isOpen && suggestions.length > 0 ? (

        <div className='relative'>
            <ul
                role='listbox'
                // ref={listRef}
                className='absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto'
                // onKeyDown={handleKeyDown}
            >
                {suggestions.map((s, idx) => (
                    <li
                        key={s}
                        ref={(el) => {
                            listRefs.current[idx] = el;
                        }}
                        role='option'
                        //   role="option"
                        tabIndex={-1}
                        className={`px-3 py-2 cursor-pointer ${
                            idx === highlightedIndex
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100'
                        }`}
                        onMouseDown={() => onSelect(s)} // use onMouseDown so input doesn't lose focus
                    >
                        {s}
                    </li>
                ))}
            </ul>
        </div>
        //  : null
    );
};
