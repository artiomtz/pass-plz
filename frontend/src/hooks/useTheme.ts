import { ThemeContext, ThemeContextType } from '@contexts/ThemeContext';
import logger from '@utils/loggerUtil';
import { useContext } from 'react';
import toast from 'react-hot-toast';

const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        logger.error('failed to fetch theme context');
        toast.error('Failed to fetch themes');
        throw new Error('useTheme must be used within an ThemeProvider');
    }

    return context;
};

export default useTheme;
