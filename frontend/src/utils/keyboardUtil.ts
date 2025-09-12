export type KeyboardAction = 'select' | 'close' | null;

export const handleSuggestionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    highlightedIndex: number,
    listLength: number
): { newIndex: number; action: KeyboardAction } => {
    if (listLength === 0) return { newIndex: highlightedIndex, action: null };

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        return { newIndex: (highlightedIndex + 1) % listLength, action: null };
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        return {
            newIndex: highlightedIndex === 0 ? listLength - 1 : highlightedIndex - 1,
            action: null,
        };
    } else if (e.key === 'Enter') {
        e.preventDefault();
        return { newIndex: highlightedIndex, action: 'select' };
    } else if (e.key === 'Escape') {
        return { newIndex: highlightedIndex, action: 'close' };
    }

    return { newIndex: highlightedIndex, action: null };
};
