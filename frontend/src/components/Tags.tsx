import React from 'react';

interface TagsProps {
    onRemove: (_tag: string) => void;
    tags: string[];
}

const Tags: React.FC<TagsProps> = ({ onRemove, tags }) => {
    const safeTags = Array.isArray(tags) ? tags : [];

    return (
        <div className='flex gap-1 flex-wrap lg:ml-[160px]'>
            {safeTags.map((tag) => {
                return (
                    <span
                        className='bg-gray-200 px-2 py-0.5 rounded-full text-xs cursor-pointer hover:bg-red-200'
                        key={tag}
                        onClick={() => {
                            return onRemove(tag);
                        }}
                        title='Delete'>
                        {tag}
                    </span>
                );
            })}
        </div>
    );
};

export default Tags;
