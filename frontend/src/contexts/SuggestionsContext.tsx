import { PasswordEntry } from '@models/passwordEntry';
import { createContext, useMemo } from 'react';

export interface SuggestionsContextType {
    tags: string[];
    categories: string[];
}

export const SuggestionsContext = createContext<SuggestionsContextType>({
    tags: [],
    categories: [],
});

export const SuggestionsProvider: React.FC<{
    passwords: PasswordEntry[];
    children: React.ReactNode;
}> = ({ passwords, children }) => {
    const tags = useMemo(
        () => Array.from(new Set(passwords.flatMap((p) => p.tags ?? []))),
        [passwords]
    );

    const categories = Array.from(
        new Set(passwords.map((p) => p.category).filter((c): c is string => Boolean(c)))
    );

    const value = useMemo(() => ({ tags, categories }), [tags, categories]);

    return <SuggestionsContext.Provider value={value}>{children}</SuggestionsContext.Provider>;

    // return (
    //     <SuggestionsContext.Provider value={{ tags, categories }}>
    //         {children}
    //     </SuggestionsContext.Provider>
    // );
};
