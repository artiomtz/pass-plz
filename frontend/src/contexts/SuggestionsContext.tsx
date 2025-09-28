import PasswordEntry from '@models/passwordEntry';
import { createContext, useMemo } from 'react';

export interface SuggestionsContextType {
    categories: string[];
    tags: string[];
}

export const SuggestionsContext = createContext<SuggestionsContextType>({
    categories: [],
    tags: [],
});

const SuggestionsProvider: React.FC<{
    passwords: PasswordEntry[];
    children: React.ReactNode;
}> = ({ children, passwords }) => {
    const tags = useMemo(() => {
        return Array.from(
            new Set(
                passwords.flatMap((p) => {
                    return p.tags ?? [];
                })
            )
        );
    }, [passwords]);

    const categories = Array.from(
        new Set(
            passwords
                .map((p) => {
                    return p.category;
                })
                .filter((c): c is string => {
                    return Boolean(c);
                })
        )
    );

    const value = useMemo(() => {
        return { categories, tags };
    }, [tags, categories]);

    return <SuggestionsContext.Provider value={value}>{children}</SuggestionsContext.Provider>;
};

export default SuggestionsProvider;
