import React from 'react';

interface TagsProps {
    tags: string[];
    onRemove: (tag: string) => void;
}

export const Tags: React.FC<TagsProps> = ({ tags, onRemove }) => {
    const safeTags = Array.isArray(tags) ? tags : [];

    return (
        <div className='flex gap-1 flex-wrap lg:ml-[160px]'>
            {safeTags.map((tag) => (
                <span
                    key={tag}
                    title='Delete'
                    onClick={() => onRemove(tag)}
                    className='bg-gray-200 px-2 py-0.5 rounded-full text-xs cursor-pointer hover:bg-red-200'>
                    {tag}
                </span>
            ))}
        </div>
    );
};
