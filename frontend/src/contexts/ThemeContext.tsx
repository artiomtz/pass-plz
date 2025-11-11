import logger from '@utils/loggerUtil';
import { getTheme, setTheme } from '@utils/storageUtil';
import { createContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

export interface ThemeContextType {
    appTheme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const THEME_ATTRIBUTE = 'data-theme';
    const [appTheme, setAppTheme] = useState<Theme>('dark');

    useEffect(() => {
        const saved = (getTheme() as 'light' | 'dark') || null;
        if (saved) {
            setAppTheme(saved);
            document.documentElement.setAttribute(THEME_ATTRIBUTE, saved);
            logger.info(`successfully loaded saved ${saved} theme`);
        } else {
            try {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const defaultTheme = prefersDark ? 'dark' : 'light';
                logger.info(`setting ${defaultTheme} theme`);

                setAppTheme(defaultTheme);
                document.documentElement.setAttribute(THEME_ATTRIBUTE, defaultTheme);
            } catch (error) {
                logger.warn('failed to get system theme', error);
                setAppTheme('dark');
                document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
            }
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = appTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setAppTheme(newTheme);
        document.documentElement.setAttribute(THEME_ATTRIBUTE, newTheme);
    };

    const contextValue = useMemo(() => ({ appTheme: appTheme, toggleTheme }), [appTheme]);

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
