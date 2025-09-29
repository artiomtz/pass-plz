import React from 'react';

interface SearchBarProps {
    onChange: (_value: string) => void;
    placeholder: string;
    value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange, placeholder = 'Search', value }) => {
    return (
        <div className='flex items-center gap-2 w-full'>
            <input
                className='border rounded shadow-lg p-2 w-full'
                maxLength={36}
                onChange={(e) => {
                    return onChange(e.target.value);
                }}
                placeholder={placeholder}
                value={value}
            />
        </div>
    );
};

export default SearchBar;
