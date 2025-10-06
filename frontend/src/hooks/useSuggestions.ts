import { SuggestionsContext, SuggestionsContextType } from '@contexts/SuggestionsContext';
import logger from '@utils/loggerUtil';
import { useContext } from 'react';
import toast from 'react-hot-toast';

const useSuggestions = (): SuggestionsContextType => {
    const context = useContext(SuggestionsContext);
    if (!context) {
        logger.error('failed to fetch suggestions context');
        toast.error('Failed to fetch suggestions');
        throw new Error('useSuggestions must be used within an SuggestionsProvider');
    }

    return context;
};

export default useSuggestions;
