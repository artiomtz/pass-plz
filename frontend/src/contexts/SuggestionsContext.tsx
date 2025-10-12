import PasswordEntry from '@models/passwordEntry';
import { createContext, useMemo } from 'react';

export interface SuggestionsContextType {
    categories: string[];
    tags: string[];
}

export const SuggestionsContext = createContext<SuggestionsContextType | null>({
    categories: [],
    tags: [],
});

const SuggestionsProvider: React.FC<{
    passwords: PasswordEntry[];
    children: React.ReactNode;
}> = ({ children, passwords }) => {
    const tags = useMemo(() => Array.from(new Set(passwords.flatMap((p) => p.tags ?? []))), [passwords]);
    const categories = Array.from(new Set(passwords.map((p) => p.category).filter((c): c is string => Boolean(c))));

    const value = useMemo(() => ({ categories, tags }), [tags, categories]);

    return <SuggestionsContext.Provider value={value}>{children}</SuggestionsContext.Provider>;
};

export default SuggestionsProvider;
