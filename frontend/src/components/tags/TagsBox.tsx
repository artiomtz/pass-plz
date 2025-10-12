import useSuggestions from '@hooks/useSuggestions';
import { Square, SquareCheckBig } from 'lucide-react';

type TagsBoxProps = {
    selectedTags: string[];
    onChange: (_tags: string[]) => void;
};

const TagsBox: React.FC<TagsBoxProps> = ({ onChange, selectedTags }) => {
    const { tags } = useSuggestions();

    const toggleTag = (tag: string): void => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter((t) => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    return (
        // scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400
        <div className='flex flex-1 flex-col gap-2 border rounded-xl shadow-xl p-2 max-h-27 overflow-y-auto text-sm w-full popup'>
            {[...tags]
                .sort((a, b) => a.localeCompare(b))
                .map((tag) => (
                    <label
                        className='flex items-center gap-2 cursor-pointer ps-1'
                        key={tag}>
                        <input
                            checked={selectedTags.includes(tag)}
                            className='sr-only'
                            onChange={() => toggleTag(tag)}
                            type='checkbox'
                        />
                        {/* <div className='w-5 h-5 flex items-center justify-center border rounded-sm bg-white'> */}
                        {selectedTags.includes(tag) ? (
                            <SquareCheckBig
                                className='text-blue-600'
                                size={16}
                            />
                        ) : (
                            <Square
                                className='text-gray-400'
                                size={16}
                            />
                        )}
                        {/* </div> */}
                        {tag}
                    </label>
                ))}
        </div>
    );
};

export default TagsBox;
