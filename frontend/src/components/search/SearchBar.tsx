import React from 'react';

interface SearchBarProps {
    onChange: (_value: string) => void;
    placeholder: string;
    value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange, placeholder = 'Search', value }) => (
    <div className='flex items-center w-full'>
        <input
            className='w-full h-12 p-2 rounded-xl shadow-xl input-style'
            maxLength={36}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            value={value}
        />
    </div>
);

export default SearchBar;
