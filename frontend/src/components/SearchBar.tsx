import React from 'react';
// import Button from './Button';
// import Spinner from '@components/Spinner'; // Reusable loading spinner component

interface SearchBarProps {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = 'Search',
}) => {
    return (
        <div className='flex items-center gap-2 w-full'>
            <input
                value={value}
                maxLength={32}
                placeholder={placeholder}
                className='border rounded shadow-lg p-2 w-full'
                onChange={(e) => onChange(e.target.value)}
                //  w-full lg:w-[26rem]
            />
            {/* <Button
                variant='secondary'
                disabled={value.trim() === ''}
                onClick={() => onChange(value)}>
                Find
            </Button> */}
        </div>
    );
};
