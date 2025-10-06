import useSuggestions from '@hooks/useSuggestions';

type TagsBoxProps = {
    selectedTags: string[];
    onChange: (_tags: string[]) => void;
};

const TagsBox: React.FC<TagsBoxProps> = ({ onChange, selectedTags }) => {
    const { tags } = useSuggestions();

    const toggleTag = (tag: string): void => {
        if (selectedTags.includes(tag)) {
            onChange(
                selectedTags.filter((t) => {
                    return t !== tag;
                })
            );
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    return (
        <div className='flex flex-1 flex-col gap-2 border rounded shadow-lg p-2 max-h-27 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 w-full'>
            {[...tags]
                .sort((a, b) => {
                    return a.localeCompare(b);
                })
                .map((tag) => {
                    return (
                        <label
                            className='flex items-center gap-2 cursor-pointer'
                            key={tag}>
                            <input
                                checked={selectedTags.includes(tag)}
                                onChange={() => {
                                    return toggleTag(tag);
                                }}
                                type='checkbox'
                            />
                            {tag}
                        </label>
                    );
                })}
        </div>
    );
};

export default TagsBox;
