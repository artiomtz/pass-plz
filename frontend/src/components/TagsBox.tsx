import { useSuggestions } from '@hooks/useSuggestions';

type TagsBoxProps = {
    // availableTags: string[];
    selectedTags: string[];
    onChange: (tags: string[]) => void;
};

// export const TagsBox: React.FC<TagsBoxProps> = ({ availableTags, selectedTags, onChange }) => {
export const TagsBox: React.FC<TagsBoxProps> = ({ selectedTags, onChange }) => {
    const { tags } = useSuggestions();

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter((t) => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    return (
        <div className='flex flex-1 flex-col gap-2 border rounded shadow-lg p-2 max-h-27 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 w-full'>
            {[...tags]
                .sort((a, b) => a.localeCompare(b))
                .map((tag) => (
                    <label key={tag} className='flex items-center gap-2 cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                        />
                        {tag}
                    </label>
                ))}
        </div>
    );
};

// export const TagsBox: React.FC<TagsBoxProps> = ({ availableTags, selectedTags, onChange }) => (
//     <select
//         multiple
//         value={selectedTags}
//         onChange={(e) => onChange(Array.from(e.target.selectedOptions, (opt) => opt.value))}
//         className='border rounded p-2 w-full min-h-[5rem]'>
//         {availableTags.map((tag) => (
//             <option key={tag} value={tag}>
//                 {tag}
//             </option>
//         ))}
//     </select>
// );

// import React from 'react';

// interface TagsBoxProps {
//     availableTags: string[];
//     selectedTags: string[];
//     onChange: (tags: string[]) => void;
// }

// export const TagsBox: React.FC<TagsBoxProps> = ({ availableTags, selectedTags, onChange }) => {
//     // const toggleTag = (tag: string) => {
//     //     if (selectedTags.includes(tag)) {
//     //         onChange(selectedTags.filter((t) => t !== tag));
//     //     } else {
//     //         onChange([...selectedTags, tag]);
//     //     }
//     // };

//     return (
//         <select
//             multiple
//             className='border rounded p-2 w-48'
//             value={selectedTags}
//             onChange={(e) => onChange(Array.from(e.target.selectedOptions, (opt) => opt.value))}>
//             {availableTags.map((tag) => (
//                 <option key={tag} value={tag}>
//                     {tag}
//                 </option>
//             ))}
//         </select>
//     );
// };
