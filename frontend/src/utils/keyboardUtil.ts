export type KeyboardAction = 'select' | 'close' | null;

export const handleSuggestionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    highlightedIndex: number,
    listLength: number
): { newIndex: number; action: KeyboardAction } => {
    if (listLength === 0) {
        return { action: null, newIndex: highlightedIndex };
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();

        return { action: null, newIndex: (highlightedIndex + 1) % listLength };
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();

        return {
            action: null,
            newIndex: highlightedIndex === 0 ? listLength - 1 : highlightedIndex - 1,
        };
    } else if (e.key === 'Enter') {
        e.preventDefault();

        return { action: 'select', newIndex: highlightedIndex };
    } else if (e.key === 'Escape') {
        return { action: 'close', newIndex: highlightedIndex };
    }

    return { action: null, newIndex: highlightedIndex };
};
