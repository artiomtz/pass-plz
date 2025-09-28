import PasswordEntry from '@models/passwordEntry';

export type SortBy = 'name' | 'category' | 'createdDate' | 'updatedDate';
export type SortOrder = 'asc' | 'desc';

export const filterAndSortEntries = (
    entries: PasswordEntry[],
    searchTerm: string,
    selectedTags: string[],
    sortBy: SortBy,
    sortOrder: SortOrder
): PasswordEntry[] => {
    let filtered = entries;

    if (searchTerm?.trim()) {
        const lower = searchTerm.toLowerCase();
        filtered = filtered.filter((entry) =>
            Object.values(entry).some((val) =>
                String(val ?? '')
                    .toLowerCase()
                    .includes(lower)
            )
        );
    }

    if (selectedTags.length > 0) {
        filtered = filtered.filter((entry) => entry.tags?.some((tag) => selectedTags.includes(tag)));
    }

    filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortBy] ?? '';
        const bVal = b[sortBy] ?? '';

        let primary = 0;
        if (aVal < bVal) {
            primary = -1;
        } else if (aVal > bVal) {
            primary = 1;
        }

        if (primary === 0) {
            primary = a.name.localeCompare(b.name);
        }

        return sortOrder === 'asc' ? primary : -primary;
    });

    return filtered;
};
