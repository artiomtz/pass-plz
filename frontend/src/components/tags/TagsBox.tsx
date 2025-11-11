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
        <div className='flex flex-1 flex-col gap-2 border rounded-xl shadow-xl p-2 max-h-27 overflow-y-auto text-sm w-full input-style'>
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
                        {selectedTags.includes(tag) ? (
                            <SquareCheckBig
                                className='pill-style'
                                size={16}
                            />
                        ) : (
                            <Square
                                className='pill-style'
                                size={16}
                            />
                        )}
                        {tag}
                    </label>
                ))}
        </div>
    );
};

export default TagsBox;
